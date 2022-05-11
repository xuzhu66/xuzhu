import request from '@/utils/request'

// 支付种类
export async function paymentClassListApi(data) {
  return request({
    url: '/api/ddpay-system/app/payway/pay-list',
    method: 'post',
    data
  })
}

// 支付账号
export async function paymentListApi(data) {
  return request({
    // url: '/mock/61f0256141b6e6074b307741/h5/ddpay-auth/app/oauth/token',
    url: '/api/ddpay-user/app/pay-bank/pay-list',
    method: 'post',
    data
  })
}

// 我的个人信息
export async function getUserInfoApi(data) {
  return request({
    url: '/api/ddpay-user/app/user/info',
    method: 'post',
    data
  })
}

// 查询系统消息
export async function getMsgPageApi(data) {
  return request({
    url: '/api/ddpay-message/app/message/getMsgPage',
    method: 'post',
    data
  })
}

// 查询系统消息未读数量
export async function getMsgNotReadCountApi(data) {
  return request({
    url: '/api/ddpay-message/app/message/getMsgCount',
    method: 'post',
    data
  })
}

// 查询系统消息- 设置已读
export async function setMsgStatusApi(data) {
  return request({
    url: '/api/ddpay-message/app/message/setMsgStatus',
    method: 'post',
    data
  })
}

// 查询字典
export async function getDictionaryApi(data) {
  return request({
    url: '/api/ddpay-system/app/common/dictionary',
    method: 'post',
    data
  })
}
// 我的推广
export async function getInviteListApi(data) {
  return request({
    url: '/api/ddpay-user/app/user/inviteList',
    method: 'post',
    data
  })
}
// 我的推广
export async function getShareApi(data) {
  return request({
    url: '/api/ddpay-user/app/user/share',
    method: 'post',
    data
  })
}
// 我的推广
export async function getCenterInfoApi(data) {
  return request({
    url: '/api/ddpay-user/app/safeCenter/info',
    method: 'post',
    data
  })
}
// 重置密码-短信验证
export async function resetPwdMobileApi(data) {
  return request({
    url: '/api/ddpay-user/app/safeCenter/resetPwdMobile',
    method: 'post',
    data
  })
}
// 重置密码-邮箱验证码
export async function resetPwdEmailApi(data) {
  return request({
    url: '/api/ddpay-user/app/safeCenter/resetPwdEmail',
    method: 'post',
    data
  })
}
// 重置密码-提交
export async function resetPwdApi(data) {
  return request({
    url: '/api/ddpay-user/app/safeCenter/resetPwd',
    method: 'post',
    data
  })
}
// 重置交易密码-手机
export async function resetTradePwdMobileApi(data) {
  return request({
    url: '/api/ddpay-user/app/safeCenter/resetTradePwdMobile',
    method: 'post',
    data
  })
}
// 重置交易密码-邮箱
export async function resetTradePwdEmailApi(data) {
  return request({
    url: '/api/ddpay-user/app/safeCenter/resetTradePwdEmail',
    method: 'post',
    data
  })
}

// 重置交易密码-更新
export async function resetTradePwdApi(data) {
  return request({
    url: '/api/ddpay-user/app/safeCenter/resetTradePwd',
    method: 'post',
    data
  })
}

// 重置交易密码-设置
export async function setTradePwdApi(data) {
  return request({
    url: '/api/ddpay-user/app/safeCenter/tradePwd',
    method: 'post',
    data
  })
}

// 发送验证码-绑定手机
export async function captchaBindTelApi(data) {
  return request({
    url: '/api/ddpay-user/app/message/captchaBindTel',
    method: 'post',
    data
  })
}
// 绑定手机
export async function setTelephoneApi(data) {
  return request({
    url: '/api/ddpay-user/app/safeCenter/tel',
    method: 'post',
    data
  })
}

// 发送验证码-绑定邮箱
export async function captchaBindEmailApi(data) {
  return request({
    url: '/api/ddpay-user/app/message/captchaBindEmail',
    method: 'post',
    data
  })
}
// 绑定邮箱
export async function setEmailApi(data) {
  return request({
    url: '/api/ddpay-user/app/safeCenter/email',
    method: 'post',
    data
  })
}

// 绑定谷歌验证码
export async function setGoogleCodeApi(data) {
  return request({
    url: '/api/ddpay-user/app/safeCenter/google',
    method: 'post',
    data
  })
}
// 绑定谷歌验证码-获取32位秘钥
export async function getGoogleKeyApi(data) {
  return request({
    url: '/api/ddpay-user/app/safeCenter/getGoogleKey',
    method: 'post',
    data
  })
}

// 绑定谷歌验证码-手机验证
export async function bindGoogleMobileApi(data) {
  return request({
    url: '/api/ddpay-user/app/safeCenter/bindGoogleMobile',
    method: 'post',
    data
  })
}
// 绑定谷歌验证码-手机验证
export async function bindGoogleEmailApi(data) {
  return request({
    url: '/api/ddpay-user/app/safeCenter/bindGoogleEmail',
    method: 'post',
    data
  })
}

