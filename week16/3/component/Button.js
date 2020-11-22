import { Component, STATE, ATTRIBUTE, createElement } from './framework.js';
import { enableGesture } from './gesture.js'

export {STATE, ATTRIBUTE} from './framework.js'

export class Button extends Component{
    constructor(){
        super()
    }

    render(){
        this.childContainer = (<span/>);
        this.root = (<div>{this.childContainer}</div>);
        return this.root;
    }
    // 重载 appendChild
    appendChild(child){
        if(!this.childContainer)
            this.render();
        this.childContainer.appendChild(child);
    }
}