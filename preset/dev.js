const proxyHost = 'baidu.com'

module.exports = {
  host: '0.0.0.0',
  proxy: {
    '^/proxy': {
      target: proxyHost,
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/proxy/, '')
    }
  }
}
