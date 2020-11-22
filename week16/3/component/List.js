import { Component, createElement, ATTRIBUTE } from './framework.js';
export { ATTRIBUTE } from './framework.js'


export class List extends Component{
    constructor(){
        super()
    }

    render(){
        console.log(this[ATTRIBUTE].data)
        // 将数据转换为模版
        this.children = this[ATTRIBUTE].data.map(this.template);
        this.root = (<div>{this.children}</div>);
        return this.root;
    }
    // 重载 appendChild
    appendChild(child){
        this.template = child; 
    }
}