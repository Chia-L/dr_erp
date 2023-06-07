import { authDisplay, authDisable } from './modules/auth'

const directivesMap = {
  authDisplay,
  authDisable
}
const directives = {
  install: function (app) {
    Object.keys(directivesMap).forEach((key) => {
      // 注册所有自定义指令
      app.directive(key, directivesMap[key])
    })
  },
}

export default directives
