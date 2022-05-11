import {getBroadcastNotice, getPopNotice} from "@/store/comstore/api/apiConfig";
import store from '@/store/Store';

const noticeStore = {
    install() {
        store.registerModule(['noticeStore'], {
            namespaced: true,
            state: {
                homeNoticeList: [], // 轮播信息列表
                popNotice: [], // 弹出框消息列表
                isFirst: false // 是否第一次弹出
            },
            mutations: {
                set_NoticeList(state, data) {
                    state.homeNoticeList = data;
                },
                set_popNotice(state, data) {
                    state.popNotice = data;
                },
                set_isFirst(state, data) { // 是否第一次弹出
                    state.isFirst = data;
                },
            },
            actions: {
                //获取信息轮播列表
                async getHomeNotice({commit}, data) {
                    try {
                        let res = await getBroadcastNotice(data)
                        if (res && res.success) {
                            commit('set_NoticeList', res.data) // 轮播信息列表
                        } else {
                            window.win.tips.warning(res.msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                async getPopNotice({commit}, data) { // 弹出框消息列表
                    try {
                        let res = await getPopNotice(data)
                        if (res && res.success) {
                            store.commit('noticeStore/set_popNotice', res.data[0]) // 弹出框消息列表
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
        store.unregisterModule(['noticeStore'])
    }
};

export default noticeStore;
