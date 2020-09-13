# 重学HTML｜HTML 定义：XML与SGML

> 数据描述语言：来源于 SGML 与 XML


## DTD
规定了定义`SGML`子集的编码格式

### 重点内容
>& + 定义内容 `&lambda`

⚠️ nbsp 作为空格问题
会把链接两个词作为一个词，在排版的时候，会有分词的问题。破坏了语义性。

✅ 使用 CSS 中 whitespace

只有下面写法在 HTML 属性总书写才不会报错
* &quot : ""
* &amp : &
* &lt  : <
* &gt  : >
* &apos 

## XHTML
拥有严格标签闭合要求写法。可以在 H5 使用，但是不能混用。


# 重学HTML｜HTML 标签语义
>HTML 是一个语义系统，最先关注的应该是语义表达是否正确。

<em>：句子中强调重音


# 重学HTML｜HTML语法

语法类型：
* Element : <tagname>...</tagname>
* Text :text
* Comment: <!-- comments-->
* DocumentType: <!Doctype html>
* ProcessingInstruction（预处理语法）: <?a 1?>
* CDATA :  <![CDATA[]]>


字符引用
* &#161; 
* &lt; <
* &amp; &
* &quot; ""


# 浏览器API｜DOM API

BOM：浏览器部分 API
DOM：DOM API

## Node 节点部分

### 导航类操作

     node            element 不包含文本节点


| parentNode      | parentElement          |
|-----------------|------------------------|
| childNodes      | Children               |
| firstChild      | firstElementChild      |
| lastChild       | lastElementChild       |
| nextSibling     | nextElementSibling     |
| previousSibling | previousElementSibling |


### 修改操作

* appendChild
* insertBefore
* removeChild
* replaceChild

### 高级操作

* contains :检查一个节点是否包含另一个节点函数
* compareDocumentPosition  比较两个节点关系
* isEqualNode 检查两个节点是否相同
* isSameNode 用 === 代替
* cloneNode 复制节点。传入参数 true ，做深拷贝。




# DOM Event 


## Event
>`Event`:可以将事件理解为信号，不同的信号，不同的信号标明了特定的行为和动作。
>要处理这些信号，就需要发送方和监听方，


```js
// 创建事件
const event = document.createEvent('Event');

// 初始化事件
event.initEvent('build', true, true);
```


## dispatch Event
> 派发一个事件

`target.dispatchEvent(event)`

* target：派发事件的目标对象。
* event：需要派发的事件。



## Event listener
>`Event Listener`：事件监听器，为需要监听的对象，创建监听器。

### 创建监听：

声明：
*  `EventTarget.addEventListener(type, listener, options)`
*  `EventTarget.addEventListener(type, listener, useCapture)`
 
  * EventTarget: 事件目标，`element`，`document`...支持事件的对象
  * type：事件类型
  * listener：事件触发后执行的内容。类型是一个函数或者对象。
  * options：可选配置
      * options:{
            capture: Boolean, // false：默认。是否在事件捕获阶段进行触发。
            once: Boolean, // listener 是否会被调用一次。
            passive: Boolean, // true: listener 永远不会调用`preventDefault` 来阻止默认行为
      }
 * useCapture：true：沿着`DOM`树向上冒泡事件，不会触发`listener`。


#### options 中配置 capture
> 指定事件触发的阶段是否为捕获阶段。指定捕获阶段后，冒泡阶段就不会触发。

特定条件下：capture = true && 目标对象的子元素也绑定了相同类型事件。
在触发子元素事件之前会先触发，`capture=true` 目标对象的事件处理。


#### passive
> 高频次的事件设为false，可以提高性能。移动端默认值false。


### 事件监听的几种方式：
* 通过标签相关事件属性：会使HTML解析变得困难，事件注册变得分散，难以维护
* js 中获取DOM元素，通过给元素事件属性赋值一个函数。
* 使用`addEventListener()`



```js
// 1
<button onclick="clickMe"></button>

// 2
const btn = doucument.getElementById("btn")
btn.onclick = function(){
}

// 3
const btn = doucment.getElementByClassName('btn')
btn.addEeventListener('click',function(){

});
```


#### stopPropagation() 
> 停止事件冒泡，不会继续向上来触发冒泡链相同的事件。

```js
video.addEventListener('click', function(e){
    e.stopPropagation();
    
})

```

#### preventDefault()
> 阻止特定事件的默认行为。

如表单提交后，默认重定向到另一页面

