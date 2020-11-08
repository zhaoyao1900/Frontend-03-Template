
// 创建唯一函数签名，进行私有化
const TICK = Symbol("tick");
const TICK_HANDLER = Symbol('tick_handler');
const ANIMATIONS = Symbol('animation');
const START_TIME = Symbol('start_time')


// 包装 tick()
export class Timeline {
    constructor() {


        // 动画队列
        this[ANIMATIONS] = new Set();
        // 记录动画添加时间
        this[START_TIME] = new Map();
    }

    // 开始执行
    start() {
        let startTime = Date.now();
        // 私有化 tick 函数
        this[TICK] = () => {
            let now = Date.now();
            // 执行队列中的动画
            for (let animation of this[ANIMATIONS]) {
                let t;
                if (this[START_TIME].get(animation) < startTime) { // 是否已有动画执行
                    t = now - startTime;
                }else{ // 
                    t = now - this[START_TIME].get(animation);
                }
                // 超出运行时间，删除
                if (animation.duration < t) {
                    this[ANIMATIONS].delete(animation);
                    t = animation.duration; // 防止超出动画时间
                }
                animation.reveive(t);
            }
            // 完成一帧渲染后，剩余可以执行 js 代码的时间内，执行动画。
            requestAnimationFrame(this[TICK]);
        }
        this[TICK]();
    }

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

    // 暂停
    pause() {

    }
    // 继续
    resume() {

    }

    reset() {

    }

}

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
    constructor(object, property, startValue, endValue, duration, delay, timingFunction) {
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