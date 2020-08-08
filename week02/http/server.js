const http = require('http');

// 创建服务
http.createServer((request, response)=>{
	let body = [];
	// 监听 request
	request.on('error', (err) =>{
		console.error(err);
	}).on('data', (chunk) => {
		body.push(chunk.toString())
	}).on('end', ()=>{
		// body = Buffer.concat(body).toString();
		console.log('server-body', body);
		response.writeHead(200, {'Content-Type':'text/html'});
		response.end(' Hello World\n');
	})
}).listen(8088);

console.log("server started")




// // BBC ABCDAB ABCDABCDABDE
// // ABCDABD
// const targetStr = "BBC ABCDAB ABCDABCDABDE";
// const matchStr = "ABCDABD";

// // 部分匹配表
// let prefixArr = [];
// let suffixArr = [];
// let tempStr = "";
// let tempStr1 = "";

// // 前缀集合
// for(let i = 0; i <= matchStr.length - 2; i++){
// 	tempStr = tempStr + matchStr.charAt(i);
//   	prefixArr.push(tempStr);
// }
// // 后缀集合
// for(let i =matchStr.length; i >=1 ; i--){
// 	tempStr1 = tempStr1 + matchStr.charAt(i);
//     suffixArr.push(tempStr1);
// }


// console.log('prefix==',prefixArr,suffixArr);
















