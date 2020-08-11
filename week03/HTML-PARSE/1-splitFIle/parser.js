let currentToken = null; // 已经解析的 token
let currentAttribute = null; 
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

//==============属性

/**
 * 属性名开始
 * @param {*} c 
 */
function beforeAttributeName(c){
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    }else if (c === '>' || c === '/' || c === EOF) {
        return afterAttributeName(c);
    }else if (c === '=') {
    }else{
        currentAttribute = {
            name:'',
            value:''
        }

        return attributeName(c);
    }
}
/**
 * 属性值
 * @param {*} c 
 */
function beforeAttributeValue(c) {
    if(c.match(/^[\n\t\f ]$/) || c === '/' || c === '>' || c === EOF){
        return beforeAttributeValue;
    }else if (c === '\"') { //双引号
        return doubleQuotedAttributeValue;
    }else if (c === '\'') { //单引号
        return singleQuotedAttributeValue;
    }else if (c === '>') {
        
    }else{
        return unQuotedAttributeValue(c);
    }
}
/**
 * 双引号
 * @param {*} c 
 */
function doubleQuotedAttributeValue(c){
    if (c === '\"') { //双引号结束
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    }else if (c === '\u0000') {
         
    }else if (c === EOF) {
        
    }else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}
/**
 * 单引号
 * @param {*} c 
 */
function singleQuotedAttributeValue(c){
    if (c === '\'') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    }else if (c === '\u0000') {
        
    }else if(c === EOF){

    }else{
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

/**
 * 在单双引号解析完进入
 * @param {*} c 
 */
function afterQuotedAttributeValue(c){
    if (c.match(/^[\n\t\f ]$/)) {
        return beforeAttributeName;
    }else if (c === '/') {
        return selfClosingStartTag;
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    }else if (c === EOF){

    }else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

/**
 * 
 * @param {*} c 
 */
function unQuotedAttributeValue(c) {
    if (c.match(/^[\n\t\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeValue;
    }else if (c === '/') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    }else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    }else if ( c === '\u0000') {
        
    }else if (c === '\"' || c === '<' || c === '`' || c === '=' || c === "'" ) {
        
    }else if (c === EOF) {
        
    }else{
        currentAttribute.value += c;
        return unQuotedAttributeValue;
    }
}

/**
 * 解析属性名称
 * @param {*} c 
 */
function attributeName(c){

    if (c.match(/^[\t\n\f ]$/) || c === '/' || c === EOF) {
        return afterAttributeName(c)
    }else if( c === '='){
        return beforeAttributeValue;
    }else if (c === '\u0000') {
        
    }else if (c === '\"' || c === "'" || c === '<') {
        
    }else {
        currentAttribute.value += c;
        return attributeName;
    }

}

/**
 * 属性名结束
 * @param {*} c 
 */
function afterAttributeName(c){

    if (c.match(/^[a-zA-Z]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    }else if (c === '>') {
        
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