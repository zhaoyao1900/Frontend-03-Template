# 1. 手势与动画 | 初步建立动画和时间线

>解决鼠标事件和自动轮播动画没有建立关系的问题。

1、拆分出独立的`Carousel`组件

## 动画和帧 
按帧播放动画的实现方式

* setInterval()

```js
// 16ms 执行不可控
// 会发生积压情况
setInterval(() => {
    
}, 16); // 16ms 为一帧
```
* setTimeout()

```js
let tick = ()  => {
    setTimeout(tick, 16);
}
```

* requestAnimationFrame

```js
let tick = () => {

    // 申请在浏览器执行下一帧时，允许所需代码
    // 帧率跟随浏览器而定
    let handel = requestAnimationFrame(tick);
    cancelAnimationFrame(handel);    
}
```

## 将执行自身的`tick()` 包装成一个`TimeLine`

```js
// 创建唯一函数签名，进行私有化
const TICK = Symbol("tick");
const TICK_HANDLER  = Symbol('tick_handler')

// 包装 tick()
export class Timeline {
    constructor(){
  
    /**
     * 添加动画到队列
     * @param {*} animation 
     */
    add(animation) {
        this[ANIMATIONS].add(animation);
    }
    start(){
        let startTime = Date.now();
        // 私有化 tick 函数
        this[TICK] = () => {            
            
            let now = Date.now();
            // 执行队列中的动画
            for (let animation of this[ANIMATIONS]) {
                let t = Date.now() - startTIME
                // 超出运行时间，删除
                if (animation.duration < t) {
                    this[ANIMATIONS].delete(animation);
                }
                animation.reveive(t);
            }
            // 完成一帧渲染后，剩余可以执行 js 代码的时间内，执行动画。
            requestAnimationFrame(this[TICK]);    
        }
    }
        this[TICK]();
    }
    // 暂停
    pause(){
    }
    // 继续
    resume(){
    }
    reset(){
    }
}
```


## 属性动画的分装


```js
export class Animation {
    /**
     * 构造器
     * @param {*} object 动画对象
     * @param {*} property 动画属性列表
     * @param {*} startValue 开始值
     * @param {*} endValue 结束值
     * @param {*} duration 持续时间
     * @param {*} timingFunction 动画变动曲线 
     */
    constructor(object, property, startValue, endValue, duration, timingFunction) {
        // 存储属性
        this.object = object;
        this.property = property;
        this.startValue = startValue;
        this.endValue = endValue;
        this.duration = duration;
        this.timingFunction = timingFunction;
    }
    
    
    reveive(time) {
        // 执行范围
        let range = (this.endValue - this.startValue);
        // 均匀执行曲线
        this.object[this.property] = this.startValue + range * time / this.duration
    }
}
```


# 2. 手势与动画 | 设计时间线的更新

>支持动态的设置 `TimeLine`

## 处理时间不一致问题。防止时间线不断开启和重置。

* 记录每个动画添加时间

```js
/**
 * 添加动画到队列
 * @param {*} animation 
 * @param {*} startTime 延时
 */
add(animation, startTime) {
    if(arguments.length < 2){
        startTime = Date.now();// 默认值
    }
    this[ANIMATIONS].add(animation);
    this[START_TIME].set(animation, startTime); // 添加动画时的开始时间
}
```

* 根据动画是否执行中，计算时间

```js
// 执行队列中的动画
for (let animation of this[ANIMATIONS]) {
    let t;
    if (this[START_TIME].get(animation) < startTime) { // 是否已有动画执行
        t = now - startTime;
    }else{ // 已经执行，取出记录的开始时间计算
        t = now - this[START_TIME].get(animation);
    }
    // 超出运行时间，删除
    if (animation.duration < t) {
        this[ANIMATIONS].delete(animation);
        t = animation.duration; // 防止超出动画时间
    }
    animation.reveive(t);
}
```

# 3. 手势与动画 | 给动画添加暂停和重启功能

## 暂停动画
* 清空动画帧

```js
    pause() {
        cancelAnimationFrame(this[TICK_HANDLER]);
    }
```

## 继续动画
* 记录暂停开始时间和暂停截止时间

```js
// 开始前清空暂停时间
start(){
    this[PAUSE_TIME]  = 0; 
}

```
* 计算暂停时间

```js
 //计算暂停时间
this[PAUSE_TIME]  += Date.now() - this[PAUSE_START]; 
```

