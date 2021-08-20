(function(modulesInfo){
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
      require('./my-src/index.js');
    })({"./my-src/index.js":{"dependencies":{"./other.js":"./my-src/other.js"},"code":"\"use strict\";\n\nvar _other = require(\"./other.js\");\n\nconsole.log(\"\".concat(_other.str, \" My Name is Webpack\"));"},"./my-src/other.js":{"dependencies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.str = void 0;\nvar str = \"hello world!\";\nexports.str = str;"}})