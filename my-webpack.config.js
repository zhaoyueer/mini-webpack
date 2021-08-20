const resolve = dir => require('path').join(__dirname, dir)

module.exports = {
  entry: './my-src/index.js',

  output: {
    path: resolve('my-dist'),
    filename: 'bundle.js'
  },

  mode: 'development'
}