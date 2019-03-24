import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { UPDATE_DATA, UPDATE_CURSOR } from 'actions';
import uuidv1 from 'uuid/v1';
import TextBlock from 'components/TextBlock';
import styles from './Node.module.css';

class Node extends PureComponent {
  static propTypes = {
    node: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
    contentData: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      collapsed: false
    }
  }

  // 切换子节点展开、收起
  toggleSwitch = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed: !collapsed
    })
  }

  // 处理节点文本变化
  handleContentChange = id => e => {
    const { value } = e.target;
    const { nodes, rootId } = this.props.contentData;
    this.props.dispatch({
      type: UPDATE_DATA,
      payload: {
        rootId,
        nodes: {
          ...nodes,
          [id]: {
            ...nodes[id],
            content: value
          }
        }
      }
    });
  }

  // 处理回车，将分割内容并创建新节点
  handleEnter = id => splitedString => {
    const { contentData } = this.props;
    const { nodes, rootId } = contentData;
    const newId = uuidv1();
    const parentId = nodes[id].parent;
    // 找出node在parent.children里的index，以插入新的node
    const nodeIndex = nodes[parentId].children.indexOf(id);
    if (nodeIndex === -1) {
      console.error(`未在${parentId}中找到子节点${id}`);
      return false;
    }
    this.props.dispatch({
      type: UPDATE_DATA,
      payload: {
        rootId,
        nodes: {
          ...nodes,
          [parentId]: {
            ...nodes[parentId],
            children: [
              ...nodes[parentId].children.slice(0, nodeIndex + 1),
              newId,
              ...nodes[parentId].children.slice(nodeIndex + 1),
            ]
          },
          [id]: {
            ...nodes[id],
            content: splitedString[0]
          },
          [newId]: {
            id: newId,
            content: splitedString[1],
            parent: parentId
          }
        }
      }
    });
    // 通知更新光标位置
    this.props.dispatch({
      type: UPDATE_CURSOR,
      payload: {
        needUpdate: true,
        id: newId,
        position: 0
      }
    })
  }

  // 处理退格造成的节点合并
  handleMergeNode = id => text => {
    const { contentData } = this.props;
    const { nodes, rootId } = contentData;
    const parentId = nodes[id].parent;
    // 找出node在parent.children里的index
    const nodeIndex = nodes[parentId].children.indexOf(id);
    // debugger;
    if (nodeIndex === -1) {
      console.error(`未在${parentId}中找到子节点${id}`);
      return false;
    }
    // 如果是父节点中的第一个节点，不作处理
    if (nodeIndex === 0) return;
    // 找出平级的上个节点
    const brotherNode = nodes[nodes[parentId].children[nodeIndex - 1]];
    const prevBrotherNodeContentLength = brotherNode.content.length;
    this.props.dispatch({
      type: UPDATE_DATA,
      payload: {
        rootId,
        nodes: {
          ...nodes,
          [parentId]: {
            ...nodes[parentId],
            children: [
              ...nodes[parentId].children.slice(0, nodeIndex),
              ...nodes[parentId].children.slice(nodeIndex + 1),
            ]
          },
          [brotherNode.id]: {
            ...brotherNode,
            content: `${brotherNode.content}${text}`
          },
        }
      }
    });
    // 通知更新光标位置
    this.props.dispatch({
      type: UPDATE_CURSOR,
      payload: {
        needUpdate: true,
        id: brotherNode.id,
        position: prevBrotherNodeContentLength
      }
    })
  }

  render() {
    const { collapsed } = this.state;
    const { node, contentData } = this.props;
    const { children, id, content } = node;
    const { toggleSwitch, handleContentChange, handleEnter, handleMergeNode } = this;
    const { nodes } = contentData;
    return (
      <div>
        <TextBlock
          id={id}
          text={content}
          hasChildren={!!children && !!children.length}
          onContentChange={handleContentChange(id)}
          onEnter={handleEnter(id)}
          onMergeNode={handleMergeNode(id)}
          handleSwitchToggle={toggleSwitch}
          childrenCollapsed={collapsed}
        />
        {
          !!children && !!children.length && !collapsed &&
          (<div className={styles.childrenContainer}>
            {
              children.map(nodeId => (
                <Node
                  key={nodeId}
                  node={nodes[nodeId]}
                  handleContentChange={handleContentChange}
                  contentData={contentData}
                  dispatch={this.props.dispatch}
                />
              ))
            }
          </div>)
        }
      </div>
    )
  }
}

export default connect(
  ({ contentData }) => ({
    contentData
  }),
  dispatch => ({ dispatch })
)(Node)