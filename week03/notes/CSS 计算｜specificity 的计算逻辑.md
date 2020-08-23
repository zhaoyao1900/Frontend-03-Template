# CSS计算｜specificity 计算逻辑

##specificity 

>`specificity`：通过四位元组来描述

四位元组：优先级由左到右递减
[inline, id , class, tagName]

inline：
标签上的`style`属性

计算规则：不进位制
高位能够决定次序，不考虑地位


```js
div div  #id
// 选择器转换到四元组
[0, 1, 0, 2]

div #my #id
[0,2,0,1]

```
