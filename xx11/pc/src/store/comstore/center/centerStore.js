import {
    getUserInfo,// 用户信息
    getAssets,//资产总览
    turnInAllwallet,// 一键回收
    transferAllSubmit,// 一键转入
    setPersonInfo, //更新会员资料
    getAppDownLoad,// app下载
    getEasyUserInfo,// 个人信息-简易资料-中心钱包
    getLineBalance,// 获取线路余额
} from "@/store/comstore/api/apiConfig.js";
import store from '@/store/Store';

// 公共数据字段
const commonData = () => ({
    commonData: {}
});

const centerStore = {
    install(_this) {
        store.registerModule(['centerStore'], {
            namespaced: true,
            state: {
                // 公共数据字段
                ...commonData(),
                userInfo: {},
                easyUserInfo: {},// 简易用户信息
                centerWallet: '',//中心钱包余额
                currtLineWallet: '',// 当前线路钱包余额
                wallet: {},
                // app 信息
                app: "",
                getass: true, // 请求是否完成

            },
            getters: {},
            mutations: {
                // 设置用户对象
                SET_USERINFO(state, data) {
                    state.userInfo = data;
                },
                // 设置 资金对象
                SET_ASSETS(state, data) {
                    state.wallet = data;
                },
                // 设置app对象
                SET_APP(state, data) {
                    state.app = data;
                },
                SET_GETASS(state, data) {
                    state.getass = data; // 请求是否完成
                },
                // 设置用户简易信息
                SET_EASY_USER_INFO(state, data) {
                    state.easyUserInfo = data;
                    state.centerWallet = data.balance;// 中心钱包余额
                },
                // 设置当前线路额度
                SET_CURRT_LINE_BALANCE(state, data) {
                    state.currtLineWallet = data;
                },

            },
            actions: {
                // 查询用户信息
                async getUserInfoAction({commit}, data) {
                    let param = {
                        time: new Date().getTime()
                    }
                    try {
                        let res = await getUserInfo(param)
                        if (res && res.success) {
                            commit('SET_USERINFO', res.data)
                        } else {
                            let outCodeArr = [10001, 10002, 10003, 10004, 10005, 401, 10006]; // 未登入
                            if (!outCodeArr.includes(res.code)) {
                                let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                                window.win.tips.warning(msg);
                            }
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                // 更新用户信息
                async updateUserInfoAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await setPersonInfo(data)
                        if (res && res.success) {

                            // dispatch('getUserInfoAction')
                            window.win.tips.toast("更新成功!");



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
                // 资产总览
                async getAssetsAction({commit, state}, data) {
                    try {
                        // window.win.myloading.show()
                        //if(!state.getass) return
                        //commit('SET_GETASS', false)
                        let res = await getAssets(data)
                        //commit('SET_GETASS', true)
                        if (res && res.success) {
                            commit('SET_ASSETS', res.data)
                            // 同步中心钱包
                            commit('set_centerBalance', res.data.balance, {root: true});
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            if (msg.indexOf('重复提交') == -1) {
                                window.win.tips.warning(msg);
                            }
                        }
                        window.win.myloading.hidden()
                        return res
                    } catch (err) {
                        window.win.myloading.hidden()
                        return err;
                    }
                },
                // 资产总览-安全
                async getAssetsSafeAction({commit, state}, data) {
                    try {
                        let res = await getAssets(data)
                        if (res && res.success) {
                            commit('SET_ASSETS', res.data)
                            // 同步中心钱包
                            commit('set_centerBalance', res.data.balance, {root: true});
                        } else {
                            // 如果有异常的话,触发轮序机制;
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                // 一键回收
                async turnInAllwalletAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        //document.getElementsByClassName("load-f")[0].textContent = "正在回收"
                        let res = await turnInAllwallet(data)
                        if (res && res.success) {
                            dispatch('getAssetsAction');
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
                // 一键转入
                async transferAllSubmitAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        //document.getElementsByClassName("load-f")[0].textContent = "正在转入"
                        let res = await transferAllSubmit(data)
                        if (res && res.success) {
                            dispatch('getAssetsAction');
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
                // app下载
                async getAppDownLoadAction({commit, dispatch}, data) {
                    try {
                        // window.win.myloading.show()
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
                // 获取线路余额
                async getLineBalanceAction({commit,dispatch, state}, data) {
                    try {
                        let res = await getEasyUserInfo(data)
                        if (res && res.success) {
                            commit('SET_CURRT_LINE_BALANCE', res.data)
                            // this.$set(this.userInfo, 'type', res.data.type)
                            // dispatch('getUserInfoAction')
                        } else {

                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
            },
            modules: {}
        })
    },
    uninstall() {
        store.unregisterModule(['centerStore'])
    }
};

export default centerStore;
