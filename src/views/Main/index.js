import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux';
import Node from 'components/Node';
import data from 'assets/demo.json';
import { UPDATE_DATA, UPDATE_CURSOR, UPDATE_FOCUSED_NODE } from 'actions';
import { updateCursor } from 'utils/helper';
import uuidv1 from 'uuid/v1';
import styles from './Main.module.css';

class Main extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    contentData: PropTypes.object,
    cursorPosition: PropTypes.object,
    focusedNode: PropTypes.object,
  }

  componentDidMount() {
    this.initContentData();
  }

  componentDidUpdate() {
    const { cursorPosition, dispatch } = this.props;
    if (cursorPosition.needUpdate) updateCursor(dispatch, UPDATE_CURSOR, cursorPosition);
  }

  initContentData = () => {
    const rootId = uuidv1();
    for (let key of Object.keys(data.nodes)) {
      const node = data.nodes[key];
      if (!node.parent) node.parent = rootId;
    }
    this.props.dispatch({
      type: UPDATE_DATA,
      payload: {
        path: [rootId],
        rootId,
        nodes: {
          [rootId]: {
            id: rootId,
            content: 'Home',
            children: data.rootChildren
          },
          ...data.nodes
        }
      }
    });
  }

  blurFocus = e => {
    console.log('blur')
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
  ({ contentData, cursorPosition, focusedNode }) => ({
    contentData,
    cursorPosition,
    focusedNode
  }),
  dispatch => ({ dispatch })
)(Main)