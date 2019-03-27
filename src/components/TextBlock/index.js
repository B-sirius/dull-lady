/* 一行的内容 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Dot from 'components/Dot';
import CollapseSwitch from 'components/CollapseSwitch';
import ContentEditbale from 'components/ContentEditable';
import styles from './TextBlock.module.css';

class TextBlock extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    hasChildren: PropTypes.bool,
    text: PropTypes.string,
    onContentChange: PropTypes.func,
    onEnter: PropTypes.func,
    onMergeNode: PropTypes.func,
    onIndentToRight: PropTypes.func,
    onIndentToLeft: PropTypes.func,
    childrenCollapsed: PropTypes.bool,
    handleSwitchToggle: PropTypes.func
  }

  static defaultProps = {
    onClick: () => { },
    hasChildren: true,
    text: '',
    onContentChange: () => { },
    onEnter: () => { },
    onMergeNode: () => { },
    onIndentToRight: () => { },
    onIndentToLeft: () => { },
    childrenCollapsed: false,
    handleSwitchToggle: () => { }
  }

  render() {
    const {
      hasChildren,
      text,
      onContentChange,
      handleSwitchToggle,
      childrenCollapsed,
      onEnter,
      onMergeNode,
      onIndentToRight,
      onIndentToLeft,
      id
    } = this.props;
    const textClass = classnames({
      [styles.text]: true,
      [styles.textMargin]: hasChildren
    });

    return (
      <div
        className={styles.container}
      >
        <Dot />
        <ContentEditbale
          id={id}
          className={textClass}
          html={text}
          onContentChange={onContentChange}
          onEnter={onEnter}
          onMergeNode={onMergeNode}
          onIndentToRight={onIndentToRight}
          onIndentToLeft={onIndentToLeft}
        />
        {
          hasChildren &&
          <CollapseSwitch
            containerStyle={styles.switch}
            collapsed={childrenCollapsed}
            onClick={handleSwitchToggle}
          />
        }
      </div>
    );
  }
}

export default TextBlock;
