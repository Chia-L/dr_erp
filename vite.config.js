import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'
import viteMockServer from './preset/vite_plugins/mock_plugin'

const postcssPresetEnv = require("postcss-preset-env")
const devCfg = require('./preset/dev')


// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const useMock = !!env.VITE_USE_MOCK

  return defineConfig({
    base: './',
    productionSourceMap: mode !== "production",
    plugins: [
      vue(),
      vueJsx(),
      legacy({
        targets: ['> 1%', 'last 2 version', 'ie >= 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        renderLegacyChunks:true,
        polyfills: [
          'es.symbol',
          'es.array.filter',
          'es.promise',
          'es.promise.finally',
          'es/map',
          'es/set',
          'es.array.for-each',
          'es.object.define-properties',
          'es.object.define-property',
          'es.object.get-own-property-descriptor',
          'es.object.get-own-property-descriptors',
          'es.object.keys',
          'es.object.to-string',
          'web.dom-collections.for-each',
          'esnext.global-this',
          'esnext.string.match-all'
        ]
      }),
      viteMockServer({
        mockPath: "mock",
        urlPrefixes: '/local',
        localEnabled: useMock,  // 开发打包开关
        prodEnabled: false, // 生产打包开关
        supportTs: false, // 打开后，可以读取 ts 文件模块。 请注意，打开后将无法监视.js 文件。
        watchFiles: true, // 监视文件更改
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        'apis': fileURLToPath(new URL('./src/apis', import.meta.url)),
        'comps': fileURLToPath(new URL('./src/components', import.meta.url))
      }
    },
    css: {
      postcss:{
        plugins:[postcssPresetEnv()]
      },
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import (reference) "${resolve("src/assets/css/base.less")}";`,
          },
          javascriptEnabled: true,
        },
      },
    },
    server: devCfg,
    build: {
      target: 'es2015',
      outDir: "dist",
      assetsDir: "static",
      sourcemap: false,
      minify: "terser",
      chunkSizeWarningLimit: 1500,
      terserOptions: {
        compress: {
          drop_debugger: true  // 生产环境取消debugger
        },
        output: {
          comments: true, // 去掉注释内容
        },
      },
    }
  })
}
