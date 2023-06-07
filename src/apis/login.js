import { httpHelper } from '@/utils/httpHelper.js'

function login() {
  return httpHelper('api/account/login/', 'POST')
}

function logout() {
  return httpHelper('api/account/logout/', 'POST')
}

function getUserInfo() {
  return httpHelper('/api/account/get_user_info/', 'POST').catch(e => {})
}

export {
  login,
  logout,
  getUserInfo
}
