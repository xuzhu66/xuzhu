import {
    getActivityAmount,
    getActivityList,
    activityViwe
} from "@/store/comstore/api/apiConfig.js";
import store from '@/store/Store';

// 公共数据字段
const commonData = () => ({
    commonData: {}
});

const discountRecordStore = {
    install() {
        store.registerModule(['discountRecordStore'], {
            namespaced: true,
            state: {
                // 公共数据字段
                ...commonData(),
                // 列表数据
                tableList: [],
                tableListData: {},
                amount: "",
                // 活动标题
                activityTitle: '',
                // 活动内容
                activitContent: '',
            },
            getters: {},
            mutations: {
                SET_TABLELIST(state, data) {
                    state.tableList = data;
                },
                SET_TABLELIST_DATA(state, data) {
                    state.tableListData = data;
                },
                SET_AMOUNT(state, data) {
                    state.amount = data;
                },
                SET_ACTIVITY_TITLE(state, data) {
                    state.activityTitle = data;
                },
                SET_ACTIVITY_CONTENT(state, data) {
                    state.activitContent = data;
                },
            },
            actions: {
                //  优惠记录
                async getActivityListAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await getActivityList(data)
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
                //  奖品总价值
                async getActivityAmountAction({commit, dispatch}, data) {
                    try {
                        let res = await getActivityAmount(data)
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
                // 获取活动详情
                async activityDetailAction({commit}, data) {
                    try {
                        let res = await activityViwe(data)
                        if (res && res.success) {
                            commit('SET_ACTIVITY_TITLE', res.data.name) // 文章标题
                            commit('SET_ACTIVITY_CONTENT', res.data.content) // 文章内容
                        } else {
                            window.win.tips.warning(res.msg);
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
        store.unregisterModule(['discountRecordStore'])
    }
};

export default discountRecordStore;
