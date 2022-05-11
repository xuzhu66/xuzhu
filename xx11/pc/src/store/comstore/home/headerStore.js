import {getVipChangeRule, logOut, gameMenuListApi,getWechatChangeApi,platInfo,
    vipOrderList,
    vipOrder,
    vipOrderSingle,
    vipNumber
} from "@/store/comstore/api/apiConfig";
import {removeToken} from "@m/auth";
import store from '@/store/Store';

const headerStore = {
    install(_this) {
        store.registerModule(['headerStore'], {
            namespaced: true,
            state: {
                vipObj: '', //会员等级对象
                menuList: '',// 菜单列表
                defaultMenuList: [{ // 默认菜单列表
                    code: '0',
                    page: '/home',
                    name: '首页',
                    seq: 0,
                    showFlag:true,
                }, {
                    code: '1',
                    page: '/beauty',
                    name: '真人',
                    seq: 1,
                    showFlag:true,
                }, {
                    code: '2',
                    page: '/chess',
                    name: '棋牌',
                    seq: 2,
                    showFlag:true,
                }, {
                    code: '3',
                    page: '/electronic',
                    name: '电子',
                    seq: 3,
                    showFlag:true,
                }, {
                    code: '4',
                    page: '/fish',
                    name: '捕鱼',
                    seq: 4,
                    showFlag:true,
                }, {
                    code: '5',
                    page: '/lottery',
                    name: '彩票',
                    seq: 5,
                    showFlag:true,
                }, {
                    code: '6',
                    page: '/gameRace',
                    name: '电竞',
                    seq: 6,
                    showFlag:true,
                }, {
                    code: '7',
                    page: '/sport',
                    name: '体育',
                    seq: 7,
                    showFlag:true,
                }, {
                    code: '8',
                    page: '/discount',
                    name: '优惠',
                    seq: 8,
                    showFlag:true,
                }],
                wechat:'', // 微信专员对象
                showDialogDraw: false, // 显示领取中心弹层
                drawNumber: 0,
                // 领取中心列表
                drawList: []
            },
            mutations: {
                set_vipObj(state, data) {
                    state.vipObj = data;
                },
                SET_MENULIST(state, data) {
                    state.menuList = data;
                },
                SET_WECHAT(state, data){
                    state.wechat = data;
                },
                SET_DRAW_CENTER(state, data){
                    state.showDialogDraw = data;
                },
                SET_DRAW_NUMBER(state, data){
                    state.drawNumber = data;
                },
                SET_DRAW_LIST(state, data){
                    state.drawList = data;
                },
            },
            actions: {
                async logOut({commit,dispatch}, data) { // 玩家退出
                    try {
                        let res = await logOut(data)
                        if (res && res.success) {
                            removeToken();
                            _this.$store.commit('set_token', '') // 清空token
                            _this.$store.commit('set_vipLevel', '')
                            _this.$store.commit('set_inDays', '')
                            _this.$store.commit('set_balance', '点击登录') // 余额
                            _this.$store.commit('set_userId', '') // 用户ID
                            commit('SET_WECHAT', "");
                            dispatch('heYingMenuManagerAction')
                            // 查询活动配置
                            dispatch('activityStore/getActivityConfigAction' ,'', {root: true});
                            window.win.tips.toast({text: '退出成功'}, () => {
                                _this.$store.commit('set_curMenu', '/home')
                                _this.$router.push('/')
                            })

                        } else {
                            window.win.tips.warning(res.msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                // 获取会员等级
                async gameVipObj({commit, dispatch}, data) {
                    try {
                        let res = await getVipChangeRule(data)
                        if (res && res.success) {
                            commit('set_vipObj', res.data);
                        } else {
                            window.win.tips.warning(res.msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                // 重置页面状态
                async resetPageStateAction({commit, dispatch}, data) {
                    removeToken();
                    _this.$store.commit('set_token', '') // 清空token
                    _this.$store.commit('set_vipLevel', '')
                    _this.$store.commit('set_inDays', '')
                    _this.$store.commit('set_balance', '点击登录') // 余额
                    _this.$store.commit('set_userId', '') // 用户ID
                    _this.$store.commit('set_curMenu', '/home')
                    _this.$router.push('/')
                },
                // 获取菜单
                async gameMenuListAction({state,rootState, commit, dispatch}, data) {
                    try {
                        let tempateId = rootState.templateStore.template;
                        let params = {
                            device: 2, // 终端类型： 1、H5 2、PC 3、android 4、ios
                            platTemplateId:rootState.templateStore.template,
                        }
                        let res = await gameMenuListApi(params)
                        // 必须默认是8个菜单; 如果不是走默认配置
                        if (res && res.success && res.data && res.data.length == 8 ) {
                            // 设置路由名称 组装导航菜单
                            res.data.forEach(item => {
                                state.defaultMenuList.forEach(inner => {
                                    if (inner.code == item.code) {
                                        item.page = inner.page;
                                        item.showFlag = item.showFlag;
                                    }
                                })
                            })
                            res.data.sort(compare('seq'))
                            // 后台不配置优惠 主动添加进来;
                            let youhui = {
                                code: 8,
                                page: '/discount',
                                name: '优惠',
                                seq: 888,
                                showFlag:true,
                            };
                            let youhui1 = {
                                code: 8,
                                page: '/discount',
                                name: '优惠活动',
                                seq: 888,
                                showFlag:true,
                            };

                            let hyStr = '合营代理'
                            // 如果是模板一  两个字
                            if(1 === parseInt(tempateId)){
                                res.data.push(youhui1);
                                hyStr = '合营'
                            }else{
                                res.data.push(youhui);
                            }
                            // 是否要加载代理
                            let flag = true
                            let daili = {
                                code: 9,
                                page: '/agent',
                                name: hyStr,
                                seq: 9,
                                showFlag:true,
                            }
                            //true表示开启合营代理申请，false表示平台没有开启合营代理申请
                            if(rootState.teamAgentEnabled){
                                res.data.forEach(item=>{
                                    // 如果包含合营代理,则不加载代理菜单
                                    if(item.name.indexOf('合营')>=0){
                                        flag = false;
                                    }
                                })
                                if(flag) {
                                   res.data.push(daili);
                                }
                            }

                            // 判断是否是31平台 这几个菜单隐藏
                            // if(rootState.tenantPlatId == 31){
                            //     res.data.forEach(item => {
                            //         if(item.page == '/beauty' || item.page == '/lottery' || item.page == '/chess'){
                            //             item.showFlag = false;
                            //         }
                            //     })
                            // }
                            commit('SET_MENULIST', res.data);
                            dispatch('heYingMenuManagerAction');
                        } else {
                            commit('SET_MENULIST', state.defaultMenuList);
                            window.win.tips.warning(res.msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                    // 比对函数
                    function compare(p) {
                        return function (m, n) {
                            var a = m[p];
                            var b = n[p];
                            return a - b; //升序
                        }
                    }
                },
                // 获微信变更
                async getWechatChangeAction({commit, dispatch}, data) {
                    try {
                        let res = await getWechatChangeApi(data)
                        if (res && res.success) {
                            commit('SET_WECHAT', res.data);
                        } else {
                            window.win.tips.warning(res.msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                // 平台ID：31 隐藏：真人 彩票  棋牌 临时需求,后续去掉;
                menuListChangeAction({state,rootState, commit, dispatch}, data){
                    let plateId = rootState.tenantPlatId;
                    let munuList = state.menuList;
                    if(plateId == 31){
                        munuList.forEach(item => {
                            if(item.page == '/beauty' || item.page == '/lottery' || item.page == '/chess'){
                                item.show = false;
                            }
                        })
                    }
                    commit('SET_MENULIST', munuList);
                },
                // 合营代理控制
                heYingMenuManagerAction({state,rootState, commit, dispatch}){
                    // 如果当前页面是合营代理, 跳转到/home页面
                    // state.menuList.forEach(item => {
                    //     if(item.page == "/agent"){
                    //         // 登录状态隐藏
                    //         if(rootState.token){
                    //             item.showFlag = true;
                    //         }else{
                    //             item.showFlag = true;
                    //         }
                    //     }
                    // })
                    // 如果当前页面停留在合营代理页面 , 则判断是否是代理,选择跳转路由;
                    // if(vm.$route.path == "/agent"){
                    //     // 高级代理人
                    //     if(rootState.agentable){
                    //         vm.$router.push("/center/hadAgent")
                    //         vm.$store.commit('set_curMenu', '/center/hadAgent')
                    //     }else{
                    //         vm.$router.push("/center/applyAgent")
                    //         vm.$store.commit('set_curMenu', '/center/applyAgent')
                    //     }
                    // }
                },

                async getDrawCenterNumber({state,rootState, commit, dispatch}) {
                    try {
                        let res = await vipNumber()
                        if (res && res.success) {
                            commit('SET_DRAW_NUMBER', res.data);
                            // commit('SET_DRAW_NUMBER', 2);
                        } else {
                            window.win.tips.warning(res.msg);
                        }
                        return res
                    } catch (err) {
                        return err;
                    }
                },
                async getDrawCenterList({state,rootState, commit, dispatch}) {
                    dispatch('getDrawCenterNumber')
                    window.win.myloading.show()
                    try {
                        let param = {
                            size: 1000,
                            current: 1
                        }
                        let res = await vipOrderList(param)
                        // （1：vip礼金，2：活动彩金）
                        // let res = {
                        //     "code": 200,
                        //     "success": true,
                        //     "data": {
                        //         "records": [
                        //             {
                        //                 "id": "1420827938529853440",
                        //                 "amount": 888.88,
                        //                 "name": "VIP8-晋级礼金",
                        //                 "vipId": 9,
                        //                 "activityId": "",
                        //                 "type": 1
                        //             },
                        //             {
                        //                 "id": "142082765826646016022",
                        //                 "amount": 588.88,
                        //                 "name": "VIP6-晋级礼金VIP6-晋级礼金VIP6-晋级礼金",
                        //                 "vipId": 7,
                        //                 "activityId": "88",
                        //                 "type": 2
                        //             },
                        //
                        //         ],
                        //         "total": 4,
                        //         "size": 4,
                        //         "current": 1
                        //     },
                        //     "msg": "操作成功"
                        // };
                        if (res && res.success) {
                            // res.data.records = [
                            //     {
                            //        id: '1',
                            //         amount: '123',
                            //         name: 'name',
                            //         vipId: '7'
                            //     },
                            //     {
                            //         id: '2',
                            //         amount: '123456',
                            //         name: 'name2',
                            //         vipId: '7'
                            //     }
                            // ]
                            let arr = []
                            let records = res.data.records
                            for (let i = 0; i < records.length; i++) {
                                arr.push({
                                    id: records[i].id,
                                    amount: records[i].amount,
                                    name: records[i].name,
                                    vipId: records[i].vipId,
                                    hasGet: false,
                                    type:records[i].type
                                })
                            }
                            commit('SET_DRAW_LIST', arr);
                        } else {
                            window.win.tips.warning(res.msg);
                        }
                        window.win.myloading.hidden()
                        return res
                    } catch (err) {
                        window.win.myloading.hidden()
                        return err;
                    }
                },
                // 领取单个
                async drawSingle({state,rootState, commit, dispatch}, payload) {

                    if (payload.hasGet) return
                    window.win.myloading.show()
                    try {
                        let param = {
                            id: payload.id,
                            type:payload.type
                        }
                        let res = await vipOrderSingle(param)
                        // let res = await vipOrder()

                        // res.success = true
                        if (res && res.success) {
                            // setTimeout(() => {
                            //     dispatch('getDrawCenterList')
                            //     dispatch('getDrawCenterNumber')
                            // }, 500)
                            commit('SET_DRAW_NUMBER', state.drawNumber - 1);
                            let arr = []
                            let records = JSON.parse(JSON.stringify(state.drawList))
                            for (let i = 0; i < records.length; i++) {
                                let hasGet = false
                                if (records[i].hasGet == true) {
                                    hasGet = true
                                } else if (param.id == records[i].id) {
                                    hasGet = true
                                }
                                arr.push({
                                    id: records[i].id,
                                    amount: records[i].amount,
                                    name: records[i].name,
                                    vipId: records[i].vipId,
                                    hasGet: hasGet,
                                    type:records[i].type
                                })
                            }
                            console.log(arr)
                            commit('SET_DRAW_LIST', arr);
                            window.win.tips.success(res.msg);
                        } else {
                            window.win.tips.warning(res.msg);
                        }
                        window.win.myloading.hidden()
                        return res
                    } catch (err) {
                        window.win.myloading.hidden()
                        return err;
                    }
                },
                // 一键领取
                async drawAll({state,rootState, commit, dispatch}, payload) {
                    if (state.drawNumber <= 0) return
                    window.win.myloading.show()
                    try {
                        let res = await vipOrder()
                        // res.success = true
                        if (res && res.success) {
                            let arr = []
                            let records = JSON.parse(JSON.stringify(state.drawList))
                            for (let i = 0; i < records.length; i++) {
                                arr.push({
                                    id: records[i].id,
                                    amount: records[i].amount,
                                    name: records[i].name,
                                    vipId: records[i].vipId,
                                    hasGet: true,
                                    type:records[i].type
                                })
                            }
                            commit('SET_DRAW_LIST', arr);
                            commit('SET_DRAW_NUMBER', 0);
                            window.win.tips.success(res.msg);
                            // dispatch('getDrawCenterList')
                        } else {
                            window.win.tips.warning(res.msg);
                        }
                        window.win.myloading.hidden()
                        return res
                    } catch (err) {
                        window.win.myloading.hidden()
                        return err;
                    }
                }
            }
        })
    },
    uninstall(_this) {
        store.unregisterModule(['headerStore'])
    }
};

export default headerStore;
