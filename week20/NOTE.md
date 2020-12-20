# 1. 持续集成 | 发布前检查的相关知识

## 传统客户端

* daily build ：服务端定时 build 代码
* build verification test (BVT)：构建前冒烟测试

## 前端持续集成
代码提交前进行检查
* eslint：代码格式、简单代码错误。
* 无头浏览器：生成项目 DOM 树，验证最终渲染正确性。


# 2. 持续集成 | Git Hooks基本用法

创建 hook 文件
* 新建`README.md`
* `ls -a` 查看隐藏文件夹
* 新建可执行 hook 文件 `pre-commit` 去掉`.sample`文件后缀。

客户端主要是用
* pre-commit
* pre-push

服务端
* pre-receive

修改执行 hook 文件权限
* `chmod +x ./pre-commit` 添加权限

## 编写 pre-commit 

* 标注脚步执行引擎

```js
#!/use/bin/env node
console.log("hello hook")
```

* 阻止提交

```js
let process = require("process");
process.exitCode = 1;
```

# 4. 持续集成 | ESLint API及其高级用法

配置`eslint`检查始终是`git add`的文件,而不是当前目录的文件
* `git stash push -k`：
* `git stash pop`：回到未 add 前文件


```js
let process = require("process");
let child_process = require("child_process");
const { ESLint } = require("eslint");

// 执行命令
function exec(name) {
    return new Promise(function(resolve){
        child_process.exec(name, resolve);
    });
}

(async function main() {
  // 关闭 fix 避免代码提交修改代码
  const eslint = new ESLint({ fix: false });

  // 只检查 commit 文件
  await exec("git stash push -k");

  // 检查文件路径
  const results = await eslint.lintFiles(["index.js"]);

  // 检查完成回到之前修改文件状态
  await exec("git stash pop")

  // 4. Format the results.
  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(results);

  for(let result of results){
      // 有错误阻止提交
      if(result.errorCount){
          process.exitCode = 1;
      }
  }

  // 5. Output it.
  console.log(resultText);
})().catch((error) => {
  process.exitCode = 1;
  console.error(error);
});
```

# 5. 持续集成 | 使用无头浏览器检查DOM

## Headless
> 不显示浏览器界面UI的情况下运行浏览器，并提供变成能力。

[Headless](https://developers.google.com/web/updates/2017/04/headless-chrome?hl=en)

添加`Chrome`命令：
* alias chrome="/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome"


## puppeteer

* npm i puppeteer


```js
const puppeteer = require('puppeteer');
 
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // 获取特定页面 DOM
  await page.goto('https://localhost:8080/main.html');
  // 获取 a 标签
  const  a = await page.$("a");
  console.log(a.asElement().boxModel());
 
  // 获取图片
  const imgs = await page.$$("a");
  console.log(imgs);

})();
```

