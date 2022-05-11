const path = require("path");
const webpack = require("webpack");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 将CSS提取为独立的文件的插件
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin; //BZ压缩
const BrotliGzipPlugin = require("brotli-gzip-webpack-plugin"); //BZ压缩
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const productionGzipExtensions = ['js', 'css', 'png', 'jpeg']; // 资源压缩
const isEnv = process.env.NODE_ENV; // 环境配置
const publicPath = process.env.VUE_APP_CDN; // 静态资源地址
const root_api = process.env.VUE_APP_API; // 本地代理地址
const assetsPath = function(_path) {
    const assetsSubDirectory = "static";
    return path.posix.join(assetsSubDirectory, _path);
};
const resolve = dir => {
        return path.join(__dirname, dir)
    }
    //const plant = process.env.VUE_APP_PLANT
module.exports = {
    publicPath: publicPath,
    outputDir: 'dist',
    assetsDir: "static",
    configureWebpack: config => {
        // 关闭 webpack 的性能提示
        if (isEnv == "production") {
            // 为生产环境修改配置...
            config.mode = "production";
            if (isEnv != "test1") { // test不清除console
                config.plugins.push(
                    new UglifyJsPlugin({
                        uglifyOptions: {
                            compress: {
                                drop_debugger: true,
                                drop_console: true,
                            },
                            warnings: false,
                        },
                        sourceMap: false,
                        parallel: true
                    })
                );
            }
            config.plugins.push(new webpack.ProgressPlugin());
            config.plugins.push(new CleanWebpackPlugin());
            config.plugins.push(
                new CompressionWebpackPlugin({
                    // 资源压缩
                    algorithm: "gzip",
                    test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
                    threshold: 10240,
                    minRatio: 0.8
                })
            );
            config.plugins.push(
                new BrotliGzipPlugin({
                    asset: "[path].br[query]",
                    algorithm: "brotli",
                    test: /\.(js|css|html|svg)$/,
                    threshold: 10240,
                    minRatio: 0.8
                })
            );
            config.plugins.push(
                new MiniCssExtractPlugin({
                    filename: assetsPath("css/[name].[contenthash:8].css"),
                    chunkFilename: assetsPath("css/[name].[contenthash:8].css")
                })
            );
            config.plugins.push(
                new BundleAnalyzerPlugin({
                    analyzerMode: "static",
                    reportFilename: "bundle-report.html",
                    openAnalyzer: false
                })
            );
            config.plugins.push(
                new webpack.NamedChunksPlugin(chunk => {
                    if (chunk.name) {
                        return chunk.name;
                    }
                    const hash = require("hash-sum");
                    const joinedHash = hash(
                        Array.from(chunk.modulesIterable, m => m.id).join("_")
                    );
                    return `chunk.` + joinedHash;
                })
            );
            config.plugins.push(
                new webpack.HashedModuleIdsPlugin()
            );
        } else {
            // 为开发环境修改配置...
            config.mode = "development";
            config.plugins.push(
                // keep chunk.id stable when chunk has no name
                new webpack.NamedChunksPlugin(chunk => {
                    if (chunk.name) {
                        return chunk.name;
                    }
                    const hash = require("hash-sum");
                    const joinedHash = hash(
                        Array.from(chunk.modulesIterable, m => m.id).join("_")
                    );
                    return `chunk.` + joinedHash;
                })
            );
            config.plugins.push(
                new webpack.HashedModuleIdsPlugin()
            );
        }
    },
    lintOnSave: false, // 关闭eslink
    chainWebpack: config => {
        config.entry('main').add('babel-polyfill');
        config.resolve.alias
            .set("@m", resolve("src/module"))
            .set('@styl', resolve('src/assets/styles')) //公共样式引入路径
            .set('@pon', resolve('src/components')) //公共组件引入路径
            .set('@com', resolve('src/components/common')) //公共部分组件引入路径
            .set('@img', resolve('src/assets/images')) //公共图片引入路径
            .set('@js', resolve('src/module/utils')) //公共js引入路径
            .set('@comview', resolve('src/views/comview')) //公共comview引入路径
        config
            .plugin('html')
            .tap(args => {
                args[0].hash = true,
                    args[0].minify = {
                        removeComments: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: true,
                        minifyCSS: true,
                        removeCommentsFromCDATA: true
                    }
                return args
            });
        config.plugins.delete("preload");
        config.plugins.delete("prefetch");
        const svgRule = config.module.rule('svg') // SVG精灵图显示
        svgRule.uses.clear()
        config.module
            .rule("svg-sprite-loader")
            .test(/\.svg$/)
            .include.add(resolve("src/icons")) //处理svg目录
            .end()
            .use("svg-sprite-loader")
            .loader("svg-sprite-loader")
            .options({
                symbolId: "icon-[name]"
            });
        config.module
            .rule("file-loader")
            .test(/\.(svg)(\?.*)?$/)
            .include.add(/node_modules|assets/)
            .end()
            .use("file-loader")
            .loader("file-loader")
            .options({
                name: "img/[name].[hash:8].[ext]"
            });
        if (isEnv == "production") {
            config.optimization.runtimeChunk("single").splitChunks({ // 代码分割
                chunks: "all",
                maxInitialRequests: Infinity,
                minSize: 0,
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/](vue|vue-router|vuex|lodash|core-js|core-js-pure|@babel\/runtime|axios|js-cookie|qs)[\\/]/,
                        name(module) {
                            const packageName = module.context.match(
                                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                            )[1];
                            return `vendor.${packageName.replace("@", "")}`;
                        }
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true
                    },
                    styles: {
                        name: "styles",
                        test: /\.css$/,
                        chunks: "all",
                        enforce: true
                    }
                }
            });
            config.output
                .filename(assetsPath("js/[name].[contenthash:8].js"))
                .chunkFilename(assetsPath("js/[name].[contenthash:8].js"));
        } else {
            config.optimization
                .runtimeChunk("single")
                .splitChunks({
                    chunks: "all",
                    maxInitialRequests: Infinity,
                    minSize: 0,
                    cacheGroups: {
                        vendor: {
                            test: /[\\/]node_modules[\\/](vue|vue-router|vuex|lodash|core-js|core-js-pure|@babel\/runtime|axios|js-cookie|qs)[\\/]/,
                            name(module) {
                                const packageName = module.context.match(
                                    /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                                )[1];
                                return `vendor.${packageName.replace("@", "")}`;
                            }
                        },
                        default: {
                            minChunks: 2,
                            priority: -20,
                            reuseExistingChunk: true
                        },
                        styles: {
                            name: "styles",
                            test: /\.css$/,
                            chunks: "all",
                            enforce: true
                        }
                    }
                })
                .removeAvailableModules(true);
            config.output
                .filename(assetsPath("js/[name].[hash].js"))
                .chunkFilename(assetsPath("js/[name].[hash].js"));
        }

        config.plugin('html').tap((args) => {
            args[0].time = new Date().toISOString()
            return args
        })
    },
    pwa: {
        //name: process.env.VUE_APP_NAME,
        themeColor: "#4DBA87",
        msTileColor: "#000000",
        appleMobileWebAppCapable: "yes",
        appleMobileWebAppStatusBarStyle: "black",
        // iconPaths:{
        //     favicon32: `img/icons/${process.env.VUE_APP_PLANT}/favicon-32x32.png`,
        //     favicon16: `img/icons/${process.env.VUE_APP_PLANT}/favicon-16x16.png`,
        //     androidChrome192: `img/icons/${process.env.VUE_APP_PLANT}/android-chrome-192x192.png`,
        //     appleTouchIcon: `img/icons/${process.env.VUE_APP_PLANT}/apple-touch-icon-152x152.png`,
        //     maskIcon: `img/icons/${process.env.VUE_APP_PLANT}/safari-pinned-tab.svg`,
        //     msTileImage: `img/icons/${process.env.VUE_APP_PLANT}/msapplication-icon-144x144.png`,
        // },
        workboxPluginMode: "GenerateSW", //  workboxPluginMode: 'InjectManifest',,
        workboxOptions: {
            navigateFallback: "/index.html",
            runtimeCaching: [{
                urlPattern: new RegExp("api/"),
                handler: "NetworkFirst",
                options: {
                    networkTimeoutSeconds: 20,
                    cacheName: "api-cache",
                    cacheableResponse: {
                        statuses: [0, 200]
                    }
                }
            }]
        }
    },

    // devServer: {
    //     // 设置代理
    //     proxy: {
    //         "/": {
    //             target: root_api, // 域名
    //             ws: false, // 是否启用websockets
    //             changOrigin: true, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
    //             pathRequiresRewrite: {
    //                 "^/api": "/"
    //             }
    //         }
    //     }
    // }

    devServer: {
        // 设置代理
        proxy: {
            "/mock": {
                target: 'http://192.168.80.178:7300/', // 域名
                ws: false, // 是否启用websockets
                changOrigin: true, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
                pathRequiresRewrite: {
                    "^/mockApi": "/"
                }
            },
            "/oss": {
                target: 'http://saas.test1.h5f.adre45.com/', // 域名
                ws: false, // 是否启用websockets
                changOrigin: true, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
            },
            "/api": {
                target: root_api, // 域名
                ws: false, // 是否启用websockets
                changOrigin: true, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
                pathRequiresRewrite: {
                    "^/api": "/"
                }
            },
        }
    }
};