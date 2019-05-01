import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types'
import classnames from 'classnames';
import { connect } from 'react-redux';
import closeImg from 'assets/close.svg';
import { closeSetting } from 'actions';
import backend from 'backend';
import styles from './Setting.module.css';
import history from 'utils/history';

class Setting extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    settingState: PropTypes.object,
    userInfo: PropTypes.object
  }

  logOut = async () => {
    await backend.logOut();
    history.push('/login');
    this.props.dispatch(closeSetting())();
  }
  
  render() {
    const { dispatch, settingState, userInfo } = this.props;
    const { logOut } = this;
    const containerClass = classnames({
      [styles.container]: true,
      [styles.disable]: !settingState.active
    });

    return (
      <div
        className={containerClass}
      >
        <img
          className={styles.closeBtn}
          src={closeImg}
          onClick={dispatch(closeSetting())}
        />
        <h2>设置</h2>
        <h3>账户</h3>
        {
          <div>
            <div className={styles.inputContainer}>
              <p className={styles.label}>用户名</p>
              <div>
                <p>{userInfo.username}，已登陆</p>
              </div>
            </div>
            <div onClick={logOut} className={styles.btn}>登出</div>
          </div>
        }
      </div>
    );
  }
}

export default connect(
  ({ settingState, userInfo }) => ({
    settingState,
    userInfo
  }),
  dispatch => ({ dispatch })
)(Setting)