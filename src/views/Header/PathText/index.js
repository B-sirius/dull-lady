import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './PathText.module.css';

class PathText extends PureComponent {
  static propTypes = {
    text: PropTypes.string,
    clickable: PropTypes.bool
  }

  static defaultProps = {
    clickable: true
  }

  render() {
    const { text, clickable } = this.props;
    const textClass = classnames({
      [styles.text]: true,
      [styles.clickable]: clickable
    })

    return (
      <span className={textClass}>{text}</span>
    );
  }
}

export default PathText;
