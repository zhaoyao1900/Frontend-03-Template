# Tic Tac Toc
> 在 3 * 3 棋盘上交替落子，率先 3 子连成一线者赢。

1. 画出棋盘：先定义二维数组表示棋盘，和棋子类型（0，1，2）的数据结构，双层遍历每个落点进行绘制。

```js
// 二维数组表示棋盘
let pattern = [
    [0, 1, 0],
    [0, 2, 0],
    [2, 0, 1],
]
// 记录棋子状态 1: ⭕️  2: ❌   切换状态: 3 - color;
let color = 1;

// 画出棋盘
const show = (pattern) => {
    let board = document.getElementById('board');

    // 清空 board
    board.innerText = "";

    // 双层遍历出二维数组每个元素
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            // 为每个元素创建 cell 
            let cell = document.createElement('div');
            cell.classList.add('cell');
            // 根据棋子类型设置图标
            cell.innerText =
                pattern[i][j] === 2 ? "❌" :
                pattern[i][j] === 1 ? "⭕️" : "";
            // cell 点击切换状态
            cell.addEventListener('click', () => move(j, i));
            board.appendChild(cell);
        }
        // 换行处理
        board.appendChild(document.createElement('br'));
    }
}
```

2. 判断输赢：检查每个可能赢的位置连线。每行、每列、过中心点的左右交叉

```js
// 检查每行、每列、两斜线
const check = (pattern, color) => {
    // 检查每一横行
    for(let i = 0; i < 3; i++){
        let win = true;
        for(let j = 0; j < 3; j++){
            if (pattern[i][j] !== color) {
                win = false
            }
        }
        if (win) {
            return true;
        }
    }

    // 检查每一列
    for(let i = 0; i < 3; i++){
        let win = true;
        for(let j = 0; j < 3; j++){
            if(pattern[j][i] !== color){
                win = false;
            }
        }
        if (win) {
            return true;
        }
    }

    // 检查(0,0) (1,1) (2,2)的斜线
    { //利用 let 块级作用域特点。 
        let win = true;
        for(let i = 0; i < 3; i++){
            // 特点 x,y 坐标相同。
            if(pattern[i][i] !== color){
                win = false;
            }
        }
        if (win) {
            return true;
        }

    }

    //检查 (0,2) (1,1) (2,0)的斜线
    {
        let win = true;
        for(let i = 0; i < 3; i++){
            if(pattern[i][2-i] !== color){
                win = false;
            }
        }
        if (win) {
            return true;
        }
    }
}
```

3. 将要赢：克隆棋盘，检查当前类型棋子在剩余空位点，中是否能赢。


```js
// 克隆一份棋局
const clone = (pattern) => JSON.parse(JSON.stringify(pattern));

// 检查所有空的位置，是否有赢的可能
const willWin = (pattern, color) => {
    for(let i = 0; i < 3 ; i++){
        for(let j = 0; j < 3; j++){
            if (pattern[i][j]) // 空位
                continue;
            // 克隆当前棋局，独立于显示的棋局。
            let temp = clone(pattern);
            temp[i][j] = color;
            if (check(temp, color)) {
                return true
            }
        }
    }
    return false;
}
```


4. 交替落子判断输赢：监听落点位置信息，修改落地位置数据，切换棋子类型，重新绘制棋盘。判断输赢。


```js
// 定位棋子改变状态
const move = (x, y) => {
    pattern[y][x] = color;
    // 检查输赢
    if (check(pattern, color)) {
        alert(color === 2 ? "❌ is winner" : "⭕️ is winner" ) 
    }
    // 交替落子
    color = 3 - color;
    show(pattern);
    if (willWin(pattern, color)) {
        console.log(color === 2 ? "❌ will win" : "⭕️ will win");
    }
}
```

# Tic Tac Toc 添加 AI

1. AI 找出对手最差点: 遍历每个空位并落子，同对方最好策略对比，如果对方最好策略劣于当前落点，找到对方最差位置返回。


```js
// AI 找到对方的最差局面
const bastChoice = (pattern, color) => {
    let p; // 最好位置
    if (p = willWin(pattern, color)) {
        return{
            point: p,  
            result: 1,
        }
    }

    let result = -1;  // -1 最差边界 、1 赢 、0 和
    let point = null; // 落点

    // 尝试每个空位
    outer:for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                if (pattern[i * 3 + j]) {
                    continue;
                }
                
                let temp = clone(pattern);
                temp[i * 3 + j] = color;
                // 拿到对方最最好策略
                let r = bastChoice(temp, 3 - color).result;

                // 比对的得到对方最差点
                if (- r >= result) {
                    result = - r;
                    point = [j , i];
                }

                // 剪枝：发现赢的空位，终止循环。
                if (r == 1) {
                    // 使用 label 跳出多层循环。
                    break outer;
                }
            }
        }
    return{
        point: point,
        result: point ? result : 0
    }

}

```


2. 拆分AI和对手落点

```js
// 定位棋子改变状态
const userMove = (x, y) => {
    pattern[y * 3 + x] = color;
    // 检查输赢
    if (check(pattern, color)) {
        alert(color === 2 ? "❌ is winner" : "⭕️ is winner" ) 
    }
    color = 3 - color; // 来回切换 1 和 2 
    show(pattern);            
    computedMove();
}

// AI 
const computedMove = () => {
    let choice = bastChoice(pattern, color);
    if(choice.point){ // 走最佳位置
        pattern[choice.point[1] * 3 + choice.point[0]] = color;
    }
    if (check(pattern, color)) {
        alert(color === 2 ? "❌ is winner" : "⭕️ is winner" ) 
    }
    color = 3 - color;
    show(pattern);
}
```

# 异步编程

JavaScript 异步能力

* callBack ：容易多次嵌套，降低可读性。
* Promise ：链式调用方式，实现异步。
* async / await ：基于 promise 的异步分装，通过同步的声明方式，实现异步。
* generator 和 promise 模拟 async 、await


