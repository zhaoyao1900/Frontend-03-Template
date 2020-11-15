
let element = document.documentElement;

// mouse 系列时间不会在移动端处理
// 鼠标按下监听移动，抬起清空监听
element.addEventListener('mousedown', (event)=> {
    start(event)
    let mousemove = event => {
        console.log(event.clientX, event.clientY)
        move(event)
    }
    let mouseup = event => {
        console.log('mouseup')
        end(event)
        element.removeEventListener('mouseup', mouseup)
        element.removeEventListener('mousemove', mousemove)

    }
    element.addEventListener('mouseup', mouseup)
    element.addEventListener('mousemove', mousemove)
})

// 监听移动设备手势
element.addEventListener('touchstart', event => {
    // touch 多个触点
    // console.log(event.changedTouches)

    for (let touch of event.changedTouches) {
        start(touch)
    }
})


element.addEventListener('touchmove', event => {
    for (let touch of event.changedTouches) {
        move(touch)
    }
})

element.addEventListener('touchend', event => {
    for (let touch of event.changedTouches) {
        end(touch)
    }
})

// 监听事件被系统取消
element.addEventListener('touchcancel', event => {
    for (let touch of event.changedTouches) {
        cancel(touch)
    }
})

// 对移动端和桌面端 事件进行抽象，消除差异性
let handle;
let startX, startY;
let isPan = false;
let isTap = true;
let isPress = false;
let start = (point) => {
    // console.log('start', point.clientX, point.clientY)
    startX = point.clientX, startY = point.clientY 

    isTap = true
    isPan = false
    isPress = false

    handle = setTimeout(() => { // 区分长按事件
        
        isTap = false
        isPan = false
        isPress = true
        handle = null
        console.log("press")
        
    }, 500);

}
let move = (point) => {
    // console.log('move', point.clientX, point.clientY)
    let dx = point.clientX - startX , dy = point.clientY - startY;

    // 移动 10 px
    if (dx ** 2 + dy ** 2 > 100) {
        isTap = false
        isPan = true
        isPress = false
        clearTimeout(handle)
    }

    if (isPan) {
        console.log('pan')
    }
}
let end = (point) => {
    // console.log('end', point.clientX, point.clientY)
    console.log(point)

    if (isTap) {
        console.log('tap')
        clearTimeout(handle)
    }

    if (isPan) {
        console.log('paned')
    }

    if (isPress) {
        console.log('pressed')
    }

}
let cancel = (point) => {
    // console.log('end', point.clientX, point.clientY)
    clearTimeout(handle)
    
}