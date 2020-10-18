# 字符串算法｜总论

字符串分析算法

* 字典树
    * 大量高重复字符串的存储分析。（完全匹配）
* KMP
    * 在长字符串中找模式（部分匹配）
* Wildcard（贪心算法）
    * 通配符字符串模式（类似弱正则）
* 正则
    * 字符串通用模式匹配 
* 状态机
    * 通用字符串分析
* LL LR 
    * 字符串多层级结构分析


# Trie

* 将字符串转换为属性结构（每个字符串从头到尾，每一个不同字符将创建新的分支）
```js
    insert(word){
        let node = this.root;
        for(let c of word){
            if(!node[c]) // 子树不存在先创建子树
                node[c] = Object.create(null);
            node = node[c]; // 到下一个
        }

        // 创建截止符表示单词结束
        if (!($ in node)) {
            node[$] = 0
        }
        node[$] ++;

    }
```
* 计算出现最多的字符串（递归遍历整颗树，寻找是否 $ 结束符来判断是否最大）
```js
    most(){
        let max = 0;
        let maxWord = null;
        let visit = (node, word) => {
            if(node[$] && node[$] > max){
                max = node[$];
                maxWord = word;
            }
            for (const p of word) {
                visit(node[p], word +p);
            }
        }
        visit(this.root, "");
        console.log(maxWord);
    }
```

# KMP
> 尽量使用已经匹配的重复的字符。

* 搜索位置：已经匹配字符
* Partial Match Table：计算出跳转表格
* 移位算法：移动位数（向目标字符串后方移动） = 已匹配的字符数 - 对应部分的匹配值（Partial Match Table）

## Partial Match Table（部分匹配表）

* 前缀：除最后一个字符外一个字符的全部头部组合。
* 后缀：除第一个字符外全部尾部字符组合。
* 部分匹配值：前缀和后缀的共有元素的最大长度。


### 前后缀示例：

| 字符串  |  "bread"        |
|--------|-----------------|
| 前缀    | b、br、bre、brea |
| 后缀    | read、ead、ad 、d|

### 部分匹配值示例："ABCDABD"
前缀：A、AB、ABC、ABCD、ABCDA、ABCDAB
后缀：D、BD、ABD、DABD、CDABD、BCDABD


# Wildcard

## 通配符

`*`：任意长度字符
`?`：任意单个字符

## 星号匹配次数

最后一个星号之前，尽量少匹配，最后一个尽量多匹配。

## 以星号分段，分段匹配

星号中间段：若干 KMP 组成。（也可以通过正则处理）

