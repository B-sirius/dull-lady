import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux';
import Node from 'components/Node';
import { UPDATE_DATA, UPDATE_FOCUSED_NODE, REMOVE_REQUEST, SAVED, UNSAVED, updateCursor, updateUser, updateNetworkCondition } from 'actions';
import fetchWrapper from 'utils/fetchWrapper';
import uuidv1 from 'uuid/v1';
import backend from 'backend';
import styles from './Main.module.css';
import history from 'utils/history';

let isRequestQueueProcessing = false

class Main extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    contentData: PropTypes.object,
    cursorPosition: PropTypes.object,
    focusedNode: PropTypes.object,
    requestQueue: PropTypes.array,
    userInfo: PropTypes.object,
    networkCondition: PropTypes.object
  }

  componentDidMount() {
    this.init();
  }

  async componentDidUpdate(prevProps) {
    const { cursorPosition, dispatch, networkCondition, contentData } = this.props;
    // 更新光标位置
    if (cursorPosition.needUpdate) dispatch(updateCursor());
    // 控制请求队列
    if (this.props.requestQueue !== prevProps.requestQueue && !isRequestQueueProcessing) {
      this.handleRequestQueue();
    }
    // 离线->在线
    if (networkCondition.isOnline && !prevProps.networkCondition.isOnline) {
      this.handleOffline2Online();
    }
    // 记录是否有未保存更新
    if (contentData.nodes !== prevProps.contentData.nodes) {
      this.props.dispatch({
        type: UNSAVED,
      });
    }
  }

  handleOffline2Online = async () => {
    const { contentData, userInfo } = this.props;
    const local = JSON.parse(localStorage.getItem('localData'));
    const { err, res } = await fetchWrapper(backend.getUpdatedTime());
    if (err) throw err;
    const remoteDate = new Date(res.data.date);
    const localDate = new Date(local.localUpdatedTime);
    // 远端记录与本地记录比较
    if (remoteDate - localDate > 0) {
      // 远程同步本地
      this.initNodes();
    }
    else {
      // 同步远程
      const { error } = await fetchWrapper(backend.pushLocalData({ contentData }));
      if (error) throw error;
    }
  }

  handleRequestQueue = async () => {
    const { requestQueue } = this.props;
    if (requestQueue.length > 0) {
      isRequestQueueProcessing = true;

      const { request, args } = requestQueue[0];
      const { error } = await fetchWrapper(request(args));
      if (error) throw error;

      isRequestQueueProcessing = false;
      this.props.dispatch({
        type: REMOVE_REQUEST,
      });
      return;
    }
    // 记录数据已同步
    this.props.dispatch({
      type: SAVED,
    });
  }

  // 初始化用户
  initUser = async () => {
    let username;
    const { error, res } = await fetchWrapper(backend.getUser());
    // 网络请求错误
    if (error) {
      let localData = localStorage.getItem('localData');
      if (!localData) history.push('/login');
      else {
        localData = JSON.parse(localData);
        username = localData.username;
        this.props.dispatch(updateUser({ username }))
      };
    }
    // 不符合的登录状况
    else if (!!res && res.data.code !== 200) {
      history.push('/login');
      return;
    }
    // 成功登陆
    else {
      username = res.data.username;
    }
    this.props.dispatch(updateUser({ username }))();
  }

  // 初始化节点
  initNodes = async () => {
    // 离线
    if (!this.props.networkCondition.isOnline) {
      let localData = localStorage.getItem('localData');
      const { nodes } = JSON.parse(localData);
      let root;
      for (let key of Object.keys(nodes)) {
        const node = nodes[key];
        if (node.isRoot) {
          root = node;
          break;
        }
      }
      this.props.dispatch({
        type: UPDATE_DATA,
        payload: {
          path: [root.id],
          rootId: root.id,
          nodes
        }
      });
      this.props.dispatch({
        type: SAVED,
      });
    }
    // 在线
    else {
      // 获得所有节点
      console.log('before', this.props.contentData.nodes);
      const { error, res } = await fetchWrapper(backend.getAllNodes());
      if (error) throw error;
      const { nodes } = res.data;
      // 没有节点，则需要初始root
      if (!nodes.length) {
        const rootId = uuidv1();
        const cal2 = await fetchWrapper(backend.initRoot({ id: rootId }));
        if (cal2.error) throw cal2.error;
        const { node } = cal2.res.data;
        nodes.push(node);
      }
      // 获取root
      const cal3 = await fetchWrapper(backend.getRoot());
      if (cal3.error) throw cal3.error;
      const root = cal3.res.data.node[0];
      if (!root) throw new Error({ logMsg: '找不到父节点' });
      // 初始化前端使用的节点数据结构
      const nodesMap = {};
      for (let item of nodes) {
        nodesMap[item.id] = item;
      }
      this.props.dispatch({
        type: UPDATE_DATA,
        payload: {
          path: [root.id],
          rootId: root.id,
          nodes: nodesMap
        }
      });
      this.props.dispatch({
        type: SAVED,
      });
    }
  }

  initUnloadWarning = () => {
    window.addEventListener('beforeunload', e => {
      const { unsavedChange } = this.props;
      if (!unsavedChange.isSaved) {
        e.returnValue = '尚有未保存内容，确定要退出么？';
      }
    });
  }

  init = async () => {
    window.addEventListener('offline', () => {
      this.dispatch(updateNetworkCondition({ isOnline: false }))
    });
    window.addEventListener('online', () => {
      this.dispatch(updateNetworkCondition({ isOnline: true }))
    });
    await this.initUser();
    await this.initNodes();
    this.initUnloadWarning();
  }

  blurFocus = e => {
    this.props.dispatch({
      type: UPDATE_FOCUSED_NODE,
      payload: {
        currId: null
      }
    });
  }

  render() {
    const {
      contentData,
    } = this.props;
    const { blurFocus } = this;
    const { rootId, nodes } = contentData;
    if (Object.keys(nodes).length === 0)
      return <div className={styles.container}></div>;
    else
      return (
        <div
          className={styles.container}
          onClick={blurFocus}
        >
          {
            !!nodes[rootId].children &&
            nodes[rootId].children.map(nodeId => (
              <Node
                key={nodeId}
                node={nodes[nodeId]}
              />
            ))
          }
        </div>
      );
  }
}

export default connect(
  ({ contentData, cursorPosition, focusedNode, requestQueue, userInfo, networkCondition, unsavedChange }) => ({
    contentData,
    cursorPosition,
    focusedNode,
    requestQueue,
    userInfo,
    networkCondition,
    unsavedChange
  }),
  dispatch => ({ dispatch })
)(Main)