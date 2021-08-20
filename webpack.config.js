const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MyPlugin = require('./myPlugins/my-plugin')

const resolve = dir => require('path').join(__dirname, dir)

module.exports = {
  entry: './src/index.js',

  output: {
    path: resolve('dist'),
    filename: 'bundle.js'
  },

  mode: 'development',

  resolveLoader: {
    modules: ['node_modules', './myLoader']
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: [
          resolve('src')
        ],
        use: 'babel-loader'
      },
      {
        test: /\.less$/,
        // 自右向左执行
        use: ['my-style-loader','my-css-loader', 'my-less-loader']
      },
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      inject: true
    }),
    new CleanWebpackPlugin(),
    new MyPlugin()
  ]
}