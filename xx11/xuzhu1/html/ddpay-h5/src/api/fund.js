import request from '@/utils/request'

// usdt 地址查询
export async function usdtAddrApi(data) {
  return request({
    url: `/api/ddpay-trade/app/acct/addr/${data.chain}/${data.coinCode}`,
    method: 'get'
  })
}
// usdt 报价
export async function usdtPriceApi(data) {
  return request({
    url: `/api/ddpay-trade/app/acct/getUSDTPrice`,
    method: 'post'
  })
}
// usdt 手续费
export async function usdtFeeApi(data) {
  return request({
    url: `/api/ddpay-trade/app/acct/getUSDTFee`,
    method: 'post'
  })
}

// 资金明细-USDT
export async function usdtDetailsListApi(data) {
  return request({
    url: '/api/ddpay-trade/app/acct/usdtDetails',
    method: 'post',
    data
  })
}

// 资金明细-DDB
export async function ddbDetailsListApi(data) {
  return request({
    url: '/api/ddpay-trade/app/acct/ddbDetails',
    method: 'post',
    data
  })
}
// 资金明细 DDB 详情
export async function coinDdbDetailApi(data) {
  return request({
    url: '/api/ddpay-trade/app/acct/getDDBOrderDetail',
    method: 'post',
    data
  })
}
// 资金明细 usdt详情
export async function coinUsdtDetailApi(data) {
  return request({
    url: '/api/ddpay-trade/app/acct/getDepositOrder',
    method: 'post',
    data
  })
}

// USDT充值历史记录
export async function usdtTopupListApi(data) {
  return request({
    url: '/api/ddpay-trade/app/acct/coinDeposit/page',
    method: 'post',
    data
  })
}

// ddb 兑换记录
export async function ddbExchangeListApi(data) {
  return request({
    url: '/api/ddpay-trade/app/trade/exchange-ddb/history-record',
    method: 'post',
    data
  })
}

// ddb 近几天 兑换记录
export async function ddbExchangeDaysListApi(data) {
  return request({
    url: '/api/ddpay-trade/app/trade/exchange-ddb/recent-record',
    method: 'post',
    data
  })
}
// ddb 兑换明细
export async function ddbExchangeDetailApi(data) {
  return request({
    url: '/api/ddpay-trade/app/trade/exchange-ddb/detail',
    method: 'post',
    data
  })
}

// 计算
export async function ddbExchangeCalcApi(data) {
  return request({
    url: '/api/ddpay-trade/app/trade/exchange-ddb/calc',
    method: 'post',
    data
  })
}

// ddb 兑换
export async function ddbExchangeConfirmApi(data) {
  return request({
    url: '/api/ddpay-trade/app/trade/exchange-ddb/confirm-order',
    method: 'post',
    data
  })
}
