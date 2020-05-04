/*
 * @Author: last order
 * @Date: 2019-08-11 17:27:29
 * @LastEditTime: 2020-05-04 12:48:10
 */
module.exports = {
  presets: [
    [
      '@babel/preset-env', {
        targets: {
          node: 'current',
          browsers: 'last 2 version'
        },
        corejs: '3',
        useBuiltIns: 'usage'
      }
    ]
  ],
  plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-proposal-private-methods', '@babel/plugin-proposal-optional-chaining', '@babel/plugin-syntax-optional-chaining']
}
