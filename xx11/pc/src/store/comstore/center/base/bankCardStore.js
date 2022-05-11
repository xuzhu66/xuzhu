import {
    getBankInfo,
    addBank,
    updateBank,
    getBankDetail,
    getBankLimitNumber,
    getProvicesOrCities,
    checkBankCardApi,
    getvirAcountList,
    findUsdtProto,
    addvirAcount,
    updateVirAcount,
    getUsdtLimitNumber
} from "@/store/comstore/api/apiConfig.js";
import store from '@/store/Store';
//import { validateObj } from '@/utils/validate';
// 公共数据字段
const commonData = () => ({
    commonData: {}
});

const bankCardStore = {
    install() {
        store.registerModule(['bankCardStore'], {
            namespaced: true,
            state: {
                // 公共数据字段
                ...commonData(),
                bankList: [],
                usdtList:[],
                bankInfo: {},
                cardList: [],
                cardMaxNumber: 0,
                cityList: [],
                status: '2',//当前状态 1, add 2. list
                usdtStatus: '2',//当前状态 1, add 2. list
                usdtProto: [], // 虚拟币及协议
                curProtoList:{},  // 当前协议
                curVir: '', // 当前币种
                curProto:{}, // 当前选中协议
                usdtMaxNumber: 0,
            },
            getters: {
                getBaseInfoData(state) {
                    return {
                        cardNo: '',//银行卡号
                        bankName: '',//银行名称
                        bankId: '',//银行id
                        province: '',//省名称
                        city: '',//市名称
                        address: '',//支行名称
                        accountName: '',//开户名
                        defaultable: false,//是否市默认银行卡，true表示是，false表示不是
                        cityId: '',// 市id
                        provinceId: '',//省id
                    }
                }
            },
            mutations: {
                SET_BANKLIST(state, data) {
                    state.bankList = data;
                },
                SET_USDTLIST(state, data) {
                    state.usdtList = data;
                },
                SET_CARDLIST(state, data) {
                    state.cardList = data;
                },
                SET_CARD_MAX(state, data) {
                    state.cardMaxNumber = data;
                },
                SET_CITYLIST(state, data) {
                    state.cityList = data;
                },
                SET_BANKINFO(state, data) {
                    state.bankInfo = data;
                },
                SET_STATUS(state, data) {
                    state.status = data;
                },
                SET_USDTSTATUS(state, data) {
                    state.usdtStatus = data;
                },
                SET_USDTPROTO(state, data) {
                    state.usdtProto = data;
                },
                SET_CURPROTOLIST(state, data) {
                    state.curProtoList = data;
                },
                SET_CURVIR(state, data) {
                    state.curVir = data;
                },
                SET_CURPROTO(state, data) {
                    state.curProto = data;
                },
                SET_USDT_MAX(state, data) {
                    state.usdtMaxNumber = data;
                },

            },
            actions: {
                // 获取银行列表
                async getBankListAction({commit}, data) {
                    try {
                        let res = await getBankInfo(data)
                        if (res && res.success) {

                            commit('SET_BANKLIST', res.data)
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                // 获取银行卡列表
                async getCardListAction({commit}, data) {
                    try {
                        let res = await getBankDetail(data)
                        if (res && res.success) {
                            commit('SET_STATUS', 2)
                            commit('SET_CARDLIST', res.data)
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            if(msg != '结果未返回，请勿重复提交') {
                                window.win.tips.warning(msg);
                            }
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                // 获取银行最多数量
                async getCardMaxNumberAction({commit}, data) {

                    try {
                        let res = await getBankLimitNumber(data)
                        if (res && res.success) {
                            commit('SET_CARD_MAX', res.data.limitCount)
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                // 获取省市
                async getProvicesOrCitiesAction({commit}, data) {
                    try {
                        let res = await getProvicesOrCities(data)
                        if (res && res.success) {
                            commit('SET_CITYLIST', res.data)
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                // add card
                async addCardAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await addBank(data)
                        if (res && res.success) {
                            window.win.tips.success(res.msg);
                            dispatch('getCardListAction')
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
                // update card
                async updateCardAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await updateBank(data)
                        if (res && res.success) {
                            window.win.tips.success(res.msg);
                            dispatch('getCardListAction')
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
                // check card
                async checkCardAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await checkBankCardApi(data)
                        if (res && res.success) {
                            window.win.tips.success(res.msg);
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
                async getvirAcountList({commit, dispatch}, data) {
                    try {
                        let res = await getvirAcountList(data)
                        if (res && res.success) {
                            commit('SET_USDTSTATUS', 2)
                            commit('SET_USDTLIST', res.data);
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
                async getUsdtProto({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await findUsdtProto(data)
                        if (res && res.success) {
                            commit('SET_USDTPROTO', res.data.records);
                            commit('SET_CURPROTOLIST', res.data.records[0]);
                            commit('SET_CURVIR', res.data.records[0].vircurrency);
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
                // 新增虚拟币
                async addvirAcount({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await addvirAcount(data)
                        if (res && res.success) {
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
                async updateVirAcount({commit, dispatch}, data) {
                    try {
                        let res = await updateVirAcount(data)
                        if (res && res.success) {
                            // dispatch('getvirAcountList')
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                     // 获取虚拟币最多数量
                async getUsdtMaxNumberAction({commit}, data) {
                    try {
                        let res = await getUsdtLimitNumber(data)
                        if (res && res.success) {
                            commit('SET_USDT_MAX', res.data.limitCount)
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
        store.unregisterModule(['bankCardStore'])
    }
};

export default bankCardStore;
