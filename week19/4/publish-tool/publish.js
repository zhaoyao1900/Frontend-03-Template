let http = require('http');
let fs = require('fs');
let archiver = require('archiver');
let child_process = require('child_process');
let queryString = require('querystring');


/**
 * 通过 github 进行登录
 * 创建 server ，接受 publish-server 回传 token
 * 进行发布
 */

 console.log('A======')
// 开始登录
child_process.exec(`https://github.com/login/oauth/authorize?client_id=Iv1.fe54da80ff149875`)


// 创建 server ，接受 publish-server 回传 token
http.createServer(function(request, response){
    let query = queryString.parse(request.url.match(/^\/\?([\s\S]+)$/)[1]);

}).listen(8083)


/*
// 获取文件大小
fs.stat('./sample.html', (err, stats) => {

    // 构建请求
    let request = http.request({
        hostname: '127.0.0.1',
        // port: '8882',
        port: '8082',
        method: 'POST',
        headers: {
            // 内容流式传输
            'Content-Type': 'application/octet-stream',
            'Content-Length': stats.size
        }
    }, response => {
        console.log(response);
    });


    //监听文件数据
    let file = fs.createReadStream("./sample.html")

    const archiver = archiver('zip',{
        zlib:{
            level: 9
        }
    })
    archiver.directory('./sample/', false);
    file.pipe(request);

    // file.on('end', () => request.end());


})
*/

