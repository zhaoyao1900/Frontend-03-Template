var Generator = require('yeoman-generator');

module.exports = class extends Generator {
    // The name `constructor` is important here
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);

        // Next, add your custom code
        // this.option('babel'); // This method adds support for a `--babel` flag
    }

    async initPackage() {

        // 拿到用户输入项目名称
        let answers = await this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Your project name',
                default: this.appname
            }
        ])
        this.answers = answers;


        // 描述要安装的依赖
        const pkgJson = {
            "name": answers.appname,
            "version": "1.0.0",
            "description": "工具链-1",
            "main": "generators/app/index.js",
            "scripts": {
                "test": "echo \"Error: no test specified\" && exit 1",
                "build": "webpack"
            },
            "author": "",
            "license": "ISC",
            devDependencies: {
            },
            dependencies: {
            }
        };

        // 如果不存在 pakage.json 会直接创建
        this.fs.extendJSON(this.destinationPath('package.json'), [pkgJson]);
        // 安装依赖
        this.npmInstall(["vue"], { "save-dev": false });
        this.npmInstall([
            "webpack@4.2.0",
            "webpack@4.44.2",
            "vue-loader",
            "vue-template-compiler",
            "vue-style-loader",
            "css-loader",
            "copy-webpack-plugin",
            "html-webpack-plugin"
        ],
            { "save-dev": true });


    }

    /**
     * 拷贝文件到指定位置
     */
    conpyFiles() {
        this.fs.copyTpl(
            this.templatePath("HelloWorld.vue"),
            // 拷贝到的地方
            this.destinationPath("src/HelloWorld.vue"),
            {}
        )

        // 复制 webpack 配置
        this.fs.copyTpl(
            this.templatePath('webpack.config.js'),
            this.destinationPath('webpack.config.js')
        )

        // 复制 main
        this.fs.copyTpl(
            this.templatePath('main.js'),
            this.destinationPath('src/main.js')
        )

        this.fs.copyTpl(
            this.templatePath('index.html'),
            this.destinationPath("src/index.html"),
            {title: this.answers.appname}
        )
    }


};