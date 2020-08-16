const css = require('css');
let currentToken = null; // 已经解析的 token
let currentAttribute = null;  
let currentTextNode = null;
const EOF = Symbol('EOF'); // EOF：end of file
let stack = [{type: "document", children: []}]; // 用stack构建 DOM 

/**
 * 输出 token
 * @param {*} token 
 */
function emit(token){
    console.log(token);

    // 取出栈顶
    let top = stack[stack.length -1]

    if (token.type === 'startTag') {
        
        // element 是 DOM 层中 tag 的映射
        let element = {
            type: 'element',
            children: [],
            attributes: []
        }
        
        element.tagName = token.tagName;

        // 设置属性
        for (const p in token) {
            if (p !== 'tagName' &&  p !== 'type') {
                element.attributes.push({
                    name: p,
                    value: token[p]
                })     
            }
        }
        // console.log(element);

        // CSS 设置到 DOM 
        computeCSS(element);

        top.children.push(element);
        element.parent = top;

        if (!token.isSelfClosing) {
            stack.push(element)
        }
        
        currentTextToken = null; //清空文本
    }else if (token.type === 'endTag') {
        if (top.tagName !== token.tagName) { // 标签是否闭合
            throw new Error("Tag start end doen't match!")
        }else{
            top.children.push(currentTextNode);

            //遇到 style 结束标签，取出其中所有内容开始解析。
            if (top.tagName === 'style') {
                addCSSRules(top.children[0].content)
            }
            stack.pop()
        }
        currentTextToken = null;
    }else if (token.type === 'text') {
        if (currentTextNode == null) {
            currentTextNode = {
                type: 'text',
                content: ''
            };
            top.children.push(currentTextNode);
        }
        // 合并相邻文本节点
        currentTextNode.content += token.content;

    }

}
//===========================解析标签===============================

/**
 * 初始状态
 * @param {} c 
 */
function data(c){
    if (c === '<') {
        return tagOpen
    }else if (c === EOF) {
        emit({
            type: "EOF"
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
        currentToken = {
            type: 'endTag',
            tagName: '',
        }

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
        emit(currentToken);
        return data;
    }else if (c === EOF) {
        
    }else{

    }
}

//===========================解析属性===============================

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
            name: '', 
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
    if(c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF){
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
    if (c === "\'") {
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
    if (c.match(/^[\t\n\f ]$/)) {
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
    if (c.match(/^[\t\n\f ]$/)) {
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
        
    }else if (c === "\"" || c === "'" || c === '<' || c === '=' || c === '`' ) {
        
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

    if (c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF) {
        return afterAttributeName(c)
    }else if( c === '='){
        return beforeAttributeValue;
    }else if (c === '\u0000') {
        
    }else if (c === '\"' || c === "'" || c === '<') {
        
    }else {
        currentAttribute.name += c;
        return attributeName;
    }

}

/**
 * 属性名结束
 * @param {*} c 
 */
function afterAttributeName(c){

    if (c.match(/^[\t\n\f ]$/)) {
        return afterAttributeName;
    }else if (c === '/') {
        return selfClosingStartTag;
    }else if (c === '=') {
        return beforeAttributeName;
    } if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    }if (c === EOF) {
        
    }else{
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute = {
            name:'',
            value:''
        }
        return attributeName(c);
    }
}

//===========================CSS Computing===============================
let rules = []; // css 规则集
/**
 * 收集 CSS 规则
 * @param {*} text 样式文本
 */
function addCSSRules(text) {
    var ast = css.parse(text);
    // console.log(JSON.stringify(ast,null, "  "))
    rules = [...ast.stylesheet.rules];
}
/**
 * 将 CSS 融入 DOM
 */
function computeCSS(element){

    // 获取父元素序列
    // slice() 空参复制数组
    // reverse() 方便向上寻找 selecter
    var elements = stack.slice().reverse()
    
    // 存放CSS的属性
    if (!element.computedStyle) {
        element.computedStyle = {};    
    }

    for (const rule of rules) {
        // 让选择器顺序和元素保持一致
        var selectorParts = rule.selectors[0].split(" ").reverse();

        if (!match(element, selectorParts[0])) 
            continue;

        let matched = false;//是否匹配
        let j = 1; // 选择器位置
        for (let index = 0; index < elements.length; index++) {
            if (match(elements[i], selectorParts[j])) {
                j ++;
            }            
        }
        if (j >= selectorParts.length) {
            matched = true;
        }
        if (matched) {
            console.log('element',element, 'rule',rule)
        }

    }


}
/**
 * 支持简单选择器匹配（id、class、tagName）,每个标签和所有样式依次匹配。
 * @param {*} element 
 * @param {*} selector 
 */
function match(element, selector) {
    // 匹配标签节点和选择器
    if (!selector || !element.attributes) {
        return false;
    }
    // 拆分三种简单选择器
    if (selector.charAt(0) === "#") {
        var attr = element.attributes.filter(attr => attr.name === "id");
        if (attr && attr.value === selector.replace("#",'')) {
            return true;
        }
        
    }else if (selector.charAt(0) === ".") {
        var attr = element.attributes.filter(attr => attr.name === ".");
        if (attr && attr.value === selector.replace(".","")) {
            return true;
        }
    }else {
        if (element.tagName === selector) {
            return true;
        }
    }
    return false;
}

module.exports.parseHTML = function parseHTML(html){
    // 初始状态
    let state = data;
    for (const c of html) {
        state = state(c);
    }

    // EOF 状态机最后一个状态输入,
    state = state(EOF);


    console.log('stack',stack[0])
}