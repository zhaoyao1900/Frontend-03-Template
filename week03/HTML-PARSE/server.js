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
                    .text{
                      font-size: 10px;
                    }
                    .textBorder{
                        border: 1px solid #dadce0;
                    }
                    div.a#a{
                        background-color: #f1e05a
                    }
                </style>
            </head>
            <body>
                <div class="box">
                    <img id="myid" />
                    <span class="text textBorder"></span>
                    <img id="a" class="a"/>
                </div>
            </body>
        </html>`);
	})
}).listen(8088);

console.log("server started")

