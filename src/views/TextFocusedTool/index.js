/* 节点处于编辑状态时，底部出现的工具栏 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import indentLeftImg from 'assets/indent-decrease.svg';
import indentRightImg from 'assets/indent-increase.svg';
import trashImg from 'assets/trash.svg';
import { connect } from 'react-redux';
import { indentToRight, indentToLeft, deleteNode } from 'actions';
import styles from './TextFocusedTool.module.css';

class TextFocusedTool extends PureComponent {
  static propTypes = {
    focusedNode: PropTypes.object,
    dispatch: PropTypes.func
  }

  toLeft = () => {
    this.props.dispatch(indentToLeft())
  }

  toRight = () => {
    this.props.dispatch(indentToRight())
  }

  deleteNode = () => {
    const { focusedNode } = this.props;
    this.props.dispatch(deleteNode({ id: focusedNode.currId }));
  }

  render() {
    const {
      toLeft,
      toRight,
      deleteNode
    } = this;

    return (
      <div className={styles.container}>
        <div
          className={styles.button}
          onClick={toLeft}
        >
          <img className={styles.btnImg} src={indentLeftImg} alt="左缩进" />
        </div>
        <div
          className={styles.button}
          onClick={toRight}
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
  ({ focusedNode }) => ({
    focusedNode
  }),
  dispatch => ({ dispatch })
)(TextFocusedTool)