// 活动-登录
export async function loginLogApi(data) {
  return request({
    url: '/api/ddpay-user/app/safeCenter/loginLog',
    method: 'post',
    data
  })
}

// 活动-安全
export async function loginAuthLogApi(data) {
  return request({
    url: '/api/ddpay-user/app/safeCenter/loginAuthLog',
    method: 'post',
    data
  })
}
// 设备列表
export async function getTerminalInfoApi(data) {
  return request({
    url: '/api/ddpay-user/app/safeCenter/terminalInfo',
    method: 'post',
    data
  })
}
// 删除设备
export async function removeTerminalApi(data) {
  return request({
    url: '/api/ddpay-user/app/safeCenter/removeTerminal',
    method: 'post',
    data
  })
}

// 设置防钓鱼码
export async function fishCodeApi(data) {
  return request({
    url: '/api/ddpay-user/app/safeCenter/fishCode',
    method: 'post',
    data
  })
}
// 短信通知
export async function setMsgInfoApi(data) {
  return request({
    url: '/api/ddpay-user/app/safeCenter/msgInfo',
    method: 'post',
    data
  })
}
// 邮件通知
export async function setEmailInfoApi(data) {
  return request({
    url: '/api/ddpay-user/app/safeCenter/mailInfo',
    method: 'post',
    data
  })
}
// 查询身份认证状态
export async function queryIdApproveApi(data) {
  return request({
    url: '/api/ddpay-user/app/user/queryIdApprove',
    method: 'post',
    data
  })
}
// 未身份认证
export async function notIdApproveApi(data) {
  return request({
    url: '/api/ddpay-user/app/user/notIdApprove',
    method: 'post',
    data
  })
}
// 未完成身份认证
export async function undoneIdApproveApi(data) {
  return request({
    url: '/api/ddpay-user/app/user/undoneIdApprove',
    method: 'post',
    data
  })
}
// 已身份认证
export async function idApproveApi(data) {
  return request({
    url: '/api/ddpay-user/app/user/idApprove',
    method: 'post',
    data
  })
}
// 公共字典(数组)
export async function dictionariesApi(data) {
  return request({
    url: '/api/ddpay-system/app/common/dictionaries',
    method: 'post',
    data
  })
}
// 图片上传
export async function uploadApi(data) {
  return request({
    url: '/api/ddpay-system/app/common/upload',
    method: 'post',
    // headers: {
    //   'Content-Type': 'multipart/form-data;charset=UTF-8'
    // },
    isUploadFile: true,
    data
  })
}

// 银行列表
export async function getBankListApi(data) {
  return request({
    url: '/api/ddpay-system/app/bank-support/bank-list',
    method: 'post',
    data
  })
}
// 银行营业信息查询
export async function getBankDetailApi(data) {
  return request({
    url: '/api/ddpay-system/app/bank-support/find-name',
    method: 'post',
    data
  })
}
// 支付方式查询
export async function getPayListApi(data) {
  return request({
    url: '/api/ddpay-system/app/payway/pay-list',
    method: 'post',
    data
  })
}
// 我的-收款方式-查询
export async function getShoukuanListApi(data) {
  return request({
    url: '/api/ddpay-user/app/pay-bank/pay-list',
    method: 'post',
    data
  })
}
// 我的-收款方式-编辑修改银行卡
export async function updateUnionpayApi(data) {
  return request({
    url: '/api/ddpay-user/app/pay-bank/update-unionpay',
    method: 'post',
    data
  })
}
// 我的-收款方式-编辑修改微信
export async function updateWechatApi(data) {
  return request({
    url: '/api/ddpay-user/app/pay-bank/update-wechat',
    method: 'post',
    data
  })
}
// 我的-收款方式-编辑修改微信
export async function updateAlipayApi(data) {
  return request({
    url: '/api/ddpay-user/app/pay-bank/update-alipay',
    method: 'post',
    data
  })
}
// 我的-收款方式-添加银行卡
export async function submitUnionpayApi(data) {
  return request({
    url: '/api/ddpay-user/app/pay-bank/submit-unionpay',
    method: 'post',
    data
  })
}
// 我的-收款方式-添加微信
export async function submitWechatApi(data) {
  return request({
    url: '/api/ddpay-user/app/pay-bank/submit-wechat',
    method: 'post',
    data
  })
}
// 我的-收款方式-添加支付宝
export async function submitAlipayApi(data) {
  return request({
    url: '/api/ddpay-user/app/pay-bank/submit-alipay',
    method: 'post',
    data
  })
}
// 系统参数获取
export async function getSystemParamApi(data) {
  return request({
    url: '/api/ddpay-system/app/param/get-value-by-key',
    method: 'post',
    data
  })
}
