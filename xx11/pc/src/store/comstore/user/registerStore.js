import {playerRegister} from "@/store/comstore/api/apiConfig";

const registerStore = {
    install(_this) {
        _this.$store.registerModule(['registerStore'], {
            namespaced: true,
            state: {
                curTemp: '', // 当前注册模板
            },
            mutations: {
                set_curTemp(state, data) { // 当前注册模板
                    state.curTemp = data;
                },
            },
            actions: {
                async playerRegister({commit,rootState}, data) {
                    try {
                        data.tid = rootState.uuid;
                        let res = await playerRegister(data)
                        if (res && !res.success) {
                            window.win.tips.warning(res.msg);
                            // window.win.mydialog.show({ con: res.msg, btnTextLeft: "确定" ,leftBut:false});
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
        _this.$store.unregisterModule(['registerStore'])
    }
};

export default registerStore;
