/* 节点，包含文本、子节点、展开按钮等 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { UPDATE_DATA, UPDATE_CURSOR } from 'actions';
import { handleDeleteNode } from 'utils/helper';
import uuidv1 from 'uuid/v1';
import TextBlock from 'components/TextBlock';
import styles from './Node.module.css';

class Node extends PureComponent {
  static propTypes = {
    node: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
    contentData: PropTypes.object,
    focusedNode: PropTypes.object
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
    const { nodes } = this.props.contentData;
    this.props.dispatch({
      type: UPDATE_DATA,
      payload: {
        ...this.props.contentData,
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
    const { nodes } = contentData;
    const newId = uuidv1();
    const parentId = nodes[id].parent;
    const node = nodes[id];
    // 如果是在一个有子节点的父节点的末尾回车，则在所有子节点前创建新节点
    if (splitedString[1] === '' && !!node.children && !!node.children.length) {
      this.props.dispatch({
        type: UPDATE_DATA,
        payload: {
          ...contentData,
          nodes: {
            ...nodes,
            [id]: {
              ...node,
              children: [
                newId,
                ...node.children
              ]
            },
            [newId]: {
              id: newId,
              parent: id,
              content: ''
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
    else {
      // 找出node在parent.children里的index，以插入新的node
      const nodeIndex = nodes[parentId].children.indexOf(id);
      if (nodeIndex === -1) {
        console.error(`未在${parentId}中找到子节点${id}`);
        return false;
      }
      this.props.dispatch({
        type: UPDATE_DATA,
        payload: {
          ...contentData,
          nodes: {
            ...nodes,
            [parentId]: {
              ...nodes[parentId],
              children: [
                ...nodes[parentId].children.slice(0, nodeIndex),
                newId,
                id,
                ...nodes[parentId].children.slice(nodeIndex + 1),
              ]
            },
            // 新节点去前半部分
            [newId]: {
              id: newId,
              content: splitedString[0],
              parent: parentId
            },
            // 原节点保留后半部分
            [id]: {
              ...nodes[id],
              content: splitedString[1]
            }
          }
        }
      });
      // 通知更新光标位置
      this.props.dispatch({
        type: UPDATE_CURSOR,
        payload: {
          needUpdate: true,
          id: id,
          position: 0
        }
      })
    }
  }

  // 处理退格造成的节点合并
  handleMergeNode = id => text => {
    const { contentData, dispatch, focusedNode } = this.props;
    const { nodes } = contentData;
    const parentId = nodes[id].parent;
    const parent = nodes[parentId];
    // 找出node在parent.children里的index
    const nodeIndex = nodes[parentId].children.indexOf(id);
    if (nodeIndex === -1) {
      console.error(`未在${parentId}中找到子节点${id}`);
      return false;
    }
    if (nodeIndex === 0) {
      // if (!!text.length) return;
      // // 第一个空节点，则直接删除
      // else {
      //   handleDeleteNode(dispatch, UPDATE_DATA, contentData, focusedNode);
      // }
      return;
    }

    // 找出平级的上个节点
    const brotherNode = nodes[nodes[parentId].children[nodeIndex - 1]];
    // 如果是父节点中的第一个节点，或者上层节点是一个父节点，不作处理
    if (!!brotherNode.children && !!brotherNode.children.length) return;

    const prevBrotherNodeContentLength = brotherNode.content.length;
    this.props.dispatch({
      type: UPDATE_DATA,
      payload: {
        ...contentData,
        nodes: {
          ...nodes,
          [parentId]: {
            ...parent,
            children: [
              ...parent.children.slice(0, nodeIndex - 1),
              ...parent.children.slice(nodeIndex),
            ]
          },
          [id]: {
            ...nodes[id],
            children: nodes[id].children,
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
        id: id,
        position: prevBrotherNodeContentLength
      }
    })
  }

  render() {
    const { collapsed } = this.state;
    const {
      node,
      contentData,
    } = this.props;
    const { children, id, content } = node;
    const {
      toggleSwitch,
      handleContentChange,
      handleEnter,
      handleMergeNode,
    } = this;
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
  ({ contentData, focusedNode }) => ({
    contentData,
    focusedNode
  }),
  dispatch => ({ dispatch })
)(Node)