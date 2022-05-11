import { defineStore } from 'pinia'
import {
  autoLoginApi,
  forgetMobileOrEmailApi, forgetPwdEmailApi, forgetPwdMobile,
  getTencentAppIdApi, getUserRegistInfoApi, legalizeApi,
  login, loginSecond, logout, registerAccountApi, resetPwdApi,
  sendEmailApi, sendPhoneApi, sendPhoneHasLoginApi
} from '@/api/user'
import { getToken, removeToken, setToken } from '@/utils/token'
// import { isString } from '@/utils/validate'
import router from '@/router'
export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(),
    username: '',
    // 用户注册信息
    userRegistInfo: {
      tel: '',
      email: '',
      type: '' // 1.手机号；2.邮箱；
    },
    baseInfo: '', // 登陆信息
    refreshTokenTime: 1000 * 60 * 30, // 刷新时间
    refreshTokenIterval: '', // 刷新定时器
    loginCode: '', // 登陆返回code码
    // 忘记密码对象
    forgotObj: {
      type: '', // 1:手机 2:邮箱
      tel: '',
      email: '',
      uid: '', // 用户id
      code: '', // 随机数，verify=0时有值
      verify: '' // 是否高级校验：0、否；1、是；
    },
    // 重置对象
    resetObj: {
      uid: '',
      code: ''
    },
    // 验证码配置
    tencentConfig: {
      picAppId: '', // 腾讯云 验证码必传参数
      appKey: '', // 阿里云 智能验证码必传参数
      ccij: '', // 图形验证码供应商标识 Tencent_captcha=腾讯云, Aliyun_captcha=阿里云
      boolCcij: true // 是否开启图形验证码：true= 开启，false = 关闭
    },
    // 注册对象
    registerForm: {
      account: '', // 手机号码/邮箱号
      mobileAreaCode: '86', // 国际区号
      password: '', // 密码
      inviteCode: '', // 邀请码.  -A
      category: '', // 0-短信，1-邮件
      verifyCode: '', // 手机验证码 邮件验证码
      sessionId: '', // 阿里云
      sig: '', // 阿里云
      token: '', // 阿里云
      scene: '', // 阿里云
      ticket: '', // 腾讯云
      randstr: ''// 腾讯云
    },
    loginObj: ''// 登陆临时对象
  }),
  getters: {
    getToken: (state) => state.token,
    getUsername: (state) => state.username,
    getAvatar: (state) => state.avatar
  },
  actions: {
    setTokenAction(token) {
      this.token = token
      setToken(token)
    },
    setUsername(username) {
      this.username = username
    },
    afterLogin(token) {
      if (token) {
        this.setTokenAction(token)
      }
    },
    // 注销
    async logoutAction() {
      await logout().then(() => {
        this.jumpPage(`/login`)
      })
      await this.resetAll()
    },
    // 重置
    async resetAll() {
      this.setTokenAction(null)
      this.setUsername('游客')
      removeToken()
      clearInterval(this.refreshTokenIterval)
    },
    // 登陆
    async loginAction(userInfo) {
      // this.jumpPage(`/certify`)
      const { data: data, success: success, code: code } = await login(userInfo)
      this.baseInfo = data
      this.loginCode = code
      // 登录成功，返回access_token
      if (success && code === 200) {
        // 保存token
        this.setTokenAction(data.access_token)
        // 设置会话刷新时间
        this.refreshTokenTime = data.expires_in * 1000
        // 定时刷新token
        this.refreshTokenFun()
        // 获取用户注册信息
        this.getUserRegistInfoAction()
        this.jumpPage(`/`)
      }
      // else if (code === 201001) { // 登录验证（邮箱）
      //   this.jumpPage(`/certify`)
      // } else if (code === 201002) { // 登录验证（google）
      //   this.jumpPage(`/certify`)
      // } else if (code === 201003) { // 登录验证（电话）
      //   this.jumpPage(`/certify`)
      // } else if (code === 201004) { // 手机号已注册
      //   this.jumpPage(`/certify`)
      // } else if (code === 201005) { // 密码错误
      //   this.jumpPage(`/certify`)
      // } else if (code === 201006) { // 密码错误次数提醒
      //   this.jumpPage(`/certify`)
      // } else if (code === 201007) { // 账号限制登录
      //   this.jumpPage(`/certify`)
      // }
    },
    // 自动登陆
    async autoLoginAction(userInfo) {
      const { data: data, success: success, code: code } = await autoLoginApi(userInfo)
      this.baseInfo = data
      this.loginCode = code
      // 登录成功，返回access_token
      if (success && code === 200) {
        // 保存token
        this.setTokenAction(data.access_token)
        // 设置会话刷新时间
        this.refreshTokenTime = data.expires_in * 1000
        // 定时刷新token
        this.refreshTokenFun()
        // 获取用户注册信息
        this.getUserRegistInfoAction()
        this.jumpPage(`/`)
      }
    },

    // 定时刷新token
    refreshTokenFun() {
      clearInterval(this.refreshTokenIterval)
      this.refreshTokenIterval = setInterval(() => {
        this.refreshTokenAction()
      }, this.refreshTokenTime)
    },
    // 刷新token
    async refreshTokenAction() {
      const userInfo = {
        username: this.baseInfo.user_name,
        grant_type: 'refresh_token',
        refresh_token: this.baseInfo.refresh_token
      }
      const { data: data, success: success } = await login(userInfo)
      if (success) {
        this.baseInfo = data
        // 保存token
        this.setTokenAction(data.access_token)
      }
    },
    // 路由跳转
    jumpPage(path) {
      router.push({ path: path }).then(() => {})
    },
    // 获取用户注册手机或者邮箱
    async getUserRegistInfoAction() {
      const { data: data, success: success } = await getUserRegistInfoApi()
      if (success) {
        this.userRegistInfo = data
        // console.log(this.userRegistInfo)
      }
      return data
    },
    // 发送短信验证码-未登录
    // 1.忘记密码-手机，2.忘记密码-邮箱，3.设置手机，4.设置邮箱，5.修改密码-手机，6.修改密码-邮箱，7.重置交易密码-手机，8.重置交易密码-邮箱，9.绑定谷歌-手机，10.绑定谷歌-邮箱
    async sendPhoneAction(param) {
      const { data: data, success: success } = await sendPhoneApi(param)
      if (success) {
        // console.log(data)
      }
      return data
    },
    // 发送短信验证码-已登录
    // 1.忘记密码-手机，2.忘记密码-邮箱，3.设置手机，4.设置邮箱，5.修改密码-手机，6.修改密码-邮箱，7.重置交易密码-手机，8.重置交易密码-邮箱，9.绑定谷歌-手机，10.绑定谷歌-邮箱
    async sendPhoneHasLoginAction(param) {
      const { success: success } = await sendPhoneHasLoginApi(param)
      if (success) {
        // console.log(data)
      }
      return success
    },
    // 忘记手机或邮箱
    async forgetMobileOrEmailAction(param) {
      const { data: data, success: success } = await forgetMobileOrEmailApi(param)
      if (success) {
        this.userRegistInfo = data
      }
      return data
    },
    // 发送邮件验证码-未登录
    async sendEmailAction(param) {
      const { data: data, success: success } = await sendEmailApi(param)
      if (success) {
        // console.log(data)
      }
      return data
    },
    // 忘记密码-手机
    async forgetPwdMobileAction(param) {
      const { data: data, success: success } = await forgetPwdMobile(param)
      if (success) {
        this.resetObj = data
      }
      return data
    },
    // 忘记密码-邮箱
    async forgetPwdEmailAction(param) {
      const { data: data, success: success } = await forgetPwdEmailApi(param)
      if (success) {
        this.resetObj = data
      }
      return data
    },
    // 高级认证
    async legalizeAction(param) {
      const { data: data, success: success } = await legalizeApi(param)
      if (success) {
        this.resetObj = data
      }
      return data
    },
    // 重置密码
    async resetPwdAction(param) {
      const { data: data, success: success } = await resetPwdApi(param)
      if (success) {
        // console.log(data)
      }
      return data
    },
    // 注册
    async registerAccountAction(param) {
      const { data: data, success: success } = await registerAccountApi(param)
      if (success) {
        // console.log(data)
      }
      return data
    },
    // 获取腾讯验证码
    async getTencentAppIdAction(param) {
      const { data: data, success: success } = await getTencentAppIdApi(param)
      if (success) {
        this.tencentConfig = data
      }
      return data
    },
    // 二次登陆
    async loginSecondAction(param) {
      const { data: data, success: success } = await loginSecond(param)
      if (success) {
        // this.tencentConfig = data
      }
      return data
    }

  }
})
