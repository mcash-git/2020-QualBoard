module.exports = {
  test: /\.ts$/,
  exclude: [/node_modules/, /\.worker/, /2020-/],
  use: [
    {
      loader: 'ts-loader',
    }
  ]
};
