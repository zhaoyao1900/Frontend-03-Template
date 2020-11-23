var Generator = require('yeoman-generator');

module.exports = class extends Generator {
    // The name `constructor` is important here
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);

        // Next, add your custom code
        // this.option('babel'); // This method adds support for a `--babel` flag
    }

    async method1() {

        // 获取用户输入
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

    }

};