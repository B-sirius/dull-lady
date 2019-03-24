import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './CollapseSwitch.module.css';
import plusIcon from 'assets/plus.svg';
import minusIcon from 'assets/minus.svg';
import classnames from 'classnames';

class CollapseSwitch extends PureComponent {
  static propTypes = {
    onClick: PropTypes.func,
    collapsed: PropTypes.bool,
    containerStyle: PropTypes.string,
    handleSwitchToggle: PropTypes.func
  }
  
  static defaultProps = {
    onClick: () => {},
    collapsed: false,
    containerStyle: '',
  }

  render() {
    const { onClick, collapsed, containerStyle } = this.props;
    const btnClass = classnames({
      [styles.btn]: true,
      [styles.tapped]: false
    })

    return (
      <div
        className={`${styles.container} ${containerStyle}`}
        onClick={onClick}
      >
        <div className={btnClass}>
          {
            !collapsed ?
              <img className={styles.btnIcon} src={minusIcon} alt="收拢"/>:
              <img className={styles.btnIcon} src={plusIcon} alt="展开"/>
          }
        </div>
      </div>
    );
  }
}

export default CollapseSwitch;
