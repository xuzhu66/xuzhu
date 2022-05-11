import {homeBanner} from "@/store/comstore/api/apiConfig";
import store from '@/store/Store';

const bannerStore = {
    install() {
        store.registerModule(['bannerStore'], {
            namespaced: true,
            state: {
                bannerList: [],  // 首页banner
                eGamebannerList: [],  // 电子游戏banner
                preBannerList: [],  // 优惠活动banner
            },
            mutations: {
                set_bannerList(state, data) {
                    state.bannerList = data;
                },
                set_eGamebannerList(state, data) { // 电子游戏banner
                    state.eGamebannerList = data;
                },
                set_preBannerList(state, data) { // 优惠活动banner
                    state.preBannerList = data;
                },
            },
            actions: {
                async homeBanner({commit}, data) {
                    try {
                        let res = await homeBanner(data)
                        if (res && res.success) {
                            store.commit('bannerStore/set_bannerList', res.data) // banner列表

                            // if(data.seatType==0) {
                            //   store.commit('bannerStore/set_bannerList',res.data) // banner列表
                            // }
                            if(data.seatType==3) {
                              store.commit('bannerStore/set_eGamebannerList',res.data) // 电子游戏banner
                            }
                            if (data.seatType == 8) {
                                store.commit('bannerStore/set_preBannerList', res.data) // 优惠活动
                            }

                        } else {
                            window.win.tips.warning(res.msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                }
            }
        })
    },
    uninstall() {
        store.unregisterModule(['bannerStore'])
    }
};

export default bannerStore;
