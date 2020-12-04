var assert = require('assert');
import parseHTML from "../src/parser.js";

// 将测试分组
describe("parse html:", function () {

    // 根据 nyc 给出未覆盖的行数，编写单元测试。

    // 测试单纯标签
    it("<a>abc</a>", function() {
        let tree = parseHTML("<a>abc</a>");
        assert.strictEqual(tree.children[0].tagName, "a");
        assert.strictEqual(tree.children[0].children.length, 0);
    });

    // 测试带属性标签
    it("<a href='//google.com'></a>", function() {
        let tree = parseHTML("<a href='//google.com'></a>");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });

    // 没有等号赋值属性
    it("<a href ></a>", function() {
        let tree = parseHTML("<a href ></a>");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });

    // 测试设置多个属性
    it("<a href id ></a>", function() {
        let tree = parseHTML("<a href id ></a>");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });

    it("<a href='abc' id ></a>", function() {
        let tree = parseHTML("<a href='abc' id ></a>");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });


    it("<a id=abc ></a>", function() {
        let tree = parseHTML("<a id=abc ></a>");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });

    // 测试自封闭标签
    it("<a />", function() {
        let tree = parseHTML("<a />");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });

    it('<a id=\'a\' />', function() {
        let tree = parseHTML('<a id=\'a\' />');
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });

    it('<A /> upper case', function() {
        let tree = parseHTML('<A /> upper case');
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });

    it('< >', function() {
        let tree = parseHTML('< >');
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].type, "text");
    });

    it("<a style='' />", function() {
        let tree = parseHTML("<a style='' />");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].type, "text");
    });

    let str = `<html a='maa'>
        <head>
            <style>
                #container{
                    width: 500px;
                    height: 300px;
                    display: flex;
                    background-color: rgb(255,255,255);
                }
                #container #myid{
                    width: 200px;
                    height: 100px;
                    background-color: rgb(255,0,0);
                }
                #container .c1{
                    flex: 1;
                    background-color: rgb(0,255,0);
                }
            </style>
        </head>
        <body>
            <div id='container'>
                <div id='myid'/>
                <div class='c1'/>
            </div>
        </body>
    </html>`

    it(str, function() {
        let tree = parseHTML(str);
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].type, "text");
    });

    // 未闭合标签
    it("<head </head>", function() {
        let tree = parseHTML("<head </head>");
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].type, "text");
    })

    it(`<head id="head"></head>`, function() {
        let tree = parseHTML(`<head id="head"></head>`);
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].type, "text");
    })

    it(`<head id=head value ></head>`, function() {
        let tree = parseHTML(`<head id=head value ></head>`);
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].type, "text");
    })

    it(`<head id=head value/ />`, function() {
        let tree = parseHTML(`<head id=head value/ />`);
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].type, "text");
    })

    it(`<head id=head'> >`, function() {
        let tree = parseHTML(`<head id='head'> > `);
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].type, "text");
    })

    it(`<head id=>`, function() {
        let tree = parseHTML(`<head id=>`);
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].type, "text");
    })

    it(`<head />`, function() {
        let tree = parseHTML(`<head/>`);
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].type, "text");
    })

    it(`<head></a>`, function() {
        let tree = parseHTML(`<head></a>`);
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].type, "text");
    })
    it(`<head></head id='='>`, function() {
        let tree = parseHTML(`<head></head  id='='>`);
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].type, "text");
    })
})

