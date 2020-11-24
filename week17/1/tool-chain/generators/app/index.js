var Generator = require('yeoman-generator');

module.exports = class extends Generator {
    // The name `constructor` is important here
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);

        // Next, add your custom code
        // this.option('babel'); // This method adds support for a `--babel` flag
    }

    initPackage(){
        // 描述要安装的依赖
        const pkgJson = {
            devDependencies: {
              eslint: '^3.15.0'
            },
            dependencies: {
              react: '^16.2.0'
            }
          };
      
          // 如果不存在 pakage.json 会直接创建
          this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
          // 安装依赖
        //   this.npmInstall();

    }

    async method1() {

        /*
        // 实现和用户的交互
        const answers = await this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Your project name',
                default: this.appname
            },
            {
                type: 'confirm',
                name: 'cool',
                message: 'would you like to enable the cool feature'
            }
        ])

        this.log("app name", answers.name);
        this.log("app name", answers.cool);
        */

        this.fs.copyTpl(
            this.templatePath('t.html'),
            this.destinationPath('public/index.html'),
            { title: 'Templating with Yeoman' }
        );

    }

};