const webpack = require('webpack')
const path = require('path')
const env = require('./env')
const webpackBaseConfig = require('./webpack.base.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
console.log('__dirname:')
console.log(__dirname)

const devConfig = merge(webpackBaseConfig, {
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    host: 'localhost',
    port: 8080,
    hot: true,
    compress: true,
    noInfo: true,
    overlay: {
      warnings: true,
      errors: false
    },
    clientLogLevel: 'none'
  },
  devtool: env === 'development' ? 'source-map' : 'eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(env)
    }),
    // plugin的解析顺序是从前往后的
    new HtmlWebpackPlugin({
      title: 'hello world',
      filename: 'index.html',
      template: './src/page/index.html',
      inject: true
    }),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: ['项目成功启动，地址是localhost:8080']
      }
    })
  ]
})
module.exports = devConfig
