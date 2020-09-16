/*
 * @Author: last order
 * @Date: 2019-08-10 17:57:24
 * @LastEditTime: 2020-03-22 18:34:52
 */
const webpack = require('webpack')
const path = require('path')
const env = require('./env')
const webpackBaseConfig = require('./webpack.base.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { merge }  = require('webpack-merge')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const address = require('address')
const portFinder = require('portfinder')

const devConfig = merge(webpackBaseConfig, {
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    host: 'localhost',
    hot: true,
    compress: true,
    noInfo: true,
    quiet: true,
    overlay: {
      warnings: true,
      errors: false
    },
    clientLogLevel: 'none'
  },
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
    })
  ]
})

portFinder.getPortPromise({
  port: 8080,
  stopPort: 9000
}).then(res => {
  devConfig.devServer.port = res
  devConfig.plugins.push(
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [
          ` 项目启动成功，地址是：\n
                            http://localhost:${res}\n
                            http://${address.ip()}:${res}
          `
        ]
      }
    })
  )
})

module.exports = devConfig
