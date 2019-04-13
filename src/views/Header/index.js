import React, { PureComponent } from 'react';
import PathText from './PathText';
import styles from './Header.module.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class Header extends PureComponent {
  static propTypes = {
    contentData: PropTypes.object
  }

  renderPath = () => {
    const { path, nodes } = this.props.contentData;
    const jsx = path
      .map((id, index) => (
        <PathText
          key={id}
          id={id}
          clickable={index !== path.length - 1}
          text={nodes[id].content}
        />
      ))
      .reduce((prev, curr) => [prev, (<span className={styles.splitLine}>/</span>), curr]);
    return jsx;
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.pathContainer}>
          {this.renderPath()}
        </div>
      </div>
    );
  }
}

export default connect(
  ({ contentData }) => ({
    contentData
  })
)(Header)
