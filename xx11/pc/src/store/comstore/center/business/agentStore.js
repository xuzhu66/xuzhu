import {
    getAgentBanner,
    getgentStatistics,
    agentApply,
    agentCalculation,
    suborMember,
    suborMemberAmount,
    operationAnalysis,
    operationAnalysisAmount,
    cooperateAgentApplyApi,
    selectReceiveCommissionInfoApi,
    selectPromotionBasicInfoApi,
    receiveCommissionApi,
    directManagementApi,
    selectPerformanceSourceApi, selectPerformanceApi, selectPromoteTutorialsApi, selectRebateAmountApi, directHeadApi
} from "@/store/comstore/api/apiConfig.js";
import store from '@/store/Store';

// 公共数据字段
const commonData = () => ({
    commonData: {}
});

const agentStore = {
    install() {
        store.registerModule(['agentStore'], {
            namespaced: true,
            state: {
                // 公共数据字段
                ...commonData(),
                // 列表数据
                tableList: [],
                // 图片
                banner: '',
                // 代理统计
                statistics: "",
                //  代理计算
                calculation: "",
                // 下线会员
                suborMember: "",
                //下线会员对象
                suborMemberData: {},
                // 累计返水总金额
                suborMemberAmount: "",
                // 运营分析
                operationAnalysis: '',
                // 运营分析
                operationAnalysisData: '',
                // 共计
                operationAnalysisAmount: '',
                //无线代理-我的推广
                table01:"",
                // 领取佣金信息
                table02:"",
                //无线代理-直属管理
                table10:"",
                //无线代理-业绩查询
                table20:"",
                //无线代理-业绩查询-详情
                table21:"",
                //无线代理-推广教程
                table30:"",
                //无线代理-返佣金额表
                table40:"",
                // 表头统计
                directHead:'',
            },
            getters: {},
            mutations: {
                SET_TABLELIST(state, data) {
                    state.tableList = data;
                },
                SET_BANNER(state, data) {
                    state.banner = data;
                },
                SET_STATISTICS(state, data) {
                    state.statistics = data;
                },
                SET_CALCULATION(state, data) {
                    if (data && data.url) {
                        // data.url = document.location.protocol + "//" + data.url;
                        data.url = "http://" + data.url;
                    }
                    state.calculation = data;
                },
                SET_SUB_MEMBER(state, data) {
                    state.suborMember = data;
                },
                SET_SUB_MEMBER_DATA(state, data) {
                    state.suborMemberData = data;
                },
                SET_SUB_MEMBER_AMOUNT(state, data) {
                    state.suborMemberAmount = data;
                },
                SET_OPERATION_ANALYSIS(state, data) {
                    state.operationAnalysis = data;
                },
                SET_OPERATION_ANALYSIS_DATA(state, data) {
                    state.operationAnalysisData = data;
                },
                SET_OPERATION_ANALYSIS_AMOUNT(state, data) {
                    state.operationAnalysisAmount = data;
                },
                SET_TABLE01(state, data) {
                    state.table01 = data;
                },
                SET_TABLE02(state, data) {
                    state.table02 = data;
                },
                SET_TABLE10(state, data) {
                    state.table10 = data;
                },
                SET_TABLE20(state, data) {
                    state.table20 = data;
                },
                SET_TABLE21(state, data) {
                    state.table21 = data;
                },

                SET_TABLE30(state, data) {
                    state.table30 = data;
                },
                SET_TABLE40(state, data) {
                    state.table40 = data;
                },
                SET_DIRECT_HEAD(state, data) {
                    state.directHead = data;
                },


            },
            actions: {

                // 申请代理banner图片查询
                async getAgentBannerAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await getAgentBanner(data)
                        if (res && res.success) {
                            commit('SET_BANNER', res.data)
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
                // 代理统计
                async getgentStatisticsAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await getgentStatistics(data)
                        if (res && res.success) {
                            commit('SET_STATISTICS', res.data)
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
                // 申请代理
                async agentApplyAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await agentApply(data)
                        if (res && res.success) {
                            if(!res.data.mobileChecked) {
                                // window.win.tips.success(res.msg);
                            }else{
                                window.win.tips.success(res.msg);
                            }
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
                // 代理计算
                async agentCalculationAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await agentCalculation(data)
                        if (res && res.success) {
                            commit('SET_CALCULATION', res.data)
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            if (res.code != 10001) {
                                window.win.tips.warning(msg);
                            }
                        }
                        window.win.myloading.hidden()
                        return res
                    } catch (err) {
                        window.win.myloading.hidden()
                        return err;
                    }
                },
                // 下线会员
                async suborMemberAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await suborMember(data)
                        if (res && res.success) {
                            commit('SET_SUB_MEMBER', res.data.records)
                            commit('SET_SUB_MEMBER_DATA', res.data)
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
                //  累计返水总金额 --
                async suborMemberAmountAction({commit, dispatch}, data) {
                    try {
                        let res = await suborMemberAmount(data)
                        if (res && res.success) {
                            commit('SET_SUB_MEMBER_AMOUNT', res.data)
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                //  运营分析
                async operationAnalysisAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await operationAnalysis(data)

                        if (res && res.success) {
                            commit('SET_OPERATION_ANALYSIS', res.data.records)
                            commit('SET_OPERATION_ANALYSIS_DATA', res.data)
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
                //  共计
                async operationAnalysisAmountAction({commit, dispatch}, data) {
                    try {
                        let res = await operationAnalysisAmount(data)
                        if (res && res.success) {
                            commit('SET_OPERATION_ANALYSIS_AMOUNT', res.data)
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                // 申请合营代理
                async cooperateAgentApplyAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await cooperateAgentApplyApi(data)
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
                // 推广基本信息查询
                async selectPromotionBasicInfoAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await selectPromotionBasicInfoApi(data)
                        if (res && res.success) {
                            commit('SET_TABLE01', res.data)
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
                // 领取佣金信息
                async selectReceiveCommissionInfoAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await selectReceiveCommissionInfoApi(data)
                        if (res && res.success) {
                            commit('SET_TABLE02', res.data)
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
                // 领取佣金
                async receiveCommissionAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await receiveCommissionApi(data)
                        if (res && res.success) {

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
                // 直属管理查询
                async directManagementAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await directManagementApi(data)
                        if (res && res.success) {
                            commit('SET_TABLE10', res.data)
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
                // 业绩来源查询
                async selectPerformanceSourceAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await selectPerformanceSourceApi(data)
                        if (res && res.success) {
                            commit('SET_TABLE21', res.data)
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
                // 业绩查询
                async selectPerformanceAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await selectPerformanceApi(data)
                        if (res && res.success) {
                            commit('SET_TABLE20', res.data)
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
                // 推广教程查询
                async selectPromoteTutorialsAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await selectPromoteTutorialsApi(data)
                        if (res && res.success) {
                            commit('SET_TABLE30', res.data)
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
                // 直属管理表头统计
                async directHeadAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await directHeadApi(data)
                        if (res && res.success) {
                            commit('SET_DIRECT_HEAD', res.data)
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

                // 返佣金额表查询
                async selectRebateAmountAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await selectRebateAmountApi(data)
                        // res = {
                        //     "code": 200,
                        //     "success": true,
                        //     "data": {
                        //         "childId": "",
                        //         "currentVipLevel": "1",
                        //         "rebateForm": [
                        //             {
                        //                 "vipLevel": 1,
                        //                 "flowAmount": 14,
                        //                 "rebateAmount": 2342
                        //             },
                        //             {
                        //                 "vipLevel": 1234,
                        //                 "flowAmount": 14,
                        //                 "rebateAmount": 2342
                        //             },
                        //             {
                        //                 "vipLevel": 123423,
                        //                 "flowAmount": 14,
                        //                 "rebateAmount": 2342
                        //             },
                        //             {
                        //                 "vipLevel": 123,
                        //                 "flowAmount": 14,
                        //                 "rebateAmount": 2342
                        //             },
                        //             {
                        //                 "vipLevel": 1232,
                        //                 "flowAmount": 14,
                        //                 "rebateAmount": 2342
                        //             }
                        //         ]
                        //     },
                        //     "msg": "操作成功"
                        // };
                        if (res && res.success) {
                            let currt = 0;
                            // 如果等级存在

                            if(res.data.currentVipLevel){
                                res.data.rebateForm.forEach((item,i)=>{
                                    if(item.vipLevel == res.data.currentVipLevel){
                                        currt = i;
                                    }
                                })
                                res.data.currt = currt;
                                res.data.currtPx = currt*45 +40+10;
                            }
                            commit('SET_TABLE40', res.data)
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



            },
            modules: {}
        })
    },
    uninstall() {
        store.unregisterModule(['agentStore'])
    }
};

export default agentStore;
