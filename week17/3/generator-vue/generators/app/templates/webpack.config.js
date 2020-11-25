const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: "./src/main.js",
    module: {
        rules: [
            {
                test: /\.vue$/, 
                loader: "vue-loader"
            },
            // 普通的 js 文件以及 .vue 文件中的 <script>
            {
                test: /\.js$/,
                loader: "babel-loader" 

            },
            // 普通的 css 文件 .vue 文件中的 <style> 
            {
                test: /\/css$/, 
                use: [
                "vue-style-loader",
                "css-loader"
            ]}
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new CopyPlugin({
            patterns: [
              { from: "src/*.html", to: "[name].[ext]" },
            ],
          }),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
        })
    ]
}