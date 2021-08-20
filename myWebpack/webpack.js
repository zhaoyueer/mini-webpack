const fs = require('fs')
const path = require('path')
const BabelParser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const { transformFromAst } = require('@babel/core')

class webpack {
  constructor(options) {
    // 读取配置文件的信息
    const { entry, output } = options || {}
    this.entry = entry
    this.output = output

    this.modulesInfo = []
  }

  run() {
    const moduleParseInfo = this.parser(this.entry)
    this.modulesInfo.push(moduleParseInfo)

    for(let i = 0; i< this.modulesInfo.length; i++) {
      const dependencies = this.modulesInfo[i].dependencies
      if (dependencies) {
        for(let j in dependencies) {
          this.modulesInfo.push(this.parser(dependencies[j]))
        }
      }
    }

    // 数据结构的转换
    const obj = {}
    this.modulesInfo.forEach((item) => {
      obj[item.modulePath] = {
        dependencies: item.dependencies,
        code: item.code
      }
    })
    this.bundleFile(obj)
  }

  parser(modulePath) {
    // 编译模块，参数：接收一个模块的路径
    // 1、分析是否有依赖？有依赖提取依赖的路径
    // 2、编译模板生成chunk
    const content =  fs.readFileSync(modulePath, "utf-8")
    const ast = BabelParser.parse(content, {
      sourceType: 'module'
    })

    const dependencies = {} // 保存依赖路径
    traverse(ast, {
      ImportDeclaration({node}) {
        const newPath = `./${path.join(path.dirname(modulePath), node.source.value)}`
        
        dependencies[node.source.value] = newPath
      }
    })

    const {code} = transformFromAst(ast, null, {
      presets: ["@babel/preset-env"]
    })
    return {
      modulePath,
      dependencies,
      code
    }
  }

  bundleFile(obj) {
    // 生成bundle文件
    const bundlePath = path.join(this.output.path, this.output.filename)
    const dependenciesInfo = JSON.stringify(obj)
    const content = `(function(modulesInfo){
      function require(modulePath) {
        // 将相对入口文件的路径替换成相对于项目根文件
        function newRequire(relativePath) {
          return require(modulesInfo[modulePath].dependencies[relativePath])
        };
        const exports = {};

        ;(function(require, code) {
          // require('./other.js') -> newRequire('./other.js') = require('./src/other.js')
          eval(code)
        })(newRequire, modulesInfo[modulePath].code);
        
        return exports;
      }
      require('${this.entry}');
    })(${dependenciesInfo})`
    fs.writeFileSync(bundlePath, content, 'utf-8')
  }
}

module.exports = webpack