module.exports = {
    // entry: './main.js',
    entry: './animationDemo.js',
    module:{
        rules:[
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options:{
                        presets: ['@babel/preset-env'],
                        plugins: [['@babel/plugin-transform-react-jsx', {pragma: "createElement"}]]
                    }
                }
            }
        ]
    },
    devServer:{
        contentBase: './'
    },
    mode: "development"
}