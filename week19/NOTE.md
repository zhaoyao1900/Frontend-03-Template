# 1. 实现一个线上 Web 服务 | 初始化server

发布系统的组成
1. 线上服务系统：为用户提供线上服务。
2. 发布系统：向线上服务系统发布代码。
3. 发布工具：对接发布和线上系统的命令行工具。


## 在虚拟机上安装 Ubuntu 系统

* 下载安装： Oracle VM VirtualBox [VirtualBox](https://www.virtualbox.org/)
* 下载 [Ubuntu]( https://releases.ubuntu.com/20.04/)

安装系统修改配置：
* 修改镜像地址：http://mirrors.aliyun.com/ub
* 安装 nodejs  `sudo apt install nodejs`
* 安装 npm `sudo apt install npm`
* 安装 node 版本管理 `sudo npm install -g n`
* 更新 nodejs `n latest` + 运行`PATH="$PATH"`



# 2. 实现一个线上Web服务 | 利用Express，编写服务器（一）

## 使用命令行工具初始化 Express 服务工程

* `npx express-generator`
* `npm install`
* `npm start` 启动服务
*  创建 index.html 静态文件

# 3. 实现一个线上Web服务 | 利用Express，编写服务器（二）

# 启动服务器`ssh`
`service ssh start`


## 设置虚拟机端口转发规则

host port：8022、8080
guest port：22、3000


## 通过 ssh 将 server 工程拷贝到虚拟机上面

直接拷贝所有文件
` scp -P 8022 -r ./* zhaoyao@127.0.0.1:/home/zhaoyao/server`


# 4. 实现一个发布系统 | 用node启动一个简单的server

## 初始化 `publish-server` 和 `publish-tool`

* `makir publish-server`
* `npm init`


## 编写`publish-server`

```js
let http = require('http');

/**
 * 创建服务
 */
http.createServer(function(request, response){
    // 设置请求响应
    response.end("hello world")

}).listen(8082)
```

# 5. 实现一个发布系统 | 编写简单的发送请求功能

publish-tool 发送请求到 publish-server

```js
let http = require('http');
/**
 * 构建请求
 */
let request = http.request({
    hostname:'127.0.0.1',
    port: '8082',
    method: 'POST',
    headers: {
        // 内容流式传输
        'Content-Type': 'application/octet-stream',
    }
}, response => {
    console.log(response);
});
```

# 6. 实现一个发布系统 | 简单了解Node.js的流

## 可读流：stream.Readable

* Event: 'data' 监听流数据，逐步读取。
* Event: 'end' 监听读取完成最后一部分。

```js

// 创建流文件
let file = fs.createReadStream("./package.json")
/**
 * 监听文件数据
 */
file.on('data', chunk => {
    console.log(chunk.toString())
    request.write(chunk)
})
/**
 * 监听传输完毕
 */
file.on('end', chunk => {
    console.log("read finshed")
    request.end(chunk);
})
```

## 可写流：writable.write(chunk[, encoding][, callback])


`publish-tool` 发送文件
```js
/**
 * 监听文件数据读取并写入请求
 */
let file = fs.createReadStream("./package.json")
file.on('data', chunk => {
    console.log(chunk.toString())
    request.write(chunk)
})
/**
 * 监听读取完毕，发送请求
 */
file.on('end', chunk => {
    console.log("read finshed")
    request.end(chunk);
})
```

`publish-server` 接受

```js
let http = require('http');
http.createServer(function(request, response){
    console.log(request.headers)
    // 读取请求文件
    request.on('data', chunk => {

        console.log(chunk);
    })
    request.on('end', chunk => {
        response.end('finshed', chunk.toString())
    })

}).listen(8082)
```

# 7. 实现一个发布系统 | 改造server

* publish-server 

```js
"publish": "scp -r -P 8022 ./* zhaoyao@127.0.0.1:/home/zhaoyao/publish-server",
```

> 端口转发
host port：8882
guest port：8082

# 8. 实现一个发布系统 | 实现多文件发布

## 改写流的操作
* pipe ：将可读的流倒入可写的流中


## 获取文件大小

```js
/**
 * 获取文件大小
 */
fs.stat('./sample.html', (err, stats) => {

    /**
     * 构建请求
     */
    let request = http.request({
        hostname: '127.0.0.1',
        port: '8882',
        method: 'POST',
        headers: {
            // 内容流式传输
            'Content-Type': 'application/octet-stream',
            'Content-Length': stats.size
        }
    }, response => {
        console.log(response);
    });


    /**
     * 监听文件数据
     */
    let file = fs.createReadStream("./sample.html")
    file.pipe(request);
    file.on('end', () => request.end());

})
```

## publish-tool  使用`archiver`压缩文件

* `npm install --save archiver`

```js   
let file = fs.createReadStream("./sample.html")

const archiver = archiver('zip',{
    zlib:{
        level: 9
    }
})
archiver.directory('./sample/', false);
archiver.finalize();
archiver.pipe(fs.createWriteStream('temp.zip'));
```


## publish-server 使用`unzipper`解压文件

* `npm install --save unzipper`


```js
/**
 * 创建服务
 */
http.createServer(function(request, response){
    console.log(request.headers)

    // 创建可写入的文件流
    let outFile = fs.createWriteStream('../server/public/index.html');
    // 解压压缩包到指定文件夹
    request.pipe(unzipper.Extract({
        path: '../server/public/',
    }));

}).listen(8082)
```

# 9. 实现一个发布系统 | 用GitHub oAuth做一个登录实例

## 创建 github app 

流程：
1. Request a user's GitHub identity：先登录拿到 code 
2. Users are redirected back to your site by GitHub：拿 code 换 token
3. Your GitHub App accesses the API with the user's access token：拿着 token 访问数据


##用GitHub  oAuth 实现发布流程

1. `publish-tool` 通过 github 进行登录
2. `publish-server`  
     auth 路由：
    1. 接受 code
    2. 用 code + client_id + client_secret 换 token
    publish 路由
    3. 用 token 获取用户信息, 检查权限
    4. 接受发布 publish 
3. 创建 server ，接受 publish-server 回传 token
4. 进行发布


