import {getTemp} from "@/store/comstore/api/apiConfig.js";
import store from '@/store/Store';
//import { validateObj } from '@/utils/validate';
// 公共数据字段
const commonData = () => ({
    commonData: {}
});

const baseInfoStore = {
    install() {
        store.registerModule(['baseInfoStore'], {
            namespaced: true,
            state: {
                // 公共数据字段
                ...commonData(),
                test: '',
            },
            getters: {

                getBaseInfoData(state) {
                    return {}
                }
            },
            mutations: {
                // test
                SET_TEST(state, data) {
                    state.test = data;
                },
            },
            actions: {
                // async getTemp({commit}, data) {
                //   try {
                //     let res = await getTemp(data)
                //     if(res && !res.success) {
                //       window.win.tips.warning(res.msg);
                //     }
                //     return res
                //   } catch (err) {
                //     return err;
                //   }
                // }
            },
            modules: {}
        })
    },
    uninstall() {
        store.unregisterModule(['baseInfoStore'])
    }
};

export default baseInfoStore;
