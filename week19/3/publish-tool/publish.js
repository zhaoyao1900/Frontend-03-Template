let http = require('http');
let fs = require('fs');
let archiver = require('archiver');

/**
 * 获取文件大小
 */
fs.stat('./sample.html', (err, stats) => {

    /**
     * 构建请求
     */
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


    /**
     * 监听文件数据
     */
    let file = fs.createReadStream("./sample.html")

    const archiver = archiver('zip',{
        zlib:{
            level: 9
        }
    })
    archiver.directory('./sample/', false);
    archiver.finalize();
    archiver.pipe(fs.createWriteStream('temp.zip'));

    // file.on('end', () => request.end());


})





