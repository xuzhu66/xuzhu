import {
    activityViwe,
    getAppDownLoad,
    getBroadcastNotice,
    getCustomerUrl,
    getLogo,
    platInfo,
    preferList,
    preferType,
    getPageIconApi,
    getWelcomeDetailApi, articleViweApi,
} from "@/store/comstore/api/apiConfig";
import store from '@/store/Store';
import router from "@/router/Router";

import {getAboutUs, getBannerList, getHotList, getGameList} from "@/store/template2/apiConfig"

const homeStore = {
    install(that) {
        store.registerModule(['homeStore'], {
            namespaced: true,
            state: {
                checkSMS: false, // 检查是否需要发送短信验证码
                regType: "", // 平台注册方式
                logoImg: "", // 平台Logo
                kefuUrl: '', // 客服连接
                app: '', // app 下载对象

                recommendList: '', //1、首页热门推荐
                hotGameList: '', // 2、首页热门游戏
                hotDiscountList: '',//3、首页热门优惠
                washCodeList: '', //4、洗码代理banner
                aboutUs: '', //关于我们
                aboutList: '', //关于我们文案列表

                beautyGameList: '', // 真人游戏列表
                chessGameList: '', // 棋牌游戏列表
                fishGameList: '', // 捕鱼游戏列表
                lotteryGameList: '', // 彩票游戏列表
                gameraceGameList: '', // 电竞游戏列表
                sportGameList: '', // 体育游戏列表

                discountTypeList: '', //优惠类型列表
                discountList: '', //优惠列表
                discountDetail: '', //优惠详情

                pageIcon: '', // 网站角标
                pageTitle: '',// 网站标题

                welcome: '', // 欢迎页面内容
                smsappid: '', //smsappid
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
                set_kefuUrl(state, data) { // 客服连接
                    state.kefuUrl = data;
                },
                // 设置app对象
                set_app(state, data) {
                    state.app = data;
                },
                // 设置app对象
                SET_APP(state, data) {
                    state.app = data;
                },
                // 热门推荐
                SET_RECOMMEND_LIST(state, data) {
                    state.recommendList = data;
                },
                // 热门游戏
                SET_HOTGAME_LIST(state, data) {
                    state.hotGameList = data;
                },
                // 热门活动
                SET_HOTDISCOUNT_LIST(state, data) {
                    state.hotDiscountList = data;
                },
                // 洗码banner
                SET_WASHCODE_LIST(state, data) {
                    state.washCodeList = data;
                },
                // 关于我们
                SET_ABOUTUS(state, data) {
                    state.aboutUs = data;
                    state.aboutList = data.content && data.content.split('#');
                },
                // 真人- 游戏列表
                SET_BEAUTY_GAMELIST(state, data) {
                    state.beautyGameList = data;
                },
                // 棋牌- 游戏列表
                SET_CHESS_GAMELIST(state, data) {
                    state.chessGameList = data;
                },
                // 捕鱼- 游戏列表
                SET_FISH_GAMELIST(state, data) {
                    state.fishGameList = data;
                },
                // 彩票- 游戏列表
                SET_LOTTERY_GAMELIST(state, data) {
                    state.lotteryGameList = data;
                },
                // 电竞- 游戏列表
                SET_GAMERACE_GAMELIST(state, data) {
                    state.gameraceGameList = data;
                },
                // 体育- 游戏列表
                SET_SPORT_GAMELIST(state, data) {
                    state.sportGameList = data;
                },
                // 优惠类型
                SET_DISCOUNTTYPELIST(state, data) {
                    state.discountTypeList = data;
                },
                // 优惠列表
                SET_DISCOUNTLIST(state, data) {
                    state.discountList = data;
                },
                // 优惠详情
                SET_DISCOUNTDETAIL(state, data) {
                    state.discountDetail = data;
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
                // 首页热门游戏-轮播
                SET_HOME_HOTGAME_LIST(state, data) {
                    state.hotGameSwiperList = data;
                },
                SET_SMSAPP_ID(state, data) {
                    state.smsappid = data;
                },

            },
            actions: {
                // 获取配置信息
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
                        } else {
                            window.win.tips.warning(res.msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },

                // 平台Logo
                async getLogoImg({commit}, data) {
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

                // 获取轮播信息
                async getBroadcastNotice({commit}, data) {
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

                // 获取客服
                async getCustomerUrl({commit}, data) {
                    try {
                        let res = await getCustomerUrl({deviceType:2})
                        if (res && res.success) {
                            commit('set_kefuUrl', res.data.customerUrl);
                        } else {
                            window.win.tips.warning(res.msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },

                // type: 1、首页热门推荐 2、首页热门游戏 3、首页热门优惠 4、洗码代理banner
                async getHotListAction({commit}, data) {
                    try {
                        let res = await getHotList(data)
                        if (res && res.success) {
                            if (data.type == 1) {
                                commit('SET_RECOMMEND_LIST', res.data);
                            } else if (data.type == 2) {
                                commit('SET_HOTGAME_LIST', res.data);
                            } else if (data.type == 3) {
                                commit('SET_HOTDISCOUNT_LIST', res.data);
                            } else if (data.type == 4) {
                                commit('SET_WASHCODE_LIST', res.data);
                            }

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

                // 获取banner公共方法
                async getBannerListAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await getBannerList(data)
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

                // 关于我们
                async getAboutUsAction({commit, dispatch}, data) {
                    try {
                        let res = await getAboutUs(data)
                        if (res && res.success) {
                            commit('SET_ABOUTUS', res.data[0])
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },

                // 获取游戏列表 seatType ：0 首页 1 真人娱乐 2 棋牌游戏 3 电子游戏 4 捕鱼游戏 5 彩票投注 6 电子竞技 7 体育投注 8 优惠活动
                async getGameListAction({commit, dispatch}, data) {
                    try {
                        let res = await getGameList(data)
                        if (res && res.success) {
                            if (data.seatType == 1) {
                                commit('SET_BEAUTY_GAMELIST', res.data);
                            } else if (data.seatType == 2) {
                                commit('SET_CHESS_GAMELIST', res.data);
                            } else if (data.seatType == 4) {
                                commit('SET_FISH_GAMELIST', res.data);
                            } else if (data.seatType == 5) {
                                commit('SET_LOTTERY_GAMELIST', res.data);
                            } else if (data.seatType == 6) {
                                commit('SET_GAMERACE_GAMELIST', res.data);
                            } else if (data.seatType == 7) {
                                commit('SET_SPORT_GAMELIST', res.data);
                            }
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },

                // 优惠类型列表
                async discountTypeListAction({commit}, data) {
                    try {
                        let res = await preferType(data)
                        if (res.success) {
                            commit('SET_DISCOUNTTYPELIST', res.data) // 活动类型
                        } else {
                            window.win.tips.warning(res.msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },

                // 优惠列表
                async discountListAction({commit}, data) {
                    try {
                        let res = await preferList(data)
                        if (res.success) {
                            commit('SET_DISCOUNTLIST', res.data) // 活动列表
                        } else {
                            window.win.tips.warning(res.msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },

                // 模板方法
                async templateAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await getBannerList(data)
                        window.win.myloading.hidden()
                        if (res && res.success) {
                            commit('SET_APP', res.data)
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

                // 优惠详情
                async discountDetailAction({commit}, data) {
                    try {
                        let res = await activityViwe(data)
                        if (res && res.success) {
                            commit('set_activTit', res.data.name);
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
                // 获取文章详情
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


            }
        })
    },
    uninstall(_this) {
        store.unregisterModule(['homeStore'])
    }
};

export default homeStore;
