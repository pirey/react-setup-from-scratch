const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebPackPlugin = require('copy-webpack-plugin')
const DotenvPlugin = require('dotenv-webpack')
const TerserPlugin = require('terser-webpack-plugin')
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')

module.exports = (env, argv) => {
  const mode = argv.mode ? argv.mode : 'development'

  const config = {
    mode,
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist')
    },
    optimization: {
      minimize: mode === 'production',
      minimizer: mode === 'production' ? [new TerserPlugin()] : []
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'eslint-loader'
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader'
        }
      ]
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
        template: path.resolve(__dirname, 'public/index.html'),
        filename: 'index.html',
        hash: true,
        minify: mode === 'production'
      }),
      new CopyWebPackPlugin([
        {
          from: path.resolve(__dirname, 'public')
        }
      ]),
      mode !== 'production' && new ErrorOverlayPlugin()
    ].filter(Boolean),
    stats: 'errors-only',
    devServer: {
      contentBase: path.resolve(__dirname, 'public'),
      stats: 'errors-only'
    }
  }

  return config
}
