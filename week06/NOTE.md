# CSS 排版｜盒

## Tag 标签

> HTML 源代码中书写的


## Element

> 存储于 DOM 中的一类型 Node 


## Box

> 排版和渲染的基本单位。
*元素同盒的关系是一对多的。*


## Tag、Element 、Box

HTML代码中可以书写开始 __Tag__ ，结束 __Tag__ ，和自封闭 __Tag__ 。

一对起止 __Tag__ ，表示一个 __Element__ 。

DOM树中存储的是 __Element__ 和其它类型的节点（Node）。

CSS选择器选中的是 __Element__ 。

CSS选择器选中的 __Element__ ，在排版时可能产生多个 __box__ 。

排版和渲染的基本单位是 __Box__ 。



### 盒模型

* content
    
* padding：
    位于`border`和`content`之间。
    决定内部`content`可以排布的大小。
    
* border
    
* margin：
    

#### box-sizing
> 定义计算元素总的宽度和高度。

* border-box：告诉浏览器设置的宽高，是包含 border 和 padding 的。
width = content width + padding width + border width
height= content height + padding height + border height


* content-box：告诉浏览器设置的宽高只是内容区域。
width = content width
height = content height


# CSS 排版｜正常流

> 排版：将`HTML`可见的标签放入到页面正确的位置中。
> CSS 排版最基本单位是**盒和文字**。


## 正常流（normal flow）
> 同日常的书写排版是一致的。从左到右，从上到下。

正常流排版流程：

* 首先盒同文字放进行。
* 计算盒在行中的排布
* 计算行间的排布


### IFC BFC 
inline-box：行级排布
block-level-box：块级排布

IFC：（inline formatting context）
    行的内部从左到右排布，

BFC：(block formatting context)
    行之间上下排布。

* BFC 创建的条件


![-w891](media/15988801839208.png)


# CSS 排版｜正常流行级排布

## BaseLine

> 基准线用来对齐文字
*会随在内部文字变化而变化*

* vertical-align
    行内元素垂直对齐方式
    [vertical-align](https://developer.mozilla.org/zh-CN/docs/Web/CSS/vertical-align)



## text-top 和 text-bottom

> 取决于字体的大小。
*出现多种文字混排，由最大字体决定。*


## line-top 和 line-bottom

> 它们的大小由盒的先后顺序盒尺寸决定了



# CSS 排版｜正常流块级排布

## float 和 clear

> 根据设置的`float`属性，脱离原来正常流位置浮动。只适用于块级布局。

__float 自身占据的宽高范围内，会影响行盒的尺寸。__
__float 元素之间会相互影响，堆叠。__

* clear
找到一个干净的空间来执行`float`操作。


## 正常流的 BFC 中 margin 叠加
BFC 的纵向排布中，上下两个块级元素，相邻`margin`会相互叠加，并等于最高的`margin`。

**边距折叠只会发生在正常流的 BFC 中**
 

# CSS排版｜BFC 合并

* Block Container
    能容纳正常流的盒，里面就有`BFC`
    
* Block-level Box
    外面有BFC的盒，可以放进 BFC 中
    
* Block Box = Block Container + Block-level Box
    里外都有 BFC
    
    
## Block Container

* block
* inline-block
* table-cell：table-row 的子元素
* flex item：flex 子元素
* grid cell：grid 子元素
* table-caption：表格标题    


## Block-level Box


| Block level       | Inline level        |
|-------------------|---------------------|
| display: block    | display:inline-block|
| display: flex     | display:inline-flex|
| display: table    | display:inline-table|
| display: grid     | display:inline=gird|


## 创建 BFC

可能会创建 BFC 的情况：
* floats
* 绝对定位的元素
* block containers
* and block boxes with 'overflow' other than 'visible'

## BFC 合并

* block box && overflow: visible（满足此条件发生BFC合并）
    * BFC 合并与 float
    * BFC 合并与 边距折叠

`overflow`：定义了当元素的内容超出盒的大小后，应该做操作。
    * visible：内容不会被裁减，会溢出元素外
    * hidden：超出部分会被裁减
    * scroll：内容会被裁减，并以滚动的方式呈现内容。
    * auto：如果内容被裁减，会出现滚动条
    * inherit：继承父元素 overflow 属性

    
### BFC 合并与 float
 
合并是指设置`overflow： visible`的元素同设置`float`元素，因为合并没有创建新的`BFC`，所以看起来像合在一起。

### BFC 合并与 边距折叠
发生`BFC`合并的元素会作为一个整体同外部的`BFC`发生边距折叠。


# CSS 排版｜Flex 排版

* 收集盒进行
* 计算盒在主轴方向排布
* 计算交叉轴来进行排布


## 分行
* 根据主轴尺寸，将元素分进行，超过主轴尺寸，创建新行，并分进去。
* 如果设置了`no-wrap`，则强行分配进第一行。


## 计算主轴方向
* 找出所哟 flex 元素
* 将主轴方向的剩余尺寸按比例分配给这些元素
* 剩余空间为负数，将所有`flex`元素设为0，等比压缩剩余元素。

## 计算交叉轴方向
* 更具每行最高尺寸，计算行高。
* 根据行高`flex-align`盒`item-align`，确定元素具体位置。


# CSS 动画与绘制 ｜ 动画

## Animation

* @keyframes
    定义关键帧

动画属性
* animation-name 动画名称
* animation-duration 动画时长
* animation-timing-function 动画时间曲线
* animation-delay 动画开始前的延时
* animation-iteration-count 动画播放次数
* animation-direction 动画方向 


## Transition

* transition-property 要变换的属性;
* transition-duration 变换的时长;
* transition-timing-function 时间曲线; • transition-delay 延迟。



## cubic-bezier 三次贝赛尔曲线
> 拥有强大拟合能力，直线盒抛物线是可以完美拟合的。

[cubic-bezier](https://cubic-bezier.com/#.47,.01,.49,.33)

# CSS动画与绘制｜颜色

## HSL 与 HSV
 
 Hue：色向，用于指向色盘中颜色位置。
 S ： 纯度
 L ：亮度。 0 黑色 100 白色
 V ：明度。 100% 变为最亮纯色
 
 
 # CSS动画与绘制｜绘制

* 几何图形
    * border
    * box-shadow
    * border-radius


* 文字
    * font
    * text-decoration 

* 位图
    * background-image


## 应用技巧

* data uri + svg

```css
data:image/svg+xml,<svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg"><ellipse cx="300" cy="150" rx="200" ry="80" style="fill:rgb(200,100,50); stroke:rgb(0,0,100);stroke-width:2"/> </svg>
```