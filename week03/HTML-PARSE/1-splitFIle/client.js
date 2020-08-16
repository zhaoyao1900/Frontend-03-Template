const net = require('net');
const parser  = require('./parser');
 
/**
 * HTTP 请求类
 */
class Request {

    constructor(options){
        // 构建默认配置，允许修改
        this.method = options.method || GET;
        this.host = options.host;
        this.port = options.port || 80;
        this.path = options.path || '/';
        this.body = options.body || {};
        this.headers = options.headers || {};
        // 解析 body 
        if(!this.headers['Content-Type']){// Content-Type 必须，解析 body 需要。
            this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        if (this.headers['Content-Type'] === 'application/json') {
            this.bodyText = JSON.stringify(this.body);
        }else if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
            this.bodyText = Object.keys(this.body).map(key => 
                `${key}=${encodeURIComponent(this.body[key])}`).join('&');
        }

        this.headers['Content-Length'] = this.bodyText.length;

    }

    /**
     * 构建 HTTP 文本
     */
    toString(){
        // 注意模版字符串会讲换行回车自动转义
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key =>`${key}:${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`
    }

    /**
     * 发送请求
     * @param {*} connection 已经建立好的 TCP 连接
     */
    send(connection){
        return new Promise((resolve, reject) => {
            const parser = new ResponseParser;
            if (connection) {
                connection.write(this.toString());
            }else{//创建 TCP 连接
                connection = net.createConnection({
                    host: this.host,
                    port: this.port,
                },() => {
                    connection.write(this.toString());
                })
            
                // 监听 TCP connection
                connection.on('data', (data) => {
                    console.log(data.toString());
                    parser.receive(data.toString());
                    if(parser.isFinished){
                        resolve(parser.response);
                        connection.end();
                    }
                })

                connection.on('error', (err) => {
                    reject(err);
                    connection.end();
                })


            }

        })
    }

}
/**
 * HTTP 响应体解析类
 */
class ResponseParser{

    constructor(){
        // state line 的状态
        this.WAITING_STATUS_LINE = 0; // /r
        this.WAITING_STATUS_LINE_END = 1; // /n
        // header line
        this.WAITING_HEADER_NAME = 2;
        this.WAITING_HEADER_SPACE = 3;
        this.WAITING_HEADER_VALUE = 4;
        this.WAITING_HEADER_LINE_END = 5;
        this.WAITING_HEADER_BLOCK_END = 6;
        // body line
        this.WAITING_BODY = 7;

        this.current = this.WAITING_STATUS_LINE;
        this.statusLine = "";
        this.headers = {};
        this.headerName = "";
        this.headerValue = "";
        this.bodyParser = null;

    }
    
    /**
     * 解析完成状态
     */
    get isFinished(){
        return this.bodyParser && this.bodyParser.isFinished;
    }

    /**
     * 构建响应体
     */
    get response(){
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            hdaders: this.headers,
            body: this.bodyParser.content.join('')
        }
    }

    /**
     * 遍历 HTTP 字符串文本
     * @param {*} str 
     */
    receive(str){
        for (let index = 0; index < str.length; index++) {
            this.receiveChar(str.charAt(index));
        }
    }

    /**
     * 使用有限状态机处理 HTTP 文本
     * @param {*} char 
     */
    receiveChar(char){
        // 处理状态行、headers、body
        if(this.current === this.WAITING_STATUS_LINE){ // 状态行
            if(char === '\r'){
                this.current = this.WAITING_STATUS_LINE_END;
            }else{
                this.statusLine += char;
            }
        }else if (this.current === this.WAITING_STATUS_LINE_END) {
            if(char === '\n'){
                this.current = this.WAITING_HEADER_NAME;
            }
        }else if (this.current === this.WAITING_HEADER_NAME) { // headers 中 key
            if(char === ':'){
                this.current = this.WAITING_HEADER_SPACE;
            }else if (char === '\r') {
                this.current = this.WAITING_HEADER_BLOCK_END;
            } else {
                this.headerName += char; 
            }
        }else if (this.current === this.WAITING_HEADER_SPACE) { // hdaders 中 value
            if (char === ' ') {
                this.current = this.WAITING_HEADER_VALUE;
            }
        } else if (this.current === this.WAITING_HEADER_VALUE) {
            if (char === '\r') { // 设置到 headers
                this.current = this.WAITING_HEADER_LINE_END;
                this.headers[this.headerName] = this.headerValue;
                this.headerName = '';
                this.headerValue = '';
                
                // 依据不同编码类型解析 body
                if (this.headers['Transfer-Encoding'] === 'chunked') {
                    this.bodyParser = new TrunkedBodyParser();
                }  

            }else{
                this.headerValue += char;
            }
        }else if (this.current === this.WAITING_HEADER_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_HEADER_NAME;
            }
        }else if (this.current === this.WAITING_HEADER_BLOCK_END) {
            if (char === '\n') {
                this.current = this.WAITING_BODY;
            }
        } else if (this.current === this.WAITING_BODY) {
            this.bodyParser.receiveChar(char);
            // console.log(char)
        }

    }
}
/**
 * trunk 类型 body 解析器
 */
class TrunkedBodyParser{
    
    constructor(){
        // trunk 长度状态
        this.WAITING_LENGTH = 0; 
        this.WAITING_LENGTH_LINE_END = 1;

        this.READING_TRUNK = 2; // 记录 trunk 
        this.WAITING_NEW_LINE = 3;
        this.WAITING_NEW_LINE_END = 4;
        this.length = 0;
        this.content = [];
        this.isFinished = false;
        this.current = this.WAITING_LENGTH;
    }

    /**
     * 使用状态机解析 body
     * @param {*} char 
     */
    receiveChar(char){
        if(this.current === this.WAITING_LENGTH){
            if(char === '\r'){
                if (this.length === 0) {
                    this.isFinished = true;
                }
                this.current = this.WAITING_LENGTH_LINE_END;
            }else{
                this.length *= 16; // 16 进制，乘以 16 来空出最后一位。
                this.length += parseInt(char, 16); // 加上最后一位。
            }
        }else if (this.current === this.WAITING_LENGTH_LINE_END) {
            if (char === '\n') {
                this.current = this.READING_TRUNK;
            }
        }else if (this.current === this.READING_TRUNK) {
            this.content.push(char); // 保存char
            this.length --;
            if (this.length === 0) {
                this.current = this.WAITING_NEW_LINE;
            }
        }else if (this.current === this.WAITING_NEW_LINE) {
            if(char === '\r'){
                this.current = this.WAITING_NEW_LINE_END;
            }
        }else if (this.current === this.WAITING_NEW_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_LENGTH;
            }
        }
    }

}


void async function () {
    let request = new Request({
        method:'POST',
        host:'127.0.0.1', // IP 协议要求（本机地址）
        port:'8088',// TCP 协议要求
        path:'/',
        headers:{
            ['X-foo2']:'customed'
        },
        body:{
            name:'zy'
        }
    })
    // 真正浏览器，逐段接受 response，并进行解析的
    let response = await request.send();

    let dom = parser.parseHTML(response.body);
    
    console.log('DOM',dom);
}();