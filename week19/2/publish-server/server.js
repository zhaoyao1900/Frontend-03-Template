let http = require('http');
let fs = require('fs');

/**
 * 创建服务
 */
http.createServer(function(request, response){
    console.log(request.headers)

    // 创建可写入的文件流
    let outFile = fs.createWriteStream('../server/public/index.html');


    request.on('data', chunk => {
        // 写入指定文件
        outFile.write(chunk);
        console.log(chunk);
    })

    request.on('end', chunk => {
        outFile.write(chunk);
        outFile.end();
        response.end('finshed', chunk.toString())
    })

}).listen(8082)