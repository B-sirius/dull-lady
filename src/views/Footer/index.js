import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import TextFocusedTool from 'views/TextFocusedTool';
import styles from './Footer.module.css';

class Footer extends PureComponent {

  static propTypes = {
    contentData: PropTypes.object,
    handleIndentToLeft: PropTypes.func,
    handleIndentToRight: PropTypes.func,
    isActive: PropTypes.bool
  }

  render() {
    const {
      handleIndentToRight,
      handleIndentToLeft,
      isActive
    } = this.props;

    return (
      <div className={styles.container}>
        {
          isActive && (
            <TextFocusedTool
              handleIndentToRight={handleIndentToRight}
              handleIndentToLeft={handleIndentToLeft}
            />
          )
        }
      </div>
    );
  }
}

export default connect(
  ({ contentData }) => ({
    contentData
  }),
  dispatch => ({ dispatch })
)(Footer)