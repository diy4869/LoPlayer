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
  plugins: ['@babel/plugin-transform-runtime']
}
