let http = require('http');
let https = require('https');
let fs = require('fs');
const unzipper = require('unzipper');
let queryString = require('querystring');

/**
 * 创建服务
 */
http.createServer(function(request, response){
    console.log(request.headers)

    if(request.url.match(/^\/auth\?/)){
       return auth(request, response)
    }

    if(request.url.match(/^\/publish\?/)){
        return publish(request, response)
     }

    // 创建可写入的文件流
    let outFile = fs.createWriteStream('../server/public/index.html');
    request.pipe(outFile);
    // 解压压缩包到指定文件夹
    request.pipe(unzipper.Extract({
        path: '../server/public/',
    }));

}).listen(8082)

/**
 *  auth 路由
 * 1. 接受 code
 * 2. 用 code + client_id + client_secret 换 token
 */
 function auth(request, response){
    let query = queryString.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1]);
    getToken(query.code, function(info) {
        response.wirte(`<a href='http://localhost:8083/?token=${info.access_token}'></a>`);
        response.end();
    })


 }

 /**
  * publish 路由
  * 3. 用 token 获取用户信息, 检查权限
  * 4. 接受发布 publish 路由
  * @param {*} request 
  * @param {*} response 
  */
function publish(request, response){
    let query = queryString.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1]);
    getUser(query.token, info => {
        // 解压压缩包到指定文件夹
        request.pipe(unzipper.Extract({
            path: '../server/public/',
        })); 
        request.on('end', ()=> {
            response.end('success')
        })
    })
}

/**
 * 获取 token
 * @param {*} code 
 */
function getToken(code, callback) {

    let request = https.request({
        hostname: 'github.com',
        path: `https://github.com/login/oauth/access_token?code=${code}&client_id=Iv1.fe54da80ff149875&client_secret=473d6399d192d74e170a7862982ad3e00a0eb9d3`,
        method: 'POST',
        port: 443,
    }, function(response){
        let body = "";
        response.on('data', chunk => {
            body += chunk.toString();
        })

        response.on('end', chunk => {
            let o = queryString.parse(body);
            callback(o);
        })

    });
    request.end();
}

/**
 * 获取用户
 * @param {*} token 
 */
function getUser(token, callback){
    let request = https.request({
        hostname: 'api.github.com',
        path: `/user`,
        method: 'GET',
        port: 443,
        headers:{
            "Authorization": `token ${token}`,
            "User-Agent": "toy-publish-zy"
        }
    }, function(response){
        let body = "";
        response.on('data', chunk => {
            body += chunk.toString();
        })

        response.on('end', chunk => {
            callback(JSON.parse(body));
        })

    });
    request.end();
}