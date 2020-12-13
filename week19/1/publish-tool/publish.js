let http = require('http');
let fs = require('fs');

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

