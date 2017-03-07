// import * as e6p from 'es6-promise';
// (e6p as any).polyfill();
import * as ReactDOM from 'react-dom';
import { routeConfig } from './app/routes';

require('./css/application.css.scss');

ReactDOM.render(routeConfig, document.getElementById('app'));
