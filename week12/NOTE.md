# Proxy 与双向绑定｜ Proxy 基本用法
>强大而危险的API。会使代码的的预期性变差。

`Proxy`可以对对象很多方法做中间状态的处理，使得预测性变差。

## Proxy 

`const p = new Proxy(target, handler)`

* target: 监听对象
* handler: 配置钩子函数`hooks`的对象。

![hooks列表](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

```js
  // 普通数据类型对象，无法被监听
    let object = {
        a: 1,
        b: 2,
    }

    // 只有Proxy实例会触发,钩子函数。
    let po = new Proxy(object,{
        // 即使设置没有的属性也会触发 set 函数
        set(obj, prop, val){
            console.log('set',obj, prop, val);
        },
        get(target, prop, receiver){
            console.log('get',target, prop, receiver);
        }
    })
```


# proxy 与双向绑定｜模仿 reactivity 实现原理（一）

> 通过`reactive`函数，返回`Poxy`实例，实现对目标对象的监听。

`new`关键所涉及到的`hooks`函数
* constructor
* apply

```js
  let object = {
        a: 1,
        b: 2,
    }
    let po = reactive(object);

    // 返回一个用 Proxy 包裹的实例。
    function reactive(object) {
        return new Proxy(object, {
            set(obj, prop, val){
                // 修改目标对象值
                obj[prop] = val;
                console.log(obj, prop, val)
                return obj[prop];

            },
            get(obj, prop, val){
                console.log(obj, prop ,val)
                // 直接返回值
                return obj[prop];
            }
        })
    }
```

# proxy 与双向绑定｜模仿 reactivity 实现原理（二）

> 通过`effect`函数代替`addEventListener`。实现目标对象的属性操作的监听。

* 全局数组存储，用于监听的回调。
* 在监听对象触发`set`时，遍历触发所有回调。

```js
    let objcet = {
        a: 1,
        b: 2
    }
    // 通过全局 callbacks 保存 effect 传入的回调
    let callbacks = [];

    let po = reactive(objcet);

    // 创建监听回调
    effect( () => {
        console.log(po.a);
    })

    // 存储所有回调
    // 存在性能问题，不能做到对回调中监听属性单独回调。
    function effect(callback) {
        callbacks.push(callback);
    }

    function reactive(object) {
        return new Proxy(object, {
            get(obj, prop, val){
                return obj[prop];
            },
            set(obj, prop ,val){
                obj[prop] = val;
                // 有属性设置的时候，触发回调
                for (const callback of callbacks) {
                    callback();
                }
                return obj[prop];
            }
        });
    }
```

# proxy 与双向绑定｜模仿 reactivity 实现原理（三）

>实现只触发回调中所使用的属性关键，获取到回调函数中使用的变量。

* 建立回调中使用属性值和回调关系的数据结构
* 通过实际调用回调函数，如果函数中使用`reactive`对象，可以在`get`函数中监听得到。
* 在`set`方法中触发属性所对应的回调。


```js

// 1. 存储使用到属性和回调对应关系。

// 函数中使用 reactive 包装过对象，会在调用时触发 get
get(obj, prop, val){
    // 存储 reactive 对象，和用的属性值。
    usedReactivties.push([obj, prop]);
    return obj[prop];
},

function effect(callback) {
    usedReactivties = [];
    callback(); // 调用一次在 get 中获取使用变量（reactive）
    console.log(usedReactivties);

    // 存储函数中依赖，和回调对应关系。
    for (const reactivity of usedReactivties) {
        // 防止多次注册
        if (!callbacks.has(reactivity[0])) {
            // 第一层，记录使用到的 reactive 对象
            callbacks.set(reactivity[0], new Map());
        }
        if (!callbacks.get(reactivity[0]).has(reactivity[1])) {
            // 第二层，记录属性对应的回调。
            callbacks.get(reactivity[0]).set(reactivity[1], []);
        }
        callbacks.get(reactivity[0]).get(reactivity[1]).push(callback);
    }
    console.log('callback', callbacks)
}

// 2. 触发对象某个属性，对应的回调。
if (callbacks.get(obj))
    if (callbacks.get(obj).get(prop)) 
        for (const callback of callbacks.get(obj).get(prop)) {
            callback();
        }
                
```

# proxy 与双向绑定｜优化 reactivity

> 实现嵌套对象值的监听。

* `get` 方法中如果是对象重新包裹`reactive`
* 使用全局表格保存`poxy`,防止新包裹`reactive`，`poxy`不一致的问题。


```js
function reactive(object) {
// 利用缓存
if (reactivties.has(objcet)) {
    return reactivties.get(objcet);
}
let proxy = new Proxy(object, {
    // 函数中使用 reactive 包装过对象，会在调用时触发 get
    get(obj, prop, val){
        // 存储 reactive 对象，和用的属性值。
        usedReactivties.push([obj, prop]);
        // 为对象中存储对象值包裹 reactive
        if(typeof obj[prop] === 'object'){
            return reactive(obj[prop]);
        }
        return obj[prop];
    },
    set(obj, prop ,val){
        obj[prop] = val;
        // 触发对象某个属性，对应的回调。
        if (callbacks.get(obj))
            if (callbacks.get(obj).get(prop)) 
                for (const callback of callbacks.get(obj).get(prop)) {
                    callback();
                }
        
        return obj[prop];
    }
});
// 保证新对象属性之设置仍旧触发。
reactivties.set(objcet, proxy);
return proxy;
}
```