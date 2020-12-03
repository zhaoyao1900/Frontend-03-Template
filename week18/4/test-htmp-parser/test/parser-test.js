var assert = require('assert');
import parseHTML from "../src/parser.js";

// 将测试分组
describe("parse html:", function () {

    // 测试单纯标签
    it("<a>abc</a>", function() {
        let tree = parseHTML("<a></a>");
        console.log(tree);
        assert.strictEqual(tree.children[0].tagName, "a");
        assert.strictEqual(tree.children[0].children.length, 0);
    });

    // 测试带属性标签
    it("<a href='//google.com'></a>", function() {
        let tree = parseHTML("<a href='//google.com'></a>");
        console.log(tree);
        assert.strictEqual(tree.children.length, 1);
        assert.strictEqual(tree.children[0].children.length, 0);
    });
    
})

