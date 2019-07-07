const webpack = require('webpack')
const path = require('path')
const argv = require("yargs").argv;

const htmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin")
 const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
// const MONACO_DIR = path.resolve(__dirname, './node_modules/monaco-editor');

module.exports = {
  resolve: {
    // 别名配置
    alias: {
      '@pages': path.resolve(__dirname, "./src/pages")
    }
  },
  // 入口文件
  entry: {
    main: path.resolve(__dirname, 'src/index.js'),
    // vendors: ['moment', 'lodash']
},
  // 输出文件
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].[id].js?[hash:5]',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        use: {
          loader: 'babel-loader',
          query: {
            presets: ['stage-0', 'react'],
            plugins: [
              [
                "import",
                {libraryName: "antd", style: "css"},
                "transform-async-to-generator",
                "transform-regenerator",
                "transform-runtime"
              ],
            ]
          },
        },

       exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.bundle\.js$/,
        use: {
          loader: 'bundle-loader',
          options: {
            name: '[name]',
            lazy: true
          }
        }
      },
      {
        test: /\.(sass|scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              minimize: argv.mode !== "development",
            }
          },
          {
            loader: "postcss-loader"
          },
          {
            loader: "sass-loader"
          }
        ],
        // include: MONACO_DIR
      },
      // 打包 图片文件
      { 
        test: /\.(jpg|png|gif|jpeg)$/,
        use: [
          {
            loader: 'file-loader'
          },
          {
            loader: 'url-loader',
            options: {
              limit: 8 * 1024
            }
          }
        ]
      },
      // 打包 字体文件
      { test: /\.(woff|woff2|eot|ttf|otf)$/, use: 'file-loader' }
    ]
  },
  devServer: {
    historyApiFallback: true,
    // 服务器的根目录 
    contentBase: path.join(__dirname, 'dist'),
    // 自动打开浏览器
    // open: true,
    // 端口号
    port: 3001,
    // --------------- 1 热更新 -----------------
    hot: true
  },
  // // 提取公共模块
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all',
  //     name:'vendors',//需要分离的名称 
  //     filename:'common.js' //分离后的名称 
  //   }
  // },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css"
    }),
    new CleanWebpackPlugin(['dist']),
    // ---------------- 2 启用热更新插件 ----------------
    new webpack.HotModuleReplacementPlugin(),
    //根据模板，生成html页面 自动引入bundle.js、css等文件
    new htmlWebpackPlugin({
      // 模板页面路径
      template: path.join(__dirname, './src/index.html'),
      // 在内存中生成页面路径，默认值为：index.html
      filename: 'index.html'
    }),
    new MonacoWebpackPlugin({languages:['javascript', 'json'],output:'monaco-editor'})
  ]
  
}