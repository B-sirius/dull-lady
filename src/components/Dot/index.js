import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './Dot.module.css';

class Dot extends PureComponent {
  static propTypes = {
    onClick: PropTypes.func,
  }
  
  static defaultProps = {
    onClick: () => {}
  }

  render() {
    const { onClick } = this.props;

    return (
      <div
        className={styles.container}
        onClick={onClick}
      >
        <div className={styles.circle}></div>
      </div>
    );
  }
}

export default Dot;
