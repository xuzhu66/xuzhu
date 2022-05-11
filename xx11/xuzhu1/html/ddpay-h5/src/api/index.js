// import request from '@/utils/request'
const requestFun = () => import('@/utils/request')

export async function acctInfo(data) { // 首页数据
  const request = (await requestFun()).default
  return request({
    url: '/api/ddpay-trade/app/acct/info',
    // url: '/mock/61f0256141b6e6074b307741/h5/ddpay-trade/app/acct/info',
    method: 'post',
    data
  })
}
// banner
export async function bannerListApi() {
  const request = (await requestFun()).default
  return request({
    url: '/api/ddpay-system/app/banner-detail/list',
    method: 'post'
  })
}
