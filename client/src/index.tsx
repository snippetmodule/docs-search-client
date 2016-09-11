// import * as e6p from 'es6-promise';
// (e6p as any).polyfill();

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
const { Router } = require('react-router');
const { ReduxAsyncConnect } = require('redux-connect');
import {store, history, routeConfig} from './app/routes';

require('./css/application.css.scss');

ReactDOM.render(
  <Provider store={store} key="provider">
    <Router
      history={history}
      render={(props) =>
        <ReduxAsyncConnect {...props} />
      }>
      {routeConfig}
    </Router>
  </Provider>,
  document.getElementById('app')
);
