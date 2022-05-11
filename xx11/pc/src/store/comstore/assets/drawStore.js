import {
    setDrawPwd,
    getBankCards,
    withdrawRuler,
    withdrawalVerif,
    drawSubmit,
    withdrawalInfo,
    findUsdtProto,
    getVirBankList,
    getVirRate,
    virWithdrawal,
    getDrawingBtnsShow,
    getChargeConfigApi,
    getDrawOrderListApi,
    getWithdrawProgressApi,
    getOrderMsgApi
} from "@/store/comstore/api/apiConfig.js";
import store from '@/store/Store';

// 公共数据字段
const commonData = () => ({
    commonData: {}
});

const drawStore = {
    install() {
        store.registerModule(['drawStore'], {
            namespaced: true,
            state: {
                // 公共数据字段
                ...commonData(),
                bankCardList: [],
                drawLimtObj: '',
                drawMax: 10000,// 单笔最高限额
                drawMin: 0,// 单笔最低限额
                n: 0, // 第几次显示
                checkCode: '', //检查错误码
                showJumpDialog: { //是否显示前置弹窗
                    display: false,
                    type: 1
                },
                showInfoDialog: false, // 完善取款信息
                showUsdtDialog: false, // 完善usdt信息
                usdtProto: [], // 虚拟币及协议
                curProtoList: {},  // 当前协议
                // curVir:'', // 当前选中虚拟币
                curProto: {}, // 当前选中协议
                virBankList: [], // 虚拟币列表
                curVirBankAddress: {}, // 选中虚拟币地址
                virRate: [], // 虚拟币汇率
                currencyType: [],// 当前取款类型
                drawOrderList: '',//取款订单进度对象
            },
            getters: {},
            mutations: {
                SET_BANKCARDLIST(state, data) {
                    state.bankCardList = data;
                },
                SET_DRAWLIMTOBJ(state, data) {
                    state.drawLimtObj = data
                },
                SET_DRAWMAX(state, data) {
                    state.drawMax = data
                },
                SET_DRAWMIN(state, data) {
                    state.drawMin = data
                },
                set_n(state, data) { // 第几次显示
                    state.n = data;
                },
                SET_CHECKCODE(state, data) {
                    state.checkCode = data;
                },
                // 这个弃用了
                SET_SHOW_JUMP_DIALOG(state, data) {
                    //state.showJumpDialog = data;
                },
                SET_SHOW_INFO_DIALOG(state, data) {
                    state.showInfoDialog = data;
                },
                SET_SHOW_USDT_DIALOG(state, data) {
                    state.showUsdtDialog = data;
                },
                SET_USDTPROTO(state, data) {
                    state.usdtProto = data;
                },
                SET_CURPROTOLIST(state, data) {
                    state.curProtoList = data;
                },
                SET_CURPROTO(state, data) {
                    state.curProto = data;
                },
                SET_VIRBANKLIST(state, data) {
                    state.virBankList = data;
                },
                SET_CURVIRBANKADDRESS(state, data) {
                    state.curVirBankAddress = data;
                },
                SET_VIRRATE(state, data) {
                    state.virRate = data;
                },
                SET_CURRENCYTYPE(state, data) {
                    state.currencyType = data;
                },
                SET_DRAW_ORDER_LIST(state, data) {
                    state.drawOrderList = data;
                },

            },
            actions: {
                //设置提款密码
                async setDrawPwdAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await setDrawPwd(data)
                        if (res && res.success) {
                            window.win.tips.warning(res.msg);
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
                // 获取银行卡信息
                async getBankCardsAction({commit, dispatch}, data) {
                    try {
                        let res = await getBankCards(data)
                        if (res && res.success) {
                            commit('SET_BANKCARDLIST', res.data)
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                // 单笔最高限额
                async getWithdrawRulerAction({commit, dispatch}, data) {
                    try {
                        let res = await withdrawRuler(data)
                        if (res && res.success) {
                            commit('SET_DRAWLIMTOBJ', res.data)
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                // 提款校验
                async withdrawalVerifAction({commit, state}, data) {
                    try {
                        let res = await withdrawalVerif();
                        return res;
                    } catch (err) {
                        return err;
                    }
                },
                // 提款校验dialog
                async checkDrawAction({commit, state}, data) {
                    try {
                        let res = await withdrawalVerif();
                        // 保存 checkFlag & 修改弹框状态
                        if (res && res.success) {
                            commit('SET_CHECKCODE', "");
                            commit('SET_SHOW_JUMP_DIALOG', false);
                        } else {
                            commit('SET_CHECKCODE', res.code);
                            // 判断有没有登录
                            if (window.win.store.state.token) {
                                commit('SET_SHOW_JUMP_DIALOG', true);
                            }
                        }
                        return res;
                    } catch (err) {
                        return err;
                    }
                },
                // 提交取款
                async drawSubmitAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await drawSubmit(data)
                        if (res && res.success) {
                            //window.win.tips.success(res.msg);
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
                // 提款完善资料
                async withdrawalInfo({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await withdrawalInfo(data)
                        if (res && res.success) {
                            //window.win.tips.success(res.msg);
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
                // 获取虚拟币协议
                async getUsdtProto({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await findUsdtProto(data)
                        if (res && res.success) {
                            commit('SET_USDTPROTO', res.data.records);
                            commit('SET_CURPROTOLIST', res.data.records[0]);
                            commit('SET_CURPROTO', res.data.records[0].protocols[0]);

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
                // 获取虚拟币地址
                async getVirBankList({state, commit, dispatch}, data) {
                    try {
                        let res = await getVirBankList(data)
                        if (res && res.success) {
                            // 清空当前选中的地址
                            commit('SET_CURVIRBANKADDRESS', {});
                            commit('SET_VIRBANKLIST', res.data);
                            res.data.forEach((v, k) => {
                                if (v.defaultable) {
                                    commit('SET_CURVIRBANKADDRESS', v);
                                }
                            });
                            // 如果不存在则将第一个设置为默认的
                            if (state.curVirBankAddress && !state.curVirBankAddress.virAddress && res.data.length) {
                                commit('SET_CURVIRBANKADDRESS', res.data[0]);
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
                // 获取虚拟币协议
                async getVirRate({commit, dispatch}, data) {
                    try {
                        let res = await getVirRate(data)
                        if (res && res.success) {
                            commit('SET_VIRRATE', res.data.exChangeRate);
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                // 虚拟币存款
                async virWithdrawal({commit, dispatch}, data) {
                    try {
                        let res = await virWithdrawal(data)
                        if (res && res.success) {
                            // commit('SET_VIRRATE', res.data.exChangeRate);
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                // 当前取款类型
                async getCurrencyType({commit, dispatch}) {
                    try {
                        let res = await getDrawingBtnsShow()
                        if (res && res.success) {
                            commit('SET_CURRENCYTYPE', res.data);
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                // 获取取款配置
                async getChargeConfigAction({commit, dispatch}) {
                    try {
                        let res = await getChargeConfigApi()
                        if (res && res.success) {

                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                // 取款中的订单列表
                async getDrawOrderListAction({commit, dispatch}) {
                    try {
                        let res = await getDrawOrderListApi()
                        if (res && res.success) {

                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                // 查询最近3条提款进度及子弹详情
                async getWithdrawProgressAction({commit, dispatch}) {
                    try {
                        let res = await getWithdrawProgressApi()
                        if (res && res.success) {
                            commit('SET_DRAW_ORDER_LIST', res.data)
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                // 查询进行中的订单
                async getOrderMsgAction({commit, dispatch}) {
                    try {
                        let res = await getOrderMsgApi()
                        if (res && res.success) {

                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
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
        store.unregisterModule(['drawStore'])
    }
};

export default drawStore;
