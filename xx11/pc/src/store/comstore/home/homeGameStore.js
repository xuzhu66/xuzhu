import {homeBanner, toEGameList, loveGames, getGamelines} from "@/store/comstore/api/apiConfig";
import {tableResult} from '@/store/comstore/home/tableResult';

const searchParam = () => ({
    gameLineId: '',// 游戏线路id
    gameTypeId: '',// 游戏类型
    loveFlag: "", // true表示查询收藏电子游戏，false表示不查询收藏电子游戏
    recommend: "", // 是否推荐
    name: "", // 当前交易类型
    isReqGameList: true // 游戏列表是否请示完
    // gameLineId: '', // 游戏线路id
    // name: "", // 游戏名称，支持模糊查询
    // loveFlag: false, // true表示查询收藏电子游戏，false表示不查询收藏电子游戏
    // recommend: false // 是否推荐
});

const homeGameStore = {
    install(_this) {
        _this.$store.registerModule(['homeGameStore'], {
            namespaced: true,
            state: {
                ...searchParam(),
                hotGameList: [], // 热门游戏
                curEgameList: [], // 当前电子游戏
                searchGameList: [], // 搜索游戏
                searchArr: [], // 搜索列表
                gameLineArr: [], // 获取第三方线路
            },
            getters: {
                getFormName(state) {
                    return {
                        gameLineId: state.gameLineId, // 游戏线路id
                        gameTypeId: state.gameTypeId, // 游戏类型
                        loveFlag: state.loveFlag, // true表示查询收藏电子游戏，false表示不查询收藏电子游戏
                        recommend: state.recommend, // 是否推荐
                        name: state.name, // 当前交易类型
                        query: {
                            current: state.tableResult.page,
                            size: state.tableResult.size
                        }
                    };
                }
            },
            mutations: {
                RESET_SEARCH_PARAM: state => { // 重置 搜素条件
                    const initialResult = searchParam();
                    Object.keys(initialResult).forEach(key => {
                        state[key] = initialResult[key];
                    });
                },
                CHANGE_GAMELINEID: (state, payload) => {
                    state.gameLineId = payload;
                },
                CHANGE_GAMETYPEID: (state, payload) => {
                    state.gameTypeId = payload;
                },
                CHANGE_NAME: (state, payload) => {
                    state.name = payload;
                },
                CHANGE_LOVEFLAG: (state, payload) => {
                    state.loveFlag = payload;
                },
                CHANGE_RECOMMEND: (state, payload) => {
                    state.recommend = payload;
                },
                set_hotGameList(state, data) {
                    state.hotGameList = data;
                },
                set_curEgameList(state, data) { // 当前电子游戏
                    state.curEgameList = data;
                },
                set_searchGameList(state, data) { // 搜索游戏
                    state.searchGameList = data;
                },
                set_searchArr(state, data) { // 搜索列表
                    state.searchArr = data;
                },
                set_gameLineArr(state, data) { // 获取第三方线路
                    state.gameLineArr = data;
                },
                set_isReqGameList(state, data) { // 游戏列表是否请示完
                    state.isReqGameList = data;
                },
            },
            actions: {
                async getTableList({dispatch, getters, state}) {
                    let resBack;
                    try {
                        /**
                         * await：es6语法 同步操作
                         * formApi: 接口名称
                         * body: 接口请求参数
                         */
                        _this.$store.commit("gameStore/set_isReq", false)
                        _this.$store.commit('homeGameStore/set_isReqGameList', false) // 游戏列表是否请示完
                        resBack = await dispatch('tableResult/getTableList', {
                            formApi: toEGameList,
                            body: getters.getFormName
                        });
                        _this.$store.commit('homeGameStore/set_isReqGameList', true) // 游戏列表是否请示完
                        _this.$store.commit("gameStore/set_isReq", true)
                        return resBack;
                    } catch (err) {
                        return Promise.reject(err);
                    }
                },
                async hotGame({commit}, data) { // 首页热门游戏
                    try {
                        let res = await homeBanner(data)
                        if (res && res.success) {
                            _this.$store.commit('homeGameStore/set_hotGameList', res.data) // hotGameList列表
                        } else {
                            window.win.tips.warning(res.msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                async toEGameList({commit}, data) { // 进入电子大厅
                    try {
                        let res = await toEGameList(data)
                        if (res && res.success) {
                            if (!data.name) {
                                _this.$store.commit('homeGameStore/set_curEgameList', res.data.records) // 当前电子游戏
                            } else {
                                _this.$store.commit('homeGameStore/set_searchGameList', res.data.records) // 当前搜索电子游戏
                            }
                        } else {
                            window.win.tips.warning(res.msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                async loveGames({commit}, data) { // 收藏游戏
                    try {
                        let res = await loveGames(data)
                        if (res && res.success) {
                            // let s = '收藏成功'
                            // if(!data.opFlag) {
                            //   s = '取消收藏成功'
                            // }
                            // window.win.tips.success(s);
                            // _this.$store.commit('homeGameStore/loveGames',res.data.records) // 收藏游戏
                        } else {
                            window.win.tips.warning(res.msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                async getGamelines({commit}, data) { // 获取第三方大厅
                    try {
                        let res = await getGamelines(data)
                        if (res && res.success) {
                            _this.$store.commit('homeGameStore/set_gameLineArr', res.data) // 当前电子游戏
                        } else {
                            window.win.tips.warning(res.msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                }
            },
            modules: { // 嵌套模块
                tableResult // 进一步嵌套命名空间
            }
        })
    },
    uninstall() {
        _this.$store.unregisterModule(['homeGameStore'])
    }
};

export default homeGameStore;
