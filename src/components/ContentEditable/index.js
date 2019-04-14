import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { htmlEntities, getCaretPosition } from 'utils/helper';
import { connect } from 'react-redux';
import { UPDATE_FOCUSED_NODE, UPDATE_CURSOR } from 'actions';
import { indentToLeft, indentToRight } from 'actions';

class ContentEditable extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    onContentChange: PropTypes.func,
    onEnter: PropTypes.func,
    onMergeNode: PropTypes.func,
    html: PropTypes.string,
    className: PropTypes.string,
    dispatch: PropTypes.func,
  }

  static defaultProps = {
    onContentChange: () => { },
    onEnter: () => { },
    onMergeNode: () => { },
    onIndentToRight: () => { },
    html: '',
    className: ''
  }

  constructor(props) {
    super(props);
    this.lastHtml = '';
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.html !== ReactDOM.findDOMNode(this).innerHTML;
  }

  componentDidUpdate() {
    if (this.props.html !== ReactDOM.findDOMNode(this).innerHTML) {
      ReactDOM.findDOMNode(this).innerHTML = this.props.html;
    }
  }

  hanldeKeyDown = e => {
    // 回车
    if (e.keyCode === 13) this.handleEnter(e);
    // 退格
    else if (e.keyCode === 8) this.handleBackspace(e);
    // tab
    else if (!e.shiftKey && e.keyCode === 9) this.handleTab(e);
    // shift + tab
    else if (e.shiftKey && e.keyCode === 9) this.handleShiftTab(e);
    // 方向键
    else if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) this.trackCursorPosition(e);
  }

  // 处理回车，创建新节点
  handleEnter = e => {
    if (e.keyCode === 13) {
      e.preventDefault(); // 阻止默认回车行为
      const { anchorOffset, focusNode } = window.getSelection();
      const text = focusNode.textContent;

      // 获得光标前后的文本
      const textBeforeAnchor = text.slice(0, anchorOffset);
      const textAfterAnchor = text.slice(anchorOffset);
      this.props.onEnter([textBeforeAnchor, textAfterAnchor]);
    }
  }

  // 处理退格，底部退格将删除并合并节点
  handleBackspace = e => {
    const { anchorOffset, focusNode } = window.getSelection();
    const text = focusNode.textContent;

    // 获得光标前后的文本
    const textBeforeAnchor = text.slice(0, anchorOffset);
    if (textBeforeAnchor === '') {
      e.preventDefault();
      this.props.onMergeNode(text);
    }
  }

  // 处理tab
  handleTab = e => {
    e.preventDefault();
    this.props.dispatch(indentToRight())
  }

  // 处理shift+tab
  handleShiftTab = e => {
    e.preventDefault();
    this.props.dispatch(indentToLeft());
  }

  // 触发更新reducer
  emitChange = () => {
    const html = ReactDOM.findDOMNode(this).innerHTML;
    if (this.props.onContentChange && html !== this.lastHtml) {
      this.props.onContentChange({
        target: {
          value: html
        }
      })
    }
    this.lastHtml = html;
  }

  updateFocusedNode = e => {
    this.props.dispatch({
      type: UPDATE_FOCUSED_NODE,
      payload: {
        currId: this.props.id,
      }
    })
  }

  trackCursorPosition = e => {
    e.stopPropagation();
    const el = document.getElementById(this.props.id);
    const position = getCaretPosition(el);
    this.props.dispatch({
      type: UPDATE_CURSOR,
      payload: {
        position,
        id: this.props.id
      }
    })
  }

  render() {
    const { html, className, id } = this.props;
    const { emitChange, hanldeKeyDown, updateFocusedNode, trackCursorPosition } = this;

    return (
      <div
        id={id}
        className={className}
        onInput={emitChange}
        onBlur={() => {}}
        onFocus={updateFocusedNode}
        onClick={trackCursorPosition}
        contentEditable
        onKeyDown={hanldeKeyDown}
        tabIndex="0"
        dangerouslySetInnerHTML={{ __html: htmlEntities(html) }}
        spellCheck="false"
      >
      </div>
    );
  }
}

export default connect(
  () => ({
  }),
  dispatch => ({ dispatch })
)(ContentEditable)
