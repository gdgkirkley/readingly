const pkg = require('./package.json')

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: pkg.engines.node,
        },
      },
    ],
  ],
  plugins: [['@babel/plugin-proposal-class-properties', {loose: true}]],
}
