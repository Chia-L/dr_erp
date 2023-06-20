const base = require('./template/base')
const login = require('./template/login')
const dataCenter = require('./template/DataCenter')
module.exports = [
  ...base,
  ...login,
  ...dataCenter
]
