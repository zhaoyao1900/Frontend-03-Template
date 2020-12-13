let http = require('http');
let fs = require('fs');

/**
 * 构建请求
 */
let request = http.request({
    hostname:'127.0.0.1',
    port: '8882',
    method: 'POST',
    headers: {
        // 内容流式传输
        'Content-Type': 'application/octet-stream',
    }
}, response => {
    console.log(response);
});


/**
 * 监听文件数据
 */
let file = fs.createReadStream("./sample.html")
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

