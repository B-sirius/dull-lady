/* 节点，包含文本、子节点、展开按钮等 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { UPDATE_CURSOR } from 'actions';
import { editNode, deleteNode, createNode } from 'actions';
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
    this.props.dispatch(editNode({ id, content: value }));
  }

  // 处理回车，将分割内容并创建新节点
  handleEnter = id => splitedString => {
    const { contentData } = this.props;
    const { nodes } = contentData;
    const node = nodes[id];
    const parent = nodes[node.parent];
    const nodeIndex = parent.children.indexOf(id);
    const newId = uuidv1();
    if (splitedString[1] === '') {
      // 没有子节点的节点末尾，创建一个一个新节点
      if (!node.children || !node.children.length) {
        this.props.dispatch(
          createNode({
            id: newId,
            parentId: node.parent,
            priority: nodeIndex + 1
          }));
        // 通知更新光标位置
        this.props.dispatch({
          type: UPDATE_CURSOR,
          payload: {
            needUpdate: true,
            id: newId,
            position: 0
          }
        })
        return;
      }
      // 有子节点的节点末尾，在所有子节点前创建一个新节点
      if (!!node.children && !!node.children.length) {
        this.props.dispatch(createNode({
          id: newId,
          parentId: id,
          priority: 0
        }));
        // 通知更新光标位置
        this.props.dispatch({
          type: UPDATE_CURSOR,
          payload: {
            needUpdate: true,
            id: newId,
            position: 0
          }
        })
        return;
      }
    }
    if (splitedString[0] === '') {
      // 在节点的开头，在节点的上面创建一个新节点
      this.props.dispatch(
        createNode({
          id: newId,
          parentId: node.parent,
          priority: nodeIndex
        }));
      return;
    }
    // 在节点的中间
    this.props.dispatch(createNode({
      id: newId,
      parentId: node.parent,
      priority: nodeIndex
    }));
    this.props.dispatch(editNode({
      id: newId,
      content: splitedString[0]
    }));
    this.props.dispatch(editNode({
      id,
      content: splitedString[1]
    }));
  }

  // 处理退格造成的节点合并
  handleMergeNode = id => text => {
    const { contentData } = this.props;
    const { nodes } = contentData;
    const node = nodes[id];
    const parentId = node.parent;
    const parent = nodes[parentId];
    const nodeIndex = parent.children.indexOf(id);
    // 空节点，直接删除
    if (text === '') {
      this.props.dispatch(deleteNode({ id }));
      return;
    }
    // 是父元素的第一个节点，不处理
    if (nodeIndex === 0) return;
    const brotherNode = nodes[parent.children[nodeIndex - 1]];
    // 其上个节点有子节点，不处理
    if (!!brotherNode.children && !!brotherNode.children.length) return;
    // 其他，则删除上个节点，并编辑该节点为上个节点内容+此节点内容
    this.props.dispatch(deleteNode({ id: brotherNode.id }));
    this.props.dispatch(editNode({ id, content: brotherNode.content + text }));
    this.props.dispatch({
      type: UPDATE_CURSOR,
      payload: {
        needUpdate: true,
        position: brotherNode.content.length
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