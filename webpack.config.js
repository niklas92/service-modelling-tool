

const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

const path = require('path');

module.exports = {
    /*watch: true,
    watchOptions: {
        ignored: /(node_modules)/
    },*/
    entry: {
        'vendor': ['d3'],
        'app': path.resolve(__dirname,'src/app.jsx')
    },
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: 'scripts/[name].js'
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015','react']
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader', // 'babel-loader' is also a legal name to reference
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.html$/,
                use: [ {
                    loader: 'html-loader',
                    options: {
                        minimize: true,
                        removeComments: false,
                        collapseWhitespace: false
                    }
                }]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({name: "vendor", minChunks: Infinity,}),
        new webpack.optimize.UglifyJsPlugin(),
        new HtmlWebpackPlugin({template: './src/index.html'}),
        new ExtractTextPlugin("styles/app.css"),
        new CopyWebpackPlugin([
            { from: './src/styles' , to: 'styles'}
        ])
    ]

};
