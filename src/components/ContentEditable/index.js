import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { htmlEntities } from 'utils/helper';
import styles from './ContentEditable.module.css';

class ContentEditable extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    onContentChange: PropTypes.func,
    onEnter: PropTypes.func,
    onMergeNode: PropTypes.func,
    html: PropTypes.string,
    className: PropTypes.string
  }

  static defaultProps = {
    onContentChange: () => { },
    onEnter: () => { },
    onMergeNode: () => { },
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

  render() {
    const { html, className, id } = this.props;
    const { emitChange, hanldeKeyDown } = this;

    return (
      <div
        id={id}
        className={className}
        onInput={emitChange}
        onBlur={emitChange}
        contentEditable
        onKeyDown={hanldeKeyDown}
        tabIndex="0"
        dangerouslySetInnerHTML={{ __html: htmlEntities(html) }}
      >
      </div>
    );
  }
}

export default ContentEditable;
