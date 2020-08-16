# HTML 解析｜HTML parse 模块的文件拆分

##拆分文件

* 为了方便管理，将`parse` 单独拆分到文件中
* parse接受 HTML 文本，并返回 DOM

##node launch.json 
debugger 代码配置文件

```json
{
    "configurations": [
    {
        "name": "Launch Program",
        "program": "${workspaceFolder}/1-splitFile/client.js",
        "request": "launch",
        "skipFiles": [
            "<node_internals>/**"
        ],
        "type": "pwa-node"
    }
    ]
}
```