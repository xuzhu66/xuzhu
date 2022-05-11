export default [
  {
    path: '/', // 首页
    name: 'HomeIndex',
    meta: { keepAlive: true, showTab: true, name: 'HomeIndex' },
    component: () => import('@/views/index')
  },
  {
    path: '/fundList', // 明细
    name: 'FundList',
    meta: { keepAlive: true, showTab: false, name: 'FundList' },
    component: () => import('@/views/index/FundList')
  },
  {
    path: '/detailCoin', // 币的明细
    name: 'DetailCoin',
    meta: { keepAlive: false, showTab: false },
    component: () => import('@/views/index/DetailCoin')
  },
  {
    path: '/usdt', // 充值USDT
    name: 'USDT',
    meta: { keepAlive: true, showTab: false, name: 'UsdtTopUp' },
    component: () => import('@/views/index/usdt')
  },
  {
    path: '/history', // 历史记录
    name: 'UsdtHistory',
    meta: { keepAlive: true, showTab: false, name: 'UsdtHistory' },
    component: () => import('@/views/index/UsdtHistory')
  },
  {
    path: '/exchange', // 兑换DDB
    name: 'DdbExchange',
    meta: { keepAlive: true, showTab: false, name: 'DdbExchange' },
    component: () => import('@/views/index/ddb')
  },
  {
    path: '/historyExchange', // ddb 兑换历史记录
    name: 'DdbHistory',
    meta: { keepAlive: true, showTab: false, name: 'DdbHistory' },
    component: () => import('@/views/index/DdbHistory')
  }
]
