import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types'
import classnames from 'classnames';
import { connect } from 'react-redux';
import backend from 'backend';
import styles from './Login.module.css';
import history from 'utils/history';
import { LOGIN_STATE } from 'utils/constant';
import { withAlert } from 'react-alert';
import fetchWrapper from 'utils/fetchWrapper';
import ReactLoading from 'react-loading';

class Login extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    settingState: PropTypes.object,
    userInfo: PropTypes.object,
    alert: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isLoading: false,
    }
  }

  setUsername = e => {
    this.setState({
      username: e.target.value
    })
  }

  setPassword = e => {
    this.setState({
      password: e.target.value
    })
  }

  logIn = async () => {
    const { username, password } = this.state;
    if (!/^[a-zA-Z0-9_]{3,16}$/.test(username)) {
      this.props.alert.error('用户名在3到16个英文字符之间');
      return;
    }
    if (username === '' || password === '') {
      this.props.alert.error('请输入用户名和密码');
      return;
    }
    this.setState({
      isLoading: true
    });
    const { res, error } = await fetchWrapper(backend.logIn({ username, password }));
    this.setState({
      isLoading: false
    });
    if (error) {
      this.props.alert.error('发生错误');
      throw error;
    }
    if (res.status === 200 && res.data.state === LOGIN_STATE.OK) {
      history.push({ pathname: '/' });
      return;
    }
    if (res.status === 200 && res.data.state === LOGIN_STATE.NOT_REGISTERED) {
      this.createUser({ username, password });
      return;
    }
    if (res.status === 200 && res.data.state === LOGIN_STATE.WRONG_PASS) {
      this.props.alert.error('密码错误');
      return;
    }
    this.props.alert.error('登陆失败');
  }

  createUser = async ({ username, password }) => {
    const res = await backend.createUser({ username, password });
    if (res.status === 200 && res.data.code === 200) {
      history.push({ pathname: '/' });
    }
  }

  render() {
    const { settingState } = this.props;
    const { username, password, isLoading } = this.state;
    const { setUsername, setPassword, logIn } = this;
    const containerClass = classnames({
      [styles.container]: true,
      [styles.disable]: !settingState.active
    });

    return (
      <div
        className={containerClass}
      >
        <h3>账户</h3>
        <div>
          <div className={styles.inputContainer}>
            <p className={styles.label}>用户名</p>
            <div>
              <input className={styles.input} type="text" onChange={setUsername} value={username} />
            </div>
          </div>
          <div className={styles.inputContainer}>
            <p className={styles.label}>密码</p>
            <div>
              <input className={styles.input} type="password" onChange={setPassword} value={password} />
            </div>
          </div>
          <div onClick={logIn} className={styles.btn}>登陆/注册</div>
        </div>
        {
          isLoading &&
          (<div className={styles.loadingContainer}>
            <ReactLoading type={'cylon'} color={"#4aefe7"} width={"100px"} height={"100px"} />
          </div>)
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
)(withAlert()(Login))