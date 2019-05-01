import React, { PureComponent } from 'react';
import Global from 'views/Global';
import Login from 'views/Login';
import { Provider } from 'react-redux';
import store from 'store';
import history from 'utils/history';
import { Router, Route, Switch } from 'react-router';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic';

const alertOptions = {
  position: positions.TOP_CENTER,
  timeout: 2000,
  offset: '30px',
  transition: transitions.SCALE
}

class App extends PureComponent {
  render() {
    return (
      <AlertProvider template={AlertTemplate} {...alertOptions}>
        <Provider store={store}>
          <Router history={history}>
            <Switch>
              <Route exact path="/" component={Global} />
              <Route exact path="/login" component={Login} />
            </Switch>
          </Router>
        </Provider>
      </AlertProvider>
    );
  }
}

export default App;
