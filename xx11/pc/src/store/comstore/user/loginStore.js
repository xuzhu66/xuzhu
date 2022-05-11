import {checkAcount, updatePwd} from "@/store/comstore/api/apiConfig";

const loginStore = {
    install(_this) {
        _this.$store.registerModule(['loginStore'], {
            namespaced: true,
            state: {
                fPwdMobile: '' // 忘记密码的手机号
            },
            mutations: {
                set_fPwdMobile(state, data) { // 忘记密码的手机号
                    state.fPwdMobile = data;
                },
            },
            actions: {
                async checkAcount({commit}, data) {
                    try {
                        let res = await checkAcount(data)
                        if (res && !res.success) {
                            window.win.tips.warning(res.msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                async updatePwd({commit}, data) {
                    try {
                        let res = await updatePwd(data)
                        if (res && res.success) {
                            window.win.tips.toast("修改成功");
                        } else {
                            window.win.tips.warning(res.msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
            }
        })
    },
    uninstall(_this) {
        _this.$store.unregisterModule(['loginStore'])
    }
};

export default loginStore;
