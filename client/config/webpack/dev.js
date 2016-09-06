var path = require('path');
var webpack = require('webpack');
var postcssAssets = require('postcss-assets');
var postcssNext = require('postcss-cssnext');
var stylelint = require('stylelint');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
  devtool: 'source-map',
  debug: true,
  resolve: {
    root: path.resolve(__dirname),
    extensions: ['', '.ts', '.tsx', '.js']
  },
  entry: {
    app: [
      'webpack-hot-middleware/client?reload=true',
      './src/index.tsx'
    ],
    vendor: './src/vendor.ts'
  },
  output: {
    path: path.resolve('./build/'),
    publicPath: '/build/',
    filename: 'js/[name].js',
    pathinfo: true
  },
  module: {
    preLoaders: [
      { test: /\.tsx?$/, loader: 'tslint' }
    ],
    loaders: [
      {
        test: /\.tsx?$/,
        loader: 'react-hot!ts'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.css$/,
        include: path.resolve('./src/app'),
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=2&localIdentName=[local]',
          'postcss-loader'
        ]
      },
      {
        test: /\.css$/,
        exclude: path.resolve('./src/app'),
        loaders: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.eot(\?.*)?$/,
        loader: 'file?name=fonts/[hash].[ext]'
      },
      {
        test: /\.(woff|woff2)(\?.*)?$/,
        loader: 'file-loader?name=fonts/[hash].[ext]'
      },
      {
        test: /\.ttf(\?.*)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream&name=fonts/[hash].[ext]'
      },
      {
        test: /\.svg(\?.*)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml&name=fonts/[hash].[ext]'
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loader: 'url?limit=1000&name=images/[hash].[ext]'
      }
    ]
  },
  postcss: function () {
    return [
      stylelint({ files: '../../src/app/*.css' }),
      postcssNext(),
      postcssAssets({ relative: true })
    ];
  },
  tslint: {
    failOnHint: false
  },
  plugins: [
    new HtmlWebpackPlugin({                        //根据模板插入css/js等生成最终HTML
      favicon: './src/favicon.ico', //favicon路径
      filename: './index.html',    //生成的html存放路径，相对于 path
      template: './src/index.html',    //html模板路径
      inject: true,    //允许插件修改哪些内容，包括head与body             hash:true,    //为静态资源生成hash值
      minify: {    //压缩HTML文件
        removeComments: true,    //移除HTML中的注释
        collapseWhitespace: false    //删除空白符与换行符
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};
module.exports = config;
