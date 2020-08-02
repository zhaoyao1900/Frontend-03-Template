# JS 语句｜声明
> 分类标准：对后续语句产生影响

分类：
* FunctionDeclaration
* GeneratorDeclaration
* AsyncFunctionDeclaration
* AsyncGeneratorDeclaration 
* VariableStatement：变量声明
* ClassDeclaration
* LexicalDeclaration


## FunctionDeclaration (函数声明)

共性：优先级是一致的
* function
* function *
* async function
* async function * 
* var：先声明，提到函数头部，单赋值还未发生。


共性：在声明之前调用会报错
* class
* const
* let

## 预处理（pre-process）
> 在js代码执行之前，js 引擎会做一次预先处理。
>**所有的声明都会有预处理机制**

*无论`var`变量声明在什么地方，预处理机制都会将其提出来，放到函数作用域级别*
```j
// 预处理中的 var 
var a = 2;
void function(){
    // 预处理机制，会使内部声明 a 占据此次赋值
    a = 1;
    return;
    var a;
}();

console.log(a); // a
```

`const`声明也会被预处理，不同之处是，在声明之前使用会抛出错误，可以被`try catch`处理
```
// 预处理中的 const
var a = 2;
void function(){
    a = 1;
    return;
}
```

##作用域
>变量发生作用的范围


* `var`和`function`的声明作用域：始终在所处的函数体内部。

```j
var a = 2;
void function(){
    a = 1;
    {
        // var 声明作用域在函数体内，预处理时会被提到外部函数体内部
        var a;
    }
}();
console.log(a)
```

* `const`作用域：只在所在的花括号内部。

```j
var a = 2;
void function(){
    a = 1;
    {
        // 作用域会被限定在 { } 内部
        const a;
    }
}()
console.log(a)
```










