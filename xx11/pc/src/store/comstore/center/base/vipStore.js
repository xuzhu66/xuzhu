import {vipChangeRule} from "@/store/comstore/api/apiConfig";

const vipStore = {
    install(_this) {
        _this.$store.registerModule(['vipStore'], {
            namespaced: true,
            state: {
                viprt: [],
                viplow: [], // vip等级
            },
            mutations: {
                set_viprt(state, data) { // vip等级
                    state.viprt = data;
                },
                set_viplow(state, data) { // vip等级
                    state.viplow = data;
                },
            },
            actions: {
                async vipChangeRule({commit}, data) { // vip等级
                    try {
                        let res = await vipChangeRule(data)
                        if (res && res.success) {
                            commit('set_viprt', res.data.upgrade)
                            commit('set_viplow', res.data.downgrade)
                        } else {
                            if (res.code != 10001) {
                                window.win.tips.warning(res.msg);
                            }
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                }
            }
        })
    },
    uninstall(_this) {
        _this.$store.unregisterModule(['vipStore'])
    }
};

export default vipStore;