* 计算动画时间时减去暂停时间

```js
let t;
if (this[START_TIME].get(animation) < startTime) { // 是否已有动画执行
    t = now - startTime - this[PAUSE_TIME];
}else{ // 
    t = now - this[START_TIME].get(animation) - this[PAUSE_TIME];
}
```

# 4. 手势与动画 | 完善动画的其他功能

## 计算动画时间时处理 delay 

```js
let t;
    if (this[START_TIME].get(animation) < startTime) {  // 是否已有动画执行
        t = now - startTime - this[PAUSE_TIME] - animation.delay;
    }else{ // 
        t = now - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay;
    }
```

## 不同类型的 timingFunction 贝塞尔曲线计算函数

```js
export function cubicBezier(p1x, p1y, p2x, p2y) {
    const ZERO_LIMIT = 1e-6;

    const ax = 3 * p1x - 3 * p2x + 1;
    const bx = 3 * p2x - 6 * p1x;
    const cx = 3 * p1x;

    const ay = 3 * p1y - 3 * p2y + 1;
    const by = 3 * p2y - 6 * p1y;
    const cy = 3 * p1y;

    function sampleCurveDerivativeX(t) {
        return (3 * ax * t + 2 * bx) * t + cx;
    }

    function sampleCurveX(t) {
        return ((ax * t + bx) * t + cx) * t; 
    }

    function sampleCurveY(t) {
        return ((ay * t + by) * t + cy) * t;
    }
    function solveCurveX(x) {
        var t2 = x;
        var derivative;
        var x2;

        for(let i = 0; i < 8; i++){
            x2 = sampleCurveX(t2) - x;
            if (Math.abs(x2) < ZERO_LIMIT) {
                return t2;
            }
            derivative = sampleCurveDerivativeX(t2);

            if (Math.abs(derivative) < ZERO_LIMIT) {
                break;
            }

            t2 -= x2 / derivative;
        }

        var t1 = 1;
        var t0 = 0;
        t2 = x;
        while (t1 > t0) {
            x2 = sampleCurveX(t2) - x;
            if (Math.abs(x2) < ZERO_LIMIT) {
                return t2;
            }
            if (x2 > 0) {
                t1 = t2;
            }else{
                t0 = t2;
            }
            t2 = (t1 + t0) / 2;
        }
        return t2;
    }

    function solve(x){
        return sampleCurveY(solveCurveX(x));
    }

    return solve;

}


export let ease = cubicBezier(.25, .1, .25, 1);
export let easeIn = cubicBezier(.42, 0, 1, 1);
export let easeOut = cubicBezier(0, 0, .58, 1);
export let easeInOut = cubicBezier(.42, 0, .58, 1);
```

## 处理重置
```js
reset() {
    this.pause();
    this[START_TIME] = new Map();
    this[ANIMATIONS] = new Set();
    this[PAUSE_START] = 0;
    this[PAUSE_TIME] = 0;
    this[TICK_HANDLER] = null;
}
```

# 5. 手势与动画 | 对时间线进行状态管理

# 添加状态管理（梳理不同状态关系）

* 初始化状态

```js
constructor() {
    // 初始化状态
    this.state = "Inited"
    // 动画队列
    this[ANIMATIONS] = new Set();
    // 添加时间
    this[START_TIME] = new Map();
}
```

* 开始状态

```js
start() {
    if (this.state !== "Inited") { //只有初始化后才能开始
        return;
    }
    this.state = "Started"; // 开始状态 
}
```

* 暂停状态

```js

// 暂停
pause() {
    if (this.state !== "Started") { // 只有开始状态可以暂停
        return;
    }
    this.state = 'Paused'; // 修改为暂停
    // 暂停开始时间
    this[PAUSE_START] = Date.now();
    cancelAnimationFrame(this[TICK_HANDLER]);
}
```

* 继续

```js
// 继续
resume() {
    if (this.state !== "Paused") { // 只有暂停可以继续
        return;
    }
    this.state = 'Started';
    //计算暂停时间
    this[PAUSE_TIME]  += Date.now() - this[PAUSE_START]; 
    this[TICK]();
}
```

* 重置

```js
// 回到初始状态
reset() {
    this.state = 'Inited'; 
    this.pause();
    this[START_TIME] = new Map();
    this[ANIMATIONS] = new Set();
    this[PAUSE_START] = 0;
    this[PAUSE_TIME] = 0;
    this[TICK_HANDLER] = null;
}
```