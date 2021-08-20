// 插件结构是个类，必须内置一个apply函数
class MyPlugin {
  constructor(options) {
  }

  apply(compiler) {
    // compiler 就是实例化的webpack对象，包含配置等信息
    // 同步钩子用tap注册；异步钩子用tapAsync注册
    // 事件名称可以为任意值，但是建议和我们的插件名称保持一致或者有语义
    compiler.hooks.emit.tapAsync('MyWebpackPlugin', (compilation, cb) => {
      const content = 'hello 这是一段文本'
      compilation.assets['test.txt'] = {
        source: function() {
          return content
        },
        size: function() {
          return content.length
        }
      }
      cb()
    })
  }
}

module.exports = MyPlugin