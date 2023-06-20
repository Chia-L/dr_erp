<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import VxeBasicDlgComp from '@/components/VxeBasicDlgComp.vue'
import EditPassPw from '@/components/EditPassPw.vue'
import { RSA_Encrypt, checkPassword } from '@/utils/index'
import { httpHelper } from '@/utils/httpHelper'
import { useUserStore } from '@/stores/modules/user'
import useGlobalProperties from '@/hooks/globalVar'
import moment from 'moment'
import Cookies from 'js-cookie'
import { Base64 } from 'js-base64'

const router = useRouter()
const userStore = useUserStore()
const { loginLogo, loginLogoHeight, productName, loginTitle, companyName, tel } = useGlobalProperties().__drParams
const accountFormInsRef = ref(null)
const account = reactive({
  user: '',
  password: ''
})
const rules = reactive({
  user: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})
const versionRef = ref(moment().format('YYYY'))
const forgotDlgRef = ref(null)
const forgetPwd = reactive({
  userName: ''
})
const forgetPwdRules = reactive({
  userName: [
    { required: true, message: '请输入账户名', trigger: 'blur' },
    { validator: userNameChecker, trigger: 'blur' }
  ]
})
const forgetFromRef = ref(null)
const editPwInsRef = ref(null)
const pwdPolicyRef = ref(null)
const minLenRef = ref(null)

/* fun */

function userNameChecker (rules, value, cb) {
  if (!(/^\s*\S{1,32}\s*$/.test(value))) {
    return cb(new Error('用户名长度应该小于32位'))
  }
  cb()
}

/* methods */
function onForgot() {
  forgotDlgRef.value?.openDlg(true)
}

/**
 * @description 执行登录
 * @param pram
 */
function doLogin(pram) {
  httpHelper('/api/auth/login/', 'POST', pram).then(res => {
    if (res.r.toString() !== '0') {
      return ElMessage.error(res.e)
    }
    if (res?.data?.change_pwd) {
      pwdPolicyRef.value = res.data?.change_pwd ? res.data.change_pwd.policy : 'low'
      minLenRef.value = res.data?.change_pwd ? res.data.change_pwd.pwd_length : '1'
      if (!([0, '0'].includes(res?.data?.change_pwd?.change_flog)) || !checkPassword(pwdPolicyRef.value, minLenRef.value, account.password)) {
        editPwInsRef.value?.openDlg(true)
        return
      }
    }
    userStore.setToken((process.env.VITE_BASE_URL === '/local') ? 'dev' : Cookies.get('csrftoken'))
    userStore.setUserInfo(account.user)
    router.push('/')
  }).catch(console.error)
}

/**
 * @description 获取登录前需要的信息
 * @returns {*}
 */
function beforeSignIn() {
  return httpHelper('/api/auth/token/', 'POST', { username: Base64.encode(account.user) })
    .then(res => {
      if (res.r.toString() !== '0') {
        return ElMessage.error(res.e)
      }
      localStorage.setItem('public_key', res?.data?.public_key)
      localStorage.setItem('global_public_key', res?.data?.global_public_key)
      doLogin({
        username: Base64.encode(account.user),
        password: RSA_Encrypt(res?.data?.salt + account.password)
      })
    })
    .catch(console.error)
}

/**
 * @description 触发登录
 */
function onSignIn() {
  accountFormInsRef.value?.validate(valid => {
    valid && beforeSignIn()
  })
}

/**
 * @
 */
function handleForgotPasswd(close) {
  this.$nextTick(() => {
    forgetFromRef.value?.validate((valid) => {
      if (valid) {
        httpHelper('/api/account/forget_password/', 'POST', {username: Base64.encode(forgetPwd.userName)})
          .finally(() => {
            close()
          })
          .catch(console.error)
      }
    })
  })
}

function reLogin(value, newPassWd){
  if (value) {
    account.password = newPassWd
    onSignIn()
  }
}
</script>