```
form.onsubmit = function(e){
    if (fname.value === '' || lname.value === '') {
    e.preventDefault();
    para.textContent = 'You need to fill in both names!';
  }
}
```     
    
### 移除监听
    `EventTarget.removeEventListener(type, listener,options|useCapture)`
    * options：{
            capture: Boolean, //事件将会被派发到已经注册的监听器，然后再拍派发到`DOM`树中任何`EventTarget`
    
        }
    * useCapture：指定移除的事件是否为捕获事件
    
    
## DOM Event Architecture (DOM 事件的体系结构)

### Event dispatch and DOM Event flow
这个章节简要的概述了事件派发`event dispatch`的机制和事件是如何在`DOM`书中传播的。
程序可以通过`dispatchEvent()`来派发一个事件对象，事件对象将会在`DOM`事件流中进行传播

![DOM Event flow](https://www.w3.org/TR/DOM-Level-3-Events/images/eventflow.svg)


事件对象将会被派发到一个`event target`事件目标，但是在开始派发之前，必须确定事件对象的传播路径。

`propagation path` 传播路径,就是事件依次穿过一系列`event target`所组成的链式列表的过程。

`propagation path` 传播路径一旦被确定，`event target` 将通过一个或则多个`event  phases` ，这里有三个事件阶段，有些阶段是可以跳过的。

* `capture phases`：从`DOM`根元素一直向下直到`target object`的父元素的过程。
* `target phases`：事件沿着传播路径到达`target object`的阶段。
* `bubble phases`：从目标对象开始沿着传播链向上直到`DOM`根元素的阶段。


捕获阶段：从上到下，确定事件元素的位置。
冒泡阶段：从下到上，响应事件。
默认都行为是冒泡的事件。



# 浏览器API｜Range API
> 操作半个节点、或是批量操作节点。


live collection：对真实DOM集合的操作，真实集合会动态的变化根据你的具体操作。

insert 操作 = remove + append
 
## Range API 
 > 每个`range`都是一段连续的范围，有起点和终点
  
```js
// 起点和终点描述range
var range = new Range();
range.setStart(element, 9);
range.setEnd(element, 4);

// 框选 range
var range = document.getSelection().getRangeAt(0);

// 快捷方式
range.setStartBerore
range.setEndBefore
range.setStartAfter
range.setEndAter

// 选中一个节点
range.selectNode
range.selectNodeContents

// 取出 range
var fragment = range.extractContents();

// 插入新 node
range.insertNode(document.createtextNode('AAA'))
```



# 浏览器API｜CSSOM

> CSS 对象化模型。

document.styleSheets

```js

//获取样式表
document.styleSheets[0].cssRules

document.styleSheets[0].insertRule("p{color:pink;}",0)

document.styleSheets[0].removeRule(0)
```

* CSSStyleRule
    * selectorText String
    * style K-V 结构

```js
// 动态修改伪元素样式
document.styleSheets[0].cssRules[0].style.color = "green"
```

获取页面最终渲染所需要的CSS属性。同样能访问到伪元素。
处理动画的中间值。
* window.getComputedStyle(elt, pseudoElt)
    * elt 想要获取元素。
    * pseudoElt 可选，伪元素。

    
```js
getComputedStyle(document.querySelect("a"),"::before")

getComputedStyle(document.querySelect("a"),"::before").color
```


# 浏览器API｜CSSOM View

>获取layout之后视图的CSS

# window

* window.innerHeight, window.innerWidth
* window.outerWith, window.outerHeght 
* window.devicePixelRatio 屏幕物理像素和编程px 的比例。DPR：retain 是 1:2
* window.screen
    * window.screen.width
    * window.screen.height
    * window.screen.availWidth
    * window.screen.availHeight

## window API 

* window.open("ablut:blank","blank","width=100,height=100,left=100,right=100")
* moveTo(x,y)
* moveBy(x,y)
* resize(x,y)
* resizeBy(x,y)
    
    
## scroll

* scrollTop
* scrollLeft
* scrollWidth
* scrollHeight
* scroll(x,y)
* scrollBy(x,y)
* scrollIntoView() :滚动到可见区域


* window
    * scrollX
    * scrollY
    * scroll(x,y)
    * scrollBy(x,y)


## layout

* getClientReacts() 获取元素的盒
* getBoundingClientRect() 


# 浏览器API｜其他API

标准化组织

* khronos
    * WebGL
* ECMA
    * ECMAScript
* WHATWG
    * HTML
* W3C
    * webaudio
    * CG/WG

     