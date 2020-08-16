# CSS 计算｜生成 computed 属性

* 发现样式和标签匹配，将样式内容写入到`element`的`computedStyle`属性中。


```js
      // 生产 computed 属性
        if (matched) {
            let computedStyle = element.computedStyle;
            for (const declaration of rule.declarations) {
                if (!computedStyle[declaration.property])
                    computedStyle[declaration.property] = {};
                computedStyle[declaration.property].value = declaration.value;
            }


            console.log('computedStyle',computedStyle)
        }

```