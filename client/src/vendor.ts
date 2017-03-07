/**
 * This is an entry point for additional assets,
 * require your assets under this file.
 *
 * Example:
 * require('./bootstrap/css/bootstrap.min.css');
 */
import 'isomorphic-fetch';
import 'react';
import 'react-dom';
import 'react-router';
import 'react-helmet';
import 'react-dom';

import app from './app/config';
if (app.htmlConfig.isDevelopment) {
    Object.defineProperty(window, '_trackJs', { value: { token: 'de2e5b341ed24eff992e0746306327b7' } });
    require('trackjs');
}

// for Test
// const appConfig = require('../config/main');
// if (appConfig.isDevelopment) {
//     try {
//         require('index.html'); // 触发webpack dev server 更新 html
//     }catch (e) {}
// }
