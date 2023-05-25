const proxyHost = 'baidu.com'

module.exports = {
  proxy: {
    '^/proxy': {
      target: proxyHost,
      changeOrigin: true,
      pathRewrite: { '^/proxy': '' }
    }
  }
}
