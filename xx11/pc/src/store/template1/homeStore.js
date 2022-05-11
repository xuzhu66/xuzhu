import {
    platInfo,
    getLogo,
    checkPlanState,
    getBroadcastNotice,
    getCustomerUrl,
    getHeaderIntroduce,
    getHot,
    homeBanner,
    getPlatGame,
    gameLogin,
    getLateGame,
    getAppDownLoad,
    getPageIconApi,
    getWelcomeDetailApi,
    gameBanner, activityViwe, articleViweApi, preferType, preferList
} from "@/store/comstore/api/apiConfig";
import store from '@/store/Store';
import router from "@/router/Router";

const homeStore = {
    install() {
        store.registerModule(['homeStore'], {
            namespaced: true,
            state: {
                checkSMS: false, // 检查是否需要发送短信验证码
                regType: "", // 平台注册方式
                logoImg: "", // 平台Logo
                hotGameList: [], // 热门游戏
                lateGameList: [], // 最近游戏
                headerIntroduce: "", // 获取头部信息
                kefuUrl: '', // 客服连接
                isGetKefu: false, // 客服连接是否请求
                hotRecomm: [], // 热门推荐
                hotGame: [], // 热门游戏
                hotPre: [], // 热门优惠
                app: '',
                pageIcon: '', // 网站角标
                pageTitle: '',// 网站标题
                welcome: '', // 欢迎页面内容
                playBList: [], // 真人娱乐
                curPlayObj: {}, // 当前大Banner
                curPlayPlant: '', // 当前选中平台
                activTit: "",  // 文章标题
                activCon: "", // 文章内容
                preTypeList: "", // 活动类型
                preList: "", // 活动列表
                smsappid: '', //smsappid
                // teamAgentEnabled: '', //true表示开启合营代理申请，false表示平台没有开启合营代理申请
            },
            mutations: {
                set_checkSMS(state, data) { // 检查是否需要发送短信验证码
                    state.checkSMS = data;
                },
                set_regType(state, data) { // 平台注册方式
                    state.regType = data;
                },
                set_logoImg(state, data) { // 平台Logo
                    state.logoImg = data;
                },
                set_hotGameList(state, data) {
                    state.hotGameList = data;
                },
                set_headerIntroduce(state, data) {
                    state.headerIntroduce = data;
                },
                set_lateGameList(state, data) {
                    state.lateGameList = data;
                },
                set_kefuUrl(state, data) { // 客服连接
                    state.kefuUrl = data;
                },
                set_isGetKefu(state, data) { // 客服连接是否请求
                    state.isGetKefu = data;
                },
                set_hotRecomm(state, data) { // 热门推荐
                    state.hotRecomm = data;
                },
                set_hotGame(state, data) { // 热门游戏
                    state.hotGame = data;
                },
                set_hotPre(state, data) { // 热门优惠
                    state.hotPre = data;
                },
                // 设置app对象
                SET_APP(state, data) {
                    state.app = data;
                },
                // 网站角标
                SET_PAGEICON(state, data) {
                    state.pageIcon = data;
                },
                // 网站标题
                SET_PAGETITLE(state, data) {
                    state.pageTitle = data;
                },
                // 设置欢迎页面内容
                SET_WELCOME(state, data) {
                    state.welcome = data;
                },
                set_playBList(state, data) { // 真人娱乐
                    state.playBList = data;
                },
                set_curPlayObj(state, data) { // 当前大Banner
                    state.curPlayObj = data;
                },
                set_curPlayPlant(state, data) { // 当前选中平台
                    state.curPlayPlant = data;
                },
                set_activTit: (state, payload) => {
                    state.activTit = payload;
                },
                set_activCon: (state, payload) => {
                    state.activCon = payload;
                },
                set_preTypeList: (state, payload) => {  // 活动类型
                    state.preTypeList = payload;
                },
                set_preList: (state, payload) => {  // 活动列表
                    state.preList = payload;
                },
                SET_SMSAPP_ID(state, data) {
                    state.smsappid = data;
                },
                // SET_TEAMAGENTENABLED(state, data) {
                //     state.teamAgentEnabled = data;
                // },
            },
            actions: {
                async getIcon({commit}, data) {
                    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
                    link.rel = 'shortcut icon mask-icon';
                    link.href = data.icon;
                    document.getElementsByTagName('head')[0].appendChild(link); // 设置icon图标
                    document.title = data.title // 设置Title
                },
                // 获取平台配置信息
                async getPlatInfo({commit, dispatch}, data) {
                    try {
                        let res = await platInfo(data)
                        if (res && res.success) {
                            commit('set_checkSMS', res.data.enableAuthCode); // 是否需要发送短信验证码
                            commit('set_regType', res.data.regType); // 平台注册方式
                            commit('SET_SMSAPP_ID', res.data.picAppId); // 短信验证码ID
                            commit('set_cnzz', res.data.cnzz, {root: true}); // cnzz统计
                            commit('set_enableImgCode', res.data.enableImgCode, {root: true}); // 是否调用图形验证码 res.data.enableImgCode
                            commit('SET_TENANTPLAT_ID', res.data.tenantPlatId, {root: true}); // 设置平台id
                            commit('SET_TEAMAGENTENABLED', res.data.teamAgentEnabled, {root: true}); // true表示开启合营代理申请，false表示平台没有开启合营代理申请
                            commit('SET_SHOW_APP_DOWNLOAD', res.data.appDownloadFlag, {root: true});// 设置是否显示app下载
                            commit('SET_PLATFORM_INFO', res.data, {root: true}); // 平台信息对象
                            dispatch('headerStore/menuListChangeAction', {}, {root: true})

                        } else {
                            window.win.tips.warning(res.msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                async getLogoImg({commit}, data) { // 平台Logo
                    try {
                        let res = await getLogo(data)
                        if (res && res.success) {
                            commit('set_logoImg', res.data[0].picUrl); // 平台Logo
                        } else {
                            window.win.tips.warning(res.msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                async getBroadcastNotice({commit}, data) { // 获取轮播信息
                    try {
                        let res = await getBroadcastNotice(data)
                        if (res && !res.success) {
                            window.win.tips.warning(res.msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                async getCustomerUrl({commit}, data) {
                    try {
                        let res = await getCustomerUrl({deviceType: 2})
                        if (res && !res.success) {
                            window.win.tips.warning(res.msg);
                        }
                        commit('set_kefuUrl', res.data.customerUrl);
                        commit('set_isGetKefu', true);
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                async getHot({commit}, data) { // 首页热门
                    try {
                        let res = await getHot(data)
                        if (res && res.success) {
                            // store.commit('homeStore/set_hotGameList', res.data) // hotGameList列表
                        } else {
                            window.win.tips.warning(res.msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                async getHeaderIntroduce({commit}, data) { // 获取头部信息
                    try {
                        let res = await getHeaderIntroduce(data)
                        if (res && res.success) {
                            store.commit('homeStore/set_headerIntroduce', res.data[0].introduce) // 取头部信息
                        } else {
                            window.win.tips.warning(res.msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                // app下载
                async getAppDownLoadAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await getAppDownLoad(data)
                        if (res && res.success) {
                            commit('SET_APP', res.data)
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
                        }
                        window.win.myloading.hidden()
                        return res
                    } catch (err) {
                        window.win.myloading.hidden()
                        return err;
                    }
                },
                // 获取平台角标
                async getPageIconAction({commit, dispatch}, data) {
                    try {
                        let res = await getPageIconApi(data)
                        if (res && res.success) {
                            commit('SET_PAGEICON', res.data.pcIcon);
                            commit('SET_PAGETITLE', res.data.pcTitle);
                            dispatch('setIconAction', {  // 获取图标 及 Title
                                icon: res.data.pcIcon,
                                title: res.data.pcTitle,
                            });
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                // 设置icon
                async setIconAction({commit}, data) {
                    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
                    // link.type = 'image/png';
                    link.rel = 'icon';
                    link.href = data.icon;
                    document.getElementsByTagName('head')[0].appendChild(link); // 设置icon图标
                    document.title = data.title // 设置Title
                },
                // 获取欢迎页面内容
                async getWelcomeDetailAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await getWelcomeDetailApi(data)
                        window.win.myloading.hidden()
                        if (res && res.success) {
                            commit('SET_WELCOME', res.data)
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
                        }
                        return res
                    } catch (err) {
                        window.win.myloading.hidden()
                        return err;
                    }
                },
                // 获取banner
                async gameBannerAction({commit, dispatch}, data) { //
                    try {
                        let res = await gameBanner(data)
                        if (res && res.success) {
                            commit('set_playBList', res.data); // 真人娱乐
                            commit('set_curPlayObj', res.data[0]); // 真人娱乐
                            commit('set_curPlayPlant', res.data[0].id); // 当前选中平台
                            let o = {
                                value: res.data[0],
                                index: 'player'
                            }
                        } else {
                            window.win.tips.warning(res.msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                // 优惠详情
                async discountDetailAction({commit}, data) {
                    try {
                        let res = await activityViwe(data)
                        if (res && res.success) {
                            commit('set_activTit', res.data.name) // 文章标题
                            commit('set_activCon', res.data.content) // 文章内容
                        } else {
                            window.win.tips.warning(res.msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                async activityViwe({commit}, data) {
                    try {
                        let res = await activityViwe(data)
                        if (res && res.success) {
                            commit('set_activTit', res.data.name) // 文章标题
                            commit('set_activCon', res.data.content) // 文章内容
                        } else {
                            window.win.tips.warning(res.msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                async articleViweAction({commit}, data) {
                    try {
                        let res = await articleViweApi(data)

                        if (res && res.success) {
                        } else {
                            window.win.tips.warning(res.msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                async preferType({commit}, data) {
                    try {
                        let res = await preferType(data)
                        if (res.success) {
                            commit('set_preTypeList', res.data) // 活动类型
                        } else {
                            window.win.tips.warning(res.msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                async preferList({commit}, data) {
                    try {
                        let res = await preferList(data)
                        if (res.success) {
                            commit('set_preList', res.data) // 活动列表
                        } else {
                            window.win.tips.warning(res.msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                // 跳转至高级代理人;
                jumpToAgentPageAction({commit, dispatch, rootState}) {
                    // 跳转登录页面
                    if (!rootState.userId) {
                        commit('set_showLogin', true, {root: true});
                        commit("loginRegStore/set_curTemp", 'login', {root: true});
                        return
                    }
                    dispatch('returnTop', null, {root: true});
                    if (rootState.agentable) {
                        commit('set_curMenu', '/center/hadAgent', {root: true});
                        router.push({
                            path: '/center/hadAgent'
                        })
                    } else {
                        commit('set_curMenu', '/center/applyAgent', {root: true});
                        router.push({
                            path: '/center/applyAgent'
                        })
                    }
                },

            }
        })
    },
    uninstall(_this) {
        store.unregisterModule(['homeStore'])
    }
};

export default homeStore;
