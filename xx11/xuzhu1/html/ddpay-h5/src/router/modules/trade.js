export default [
  {
    path: '/trade', // 交易
    name: 'Trade',
    meta: { keepAlive: true, showTab: true, name: 'TradeIndex' },
    component: () => import('@/views/trade')
  },
  {
    path: '/TradeMyOrder',
    name: 'TradeMyOrder',
    meta: { keepAlive: true, showTab: false, name: 'TradeMyOrder' },
    component: () => import('@/views/trade/TradeMyOrder')
  },
  {
    path: '/TradeMyOrderDetail',
    name: 'TradeMyOrderDetail',
    meta: { keepAlive: false, showTab: false },
    component: () => import('@/views/trade/TradeMyOrderDetail')
  },
  {
    path: '/TradeOrderMatching',
    name: 'TradeOrderMatching',
    meta: { keepAlive: false, showTab: false },
    component: () => import('@/views/trade/TradeOrderMatching')
  },
  {
    path: '/TradeOrderAppeal',
    name: 'TradeOrderAppeal',
    meta: { keepAlive: false, showTab: false },
    component: () => import('@/views/trade/TradeOrderAppeal')
  },
  {
    path: '/TradeRisk',
    name: 'TradeRisk',
    meta: { keepAlive: false, showTab: false },
    component: () => import('@/views/trade/TradeRisk')
  }
]
