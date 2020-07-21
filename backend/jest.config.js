const path = require('path')

module.exports = {
  roots: [path.join(__dirname, './src')],
  rootDir: path.join(__dirname, '.'),
  testEnvironment: 'node',
  moduleDirectories: [
    'node_modules',
    __dirname,
    path.join(__dirname, '../src'),
  ],
  coverageDirectory: path.join(__dirname, '../coverage'),
  collectCoverageFrom: ['**/src/**/*.js'],
  coveragePathIgnorePatterns: ['.*/__tests__/.*'],
  setupFilesAfterEnv: [require.resolve('./test/setupEnv.js')],
}
