const proxyHost = 'http://172.16.5.205/'

module.exports = {
  host: '0.0.0.0',
  port: '8080',
  proxy: {
    '^/proxy': {
      target: proxyHost,
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/proxy/, '')
    }
  }
}
