import React, { PureComponent } from 'react';
import Header from 'views/Header';
import Main from 'views/Main';
import Footer from 'views/Footer';
import styles from './App.module.css';
import { Provider } from 'react-redux';
import configureStore from 'store';

const store = configureStore({
});

class App extends PureComponent {
  render() {
    return (
      <Provider store={store}>
        <div className={styles.container}>
          <Header />
          <Main />
          <Footer />
        </div>
      </Provider>
    );
  }
}

export default App;
