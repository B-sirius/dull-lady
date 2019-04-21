import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './Warning.module.css';
import classnames from 'classnames';

class Warning extends PureComponent {
  render() {
    return (
      <div
        className={styles.container}
      >
        <p className={`${styles.text} ${styles.bold}`}>警告：目前无法同步到云端</p>
        <p className={styles.text}>您当前编辑的内容将被保存在本地，联网后即会同步</p>
      </div>
    );
  }
}

export default Warning;
