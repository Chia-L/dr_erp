!(async () => {
  try {
    await import('mockjs')
  } catch (e) {
    throw new Error('vite-plugin-vue-mock requires mockjs to be present in the dependency tree.')
  }
})()

import { createMockServer, requestMiddleware } from './mockServer'

export default function viteMockServer(opt) {
  let isDev = false
  let config = {}

  return {
    name: 'mock-server',
    enforce: 'pre',
    // 解析 Vite 配置后调用。使用这个钩子读取和存储最终解析的配置。
    configResolved(resolveConfig) {
      config = resolveConfig
      isDev =  config.mode === 'development'
      isDev && createMockServer(opt, config)
    },
    // 配置开发服务器的钩子。
    configureServer: async ({ middlewares }) => {
      const {enable = isDev} = opt
      if (!enable) {
        return
      }
      const middleware = await requestMiddleware(opt)
      middlewares.use(middleware)
    }
  }
}
