import {
    getMsgList
} from "@/store/comstore/api/apiConfig.js";
import store from '@/store/Store';

// 公共数据字段
const commonData = () => ({
    commonData: {}
});

const messageStore = {
    install() {
        store.registerModule(['messageStore'], {
            namespaced: true,
            state: {
                // 公共数据字段
                ...commonData(),
                // 列表数据
                tableList: [],
                tableListData: {}
            },
            getters: {},
            mutations: {
                SET_TABLELIST(state, data) {
                    state.tableList = data;
                },
                SET_TABLELIST_DATA(state, data) {
                    state.tableListData = data;
                },
            },
            actions: {
                // 消息记录列表
                async getMsgListAction({commit, dispatch}, data) {
                    try {
                        //window.win.myloading.show()
                        let res = await getMsgList(data)
                        if (res && res.success) {
                            commit('SET_TABLELIST', res.data.records)
                            commit('SET_TABLELIST_DATA', res.data)
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
                        }
                        //window.win.myloading.hidden()
                        return res
                    } catch (err) {
                        //window.win.myloading.hidden()
                        return err;
                    }
                },
            },
            modules: {}
        })
    },
    uninstall() {
        store.unregisterModule(['messageStore'])
    }
};

export default messageStore;
