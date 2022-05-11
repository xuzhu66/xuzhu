import {updateMobile} from "@/store/comstore/api/apiConfig.js";
import store from '@/store/Store';
// 公共数据字段
const commonData = () => ({
    commonData: {}
});

const telephoneStore = {
    install() {
        store.registerModule(['telephoneStore'], {
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

                async setPhoneAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await updateMobile(data)
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
            },
            modules: {}
        })
    },
    uninstall() {
        store.unregisterModule(['telephoneStore'])
    }
};

export default telephoneStore;
