// webpack js rules for transpiling js

module.exports = {
  test: /\.js(x?)$/i,
  exclude: [/node_modules/, /\.worker/, /2020-/],
  use: [
    {
      loader: 'babel-loader'
    }
  ]
};
