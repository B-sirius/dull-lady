import React, { PureComponent } from 'react';
import { UPDATE_DATA, UPDATE_CURSOR } from 'actions';
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
    const { contentData } = this.props;
    const { nodes, rootId } = contentData;
    const rootNode = nodes[rootId];
    const newId = uuid();
    const rootChildren = rootNode.children || [];
    this.props.dispatch({
      type: UPDATE_DATA,
      payload: {
        ...contentData,
        nodes: {
          ...nodes,
          [rootId]: {
            ...rootNode,
            children: [
              newId,
              ...rootChildren
            ]
          },
          [newId]: {
            id: newId,
            content: '',
            parent: rootId
          }
        }
      }
    });
    this.props.dispatch({
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
        <img className={styles.addNodeImg} src={addNodeImg} alt="添加节点"/>
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
