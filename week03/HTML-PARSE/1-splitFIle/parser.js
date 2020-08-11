let currentToken = null; // 已经解析的 token
const EOF = Symbol('EOF'); // EOF：end of file

/**
 * 输出 token
 * @param {*} token 
 */
function emit(token){
    console.log(token);
}

/**
 * 初始状态
 * @param {} c 
 */
function data(c){
    if (c === '<') {
        return tagOpen
    }else if (c === EOF) {
        emit({
            type: EOF
        })
        return;
    }else{
        // 输出文本
        emit({
            type: 'text',
            content: c
        })
        return data;
    }

}
/**
 * 标签开始
 * @param {*} c 
 */
function tagOpen(c){
    if(c === '/'){//是否为结束标签
        return endTagOpen
    }else if (c.match(/^[a-zA-Z]$/)) { //匹配 tag 名称
        
        currentToken = {
            type: 'startTag', // 包括开始标签和自封闭。自封闭通过单独状态标示
            tagName: '',
        }

        return tagName(c)

    }else{
        return;
    }
}
/**
 * 结束标签开始
 * @param {*} c 
 */
function endTagOpen(c){

    if (c.match(/^[a-zA-Z]$/)) {

        emit({
            type:'endTag',
            tagName:''
        })

        return tagName(c)
    }else if (c === '>') {
        
    }else if (c === EOF) {
        
    }else{

    }
}

/**
 * 标签名称
 * @param {*} c 
 */
function tagName(c){
    if (c.match(/^[\t\n\f ]$/)) { // 以空白符结束，以此进行匹配。四种 tab 符、换行、禁止符、空格
        return beforeAttributeName; // 处理属性
    }else if (c === '/') {
        // 自封闭标签
        return selfClosingStartTag;
    }else if (c.match(/^[a-zA-Z]$/)) { //字母
        currentToken.tagName += c; // 拼接标签名称
        return tagName;
    }else if (c === '>') {
        emit(currentToken)
        return data; //结束一个标签解析，进入下一个
    }else{
        return tagName
    }
}
/**
 * 属性名开始
 * @param {*} c 
 */
function beforeAttributeName(c){
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    }else if (c === '>') {
        return data;
    }else if (c === '=') {
        return beforeAttributeName;
    }else{
        return beforeAttributeName;
    }
}

/**
 * 自封闭标签
 * @param {*} c 
 */
function selfClosingStartTag(c){
    if (c === '>') {
        currentToken.isSelfClosing = true;
        return data;
    }else if (c === EOF) {
        
    }else{

    }
}



module.exports.parseHTML = function parseHTML(html){
    // 初始状态
    let state = data;
    for (const c of html) {
        state = state(c);
    }

    // EOF 状态机最后一个状态输入,
    state = state(EOF);


    console.log(html)
}