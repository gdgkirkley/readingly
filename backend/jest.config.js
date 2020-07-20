const path = require('path')

module.exports = {
  testEnvironment: 'jest-environment-node',
  setupFilesAfterEnv: [require.resolve('./test/setupEnv.js')],
}
