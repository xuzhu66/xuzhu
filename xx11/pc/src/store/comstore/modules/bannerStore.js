import store from '@/store/Store';
import {getBannerList} from "@/store/template2/apiConfig";

const bannerStore = {
    install() {
        store.registerModule(['bannerStore'], {
            namespaced: true,
            state: {
                bannerList: [],  // banner list
                // 0 首页 1 真人娱乐 2 棋牌游戏 3 电子游戏 4 捕鱼游戏 5 彩票投注 6 电子竞技 7 体育投注 8 优惠活动
                bannerList0: [],  //
                bannerList1: [],  //
                bannerList2: [],  //
                bannerList3: [],  //
                bannerList4: [],  //
                bannerList5: [],  //
                bannerList6: [],  //
                bannerList7: [],  //
                bannerList8: [],  //
                firstResetFlag: true, // 是否是第一次重置轮播状态;
            },
            mutations: {
                SET_BANNERLIST(state, data) {
                    state.bannerList = data;
                },
                SET_BANNERLIST_DYNAMIC(state, res) {
                    // 动态设置不同页面的bannerlist
                    let num = "bannerList" + res.seatType;
                    state[num] = res.data;
                },
                // 重置组件轮播图片的状态,解决图片半截的问题;
                SET_FIRST_RESETFLAG(state, data) {
                    state.firstResetFlag = data;
                }
            },
            actions: {
                // 获取banner公共方法
                async getBannerListAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await getBannerList(data)
                        if (res && res.success) {
                            res.seatType = data.seatType
                            commit('SET_BANNERLIST_DYNAMIC', res);
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

            }
        })
    },
    uninstall() {
        store.unregisterModule(['bannerStore'])
    }
};

export default bannerStore;
