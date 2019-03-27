import React, { PureComponent } from 'react';
import Global from 'views/Global';
import { Provider } from 'react-redux';
import configureStore from 'store';

const store = configureStore({
});

class App extends PureComponent {
  render() {
    return (
      <Provider store={store}>
        <Global />
      </Provider>
    );
  }
}

export default App;
