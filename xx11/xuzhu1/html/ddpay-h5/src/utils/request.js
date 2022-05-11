import { useUserStore } from '@/store/modules/user'
import axios from 'axios'
import {
  baseURL,
  contentType,
  messageName,
  requestTimeout,
  statusName,
  successCode
} from '@/config'
// import qs from 'qs'
import router from '@/router'
import { Toast } from 'vant'

import { isArray, isJSON } from '@/utils/validate'
import { refreshToken } from '@/api/user'

// import { cryptoObjRSA, randomString, cryptoObjAES } from '@/utils/crypto'
const cryptoFun = () => import('@/utils/crypto')
const useStorage = () => import('@/hooks/useStorage')
// let hashStr

let loadingInstance

let refreshToking = false

let requests = []

// 操作正常Code数组
const codeVerificationArray = isArray(successCode)
  ? [...successCode]
  : [...[successCode]]

//  先暂时默认配置 后期课改
const CODE_MESSAGE = {
  200: '服务器成功返回请求数据',
  201: '新建或修改数据成功',
  204: '删除数据成功',
  400: '发出信息有误',
  401: '用户没有权限(令牌失效、用户名、密码错误、登录过期)',
  402: '令牌过期',
  403: '用户得到授权，但是访问是被禁止的',
  404: '访问资源不存在',
  406: '请求格式不可得',
  500: '服务器发生错误',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时'
}

// axios请求拦截器配置 @param config @returns {any}
const requestConf = async (config) => {
  const userStore = useUserStore()
  const { token } = userStore
  config.headers['Authorization'] = `Basic aDU6aDVfc2VjcmV0`
  const encrypt = (await useStorage()).useStorageModule('encrypt', true)
  if (
    process.env['VUE_APP_MODE_NAME'] !== 'dev' &&
    process.env['VUE_APP_MODE_NAME'] !== 'test'
  ) {
    encrypt.value = true
  }
  const hashStr = (await cryptoFun()).randomString()
  // hashStr = '9fxMZeNq7xnnBas0ztvKATHzktDTGrbW'
  if (encrypt.value) {
    const key = (await cryptoFun()).cryptoObjRSA(hashStr)
    config.headers['GlobalSecretKey'] = key
    config.hashStr = hashStr
  }
  if (token) config.headers['DDPay-Auth'] = `bearer ${token}`
  // console.log(config)
  if (config.params) {
    config.headers['Content-Type'] ===
      'application/x-www-form-urlencoded;charset=utf-8'
    if (encrypt.value) {
      const param = {
        secretBody: config.params
      }
      config.data = (await cryptoFun()).cryptoObjAES.encrypt(JSON.stringify(param), hashStr)
      config.params = {}
    }
  } else if (config.isUploadFile) {
    config.headers['Content-Type'] = 'multipart/form-data;charset=utf-8'
    config.headers['kevin-test'] = 'kevin test'
  } else {
    config.headers['Content-Type'] = 'application/json;charset=utf-8'
    if (encrypt.value) {
      if (config.data) {
        config.data = (await cryptoFun()).cryptoObjAES.encrypt(JSON.stringify(config.data), hashStr)
      } else {
        const obj = {}
        config.data = (await cryptoFun()).cryptoObjAES.encrypt(JSON.stringify(obj), hashStr)
      }
    }
  }

  // console.log(config)
  return config
}

// 刷新刷新令牌 config 过期请求配置 {any} 返回结果
const tryRefreshToken = async (config) => {
  if (!refreshToking) {
    refreshToking = true
    try {
      const {
        data: { token }
      } = await refreshToken()
      if (token) {
        const { setToken } = useUserStore()
        setToken(token)
        // 已经刷新了token，将所有队列中的请求进行重试
        requests.forEach((cb) => cb(token))
        requests = []
        return instance(requestConf(config))
      }
    } catch (error) {
      console.error('refreshToken error =>', error)
      router.push({ path: '/login', replace: true }).then(() => {})
    } finally {
      refreshToking = false
    }
  } else {
    return new Promise((resolve) => {
      // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
      requests.push(() => {
        resolve(instance(requestConf(config)))
      })
    })
  }
}

// axios响应拦截器 config 请求配置 data response数据 status HTTP status statusText HTTP status text
const handleData = async ({ config, data, status, statusText }) => {
  // console.log('res', config.hashStr)
  if (config.hashStr) {
    if (typeof data === 'string') {
      data = (await cryptoFun()).cryptoObjAES.decrypt(data, config.hashStr)
      if (isJSON(data)) {
        data = JSON.parse(data)
      }
    }
  }
  // console.log(config.url, config.dataStr, data)
  const { resetAll } = useUserStore()
  if (loadingInstance) loadingInstance.close()
  // 若data.code存在，覆盖默认code
  let code = data && data[statusName] ? data[statusName] : status
  // 若code属于操作正常code，则status修改为200
  if (codeVerificationArray.indexOf(data[statusName]) + 1) code = 200
  switch (code) {
    case 200:
      return data
    case 401:
      resetAll().then(() => {
        router.push({ path: '/login', replace: true }).then(() => {})
      })
      break
    case 402:
      return await tryRefreshToken(config)
    case 403:
      router.push({ path: '/403' }).then(() => {})
      break
  }
  // 若data.msg存在 覆盖默认提醒消息
  console.log(data[messageName])
  let errMsg = ''
  if (data && data[messageName]) {
    errMsg = data[messageName]
  } else {
    errMsg = CODE_MESSAGE[code] ? CODE_MESSAGE[code] : statusText
  }
  Toast.fail({ message: errMsg, position: 'top' })
  return Promise.reject(data)
}

// axios初始化
const instance = axios.create({
  baseURL,
  timeout: requestTimeout,
  headers: {
    'Content-Type': contentType
  }
})

// axios请求拦截器
instance.interceptors.request.use(requestConf, (error) => {
  return Promise.reject(error)
})

// axios响应拦截器
instance.interceptors.response.use(
  (response) => handleData(response),
  (error) => {
    const { response } = error
    if (response === undefined) {
      if (loadingInstance) loadingInstance.close()
      // Toast.fail(
      //   '连接接口失败，可能由以下原因造成：后端不支持跨域CORS、接口地址不存在、请求超时等，请联系管理员排查后端接口问题'
      // )
      Toast.fail('网络错误')
      return error
    } else return handleData(response)
  }
)

export default async function(param) {
  return instance(param)
}
