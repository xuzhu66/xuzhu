import { defineStore } from 'pinia'
import {
  bindGoogleEmailApi,
  bindGoogleMobileApi,
  captchaBindEmailApi,
  captchaBindTelApi,
  dictionariesApi,
  fishCodeApi,
  getBankDetailApi,
  getBankListApi,
  getCenterInfoApi,
  getDictionaryApi,
  getGoogleKeyApi,
  getInviteListApi,
  getMsgNotReadCountApi,
  getMsgPageApi,
  getPayListApi,
  getShareApi,
  getShoukuanListApi,
  getSystemParamApi,
  getTerminalInfoApi,
  getUserInfoApi,
  idApproveApi,
  loginAuthLogApi,
  loginLogApi,
  notIdApproveApi,
  queryIdApproveApi,
  removeTerminalApi,
  resetPwdApi,
  resetPwdEmailApi,
  resetPwdMobileApi,
  resetTradePwdApi,
  resetTradePwdEmailApi,
  resetTradePwdMobileApi,
  setEmailApi,
  setEmailInfoApi,
  setGoogleCodeApi,
  setMsgInfoApi,
  setMsgStatusApi,
  setTelephoneApi,
  setTradePwdApi,
  submitAlipayApi,
  submitUnionpayApi,
  submitWechatApi,
  undoneIdApproveApi,
  updateAlipayApi,
  updateUnionpayApi,
  updateWechatApi,
  uploadApi
} from '@/api/center'
// 对外部暴露一个 use 方法，该方法会导出我们定义的 state
export const useCenterStore = defineStore('center', {
  // 每个store的id必须唯一
  id: 'center',
  // state表示数据源
  state: () => ({
    currtMsg: '', // 当前消息
    userInfo: '', // 用户信息
    systemMsgList: '', // 系统消息
    dictionary: {}, // 数据字典
    temp: '', // 临时字段
    msgNotReadNum: 0, // 未读消息数量
    // 安全中心
    centerInfo: {
      enTradePwd: false, // 交易密码
      tel: '', //
      email: '', //
      enGoogleCode: false, //
      enFishCode: false, //
      enMsgInfo: false, //
      enMailInfo: false, //
      enHandPwd: false //
    },
    googleObj: '', // 谷歌对象
    userPic: {
      realName: '',
      idNo: ''
    },
    currtTempObj: '', // 临时对象 银行卡 微信 支付宝
    systemParam: {}, // 系统参数
    serviceUrl: '' // 客服链接
  }),
  // getters类似于computed,可对state的值进行二次计算
  getters: {
    //
  },
  // actions用来修改state
  actions: {
    // 我的个人信息
    async getUserInfoAction(param) {
      const { data: data, success: success } = await getUserInfoApi(param)
      if (success) {
        this.userInfo = data
      }
      return data
    },
    // 我的个人信息
    async getMsgPageAction(param) {
      const { data: data, success: success } = await getMsgPageApi(param)
      if (success) {
        // this.systemMsgList = data
      }
      return data
    },

    // 查询系统消息未读数量
    async getMsgNotReadCountAction(param) {
      const { data: data, success: success } = await getMsgNotReadCountApi(
        param
      )
      if (success) {
        this.msgNotReadNum = data
      }
      return data
    },
    // 查询系统消息- 设置已读
    async setMsgStatusAction(param) {
      const { data: data, success: success } = await setMsgStatusApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 我的推广列表
    async getInviteListAction(param) {
      const { data: data, success: success } = await getInviteListApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 分享配置
    async getShareAction(param) {
      const { data: data, success: success } = await getShareApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 安全配置
    async getCenterInfoAction(param) {
      const { data: data, success: success } = await getCenterInfoApi(param)
      if (success) {
        data.enFishCode = data.enFishCode === '1'
        data.enGoogleCode = data.enGoogleCode === '1'
        data.enHandPwd = data.enHandPwd === '1'
        data.enMailInfo = data.enMailInfo === '1'
        data.enMsgInfo = data.enMsgInfo === '1'
        data.enTradePwd = data.enTradePwd === '1'
        this.centerInfo = data
      }
      return data
    },
    // 重置密码-短信验证
    async resetPwdMobileAction(param) {
      const { data: data, success: success } = await resetPwdMobileApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 重置密码-邮箱验证码
    async resetPwdEmailAction(param) {
      const { data: data, success: success } = await resetPwdEmailApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 重置密码-提交
    async resetPwdAction(param) {
      const { data: data, success: success } = await resetPwdApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 重置交易密码-手机验证码
    async resetTradePwdMobileAction(param) {
      const { data: data, success: success } = await resetTradePwdMobileApi(
        param
      )
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 重置交易密码-邮箱验证码
    async resetTradePwdEmailAction(param) {
      const { data: data, success: success } = await resetTradePwdEmailApi(
        param
      )
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 重置交易密码
    async resetTradePwdAction(param) {
      const { data: data, success: success } = await resetTradePwdApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 设置交易密码
    async setTradePwdAction(param) {
      const { data: data, success: success } = await setTradePwdApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 发送验证码-绑定手机
    async captchaBindTelAction(param) {
      const { data: data, success: success } = await captchaBindTelApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 绑定手机
    async setTelephoneAction(param) {
      const { data: data, success: success } = await setTelephoneApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 发送验证码-绑定邮箱
    async captchaBindEmailAction(param) {
      const { data: data, success: success } = await captchaBindEmailApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 绑定邮箱
    async setEmailAction(param) {
      const { data: data, success: success } = await setEmailApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 绑定谷歌验证码
    async setGoogleCodeAction(param) {
      const { data: data, success: success } = await setGoogleCodeApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 绑定谷歌验证码-获取32位秘钥
    async getGoogleKeyAction(param) {
      const { data: data, success: success } = await getGoogleKeyApi(param)
      if (success) {
        this.googleObj = data
      }
      return data
    },
    // 绑定谷歌验证码-手机验证
    async bindGoogleMobileAction(param) {
      const { data: data, success: success } = await bindGoogleMobileApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 绑定谷歌验证码-邮箱验证
    async bindGoogleEmailAction(param) {
      const { data: data, success: success } = await bindGoogleEmailApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 活动-登录
    async loginLogAction(param) {
      const { data: data, success: success } = await loginLogApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 活动-安全
    async loginAuthLogAction(param) {
      const { data: data, success: success } = await loginAuthLogApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 设备列表
    async getTerminalInfoAction(param) {
      const { data: data, success: success } = await getTerminalInfoApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 删除设备
    async removeTerminalAction(param) {
      const { data: data, success: success } = await removeTerminalApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 设置防钓鱼码
    async fishCodeAction(param) {
      const { data: data, success: success } = await fishCodeApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 短信通知
    async setMsgInfoAction(param) {
      const { data: data, success: success } = await setMsgInfoApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 邮件通知
    async setEmailInfoAction(param) {
      const { data: data, success: success } = await setEmailInfoApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 查询字典
    async getDictionaryAction(param) {
      const { data: data, success: success } = await getDictionaryApi({
        code: param
      })
      if (success) {
        // 升序排序
        data.sort(function (a, b) {
          return a.sort - b.sort
        })
        this.dictionary[param] = data
      }
      return data
    },
    // 公共字典(数组)
    async dictionariesAction(param) {
      const { data: data, success: success } = await dictionariesApi(param)
      if (success) {
        data.forEach((item) => {
          item.dict.sort(function (a, b) {
            return a.sort - b.sort
          })
          this.dictionary[item.code] = item.dict
        })
      }
      return data
    },
    // 查询身份认证状态
    async queryIdApproveAction(param) {
      const { data: data, success: success } = await queryIdApproveApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 未身份认证
    async notIdApproveAction(param) {
      const { data: data, success: success } = await notIdApproveApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 未完成身份认证
    async undoneIdApproveAction(param) {
      const { data: data, success: success } = await undoneIdApproveApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 已身份认证
    async idApproveAction(param) {
      const { data: data, success: success } = await idApproveApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 图片上传
    async uploadAction(param) {
      const { data: data, success: success } = await uploadApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 银行列表
    async getBankListAction(param) {
      const { data: data, success: success } = await getBankListApi(param)
      if (success) {
        this.temp = data
      }
      return data
    },
    // 银行营业信息查询
    async getBankDetailAction(param) {
      const { data: data, success: success } = await getBankDetailApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 支付方式查询
    async getPayListAction(param) {
      const { data: data, success: success } = await getPayListApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 我的-收款方式-查询
    async getShoukuanListAction(param) {
      const { data: data, success: success } = await getShoukuanListApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 我的-收款方式-编辑修改银行卡
    async updateUnionpayAction(param) {
      const { data: data, success: success } = await updateUnionpayApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 我的-收款方式-编辑修改微信
    async updateWechatAction(param) {
      const { data: data, success: success } = await updateWechatApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 我的-收款方式-编辑修改微信
    async updateAlipayAction(param) {
      const { data: data, success: success } = await updateAlipayApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 我的-收款方式-添加银行卡
    async submitUnionpayAction(param) {
      const { data: data, success: success } = await submitUnionpayApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 我的-收款方式-添加微信
    async submitWechatAction(param) {
      const { data: data, success: success } = await submitWechatApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 我的-收款方式-添加支付宝
    async submitAlipayAction(param) {
      const { data: data, success: success } = await submitAlipayApi(param)
      if (success) {
        // this.temp = data
      }
      return data
    },
    // 系统参数获取
    async getSystemParamAction(key) {
      const { data: data, success: success } = await getSystemParamApi({
        paramKey: key
      })
      if (success) {
        this.systemParam[key] = data.paramValue
        if (key === 'csc.channel.access.link') {
          this.serviceUrl = data.paramValue
        }
      }
      return data
    }
  }
})
