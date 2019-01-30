const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebPackPlugin = require('copy-webpack-plugin')
const DotenvPlugin = require('dotenv-webpack')

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'eslint-loader',
      },
    ],
  },
  plugins: [
    new DotenvPlugin({
      path: './.env',
      safe: true,
      systemvars: true,
      silent: true,
      defaults: false
    }),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      hash: true,
    }),
    new CopyWebPackPlugin([
      {
        from: 'public',
        force: true,
        ignore: 'index.html',
      },
    ]),
  ],
  devServer: {
    contentBase: './dist',
    stats: 'errors-only',
  },
}
