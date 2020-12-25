module.exports = {
  test: /\.html$/,
  exclude: /index\.html$/, // index.html will be taken care by HtmlWebpackPlugin
  use: [
    'raw-loader',
    'html-minifier-loader'
  ]
};
