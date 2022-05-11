import {
    getWashingList
} from "@/store/comstore/api/apiConfig.js";
import store from '@/store/Store';

// 公共数据字段
const commonData = () => ({
    commonData: {}
});

const washCodeRecordStore = {
    install() {
        store.registerModule(['washCodeRecordStore'], {
            namespaced: true,
            state: {
                // 公共数据字段
                ...commonData(),
                // 列表数据
                tableList: [],
                tableListData: {},
                sumAmount: "",
            },
            getters: {},
            mutations: {
                SET_TABLELIST(state, data) {
                    state.tableList = data;
                },
                SET_TABLELIST_DATA(state, data) {
                    state.tableListData = data;
                },
                SET_SUMAMOUNT(state, data) {
                    state.sumAmount = data;
                },
            },
            actions: {
                //  洗码记录
                async getWashingListAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await getWashingList(data)
                        if (res && res.success) {
                            commit('SET_TABLELIST', res.data.orderRebates);
                            commit('SET_TABLELIST_DATA', res.data);
                            commit('SET_SUMAMOUNT', res.data.sumAmount)
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
        store.unregisterModule(['washCodeRecordStore'])
    }
};

export default washCodeRecordStore;
