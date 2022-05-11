import {
    getAddressesLimitNumber,
    getDeliveryAddresses,
    addAddresses,
    updateAddresses,
    getProvicesOrCities,
} from "@/store/comstore/api/apiConfig.js";
import store from '@/store/Store';
//import { validateObj } from '@/utils/validate';
// 公共数据字段
const commonData = () => ({
    commonData: {}
});

const addressManagerStore = {
    install() {
        store.registerModule(['addressManagerStore'], {
            namespaced: true,
            state: {
                // 公共数据字段
                ...commonData(),
                maxNumber: '',
                addressList: [],
                cityList: [],
                status: '1',//当前状态 1, list 2. form add
            },
            getters: {

                getBaseInfoData(state) {
                    return {}
                }
            },
            mutations: {
                SET_ADDRESS_MAX(state, data) {
                    state.maxNumber = data;
                },
                SET_LIST(state, data) {
                    state.addressList = data;
                },
                SET_CITYLIST(state, data) {
                    state.cityList = data;
                },
                SET_STATUS(state, data) {
                    state.status = data;
                },
            },
            actions: {
                // 获取银行最多数量
                async getAddressesLimitNumberAction({commit}, data) {

                    try {
                        let res = await getAddressesLimitNumber(data)
                        if (res && res.success) {
                            commit('SET_ADDRESS_MAX', res.data.limitCount)
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                // 地址列表
                async getDeliveryAddressesAction({commit}, data) {
                    try {
                        let res = await getDeliveryAddresses(data)
                        if (res && res.success) {
                            commit('SET_STATUS', 1)
                            commit('SET_LIST', res.data)
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                // 新增
                async addAddressesAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await addAddresses(data)
                        if (res && res.success) {
                            dispatch('getDeliveryAddressesAction')
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
                // 更新
                async updateAddressesAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await updateAddresses(data)
                        if (res && res.success) {
                            dispatch('getDeliveryAddressesAction')
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
                // 获取省市
                async getProvicesOrCitiesAction({commit}, data) {
                    try {
                        let res = await getProvicesOrCities(data)
                        if (res && res.success) {
                            commit('SET_CITYLIST', res.data)
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },

            },
            modules: {}
        })
    },
    uninstall() {
        store.unregisterModule(['addressManagerStore'])
    }
};

export default addressManagerStore;
