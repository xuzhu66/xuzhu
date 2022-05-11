export default [
  {
    path: '/login', // 登陆
    name: 'Login',
    meta: { keepAlive: true, showTab: false },
    component: () => import('@/views/login')
  },
  {
    path: '/register', // 注册
    name: 'Register',
    meta: { keepAlive: true, showTab: false },
    component: () => import('@/views/login/register')
  },
  // {
  //   path: '/emailLogin', // 邮箱登陆
  //   name: 'EmailLogin',
  //   meta: { keepAlive: true, showTab: false },
  //   component: () => import('@/views/login/emailLogin')
  // },
  {
    path: '/forgotPassword', // 忘记密码-手机验证
    name: 'ForgotPassword',
    meta: { keepAlive: true, showTab: false },
    component: () => import('@/views/login/forgotPassword')
  },
  {
    path: '/forgotEmail', // 忘记密码-邮箱验证
    name: 'ForgotEmail',
    meta: { keepAlive: true, showTab: false },
    component: () => import('@/views/login/forgotEmail')
  },
  {
    path: '/allForgot', // 忘记手机或邮箱
    name: 'AllForgot',
    meta: { keepAlive: true, showTab: false },
    component: () => import('@/views/login/allForgot')
  },
  {
    path: '/certify', // 身份验证
    name: 'Certify',
    meta: { keepAlive: true, showTab: false },
    component: () => import('@/views/login/certify')
  },
  {
    path: '/forgotPwdCertify', // 忘记密码-认证
    name: 'ForgotPwdCertify',
    meta: { keepAlive: true, showTab: false },
    component: () => import('@/views/login/forgotPwdCertify')
  },
  {
    path: '/resetPwd', // 重置密码
    name: 'ResetPwd',
    meta: { keepAlive: true, showTab: false },
    component: () => import('@/views/login/resetPwd')
  },
  {
    path: '/telCodeRegist', // 验证
    name: 'TelCodeRegist',
    meta: { keepAlive: false, showTab: false },
    component: () => import('@/views/login/telCodeRegist')
  },
  {
    path: '/loginValidate', // 验证
    name: 'LoginValidate',
    meta: { keepAlive: false, showTab: false },
    component: () => import('@/views/login/loginValidate')
  }

]
