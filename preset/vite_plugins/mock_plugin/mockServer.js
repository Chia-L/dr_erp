import path from 'node:path'
import fs from 'node:fs'
import chokidar from 'chokidar'
import colors from 'picocolors'
import url from 'url'
import fg from 'fast-glob'
import Mock from 'mockjs'
import { pathToRegexp, match } from 'path-to-regexp'
import { bundleRequire } from 'bundle-require'


export let mockData = []

export async function createMockServer(opt, config) {
  opt = {
    mockPath: 'mock',
    watchFiles: true,
    configPath: 'vite.mock.config.js',
    logger: true,
    ...opt
  }
  if (mockData.length > 0) return
  mockData = await getMockConfig(opt, config)
  await createWatch(opt, config)
}

export async function requestMiddleware(opt) {
  const { logger = true } = opt
  const middleware = async (req, res, next) => {
    let queryParams = {}

    if (req.url) {
      queryParams = url.parse(req.url, true)
    }

    const reqUrl = queryParams.pathname

    const matchRequest = mockData.find((item) => {
      if (opt.urlPrefixes) {
        const baseUrlReg = new RegExp(`^${opt.urlPrefixes}`)
        if (item.url && !baseUrlReg.test(item.url)) {
          item.url = item.url ? opt.urlPrefixes + item.url : item.url
        }
      }
      if (!reqUrl || !item || !item.url) {
        return false
      }
      if (item.method && item.method.toUpperCase() !== req.method) {
        return false
      }
      return pathToRegexp(item.url).test(reqUrl)
    })

    if (matchRequest) {
      const isGet = req.method && req.method.toUpperCase() === 'GET'
      const { response, rawResponse, timeout, statusCode, url } = matchRequest

      if (timeout) {
        await sleep(timeout)
      }

      const urlMatch = match(url, { decode: decodeURIComponent })

      let query = queryParams.query
      if (reqUrl) {
        if ((isGet && JSON.stringify(query) === '{}') || !isGet) {
          const params = (urlMatch(reqUrl)).params
          if (JSON.stringify(params) !== '{}') {
            query = (urlMatch(reqUrl)).params || {}
          } else {
            query = queryParams.query || {}
          }
        }
      }

      const self = { req, res, parseJson: parseJson.bind(null, req) }
      if (isFunction(rawResponse)) {
        await rawResponse.bind(self)(req, res)
      } else {
        const body = await parseJson(req)
        res.setHeader('Content-Type', 'application/json')
        res.statusCode = statusCode || 200
        const mockResponse = isFunction(response)
          ? response.bind(self)({ url: req.url, body, query, headers: req.headers })
          : response
        res.end(JSON.stringify(Mock.mock(mockResponse)))
      }

      logger && loggerOutput('request invoke', req.url)
      return
    }
    next()
  }
  return middleware
}

function createWatch(opt, config) {
  const { configPath, logger, watchFiles } = opt

  if (!watchFiles) {
    return
  }

  const { absConfigPath, absMockPath } = getPath(opt)

  if (process.env.VITE_DISABLED_WATCH_MOCK === 'true') {
    return
  }

  const watchDir = []
  const exitsConfigPath = fs.existsSync(absConfigPath)

  exitsConfigPath && configPath ? watchDir.push(absConfigPath) : watchDir.push(absMockPath)

  const watcher = chokidar.watch(watchDir, {
    ignoreInitial: true,
  })

  watcher.on('all', async (event, file) => {
    logger && loggerOutput(`mock file ${event}`, file)
    mockData = await getMockConfig(opt, config)
  })
}

function cleanRequireCache(opt) {
  if (!require.cache) {
    return
  }
  const { absConfigPath, absMockPath } = getPath(opt)
  Object.keys(require.cache).forEach((file) => {
    if (file === absConfigPath || file.indexOf(absMockPath) > -1) {
      delete require.cache[file]
    }
  })
}

function parseJson(req) {
  return new Promise((resolve) => {
    let body = ''
    let jsonStr = ''
    req.on('data', function (chunk) {
      body += chunk
    })
    req.on('end', function () {
      try {
        jsonStr = JSON.parse(body)
      } catch (err) {
        jsonStr = ''
      }
      resolve(jsonStr)
      return
    })
  })
}

async function getMockConfig(opt, config) {
  cleanRequireCache(opt)
  const { absConfigPath, absMockPath } = getPath(opt)
  const { ignore, configPath, logger } = opt

  let ret = []

  if (configPath && fs.existsSync(absConfigPath)) {
    logger && loggerOutput(`load mock data from`, absConfigPath)
    ret = await resolveModule(absConfigPath, config)
    return ret
  }
  /*const mockFiles = fg
    .sync(`**!/!*.{ts,mjs,js}`, {
      cwd: absMockPath,
    })
    .filter((item) => {
      console.log(!ignore, isFunction(ignore), isRegExp(ignore))
      if (!ignore) {
        return true
      }
      if (isFunction(ignore)) {
        return ignore(item)
      }
      if (isRegExp(ignore)) {
        return !ignore.test(path.basename(item))
      }
      return true
    })*/
  try {
    /*ret = []
    const resolveModulePromiseList = []
    for (let index = 0; index < mockFiles.length; index++) {
      const mockFile = mockFiles[index]
      resolveModulePromiseList.push(resolveModule(path.join(absMockPath, mockFile), config))
    }

    const loadAllResult = await Promise.all(resolveModulePromiseList)
    for (const resultModule of loadAllResult) {
      let mod = resultModule
      if (!isArray(mod)) {
        mod = [mod]
      }
      ret = [...ret, ...mod]
    }*/
    let mod = require(absMockPath)
    ret = mod
  } catch (error) {
    loggerOutput(`mock reload error`, error)
    ret = []
  }
  return ret
}

async function resolveModule(p, config) {
  const mockData = await bundleRequire({
    filepath: p,
  })

  let mod = mockData.mod.default || mockData.mod
  if (isFunction(mod)) {
    mod = await mod({ env: config.env, mode: config.mode, command: config.command })
  }
  return mod
}

function getPath(opt) {
  const { mockPath, configPath } = opt
  const cwd = process.cwd()
  const absMockPath = isAbsPath(mockPath) ? mockPath : path.join(cwd, mockPath || '')
  const absConfigPath = path.join(cwd, configPath || '')
  return {
    absMockPath,
    absConfigPath,
  }
}

function loggerOutput(title, msg, type) {
  const tag = type === 'info' ? colors.cyan(`[vite:mock]`) : colors.red(`[vite:mock-server]`)
  return console.log(
    `${colors.dim(new Date().toLocaleTimeString())} ${tag} ${colors.green(title)} ${colors.dim(
      msg,
    )}`,
  )
}

function is(val, type) {
  return Object.prototype.toString.call(val) === `[object ${type}]`
}

// eslint-disable-next-line
function isFunction(val) {
  return is(val, 'Function') || is(val, 'AsyncFunction')
}

export function isArray(val) {
  return val && Array.isArray(val)
}

export function isRegExp(val) {
  return is(val, 'RegExp')
}

export function isAbsPath(path) {
  if (!path) {
    return false
  }
  // Windows 路径格式：C:\ 或 \\ 开头，或已含盘符（D:\path\to\file）
  if (/^([a-zA-Z]:\\|\\\\|(?:\/|\uFF0F){2,})/.test(path)) {
    return true
  }
  // Unix/Linux 路径格式：/ 开头
  return /^\/[^/]/.test(path)
}

export function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('')
    }, time)
  })
}
