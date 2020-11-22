import { Component, STATE, ATTRIBUTE } from './framework';
import { enableGesture } from './gesture.js'
import { Timeline, Animation } from './animation.js'
import { ease } from './ease.js'

// 便于继承 Carousel 组建后使用
export {STATE, ATTRIBUTE} from './framework.js';

export class Carousel extends Component {
    constructor() {
        super();

    }

    render() {
        this.root = document.createElement('div');
        this.root.classList.add('carousel');
        for (let record of this[ATTRIBUTE].src) {
            // 通过 div backgroundImage 防止拖拽
            let child = document.createElement('div');
            child.style.backgroundImage = `url('${record.img}')`;
            this.root.appendChild(child);
        }

        this[STATE].position = 0;
        let children = this.root.children;
        // 动画执行时间
        let t = 0;
        // 动画执行位移
        let ax = 0;
        // 自动播放
        let handler = null;
        // 使用分装过事件系统
        enableGesture(this.root);
        // 创建时间线
        let timeLine = new Timeline();
        timeLine.start();


          // 自动播放
        // 每个 3 秒移动位置，并修改动画
        let nextPicture = () => {
            let children = this.root.children;
            let nextIndex = (this[STATE].position + 1) % children.length; // 取余循环轮播
            // 取出前后两张
            let current = children[this[STATE].position];
            let next = children[nextIndex];
            // 保存动画开始时间
            let t = Date.now();

            // 将前后两张图片动画添加到时间线上面
            timeLine.add(new Animation(
                current.style,
                "transform",
                (-this[STATE].position * 500),
                (-500 - this[STATE].position * 500),
                500,
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
                500,
                0,
                ease,
                v => `translateX(${v}px)`
            ))
            // 触发对外接口
            this[STATE].position = nextIndex
            this.triggerEvent('change', {position: this[STATE].position })

        }

        handler = setInterval(nextPicture, 3000);

        // 点击开始
        this.root.addEventListener('start', event => {
            // 暂停时间线
            timeLine.pause();
            // 清空自动播放
            clearInterval(handler);
            // 计算动画进度
            let progress = (Date.now() - t) / 500;
            // 总长度 - 已经移动过的一张距离
            ax = ease(progress) * 500 - 500
        })


        this.root.addEventListener('tap', event => {
            this.triggerEvent('click', {
                data: this[ATTRIBUTE].src,
                position: this[STATE].position
            })

        })


        // 滑动
        this.root.addEventListener('pan', event => {
            // 移动位置 减去动画偏移
            let x = event.clientX - event.startX - ax;
            // 当前位置(保留符号取余)
            let current = this[STATE].position - ((x - x % 500) / 500);

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

        this.root.addEventListener('panend', event => {

            timeLine.reset();
            timeLine.start();
            handler = setInterval(nextPicture, 3000);


            // 移动位置 减去动画偏移
            let x = event.clientX - event.startX - ax;
            // 当前位置(保留符号取余)
            let current = this[STATE].position - ((x - x % 500) / 500);
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

            this[STATE].position = this[STATE].position - (x - x % 500) / 500 - direction;
            // 防止 position 变成负数
            this[STATE].position = (this[STATE].position % children.length + children.length) % children.length;
            this.triggerEvent('change', {position: this[STATE].position })

        })

        return this.root;
    }
   
}