import Vue from 'vue'
import Vuex from 'vuex'
import {setToken, removeToken, setRefresToken, removeRefresToken, getRefresToken} from "@m/auth";
import {
    getLogon,
    getHomePerInfo,
    login,
    getEasyUserInfo,
    getLineBalance,
    aliOss,
    getAgentImgList,
    setBuriedPointApi,
} from "@/store/comstore/api/apiConfig";

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        // 平台相关
        sourceid: '', // 渠道ID
        rebaid: '', // 洗码代理ID

        // 用户相关
        token: "", // 权限token
        refresToken: "", // 权限token
        redTokeTime: 50, // token超时间
        userId: "", // 用户账号

        // app 相关
        isShowLoad: false, // 是否显示弹出框内容
        loadContent: {}, // loading弹窗内容
        showLogin: false, // 登入是否显示

        curMenu: '/home', // 当前选中菜单
        curMenuId: '', // 当前选中菜单ID

        balance: "", // 余额
        vipLevel: "", // vip等级：1表示普通会员 2-VIP1 3-VIP2 4-VIP3 5-VIP4 6-VIP5 7-VIP6
        username: "", // 账号
        inDays: '', // 加入我们的天数

        agentable: false, // 是否申请了代理 布尔类型：true表示是，false表示不是
        isShowTop: false, // 返回顶部是否显示
        isPGameSearch: false, // 游戏搜索
        sHeight: 0, // 滚动条高度
        scrollBottom: 1000, // 滚动到底部距離
        platformId: "", //平台id
        enableImgCode: false, // 是否调用图形验证码
        cnzz: '', // cnzz统计 'https://sdk.51.la/js-sdk-pro.min.js?id=idtest&ck=Jd6P9B0TazaH52mO'
        easyUserInfo: {},// 简易用户信息
        centerWallet: '',//中心钱包余额
        currtLineWallet: '',// 当前线路钱包余额
        uuid: '', // uuid

        tenantPlatId: '',// 平台id
        teamAgentEnabled: '', //true表示开启合营代理申请，false表示平台没有开启合营代理申请
        aliOssObj: {}, // 阿里云资源
        showAppDownLoad: false, // 是否显示app下载

        platformInfo: { // 平台信息
            rebateAgentEnabled: false,// 洗码代理
            teamAgentEnabled: false,// 合营代理
            unlimitAgentEnabled:false,//无线代理
        },

        telephoneLogin:'',// 登录时候指定的电话号码
    },
    getters: {
        token: state => state.token,
        refresToken: state => state.refresToken,
        sourceid: state => state.sourceid,
        rebaid: state => state.rebaid,
        userId: state => state.userId,
    },
    mutations: {
        set_token: (state, data) => {
            if (data) {
                setToken(data);
            } else {
                removeToken();
                window.win.store.commit('set_userId', '') // 用户ID
                window.win.store.commit('set_username', '') // 用户账号
                window.win.store.commit('set_balance', '') // 余额
            }
            state.token = data;
        },
        set_refresToken: (state, data) => {
            if (data) {
                setRefresToken(data);
            } else {
                removeRefresToken();
            }
            state.refresToken = data;
        },
        set_redTokeTime: (state, data) => {
            state.redTokeTime = data;
        },
        set_userId(state, data) { // 用户ID
            state.userId = data;
        },
        SET_ISSHOWLOAD: (state, data) => { // 是否显示弹出框内容
            state.isShowLoad = data
        },
        SET_LOADCONTENT: (state, data) => { // loading弹窗内容
            state.loadContent = data
        },
        SET_SOURCEID: (state, data) => { // 渠道ID
            state.sourceid = data
        },
        SET_REBAID: (state, data) => { // 洗码代理ID
            state.rebaid = data
        },
        set_showLogin: (state, data) => { // 登入是否显示
            state.showLogin = data
        },
        set_isShowTop: (state, data) => { // 返回顶部是否显示
            state.isShowTop = data
        },
        set_isPGameSearch: (state, data) => { // 游戏搜索
            state.isPGameSearch = data
        },


        set_balance(state, data) { // 余额
            state.balance = data;
            state.centerWallet = data;
        },
        set_centerBalance(state, data) { // 中心钱包余额
            state.balance = data;
            state.centerWallet = data;
        },
        set_vipLevel(state, data) {// vip等级：1表示普通会员 2-VIP1 3-VIP2 4-VIP3 5-VIP4 6-VIP5 7-VIP6
            state.vipLevel = data;
        },
        set_inDays(state, data) { // 加入我们的天数
            state.inDays = data;
        },
        set_username(state, data) { // 账号
            state.username = data;
        },
        set_agentable(state, data) { // 是否申请了代理
            state.agentable = data;
        },
        set_curMenu(state, data) { // 当前选中菜单
            state.curMenu = data;
        },
        set_curMenuId(state, data) { // 当前选中菜单id
            state.curMenuId = data;
        },
        set_sHeight: (state, data) => { // 滚动条高度
            state.sHeight = data
        },
        set_scrollBottom: (state, data) => { // 滚动条到底部距离
            state.scrollBottom = data;
        },
        set_platformId: (state, data) => { // 设置平台ID
            state.platformId = data;
        },
        set_enableImgCode: (state, data) => { // 是否调用图形验证码
            state.enableImgCode = data
        },
        set_cnzz(state, data) { // cnzz统计
            state.cnzz = data;
        },
        // set_userId: (state, data) => { // 用户ID
        //   state.userId = data;
        // },
        // 设置当前线路额度
        SET_CURRT_LINE_BALANCE(state, data) {
            state.currtLineWallet = data;
        },
        // 设置uuid
        SET_UUID(state, data) {
            state.uuid = data;
        },
        // 设置平台id
        SET_TENANTPLAT_ID(state, data) {
            state.tenantPlatId = data;
        },
        SET_TEAMAGENTENABLED(state, data) {
            state.teamAgentEnabled = data;
        },
        SET_ALIOSSOBJ(state, data) {
            state.aliOssObj = data;
        },
        SET_SHOW_APP_DOWNLOAD(state, data) {
            state.showAppDownLoad = data;
        },
        SET_PLATFORM_INFO(state, data) {
            state.platformInfo = data;
        },
        SET_TELEPHONE_LOGIN(state, data) {
            state.telephoneLogin = data;
        },


    },
    actions: {
        async login({store, commit, dispatch, state}, data) {
            try {
                data.tid = state.uuid;
                let res = await login(data)
                if (res && res.success) {
                    commit('set_token', res.access_token) // 设置Token
                    commit('set_refresToken', res.refresh_token) // 设置Token
                    commit('set_redTokeTime', res.expires_in) // 超时间间
                    commit('set_userId', res.player_id)
                    commit('set_showLogin', false)
                    commit("set_platformId", res.tenant_plat_id)

                    let p = window.win.router.currentRoute.path;
                    let arr = ['/home', '/beauty', '/chess', '/game', '/electronic', '/fish', '/lottery', '/gameRace', '/sport', '/discount']
                    if (!arr.includes(p)) {
                        window.win.store.commit('set_curMenu', '')
                    }
                    //跳转welcom欢迎页面
                    if (data.jumpWelcome) {
                        window.win.router.push('/welcome')
                    }
                    // window.win.router.push('/center'); // 跳转到个人中心
                    dispatch('getHomePerInfo')
                    // 合营代理控制
                    dispatch('headerStore/heYingMenuManagerAction')
                    // 查询签到详情
                    // dispatch("activityStore/getSinginInfoAction")
                    // 查询客服链接
                    dispatch("homeStore/getCustomerUrl");
                    // 查询活动配置
                    dispatch('activityStore/getActivityConfigAction');
                } else {
                    window.win.tips.warning(res.msg);
                    // window.win.mydialog.show({ con: res.msg, btnTextLeft: "知道了" });
                    // {
                    //     "code": 20155,
                    //     "success": false,
                    //     "msg": "当前不是您常用登录ip地址，需要短信验证码登录",
                    //     "data": {
                    //         "mobile": "13000000001"
                    //     }
                    // }
                    // 当前不是您常用登录ip地址，需要短信验证码登录
                    if(res.code == "20155"){
                        // 设置指定的手机号码
                        commit("SET_TELEPHONE_LOGIN",res.data.mobile);
                        // 跳转验证码登录
                        commit("loginRegStore/set_curTemp", 'loginVerif');
                    }
                }
                return res
            } catch (err) {
                return err;
            }
        },
        async refreshTokenRequest({commit, state, getters}) {
            try {
                let rToken
                if (window.win.store.getters.refresToken) {
                    rToken = await window.win.store.getters.refresToken
                } else {
                    if (getRefresToken()) {
                        window.win.store.commit("set_refresToken", getRefresToken());
                        rToken = await getRefresToken()
                    }
                }
                let param = {
                    grant_type: 'refresh_token',
                    scope: 'all',
                    refresh_token: rToken,
                };
                let res = await login(param)
                if (res && res.success) {
                    commit('set_token', res.access_token) // 设置Token
                    commit('set_refresToken', res.refresh_token) // 设置Token
                    commit('set_redTokeTime', res.expires_in) // 超时间间
                    // window.win.router.push('/'); // 跳转到个人中心
                } else {
                    if (res.code == 20102) {
                        window.win.store.commit('headerStore/logOut') // 退出登入
                    } else {
                        window.win.tips.warning(res.msg);
                    }
                }
                return res
            } catch (err) {
                return err;
            }
        },
        // 判断用户是否登录
        async getLogon({commit, dispatch}, data) { // 获取用户是否登录
            try {
                let res = await getLogon(data)
                if (res && res.success) {
                    if (res.data.playerId) {
                        commit('set_userId', res.data.playerId) // 用户ID
                        dispatch('getHomePerInfo')
                    } else {
                        commit('set_userId', '') // 用户ID
                    }
                } else {
                    // window.win.tips.warning(res.msg);
                }
                return res
            } catch (err) {
                return err;
            }
        },
        async getHomePerInfo({commit, state}, data) { // 获取简单用户信息
            try {
                let res = await getHomePerInfo(data)
                if (res && res.success) {
                    commit('set_balance', res.data.balance) // 余额
                    commit('set_centerBalance', res.data.balance) // 中心钱包余额
                    commit('set_inDays', res.data.inDays) // 加入我们的天数
                    commit('set_vipLevel', res.data.vipLevel) // vip等级：1表示普通会员 2-VIP1 3-VIP2 4-VIP3 5-VIP4 6-VIP5 7-VIP6
                    commit('set_username', res.data.username) // 账号
                    commit('set_userId', res.data.playerId) // 用户ID
                    commit('set_agentable', res.data.agentable) // 是否申请了代理
                    commit('set_cnzz', res.data.cnzz) // cnzz统计
                    if (res.data.playerId) {
                        let s = setTimeout(() => {
                            window.win.store.dispatch('refreshTokenRequest').then(() => {
                                clearTimeout(s);
                                let ss = setInterval(() => {
                                    window.win.store.dispatch('refreshTokenRequest')
                                }, 1000 * (window.win.store.state.redTokeTime - 30))
                            })
                        }, 1000 * (window.win.store.state.redTokeTime - 30))
                    }
                } else {
                    // window.win.tips.warning(res.msg);
                }
                return res
            } catch (err) {
                return err;
            }
        },
        // 个人信息-简易资料-中心钱包
        async getEasyUserInfoAction({commit, state}, data) {
            try {
                let res = await getEasyUserInfo(data)
                if (res && res.success) {
                    commit('SET_EASY_USER_INFO', res.data)
                } else {

                }
                return res
            } catch (err) {
                return err;
            }
        },
        // 获取线路余额
        async getLineBalanceAction({commit, state}, data) {
            try {
                let res = await getLineBalance(data)
                if (res && res.success) {
                    commit('SET_CURRT_LINE_BALANCE', res.data)
                } else {

                }
                return res
            } catch (err) {
                return err;
            }
        },
        getScroll({commit, state}, data) { // 获取简单用户信息
            let scrollBottom = (event.target.scrollHeight - event.target.scrollTop) - event.target.clientHeight;
            commit('set_scrollBottom', scrollBottom)
            commit('set_sHeight', data.target.scrollTop)
            if (data.target.scrollTop > 100) {
                commit('set_isShowTop', true)
                if (data.target.scrollTop > 120) {
                    commit('set_isPGameSearch', true)
                } else {
                    commit('set_isPGameSearch', false)
                }
            } else {
                commit('set_isShowTop', false)
                commit('set_isPGameSearch', false)
            }
            return data
        },
        // 回到顶部
        returnTop({commit, state}, data) {
            // let l = document.documentElement.scrollTop;
            let l = document.getElementById('app').scrollTop;
            let s = l / 600 * 50;  //路程/时间=s *25每隔25ms秒 动的路程
            let st = setInterval(function () {
                l -= s;
                if (l <= 0) {
                    l = 0; //当l<=0时，设置l=0
                    clearInterval(st);
                }
                document.getElementById('app').scrollTop = l;
            }, 25)
        },
        async aliOssAct({commit}, data) {
            try {
                let res = await aliOss(data)
                if (res && res.success) {
                    commit('SET_ALIOSSOBJ', res.data);
                }
                return res
            } catch (err) {
                return err;
            }
        },
        // 获取代理图片
        async getAgentImgListAction({commit, state}, data) {
            try {
                let res = await getAgentImgList(data)
                return res
            } catch (err) {
                return err;
            }
        },
        // 设置数据埋点
        async setBuriedPointAction({commit, state}, data) {
            try {
                let res = await setBuriedPointApi(data)
                return res
            } catch (err) {
                return err;
            }
        },

    }
});
export default store;
