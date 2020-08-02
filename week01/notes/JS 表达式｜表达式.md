# JS 表达式

##运算符优先级
> 运算符包含不同的优先级，不同的组合会影响语法树的构建。

###最高优先级 `Member`运算
* a.b：成员访问，点运算符 + 字符串
* a[b]：成员访问，[变量名称]
* foo`string`：foo 为定义好的函数名，会讲反引号内容传入到函数中。
* super.b
* super['b']
* new.target：
* new foo()：

⚠️`new foo()`优先级高于`new foo`

```j
// 先左结合
new a()()

// 先右结合
new new a()
```

###Reference 引用类型
>存在于运行时中类型，而不是语言中的类型。

####引用类型的组成
> 一个引用类型包含了`Object`和`key`,它记录的`member`运算的前`Key`和后`Object`。
> JS 通过引用类型完成，删除、赋值，和写相关的操作。

* Object
* Key

引用类型的应用
```j
// 需要通过引用类型知道 key
delete a.b

// 赋值运算
assign
```

### Call Expression 函数调用
>优先级低于`new`和`member`运算

* Call
    * foo()
    * super()
    * foo()['b']
    * foo().b
    * foo()`abc`

**不同的语法结构，决定运算符有不同的优先级**

```j
// member运算符跟在函数调用之后优先级会降级
// new 左先结合，后边属性访问最后
// new 一个 a 对象，然后访问 b 属性
new a()['b']
```

###Left Handside & Right Handside Expression
> 能否放到等号左边决定

Left Handside
* a.b = "c"

Right Handside
* a++
* a--
* --a
* ++a

###Unary 单目运算符
* delete
* void foo()：转换为一个 undefined
* typeof
* + ：正号
* - ：负号
* ～ ：将整数按位取反，不是整数会强制转换为整数
* !：取反
* await

### **
> 右结合语法表示乘方。


```js

3 ** 2 ** 3
```

###运算符
* * / %：会发生类型转换
* + -
* << >> >>
* < > <= >= instanceof in 

###相等比较
比较
* == ：类型转换复杂 
* !=
* ===
* !==

位运算
* & ^ |

###逻辑运算符

* && ：前部分为 false，后不执行（短路原则）
* || ：前半部分为 true，后不执行（短路原则）

###三目运算符
* ? : 





