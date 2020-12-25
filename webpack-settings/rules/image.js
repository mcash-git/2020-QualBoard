module.exports = {
  test: /\.(png|jpeg|jpg|gif)$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: 'images/[path][name].[ext]',
        context: './images'
      }
    }
  ]
};
