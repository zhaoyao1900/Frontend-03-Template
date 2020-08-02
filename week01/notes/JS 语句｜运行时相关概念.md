# JS 语句 ｜ 运行时相关概念

> 通过语句完成控制流程

##Statement 语句

Grammar（语法）
* 简单语句
* 复合语句
* 声明

Runtime（运行时）
* Completion Record （语句执行结果记录）
* Lexical Environment （作用域）

###Completion Reaction
>用来存储语句执行结果的数据结构 

组成：
* [[type]]：normal 、break 、continue 、return 、throw
* [[value]]：返回值 （基本类型）
* [[target]]：label

```j
// 语句有不同的执行结果
if(x == 1)
    return 10;
```

###简单语句
分类
* **ExpressionStatement**：表达式 + 分号
* EmptyStatement
* DebuggerStatement：debugger 关键字
* ThrowStatement：抛出异常
* ContinueStatement：结束当前，之后继续
* BreakStatement：终结整个循环
* ReturnStatement：返回函数值，只能在函数中使用

###复合语句
分类
* **BlockStatement**：一对话括号，内部是语句列表
* IfStatement
* SwitchStatement
* IterationStatement：循环语句
* WhitStatement: with 关键字打开对象，放入函数作用域中。
* LabelledStatement：为语句命名
* TryStatement：


####BlockStatement 

* Completion Reaction 中存储结果，会根据内部语句变化
• [[type]]: normal 
• [[value]]: --
• [[target]]: --


```
// 声明结构
BlockStatement {
      ░░░░
      ░░░░
      ░░░░
}
```

####Iteration

* while( ▒▒ ) ░░░░
* do ░░░░ while( ▒▒ );
* for( ▓▓ ; ▒▒ ; ▒▒) ░░░░ • for( ▓▓ in ▒▒ )░░░░
* for( ▓▓ of ▒▒ )░░░░
* for await( of )

▓▓：中可以声明变量

`for`类型循环中`let`声明作用域。
* 是独立于`for`语句后面花括号作用域
* 可以改变、可跨循环保存。

####break、continue 、LabelledStatement

* LabelledStatement
* IterationSatement
* ContinueStatement
* BreakStatement
* SwitchStatement

Completion Reaction 中的记录
* [[type]]：break continue
* [[value]]：--
* [[traget]]：babel

####TryStatement

`try`语句中`return`并不能打断后续`catch`和`finally`的执行。

```
try {
░░░░░░░░
} catch( ▓▓▓ ) {
░░░░░░░░
} finally {
░░░░░░░░
}
```
