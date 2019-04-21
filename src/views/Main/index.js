import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux';
import Node from 'components/Node';
import { UPDATE_DATA, UPDATE_FOCUSED_NODE, UPDATE_REQUEST_QUEUE, updateCursor } from 'actions';
import fetchWrapper from 'utils/fetchWrapper';
import uuidv1 from 'uuid/v1';
import backend from 'backend';
import styles from './Main.module.css';

class Main extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    contentData: PropTypes.object,
    cursorPosition: PropTypes.object,
    focusedNode: PropTypes.object,
    requestQueue: PropTypes.array,
    networkCondition: PropTypes.object
  }

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps) {
    const { cursorPosition, dispatch } = this.props;
    // 更新光标位置
    if (cursorPosition.needUpdate) dispatch(updateCursor());
    // 控制请求队列
    if (this.props.requestQueue !== prevProps.requestQueue) {
      this.handleRequestQueue();
    }
  }

  handleRequestQueue = async () => {
    const { requestQueue } = this.props;
    if (requestQueue.length > 0) {
      const { request, args } = requestQueue[0];
      const { error } = await fetchWrapper(request(args));
      if (error) throw error;
      this.props.dispatch({
        type: UPDATE_REQUEST_QUEUE,
        payload: [...requestQueue.slice(1)]
      })
    }
  }

  init = async () => {
    // 获得所有节点
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
    })
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
  ({ contentData, cursorPosition, focusedNode, requestQueue, networkCondition }) => ({
    contentData,
    cursorPosition,
    focusedNode,
    requestQueue,
    networkCondition
  }),
  dispatch => ({ dispatch })
)(Main)