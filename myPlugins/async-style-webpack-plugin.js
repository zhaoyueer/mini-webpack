const HtmlWebpackPlugin = require('html-webpack-plugin')

const PLUGIN_NAME = 'StyleAsyncWebpackPlugin'

class StyleAsyncPlugin {
  constructor(options) {
    this.options = options
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tap(PLUGIN_NAME, data => {
        return this.generateAsyncStyle(data)
      })
    })
  }

  generateAsyncStyle(data) {
    for(let tag of data.headTags) {
      if (tag.tagName === 'link' && tag.attributes.rel === 'stylesheet') {
        tag.attributes.media = 'print'
        tag.attributes.onload = "this.media='all'"
      }
      return data
    }
  }
}