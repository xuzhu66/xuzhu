
/**
 * @description 判断是否是数组
 * @param arg
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * @description 判断是否为数字且最多两位小数
 * @param value
 * @returns {boolean}
 */
export function isNum(value) {
  const reg = /^\d+(\.\d{1,2})?$/
  return reg.test(value)
}

/**
 * @description 判断是否为json
 * @param value
 * @returns {boolean}
 */
export function isJson(value) {
  if (typeof value === 'string') {
    const obj = JSON.parse(value)
    return !!(typeof obj === 'object' && obj)
  }
  return false
}

/**
 * @description 判断是否是字符串
 * @param value
 * @returns {boolean}
 */
export function isString(value) {
  return typeof value === 'string' || value instanceof String
}

export function isJSON(str) {
  try {
    const obj = JSON.parse(str)
    if (obj && typeof obj === 'object' && obj !== null) {
      return true
    }
  } catch (err) {
    return false
  }
  return false
}

// 验证用户账号 以小写字母开头，4-15位字母与数字组成的用户账号
export function testAccount(str) {
  const reg = /^[a-zA-Z][0-9,a-zA-Z]{3,14}$/
  return reg.test(str)
}

// 会员登录密码验证--支持5-12位字符，可以是纯数字，也可以是英文，区分大小写
export function validateLoginPwd(str) {
  const reg = /^[a-zA-Z0-9]{5,12}$/
  return reg.test(str)
}

// 验证一般用户名
export function validateCommonUserName(str) {
  // 中英文、数字、字母 2-20位
  const reg = /^[\u4E00-\u9FA5_A-Za-z0-9]{2,20}$/
  return reg.test(str)
}

// 验证数IP地址
export function validIpNumber(str) {
  const reg = /[\d|.]{1,15}/
  return reg.test(str)
}

// 验证邮箱
export function validEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

// 中文，英文字母，数字字符串
export function cnEnNum(str) {
  const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
  return reg.test(str)
}

// 中文
export function cnWord(str) {
  const reg = /^[\u4E00-\u9FA5]+$/
  return reg.test(str)
}

// 英文 数字 符号
export function enNumCharacter(string) {
  const regex = /^[0-9A-Za-z!@#$%&*()_\-+={[}\]|\:;"'<,>.?\/\\~`]/g
  return regex.test(string)
}

// 中文 符号
export function cnCharacter(string) {
  const regex = /^[\u4e00-\u9fa5!@#$%&*()·_\-+={[}\]|\:;"'<,>.?\/\\~`]/g
  return regex.test(string)
}

// IP地址校验
export function validIP(str) {
  const reg =
    /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/
  return reg.test(str)
}

// 密码验证 4-8位
export function validatePwd(str) {
  const reg = /^[a-zA-Z0-9]{4,8}$/
  return reg.test(str)
}

// 4位数字的取款密码
export function withdrawalPassword(str) {
  const reg = /^[0-9]{4}$/
  return reg.test(str)
}

// 验证不超过20位字符 中文/字母/数字组成
export function oneTotWenty(str) {
  const reg = /^[\u4E00-\u9FA5_A-Za-z0-9]{1,20}$/
  return reg.test(str)
}

// 银行卡号验证16-19位字符、只支持数字
export function isBankCard(str) {
  const reg = /^[0-9]{16,19}$/
  return reg.test(str)
}

// 验证银行名称
export function validateBankName(str) {
  // 中英文、数字、字母 2-50位
  const reg = /^[\u4E00-\u9FA5_A-Za-z0-9]{2,50}$/
  return reg.test(str)
}

// 验证2-15位中文字符--中文字符
export function cnCharTest(str) {
  const reg = /^[\u4E00-\u9FA5]{2,15}$/
  return reg.test(str)
}

export function checkCardID(str) {
  // 判断是否是身份证
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(str)
}

// 验证码6位
export function validateTelCode(str) {
  const reg = /^[a-zA-Z0-9]{6}$/
  return reg.test(str)
}
// 交易密码
export function validateDepositPwd(str) {
  const reg = /^[a-zA-Z0-9]{5,12}$/
  return reg.test(str)
}

// 手机号
export function validateTelephone(str) {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(str)
}

// 身份证号码后四位
export function validateIDLast(str) {
  const reg = /^[a-zA-Z0-9]{4}$/
  return reg.test(str)
}

export function checkNumber(num) {
  // 判断是否是数字
  // var reg = new RegExp('^-?\\d*\\.?\\d*$');
  var reg = new RegExp('^[-]?[0-9]+(\\.[0-9]+)?$')
  var regPlus = new RegExp('^[+]?[0-9]+(\\.[0-9]+)?$')
  if (regPlus.test(num) || reg.test(num)) {
    return true
  } else {
    return false
  }
}

export async function cmpNumber(v1, v2) {
  if (!checkNumber(v1) || !checkNumber(v1)) return
  const big = () => import('big.js')
  const Big = await big()
  // console.log(v1)
  // console.log(v2)
  const x = new Big(v1)
  const y = new Big(v2)
  // v1 大于 v2 返回 1
  // v1 等于 v2 返回 0
  // v1 小于 v2 返回 -1
  return x.cmp(y)
}
