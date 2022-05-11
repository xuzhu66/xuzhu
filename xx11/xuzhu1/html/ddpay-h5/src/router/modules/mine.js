export default [
  {
    path: '/mine', // 我的
    name: 'Mine',
    meta: { keepAlive: true, showTab: true },
    component: () => import('@/views/mine'),
    redirect: '/mine/center',
    children: [{
      path: '/mine/center',
      name: 'Center',
      meta: { keepAlive: true, showTab: true },
      component: () => import('@/views/mine/center')
    }, {
      path: '/mine/userinfo',
      name: 'Userinfo',
      meta: { keepAlive: false, showTab: false },
      component: () => import('@/views/mine/userinfo')
    }, {
      path: '/mine/message',
      name: 'Message',
      meta: { keepAlive: false, showTab: false },
      component: () => import('@/views/mine/message')
    }, {
      path: '/mine/message/detail/:id',
      name: 'MessageDetail',
      meta: { keepAlive: false, showTab: false },
      component: () => import('@/views/mine/messageDetail')
    }, {
      path: '/mine/promot',
      name: 'Promot',
      meta: { keepAlive: false, showTab: false },
      component: () => import('@/views/mine/promot')
    }, {
      path: '/mine/promot/list',
      name: 'PromotList',
      meta: { keepAlive: false, showTab: false },
      component: () => import('@/views/mine/promotList')
    }, {
      path: '/mine/chat',
      name: 'Chat',
      meta: { keepAlive: false, showTab: false },
      component: () => import('@/views/mine/chat')
    }, {
      path: '/mine/about',
      name: 'About',
      meta: { keepAlive: false, showTab: false },
      component: () => import('@/views/mine/about')
    }, {
      path: '/mine/help',
      name: 'Help',
      meta: { keepAlive: false, showTab: false },
      component: () => import('@/views/mine/help')
    }, {
      path: '/mine/setting',
      name: 'Setting',
      meta: { keepAlive: false, showTab: false },
      component: () => import('@/views/mine/setting')
    }, {
      path: '/mine/userAgreement',
      name: 'UserAgreement',
      meta: { keepAlive: false, showTab: false },
      component: () => import('@/views/static/userAgreement')
    }, {
      path: '/mine/privacyAgreement',
      name: 'PrivacyAgreement',
      meta: { keepAlive: false, showTab: false },
      component: () => import('@/views/static/privacyAgreement')
    }, {
      path: '/mine/safeCenter',
      name: 'SafeCenter',
      meta: { keepAlive: false, showTab: false },
      component: () => import('@/views/mine/safeCenter')
    }, {
      path: '/mine/loginPwd',
      name: 'LoginPwd',
      meta: { keepAlive: false, showTab: false },
      component: () => import('@/views/mine/loginPwd')
    }, {
      path: '/mine/depositPwd',
      name: 'DepositPwd',
      meta: { keepAlive: false, showTab: false },
      component: () => import('@/views/mine/depositPwd')
    }, {
      path: '/mine/transferPwd',
      name: 'TransferPwd',
      meta: { keepAlive: false, showTab: false },
      component: () => import('@/views/mine/transferPwd')
    }, {
      path: '/mine/telephone',
      name: 'Telephone',
      meta: { keepAlive: false, showTab: false },
      component: () => import('@/views/mine/telephone')
    }, {
      path: '/mine/email',
      name: 'Email',
      meta: { keepAlive: false, showTab: false },
      component: () => import('@/views/mine/email')
    }, {
      path: '/mine/activity',
      name: 'Activity',
      meta: { keepAlive: false, showTab: false },
      component: () => import('@/views/mine/activity')
    },
    {
      path: '/mine/terminal',
      name: 'Terminal',
      meta: { keepAlive: false, showTab: false },
      component: () => import('@/views/mine/terminal')
    },
    {
      path: '/mine/google',
      name: 'Google',
      meta: { keepAlive: false, showTab: false },
      component: () => import('@/views/mine/google')
    },
    {
      path: '/mine/googleCode',
      name: 'GoogleCode',
      meta: { keepAlive: false, showTab: false },
      component: () => import('@/views/mine/googleCode')
    },
    {
      path: '/mine/telCode',
      name: 'TelCode',
      meta: { keepAlive: false, showTab: false },
      component: () => import('@/views/mine/telCode')
    },
    {
      path: '/mine/telephone',
      name: 'Telephone',
      meta: { keepAlive: false, showTab: false },
      component: () => import('@/views/mine/telephone')
    },
    {
      path: '/mine/phishingCode',
      name: 'PhishingCode',
      meta: { keepAlive: false, showTab: false },
      component: () => import('@/views/mine/phishingCode')
    },
    {
      path: '/mine/accountIndex',
      name: 'AccountIndex',
      meta: { keepAlive: false, showTab: false },
      component: () => import('@/views/mine/accountIndex')
    },
    {
      path: '/mine/bank',
      name: 'Bank',
      meta: { keepAlive: false, showTab: false },
      component: () => import('@/views/mine/bank')
    },
    {
      path: '/mine/alipay',
      name: 'Alipay',
      meta: { keepAlive: false, showTab: false },
      component: () => import('@/views/mine/alipay')
    },
    {
      path: '/mine/wechat',
      name: 'Wechat',
      meta: { keepAlive: false, showTab: false },
      component: () => import('@/views/mine/wechat')
    }

    ]
  }
]
