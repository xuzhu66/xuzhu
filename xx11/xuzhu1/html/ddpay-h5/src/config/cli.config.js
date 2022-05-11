module.exports = {
  // history模式默认使用"/"或者"/二级目录/"，记住只有hash时publicPath可以为空！！！
  publicPath: '/',
  // 生产环境构建文件的目录名
  outputDir: 'dist',
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: 'static',
  // 开发环境每次保存时是否输出为eslint编译警告
  lintOnSave: true,
  // 开发环境端口号
  devPort: 9527,
  // pwa
  pwa: true
}
