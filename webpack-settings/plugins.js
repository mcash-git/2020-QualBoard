/* eslint-disable  */
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AureliaWebpackPlugin = require('aurelia-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const metadata = require('./metadata.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const ENV = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() || 'development';

module.exports = [
  new webpack.ProvidePlugin({
    regeneratorRuntime: 'regenerator-runtime', // to support await/async syntax
    $: 'jquery', // because 'bootstrap' by Twitter depends on this
    jQuery: 'jquery', // just an alias
    Popper: ['popper.js', 'default']
  }),
  new webpack.DefinePlugin({
    METADATA: JSON.stringify(metadata),
    ENV: JSON.stringify('production'),
  }),
  new HtmlWebpackPlugin({
    template: 'index.html',
    favicon: 'favicon.ico',
    metadata: metadata,
  }),
  new AureliaWebpackPlugin({
    root: path.resolve(),
    src: path.resolve('src'),
    baseUrl: '/'
  }),
  new ExtractTextPlugin({
    filename: 'global.css',
    allChunks: true,
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: ['aurelia', 'react', 'vendor']
  }),
  new CopyWebpackPlugin([
    { from: 'src/container-state.json' },
    { from: 'src/tos.html' },
    { from: 'src/silent-renew.html' },
  ]),
  new webpack.LoaderOptionsPlugin({
    options: {
      debug: metadata.DEBUG,
      devtool: metadata.devtool,
      context: process.cwd(),
      'html-minifier-loader': {
        removeComments: true,               // remove all comments
        collapseWhitespace: true,           // collapse white space between block elements (div, header, footer, p etc...)
        collapseInlineTagWhitespace: true,  // collapse white space between inline elements (button, span, i, b, a etc...)
        collapseBooleanAttributes: true,    // <input required="required"/> => <input required />
        removeAttributeQuotes: true,        // <input class="abcd" /> => <input class=abcd />
        minifyCSS: true,                    // <input style="display: inline-block; width: 50px;" /> => <input style="display:inline-block;width:50px;"/>
        minifyJS: true,                     // same with CSS but for javascript
        removeScriptTypeAttributes: true,   // <script type="text/javascript"> => <script>
        removeStyleLinkTypeAttributes: true // <link type="text/css" /> => <link />
      },
    }
  }),
];
