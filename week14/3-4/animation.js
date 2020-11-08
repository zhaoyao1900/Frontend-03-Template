
// 创建唯一函数签名，进行私有化
const TICK = Symbol("tick");
const TICK_HANDLER = Symbol('tick_handler');
const ANIMATIONS = Symbol('animation');
const START_TIME = Symbol('start_time');
const PAUSE_START = Symbol('pause_start');
const PAUSE_TIME = Symbol('pause_time');


// 包装 tick()
export class Timeline {
    constructor() {
        // 初始化状态
        this.state = "Inited"
        // 动画队列
        this[ANIMATIONS] = new Set();
        // 添加时间
        this[START_TIME] = new Map();
    }

    // 开始执行
    start() {
        if (this.state !== "Inited") { //只有初始化后才能开始
            return;
        }
        this.state = "Started"; // 开始状态 
        // 初始化暂停时间
        this[PAUSE_TIME]  = 0; 
        let startTime = Date.now();
        // 私有化 tick 函数
        this[TICK] = () => {
            let now = Date.now();
            // 执行队列中的动画
            for (let animation of this[ANIMATIONS]) {
                let t;
                if (this[START_TIME].get(animation) < startTime) { // 是否已有动画执行
                    t = now - startTime - this[PAUSE_TIME] - animation.delay;
                }else{ // 
                    t = now - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay;
                }
                // 超出运行时间，删除
                if (animation.duration < t) {
                    this[ANIMATIONS].delete(animation);
                    t = animation.duration; // 防止超出动画时间
                }
                if (t > 0) { // 动画开始执行
                    animation.reveive(t);
                }
            }
            // 完成一帧渲染后，剩余可以执行 js 代码的时间内，执行动画。
            this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
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
        if (this.state !== "Started") {
            return;
        }
        this.state = 'Paused';
        // 暂停开始时间
        this[PAUSE_START] = Date.now();
        cancelAnimationFrame(this[TICK_HANDLER]);

    }
    // 继续
    resume() {
        if (this.state !== "Paused") {  // 只有暂停可以继续
            return;
        }
        this.state = 'Started';
        //计算暂停时间
        this[PAUSE_TIME]  += Date.now() - this[PAUSE_START]; 
        this[TICK]();
    }

    reset() {
        this.state = 'Inited';
        this.pause();
        this[START_TIME] = new Map();
        this[ANIMATIONS] = new Set();
        this[PAUSE_START] = 0;
        this[PAUSE_TIME] = 0;
        this[TICK_HANDLER] = null;
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
     * @param {*} template 属性动画类型
     */
    constructor(object, property, startValue, endValue, duration, delay, timingFunction, template) {
        // 默认值
        timingFunction = timingFunction || (v => v);
        template = template || (v => v);
        this.object = object;
        this.property = property;
        this.startValue = startValue;
        this.endValue = endValue;
        this.duration = duration;
        this.delay = delay;
        this.timingFunction = timingFunction;
        this.template = template;
    }

    reveive(time) {
        // 执行范围
        let range = (this.endValue - this.startValue);
        // 动画类型
        let progress = this.timingFunction(time / this.duration);
        // 均匀执行曲线
        this.object[this.property] = this.template(this.startValue + range * progress);
    }
}