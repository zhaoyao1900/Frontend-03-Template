# JavaScript 基本数据类型

* Number
* String
* Boolean
* Null
* Undefined
* Symbol

## Number
    
Float：小数点可以来回浮动。
将数字拆成
    指数：表示范围
    有效位数：表示精度
    
* Double Float（IEE 754）：双精度浮点数
    * Sign (1)：表示负数
    * Exponent（11）：指数位
    * Fraction (52)：有效位数

每一位都是一个 byte 位 0 或者 1 , 数字将会被转化为二进制。

*注意*
```j
// 错误写法，0. js 中表示位 0 
0.toSting
// 需要加空格才能调用
0 .toSting
```

## String 
* Character：字符集
* Code Point：码点
* Encoding：编码方式


## 字符集
* ASCII：表示 127 个字符 ，占用 1 个字节
* Unicode：庞大的编码集
* UCS：0000 到 FFFF 范围
* GB：国标（不兼容 Unicode）
    * GB 2312
    * GBK（GB13000）
    * GB18030

* ISO-8859：在ASCII的扩展
* BIG5

