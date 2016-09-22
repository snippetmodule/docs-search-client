import * as React from 'react';
import { IndexRoute, Route } from 'react-router';
import { App, Home, About, Counter, Stars, DocPage} from './containers';
const {browserHistory } = require('react-router');
import { ReactRouterReduxHistory, syncHistoryWithStore } from 'react-router-redux';
import { configureStore } from './redux/store';
import {IReduxState } from './redux/reducers/model';
const { Router } = require('react-router');
const { ReduxAsyncConnect } = require('redux-connect');
const store: Redux.Store<IReduxState> = configureStore(
  browserHistory,
  window.__INITIAL_STATE__
);
const history: ReactRouterReduxHistory = syncHistoryWithStore(browserHistory, store);

const routeConfig = (
  <Router history={history}
    render={(props) =>
      <ReduxAsyncConnect {...props} />
    }>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="about" component={About} />
      <Route path="counter" component={Counter} />
      <Route path="stars" component={Stars} />
      <Route path="/*" component={DocPage} />
    </Route>
  </Router>
);

export {store, history, routeConfig}
