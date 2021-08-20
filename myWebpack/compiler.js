const { AsyncSeriesHook } = require('tapable')

class Compiler {
  constructor(config, _callback) {
    const { entry, output, module, plugins } = config

    this.entryPath = entry
    this.distPath = output.path
    this.distName = output.fileName
    this.loaders = module.rules
    this.plugins = plugins
    this.root = process.cwd()
    this.compilation = {}
    this.entryId = getRootPath(this.root, entry, this.root)

    this.hooks = {
      beforeRun: new AsyncSeriesHook(['compiler']),
      afterRun: new AsyncSeriesHook(['compiler']),
    }
    this.mountPlugin()
  }

  mountPlugin() {
    for(let i = 0;i < this.plugins.length; i++) {
      const item = this.plugins[i]
      if ('apply' in item && typeof item.apply === 'function') {
        item.apply(this)
      }
    }
  }

  run() {
    this.hooks.beforeRun.callAsync(this)
  }
}