# Number

## 7 中基本类型
* Number
* String
* Boolean
* Object
* Null：表示有值，但是为空。*typeof null === "object"*为人所诟病
* Undefined：从来没人定义过值
* Symbol：用于`Object`的 key 值,和`string`不同之处就是，`string`只要知道名称，就可以从对象中取出value，但是`Symbol`，必须确切知道变量才行。

##Number
* IEEE 754 Double Float (双精度的浮点数) Float：表示小数点是会来回浮动的。
    * Sin (1)：符号位（表示正负）
    * Exponent (11)：指数位
    * Fraction (52)：精度位
    
    * 单位
      每一位都是一个`bit`，可以是`0`或`1`
    
    * float
      指数位 * 精度位 2 的指数次方
      $(Exponent * Fraction)^2$
    
    * 指数位：
      有一个基准值，改值往上为正数，以下为负数。
      
    * 指数为表示最大范围
       整数：$2^{2048-1}$ 在乘以 52 个 1。
       负数：$2^{-10}$ 乘以 52 位以 1 开头的。
       
    * 精度位中隐藏位 
      精度是以 1 开始
      
    * 精度的损失
      在将十进制转换为2进制的时候就开始了。
      每次转换最多损失一个`e`
      
      0.1 + 0.2 不等于 0.3
      加法运算会损失 `e`,等于比较也会损失`e`,最大可能是`3e`
      
##语法
* 十进制表示
    * 0
    * 0. *0.toString()报错*  *0 .toString()加空格正确*
    * .1
    * 1e3 等于 $1*10^3$

* 二进制
    * 0b111 以 `0b` 开头

* 八进制
    * 0o10 `0o`开头
       
* 十六进制
    * 0xFF `0x`开头
    
    
##算数运算
    
###overflow 和 underflow 
> 计算结果超出 double flow 可以表示的最大范围。
* overflow：上溢出。`Infinty`
* underflow：下益处。`-Infinty`

###NaN 
> not a number
> 表示不是一个数字，和任何值都不相等，包括自己。

计算会返回`NaN`的情况

1. `Infinity / Infinity`
2. `0/0`
3. 负数开方运算
4. 算数运算中出现无法转换到数字的运算。

判断是否为`NaN`
`isNaN()`

###算数运算结果的比较
> 因为 JS 使用的的`Double Flow`，由于精度损失的存在。可能会在一些比较重出现错误。

```j
var x = .3 - .2
var y = .2 - .1

x == y // 返回 false
x == .1 // 返回 false
y == .1 // 返回 true
```









    