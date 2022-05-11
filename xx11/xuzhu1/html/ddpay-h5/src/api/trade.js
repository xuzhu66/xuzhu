import request from '@/utils/request'

// 有提醒订单
export async function notifyListApi(data) {
  return request({
    url: '/api/ddpay-message/app/message/getTradeMsgPage',
    // url: '/mock/611606d16578bd0952184097/hh/test',
    method: 'post',
    data
  })
}
// 交易限额
export async function tradeLimitApi(data) {
  return request({
    url: '/api/ddpay-trade/app/trade/trade-limit',
    method: 'post',
    data
  })
}
// 活动奖励-计算
export async function calcProfitAmtApi(data) {
  return request({
    url: '/api/ddpay-trade/app/trade/calc-profit-amt',
    method: 'post',
    data
  })
}

/*
* 买家
 */
// 买家 预购买
export async function buyOrderPreMatchApi(data) {
  return request({
    url: '/api/ddpay-trade/app/trade/buy/pre-order',
    method: 'post',
    data
  })
}
// 买家 确认购买
export async function buyOrderPreMatchConfirmApi(data) {
  return request({
    url: '/api/ddpay-trade/app/trade/buy/confirm-order',
    method: 'post',
    data
  })
}
// 买家 匹配中 详情
export async function buyOrderMatchDetailApi(data) {
  return request({
    url: '/api/ddpay-trade/app/trade/buy/match-order',
    method: 'post',
    data
  })
}
// 买家 继续匹配
export async function buyOrderMatchContinueApi(data) {
  return request({
    url: '/api/ddpay-trade/app/trade/buy/continue-match-order',
    method: 'post',
    data
  })
}
// 买家 重新匹配
export async function buyOrderMatchRematchApi(data) {
  return request({
    url: '/api/ddpay-trade/app/trade/buy/rematch-order',
    method: 'post',
    data
  })
}
// 买家 取消匹配
export async function buyOrderMatchCancelApi(data) {
  return request({
    url: '/api/ddpay-trade/app/trade/buy/cancel-match-order',
    method: 'post',
    data
  })
}
// 买家 立即抢购
export async function buyOrderMatchSnapUpApi(data) {
  return request({
    url: '/api/ddpay-trade/app/trade/buy/confirm-match-order',
    method: 'post',
    data
  })
}
// 买家 确认付款
export async function buyOrderMatchConfirmPayApi(data) {
  return request({
    url: '/api/ddpay-trade/app/trade/buy/confirm-pay',
    method: 'post',
    data
  })
}
// 买家 交易申诉
export async function buyOrderMatchAppealApi(data) {
  return request({
    url: '/api/ddpay-trade/app/trade/buy/appeal',
    method: 'post',
    data
  })
}

/*
* 卖家
*
 */
// 卖家 预出售
export async function sellOrderPreMatchApi(data) {
  return request({
    url: '/api/ddpay-trade/app/trade/sell/pre-order',
    method: 'post',
    data
  })
}
// 卖家 确定出售
export async function sellOrderConfirmApi(data) {
  return request({
    url: '/api/ddpay-trade/app/trade/sell/confirm-order',
    method: 'post',
    data
  })
}
// 卖家 出售订单匹配
export async function sellOrderMatchDetailApi(data) {
  return request({
    url: '/api/ddpay-trade/app/trade/sell/match-order',
    method: 'post',
    data
  })
}
// 卖家 出售订单 申诉
export async function sellOrderAppealApi(data) {
  return request({
    url: '/api/ddpay-trade/app/trade/sell/appeal',
    method: 'post',
    data
  })
}
// 订单下架
export async function sellOrderCancelApi(data) {
  return request({
    url: '/api/ddpay-trade/app/trade/sell/cancel-match-order',
    method: 'post',
    data
  })
}
// 确认放币
export async function sellOrderConfirmReleaseApi(data) {
  return request({
    url: '/api/ddpay-trade/app/trade/sell/confirm-release',
    method: 'post',
    data
  })
}

/**
 * 我的订单
 */
// 我的订单-交易订单
export async function myOrderListApi(data) {
  return request({
    url: '/api/ddpay-trade/app/order/my-order',
    method: 'post',
    data
  })
}

// 我的订单-交易订单 订单详情
export async function myOrderDetailApi(data) {
  return request({
    // url: '/mock/61f0256141b6e6074b307741/h5/ddpay-auth/app/oauth/token',
    url: '/api/ddpay-trade/app/order/my-order-detail',
    method: 'post',
    data
  })
}

// 我的订单 出售挂单 列表
export async function tradeOrderSellListApi(data) {
  return request({
    url: '/api/ddpay-trade/app/order/my-sell-order',
    method: 'post',
    data
  })
}
// 我的订单 出售挂单 订单详情
export async function myOrderDetailSellApi(data) {
  return request({
    // url: '/mock/61f0256141b6e6074b307741/h5/ddpay-auth/app/oauth/token',
    url: '/api/ddpay-trade/app/order/sell-order-detail',
    method: 'post',
    data
  })
}
// 我的订单 出售挂单 订单详情
export async function riskUploadApi(data) {
  return request({
    // url: '/mock/61f0256141b6e6074b307741/h5/ddpay-auth/app/oauth/token',
    url: '/api/ddpay-risk/app/risk-event-voucher/upload',
    method: 'post',
    data
  })
}
