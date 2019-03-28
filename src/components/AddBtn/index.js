import React, { PureComponent } from 'react';
import { UPDATE_DATA, UPDATE_CURSOR } from 'actions';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types'
import styles from './AddBtn.module.css';

class AddBtn extends PureComponent {
  static propTypes = {
    contentData: PropTypes.object,
    dispatch: PropTypes.func
  }

  addNodeAtTop = () => {

  }

  render() {
    const {
      addNodeAtTop
    } = this;

    return (
      <div
        className={styles.container}
        onClick={addNodeAtTop}
      >
        
      </div>
    );
  }
}

export default connect(
  ({ contentData }) => ({
    contentData
  }),
  dispatch => ({ dispatch })
)(AddBtn)
