import {
    getRedPackConfigApi,// 活动--红包雨--获取配置
    getRedPackGiftApi,// 活动--红包雨--抽奖
    getSinginConfigApi,// 活动--签到--配置
    getSinginInfoApi,// // 活动--签到--详情
    setSinginApi,// // 活动--签到
    getActivityConfigApi,// 活动配置-- 大转盘/水果机/砸金蛋
    getActivityInfoApi,// 活动详情-- 大转盘/水果机/砸金蛋
    getActivityApi,// 活动抽奖-- 大转盘/水果机/砸金蛋
} from "@/store/comstore/api/apiConfig.js";
import store from '@/store/Store';
import {isObject} from '@m/utils'
// 公共数据字段
const commonData = () => ({
    commonData: {}
});

const activityStore = {
    install() {
        store.registerModule(['activityStore'], {
            namespaced: true,
            state: {
                // 公共数据字段
                ...commonData(),
                currtActivity: '',// 当前活动
                showDialog: false, // 显示活动弹框
                redRainFlag: false,// 红包雨活动
                redRainGiftFlag: false,// 红包雨未开始页面
                turntableFlag: false,// 大转盘
                fruitMachineFlag: false,// 水果机
                goldenEggFlag: false,// 砸金蛋
                signinFlag: false,// 签到
                // 红包雨配置
                redPackConfig: {
                    // showMins: 1,//展示时长（当开启活动才会有）单位分钟
                    // joinType: 1,//参与方式（1：点击参与，2：自动参与）（当开启活动才会有）
                    // countdown: 60,// 倒计时（单位秒）（
                    // isOpen: true,// 活动是否以开启（true：开启，false：未开启）（开启时 倒计时为展示剩余时间，未开启时倒计时为下轮红包雨开始时间）
                    // articleId: '1',// 文章id
                    // data: [],// 奖金数组
                },
                showRainWindow: false,// 显示红包雨
                showSinginWindow: false,// 显示签到
                redRainDownTimes: 0,// 红包雨倒计时
                redRainStartTime: 0, // 红包雨开始时间
                redRainEndTime: 0, // 红包雨结束时间
                redRainAllTimes: 0, // 红包雨持续时间
                downInterval: null,// 倒计时对象

                hasAutoShowSingin: false,// 是否自动显示过签到弹框
                singinConfig: '',// 签到配置
                singinDetail: '',// 签到详情
                hasSiged: false,//  今日签到状态


                leftCenterNum: 0,//福利中心活动数量
                turntableConfig: '',// 大转盘配置
                turntableDetail: '',// 大转盘详情
                turntableNum: 0,// 大转盘剩余抽奖次数

                fruitMachineConfig: '',// 水果机配置
                fruitMachineDetail: '',// 水果机详情
                fruitMachineNum: 0,// 水果机剩余抽奖次数

                goldenEggConfig: '',// 砸金蛋配置
                goldenEggDetail: '',// 砸金蛋详情
                goldenEggNum: 0,// 砸金蛋剩余抽奖次数


                showGift: false,// 是否显示中奖提示框


            },
            getters: {},
            mutations: {
                SET_CURRT_ACTIVITY(state, data) {
                    state.currtActivity = data;
                },
                SET_REDPACK_CONFIG(state, data) {
                    state.redPackConfig = data;
                },
                SET_SHOW_RAIN_WINDOW(state, data) {
                    state.showRainWindow = data;
                },
                SET_SHOW_SINGIN_WINDOW(state, data) {
                    state.showSinginWindow = data;
                },
                SET_REDRAIN_STARTTIME(state, data) {
                    state.redRainStartTime = data;
                },
                SET_REDRAIN_ENDTIME(state, data) {
                    state.redRainEndTime = data;
                },
                SET_REDRAIN_ALLTIMES(state, data) {
                    state.redRainAllTimes = data;
                },
                SET_REDRAIN_DOWNTIMES(state, data) {
                    state.redRainDownTimes = data;
                },
                SET_DOWNINTERVAL(state, data) {
                    state.downInterval = data;
                },
                SET_REDRANIN_STATUS(state, data) {
                    state.redPackConfig.isOpen = data;
                },
                SET_SHOW_DIALOG(state, data) {
                    state.showDialog = data;
                },
                SET_REDRAIN_FLAG(state, data) {
                    state.redRainFlag = data;
                },
                SET_REDRAIN_GIFT_FLAG(state, data) {
                    state.redRainGiftFlag = data;
                },
                SET_TURNTABLE_FLAG(state, data) {
                    state.turntableFlag = data;
                },
                SET_FRUITMACHINE_FLAG(state, data) {
                    state.fruitMachineFlag = data;
                },
                SET_GOLDENEGG_FLAG(state, data) {
                    state.goldenEggFlag = data;
                },
                SET_SIGNIN_FLAG(state, data) {
                    state.signinFlag = data;
                },
                SET_SHOW_GIFT(state, data) {
                    state.showGift = data;
                },
                SET_SINGIN_CONFIG(state, data) {
                    state.singinConfig = data;
                },
                SET_SINGIN_DETAIL(state, data) {
                    state.singinDetail = data;
                },
                SET_HASAUTO_SHOW_SINGIN(state, data) {
                    state.hasAutoShowSingin = data;
                },
                SET_HAS_SIGED(state, data) {
                    state.hasSiged = data;
                },
                SET_TURNTABLE_CONFIG(state, data) {
                    state.turntableConfig = data;
                },
                SET_TURNTABLE_DETAIL(state, data) {
                    state.turntableDetail = data;
                },
                SET_TURNTABLE_NUM(state, data) {
                    state.turntableNum = data;
                },
                SET_FRUITMACHINE_CONFIG(state, data) {
                    state.fruitMachineConfig = data;
                },
                SET_FRUITMACHINE_DETAIL(state, data) {
                    state.fruitMachineDetail = data;
                },
                SET_FRUITMACHINE_NUM(state, data) {
                    state.fruitMachineNum = data;
                },
                SET_GOLDENEGG_CONFIG(state, data) {
                    state.goldenEggConfig = data;
                },
                SET_GOLDENEGG_DETAIL(state, data) {
                    state.goldenEggDetail = data;
                },
                SET_GOLDENEGG_NUM(state, data) {
                    state.goldenEggNum = data;
                },
                SET_LEFTCENTER_NUM(state, data) {
                    state.leftCenterNum = data;
                },

            },
            actions: {
                // 活动--红包雨--获取配置 为空时证明没有开启红包雨活动（这个接口需要每小时调用一次，时间为每小时的第50分钟）
                async getRedPackConfigAction({commit, dispatch}, data) {
                    try {
                        // window.win.myloading.show()
                        let res = await getRedPackConfigApi(data)
                        // let res = {
                        //     success: true,
                        //     data: {
                        //         showMins: 1,//展示时长（当开启活动才会有）单位分钟
                        //         joinType: 2,//参与方式（1：点击参与，2：自动参与）（当开启活动才会有）
                        //         countdown: 300,// 倒计时（单位秒）（
                        //         isOpen: false,// 活动是否以开启（true：开启，false：未开启）（开启时 倒计时为展示剩余时间，未开启时倒计时为下轮红包雨开始时间）
                        //         articleId: '1',// 文章id
                        //         data: [],// 奖金数组
                        //     }
                        // }
                        // let res = {
                        //     "code": 200,
                        //     "success": true,
                        //     "data": {
                        //         "isOpen": true,
                        //         "data": [0,2,3,4,5,6,7,8],
                        //         "showMins": 40,
                        //         "joinType": 1,
                        //         "countdown": 0,
                        //         "articleId": 740
                        //     },
                        //     "msg": "操作成功"
                        // }
                        // 如果有活动,需要进入倒计时
                        if (res && res.data && isObject(res.data) && res.success) {
                            // 如果配置了红包雨
                            if (isObject(res.data)) {
                                // 设置配置
                                commit('SET_REDPACK_CONFIG', res.data);
                                // 开启红包雨小窗口
                                commit("SET_SHOW_RAIN_WINDOW", true);
                                // 如果活动开始了
                                if (res.data.isOpen) {
                                    commit('SET_REDRAIN_STARTTIME', 0);
                                    commit('SET_REDRAIN_ENDTIME', res.data.countdown);
                                    commit('SET_REDRAIN_ALLTIMES', res.data.countdown);
                                } else { // 活动未开始
                                    commit('SET_REDRAIN_STARTTIME', res.data.countdown);
                                    commit('SET_REDRAIN_ENDTIME', 0);
                                    commit('SET_REDRAIN_ALLTIMES', res.data.showMins * 60);
                                }
                                // 红包雨倒计时
                                dispatch("redRainDownTimeAction");
                            }
                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            //window.win.tips.warning(msg);
                        }
                        window.win.myloading.hidden()
                        return res
                    } catch (err) {
                        window.win.myloading.hidden()
                        return err;
                    }
                },
                // 活动--红包雨--抽奖
                async getRedPackGiftAction({commit, dispatch}, data) {
                    try {
                        let res = await getRedPackGiftApi(data)
                        // let res = {
                        //     success: true,
                        //     data: {
                        //         amount: 88.88,
                        //         status: 3,// 1：中奖，2：未中奖，3：活动结束，4：次数用尽，5：超过上限金额，6：不在VIP活动范围
                        //     }
                        // }
                        if (res && res.success) {

                        } else {
                            let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                            window.win.tips.warning(msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                //  活动--签到--配置
                async getSinginConfigAction({commit, dispatch,rootState}, data) {
                    try {
                        //window.win.myloading.show()
                        let res = await getSinginConfigApi(data)
                        // let res = {
                        //     success: true,
                        //     data: {
                        //         isSgin: false,// 当天是否签到（true:以签到，false：未签到）
                        //         articleId: 1,// 活动规则 文章id
                        //     }
                        // }
                        if (res && res.success) {
                            // 判断当前对象是否为空
                            if (isObject(res.data)) {
                                // 设置配置
                                commit("SET_SINGIN_CONFIG", res.data);
                                if (!res.data.isSgin) {
                                    // 开启签到小窗口
                                    commit("SET_SHOW_SINGIN_WINDOW", true);
                                }
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
                //  活动--签到--详情
                async getSinginInfoAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await getSinginInfoApi(data)
                        // let res = {
                        //     success: true,
                        //     data: {
                        //         // data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],//列表金额
                        //         data: [1, 2, 3, 4, 5, 6, 7],//列表金额
                        //         //data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],//列表金额
                        //         //data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],//列表金额
                        //         //data:[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
                        //         sginDays: 1,//连续签到天数
                        //         getMoney: 0,//已获得彩金
                        //         isSgin: true,//当天是否签到（true:以签到，false：未签到）
                        //     }
                        // }
                        if (res && res.success) {
                            commit("SET_SINGIN_DETAIL", res.data);
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
                //  活动--签到--签到
                async setSinginAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await setSinginApi(data)
                        // let res = {
                        //     success: true,
                        //     data: {
                        //         status: 2,//1：已签到，2：签到成功，3：活动结束，6：不在VIP活动范围，7：未开始
                        //     }
                        // }
                        if (res && res.success) {
                            if (res.data.status == 2) {
                                commit("SET_HAS_SIGED", true);
                                // 关闭签到小窗口
                                commit("SET_SHOW_SINGIN_WINDOW", false);
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

                //  活动配置-- 大转盘/水果机/砸金蛋
                async getActivityConfigAction({commit, dispatch}, data) {
                    try {
                        //window.win.myloading.show()
                        let res = await getActivityConfigApi(data)
                        // 2：大转盘，3：水果机 ,4：砸金蛋，
                        // let res = {
                        //     success: true,
                        //     data: [
                        //         {
                        //             type: 2,
                        //             count: 3
                        //         },
                        //         {
                        //             type: 3,
                        //             count: 3
                        //         },
                        //         {
                        //             type: 4,
                        //             count: 3
                        //         },
                        //     ]
                        // }
                        if (res && res.success && res.data) {
                            if(res.data.length > 0){
                                commit('SET_LEFTCENTER_NUM', res.data.length);
                                res.data.forEach((item) => {
                                    if (item.type == 2) {
                                        commit("SET_TURNTABLE_CONFIG", item)
                                        commit("SET_TURNTABLE_NUM", item.count)
                                    }
                                    if (item.type == 3) {
                                        commit("SET_FRUITMACHINE_CONFIG", item)
                                        commit("SET_FRUITMACHINE_NUM", item.count)
                                    }
                                    if (item.type == 4) {
                                        commit("SET_GOLDENEGG_CONFIG", item)
                                        commit("SET_GOLDENEGG_NUM", item.count)
                                    }
                                })
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
                //  活动详情-- 大转盘/水果机/砸金蛋  2：大转盘，3：水果机 ,4：砸金蛋
                async getActivityInfoAction({commit, dispatch}, data) {
                    try {
                        window.win.myloading.show()
                        let res = await getActivityInfoApi(data)
                        // let res = {
                        //     success: true,
                        //     data: {
                        //         status: 1,//3：活动结束
                        //         count: 3,//剩余抽奖次数
                        //         articleId: 1,//活动规则 文章id
                        //         data: [
                        //             {
                        //                 id: 1,
                        //                 amount: 11,
                        //                 url: "http://192.168.80.27:8000/smil.png"
                        //             },
                        //             {
                        //                 id: 2,
                        //                 amount: 22,
                        //                 url: "http://192.168.80.27:8000/smil.png"
                        //             },
                        //             {
                        //                 id: 3,
                        //                 amount: 33,
                        //                 url: "http://192.168.80.27:8000/smil.png"
                        //             },
                        //             {
                        //                 id: 4,
                        //                 amount: 44,
                        //                 url: "http://192.168.80.27:8000/smil.png"
                        //             },
                        //             {
                        //                 id: 5,
                        //                 amount: 55,
                        //                 url: "http://192.168.80.27:8000/smil.png"
                        //             },
                        //             {
                        //                 id: 6,
                        //                 amount: 66,
                        //                 url: "http://192.168.80.27:8000/smil.png"
                        //             },
                        //             {
                        //                 id: 7,
                        //                 amount: 77,
                        //                 url: "http://192.168.80.27:8000/smil.png"
                        //             },
                        //             {
                        //                 id: 8,
                        //                 amount: 88.88,
                        //                 url: "http://192.168.80.27:8000/smil.png"
                        //             },
                        //         ]
                        //     }
                        // }
                        if (res && res.success) {
                            // 大转盘
                            if (data.type == 2) {
                                commit("SET_TURNTABLE_DETAIL", res.data);
                            }
                            // 水果机
                            if (data.type == 3) {
                                commit("SET_FRUITMACHINE_DETAIL", res.data);
                            }
                            // 砸金蛋
                            if (data.type == 4) {
                                commit("SET_GOLDENEGG_DETAIL", res.data);
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
                //  活动抽奖-- 大转盘/水果机/砸金蛋
                async getActivityAction({commit, dispatch,state}, data) {
                    try {
                        //window.win.myloading.show()
                        let res = await getActivityApi(data)
                        // let res = {
                        //     success: true,
                        //     data: {
                        //         status: 1,// 1：中奖，2：未中奖，3：活动结束，4：次数用尽
                        //         id: 6, // 奖品id
                        //         count: 0,// 剩余抽奖次数
                        //     }
                        // }
                        if (res && res.success) {
                            // 设置剩余次数
                            if (data.type == 2) {
                                if(res.data.hasOwnProperty("count")){
                                    commit("SET_TURNTABLE_NUM", res.data.count)
                                }else{
                                    commit("SET_TURNTABLE_NUM", state.turntableNum -1 );
                                }
                            }
                            if (data.type == 3){
                                if (res.data.hasOwnProperty("count")) {
                                    commit("SET_FRUITMACHINE_NUM", res.data.count)
                                }else{
                                    commit("SET_FRUITMACHINE_NUM", state.fruitMachineNum -1 );
                                }
                            }
                            if (data.type == 4 ) {
                                if (res.data.hasOwnProperty("count")) {
                                    commit("SET_GOLDENEGG_NUM", res.data.count)
                                }else{
                                    commit("SET_GOLDENEGG_NUM", state.goldenEggNum -1 );
                                }
                            }

                            // 活动结束 清空
                            if (res.data.status == 3) {
                                if (data.type == 2) {
                                    commit("SET_TURNTABLE_CONFIG", "")
                                    commit("SET_TURNTABLE_NUM", 0)
                                }
                                if (data.type == 3) {
                                    commit("SET_FRUITMACHINE_CONFIG", "")
                                    commit("SET_FRUITMACHINE_NUM", 0);
                                }
                                if (data.type == 4) {
                                    commit("SET_GOLDENEGG_CONFIG", "")
                                    commit("SET_GOLDENEGG_NUM", 0)
                                }
                                // 查询一下活动配置
                                dispatch("getActivityConfigAction")
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

                //  红包雨倒计时
                async redRainDownTimeAction({commit, dispatch, state, rootState}, data) {
                    // 活动是否开启
                    if (state.redPackConfig.isOpen) {
                        // 设置倒计时时间
                        commit("SET_REDRAIN_DOWNTIMES", state.redRainAllTimes);
                    } else {
                        // 设置倒计时时间
                        commit("SET_REDRAIN_DOWNTIMES", state.redRainStartTime);
                    }
                    // 清空倒计时
                    clearInterval(state.downInterval);
                    let downInterval = setInterval(() => {
                        // 1 先进行倒计时
                        commit("SET_REDRAIN_DOWNTIMES", state.redRainDownTimes - 1);

                        // 2 红包雨倒计时为5分钟得时候 展示小窗口
                        if (state.redRainDownTimes == 300) {
                            commit("SET_SHOW_RAIN_WINDOW", true);
                        }
                        // 3 红包雨倒计时结束得时候
                        if (state.redRainDownTimes <= 0) {
                            // 判断红包是否进行中,开始则关闭活动
                            if (state.redPackConfig.isOpen) {
                                // 清空倒计时
                                clearInterval(state.downInterval);
                                // 活动结束
                                commit('SET_REDRANIN_STATUS', false);
                                // 清空数据
                                commit('SET_REDRAIN_STARTTIME', 0);
                                commit('SET_REDRAIN_ENDTIME', 0);
                                commit('SET_REDRAIN_ALLTIMES', 0);
                                commit('SET_REDRAIN_DOWNTIMES', 0);
                                // 重新获取配置
                                setTimeout(()=>{
                                    dispatch("getRedPackConfigAction");
                                },3000)
                                return;
                            } else { // 活动未开始则开启活动
                                // 设置倒计时时间为红包雨时间
                                commit("SET_REDRAIN_DOWNTIMES", state.redRainAllTimes);
                                commit('SET_REDRANIN_STATUS', true);
                                // 如果是自动开始 且登录状态
                                if (state.redPackConfig.joinType == 2 && rootState.userId) {
                                    dispatch("openActivityAction", "redRain");
                                }
                            }
                        }

                    }, 1000)
                    commit("SET_DOWNINTERVAL", downInterval);
                },
                // 开启活动
                async openActivityAction({commit, dispatch, state}, type) {
                    dispatch("closeActivityAction");
                    commit("SET_SHOW_DIALOG", true);
                    if (type == "redRain") {
                        // 重新设置红包雨组件倒计时时间,因为重新打开后 时间可能不一致  ; 时间少一秒 以免出现延迟得情况
                        commit("SET_REDRAIN_ALLTIMES", state.redRainDownTimes - 1);
                        commit("SET_REDRAIN_FLAG", true);
                    }
                    if (type == "redRainGift") {
                        commit("SET_REDRAIN_GIFT_FLAG", true);
                    }
                    if (type == "turntable") {
                        commit("SET_TURNTABLE_FLAG", true);
                    }
                    if (type == "fruitMachine") {
                        commit("SET_FRUITMACHINE_FLAG", true);
                    }
                    if (type == "goldenEgg") {
                        commit("SET_GOLDENEGG_FLAG", true);
                    }
                    if (type == "signin") {
                        commit("SET_SIGNIN_FLAG", true);
                    }
                },
                // 关闭活动
                async closeActivityAction({commit, dispatch, state}, data) {
                    commit("SET_SHOW_DIALOG", false);
                    commit("SET_REDRAIN_FLAG", false);
                    commit("SET_REDRAIN_GIFT_FLAG", false);
                    commit("SET_TURNTABLE_FLAG", false);
                    commit("SET_FRUITMACHINE_FLAG", false);
                    commit("SET_GOLDENEGG_FLAG", false);
                    commit("SET_SIGNIN_FLAG", false);
                },

            },
            modules: {}
        })
    },
    uninstall() {
        store.unregisterModule(['activityStore'])
    }
};

export default activityStore;
