# 1. 轮播组件 | 手势动画应用


## 使用分装过的事件系统替代之前桌面事件系统


```js
// 使用分装过事件系统
enableGesture(this.root);
// 滑动
this.root.addEventListener('pan', event => {
    // 移动位置 减去动画偏移
    let x = event.clientX - event.startX - ax;
    // 当前位置(保留符号取余)
    let current = position - ((x - x % 500) / 500);

    // 当前图片前一后后一个位置,支持左右拖动
    for (let offset of [-1, 0, 1]) {
        let pos = current + offset;
        // 防止变为负数
        pos = (pos % children.length + children.length) % children.length;
        // 去掉动画
        children[pos].style.transition = 'none';
        // position * 500 挪到第二张的位置
        children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 + x % 500}px)`;
    }

})
```


## 处理事件系统和自动播放结合

* 事件开始停止时间线

```js
// gesture 增加 start
this.dispatcher.dispatch('start',{
    clientX: point.clientX,
    clientY: point.clientY
})    

// 监听并暂停
this.root.addEventListener('start', event => {
    timeLine.pause()
})
```

* 处理暂停后拖动，偏移量的问题（将动画产生距离计入拖动距离）

1. 计算动画产生距离

```js
// 动画执行时间
let t = 0;  
// 动画执行位移
let ax = 0;

// 点击开始
this.root.addEventListener('start', event => {
    timeLine.pause();
    // 计算动画进度
    let progress = (Date.now() - t) / 1500;
    // 总长度 - 已经移动过的一张距离
    ax = ease(progress) * 500 - 500 
})
```

2. 移动中去掉动画偏移 

```js
// 滑动
this.root.addEventListener('pan', event => {
    // 移动位置 减去动画偏移
    let x = event.clientX - event.startX - ax;
    
})
```

* 清空自动播放

```js
// 自动播放
let handler = null;
let nextPicture = () => {
    let children = this.root.children;
    let nextIndex = (position + 1) % children.length; // 取余循环轮播
    // 取出前后两张
    let current = children[position];
    let next = children[nextIndex];
    // 保存动画开始时间
    let t = Date.now();

    // 将前后两张图片动画添加到时间线上面
    timeLine.add(new Animation(
        current.style, 
        "transform",
        (-position * 500),
        (-500 - position * 500),
        1500,
        0,
        ease,
        v => `translateX(${v}px)`
    ))

    // 修改下一张位置
    timeLine.add(new Animation(
        next.style,
        "transform",
        500 - nextIndex * 500,
        - nextIndex * 500,
        1500,
        0,
        ease,
        v => `translateX(${v}px)`
    ))
    position = nextIndex;

}
handler = setInterval(nextPicture, 3000);

// 点击开始
this.root.addEventListener('start', event => {

    // 清空自动播放
    clearInterval(handler);

})
```

* 改造 panend 


```js
this.root.addEventListener('panend', event => {

            timeLine.reset();
            timeLine.start();
            handler = setInterval(nextPicture, 3000);


            // 移动位置 减去动画偏移
            let x = event.clientX - event.startX - ax;
            // 当前位置(保留符号取余)
            let current = position - ((x - x % 500) / 500);
            // 确定方向
            let direction = Math.round((x % 500) / 500);


            if(event.isFilck){
                if(event.velocity < 0){ // 取上一张
                    direction = Math.ceil((x % 500) / 500);
                }else{
                    direction = Math.floor((x % 500) / 500);
                }
            }


            // 当前图片前一后后一个位置,支持左右拖动
            for (let offset of [-1, 0, 1]) {
                let pos = current + offset;
                // 防止变为负数
                pos = (pos % children.length + children.length) % children.length;
                // 去掉动画
                children[pos].style.transition = 'none';
                // position * 500 挪到第二张的位置
                timeLine.add(new Animation(
                    children[pos].style,
                    "transform",
                    - pos * 500 + offset * 500 + x % 500,
                    - pos * 500 + offset * 500 + direction * 500,
                    500,
                    0,
                    ease,
                    v => `translateX(${v}px)`
                ))
            }

            position = position - (x - x % 500) / 500 - direction;
            // 防止 position 变成负数
            position = (position % children.length + children.length) % children.length;

        })
```


# 2. 轮播组件 | 为组件添加更多属性（一）


## 将组建内属性分类提取

*  将 Carousel 属性存储和设置移动的 Component 

```js

constructor(child){
    // 存储属性
    this.attributes = Object.create(null);
}
setAttribute(name, value) {
    this.attributes.setAttribute(name, value);
}

```

* 去掉 Carousel `mountTo()`,在 Component 处理


```js
appendChild(child){
    if(!this.root) // 没有 root 直接渲染一次
        this.render()
    // 反向设置
    child.mountTo(this.root);
}
```


* 私有化`state`和`attribute`，并在`Carousel`导出，方便继承。

```js
// framework.js
export const STATE =  Symbol('state')
export const ATTRIBUTE = Symbol('attribute')

// carousel.js
// 便于继承 Carousel 组建后使用
export {STATE, ATTRIBUTE} from './framework.js';

```

## 为组建提供事件接口

* `Carousel` 组建上监听

```js
let a = <Carousel src={d} 
            onChange={event => console.log(event.detail)}
            onClick={event => window.location.href = event.detail.data.url} />```

* `Component`中定义 `triggerEvent` 事件派发函数

```js
triggerEvent(type, args){
    this[ATTRIBUTE]['on'+type.replace(/^[\s\S]/, s => s.toUpperCase())](new CustomEvent(type, {detail: args}))
}
```

* `Carousel` 更新位置时调用`triggerEvent`， tap 上调用点击

```js
// 触发对外接口
this[STATE].position = nextIndex
this.triggerEvent('change', {position: this[STATE].position })


// 触发点击事件
this.root.addEventListener('tap', event => {
    this.triggerEvent('click', {
        data: this[ATTRIBUTE].src,
        position: this[STATE].position
    })

})
```


# 3. 轮播组件 | 为组件添加更多属性（二）
> 提供 `children` 能力

* 内容型`children`：和真实`DOM`对应
* 模版`children`：通过函数进行渲染


## 内容型`children`

* 创建内容型`Button`


```js
import { Component, createElement } from './framework.js';
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
```

* 修改`ElementWrapper`和`TextWrapper`

```js
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

```

* 重载`appendChild()`


```js
// 重载 appendChild
appendChild(child){
    if(!this.childContainer)
        this.render();
    this.childContainer.appendChild(child);
}
```



## 模版`children`

* 创建 List 组件


```js
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
```


* 修改`createElement`支持递归创建子元素

```js
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
```


