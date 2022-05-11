import {
    getPersonalAmountDetail,// 个人资金明细查询
} from "@/store/comstore/api/apiConfig.js";
import store from '@/store/Store';

// 公共数据字段
const commonData = () => ({
    commonData: {}
});

const assetsOverviewStore = {
    install() {
        store.registerModule(['assetsOverviewStore'], {
            namespaced: true,
            state: {
                // 公共数据字段
                ...commonData(),
                amountDetail: {},
            },
            getters: {},
            mutations: {
                SET_AMOUNT_DETAIL(state, data) {
                    state.amountDetail = data;
                },
            },
            actions: {
                // 个人资金明细查询 timeFlag: 时间标签：1表示今天，2表示3天内，3表示一周内，4表示一个月内
                async getPersonalAmountDetailAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await getPersonalAmountDetail(data)
                        if (res && res.success) {
                            commit('SET_AMOUNT_DETAIL', res.data)
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
            },
            modules: {}
        })
    },
    uninstall() {
        store.unregisterModule(['assetsOverviewStore'])
    }
};

export default assetsOverviewStore;
