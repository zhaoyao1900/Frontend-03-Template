const http = require('http');

// 创建服务
http.createServer((request, response)=>{
	let body = [];
	// 监听 request
	request.on('error', (err) =>{
		console.error(err);
	}).on('data', (chunk) => {
		body.push(chunk)
	}).on('end', ()=>{
		body = Buffer.concat(body).toString();
		console.log('server-body', body);
		response.writeHead(200, {'Content-Type':'text/html'});
        response.end(`<html maa=a>
            <head>
                <style>
                    body div #myid{
                        width: 100px;
                        background-color: #ff5000;
                    }
                    body div img{
                        width: 30px;
                        background-color: #ff1111;
                    }
                </style>
            </head>
            <body>
                <div>
                    <img id="myid" />
                    <img />
                </div>
            </body>
        </html>`);
	})
}).listen(8088);

console.log("server started")

