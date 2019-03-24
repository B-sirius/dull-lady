import React, { PureComponent } from 'react';
import PathText from './PathText';
import styles from './Header.module.css';

class Header extends PureComponent {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.pathContainer}>
          <PathText
            text={'Home'}
          />
        </div>
      </div>
    );
  }
}

export default Header;
