const {
  devPort,
  assetsDir,
  outputDir,
  lintOnSave,
  publicPath
} = require('./src/config')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const path = require('path')
const proxyUrl = process.env['VUE_APP_PROXY_URL']
const TerserPlugin = require('terser-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const isProd = process.env.NODE_ENV === 'production'
module.exports = {
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  productionSourceMap: !isProd,
  devServer: {
    hot: true,
    port: devPort,
    open: true,
    noInfo: false,
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      // dev 接口运行：npm run dev
      // test 接口运行：npm run test
      // uat 接口运行：npm run uat
      '/api': {
        // target: 'http://ddpayh5.dfre45.com',
        // target: 'http://test.ddpayh5.adre45.com',
        // target: 'http://192.168.80.180:8080',
        target: proxyUrl,
        changeOrigin: true
      },
      '/oss': {
        target: proxyUrl,
        // target: 'http://ddpayh5.dfre45.com',
        // target: 'http://test.ddpayh5.adre45.com',
        changeOrigin: true
      },
      '/mock': {
        target: 'http://192.168.80.178:7300/',
        changeOrigin: true,
        pathRewrite: {
          '^/mockApi': '/'
        }
      }
    }
  },
  css: {
    // extract: false, // false表示开发环境,true表示生成环境
    sourceMap: !isProd,
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-px-to-viewport')({
            unitToConvert: 'px', // 需要转换的单位，默认为"px"
            viewportWidth: 375, // 视窗的宽度，对应设计稿的宽度
            // viewportHeight: 1080, // 视窗的高度，对应的是我们设计稿的高度
            unitPrecision: 3, // 单位转换后保留的精度
            propList: [
              // 能转化为vw的属性列表
              '*'
            ],
            viewportUnit: 'vmin', // 希望使用的视口单位
            fontViewportUnit: 'vmin', // 字体使用的视口单位
            selectorBlackList: [], // 不会转为视口单位，需要忽略的CSS选择器使用原有的px等单位。
            minPixelValue: 1, // 设置最小的转换数值，如果为1的话，只有大于1的值会被转换
            mediaQuery: false, // 媒体查询里的单位是否需要转换单位
            replace: true // 是否直接更换属性值，而不添加备用属性
            // exclude: /(\/|\\)(node_modules)(\/|\\)/ // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
          })
        ]
      }
    }
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = '滴滴付'
      args[0].time = new Date()
      return args
    })
    config.module
      .rule('svg')
      .exclude.add(path.resolve(__dirname, './src/icons/svg'))

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(path.resolve(__dirname, './src/icons/svg'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ symbolId: 'icon-[name]' })
      .end()
      .use('svgo-loader')
      .loader('svgo-loader')

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .use('vue-loader-v16')
      .loader('vue-loader-v16')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
    if (isProd) {
      // mutate config for production...
      console.log(process.env['ana'])
      if (process.env['ana']) {
        config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
          {
            analyzerMode: 'static',
            openAnalyzer: false
          }
        ])
      }

      // config.optimization
      //   .splitChunks({
      //     ...config.optimization.get('splitChunks'),
      //     minChunks: 10,
      //     cacheGroups: {
      //       defaultVendors: {
      //         test: /[\\/]node_modules[\\/]/,
      //         priority: -10,
      //         reuseExistingChunk: true
      //       },
      //       default: {
      //         minChunks: 10,
      //         priority: -20,
      //         reuseExistingChunk: true
      //       }
      //     }
      //   })
    } else {
      // mutate for development...
    }
  },
  configureWebpack: (config) => {
    // 生产环境配置
    if (isProd) {
      config.optimization = {
        chunkIds: 'size',
        minimizer: [
          new TerserPlugin({
            parallel: true,
            terserOptions: {
              ecma: undefined,
              warnings: false,
              parse: {},
              compress: {
                drop_console: true,
                drop_debugger: false,
                pure_funcs: ['console.log'] // 移除console
              }
            }
          })
        ],
        splitChunks: {
          // ...config.optimization.splitChunks,
          minChunks: 10,
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true
            },
            default: {
              minChunks: 10,
              priority: -20,
              reuseExistingChunk: true
            }
          }
        }
      }
      // 代码压缩去除console.log
      // config.plugins.push(
      //   new TerserPlugin({
      //     terserOptions: {
      //       ecma: undefined,
      //       warnings: false,
      //       parse: {},
      //       compress: {
      //         drop_console: true,
      //         drop_debugger: false,
      //         pure_funcs: ['console.log'] // 移除console
      //       }
      //     }
      //   })
      // )
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: (info) => {
            return `${info.path}.gz${info.query}`
          },
          algorithm: 'gzip',
          threshold: 10240, // 只有大小大于该值的资源会被处理 10240
          test: new RegExp('\\.(' + ['js'].join('|') + ')$'),
          minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
          deleteOriginalAssets: false // 删除原文件
        })
      )
    }
  }
}
