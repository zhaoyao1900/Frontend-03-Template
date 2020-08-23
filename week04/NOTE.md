学习笔记

# 排版｜根据浏览器属性进行排版

## layout

```js
              layout
DOM with CSS --------> DOM with position

```

## CSS 排版技术的演化

```js
正常流(position、display、float...) ----> flex -----> grid ----> CSS Houdini
```
[position](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/定位)

[flex](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex)

[grid](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Grid_Layout/Basic_Concepts_of_Grid_Layout)

[CSS Houdini](https://developer.mozilla.org/zh-CN/docs/Web/Houdini)


## Flex 排版
 
> flex-direction: 属性决定是什么轴

* Main Axis：排版时主要的延伸方向
    flex-direction: row
    Main：width x left right
    Cross：height y top bottom
    
* Cross Axis：交叉轴和主轴垂直
    flex-direction: column
    Main：height y top bottom
    Cross：width x left right  

 
# 排版｜收集元素收进行内

>分行：包含子元素超过父元素的宽度时发生

分行算法
* 根据主轴尺寸，把元素分进行。
* 设置`no-wrap`，强制分配进第一行。


# 排版｜计算主轴

>计算主轴方向

* 找出所有Flex元素（填满剩余空间）
* 把主轴方向呢剩余尺寸按比例分配给这些元素（多个 felx 属性存在）
* 剩余空间为负数，所有flex元素为0，等比例压缩剩余元素
* 没有`flex` 根据 `justifyContent`计算剩余元素。



# 排版｜计算交叉轴

>计算：height、top、bottom

计算交叉轴
* 依据每一行最高元素计算行高
* 根据`felx-align`和`item-align`，确定元素的具体位置



# 渲染｜绘制单个元素

>通过`images`将元素绘制成图片。

* 绘制需要依赖一个图形环境
* 使用 `npm` 包 `images`
* 绘制在一个 `viewport`
* 绘制属性：background-color、border、background-image 等

# 渲染｜绘制 DOM 树

* 递归调用子元素的绘制方法完成DOM树的绘制
* 忽略一些不需要绘制的节点
* 实际浏览器中，文字的绘制是难点，需要依赖字体库，忽略
* 实际浏览器，还会对一些图层做`compositing`，忽略

