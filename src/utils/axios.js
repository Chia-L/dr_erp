import axios from 'axios'
import { ElMessage } from 'element-plus'
import { assignIn } from 'lodash'

/**
 * 重试管理类
 */
class RetryCnt {
  constructor() {
    this._cnt = {}
  }

  _checkKey(key) {
    if (this._cnt[key] === undefined) {
      this._cnt[key] = 0
    }
  }

  // 获取key
  getCnt(key) {
    this._checkKey(key)
    return this._cnt[key]
  }

  // 添加 key
  addCnt(key) {
    this._checkKey(key)
    this._cnt[key]++
  }

  // 删除 key
  clearCnt(key) {
    if (this._cnt[key] === undefined) {
      return
    }
    this._cnt[key] = undefined
  }
}

/**
 *
 * @param url 请求地址
 * @param method 方法
 * @param data 数据
 * @param params 回调使用的参数
 * @param config axios配置
 * @returns {Promise<unknown>}
 */
function httpHelper(url, method, data, params, config={}) {
  const baseUrl =  import.meta.env.VITE_BASE_URL || ''
  url = baseUrl + url
  const key = method + '_' + url
  const retryCnt = new RetryCnt
  let timer = null
  let options = {
    url: url,
    method: method,
    params:['GET', 'DELETE'].includes(method.toString().toUpperCase()) ? data : null,
    data: ['PUT', 'POST', 'PATCH'].includes(method.toString().toUpperCase()) ? data : null,
    responseType: 'json',
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken'
  }
  options = assignIn({}, options, config)

  // 处理重试，间隔 2 秒，重试 5 次
  function retryFetch() {
    let flag = false
    if (retryCnt.getCnt(key) < 5) {
      timer = setTimeout(() => {
        retryCnt.addCnt(key)
        httpHelper.apply(null, arguments)
      })
      flag = true
    }
    return flag
  }

  // 需要重试
  function needRetry(code) {
    return [502, 504].indexOf(code) > -1
  }

  // 异常ui处理
  function showError(code) {
    if (code !== -1) {
      ElMessage.error('内部错误，错误码：' + code)
    }
  }

  // 需要登录
  function needLogin(res_body, res_code) {
    if (res_code === 4000) {
      window.location.href = '/#/login'
      return true
    }
    return false
  }

  // 异常处理
  function handleException(e){
    if (e.response) {
      const res_code = e.response.status
      const res_body = e.response.data

      // 需要重新登录
      if (needLogin(res_body, res_code)) {
        return
      }

      if (needRetry(res_code) && retryFetch()) {
        return
      }

      showError(res_code, res_body)
    }
    // 没响应回来（等待响应回来期间按了F5、响应丢失啦）
    else if (e.request) {
      showError(-1, '获取数据失败：响应丢失！')
    }
    else {
      showError(-1, '获取数据失败：代码异常！')
    }
  }

  return new Promise((resolve, reject) => {
    axios(options)
      .then(res => {
        retryCnt.clearCnt(key)
        resolve(res.data, params, res, axios.defaults)
      })
      .catch(e => {
        handleException(e)
        reject(e, axios.defaults)
      })
  })

}

function httpApi() {

}


export {
  httpHelper
}
