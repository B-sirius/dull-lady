import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextFocusedTool from 'views/TextFocusedTool';
import styles from './Footer.module.css';

class Footer extends PureComponent {

  static propTypes = {
    contentData: PropTypes.object,
    isActive: PropTypes.bool
  }

  render() {
    const {
      isActive
    } = this.props;

    return (
      <div className={styles.container}>
        {
          isActive && (
            <TextFocusedTool />
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