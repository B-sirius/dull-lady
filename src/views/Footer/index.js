import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SettingImg from 'assets/setting.svg';
import SyncImg from 'assets/sync.svg';
import TextFocusedTool from 'views/TextFocusedTool';
import { openSetting } from 'actions';
import styles from './Footer.module.css';
import backend from '../../backend';
import fetchWrapper from 'utils/fetchWrapper';

class Footer extends PureComponent {

  static propTypes = {
    isActive: PropTypes.bool,
    dispatch: PropTypes.func,
    contentData: PropTypes.object,
    userInfo: PropTypes.object
  }

  pushLocalData = async () => {
    const { userInfo, contentData } = this.props;
    // 同步本地
    localStorage.setItem(
      'localData',
      JSON.stringify({
        name: userInfo.username,
        localUpdatedTime: new Date(),
        nodes: contentData.nodes
      })
    )
    // 同步远程
    const { error, res } = await fetchWrapper(backend.pushLocalData({ contentData }));
    if (error) throw error;
  }

  render() {
    const {
      isActive,
      dispatch
    } = this.props;
    const { pushLocalData } = this;

    return (
      <div className={styles.container}>
        <div className={styles.btnGroup}>
          <div
            className={styles.button}
            onClick={pushLocalData}
          >
            <img className={styles.btnImg} src={SyncImg} alt="同步" />
          </div>
        </div>
        <div className={styles.btnGroup}>
          <div
            className={styles.button}
            onClick={dispatch(openSetting())}
          >
            <img className={styles.btnImg} src={SettingImg} alt="设置" />
          </div>
        </div>

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
  ({ contentData, userInfo }) => ({
    contentData, userInfo
  }),
  dispatch => ({ dispatch })
)(Footer)