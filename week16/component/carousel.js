import { Component } from './framework';
import {enableGesture } from './gesture.js'
import { Timeline, Animation } from './animation.js'
import { ease } from './ease.js'

export class Carousel extends Component {
    constructor() {
        super();
        // 存储属性
        this.attributes = Object.create(null);
    }
    // 重写拿到属性值
    setAttribute(name, value) {
        this.attributes[name] = value;
    }
    render() {
        console.log(this.attributes.src);
        this.root = document.createElement('div');
        this.root.classList.add('carousel');
        for (let record of this.attributes.src) {
            // 通过 div backgroundImage 防止拖拽
            let child = document.createElement('div');
            child.style.backgroundImage = `url('${record}')`;
            this.root.appendChild(child);
        }

    

        /*
        // 自动播放
        // 每个 3 秒移动位置，并修改动画
        let currentIndex = 0;
        setInterval(() => {
            let children = this.root.children;
            let nextIndex = (currentIndex + 1) % children.length; // 取余循环轮播
            // 取出前后两张
            let current = children[currentIndex];
            let next = children[nextIndex];

            // 修改下一张位置
            next.style.transition = "none";
            next.style.transform = `translateX(${100 - nextIndex * 100}%)`;

            setTimeout(() => { // 延时一帧防止覆盖
                next.style.transition = "";
                current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
                next.style.transform = `translateX(${- nextIndex * 100}%)`;

                currentIndex = nextIndex;
            }, 16);


            for (let child of children) {
                child.style.transform = `translateX(-${100* current}%)`;
            }


        }, 3000);
        */


        let position = 0;
        let children = this.root.children;
        // 使用分装过事件系统
        enableGesture(this.root);
        this.root.addEventListener('pan', event => {
            // 移动位置
            let x = event.clientX - event.startX;
            // 当前位置(保留符号取余)
            let current = position - ((x - x % 500) / 500);

            // 当前图片前一后后一个位置,支持左右拖动
            for (let offset of [-1, 0, 1]) {
                let pos = current + offset;
                // 防止变为负数
                pos = (pos + children.length) % children.length;
                // 去掉动画
                children[pos].style.transition = 'none';
                // position * 500 挪到第二张的位置
                children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 + x % 500}px)`;
            }

        })
        


        /*
        // down move up 一组事件
        let position = 0;
        this.root.addEventListener('mousedown', event => {
            console.log('mousedown')
            let children = this.root.children;
            // 起始点
            let startX = event.clientX;

            // 跟随鼠标移动相关图片
            let move = event => {
                // console.log('mousemove');
                // 移动位置
                let x = event.clientX - startX;

                // 当前位置(保留符号取余)
                let current = position - ((x - x % 500) / 500);

                // 当前图片前一后后一个位置,支持左右拖动
                for (let offset of [-1, 0, 1]) {
                    let pos = current + offset;
                    // 防止变为负数
                    pos = (pos + children.length) % children.length;
                    // 去掉动画
                    children[pos].style.transition = 'none';
                    // position * 500 挪到第二张的位置
                    children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 + x % 500}px)`;
                }


            }

            // 处理捡起位置，
            let up = event => {
                console.log('mouseup');
                let x = event.clientX - startX;
                // 拖动一半后更新位置
                position = position - Math.round(x / 500);


                // Math.round(x / 500)：滚动方向
                // 250 * Math.sign(x)：是否超过一半
                for (let offset of [0, - Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
                    let pos = position + offset;
                    // 防止变为负数
                    pos = (pos + children.length) % children.length;
                    // 去掉动画
                    children[pos].style.transition = 'none';
                    // position * 500 挪到第二张的位置
                    children[pos].style.transform = `translateX(${- pos * 500 + offset * 500}px)`;
                }


                // 移除监听，保证事件按顺序执行
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);

            }

            // document 扩大范围即使在浏览器之外
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', up);
            
        })
        */

        return this.root;
    }
    // 
    mountTo(parent) {
        parent.appendChild(this.render())
    }
}