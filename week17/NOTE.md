# 1. 初始化与构建 | 初始化工具Yeoman（一）

>youman：构建

* npm init ：初始化 npm
* npm install： yeoman-generators 
* 创建文件目录
* 构建`generators`
* npm link：本地模块连接到标准模块中


## 配置 Generator 初始化 packjson 文件

`Generator`类中定义的方法支持`async`，并且会按先后顺序调用。

```js
initPackage(){
    // 描述要安装的依赖
    const pkgJson = {
        devDependencies: {
          eslint: '^3.15.0'
        },
        dependencies: {
          react: '^16.2.0'
        }
      };
  
      // 如果不存在 pakage.json 会直接创建
      this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
      // 安装依赖
    //   this.npmInstall();

}
```

## 实现和用户交互


```js
// 拿到用户输入项目名称
let answers = await this.prompt([
    {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.appname
    }
])
this.answers = answers;
```

# 2. 初始化与构建 | 初始化工具Yeoman（二）

## 支持对文件模版系统

* 指定文件下创建资源文件
* 在`Generator`中，实现文件的拷贝

```js
  async setep1() {
        this.fs.copyTpl(
            this.templatePath('t.html'),
            this.destinationPath('public/index.html'),
            { title: 'Templating with Yeoman' }
        );

    }
```


## yeoman 的依赖管理


```js
initPackage(){
    // 描述要安装的依赖
    const pkgJson = {
        devDependencies: {
          eslint: '^3.15.0'
        },
        dependencies: {
          react: '^16.2.0'
        }
      };
  
      // 如果不存在 pakage.json 会直接创建
      this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
      // 安装依赖
      this.npmInstall();

}
```

# 4. 初始化与构建 | Webpack基本知识
> Webpack是一个JavaScript应用程序模块化打包工具。最初为了`node`项目进行打包。

* webpack-cli：提供命令行功能
* npx webpack ：命令支持本地环境下安装`webpack`和`webpack-cli`，不再需要全局安装直接打包。

## 如何工作
会递归构建一个依赖关系图，图中包含了需要的各个模块，然后将根据关系图将模块打包成一个或者多个 bundle 。

## webpack 四个核心

* Entry
* Output
* Loader
* Plugins

### Entry

告诉 webpack 构建依赖图的起始模块，可以是多个。之后会构建依赖关系图。

```js
//webpack.config.js
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```
> Output 

设置 webpack 将打包好的 bundle 输出路径及文件名。

```js
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    //输出路径
    path: path.resolve(__dirname, 'dist'),
    //文件名
    filename: 'my-first-webpack.bundle.js'
  }
};
```
### loader 

webpack 通过 loader 将非 JavaScript 文件转换成 webpack 可以处理的模块，然后进行打包。

**本质上 loader 将所有类型的文件，转化为应用程序依赖图中可以直接引用的模块**

webpack 配置中 loader 两个目标

* 使用 test 属性，识别出应该被对应 loader 转换的那些文件。
* 使用 use 属性，转换这些文件，从而可被添加到依赖图中（并最终加到 bundle 中）。

```js
const path = require('path');

const config = {
  //关键依赖关系图入口
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  },
  // module 对象
  module: {
    rules: [
      {test: /\.txt$/, // 拿到对应的文件
       use: 'raw-loader' // 使用对应的 loader 进行转化
        }
-------

    ]
  }
};

module.exports = config;

``` 

### Plugins 

插件用途范围很广，充打包优化，到压缩，重新定义环境中的变量。
使用插件，只需要使用 `require()` ，将插件添加到 `plugins` 的数组中。

```js
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const webpack = require('webpack'); // 用于访问内置插件
const path = require('path');

const config = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  },
  plugins: [
   
    //通过 new 来创建 插件的实例。
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};

module.exports = config;

```

# 5. 初始化与构建 | Babel基本知识

>babel 是一个工具链，可以将`ECMAScript 2015+`代码转换为向后兼容的`JavaScript`语法。

* 语法转换
* 通过`Polyfill`在目标环境中支持语法新特性

## 创建`.babelrc`文件配置babel

`npm install --save-dev @babel/core @babel/cli @babel/preset-env`
`npm install --save @babel/polyfill`
```js
{
    // 配置安装好的配置包
    "presets":["@babel/preset-env"]
}
```

## webpack 中使用 `babel-loader` 转换特定文件


```js
module.exports= {
    entry: "./main.js",
    module:{
        rules: [
            {
                test: /^.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-dev"],
                        plugins: [["@babel/plugin-transfrom-react-jsx", {pragma: "createElement"}]]
                    }
                }
            }
        ]
    }
}
```