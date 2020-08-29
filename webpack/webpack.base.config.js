/*
 * @Author: last order
 * @Date: 2019-08-12 20:54:07
 * @LastEditTime: 2020-05-02 19:37:13
 */
const path = require('path')
const env = require('./env')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  mode: env,
  entry: {
    main: './src/index.ts'
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'index.js',
    library: 'LoPlayer',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  module: {
    /**
     * webpack loader 加载顺序
     * mini/style,css,postcss,sass/less/stylus
     */
    rules: [
      {
        test: /\.css$/,
        // loader的解析顺序是从后往前的，所以mini要放前面
        use: [{
          loader: MiniCssExtractPlugin.loader
        }, 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(sass|scss)/,
        use: [{
          loader: MiniCssExtractPlugin.loader
        }, 'css-loader', 'postcss-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              fallback: 'responsive-loader',
              limit: 4096,
              quality: 50,
              name: '[name].[hash:8].[ext]',
              outputPath: 'assets/img'
            }
          }
        ]
      },
      {
        test: /\.(eot|ttf|woff|woff2|svg)/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[hash:8].[ext]',
            outputPath: 'assets/fonts'
          }
        }]
      },
      // {
      //   test: /\.svg$/,
      //   loader: 'svg-inline-loader'
      // },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ['ts-loader']
      },
      {
        test: /\.art$/,
        loader: 'art-template-loader'
      }
    ]
  },
  devtool: env === 'development' ? 'source-map' : 'none',
  resolve: {
    alias: {
      '@': path.join(__dirname, '../src'),
      '~': path.join(__dirname, '../src/assets')
    },
    // false可以不带扩展
    enforceExtension: false,
    // 自动解析确定的扩展
    extensions: ['.ts', '.js']
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: 8,
        sourceMap: env === 'development',
        terserOptions: {
          cache: true,
          compress: {
            drop_debugger: env === 'production',
            drop_console: env === 'production'
          }
        }
      })
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(env)
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[contentHash:8].css'
    })
  ]
}
