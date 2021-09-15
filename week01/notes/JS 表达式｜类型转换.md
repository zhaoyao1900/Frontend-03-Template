# 类型转换
[TOC]
## Unboxing 拆箱转换
>将`Object`转换为原始类型的过程。
 
 整个过程称为 ToPremitive
 
 * toString vs valueOf：
 * Symbol.toPrimitive


```j
// 拆箱转换，会根据不同表达式决定调用下列那个方法
var o = {
    // 转换到 string 
    toString(){ return "2" }
    // 转换到 number 调用
    valueOf() { return 1 }
    // 下面方法出现会覆盖上面两种方法。
    [Symbol.toPrimitive]() { return  }
}

var x = {}
// 调用 toString
x[o] = 1 
// 加法优先调用 valueOf
console.log("x"+o)
```

## Boxing 装箱转换

![boxing](media/boxing.png)




```j
// 四种类型转 number换为 string
function StringToNumber(str){
    return Number(str)
}

// 通过传入进制进行转换
function NumberToString(num){
    if(typeof num === 'number'){
       	return num.toString()
    }
}
```