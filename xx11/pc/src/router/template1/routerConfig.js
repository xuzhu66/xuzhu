const index = () => import(/* webpackPrefetch: true */ '@/views/template1'); // 首页
const home = () => import(/* webpackPrefetch: true */ '@/views/template1/home/home'); // 首页
const discount = () => import(/* webpackPrefetch: true */ '@/views/template1/home/discount'); // 优惠活动列表
const beauty = () => import(/* webpackPrefetch: true */ '@/views/template1/home/beauty'); // 真人
const chess = () => import(/* webpackPrefetch: true */ '@/views/template1/home/chess'); // 棋牌
const fish = () => import(/* webpackPrefetch: true */ '@/views/template1/home/fish'); // 捕鱼
const gameRace = () => import(/* webpackPrefetch: true */ '@/views/template1/home/gameRace'); // 电子竞技
const lottery = () => import(/* webpackPrefetch: true */ '@/views/template1/home/lottery'); // 彩票
const sport = () => import(/* webpackPrefetch: true */ '@/views/template1/home/sport'); // 体育
const sports = () => import(/* webpackPrefetch: true */ '@/views/template1/home/sports'); // 体育-ifream方式
const electronic = () => import(/* webpackPrefetch: true */ '@/views/template1/home/electronic'); // 电子
const welcome = () => import(/* webpackPrefetch: true */ '@/views/template1/home/welcome'); // 欢迎界面

const center = () => import(/* webpackPrefetch: true */ '@/views/template1/center/center'); // 个人中心首页
const assetsOverview = () => import(/* webpackPrefetch: true */ '@/views/template1/center/assetsOverview'); // 资产总览
const userinfo = () => import(/* webpackPrefetch: true */ '@/views/template1/center/userinfo'); // 个人资料
const depositIndex = () => import(/* webpackPrefetch: true */ '@/views/template1/center/depositIndex'); // 存款专区
const drawIndex = () => import(/* webpackPrefetch: true */ '@/views/template1/center/drawIndex'); // 取款专区
const transferIndex = () => import(/* webpackPrefetch: true */ '@/views/template1/center/transferIndex'); // 转账专区
const capitalRecord = () => import(/* webpackPrefetch: true */ '@/views/template1/center/capitalRecord'); // 资金记录
const bettingRecord = () => import(/* webpackPrefetch: true */ '@/views/template1/center/bettingRecord'); // 投注记录
const washCodeRecord = () => import(/* webpackPrefetch: true */ '@/views/template1/center/washCodeRecord'); // 洗码记录
const discountRecord = () => import(/* webpackPrefetch: true */ '@/views/template1/center/discountRecord'); // 优惠记录
const passWord = () => import(/* webpackPrefetch: true */ '@/views/template1/center/passWord'); // 密码设置
const hadAgent = () => import(/* webpackPrefetch: true */ '@/views/template1/center/hadAgent'); // 代理管理
const applyAgent = () => import(/* webpackPrefetch: true */ '@/views/template1/center/applyAgent'); // 代理申请
const message = () => import(/* webpackPrefetch: true */ '@/views/template1/center/message'); // 消息中心
const agent = () => import(/* webpackPrefetch: true */ '@/views/business/home/agent'); // 首页代理页面
const vipCenter = () => import(/* webpackPrefetch: true */ '@/views/template1/center/vipCenter'); // vip中心

export default [
    {
        path: '*',
        redirect: '/'
    },
    {
        path: '/',
        name: 'index',
        component: index,
        meta: {
            requiredAuth: false // 是否需要token登入
        },
        children: [
            {
                path: '/',
                name: 'main',
                component: home
            },
            {
                path: '/home',
                name: 'home',
                component: home
            },
            {
                path: '/beauty',
                name: 'beauty',
                component: beauty
            },
            {
                path: '/chess',
                name: 'chess',
                component: chess
            },
            {
                path: '/fish',
                name: 'fish',
                component: fish
            },
            {
                path: '/electronic',
                name: 'electronic',
                component: electronic
            },
            {
                path: '/gameRace',
                name: 'gameRace',
                component: gameRace,
                meta: {
                    requiredAuth: false // 是否需要token登入
                }
            },
            {
                path: '/lottery',
                name: 'lottery',
                component: lottery,
                meta: {
                    requiredAuth: false // 是否需要token登入
                }
            },
            {
                path: '/sport',
                name: 'sport',
                component: sport,
                meta: {
                    requiredAuth: false // 是否需要token登入
                }
            },
            {
                path: '/discount',
                name: 'discount',
                component: discount,
                meta: {
                    requiredAuth: false, // 是否需要token登入
                    keep: true
                }
            },
            {
                path: '/agent',
                name: 'agent',
                component: agent,
                meta: {
                    requiredAuth: false // 是否需要token登入
                }
            },
            {
                path: '/welcome',
                name: 'welcome',
                component: welcome,
                meta: {
                    requiredAuth: false, // 是否需要token登入
                    keep: true
                }
            },
            {
                path: '/center',
                name: '个人中心',
                component: center,
                meta: {r: true},
                children: [
                    {path: '/center', redirect: '/center/assetsOverview'},
                    {path: '/center/assetsOverview', name: '资产总览', component: assetsOverview, meta: {r: true}},
                    {path: '/center/userinfo', name: '个人资料', component: userinfo},

                    {path: '/center/deposit', name: '存款专区', component: depositIndex, meta: {r: true}},
                    {path: '/center/draw', name: '取款专区', component: drawIndex, meta: {r: true, check: true}},
                    {path: '/center/transfer', name: '转账专区', component: transferIndex, meta: {r: true}},

                    {path: '/center/capitalRecord', name: '交易记录', component: capitalRecord, meta: {r: true}},
                    {path: '/center/bettingRecord', name: '投注记录', component: bettingRecord, meta: {r: true}},
                    {path: '/center/washCodeRecord', name: '洗码记录', component: washCodeRecord, meta: {r: true}},
                    {path: '/center/discountRecord', name: '优惠记录', component: discountRecord, meta: {r: true}},

                    {path: '/center/passWord', name: '密码设置', component: passWord, meta: {r: true}},
                    {path: '/center/hadAgent', name: '代理管理', component: hadAgent, meta: {r: true}},
                    {path: '/center/applyAgent', name: '代理申请', component: applyAgent, meta: {r: true}},
                    {path: '/center/message', name: '消息中心', component: message, meta: {r: true}},
                    { path: '/center/vipCenter', name: 'vip中心', component: vipCenter, meta: { r: true  } },

                ]
            },
        ]
    },
    {
        path: '/sports', // ifream 方式的体育页面
        name: 'sports',
        component: sports,
        meta: {
            requiredAuth: false // 是否需要token登入
        }
    },
];
