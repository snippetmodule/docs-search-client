// import * as e6p from 'es6-promise';
// (e6p as any).polyfill();

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import {store, routeConfig} from './app/routes';

require('./css/application.css.scss');

ReactDOM.render(
  <Provider store={store} key="provider">
    {routeConfig}
  </Provider>,
  document.getElementById('app')
);
