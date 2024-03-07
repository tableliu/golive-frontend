const path = require('path');
const webpack = require('webpack');
const GenerateAssetPlugin = require('generate-asset-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];
// const {BaseServe, MapApi, Socket} = require('./src/api/API.js');
//
// const createServerConfig = function(compilation){
//   let cfgJson = { BaseServe, MapApi, Socket };
//   return JSON.stringify(cfgJson);
// }

module.exports = {
    productionSourceMap:false,
    baseUrl: process.env.NODE_ENV == 'production' ? '/' :  '/',
    chainWebpack: config => {
     config.module
       .rule('vue')
       .use('vue-loader')
       .loader('vue-loader')
       .tap(options => Object.assign(options, {
             transformAssetUrls: {
                'v-img': ['src', 'lazy-src'],
                'v-card': 'src',
                'v-card-media': 'src',
                'v-responsive': 'src',
                'v-carousel-item': 'src',
                //...
             }
         }))
     },
    devServer: {
      // proxy: {
      //   '/': {
      //     ws:false,   // proxy websockets
      //     target: 'http://192.168.3.20:80',  //目标接口域名
      //     changeOrigin: true,  //是否跨域
      //     pathRewrite: {
      //       '^/': '/'   //重写接口
      //     }
      //   }
      // }
    },
    transpileDependencies: [
      /\bvue-echarts\b/,
      /\bresize-detector\b/
    ],
    configureWebpack: {
          resolve: {
            alias: {
                Api: path.resolve(__dirname, 'src/api/'),
                Components: path.resolve(__dirname, 'src/components/'),
                Constants: path.resolve(__dirname, 'src/constants/'),
                Container: path.resolve(__dirname, 'src/container/'),
                Views: path.resolve(__dirname, 'src/views/'),
                Helpers: path.resolve(__dirname, 'src/helpers/'),
                Themes: path.resolve(__dirname, 'src/themes/')
            },
            extensions: ['*', '.js', '.vue', '.json']
        },
        plugins: [
          // new GenerateAssetPlugin({
          //     filename: 'serverconfig.json',
          //     fn: (compilation, cb) => {
          //         cb(null, createServerConfig(compilation));
          //     },
          //     extraFiles: []
          // }),
          //jquery plugin
          new webpack.ProvidePlugin({
              $: 'jquery',
              jquery: 'jquery',
              'window.jQuery': 'jquery',
              jQuery: 'jquery'
          }),
          new CompressionWebpackPlugin({
            algorithm: 'gzip',
            test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
            threshold: 10240,
            minRatio: 0.8
          }),
          new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 5, 
            minChunkSize: 100
          })
        ]
    }
}
