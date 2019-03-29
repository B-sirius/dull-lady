import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types'
import Header from 'views/Header';
import Main from 'views/Main';
import Footer from 'views/Footer';
import styles from './Global.module.css';
import AddBtn from 'components/AddBtn';

class Global extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    focusedNode: PropTypes.object,
  }

  isNodeFocused = () => {
    const { focusedNode } = this.props;
    return !!focusedNode.currId;
  }

  render() {
    const {
      isNodeFocused
    } = this;

    return (
      <div className={styles.container}>
        <Header />
        <Main />
        <Footer isActive={isNodeFocused()}/>
        {
          !isNodeFocused() && <AddBtn />
        }
      </div>
    );
  }
}

export default connect(
  ({ focusedNode }) => ({
    focusedNode
  }),
  dispatch => ({ dispatch })
)(Global)
