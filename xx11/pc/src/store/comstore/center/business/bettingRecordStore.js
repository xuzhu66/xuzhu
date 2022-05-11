import {
    getBettingLine,
    getBettingList,
    getBettingAmount
} from "@/store/comstore/api/apiConfig.js";
import store from '@/store/Store';

// 公共数据字段
const commonData = () => ({
    commonData: {}
});

const bettingRecordStore = {
    install() {
        store.registerModule(['bettingRecordStore'], {
            namespaced: true,
            state: {
                // 公共数据字段
                ...commonData(),
                // 列表数据
                tableList: [],
                // 列表数据
                tableListData: {},
                // 线路
                bettingLine: [],
                //统计
                amount: '',
            },
            getters: {},
            mutations: {
                SET_TABLELIST(state, data) {
                    // 遍历生成缩略的文字; 控制在27个字符
                    if (data && data.length >= 0) {
                        data.forEach(item => {
                            if (item.betContent && item.betContent.length >= 27) {
                                item.betContent1 = item.betContent.substr(0, 26) + "...";
                            } else {
                                item.betContent1 = item.betContent.substr(0, 27);
                            }
                        })
                    }

                    state.tableList = data;
                },
                SET_TABLELIST_DATA(state, data) {
                    state.tableListData = data;
                },
                SET_BETTING_LINE(state, data) {
                    state.bettingLine = data;
                },
                SET_AMOUNT(state, data) {
                    state.amount = data;
                },
            },
            actions: {
                //  注单线路
                async getBettingLineAction({commit, dispatch}, data) {
                    try {
                        let res = await getBettingLine(data)
                        if (res && res.success) {
                            commit('SET_BETTING_LINE', res.data)
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                //  投注记录
                async getBettingListAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await getBettingList(data)
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
                //  投注记录总计
                async getBettingAmountAction({commit, dispatch}, data) {
                    try {
                        let res = await getBettingAmount(data)
                        if (res && res.success) {
                            commit('SET_AMOUNT', res.data)
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
        store.unregisterModule(['bettingRecordStore'])
    }
};

export default bettingRecordStore;
