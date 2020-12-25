// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path');

module.exports = {
  resolve: {
    modules: [path.resolve(__dirname, "../src"), path.resolve(__dirname, "../sass"), "node_modules"],
    extensions: ['.jsx', '.js', '.sass'],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'global.css',
      allChunks: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: [/\.scss$/, /\.sass$/],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
              },
            },
            {
              loader: 'postcss-loader',
              options: {}
            },
            {
              loader: 'sass-loader'
            },
          ],
        }),
        include: path.resolve(__dirname, '../')
      },
      {
        test: /\.(ttf|eot|svg|woff2?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            }
          }
        ]
      },
      {
        test: /\.md$/,
        use: "raw-loader"
      },
    ],
  },
};
