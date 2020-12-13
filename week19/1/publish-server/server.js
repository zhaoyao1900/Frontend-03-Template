let http = require('http');

/**
 * 创建服务
 */
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