import {
    cancelDeposit,
    depositSubmit,
    getDepositListApi,
    getDescountListInDepositPageApi,
    getProtocolListApi,
    virtualSubmitApi,
    getVirtualDetailApi,
    getDepositTypeApi, getBankTransferDetail,
    getddpAddresssApi
} from "@/store/comstore/api/apiConfig.js";
import store from '@/store/Store';

// 公共数据字段
const commonData = () => ({
    commonData: {}
});

const depositStore = {
    install() {
        store.registerModule(['depositStore'], {
            namespaced: true,
            state: {
                // 公共数据字段
                ...commonData(),
                depositType: '', // 支付类型
                depositList: [], // 支付方式
                discountList: '', // 优惠活动列表
                discountItem: '', //
                protocolList: '',//协议数组
                virtualDetail: '',// 虚拟币订单详情
                exchangeRate: '', //汇率
                currtDepositType: '', // 当前支付类型
                showIcon:true, // 是否显示活动图标
                bankDetail: '',
                ddpaLinkUrl: '', // ddpay 链接
            },
            getters: {},
            mutations: {
                SET_DEPOSIT_LIST(state, data) {
                    state.depositList = data;
                },
                SET_DEPOSIT_TYPE(state, data) {
                    state.depositType = data;
                },
                SET_CURRT_DEPOSIT_TYPE(state, data) {
                    state.currtDepositType = data;
                },
                SET_DISCOUNT_LIST(state, data) {
                    state.discountList = data;
                },
                SET_DEFAULT_ITEM(state, data) {
                    state.discountItem = data;
                },
                SET_PROTOCOL_LIST(state, data) {
                    state.protocolList = data;
                },
                // 虚拟币订单详情
                SET_VIRTUAL_DETAIL(state, data) {
                    state.virtualDetail = data;
                },
                SET_EXCHANGE_RATE(state, data) {
                    state.exchangeRate = data;
                },
                SET_BANK_DETAIL(state, data) {
                    state.bankDetail = data;
                },
                SET_DDPAYLINKURL(state, data) { // ddpay 链接
                    state.ddpaLinkUrl = data;
                  }
            },
            actions: {
                // 获取支付类型-tab列表
                async getDepositTypeAction({commit, dispatch}, data) {
                    try {
                        let res = await getDepositTypeApi(data)
                        if (res && res.success) {
                            commit("SET_DEPOSIT_TYPE", res.data)
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                // 获取支付方式-列表
                async getDepositListAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await getDepositListApi(data)
                        window.win.myloading.hidden()
                        if (res && res.success) {
                            commit("SET_DEPOSIT_LIST", res.data)
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                // 获取支付优惠活动
                async getDescountPopListAction({commit, dispatch}, data) {
                    try {
                        // 清空数据;
                        commit("SET_DISCOUNT_LIST", '');
                        commit("SET_DEFAULT_ITEM", false);
                        // 查询
                        let res = await getDescountListInDepositPageApi(data)
                        if (res && res.success) {
                            let arr = res.data,
                                state = false
                            arr.forEach((val, key) => {
                                if (val.needConfirm) {
                                    state = true
                                }
                            });
                            if (state) {
                                let obj = {
                                    id: "",
                                    name: "不申请返利",
                                    needConfirm: true
                                }
                                arr.unshift(obj)
                            }
                            res.discountItemStatus = state;
                            commit("SET_DISCOUNT_LIST", res.data)
                            commit("SET_DEFAULT_ITEM", state)
                            return res;
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";

                            window.win.tips.warning(msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                // 存款
                async depositSubmitAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await depositSubmit(data)
                        // res = {
                        //     success: true,
                        //     "data": {
                        //         "success":1,
                        //         "payUrl":"ccc",
                        //         "device":"李明",
                        //         "payModeId":"",
                        //         "thirdOrderNo":"thirdOrderNo",
                        //         "payAmount":"payAmount",
                        //         // "payUrl":"",
                        //         "payInfo":{
                        //             "depositorName":"depositorName",
                        //             "depositMsg":"depositMsg",
                        //             "receivedName":"receivedName",
                        //             "receivedBankCard":"receivedBankCard",
                        //             "receivedBankName":"receivedBankName",
                        //             "receivedSubBankName":"receivedSubBankName"
                        //         }
                        //     },
                        // }
                        if (res && res.success) {
                            window.win.tips.success(res.msg);
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            if (res.code == 400) {
                                msg = '存款通道繁忙，请稍后再试!'
                            }
                            window.win.tips.warning(msg);
                        }
                        window.win.myloading.hidden()
                        return res
                    } catch (err) {
                        window.win.myloading.hidden()
                        return err;
                    }
                },
                // 取消订单
                async cancelDepositAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await cancelDeposit(data)
                        if (res && res.success) {
                            window.win.tips.success(res.msg);
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
                // 获取协议列表
                async getProtocolListAction({commit, dispatch}, data) {
                    try {
                        //window.win.myloading.show()
                        let res = await getProtocolListApi(data)
                        window.win.myloading.hidden()
                        if (res && res.success) {
                            commit('SET_PROTOCOL_LIST', res.data.records);
                            commit('SET_EXCHANGE_RATE', res.data.exChangeRate);
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
                        }
                        return res
                    } catch (err) {
                        window.win.myloading.hidden()
                        return err;
                    }
                },
                // 虚拟币保存
                async virtualSubmitAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await virtualSubmitApi(data)
                        window.win.myloading.hidden()
                        if (res && res.success) {
                            window.win.tips.success(res.msg);
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
                        }
                        return res
                    } catch (err) {
                        window.win.myloading.hidden()
                        return err;
                    }
                },
                // 虚拟币订单详情
                async getVirtualDetailAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await getVirtualDetailApi(data)
                        window.win.myloading.hidden()
                        if (res && res.success) {
                            commit('SET_VIRTUAL_DETAIL', res.data)
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
                        }
                        return res
                    } catch (err) {
                        window.win.myloading.hidden()
                        return err;
                    }
                },
                // 银行卡转账详情
                async getBankTransferDetailAction({commit, dispatch}, data) {
                    try {
                        let res = await getBankTransferDetail(data)
                        if (res && res.success) {
                            commit('SET_BANK_DETAIL', res.data)
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                async getddpAddresssAct({commit}) { // 获取DDP下载连接-justin
                    try {
                        console.log('------005')
                      let res = await getddpAddresssApi()
                      if(res && res.success) {
                        commit('SET_DDPAYLINKURL', res.data)
                      }else{
                        // window.win.tips.warning(res.msg);
                        window.win.store.dispatch("noLogin",res);
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
        store.unregisterModule(['depositStore'])
    }
};

export default depositStore;
