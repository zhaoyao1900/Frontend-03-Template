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

# 4. 单元测试工具 | 对html-parser进行单元测试

## 安装环境依赖

```js
  "devDependencies": {
    "@babel/core": "^7.12.9",
    "@babel/preset-env": "^7.12.7",
    "@babel/register": "^7.12.1",
    "@istanbuljs/nyc-config-babel": "^3.0.0",
    "babel-plugin-istanbul": "^6.0.0",
    "cross-env": "^7.0.2",
    "mocha": "^8.2.1",
    "nyc": "^15.1.0",
    "css": "^3.0.0"
  }
```

## 配置 .babelrc  .nycrc 文件

```js
// .babelrc
{
    "presets": [
      "@babel/preset-env"
    ],
    "plugins": [
        "istanbul"
      ],
    // 限制输出 sourceMap 文件数量，便于 debug
    "sourceMaps": "inline"
}



// .nycrc
 {
    "extends": "@istanbuljs/nyc-config-babel"
}
```

## 配置`lunch.json`

```js
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "pwa-node",
            "request": "launch",
            "name": "Launch Program",
            "skipFiles": [
                "<node_internals>/**"
            ],
            // node 运行参数
            "runtimeArgs": [
                "--require", "@babel/register"
            ],
            // 还原经 babel 翻译后，行位置变化的问题
            "sourceMaps": true,
            "program": "${workspaceFolder}/node_modules/.bin/mocha"
        }
    ]
}
```


## 编写单元测试，目标是 100% 函数覆盖和 90% 以上的行覆盖

>通过`nyc`得出的覆盖率函数、行覆盖率信息，回归到测试代码，修正bug,或是增加测试输入来提高覆盖率。


```js
var assert = require('assert');
import parseHTML from "../src/parser.js";

// 将测试分组
describe("parse html:", function () {

    // 根据 nyc 给出未覆盖的行数，编写单元测试。

    // 测试单纯标签
    it("<a>abc</a>", function() {
        let tree = parseHTML("<a>abc</a>");
        assert.strictEqual(tree.children[0].tagName, "a");
        assert.strictEqual(tree.children[0].children.length, 0);
    });

    // 测试带属性标签
    it("<a href='//google.com'></a>", function() {
        let tree = parseHTML("<a href='//google.com'></a>");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });

    // 没有等号赋值属性
    it("<a href ></a>", function() {
        let tree = parseHTML("<a href ></a>");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });

    // 测试设置多个属性
    it("<a href id ></a>", function() {
        let tree = parseHTML("<a href id ></a>");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });

    it("<a href='abc' id ></a>", function() {
        let tree = parseHTML("<a href='abc' id ></a>");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });


    it("<a id=abc ></a>", function() {
        let tree = parseHTML("<a id=abc ></a>");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });

    // 测试自封闭标签
    it("<a />", function() {
        let tree = parseHTML("<a />");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });

    it('<a id=\'a\' />', function() {
        let tree = parseHTML('<a id=\'a\' />');
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });

    it('<A /> upper case', function() {
        let tree = parseHTML('<A /> upper case');
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });

    it('< >', function() {
        let tree = parseHTML('< >');
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].type, "text");
    });

    it("<a style='' />", function() {
        let tree = parseHTML("<a style='' />");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].type, "text");
    });

    let str = `<html a='maa'>
        <head>
            <style>
                #container{
                    width: 500px;
                    height: 300px;
                    display: flex;
                    background-color: rgb(255,255,255);
                }
                #container #myid{
                    width: 200px;
                    height: 100px;
                    background-color: rgb(255,0,0);
                }
                #container .c1{
                    flex: 1;
                    background-color: rgb(0,255,0);
                }
            </style>
        </head>
        <body>
            <div id='container'>
                <div id='myid'/>
                <div class='c1'/>
            </div>
        </body>
    </html>`

    it(str, function() {
        let tree = parseHTML(str);
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].type, "text");
    });

    // 未闭合标签
    it("<head </head>", function() {
        let tree = parseHTML("<head </head>");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].type, "text");
    })

    it(`<head id="head"></head>`, function() {
        let tree = parseHTML(`<head id="head"></head>`);
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].type, "text");
    })

    it(`<head id=head value ></head>`, function() {
        let tree = parseHTML(`<head id=head value ></head>`);
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].type, "text");
    })

    it(`<head id=head value/ />`, function() {
        let tree = parseHTML(`<head id=head value/ />`);
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].type, "text");
    })

    it(`<head id=head'> >`, function() {
        let tree = parseHTML(`<head id='head'> > `);
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].type, "text");
    })

    it(`<head id=>`, function() {
        let tree = parseHTML(`<head id=>`);
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].type, "text");
    })

    it(`<head />`, function() {
        let tree = parseHTML(`<head/>`);
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].type, "text");
    })

    it(`<head></a>`, function() {
        let tree = parseHTML(`<head></a>`);
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].type, "text");
    })
    it(`<head></head id='='>`, function() {
        let tree = parseHTML(`<head></head  id='='>`);
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].type, "text");
    })
})
```


# 5. 单元测试工具 | 所有工具与generator的集成

## 在`yoman`中配置 `mocha`和`nyc`

```js
this.npmInstall([
    "webpack@4.2.0",
    "webpack@4.44.2",
    "vue-loader",
    "vue-template-compiler",
    "vue-style-loader",
    "css-loader",
    "copy-webpack-plugin",
    "html-webpack-plugin",
    "mocha",
    "nyc",
    "@babel/core",
    "@babel/preset-env",
    "@babel/register",
    "@istanbuljs/nyc-config-babel",
    "babel-plugin-istanbul",
    "cross-env",
],
    { "save-dev": true }); 
```

## 新增测试文件的拷贝

* .babelrc
* .nycrc
* .sample-test.js

```js

this.fs.copyTpl(
    this.templatePath('.babelrc'),
    this.destinationPath('.babelrc')
)

this.fs.copyTpl(
    this.templatePath('.nycrc'),
    this.destinationPath(".nycrc"),
    {title: this.answers.appname}
)

this.fs.copyTpl(
    this.templatePath('.sample-test.js'),
    this.destinationPath("test/sample-test.js"),
    {title: this.answers.appname}
)
```

## 配置`webpack`中`babel`

```js
module: {
    rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            'css-loader'
          ]
        },
        {
            test: /\.js$/,
            use: {
              loader: 'babel-loader',
              options: {
                  presets: ['@babel/preset-env']
              }
            }
        },
      ]
},
```

## 新增测试、覆盖率命令

```js
// 描述要安装的依赖
const pkgJson = {
    "name": answers.appname,
    "version": "1.0.0",
    "description": "工具链-1",
    "main": "generators/app/index.js",
    "scripts": {
        "test": "mocha --require @babel/register",
        "coverage": "nyc mocha",
        "build": "webpack"
    },
    "author": "",
    "license": "ISC",
    devDependencies: {
    },
    dependencies: {
    }
};
```