<template>
  <section class="clw-view">
    <header>
      <div class="clw-header-left">
        <img :src="loginLogo" :height="loginLogoHeight">
        <span v-text="productName"></span>
      </div>
      <div class='clw-header-right'>
        <a href="javascript:;">关于我们</a>
        <a href="javascript:;">在线帮助</a>
      </div>
    </header>
    <main>
      <div class="login-view">
        <div class="login-title" v-text="'登录' + loginTitle"></div>
        <div class="login-view-left">
          <div class="content"></div>
        </div>
        <el-form class="login-con"
                 ref="accountFormInsRef"
                 :model="account"
                 :rules="rules"
                 label-width="0"
                 @keyup.enter="onSignIn">
          <el-form-item prop="user">
            <el-input v-model.trim="account.user"
                      class="h50"
                      placeholder="请输入用户名"
                      type="text"
                      autofocus
                      autocomplete="off">
              <template #prefix>
                <i class="iconfont i-user"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model.trim="account.password"
                      class="h50"
                      placeholder="请输入密码"
                      type="password"
                      autocomplete="off">
              <template #prefix>
                <i class="iconfont i-mima"></i>
              </template>
            </el-input>
          </el-form-item>
          <div class="forgot-view">
            <a class="float-right" href="javascript:;" @click="onForgot">忘记密码</a>
          </div>
          <el-button class="login-btn h50" type="primary" @click="onSignIn">登录</el-button>
        </el-form>
        <div class="clerware-des">
          <p class="copyright">版权所有 © <span v-text="companyName"></span> <span v-text="versionRef"></span> 保留一切权利</p>
          <p class="service-support">服务支持：<span v-text="tel"></span></p>
        </div>
      </div>
    </main>
    <vxe-basic-dlg-comp ref="forgotDlgRef"
                        dlg-class-name="email-dlg"
                        width="415px"
                        height="400px"
                        :on-confirm="handleForgotPasswd"
                        title="忘记密码">
      <el-form class="email-v"
               ref="forgetFromRef"
               hide-required-asterisk
               :model="forgetPwd"
               :rules="forgetPwdRules"
               :label-width="110">
        <el-form-Item prop="userName" label="请输入账户名：">
          <el-input v-model="forgetPwd.userName"
                    placeholder="请输入账户名"
                    @keyup.enter.stop="handleForgotPasswd"></el-input>
        </el-form-Item>
        <div class="forget-pwd-text"><i class="iconfont i-tishi4"></i>将发送重设密码的链接至该账户绑定的邮箱地址，请注意查收。若用户未绑定邮箱，请联系相关管理员重置密码。</div>
      </el-form>
    </vxe-basic-dlg-comp>
    <edit-pass-pw ref="editPwInsRef"
                  :pwd-policy="minLenRef"
                  :min-len="minLenRef"
                  @re-login="reLogin"></edit-pass-pw>
  </section>
</template>

<style scoped lang="less">
.clw-view {
  width: 100vw;
  height: 100vh;
  min-width: @page-min-width;
  min-height: @page-min-height;
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: @page-header-height;
    padding: 0 10px;
    background-color: @page-header-bk;
    .clw-header-left,
    clw-header-right{
      display: flex;
      align-items: center;
    }
    .clw-header-left {
      span {
        color: #FFFFFF;
        font-size: 14px;
        font-weight: bolder;
        margin-left: 10px;
      }
    }
    .clw-header-right {
      a {
        color: #e4e4e4;
        font-size: 13px;
        &:hover {
          color: #0062cc;
        }
      }
      a + a {
        margin-left: 10px;
      }
    }
  }
  main {
    position: relative;
    height: calc(100% - @page-header-height);
    background: url("/static/images/login.png") no-repeat;
    background-size: 100% 100%;
    background-attachment: fixed;
    .login-view {
      display: flex;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      width: 971px;
      height: 350px;
      background-color: white;
      .login-title {
        position: absolute;
        top: -78px;
        width: 100%;
        height: 38px;
        text-align: center;
        font-size: 30px;
        font-weight: 500;
        color: #e4e4e4;
      }
      .login-view-left{
        width: 550px;
        height: 350px;
        padding: 50px;
        border-right: 1px solid #ccc;
        .content {
          width: 100%;
          height: 100%;
          background: url("/static/images/login_bk.png") no-repeat;
          background-size: 100% 100%;
        }
      }
      .login-con{
        width: 420px;
        height: 350px;
        padding: 48px 50px 0;
        background-size: cover;
        z-index: 1;
        .h50 {
          height: 50px;
        }
        .forgot-view {
          float: right;
          margin-bottom: 18px;
        }
        .login-btn {
          width: 100%;
          font-size: 20px;
        }
        i.iconfont {
          color: #212529;
          font-size: 18px;
        }
      }
      .clerware-des {
        display: flex;
        justify-content: center;
        position: absolute;
        bottom: -35px;
        width: 100%;
        p {
          color: #e4e4e4;
          font-size: 13px;
        }
        .copyright {
          margin-right: 25px;
        }
      }
    }
  }
  .email-dlg {
    .forget-pwd-text {
      font-size: 14px;
      color: #e6a23c;
      .i-zhushi-kong {
        font-size: 20px;
      }
    }
  }
}
</style>
