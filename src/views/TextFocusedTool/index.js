/* 节点处于编辑状态时，底部出现的工具栏 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import indentLeftImg from 'assets/indent-decrease.svg';
import indentRightImg from 'assets/indent-increase.svg';
import trashImg from 'assets/trash.svg';
import { connect } from 'react-redux';
import { UPDATE_DATA, UPDATE_CURSOR } from 'actions';
import { handleIndentToLeft, handleIndentToRight, handleDeleteNode } from 'utils/helper';
import styles from './TextFocusedTool.module.css';

class TextFocusedTool extends PureComponent {
  static propTypes = {
    focusedNode: PropTypes.object,
    contentData: PropTypes.object,
    cursorPosition: PropTypes.object,
    dispatch: PropTypes.func
  }

  indentToLeft = () => {
    const { dispatch, contentData, focusedNode } = this.props;
    handleIndentToLeft(dispatch, UPDATE_DATA, UPDATE_CURSOR, contentData, focusedNode);
  }

  indentToRight = () => {
    const { dispatch, contentData, focusedNode } = this.props;
    handleIndentToRight(dispatch, UPDATE_DATA, UPDATE_CURSOR, contentData, focusedNode);
  }

  deleteNode = () => {
    const { dispatch, contentData, focusedNode } = this.props;
    handleDeleteNode(dispatch, UPDATE_DATA, contentData, focusedNode);
  }

  render() {
    const {
      deleteNode,
      indentToLeft,
      indentToRight
    } = this;

    return (
      <div className={styles.container}>
        <div
          className={styles.button}
          onClick={indentToLeft}
        >
          <img className={styles.btnImg} src={indentLeftImg} alt="左缩进" />
        </div>
        <div
          className={styles.button}
          onClick={indentToRight}
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