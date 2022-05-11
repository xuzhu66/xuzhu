import {regBanner} from "@/store/comstore/api/apiConfig";

const loginRegStore = {
    install(_this) {
        _this.$store.registerModule(['loginRegStore'], {
            namespaced: true,
            state: {
                curTemp: 'login', // 当前模板
                showAgent: false, // 用户服务协议是否显示
                agentChecked: true, // 用户协义是否选中
                regBannerArr: [] // 登录注册banner
            },
            mutations: {
                set_curTemp(state, data) { // 当前模板
                    state.curTemp = data;
                },
                set_showAgent(state, data) { // 用户服务协议是否显示
                    state.showAgent = data;
                },
                set_agentChecked(state, data) { // 用户协义是否选中
                    state.agentChecked = data;
                },
                set_regBannerArr(state, data) { // 登录注册banner
                    state.regBannerArr = data;
                }
            },
            actions: {
                getButVerific({commit}, data) { // 按扭验证
                    let goBut = [],
                        rem = ""
                    Object.keys(data.reg).forEach((key, val) => {
                        if (data.reg[key].isPass) {
                            goBut.push(data.reg[key].isPass);
                        } else {
                            if (data.reg[key].rem != "") {
                                rem = data.reg[key].rem;
                            }
                        }
                    });
                    if (!data.checkSMS && data.reg.logVcode) { // 短信验证码
                        goBut.push(true)
                    }
                    if (goBut.length == Object.keys(data.reg).length) {
                        return {
                            pasVerif: true,
                            remark: rem
                        };
                    } else {
                        if (rem == "请阅读并同意《用户服务协议》") {
                            window.win.tips.warning(rem);
                        }
                        return {
                            pasVerif: false,
                            remark: rem
                        };
                    }
                },
                async regBanner({commit}, data) { // 登录注册banner
                    try {
                        let res = await regBanner(data)
                        if (res && res.success) {
                            commit('set_regBannerArr', res.data)
                        } else {
                            // window.win.tips.warning(res.msg);
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
        _this.$store.unregisterModule(['loginRegStore'])
    }
};

export default loginRegStore;
