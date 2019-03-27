/* 节点处于编辑状态时，底部出现的工具栏 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import indentLeftImg from 'assets/indent-decrease.svg';
import indentRightImg from 'assets/indent-increase.svg';
import trashImg from 'assets/trash.svg';
import { connect } from 'react-redux';
import { UPDATE_DATA, UPDATE_CURSOR } from 'actions';
import styles from './TextFocusedTool.module.css';

class TextFocusedTool extends PureComponent {
  static propTypes = {
    focusedNode: PropTypes.object,
    contentData: PropTypes.object,
    handleIndentToLeft: PropTypes.func,
    handleIndentToRight: PropTypes.func,
    dispatch: PropTypes.func
  }

  triggerIndentLeft = e => {
    this.props.handleIndentToLeft(e, true);
  }

  triggerIndentRight = e => {
    this.props.handleIndentToRight(e, true);
  }

  deleteNode = () => {
    const { contentData, focusedNode } = this.props;
    const { lastId } = focusedNode;
    const id = lastId;
    const { rootId, nodes } = contentData;
    const parent = nodes[nodes[id].parent];
    const nodeIndex = nodes[parent.id].children.indexOf(id);
    // debugger;
    if (nodeIndex === -1) {
      console.error(`未在${parent.id}中找到子节点${id}`);
      return false;
    }

    this.props.dispatch({
      type: UPDATE_DATA,
      payload: {
        rootId,
        nodes: {
          ...nodes,
          [parent.id]: {
            ...parent,
            children: [
              ...parent.children.slice(0, nodeIndex),
              ...parent.children.slice(nodeIndex + 1)
            ]
          }
        }
      }
    })
  }

  render() {
    const {
      triggerIndentLeft,
      triggerIndentRight,
      deleteNode
    } = this;

    return (
      <div className={styles.container}>
        <div
          className={styles.button}
          onClick={triggerIndentLeft}
        >
          <img className={styles.btnImg} src={indentLeftImg} alt="左缩进" />
        </div>
        <div
          className={styles.button}
          onClick={triggerIndentRight}
        >
          <img className={styles.btnImg} src={indentRightImg} alt="右缩进" />
        </div>
        <div
          className={styles.button}
          onClick={deleteNode}
        >
          <img className={styles.btnImg} src={trashImg} alt="删除" />
        </div>
      </div>
    );
  }
}

export default connect(
  ({ contentData, cursorPosition, focusedNode }) => ({
    contentData,
    cursorPosition,
    focusedNode
  }),
  dispatch => ({ dispatch })
)(TextFocusedTool)