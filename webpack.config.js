const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebPackPlugin = require('copy-webpack-plugin')
const DotenvPlugin = require('dotenv-webpack')
const TerserPlugin = require('terser-webpack-plugin')
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')
const CleanTerminalPlugin = require('clean-terminal-webpack-plugin')

module.exports = (env, argv) => {
  const mode = argv.mode ? argv.mode : 'development'
  const isProduction = mode === 'production'

  const config = {
    mode,
    devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist')
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          sourceMap: true
        })
      ]
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
        minify: isProduction
      }),
      new CopyWebPackPlugin([
        {
          from: path.resolve(__dirname, 'public')
        }
      ]),
      !isProduction && new ErrorOverlayPlugin(),
      new CleanTerminalPlugin()
    ].filter(Boolean),
    stats: 'errors-only',
    devServer: {
      contentBase: path.resolve(__dirname, 'public'),
      stats: 'errors-only'
    }
  }

  return config
}
