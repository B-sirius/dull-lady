import React, { PureComponent } from 'react';
import { UPDATE_CURSOR, createNode } from 'actions';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types'
import uuid from 'uuid/v1';
import styles from './AddBtn.module.css';
import addNodeImg from 'assets/addNode.svg';

class AddBtn extends PureComponent {
  static propTypes = {
    contentData: PropTypes.object,
    dispatch: PropTypes.func
  }

  addNodeAtTop = () => {
    const { contentData, dispatch } = this.props;
    const { rootId } = contentData;
    const newId = uuid();
    dispatch(
      createNode({
        id: newId,
        parentId: rootId,
        priority: 0
      }));
    dispatch({
      type: UPDATE_CURSOR,
      payload: {
        id: newId,
        position: 0
      }
    })
  }

  render() {
    const {
      addNodeAtTop
    } = this;

    return (
      <div
        className={styles.container}
        onClick={addNodeAtTop}
      >
        <img className={styles.addNodeImg} src={addNodeImg} alt="添加节点" />
      </div>
    );
  }
}

export default connect(
  ({ contentData }) => ({
    contentData
  }),
  dispatch => ({ dispatch })
)(AddBtn)
