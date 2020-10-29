/**
 * 创建真实 DOM
 * @param {*} type DOM 类型 
 * @param {*} attributes 属性列表
 * @param  {...any} children 子元素
 */
export default function createElement(type, attributes, ...children) {
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
        if (typeof child === 'string') {
            child = new TextWrapper(child);
        }
        element.appendChild(child);
    }
    return element;
}

// 基础组件类 
export class Component {
    constructor(child){
        this.root = this.render();
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

// 将普通标签转化为 class 
class ElementWrapper extends Component {
    constructor(type){
        this.root = document.createElement(type);
    }

}
// 包装文本
class TextWrapper {
    constructor(child){
        this.root = document.createTextNode(child);
    }

}



