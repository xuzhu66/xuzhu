// import request from '@/utils/request'
// import { useStorage } from '@vueuse/core'
const useStorage = () => import('@/hooks/useStorage')
const requestFun = () => import('@/utils/request')

// ----------------------------------------------用户登陆---------------------------------------------
// 登陆
export async function login(data) {
  const encrypt = (await useStorage()).useStorageModule('encrypt', true)
  const request = (await requestFun()).default
  console.log(request)
  return request({
    url: encrypt.value
      ? '/api/ddpay-auth/app/secret/oauth/token'
      : '/api/ddpay-auth/app/oauth/token',
    // url: '/api/ddpay-auth/app/oauth/token',
    // url: '/api/ddpay-auth/app/secret/oauth/token',
    method: 'post',
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // },
    params: data
    // data,
    // isParams: true
  })
}
// 登陆-二次验证
export async function loginSecond(data) {
  const request = (await requestFun()).default
  return request({
    url: '/api/ddpay-auth/app/oauth/token',
    method: 'post',
    params: data
    // isParams: true
  })
}
// 自动登陆--注册完后自动登陆
export async function autoLoginApi(data) {
  const request = (await requestFun()).default
  return request({
    url: '/api/ddpay-auth/app/oauth/token',
    method: 'post',
    params: data
    // isParams: true
  })
}

// 登录-刷新token
export async function refreshToken(data) {
  const request = (await requestFun()).default
  return request({
    url: '/api/ddpay-auth/app/oauth/token',
    method: 'post',
    data
  })
}

// 退出登陆
export async function logout(data) {
  const request = (await requestFun()).default
  return request({
    url: '/api/ddpay-auth/app/oauth/logout',
    method: 'post',
    data
  })
}

export async function getUserRegistInfoApi(data) {
  const request = (await requestFun()).default
  // 用户注册信息
  return request({
    url: '/api/ddpay-user/app/message/registerType',
    method: 'post',
    data
  })
}

// ----------------------------------------------用户注册---------------------------------------------

export async function mobileAccount(data) {
  const request = (await requestFun()).default
  // 手机号注册
  return request({
    url: '/api/register/mobileAccount',
    method: 'post',
    data
  })
}

export async function verifyCode(data) {
  const request = (await requestFun()).default
  // 发送手机验证码
  return request({
    url: '/api/sendSms/verifyCode',
    method: 'post',
    data
  })
}

export async function register(data) {
  const request = (await requestFun()).default
  return request({
    url: '/api/register',
    method: 'post',
    data
  })
}

// ----------------------------------------------忘记密码---------------------------------------------
// 忘记密码-手机
export async function forgetPwdMobile(data) {
  const request = (await requestFun()).default
  return request({
    url: '/api/ddpay-user/app/user/forgetPwdMobile',
    method: 'post',
    data
  })
}
// 忘记密码-邮箱
export async function forgetPwdEmailApi(data) {
  const request = (await requestFun()).default
  return request({
    url: '/api/ddpay-user/app/user/forgetPwdEmail',
    method: 'post',
    data
  })
}
// 高级认证
export async function legalizeApi(data) {
  const request = (await requestFun()).default
  return request({
    url: '/api/ddpay-user/app/user/legalize',
    method: 'post',
    data
  })
}
// 充值密码
export async function resetPwdApi(data) {
  const request = (await requestFun()).default
  return request({
    url: '/api/ddpay-user/app/user/resetPwd',
    method: 'post',
    data
  })
}
// 忘记手机或邮箱
export async function forgetMobileOrEmailApi(data) {
  const request = (await requestFun()).default
  return request({
    url: '/api/ddpay-user/app/user/forgetMobileOrEmail',
    method: 'post',
    data
  })
}
// 发送短信验证码-未登录
export async function sendPhoneApi(data) {
  const request = (await requestFun()).default
  return request({
    url: '/api/ddpay-user/app/message/sendPhone',
    method: 'post',
    data
  })
}
// 发送短信验证码-已登录
export async function sendPhoneHasLoginApi(data) {
  const request = (await requestFun()).default
  return request({
    url: '/api/ddpay-user/app/message/captcha',
    method: 'post',
    data
  })
}
// 发送邮件验证码-未登录
export async function sendEmailApi(data) {
  const request = (await requestFun()).default
  return request({
    url: '/api/ddpay-user/app/message/sendEmail',
    method: 'post',
    data
  })
}
// 注册
export async function registerAccountApi(data) {
  const request = (await requestFun()).default
  return request({
    url: '/api/ddpay-user/app/user/registerAccount',
    method: 'post',
    data
  })
}
// 获取腾讯验证码
export async function getTencentAppIdApi(data) {
  const request = (await requestFun()).default
  return request({
    url: '/api/ddpay-system/app/search/getAppid',
    method: 'post',
    data
  })
}
