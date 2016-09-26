"use strict";
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = process.env.NODE_ENV === 'production'? require('./prod.js'):require('./dev.js');

//------webpack - dev - server------------------
var server = new WebpackDevServer(webpack(config), {
    hot: true,
    quiet: false,
    noInfo: true,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    contentBase: 'build/',
    publicPath: "/build/",
    stats: {
        colors: true
    },
    historyApiFallback: {
        disableDotRule: true
    },
    open: true,
});

// ## run servers
server.listen(8080, "localhost", function () { });