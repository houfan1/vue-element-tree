const CompressionWebpackPlugin = require("compression-webpack-plugin");
const productionGzipExtensions = ["js", "css"];
const path = require("path");

module.exports = {
    // publicPath: "./", // 根域上下文目录
    outputDir: "dist", // 构建输出目录
    assetsDir: "assets", // 静态资源目录 (js, css, img, fonts)
    runtimeCompiler: true, // 运行时版本是否需要编译
    transpileDependencies: [], // 默认babel-loader忽略mode_modules，这里可增加例外的依赖包名
    productionSourceMap: false, // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
    
    configureWebpack: config => {
        // if (env === "pro" || env === "test" || env === "dev") {
        // 生产环境
        if (process.env.NODE_ENV === 'production') {
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
        }
        config.plugins.push(
            new CompressionWebpackPlugin({
                filename: "[path].gz[query]",
                algorithm: "gzip",
                test: new RegExp(
                    "\\.(" + productionGzipExtensions.join("|") + ")$"
                ),
                threshold: 10240,
                minRatio: 0.8,
                //是否删除源文件
                deleteOriginalAssets: false
            })

        );

        // }
    },
    //配置多页面应用 后续开发防止需要
    // pages: {
    //     blog: {
    //         entry: 'src/blog/main.js',
    //         template: 'public/index.html',
    //         filename: "index.html",

    //     },
    //     admin: {
    //         entry: 'src/admin/main.js',
    //         template: 'public/admin.html',
    //         filename: "admin.html",
    //     }
    // },
    // chainWebpack: config => {
    //     config.resolve.alias
    //         .set('theme', `./src/assets/css/${theme}`)
    //         .set("assets", resolve("src/assets"))
    // },
    devServer: {
        // open: true,
        // host: 'localhost',
        port: 8080,
        contentBase: path.join(__dirname, 'public'),
        https: false,
        hotOnly: false,
        proxy: {
            // 配置跨域
            "/website-supervise-manage": {
                // target: "http://192.168.6.171:9090",
                target: "http://192.168.6.195:9090",
                // target: "http://192.168.6.56:9090",
                changeOrigin: true,
                // pathRewrite: {
                //     '^/api': ''
                //   }
            },
            "/WebsiteSuperviseManage": {
            //    target: "http://192.168.6.171:9090",
               target: "http://192.168.6.195:9090",
            // target: "http://192.168.6.56:9090",
                changeOrigin: true,
                // pathRewrite: {
                //     '^/api': ''
                //   }
            },
        }
    }
};