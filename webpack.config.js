const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = { 
    mode: "development",
    entry: './src/main.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: "[name][ext]",
        clean: true
    },  
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|svg|jpg|jpeg|ico)$/i,
                type: "asset/resource"
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource",
            },
        ]
    },  
    plugins: [
        new HtmlWebpackPlugin({
            title: "Battleships",
            filename: "index.html",
            template: "./src/index.html"
        })
    ]   
};