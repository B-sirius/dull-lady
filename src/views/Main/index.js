import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux';
import Node from 'components/Node';
import data from 'assets/demo.json';
import { UPDATE_DATA, UPDATE_CURSOR, UPDATE_FOCUSED_NODE } from 'actions';
import styles from './Main.module.css';

class Main extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    contentData: PropTypes.object,
    cursorPosition: PropTypes.object,
    focusedNode: PropTypes.object,
    handleIndentToLeft: PropTypes.func,
    handleIndentToRight: PropTypes.func,
  }

  componentDidMount() {
    this.props.dispatch({
      type: UPDATE_DATA,
      payload: data
    });
  }

  componentDidUpdate() {
    const { cursorPosition } = this.props;
    if (cursorPosition.needUpdate) this.updateCursor();
  }

  // 更新光标位置
  updateCursor = () => {
    // debugger;
    const { cursorPosition } = this.props;
    const { id, position } = cursorPosition;
    const el = document.getElementById(id);
    const range = document.createRange();
    const sel = window.getSelection();
    // debugger;
    if (el.childNodes.length) {
      range.setStart(el.childNodes[0], position);
    }
    else {
      range.setStart(el, position);
    }
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);

    this.props.dispatch({
      type: UPDATE_CURSOR,
      payload: {
        needUpdate: false
      }
    });
  }

  blurFocus = e => {
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
      handleIndentToLeft,
      handleIndentToRight
    } = this.props;
    const { blurFocus } = this;
    const { rootId, nodes } = contentData;

    return (
      <div
        className={styles.container}
        onClick={blurFocus}
      >
        {
          nodes[rootId].children.map(nodeId => (
            <Node
              key={nodeId}
              node={nodes[nodeId]}
              handleIndentToRight={handleIndentToRight}
              handleIndentToLeft={handleIndentToLeft}
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