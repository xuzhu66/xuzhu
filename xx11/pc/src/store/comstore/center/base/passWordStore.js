import {
    setLoginPwd,
    setDrawPwd
} from "@/store/comstore/api/apiConfig.js";
import store from '@/store/Store';

// 公共数据字段
const commonData = () => ({
    commonData: {}
});

const passWordStore = {
    install() {
        store.registerModule(['passWordStore'], {
            namespaced: true,
            state: {
                // 公共数据字段
                ...commonData(),
                test: '',
            },
            getters: {},
            mutations: {
                // test
                SET_TEST(state, data) {
                    state.test = data;
                },
            },
            actions: {
                //设置登录密码
                async setLoginPwdAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await setLoginPwd(data)
                        if (res && res.success) {
                            window.win.tips.warning(res.msg);
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

                //设置提款密码
                async setDrawPwdAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await setDrawPwd(data)
                        if (res && res.success) {
                            window.win.tips.warning(res.msg);
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
        store.unregisterModule(['passWordStore'])
    }
};

export default passWordStore;
