/**
 * 创建真实 DOM
 * @param {*} type DOM 类型 
 * @param {*} attributes 属性列表
 * @param  {...any} children 子元素
 */
export function createElement(type, attributes, ...children) {
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
    let processChildren = (children) => {
        for (let child of children) {
            // 子元素是数组递归创建
            if(typeof child === 'object' && (child instanceof Array)){
                processChildren(child);
                continue;
            }

            if (typeof child === 'string') {
                child = new TextWrapper(child);
            }
            element.appendChild(child);
        }
    };
    processChildren(children);

    return element;
}

export const STATE =  Symbol('state')
export const ATTRIBUTE = Symbol('attribute')

// 基础组件类 
export class Component {
    constructor(child){
        // 存储属性
        this[ATTRIBUTE] = Object.create(null);
        this[STATE] = Object.create(null);
    }
    setAttribute(name, value) {
        this[ATTRIBUTE][name] = value;
    }
    mountTo(child){
        if(!this.root) // 没有 root 直接渲染一次
            this.render()
        // 反向设置
        child.appendChild(this.root);
    }
    triggerEvent(type, args){
        this[ATTRIBUTE]['on'+type.replace(/^[\s\S]/, s => s.toUpperCase())](new CustomEvent(type, {detail: args}))
    }
    render(){
        return this.root;
    }
}

// 将普通标签转化为 class 
class ElementWrapper extends Component {
    constructor(type){
        super();
        this.root = document.createElement(type);
        return this.root;
    }

}
// 包装文本
class TextWrapper extends Component {
    constructor(child){
        super();
        this.root = document.createTextNode(child);
        return this.root
    }

}



