const sendMsgStore = {
    install(_this) {
        _this.$store.registerModule(['sendMsgStore'], {
            namespaced: true,
            state: {
                vcFirst: false,  // 无防水墻验证码
                vcSecond: false, // 有防水墻验证码
                picCodeCheck: '', // 0 表示不需要图形验证码, 1 表示需要图形验证码, 2 发送短信成功
            },
            mutations: {
                SET_VCFIRST: (state, payload) => {
                    state.vcFirst = payload;
                },
                SET_VCSECOND: (state, payload) => {
                    state.vcSecond = payload;
                },
                SET_PICCODE_CHECK: (state, data) => {
                    state.picCodeCheck = data;
                },
            },
            actions: {
                getVCFirst({commit}, payload) {
                    commit('SET_VCFIRST', payload)
                },
                getVCSecond({commit}, payload) {
                    commit('SET_VCSECOND', payload)
                },
                resetParam({commit}, payload) {

                },
                setPicCodeCheck({commit}, data) {
                    commit('SET_PICCODE_CHECK', data)
                }
            }
        })
    },
    uninstall(_this) {
        _this.$store.unregisterModule(['sendMsgStore'])
    }
};
export default sendMsgStore;
