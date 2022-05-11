import { defineStore } from 'pinia'
import {
  notifyListApi,
  myOrderListApi,
  myOrderDetailApi,
  tradeOrderSellListApi,
  myOrderDetailSellApi,
  tradeLimitApi,
  calcProfitAmtApi,
  // buy
  buyOrderPreMatchApi,
  buyOrderMatchDetailApi,
  buyOrderMatchCancelApi,
  buyOrderPreMatchConfirmApi,
  buyOrderMatchRematchApi,
  buyOrderMatchContinueApi,
  buyOrderMatchSnapUpApi,
  buyOrderMatchConfirmPayApi,
  // sell
  sellOrderCancelApi,
  sellOrderPreMatchApi,
  sellOrderConfirmApi,
  sellOrderMatchDetailApi,
  sellOrderConfirmReleaseApi,
  sellOrderAppealApi,
  buyOrderMatchAppealApi,
  //
  riskUploadApi
} from '@/api/trade'
import { Toast } from 'vant'
import { pushWithQuery, replaceWithQuery } from '@/hooks/useQuery'
import { getCenterInfoApi } from '@/api/center'

const tradeGoingState = () => {
  return {
    // 交易页面 交易中
    tradeGoingList: [],
    tradeGoingListCurrent: 1,
    tradeGoingListSize: 20,
    tradeGoingListLoading: false,
    tradeGoingListFinished: false,
    tradeGoingListRefreshing: false
  }
}
const myOrderTradeState = () => {
  return {
    // 我的订单 - 交易订单
    myOrderTradeList: [],
    myOrderTradeListCurrent: 1,
    myOrderTradeListSize: 20,
    myOrderTradeListLoading: false,
    myOrderTradeListFinished: false,
    myOrderTradeListRefreshing: false
  }
}
const myOrderGoingState = () => {
  return {
    // 我的订单 - 进行中
    myOrderGoingList: [],
    myOrderGoingListCurrent: 1,
    myOrderGoingListSize: 20,
    myOrderGoingListLoading: false,
    myOrderGoingListFinished: false,
    myOrderGoingListRefreshing: false
  }
}
const myOrderDoneState = () => {
  return {
    // 我的订单 - 已完成
    myOrderDoneList: [],
    myOrderDoneListCurrent: 1,
    myOrderDoneListSize: 20,
    myOrderDoneListLoading: false,
    myOrderDoneListFinished: false,
    myOrderDoneListRefreshing: false
  }
}
const myOrderCancelState = () => {
  return {
    // 我的订单 - 已取消
    myOrderCancelList: [],
    myOrderCancelListCurrent: 1,
    myOrderCancelListSize: 20,
    myOrderCancelListLoading: false,
    myOrderCancelListFinished: false,
    myOrderCancelListRefreshing: false
  }
}
const myOrderQuestionState = () => {
  return {
    // 我的订单 - 申诉中
    myOrderQuestionList: [],
    myOrderQuestionListCurrent: 1,
    myOrderQuestionListSize: 20,
    myOrderQuestionListLoading: false,
    myOrderQuestionListFinished: false,
    myOrderQuestionListRefreshing: false
  }
}
const myOrderSellState = () => {
  return {
    // 我的订单 - 出售挂单
    myOrderSellList: [],
    myOrderSellListCurrent: 1,
    myOrderSellListSize: 20,
    myOrderSellListLoading: false,
    myOrderSellListFinished: false,
    myOrderSellListRefreshing: false
  }
}
export const useTradeStore = defineStore('trade', {
  state: () => ({
    // 订单提醒
    notifyNumber: 0,
    showNotifyDialog: false,
    notifyList: [],
    // 更换银行卡 弹层
    showTradePaymentList: false,
    /**
     *  公用
     */
    // 用户须知 弹层
    showUserTip: false,
    // 奖励说明
    userTipTitle: '用户须知',
    // 实际获得 弹层
    showActualDialog: false,
    payAccountNumber: '',
    // 选中支付方式
    selectPaywayObj: {},
    tradeLimitList: [],
    // ddb 交易匹配中 页面详情
    matchTimer: {},
    orderMatchLoading: false,
    orderMatchDetail: {
      askMatch: false,
      buyAmt: '',
      buyNo: '',
      createdTime: '',
      matchCountdown: 0,
      price: '',
      profitAmt: '',
      status: 0
    },
    // 交易申诉
    appealOrderLoadingConfirm: false,
    showOrderAppealing: false,
    appealingTime: 10,
    // 风控提交
    riskUploadLoadingConfirm: false,
    riskUploadSubmit: false,
    // 安全中心
    safeCenter: {
      enGoogleCode: '0'
    },
    /**
     *  购买
     */
    profitCalcBuy: {
      profitAmt: '0',
      profitAmtLaw: '0',
      availableAmt: '0',
      availableAmtLaw: '0'
    },
    preBuy: {
      preOrderId: '',
      price: '',
      payAmount: '',
      availableAmt: '',
      cancelOrderCountdown: ''
    },
    // 购买确认 弹层
    showTradeBuy: false,
    buyPreLoadingCancel: false,
    buyPreLoadingConfirm: false,
    // 取消匹配 弹层
    showOrderCancelBuyDialog: false,
    buyOrderCancelLoading: false,
    // 询问是否继续匹配 弹层
    showBuyAskMatchContinue: false,
    checkedContinue: false,
    askMatchCancelLoading: false,
    askMatchConfirmLoading: false,
    // status=20 重新匹配 弹层
    showBuyOrderRematch: false,
    buyRematchLoadingCancel: false,
    buyRematchLoadingConfirm: false,
    // status=20 极速匹配 弹层
    showBuyOrderFast: false,
    buyFastLoadingCancel: false,
    buyFastLoadingConfirm: false,
    // 确认付款 输入密码弹层
    showBuyOrderPwd: false,
    buyOrderPwdLoading: false,
    // 确认付款 输入谷歌验证码
    showBuyOrderGoogleCode: false,
    buyOrderGoogleCodeLoading: false,
    /**
     * 出售 交互
     */
    profitCalcSell: {
      profitAmt: '0',
      profitAmtLaw: '0',
      availableAmt: '0',
      availableAmtLaw: '0'
    },
    // 出售 挂单须知弹层
    showTradeSellNotice: false,
    // 出售确认弹层
    showTradeSell: false,
    showTradeSellLoading: false,
    preSell: {
      availableAmount: '',
      preOrderId: '',
      price: '',
      sellAmt: ''
    },
    // 放币
    showSellOrderConfirmRelease: false,
    sellOrderConfirmReleaseConfirm: false,
    // 订单下架
    showOrderDownDialog: false,
    orderDownDialogLoading: false,

    /**
     * 我的订单 板块
     */
    // 交易中
    ...tradeGoingState(),
    // 我的订单
    ...myOrderTradeState(),
    ...myOrderGoingState(),
    ...myOrderDoneState(),
    ...myOrderCancelState(),
    ...myOrderQuestionState(),
    ...myOrderSellState(),
    // 交易详情
    myOrderDetail: {},
    orderDetailLoading: false
  }),
  actions: {
    resetTradeGoingListState() {
      const obj = tradeGoingState()
      for (const property in obj) {
        this[property] = obj[property]
        // console.log(`${property}: ${obj[property]}`)
      }
    },
    resetOrderTradeListState() {
      const obj = myOrderTradeState()
      for (const property in obj) {
        this[property] = obj[property]
        // console.log(`${property}: ${obj[property]}`)
      }
    },
    resetOrderGoingListState() {
      const obj = myOrderGoingState()
      for (const property in obj) {
        this[property] = obj[property]
        // console.log(`${property}: ${obj[property]}`)
      }
    },
    resetOrderDoneListState() {
      const obj = myOrderDoneState()
      for (const property in obj) {
        this[property] = obj[property]
        // console.log(`${property}: ${obj[property]}`)
      }
    },
    resetOrderCancelListState() {
      const obj = myOrderCancelState()
      for (const property in obj) {
        this[property] = obj[property]
        // console.log(`${property}: ${obj[property]}`)
      }
    },
    resetOrderQuestionListState() {
      const obj = myOrderQuestionState()
      for (const property in obj) {
        this[property] = obj[property]
        // console.log(`${property}: ${obj[property]}`)
      }
    },
    resetOrderSellListState() {
      const obj = myOrderSellState()
      for (const property in obj) {
        this[property] = obj[property]
        // console.log(`${property}: ${obj[property]}`)
      }
    },
    setNotifyNumber(payload) {
      this.notifyNumber = payload
    },
    setNotifyDialog(payload) {
      this.showNotifyDialog = payload
    },
    setOrderDownDialog(payload) {
      this.showOrderDownDialog = payload
    },
    async fetchNotifyList(payload) {
      try {
        const res = await notifyListApi(payload || {})
        if (res.success) {
          this.notifyList = res.data
          this.notifyNumber = this.notifyList.length
        }
        // console.log(res)
      } catch (e) {
        // console.log(e)
      }
    },
    // 交易限额
    async fetchTradeLimit(payload) {
      try {
        const res = await tradeLimitApi(payload || {})
        if (res.success) {
          this.tradeLimitList = res.data
        }
        // console.log(res)
      } catch (e) {
        // console.log(e)
      }
    },
    // 活动奖励-计算
    async fetchCalcProfit(payload) {
      try {
        const res = await calcProfitAmtApi(payload)
        if (res.success) {
          if (payload.tradeRole == 10) {
            this.profitCalcBuy = res.data
          } else {
            this.profitCalcSell = res.data
          }
        }
        // console.log(res)
      } catch (e) {
        // console.log(e)
      }
    },
    // 谷歌验证 取值
    async fetchSafeCenter(payload) {
      try {
        const res = await getCenterInfoApi(payload)
        if (res.success) {
          this.safeCenter = res.data
        }
        // console.log(res)
      } catch (e) {
        // console.log(e)
      }
    },

    /**
     *
     * 购买板块
     */
    // 交易中 匹配中 购买 明细
    async fetchBuyOrderMatchDetail(payload) {
      if (!this.matchTimer) {
        this.orderMatchLoading = true
      }
      try {
        const res = await buyOrderMatchDetailApi(payload)
        if (res.success) {
          const data = res.data
          this.orderMatchDetail = data
          // this.orderMatchDetail.status = 10
          // this.orderMatchDetail.matchCountdown = 0
          // this.orderMatchDetail.matchCountdown = Math.ceil(Math.random() * 120)
          // this.orderMatchDetail.matchCountdown = 120
          // this.showBuyAskMatchContinue = true
          // this.orderMatchDetail = {
          //   askMatch: data.askMatch,
          //   buyAmt: data.buyAmt,
          //   buyNo: data.buyNo,
          //   createdTime: data.createdTime,
          //   matchCountdown: data.matchCountdown,
          //   price: data.price,
          //   profitAmt: data.profitAmt,
          //   status: data.status
          // }
          if (data.status == -100 || data.status == 100) {
            // const param = {
            //   type: 1,
            //   buyNo: payload.buyNo,
            //   tradeRole: 10,
            //   fromUrl: '/trade?tab=0'
            // }
            // pushWithQuery('TradeMyOrderDetail', param)
          } else if (data.status == 10) {
            if (data.askMatch && data.matchCountdown == 0) {
              this.showBuyAskMatchContinue = true
            }
          } else if (data.status == 20) {
            // status=20 弹层出现选择 取消匹配弹层，并调重新匹配接口
            this.showBuyOrderFast = true
          } else if (data.status == 50) {
            this.showOrderAppealing = true
            this.appealingTime = 10
          }
          this.orderMatchLoading = false
        }
        // console.log(res)
      } catch (e) {
        // console.log(e)
      }
    },
    // 预购买
    async fetchBuyOrderPreMatch(payload) {
      // if (this.preBuy !== 2) return
      // this.preBuy = {
      //   availableAmt: '20000.07',
      //   buyAmt: '1',
      //   cancelOrderCountdown: 120,
      //   payAmount: '1',
      //   preOrderId: '95a3b116fbe54fe1b8007db3012440e1',
      //   price: '1',
      //   profitAmt: '19999.07'
      // }
      // this.showTradeBuy = true
      if (this.showTradeBuy === true) return
      let res
      try {
        res = await buyOrderPreMatchApi(payload || {})
        console.log(res)
        if (res.success) {
          this.preBuy = res.data
          this.showTradeBuy = true
        }
        // console.log(res)
      } catch (e) {
        res = e
        // console.log(e)
        if (res.code == '204006') {
          // 多笔匹配中订单
          pushWithQuery('TradeOrderMatching', {
            tradeRole: 10,
            buyNo: res.data.buyNo
          })
        } else if (res.code == '204001') {
          // 多笔进行中订单
          pushWithQuery('TradeOrderMatching', {
            tradeRole: 10,
            buyNo: res.data.buyNo
          })
          // pushWithQuery('Trade', {
          //   tab: 2
          // })
        } else if (res.code == '203005') {
          // 实名认证
          pushWithQuery('Userinfo')
        } else if (res.code == '203004') {
          // 交易密码
          pushWithQuery('DepositPwd', {
            type: 1
          })
        } else if (res.code == '204003') {
          // 触发风控
          const data = res.data
          if (data.code == 201) {
            Toast(data.message)
          } else {
            if (data.riskType == 'provideDetails') {
              // 提供流水
              Toast(data.message)
              pushWithQuery('TradeRisk')
            } else if (data.riskType == 'realNameVerified') {
              // 实名认证
              Toast(data.message)
              pushWithQuery('Userinfo')
            } else if (data.riskType == 'faceVerified') {
              // 活体认证
              Toast('请至滴滴付客户端进行活体认证')
            } else if (data.riskType == 'delayLoan') {
              // 延迟放币
              Toast(data.message)
            } else if (data.riskType == 'pauseSell') {
              // 暂停出售
              Toast(data.message)
            } else if (data.riskType == 'pauseBuy') {
              // 暂停购买
              Toast(data.message)
            }
          }
        } else if (res.code == '204002') {
          // 申诉中
        } else if (res.code == '203003') {
          // 未绑定银行卡
          pushWithQuery('AccountIndex')
        }
      }
      return res
    },
    // 取消 购买匹配
    async fetchBuyOrderCancel(payload) {
      // if (this.orderMatchLoadingConfirm == true) return
      // this.orderMatchLoadingConfirm = true
      this.buyOrderCancelLoading = true
      let res
      try {
        res = await buyOrderMatchCancelApi(payload)
        // console.log(res)
        if (res.success) {
          // this.preBuy = res.data
          // this.showTradeBuy = true
          Toast(res.msg)
          replaceWithQuery('Trade', {
            tab: 0
          })
        }
        // console.log(res)
      } catch (e) {
        res = e
        // console.log(e)
        // if (e.code == '204001' || e.code == '204006') {
        //   pushWithQuery('TradeOrderMatching', {
        //     tradeRole: 10,
        //     buyNo: e.data.buyNo
        //   })
        // }
        Toast(res.msg)
      } finally {
        this.buyOrderCancelLoading = false
        this.showOrderCancelBuyDialog = false
        this.askMatchCancelLoading = false
      }
      return res
    },
    // 确认购买
    async fetchBuyOrderPreMatchConfirm(payload) {
      // if (this.preBuy !== 2) return
      let res
      try {
        res = await buyOrderPreMatchConfirmApi(payload)
        console.log(res)
        if (res.success) {
          // this.preBuy = res.data
          this.showTradeBuy = false
          pushWithQuery('TradeOrderMatching', {
            tradeRole: 10,
            buyNo: res.data.buyNo
          })
        }
        // console.log(res)
      } catch (e) {
        res = e
        // console.log(e)
        if (res.code == '204006') {
          // 多笔匹配中订单
          pushWithQuery('TradeOrderMatching', {
            tradeRole: 10,
            buyNo: res.data.buyNo
          })
        } else if (res.code == '204001') {
          // 多笔进行中订单
          pushWithQuery('Trade', {
            tab: 2
          })
        } else if (res.code == '203005') {
          // 实名认证
          pushWithQuery('Userinfo')
        } else if (res.code == '203004') {
          // 交易密码
          pushWithQuery('DepositPwd')
        } else if (res.code == '204003') {
          // 未绑定银行卡
          pushWithQuery('AccountIndex')
        } else if (res.code == '204002') {
          // 申诉中
        }
      }
      return res
    },
    // 购买 继续匹配
    async fetchBuyOrderMatchContinue(payload) {
      // if (this.orderMatchLoadingConfirm == true) return
      // this.orderMatchLoadingConfirm = true
      let res
      try {
        res = await buyOrderMatchContinueApi(payload)
        if (res.success) {
          Toast(res.msg)
          this.orderMatchDetail.matchCountdown = res.data.matchCountdown
          // this.orderMatchDetail.status = 100
        }
      } catch (e) {
        // console.log(e)
      } finally {
        this.showBuyAskMatchContinue = false
      }
      // this.orderMatchLoadingConfirm = false
      return res
    },
    // 购买 重新匹配
    async fetchBuyOrderRematch(payload) {
      // if (this.showBuyOrderRematch == true) return
      // this.showBuyOrderRematch = true
      let res
      try {
        res = await buyOrderMatchRematchApi(payload)
        // console.log(res)
        if (res.success) {
          Toast(res.msg)
          // this.fetchBuyOrderMatchDetail(payload)
          // this.preBuy = res.data
          // this.showTradeBuy = true
        }
        // console.log(res)
      } catch (e) {
        // console.log(e)
      }
      // this.orderMatchLoadingConfirm = false
      return res
    },
    // 购买 立即抢购
    async fetchBuyOrderMatchSnapUp(payload) {
      // if (this.showBuyOrderRematch == true) return
      // this.showBuyOrderRematch = true
      let res
      try {
        res = await buyOrderMatchSnapUpApi(payload)
        // console.log(res)
        if (res.success) {
          Toast(res.msg)
          // this.fetchBuyOrderMatchDetail(payload)
          // this.preBuy = res.data
          // this.showTradeBuy = true
        }
        // console.log(res)
      } catch (e) {
        // console.log(e)
      }
      // this.orderMatchLoadingConfirm = false
      return res
    },
    // 购买 确认付款
    async fetchBuyOrderMatchConfirmPay(payload) {
      if (this.buyOrderPwdLoading == true) return
      this.buyOrderPwdLoading = true
      let res
      try {
        res = await buyOrderMatchConfirmPayApi(payload)
        // console.log(res)
        if (res.success) {
          Toast(res.msg)
          this.fetchBuyOrderMatchDetail({
            buyNo: payload.buyNo
          })

          this.showBuyOrderPwd = false
          this.showBuyOrderGoogleCode = false
          // this.fetchBuyOrderMatchDetail(payload)
          // this.preBuy = res.data
          // this.showTradeBuy = true
        }
        // console.log(res)
      } catch (e) {
        // console.log(e)
      } finally {
        setTimeout(() => {
          this.buyOrderPwdLoading = false
        }, 1000)
      }
      // this.orderMatchLoadingConfirm = false
      return res
    },
    // 买家 申诉
    async fetchBuyOrderAppeal(payload) {
      if (this.appealOrderLoadingConfirm) return
      this.appealOrderLoadingConfirm = true
      try {
        const res = await buyOrderMatchAppealApi(payload)
        if (res.success) {
          // console.log(res.data)
          pushWithQuery('Trade')
        }
        Toast(res.msg)
        // console.log(res)
      } catch (e) {
        // console.log(e)
      } finally {
        this.appealOrderLoadingConfirm = false
      }
    },

    /**
     * 出售板块
     *
     */
    // 交易中 匹配中 出售 明细
    async fetchSellOrderMatchDetail(payload) {
      if (!this.matchTimer) {
        this.orderMatchLoading = true
      }
      try {
        const res = await sellOrderMatchDetailApi(payload)
        if (res.success) {
          const data = res.data
          this.orderMatchDetail = data
          if (data.status == -100 || data.status == 100) {
            // const param = {
            //   type: 1,
            //   tradeNo: payload.tradeNo,
            //   tradeRole: 20,
            //   fromUrl: '/trade?tab=0'
            // }
            // pushWithQuery('TradeMyOrderDetail', param)
          } else if (data.status == 50) {
            this.showOrderAppealing = true
            this.appealingTime = 10
          }
          this.orderMatchLoading = false
        }
        // console.log(res)
      } catch (e) {
        // console.log(e)
      }
    },
    // 预出售
    async fetchSellOrderPreMatch(payload) {
      let res
      try {
        res = await sellOrderPreMatchApi(payload)
        console.log(res)
        if (res.success) {
          this.preSell = res.data
          this.showTradeSellNotice = false
          this.showTradeSell = true
        }
        // console.log(res)
      } catch (e) {
        res = e
        this.showTradeSellNotice = false
        // console.log(e)
        if (res.code == '204001' || res.code == '204006') {
          // 已存在1笔订单
          pushWithQuery('TradeOrderMatching', {
            tradeRole: 10,
            buyNo: res.data.buyNo
          })
        } else if (res.code == '203005') {
          // 实名认证
          pushWithQuery('Userinfo')
        } else if (res.code == '203004') {
          // 交易密码
          pushWithQuery('DepositPwd')
        } else if (res.code == '203003') {
          // 未绑定银行卡
          pushWithQuery('AccountIndex')
        } else if (res.code == '204002') {
          // 申诉中
        } else if (res.code == '204003') {
          // 触发风控
        }
      }
      return res
    },
    // 确定出售 showTradeSellLoading
    async fetchSellOrderConfirm(payload) {
      if (this.showTradeSellLoading) return
      this.showTradeSellLoading = true
      let res
      try {
        res = await sellOrderConfirmApi({
          tradeRole: 20,
          preOrderId: this.preSell.preOrderId,
          recBankId: this.selectPaywayObj.id,
          splitable: payload.checked
        })
        // console.log(res)
        if (res.success) {
          this.showTradeSell = false
          pushWithQuery('Trade', {
            tab: 2
          })
        }
        // console.log(res)
      } catch (e) {
        res = e
        // console.log(e)
      } finally {
        this.showTradeSellLoading = false
      }
      return res
    },
    // 确认放币
    async fetchSellOrderConfirmRelease(payload) {
      // if (!payload.checked) {
      //   Toast('请勾选"我已知晓并同意"')
      //   return
      // }
      if (this.buyOrderPwdLoading) return
      this.buyOrderPwdLoading = true
      try {
        const res = await sellOrderConfirmReleaseApi(payload)
        if (res.success) {
          // console.log(res.data)
          this.showBuyOrderPwd = false
          this.showBuyOrderGoogleCode = false
          this.showSellOrderConfirmRelease = false
          const param = {
            type: 1,
            tradeNo: payload.tradeNo,
            tradeRole: 20,
            fromUrl: '/trade?tab=0'
          }
          pushWithQuery('TradeMyOrderDetail', param)
        }
        Toast(res.msg)
        // console.log(res)
      } catch (e) {
        // console.log(e)
      } finally {
        setTimeout(() => {
          this.buyOrderPwdLoading = false
        }, 1000)
      }
    },
    // 订单下架
    async fetchCancelMatchOrder(payload) {
      if (!payload.checked) {
        Toast('请勾选"我已知晓并同意"')
        return
      }
      if (this.orderDownDialogLoading) return
      this.orderDownDialogLoading = true
      try {
        const res = await sellOrderCancelApi(payload)
        if (res.success) {
          // console.log(res.data)
          this.showOrderDownDialog = false
          this.fetchMyOrderDetail({
            sellNo: payload.payload
          })
        }
        Toast(res.msg)
        // console.log(res)
      } catch (e) {
        // console.log(e)
      } finally {
        setTimeout(() => {
          this.orderDownDialogLoading = false
        }, 1000)
      }
    },
    // 卖家 申诉
    async fetchSellOrderAppeal(payload) {
      if (this.appealOrderLoadingConfirm) return
      this.appealOrderLoadingConfirm = true
      try {
        const res = await sellOrderAppealApi(payload)
        if (res.success) {
          // console.log(res.data)
          pushWithQuery('Trade')
        }
        Toast(res.msg)
        // console.log(res)
      } catch (e) {
        // console.log(e)
      } finally {
        this.appealOrderLoadingConfirm = false
      }
    },

    /**
     * 风控板块
     *
     */
    // 风控 提交
    async fetchRiskUpload(payload) {
      if (this.riskUploadLoadingConfirm) return
      this.riskUploadLoadingConfirm = true
      try {
        const res = await riskUploadApi(payload)
        if (res.success) {
          // console.log(res.data)
          pushWithQuery('Trade')
        }
        Toast(res.msg)
        // console.log(res)
      } catch (e) {
        // console.log(e)
      } finally {
        this.riskUploadLoadingConfirm = false
      }
    },

    /**
     * 我的订单板块
     *
     */
    // 交易页面 交易中 列表
    async fetchTradeGoingList(payload) {
      this.tradeGoingListLoading = true
      const params = {
        category: 1,
        current: this.tradeGoingListCurrent,
        size: this.tradeGoingListSize
      }
      try {
        const res = await myOrderListApi(params)
        if (res.success) {
          if (params.current == 1) {
            this.tradeGoingList = []
          }
          this.tradeGoingListCurrent += 1
          const records = res.data.records
          this.tradeGoingList = this.tradeGoingList.concat(records)
          this.tradeGoingListLoading = false
          if (records.length < params.size) {
            this.tradeGoingListFinished = true
          }
        }
        // console.log(res)
      } catch (e) {
        // console.log(e)
      } finally {
        this.tradeGoingListRefreshing = false
      }
    },
    // 我的订单-交易订单
    async fetchOrderTradeList(payload) {
      this.myOrderTradeListLoading = true
      const params = {
        category: 0,
        current: this.myOrderTradeListCurrent,
        size: this.myOrderTradeListSize
      }
      try {
        const res = await myOrderListApi(params)
        if (res.success) {
          if (params.current == 1) {
            this.myOrderTradeList = []
          }
          this.myOrderTradeListCurrent += 1
          const records = res.data.records
          this.myOrderTradeList = this.myOrderTradeList.concat(records)
          this.myOrderTradeListLoading = false
          if (records.length < params.size) {
            this.myOrderTradeListFinished = true
          }
        }
        // console.log(res)
      } catch (e) {
        // console.log(e)
      } finally {
        this.myOrderTradeListRefreshing = false
      }
    },
    // 我的订单-进行中
    async fetchOrderGoingList(payload) {
      this.myOrderGoingListLoading = true
      const params = {
        category: 1,
        current: this.myOrderGoingListCurrent,
        size: this.myOrderGoingListSize
      }
      try {
        const res = await myOrderListApi(params)
        if (res.success) {
          if (params.current == 1) {
            this.myOrderGoingList = []
          }
          this.myOrderGoingListCurrent += 1
          const records = res.data.records
          this.myOrderGoingList = this.myOrderGoingList.concat(records)
          this.myOrderGoingListLoading = false
          if (records.length < params.size) {
            this.myOrderGoingListFinished = true
          }
        }
        // console.log(res)
      } catch (e) {
        // console.log(e)
      } finally {
        this.myOrderGoingListRefreshing = false
      }
    },
    // 我的订单-已完成
    async fetchOrderDoneList(payload) {
      this.myOrderDoneListLoading = true
      const params = {
        category: 2,
        current: this.myOrderDoneListCurrent,
        size: this.myOrderDoneListSize
      }
      try {
        const res = await myOrderListApi(params)
        if (res.success) {
          if (params.current == 1) {
            this.myOrderDoneList = []
          }
          this.myOrderDoneListCurrent += 1
          const records = res.data.records
          this.myOrderDoneList = this.myOrderDoneList.concat(records)
          this.myOrderDoneListLoading = false
          if (records.length < params.size) {
            this.myOrderDoneListFinished = true
          }
        }
        // console.log(res)
      } catch (e) {
        // console.log(e)
      } finally {
        this.myOrderDoneListRefreshing = false
      }
    },
    // 我的订单-已取消
    async fetchOrderCancelList(payload) {
      this.myOrderCancelListLoading = true
      const params = {
        category: 3,
        current: this.myOrderCancelListCurrent,
        size: this.myOrderCancelListSize
      }
      try {
        const res = await myOrderListApi(params)
        if (res.success) {
          if (params.current == 1) {
            this.myOrderCancelList = []
          }
          this.myOrderCancelListCurrent += 1
          const records = res.data.records
          this.myOrderCancelList = this.myOrderCancelList.concat(records)
          this.myOrderCancelListLoading = false
          if (records.length < params.size) {
            this.myOrderCancelListFinished = true
          }
        }
        // console.log(res)
      } catch (e) {
        // console.log(e)
      } finally {
        this.myOrderCancelListRefreshing = false
      }
    },
    // 我的订单-申诉中
    async fetchOrderQuestionList(payload) {
      this.myOrderQuestionListLoading = true
      const params = {
        category: 4,
        current: this.myOrderQuestionListCurrent,
        size: this.myOrderQuestionListSize
      }
      try {
        const res = await myOrderListApi(params)
        if (res.success) {
          if (params.current == 1) {
            this.myOrderQuestionList = []
          }
          this.myOrderQuestionListCurrent += 1
          const records = res.data.records
          this.myOrderQuestionList = this.myOrderQuestionList.concat(records)
          this.myOrderQuestionListLoading = false
          if (records.length < params.size) {
            this.myOrderQuestionListFinished = true
          }
        }
        // console.log(res)
      } catch (e) {
        // console.log(e)
      } finally {
        this.myOrderQuestionListRefreshing = false
      }
    },
    // 我的订单-交易订单详情
    async fetchMyOrderDetail(payload) {
      this.orderDetailLoading = true
      try {
        const res = await myOrderDetailApi(payload)
        if (res.success) {
          console.log(res.data)
          this.myOrderDetail = res.data
          this.orderDetailLoading = false
        }
        // console.log(res)
      } catch (e) {
        // console.log(e)
      }
    },
    // 我的订单-出售挂单
    async fetchOrderSellList(payload) {
      this.myOrderSellListLoading = true
      const params = {
        // category: 1,
        current: this.myOrderSellListCurrent,
        size: this.myOrderSellListSize
      }
      try {
        const res = await tradeOrderSellListApi(params)
        if (res.success) {
          if (params.current == 1) {
            this.myOrderSellList = []
          }
          this.myOrderSellListCurrent += 1
          const records = res.data.records
          this.myOrderSellList = this.myOrderSellList.concat(records)
          this.myOrderSellListLoading = false
          if (records.length < params.size) {
            this.myOrderSellListFinished = true
          }
        }
        // console.log(res)
      } catch (e) {
        // console.log(e)
      } finally {
        this.myOrderSellListRefreshing = false
      }
    },
    // 我的订单-出售挂单明细
    async fetchMyOrderDetailSell(payload) {
      this.orderDetailLoading = true
      try {
        const res = await myOrderDetailSellApi(payload)
        if (res.success) {
          console.log(res.data)
          this.myOrderDetail = res.data
          this.orderDetailLoading = false
        }
        // console.log(res)
      } catch (e) {
        // console.log(e)
      }
    }
  }
})
