#JS中的对象

要素
* property： 1.属性描述状态 2.描述行为
* prototype：原型机制 

原型机制：
自身包含属性，会在自身原型上找，依次向上直到为`null`


##property

###key 类型
* key：String
* symbol：内存地址保证唯一性。 

###value 类型 
* 数据属性（data property）：存储数据值
    * [[value]]：是否可读
    * writable：是否可写
    * enumerable：是否可枚举
    * configurable：

* 访问器属性（Accessor property）
    * get
    * set
    * enumrable
    * configurable  

##原型链
>只要描述和原型的区别，就可以完成描述。


##Object API 

访问、设置属性
* {} . [] Object.defineProperty

基于原型描述对象
* Object.create / Object.setPrototypeOf /
Object.getPrototypeOf

基于分类描述对象
* new / class / extends

历史包袱（尽量不用）
* new / function / prototype


##Function object
> 带`[[call]]`行为的对象。通过`f()`声明来激活`[[call]]`行为

[[func]]
>在 JavaScript 中无法调用的方法，但是在宿主环境中可以通过 JavaScript 引擎来定义这些方法。

##Array object 


##Host object
> 由宿主环境所定义的对象（window、）












