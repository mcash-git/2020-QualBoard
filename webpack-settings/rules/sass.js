const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
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
};
