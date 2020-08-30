# CSS 总论｜CSS语法的研究


```js
// CSS 产生式
[]： 组
? ： 否存在
| ： 或关系
* ： 0 或者多个
+ ： 1 或者多个
CDO、CDC ：历史包袱，为了让HTML中CSS当作注释存在。
```
##CSS 总体结构 

* @charset：字符集 UTF-8
* @import：
* rules
    * @media：查看设备相关参数（屏幕大小、分辨率）
    * @page：修改打印页面的部分样式
    * rule

    

# CSS 总论｜@规则

## @charset
>样式标中使用的字符编码

[@charset](https://www.w3.org/TR/css-syntax-3/)
```css
@charset "UTF-8";
@charset "iso-8859-15";
```

## @import
> 导入其他的样式规则

[@import](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@import)

[@import-w3](https://www.w3.org/TR/css-cascade-4/)

```css
//语法
@import url;
// list-of-media-queries：是一个逗号分隔的 媒体查询 条件列表，决定通过URL引入的 CSS 规则 在什么条件下应用。如果浏览器不支持列表中的任何一条媒体查询条件，就不会引入URL指明的CSS文件。
@import url list-of-media-queries;
```

```css
@import url('"fineprint.css"') print
@import 'custom.css';
```


## @media
> 用于查询用户设备的硬件相关参数。（如、屏幕分辨率、尺寸、）

[@media](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media)

[@media-w3](https://www.w3.org/TR/css3-conditional/)
```css
@media screen and (min-width: 900px){

}
```


## @page
> 用于打印页面部分CSS规则的修改

[@page](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@page)

[@page-w3]( https://www.w3.org/TR/css-page-3/)

*修改范围：margin、orphans、window、分页符*
```css
@page{
    margin: 1cm
}

```

## @counter-style
> 自定义列表前标志的样式

[@counter-style](https://www.w3.org/TR/css-counter-styles-3)

[@counter-style](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@counter-style)

```css
@counter-style circled-alpha {
  system: fixed;
  symbols: Ⓐ Ⓑ Ⓒ Ⓓ Ⓔ Ⓕ Ⓖ Ⓗ Ⓘ Ⓙ Ⓚ Ⓛ Ⓜ Ⓝ Ⓞ Ⓟ Ⓠ Ⓡ Ⓢ Ⓣ Ⓤ Ⓥ Ⓦ Ⓧ Ⓨ Ⓩ;
  suffix: " ";
}
.items {
   list-style: circled-alpha;
}
```

## @keyframes
>用来控制动画序列的中间步骤

[@keyframes](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@keyframes)

[@keyframes](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@keyframes)


## @fontfase
> 定义字体

[@fontfase](https://www.w3.org/TR/css-fonts-3/)


## @supports
> 检查 CSS 规则是否生效。CSS3 标准。

[@supports]()
[@supports](https://www.w3.org/TR/css3-conditional/)

## @namespace
>创建样式表命名空间

[@namespace](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@namespace)
```css
@namespace url(http://www.w3.org/1999/xhtml);
@namespace svg url(http://www.w3.org/2000/svg);

/* 匹配所有的XHTML <a> 元素, 因为 XHTML 是默认无前缀命名空间 */
a {}

/* 匹配所有的 SVG <a> 元素 */
svg|a {}

/* 匹配 XHTML 和 SVG <a> 元素 */
*|a {}
```


# CSS总论｜CSS规则

语法:
选择器 + 声明（key:value）

##Selector
> 用于匹配 HTML 中的标签
[Selector](https://www.w3.org/TR/selectors-3/)
[Selector](https://www.w3.org/TR/selectors-4/)



##Key
* Properties
* Variables：--

[Variables](https://www.w3.org/TR/css-variables/)

```css
// 用变量的声明 key
.foo{
  --side: margin-top;
  var(--side): 20px
}
```

##Value 

[value](https://www.w3.org/TR/css-values-4/)


# CSS 总论｜收集标准


爬取 CSS 所有标准
```js


JSON.stringify(
Array.prototype.slice.call(document.querySelector('#container').children).filter(e=>e.getAttribute("data-tag").match(/css/)).map(e=>({
    name: e.children[1].innerText,
    url: e.children[1].children[0].href
}))
)
```


# CSS 选择器｜选择器语法

##选择器语法

###简单选择器

1、*：通用选择器
2、tagName
3、.cls 
4、#
5、[attr=value]
6、:hover 多半来自交互
7、::before

##复合选择器
>表示与的关系。

结构：简单选择器的组合
<简单选择器> <简单选择器>

*要求`*`和`div`必须写在前面。*
*伪类选择器需要写在最后*


```css
div, span{
    border: red 2px solid;
}
```


##复杂选择器
>正对元素结构进行选择

* 空格：父子关系
* >：直接父子关系
* ～：同一层级向后匹配
* + ：同一父级下，紧邻的标签
* ||：用于选中table某一列


# CSS 的优先级

> 定义：浏览器通过优先级来判断 CSS 的属性值和元素的相关程度高低（权重值）
> 优先级是基于匹配规则的，是建立在 CSS 选择器之上的。

## 优先级是如何被计算的
> 优先级是给声明的CSS指定一个权重值，它是由 CSS 选择器来决定的。
> 如果多个相同的优先级的CSS，将会使用最后一个。
> 当元素的拥有多个 CSS 声明时，优先级才会有意义。因为每个元素总会覆盖从父类继承的 CSS。

### 选择器类型
下面的选择器的优先级时依次递增的：

1. CSS 元素选择器（h1）和伪元素（::before）
2. class 选择器（.example）和属性选择器（[type="radio"]）和伪类（:hover）
3. ID 选择器 （#example）


通配符选择符（*）、关系选择符（+, >, ~, ' ', ||）、否定伪类（negation pseudo-class）（:not()）对优先级没有影响。（但是，在 :not() 内部声明的选择器会影响优先级）。

内联样式优先级：
元素上添加的内联样式（style="font-weight: blod"）总是会覆盖外部的样式表。具有最高的优先级。

### !important 例外规则

当样式声明中使用`!important`规则时，将会覆盖任何其他的CSS。
*应该尽量避免使用`!important`因为它破环了样式表中的级联规则，使得bug调试变得困难*
当同时使用`!important`CSS 作用于元素上时，拥有更大优先级的将会被采用。

!important 的使用规则
* 通过优化样式规则的优先级来解决问题而不是 !important 
* 只有在覆盖全站和外部 CSS 的特定页面中使用。
* 永远不要在插件中使用。
* 永远不要在全站范围内使用。


## 优先级的计算规则

优先级顺序：
内联样式 > id > class > 标签

优先级是由A、B、C、D 四个值来决定的。
* 如果存在内联 `A=1`, 否则时 `A=0`
* `B` = `ID选择器`出现次数
* `C` = `class选择器`出现次数 + `属性选择器`出现次数 + `伪类选择器`出现次数
* `D` =`标签选择器` + `伪元素`出现次数

```css
#id div.a#id{

}
//选择器计数
[0,2,1,1]
```
S(优先级) = $0 * N^3 + 2* N^2 + 1* N^1 + 1$

N的取值 = 1000000

S = 2000001000001

N = 1000
[0,1,3,1] 

优先级计算:

N 的取值 = 1000;

1、div#a.b .c[id=x]
[0,1,3,1] 
$0 * N^3 + 1 * N^2 + 3 * N^1 + 1$ = 1,003,001

2、#a:not(#b)
[0,2,1,0]
$0 * N^3 + 2 * N^2 + 1 * N^2 + 0$ = 2,001,000

3、*.a
[0,0,1,0]
$0 * N^3 + 0 * N^2 + x * N^1 + 0$ = 1000

4、div.a
[0,0,1,1]
$0 * N^3 + 0 * N^2 + 1 * N^1 + 1$ = 1001



# CSS选择器｜伪类

## 链接｜行为
* :any-link
    匹配任何超链接
    
* :link
    还没访问的超链接
    
* :visited
    还没访问过的超链接
    :any-link = :link + :visited
    
    **使用:link 和:visited之后，没法在对里面的标签，做更改处文字颜色的属性。**
    
* :hover
    用户鼠标挪动到标签上的行为

* :active
    表示激活状态（最初只正对超链接）

* :fouce
    获取焦点

* :target
    链接到当前目标。
    

## 树型结构
* :empty
    元素是否有子元素
    
* :nth-child()
    当前元素是父元素的第几个 child
    
    可传入参数：语法越为复杂，写法应该尽量的简单。

* :nth-last-child()
    从末尾元素算起
    
* :first-child
    一组兄弟元素中第一个标签
    
* :last-child

    _会破会 CSS 回溯原则_

* :only-child 
    匹配任何没有兄弟元素的标签


## 逻辑型
 * :not
    反选伪类
 
 * :where
    只要匹配传入选择器列表任意一个，便会应用

 * :has
    从给定的选择器中匹配，至少满足一个。


# CSS选择器｜伪元素

> 通过选择器向页面中添加不存在的元素。

无中生有：
* ::before
    通过`content`属性添加内容、之后就可以设置盒子模型属性。

* ::after
    最为选中元素的最后一个子元素。通过`content`添加内容
    

特定元素括起来：
* ::first-line
    选中第一行


* ::first-letter
    选中第一个字母，并括起来。
    
    
>为什么 first-letter 可以设置 float 之类的，而 first-line 不行呢？
`first-letter`：可预期，只有一个字母。
`first-line`：第一行影响因素太多，导致计算匹配复杂。

    
    
    
```HTML
<html>
  <head>
    <title>test</title>
    <meta charset="utf-8">
    <style>
      div #id.class{
        color: red;
     }
    </style>
  </head>
<body>
  <div>
    <span id='id' class='class'>匹配</span>
  </div>
</body>
  <script>
    function match(selector, element) {
 
      const parentBody = element.parentNode.parentNode;
      const parentDiv = element.parentNode;

      if(parentBody.querySelector('div') && parentDiv.querySelector("#id.class")){

          console.log('parent',parentBody.querySelector('div'))
          console.log('selector', parentDiv.querySelector("#id.class"))
          return true;
      }

      return false;  
    }

    const isMatch = match("div #id.class", document.getElementById("id"));
    console.log( isMatch )
  
  </script>
</html>

```