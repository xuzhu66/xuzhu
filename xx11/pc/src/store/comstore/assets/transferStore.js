import {
    getLineList,
    transferSubmit
} from "@/store/comstore/api/apiConfig.js";
import store from '@/store/Store';

// 公共数据字段
const commonData = () => ({
    commonData: {}
});

const transferStore = {
    install() {
        store.registerModule(['transferStore'], {
            namespaced: true,
            state: {
                // 公共数据字段
                ...commonData(),
                lineList: []
            },
            getters: {},
            mutations: {
                SET_LINELIST(state, data) {
                    state.lineList = data;
                },
            },
            actions: {
                // 线路
                async getLineListAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await getLineList(data)
                        if (res && res.success) {
                            commit("SET_LINELIST", res.data);
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
                // 转账
                async transferSubmitAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await transferSubmit(data)
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
            },
            modules: {}
        })
    },
    uninstall() {
        store.unregisterModule(['transferStore'])
    }
};

export default transferStore;
