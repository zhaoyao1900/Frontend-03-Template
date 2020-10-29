import { Component, createElement } from './framework';

class Carousel extends Component {
    constructor(){
        super();
        this.attributes = Object.create(null);
    }
    render(){
        return document.createElement("div");
    }
}

let a  = <Carousel src={d} />
a.mountTo(document.body);