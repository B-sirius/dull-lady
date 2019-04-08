import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './PathText.module.css';
import { updateRoot } from 'actions';
import { connect } from 'react-redux';

class PathText extends PureComponent {
  static propTypes = {
    text: PropTypes.string,
    clickable: PropTypes.bool,
    id: PropTypes.string,
    dispatch: PropTypes.func
  }

  static defaultProps = {
    clickable: true
  }

  render() {
    const { text, clickable, id, dispatch } = this.props;
    const textClass = classnames({
      [styles.text]: true,
      [styles.clickable]: clickable
    })
    return (
      <span
        className={textClass}
        onClick={dispatch(updateRoot(id))}
      >
        {text}
      </span>
    );
  }
}

export default connect(
  () => ({
  }),
  dispatch => ({ dispatch })
)(PathText)
