import * as React from 'react';
import { IndexRoute, Route } from 'react-router';
import { App, Home, About, DocPage } from './containers';
import { Router, browserHistory } from 'react-router';

const history = browserHistory;

const routeConfig = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="about" component={About} />
      <Route path="/*" component={DocPage} />
    </Route>
  </Router>
);

export { history, routeConfig }
