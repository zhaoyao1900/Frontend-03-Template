var Generator = require('yeoman-generator');

module.exports = class extends Generator {
    // The name `constructor` is important here
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);

        // Next, add your custom code
        // this.option('babel'); // This method adds support for a `--babel` flag
    }

    async initPackage(){

        // 拿到用户输入项目名称
        let answers = await this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Your project name',
                default: this.appname
            }
        ])


        // 描述要安装的依赖
        const pkgJson = {
            "name": answers.appname,
            "version": "1.0.0",
            "description": "工具链-1",
            "main": "generators/app/index.js",
            "scripts": {
              "test": "echo \"Error: no test specified\" && exit 1"
            },
            "author": "",
            "license": "ISC",
            devDependencies: {
            },
            dependencies: {
              "vue": '^16.2.0'
            }
          };
      
          // 如果不存在 pakage.json 会直接创建
          this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
          // 安装依赖
          this.npmInstall(["vue"],{"save-dev": false});
          this.npmInstall(["webpack",'vue-loader'],{"save-dev": true});


    }

    conpyFiles() {
        this.fs.copyTpl(
            this.templatePath("helloWorld.vue"),
            // 拷贝到的地方
            this.destinationPath("src/helloWorld.vue"),
            {}
        )
    }

};