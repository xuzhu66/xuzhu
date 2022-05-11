import {
  createRouter,
  // createWebHistory,
  createWebHashHistory 
} from 'vue-router'
import loginModules from './modules/login'
import indexModules from './modules/index'
import tradeModules from './modules/trade'
import mineModules from './modules/mine'
import { getToken } from '@/utils/token'

let closeRouter = [
  {
    path: '/close',
    name: 'Close',
    meta: { keepAlive: false, showTab: true },
    component: () => import('@/views/close')
  }
]
if (
  process.env['VUE_APP_MODE_NAME'] !== 'dev' &&
  process.env['VUE_APP_MODE_NAME'] !== 'test'
) {
  closeRouter = []
}
const routes = [
  ...indexModules, // 首页路由模块
  {
    path: '/index',
    redirect: '/'
  },
  ...loginModules, // 登陆路由模块
  ...tradeModules, // 交易路由模块
  {
    path: '/helpTab', // 帮助
    name: 'HelpTab',
    meta: { keepAlive: true, showTab: true, name: 'Help' },
    component: () => import('@/views/mine/help')
  },
  ...mineModules, // 我的路由模块
  ...closeRouter,
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
router.beforeEach((to, from, next) => {
  const token = getToken()
  const whitePage = [
    'Login',
    'Register',
    'ForgotPassword',
    'ForgotEmail',
    'AllForgot',
    'Certify',
    'ForgotPwdCertify',
    'ResetPwd',
    'TelCodeRegist',
    'LoginValidate',
    'HelpTab',
    'Close'
  ]
  if (!token && !whitePage.includes(to.name)) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router
