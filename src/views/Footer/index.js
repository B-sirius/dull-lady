import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TextFocusedTool from 'views/TextFocusedTool';
import styles from './Footer.module.css';

class Footer extends PureComponent {

  static propTypes = {
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

export default Footer;