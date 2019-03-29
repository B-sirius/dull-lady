import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './PathText.module.css';
import { UPDATE_DATA } from 'actions';
import { updateRoot } from 'utils/helper';
import { connect } from 'react-redux';

class PathText extends PureComponent {
  static propTypes = {
    text: PropTypes.string,
    clickable: PropTypes.bool,
    id: PropTypes.string,
    contentData: PropTypes.object,
    dispatch: PropTypes.func
  }

  static defaultProps = {
    clickable: true
  }

  render() {
    const { text, clickable, id, contentData, dispatch } = this.props;
    const textClass = classnames({
      [styles.text]: true,
      [styles.clickable]: clickable
    })
    return (
      <span
        className={textClass}
        onClick={updateRoot(dispatch, UPDATE_DATA, id, contentData)}
      >
        {text}
      </span>
    );
  }
}

export default connect(
  ({ contentData }) => ({
    contentData
  }),
  dispatch => ({ dispatch })
)(PathText)
