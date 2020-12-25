/* eslint-disable */
const webpack = require('webpack');
const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');

const project = require('./package.json');
const plugins = require('./webpack-settings/plugins');
const metadata = require('./webpack-settings/metadata.js');

const jsRule = require('./webpack-settings/rules/js');
const htmlRule = require('./webpack-settings/rules/html');
const cssRule = require('./webpack-settings/rules/css');
const sassRule = require('./webpack-settings/rules/sass');
const imageRule = require('./webpack-settings/rules/image');
const jsonRule = require('./webpack-settings/rules/json');
const fontRule = require('./webpack-settings/rules/font');
const urlRule = require('./webpack-settings/rules/url');
const tsRule = require('./webpack-settings/rules/ts');

// production things
if (metadata.ENV === 'production') {
  plugins.push(new CompressionPlugin({
    asset: "[path].gz[query]",
    algorithm: "gzip",
    test: /\.(js)$/,
  }));
}

module.exports = {
  entry: {
    'app': ['babel-polyfill'], // <-- this array will be filled by the aurelia-webpack-plugin
    'aurelia': ['babel-polyfill', ...Object.keys(project.dependencies).filter(dep => dep.startsWith('aurelia-'))],
    //internal: ['babel-polyfill', ...Object.keys(project.dependencies).filter(dep => dep.startsWith('2020-'))],
    react: ['babel-polyfill', ...Object.keys(project.dependencies).filter(dep => dep.startsWith('react'))],
    react: ['react'],
    vendor: [
      'amator',
      'bootstrap',
      'classnames',
      'd3',
      'd3-v4-cloud',
      'datatables.net-bs4',
      'datatables.net-buttons-bs4',
      'detect-csv',
      'dragula',
      'evaporate',
      'event-source-polyfill',
      'flatpickr',
      //'font-awesome',
      'hoverintent',
      'humane-js',
      'isomorphic-fetch',
      'jquery',
      'lodash.debounce',
      'lodash.get',
      'lodash.isequal',
      'lodash.throttle',
      'moment',
      'moment-timezone',
      'node-uuid',
      'object-hash',
      //'odic-client',
      'papaparse',
      'popper.js',
      'prop-types',
      'redux',
      'redux-actions',
      'redux-sessionstorage',
      'reselect',
      'sanitize-html',
      'scrollparent',
      'sifter',
      'spark-md5',
      'tether-drop',
      'timezones.json',
      'validator',
      'whatwg-fetch',
      'xlsx'
    ]
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].bundle.js',
  },
  devServer: {
    port: metadata.port
  },
  devtool: metadata.devtool,
  resolve: {
    modules: [path.resolve(__dirname, "src"), path.resolve(__dirname, "sass"), "node_modules",],
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.scss'],
  },
  node: {
    fs: 'empty',
  },
  externals: [
    {'./cptable': 'var cptable',}
  ],
  module: {
    rules: [
      jsRule,
      tsRule,
      htmlRule,
      cssRule,
      urlRule, // i honestly think this is a double up of image
      sassRule,
      imageRule,
      jsonRule,
      fontRule,
    ]
  },
  plugins,
};
