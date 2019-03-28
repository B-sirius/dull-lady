import React, { PureComponent } from 'react';
import { UPDATE_DATA, UPDATE_CURSOR } from 'actions';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types'
import Header from 'views/Header';
import Main from 'views/Main';
import Footer from 'views/Footer';
import styles from './Global.module.css';
import AddBtn from 'components/AddBtn';

class Global extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    contentData: PropTypes.object,
    focusedNode: PropTypes.object,
  }

  isNodeFocused = () => {
    const { focusedNode } = this.props;
    return !!focusedNode.currId;
  }

  // 右缩进
  handleIndentToRight = () => {
    const { contentData, focusedNode } = this.props;
    const { currId } = focusedNode;
    const id = currId;
    if (!id || !contentData.nodes[id]) return;

    const { nodes, rootId } = contentData;
    const parentId = nodes[id].parent;
    const parent = nodes[parentId];
    const node = nodes[id];
    // 找出node在parent.children里的index
    const nodeIndex = nodes[parentId].children.indexOf(id);
    if (nodeIndex === -1) {
      console.error(`未在${parentId}中找到子节点${id}`);
      return false;
    }
    if (nodeIndex === 0) {
      return;
    }
    // 找出平级的上个节点
    const brotherNode = nodes[nodes[parentId].children[nodeIndex - 1]];
    // 节点将会被插入到其兄弟节点的子节点的末尾
    if (!brotherNode.children) brotherNode.children = [];
    this.props.dispatch({
      type: UPDATE_DATA,
      payload: {
        rootId,
        nodes: {
          ...nodes,
          [brotherNode.id]: {
            ...brotherNode,
            children: [
              ...brotherNode.children,
              id
            ]
          },
          [parentId]: {
            ...parent,
            children: [
              ...parent.children.slice(0, nodeIndex),
              ...parent.children.slice(nodeIndex + 1),
            ]
          },
          [id]: {
            ...node,
            parent: brotherNode.id
          }
        }
      }
    });
    // 更新光标位置
    this.props.dispatch({
      type: UPDATE_CURSOR,
      payload: {
        needUpdate: true,
        id: id,
        position: node.content.length
      }
    })
  }

  // 左缩进
  handleIndentToLeft = () => {
    const { contentData, focusedNode } = this.props;
    const { currId } = focusedNode;
    const id = currId;
    if (!id || !contentData.nodes[id]) return;

    const { nodes, rootId } = contentData;
    const parentId = nodes[id].parent;
    if (parentId === rootId) return;

    const parent = nodes[parentId];
    const node = nodes[id];
    const newParent = nodes[parent.parent];
    // 找出node在parent.children里的index
    const nodeIndex = nodes[parentId].children.indexOf(id);
    if (nodeIndex === -1) {
      console.error(`未在${parentId}中找到子节点${id}`);
      return false;
    }
    // 找出parent在其parent里的index
    const parentIndex = newParent.children.indexOf(parentId);
    if (parentIndex === -1) {
      console.error(`未在${newParent.id}中找到子节点${parentId}`);
      return false;
    }

    this.props.dispatch({
      type: UPDATE_DATA,
      payload: {
        rootId,
        nodes: {
          ...nodes,
          [parentId]: {
            ...parent,
            children: [
              ...parent.children.slice(0, nodeIndex),
              ...parent.children.slice(nodeIndex + 1),
            ]
          },
          [id]: {
            ...node,
            parent: parent.parent
          },
          [newParent.id]: {
            ...newParent,
            children: [
              ...newParent.children.slice(0, parentIndex + 1),
              id,
              ...newParent.children.slice(parentIndex + 1),
            ]
          }
        }
      }
    });

    this.props.dispatch({
      type: UPDATE_CURSOR,
      payload: {
        needUpdate: true,
        id: id,
        position: 0,
      }
    })
  }

  render() {
    const {
      handleIndentToRight,
      handleIndentToLeft,
      isNodeFocused
    } = this;

    return (
      <div className={styles.container}>
        <Header />
        <Main
          handleIndentToLeft={handleIndentToLeft}
          handleIndentToRight={handleIndentToRight}
        />
        <Footer
          isActive={isNodeFocused()}
          handleIndentToLeft={handleIndentToLeft}
          handleIndentToRight={handleIndentToRight}
        />
        {
          !isNodeFocused() && <AddBtn />
        }
      </div>
    );
  }
}

export default connect(
  ({ contentData, focusedNode }) => ({
    contentData,
    focusedNode
  }),
  dispatch => ({ dispatch })
)(Global)
