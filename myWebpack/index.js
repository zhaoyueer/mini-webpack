const webpack = require('./webpack.js')
const config = require('../my-webpack.config.js')

new webpack(config).run()