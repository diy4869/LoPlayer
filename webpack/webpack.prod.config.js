// const path = require('path')
// const glob = require('glob')
const env = require('./env')
const merge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base.config')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizationCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const prodConfig = merge(webpackBaseConfig, {
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 0, // 生产块的最小大小
      maxSize: 0,
      name: true,
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2
        }
      }
    },
    minimizer: [
      new TerserPlugin({
        parallel: 4,
        sourceMap: env === 'development',
        terserOptions: {
          cache: true,
          compress: {
            drop_debugger: true,
            drop_console: true
          }
        }
      })
    ]
  },
  stats: {
    modules: false,
    source: false
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
    })
    // 去掉没用的css
    // new PurgecssPlugin({
    //   paths: glob.sync(path.join(__dirname, 'src'))
    // }),
  ]
})

module.exports = prodConfig
