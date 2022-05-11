import {
    activityViwe,
    cancelDeposit,
    getBankTransferDetail,
    getTransactionsList,
    getTransactionsAmountApi,
} from "@/store/comstore/api/apiConfig.js";
import store from '@/store/Store';

// 公共数据字段
const commonData = () => ({
    commonData: {}
});

const capitalRecordStore = {
    install() {
        store.registerModule(['capitalRecordStore'], {
            namespaced: true,
            state: {
                // 公共数据字段
                ...commonData(),
                // 列表数据
                tableList: "",
                tableListData: {},
                // 银行卡转账详情
                bankTransferDetail: "",

                activTit: "",  // 文章标题
                activCon: "", // 文章内容
                preTypeList: "", // 活动类型
                preList: "", // 活动列表
                // 活动标题
                activityTitle: '',
                // 活动内容
                activitContent: '',
                // 统计金额
                transferMoney: '',
                // 统计金额对象
                transferObj:'',
            },
            getters: {},
            mutations: {
                SET_TABLELIST(state, data) {
                    state.tableList = data;
                },
                SET_TABLELIST_DATA(state, data) {
                    state.tableListData = data;
                },
                SET_BANK_DETAIL(state, data) {
                    state.bankTransferDetail = data;
                },
                SET_ACTIVITY_TITLE(state, data) {
                    state.activityTitle = data;
                },
                SET_ACTIVITY_CONTENT(state, data) {
                    state.activitContent = data;
                },
                SET_TRANSFER_MONEY(state, data) {
                    state.transferMoney = data;
                },
                SET_TRANSFER_OBJ(state, data) {
                    state.transferObj = data;
                },


            },
            actions: {
                //  交易记录
                async getTransactionsListAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await getTransactionsList(data)
                        if (res && res.success) {
                            commit('SET_TABLELIST', res.data.records)
                            commit('SET_TABLELIST_DATA', res.data)
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
                // 银行卡转账详情
                async getBankTransferDetailAction({commit, dispatch}, data) {
                    try {
                        let res = await getBankTransferDetail(data)
                        if (res && res.success) {
                            commit('SET_BANK_DETAIL', res.data)
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                // 取消订单
                async cancelDepositAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await cancelDeposit(data.oprm)
                        if (res && res.success) {
                            window.win.tips.success(res.msg);
                            //dispatch('getTransactionsListAction',data.sprm)
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
                // 优惠详情
                async activityDetailAction({commit}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await activityViwe(data)
                        if (res && res.success) {
                            commit('SET_ACTIVITY_TITLE', res.data.name) // 文章标题
                            commit('SET_ACTIVITY_CONTENT', res.data.content) // 文章内容
                        } else {
                            window.win.tips.warning(res.msg);
                        }
                        window.win.myloading.hidden()
                        return res
                    } catch (err) {
                        window.win.myloading.hidden()
                        return err;
                    }
                },
                // 统计金额
                async getTransactionsAmountAction({commit}, data) {
                    try {
                        let res = await getTransactionsAmountApi(data)
                        if (res && res.success) {
                            commit('SET_TRANSFER_MONEY', res.data.sumAmount) //统计金额
                            commit('SET_TRANSFER_OBJ', res.data) //统计金额对象
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
        store.unregisterModule(['capitalRecordStore'])
    }
};

export default capitalRecordStore;
