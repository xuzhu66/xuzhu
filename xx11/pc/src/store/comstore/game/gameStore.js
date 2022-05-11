import store from '@/store/Store';

import {articleViweApi, checkPlanState, gameLogin} from "@/store/comstore/api/apiConfig";

const gameStore = {
    install(_this) {
        _this.$store.registerModule(['gameStore'], {
            namespaced: true,
            state: {
                showPickPlay: false, // 是否显示弹出框
                curList: {}, // 当前选中对像
                freeUrl: '', // 免费游戏
                plantUrl: '', // 平台连接
                butTxt: "前往登录", // 按扭状态

                nebn1: '', // 奖金
                nebn2: '', // 奖金
                nebn3: '', // 奖金
                nebn4: '', // 奖金
                nebn5: '', // 奖金
                nebn6: '', // 奖金
                nebn7: '', // 奖金
                nebn8: '', // 奖金
                nebn9: '', // 奖金
                nebn10: '', // 奖金
                isReq: true, // 请求是否完成
                currtGame: '',//当前游戏对象
                gameType: { //游戏类型
                    '1': '捕鱼',
                    '2': '彩票',
                    '3': '电竞',
                    '4': '电子-老虎机',
                    '5': '电子-桌游',
                    '6': '棋牌',
                    '7': '体育',
                    '8': '真人',
                }
            },
            mutations: {
                set_showPickPlay(state, data) { // 是否显示弹出框
                    state.showPickPlay = data;
                },
                set_curList(state, data) { // 当前选中对像
                    state.curList = data;
                },
                set_freeUrl(state, data) { // 免费游戏
                    state.freeUrl = data;
                },
                set_plantUrl(state, data) { // 平台连接
                    state.plantUrl = data;
                },
                set_butTxt(state, data) { // 按扭状态
                    state.butTxt = data;
                },
                set_nebn1(state, data) { // 奖金
                    state.nebn1 = data;
                },
                set_nebn2(state, data) { // 奖金
                    state.nebn2 = data;
                },
                set_nebn3(state, data) { // 奖金
                    state.nebn3 = data;
                },
                set_nebn4(state, data) { // 奖金
                    state.nebn4 = data;
                },
                set_nebn5(state, data) { // 奖金
                    state.nebn5 = data;
                },
                set_nebn6(state, data) { // 奖金
                    state.nebn6 = data;
                },
                set_nebn7(state, data) { // 奖金
                    state.nebn7 = data;
                },
                set_nebn8(state, data) { // 奖金
                    state.nebn8 = data;
                },
                set_nebn9(state, data) { // 奖金
                    state.nebn9 = data;
                },
                set_nebn10(state, data) { // 奖金
                    state.nebn10 = data;
                },
                set_isReq(state, data) { // 请求是否完成
                    state.isReq = data;
                },
                set_currtGame(state, data) { // 设置当前游戏对象
                    state.currtGame = data;
                }
            },
            actions: {
                // 1. gamebanner-入口
                async enterBannerAction({commit, dispatch, rootState}, data) { // 进入游戏
                    // 1. 判断是否登录; jumpCategory:跳转类型: 1: 站内路由跳转 2:文章展示 3:进入游戏 4: 自定义跳转 5: app 下载 6:跳转高级代理人 7:跳转单个游戏
                    if (rootState.userId == '' && (!data.jumpCategory == 2 || !data.jumpCategory == 4)) {
                        commit('set_showLogin', true, {root: true});
                        return
                    }
                    // 2. 保存当前游戏载体对象
                    commit('set_curList', data);
                    // 跳转类型: 1: 站内路由跳转 2:文章展示 3:进入游戏 4: 自定义跳转
                    switch (data.jumpCategory) {
                        case 1: // 路由--内部跳转
                            dispatch('jumpToRouterAction', {url:'/center/deposit'});
                            break;
                        case 2: // 文章
                            dispatch('getArticleAction', {id: data.articleId});
                            break;
                        case 3: // 进入游戏
                            dispatch('jumpToGameAction', data);
                            break;
                        case 4: // 跳到外站地址
                            data.url && window.open(data.url, "_blank");
                            break;
                        case 5: // app 下载
                            //data.url && window.open("", "_blank");
                            break;
                        case 6: // 跳转高级代理人
                            dispatch("homeStore/jumpToAgentPageAction", '', {root: true});
                            break;
                        case 7: // 跳转单个游戏
                            dispatch('jumpToGameAction', data);
                            break;

                        case "1": // 路由--内部跳转
                            dispatch('jumpToRouterAction', {url:'/center/deposit'});
                            break;
                        case "2": // 文章
                            dispatch('getArticleAction', {id: data.articleId});
                            break;
                        case "3": // 进入游戏
                            dispatch('jumpToGameAction', data);
                            break;
                        case "4": // 跳到外站地址
                            data.url && window.open(data.url, "_blank");
                            break;
                        case "5": // app 下载
                            //data.url && window.open("", "_blank");
                            break;
                        case "6": // 跳转高级代理人
                            dispatch("homeStore/jumpToAgentPageAction", '', {root: true});
                            break;
                        case "7": // 跳转单个游戏
                            dispatch('jumpToGameAction', data);
                            break;
                        default:
                            break;
                    }
                },
                // 跳转到游戏弹框界面, 如果是跳转自己大厅或者单个游戏,则判断是否在维护中;
                async jumpToGameAction({commit, dispatch,rootState}, data) {
                    //  判断是否进入单个游戏
                    if (data.jumpCategory == 7) {
                        // 检查游戏线路是否在维护之中
                        dispatch('checkGameStatusAction', data).then(res => {
                            if (res && res.success) {
                                if (res.data.status == 0 || res.data.status == '0') {
                                    commit('set_currtGame', data)
                                    commit('set_showPickPlay', true)
                                } else {
                                    window.win.mydialog.show({
                                        title: '维护公告',
                                        con: res.data.msg,
                                        btnTextLeft: "我知道了"
                                    }, (res) => {
                                    });
                                }
                            }
                        })
                    } else {
                        // 进入游戏大厅--判断是否是三方大厅 true: 三方大厅,直接进入游戏;  false:我方大厅,判断是否维护跳转电子大厅页面;
                        if (data.thirdLobby) {
                            commit('set_currtGame', data)
                            commit('set_showPickPlay', true)
                        } else {
                            // 检查游戏线路是否在维护之中
                            dispatch('checkGameStatusAction', data).then(res => {
                                if (res && res.success) {
                                    // 0 代表成功 然后跳转我们电子大厅;
                                    if (res.data.status == 0 || res.data.status == '0') {
                                        // 跳转电子大厅
                                        if (rootState.curMenu != '/electronic') {
                                            _this.$router.push({
                                                    path: '/electronic',
                                                    query: {gameLine: data.gameLineId}
                                                }
                                            )
                                        }
                                        commit('set_curMenu', '/electronic', {root: true})
                                    } else {
                                        window.win.mydialog.show({
                                            title: '维护公告',
                                            con: res.data.msg,
                                            btnTextLeft: "我知道了"
                                        }, (res) => {
                                        });
                                    }
                                }

                            })
                        }
                    }
                },
                // 2.检查游戏线路是否在维护之中 -- 01
                async checkGameStatusAction({commit, dispatch, store, rootState}, data) {
                    let param = {
                        id: data.gameLineId, // 线路id
                        gameId: data.gameId,// 游戏id
                    };
                    return checkPlanState(param);
                },
                // 3.获取游戏线路--游戏入口--1  enterGame
                async enterGameAction({state, commit, dispatch}, data) {
                    try {
                        let param = {
                            deviceType: 2, // 终端：1、H5 2、PC 3、android 4、ios
                            gameLineId: data.gameLineId, // 线路id
                            gameId: data.gameId,// 游戏id
                        };
                        // 如果是电子, 增加参数 gameTypeId =  1:捕鱼 2:彩票 3:电竞 4:电子-老虎机 5:电子-桌游 6:棋牌 7:体育 8:真人
                        if (state.currtGame.gameTypeId == 4 || state.currtGame.gameTypeId == 5) {
                            param.gameId = state.currtGame.id; // 游戏id
                            param.freePlayFlag = state.currtGame.pcSupport;// true表示支持试玩，false表示不支持试玩
                        }
                        // 登录三方游戏平台
                        let res = await gameLogin(param)
                        if (res && res.success) {
                            if (res.data.status == '0' || res.data.status == 0) {
                                dispatch("setGameUrlAction", res)
                            } else {
                                window.win.mydialog.show({
                                    title: '维护公告',
                                    con: res.data.msg,
                                    btnTextLeft: "我知道了"
                                }, (res) => {
                                });
                            }
                        } else {
                            window.win.tips.warning(res.msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                // 5.存储游戏数据
                async setGameUrlAction({commit, dispatch, rootState}, data) {
                    if (rootState.userId && rootState.userId != '') {
                        commit('set_butTxt', "进入游戏");
                        commit('set_freeUrl', data.data.freeUrl)
                        commit('set_plantUrl', data.data.url)
                    } else {
                        commit('set_freeUrl', data.data.freeUrl);
                        commit("loginRegStore/set_curTemp", 'login', {root: true});
                        commit('set_butTxt', "前往登录")
                    }
                },

                // 跳转登录页面
                async jumpLoginPageAction({commit, dispatch}, data) {
                    commit('set_showLogin', true, {root: true})
                    dispatch('closeGameDialogAction');
                },

                // 跳转路由
                jumpToRouterAction({commit, dispatch,rootState}, data) {
                    // 跳转登录页面
                    if (!rootState.userId) {
                        commit('set_showLogin', true, {root: true});
                        commit("loginRegStore/set_curTemp", 'login', {root: true});
                        return
                    }
                    dispatch('returnTop', null, {root: true});
                    let routerStr = data.url.substr(0, 1);
                    if (data.url.indexOf('http') >= 0) {
                        window.open(data.url, "_blank");
                    } else if (routerStr == '/') {
                        window.win.router.push({
                            path: data.url
                        })
                    }
                },

                // 获取文章并展示
                async getArticleAction({commit}, data) {
                    try {
                        let res = await articleViweApi(data)
                        if (res && res.success) {
                            window.win.mydialog.show({
                                title: '文章详情',
                                con: res.data.content,
                                diatxtClass: true
                            }, (res) => {
                            });
                        } else {
                            window.win.tips.warning(res.msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                // 关闭游戏弹框
                async closeGameDialogAction({state, commit, dispatch}, data) {
                    commit('set_showPickPlay', false);
                },
                async jumpFreeGamePageAction({state, commit, dispatch}, data) { // 去免费游戏
                    if (state.freeUrl) {
                        window.open(state.freeUrl, "_blank");
                    }
                    dispatch('closeGameDialogAction')
                },


            }
        })
    },
    uninstall(_this) {
        store.unregisterModule(['gameStore'])
    }
};

export default gameStore;
