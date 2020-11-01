/**
 * 创建真实 DOM
 * @param {*} type DOM 类型 
 * @param {*} attributes 属性列表
 * @param  {...any} children 子元素
 */
function createElement(type, attributes, ...children) {
    // 创建 Node
    let element = "";
    if (typeof type === 'string') {
        element = new ElementWrapper(type);
    } else {// 非字符串类型会被识别为 class
        element = new type;
    }

    // 添加属性
    for (let name in attributes) {
        element.setAttribute(name, attributes[name]);
    }
    // 添加子元素
    for (let child of children) {
        if (typeof child === 'string') { // 创建文本节点
            child = new TextWrapper(child);
        }
        element.appendChild(child);
    }
    return element;
}

// 将普通标签转化为 class 
class ElementWrapper{
    constructor(type){
        this.root = document.createElement(type);
    }
    mountTo(parent) {
        parent.appendChild(this.root);
    }
    setAttribute(name, value) {
        this.root.setAttribute(name, value);
    }
    appendChild(child){
        // 反向设置
        child.mountTo(this.root);
    }
}
// 包装文本
class TextWrapper{
    constructor(child){
        this.root = document.createTextNode(child);
    }
    mountTo(parent) {
        parent.appendChild(this.root);
    }
    setAttribute(name, value) {
        this.root.setAttribute(name, value);
    }
    appendChild(child){
        // 反向设置
        child.mountTo(this.root);
    }
}

//自定义 Node 元素 
class Div {
    constructor() {
        this.root = document.createElement("div");

    }
    //安装到父元素
    mountTo(parent) {
        parent.appendChild(this.root);
    }
    // 设置属性
    setAttribute(name, value) {
        this.root.setAttribute(name, value);
    }
    // 设置子元素
    appendChild(child){
        child.mountTo(this.root);
    }
}


let a = <div id="a">
    <span></span>
    <span></span>
    <span></span>
</div>

// document.body.appendChild(a)
a.mountTo(document.body);