/*
 * @Author: last order
 * @Date: 2019-08-10 17:57:30
 * @LastEditTime: 2020-05-02 19:39:25
 */
const path = require('path')
// const glob = require('glob')
// const env = require('./env')
const merge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base.config')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const OptimizationCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// const PurgecssPlugin = require('purgecss-webpack-plugin')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const smp = new SpeedMeasurePlugin()

const PATHS = {
  src: path.join(__dirname, '/src/')
}
console.log(PATHS)
const prodConfig = merge(webpackBaseConfig, {
  stats: {
    modules: false,
    source: false
  },
  // 忽略掉hls.js、dashjs，不进行打包
  externals: {
    'hls.js': 'hls.js',
    dashjs: 'dashjs'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'hello world',
      filename: 'index.html',
      template: './src/page/index.html',
      inject: true
    }),
    // 压缩css
    new OptimizationCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano')
    }),
    new BundleAnalyzerPlugin()
    // 去掉没用的css
    // new PurgecssPlugin({
    //   paths: glob.sync(`${PATHS.src}/*`),
    //   styleExtensions: ['.scss', '.css']
    // })
  ]
})

module.exports = smp.wrap(prodConfig)
