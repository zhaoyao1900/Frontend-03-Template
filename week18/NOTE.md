# 1. 单元测试工具 | Mocha（一）
>单元测试框架

## 安装依赖

* 全局安装：`npm install --global mocha`
* 项目内：`npm install --save-dev mocha`


## 编写单元测试

* 准备测试文件

```js
function add(a, b) {
    return a + b; 
}

// mocha 默认使用 node 模块化系统
module.exports = add;
```

* 创建 `test` 目录并创建 `test.js`

```js
var assert = require('assert');
var add  = require('../add.js')

// 将测试分组
describe("add function testing", function () {
    
    // 具体测试
    it('1 + 2 should return 3', function() {
        assert.equal(add(1, 2), 3);
    });
    
    it('-5 + 2 should return -3', function() {
        assert.equal(add(-5, 2), -3);
    });

})
```

# 2. 单元测试工具 | Mocha（二）
> 解决无法使用`es6`模块系统的问题


## 安装`babel`依赖

* `npm install --save-dev @babel/core`
* `npm install --save-dev @babel/register`
* `npm install --save-dev @babel/preset-env`
* 创建`.babelrc` 文件配置babel

```js
{
    "presets": ["@babel/preset-env"]
}
```

## 修改`packjson`测试命令

```js
"scripts": {
// --require 指定模块系统 
"test": "mocha --require @babel/register"
},
```

## 替换到模块系统
```js
// add.js
export default function add(a, b) {
    return a + b; 
}
// test.js
var assert = require('assert');
import add from "../add.js";

// 将测试分组
describe("add function testing", function () {

    it('1 + 2 should return 3', function() {
        assert.equal(add(1, 2), 3);
    });
    
    it('-5 + 2 should return -3', function() {
        assert.equal(add(-5, 2), -3);
    });

})
```


# 3. 单元测试工具 | code coverage
> 支持计算测试覆盖率

## 安装依赖

* `npm install --save-dev nyc`


## 使用`node` 模块系统

```js
function add(a, b) {
    return a + b;
}

function mul(a, b) {
    return a + b;
}

module.exports.add = add;
module.exports.mul = mul;


// test.js
var assert = require('assert');
var add = require('../add.js').add;
var mul = require('../add.js').mul;

// 将测试分组
describe("add function testing", function () {

    it('1 + 2 should return 3', function() {
        assert.equal(add(1, 2), 3);
    });
    
    it('-5 + 2 should return -3', function() {
        assert.equal(add(-5, 2), -3);
    });

    it('-5 * 2 should return -10', function() {
        assert.equal(mul(-5, 2), -10);
    });
})
```




## 修改`package.json`测试命令

```js
// 使用 node 模块系统
  "scripts": {
    "nyc-test": "nyc mocha"
  },
```

## 使用`ES6`模块系统

建立`babel`和`nyc` 之间的链接。

* `npm install --save-dev babel-plugin-istanbul`
* `babelrc` 文件中添加测试模块

```json
"env": {
    "test": {
        "plugins": [
            "istanbul"
        ]
    }
}
```

* `npm install --save-dev istanbuljs/nyc-config-babel`
* 创建`.nycrc` 文件

```js
{
    "extends": "@istanbuljs/nyc-config-babel"
}
```


