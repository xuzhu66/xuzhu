<template lang="pug">
    .hadAgent
        assets

        // userInfo.type    1: 普通玩家: 2: 洗码代理 3: 合营代理 4: 无限代理
        .join-main(v-show="userInfo.type==3")
            .join-banner
                img(:src="joinPic1")
            ul.join-list
                li(v-for="(v,i) in jlist" :key='i')
                    p.joinl-ticon
                        img(:src="require(`@img/template3/join/${v.icon}.png`)")
                    p.joinl-text {{v.text}}
            p.join-button(@click="gotoApply()")
                img(:src="require(`@img/template3/join/button01.png`)")
            .join-foot-banner
                img(:src="joinPic2")
            p.join-btext PC端，H5还有独家开发的移动端，全面支持IOS和安卓系统下的所有移动设备
            p.join-tit
                span.join-lin
                span.join-text 业内最强APP
                span.join-lin
            ul.join-sefty-list
                li(v-for="(v,i) in jslist" :key='i')
                    p.join-sl-i
                        img(:src="require(`@img/template3/join/${v.icon}.png`)")
                    p.join-sl-t {{v.text}}
                    p.join-sl-c {{v.content}}
            p.join-tit
                span.join-lin
                span.join-text 权威机构认证
                span.join-lin
            p.join-fapprove
                img(:src="require(`@img/template3/join/approve.png`)")

        // userInfo.type    1: 普通玩家: 2: 洗码代理 3: 合营代理 4: 无限代理
        .apply-main(v-show="userInfo.type==2")
            .com-tab
                ul
                    li  代理管理

            .user-all-con
                .money-list
                    .money-left
                        .name 累计代理佣金(元)：
                        .number ¥{{calculation.cumulative | format}}
                    .money-left
                        .name 本周代理佣金(元)：
                        .number ¥{{calculation.thisWeek | format}}
                    .money-left
                        .name 昨日代理佣金(元)：
                        .number ¥{{calculation.yesterday | format}}
                    .money-right
                        .name 已推荐好友:
                        .number {{calculation.recommend}}
                .money-list
                    .money-left
                        .name 累计推广佣金(元)：
                        .number ¥{{calculation.cumulativePromoteAmount | format}}
                    .money-left
                        .name 本周推广佣金(元)：
                        .number ¥{{calculation.thisWeekPromoteAmount | format}}
                    .money-left
                        .name 昨日推广佣金(元)：
                        .number ¥{{calculation.yesterdayPromoteAmount | format}}
                    .money-right
                        .name
                        .number


            .com-tab.secend
                ul
                    li(@click="selectTab(1)",:class="currtTable==1?'active':''")  邀请方式
                    li(@click="selectTab(2)",:class="currtTable==2?'active':''")  会员明细
                    li(@click="selectTab(3)",:class="currtTable==3?'active':''")  运营分析
                .flow-con(v-show="currtTable==2")
                    span 累计返水总额(元)：
                    span {{suborMemberAmount | format}}
            .tab-con
                .tab01(v-show="currtTable==1")
                    .friend
                        .title 以下是您的专属推广二维码和链接：手机扫码二维码或点击复制链接按钮后发送给好友
                        //.qr-con(v-if="calculation.url")
                        qrcode(:codeurl="calculation.url",:clasz="'myqrcode'",v-if="calculation.url")
                        .qr-title 手机扫描转发
                        .qr-con
                            .qr-url.elli {{calculation.url}}
                            .qr-btn.vd-copy0(:data-clipboard-text="calculation.url" @click="copySub('vd-copy0')") 点击复制

                    .user-money
                        .title 佣金无上限 邀好友一起拿
                        .money-con
                            .user
                                span 推广人佣金
                                span 直属会员佣金

                    .moneyjs-con
                        .content
                            .title 佣金计算
                            ul
                                li(v-if="statistics.typeName && statistics.promoteAmount && statistics.promoteAmountCount") 推广佣金=每邀请一个用户{{ statistics.typeName }}成功奖励彩金{{ statistics.promoteAmount }}元,每日奖励上限{{ statistics.promoteAmountCount }}次
                                li 代理佣金=下线会员洗码优惠金额总和 * {{statistics.rate}}
                                li 例如:A会员发展B会员、C会员与D会员。那么A会员当天的代理佣金=（B会员当天洗码优惠金额+C会员当天洗码优惠金额+D会员当天洗码优惠金额）* {{statistics.rate}}

                    .rules
                        .title 代理规则
                        ul
                            li 1. 必须是有效会员
                            li 2.有效会员必须为30天内有成功入款记录，非有效会员洗码优惠金额不列入佣金计算范围。


                .tab02(v-show="currtTable==2")
                    .search-con
                        .item
                            .name 时间:
                            comDatepicker(@putTimeEvent="getTimeEvent",:showAllBtn="true")
                            //.search-item.ok(@click="getHuiYuanList")
                                span 确定
                    .table-con
                        ul
                            li.title
                                span 会员ID
                                span 会员账号
                                span 会员手机号
                                span 注册时间
                                span 累计返水金额
                            li(v-for="item in suborMember")
                                span {{item.playerId}}
                                span {{item.playerUsername?item.playerUsername:'-'}}
                                span {{item.playerMobile?item.playerMobile:'-'}}
                                span {{item.regTime}}
                                span {{item.amount | format}}

                    .page-list(v-if="suborMember && suborMember.length>0")
                        comPagination(:total="suborMemberData.total",@change="getPageEnv")
                    .nodata(v-if="suborMember && suborMember.length == 0")

                .tab03(v-show="currtTable==3")
                    .search-con
                        .item
                            .name 时间:
                            comDatepicker2(@putTimeEvent="getTimeEvent2")
                            //.search-item.ok(@click="searchList2")
                                span 确定

                    .statices-list(v-if="operationAnalysis && operationAnalysis.length>0")
                        div
                            span 新注册客户数：
                            span {{operationAnalysisAmount.registNum?operationAnalysisAmount.registNum:0}}
                            span 首存客户数：
                            span {{operationAnalysisAmount.firstDepositNum?operationAnalysisAmount.firstDepositNum:0}}
                            //span 次存客户数：
                            //span {{operationAnalysisAmount.depositNum?operationAnalysisAmount.depositNum:0}}
                            span 存款总额：
                            span {{(operationAnalysisAmount.depositAmount?operationAnalysisAmount.depositAmount:0) | format}}
                            span 取款总额：
                            span {{(operationAnalysisAmount.withdrawalAmount?operationAnalysisAmount.withdrawalAmount:0) | format}}
                            span 下级累计返水金额：
                            span {{(operationAnalysisAmount.rebateTotalAmount?operationAnalysisAmount.rebateTotalAmount:0) | format}}

                        div
                            span 累计代理佣金：
                            span {{(operationAnalysisAmount.totalRebateAmount?operationAnalysisAmount.totalRebateAmount:0) | format}}
                            span 累计推广佣金：
                            span {{(operationAnalysisAmount.totalPromoteAmount?operationAnalysisAmount.totalPromoteAmount:0) | format}}

                    .statices-list(v-else="!operationAnalysis")
                        div
                            span 新注册客户数：
                            span 0
                            span 首存客户数：
                            span 0
                            span 存款总额：
                            span 0
                            span 取款总额：
                            span 0
                            span 下级累计返水金额：
                            span 0
                        div
                            span 累计代理佣金：
                            span 0
                            span 累计推广佣金：
                            span 0

                    .table-con
                        ul
                            li.title(v-if="operationAnalysis.length>0")
                                span 日期
                                span 代理佣金
                                span 推广佣金
                                span 新注册客户数
                                span 首存客户数
                                span 存款客户数
                                span 取款客户数
                                span 存款总额
                                span 取款总额
                                span 下级累计返水金额

                            li( v-for="item in operationAnalysis")
                                span {{item.bizDate}}
                                span {{item.rebateAmount}}
                                span {{item.promoteAmount}}
                                span {{item.registNum}}
                                span {{item.firstDepositNum}}
                                span {{item.depositNum}}
                                span {{item.withdrawalNum}}
                                span {{item.depositAmount | format}}
                                span {{item.withdrawalAmount | format}}
                                span {{item.rebateTotalAmount | format}}

                    .page-list(v-if="operationAnalysis && operationAnalysis.length>0")
                        comPagination(:total="operationAnalysisData.total",@change="getPageEnv2")
                    .nodata(v-if="operationAnalysis.length == 0")

        // userInfo.type    1: 普通玩家: 2: 洗码代理 3: 合营代理 4: 无限代理
        .apply-main(v-show="userInfo.type==4")
            .com-tab.secend
                ul
                    li(@click="selectTab3(1)",:class="currtTable==1?'active':''")  我的推广
                    li(@click="selectTab3(2)",:class="currtTable==2?'active':''")  直属管理
                    li(@click="selectTab3(3)",:class="currtTable==3?'active':''")  业绩查询
                    li(@click="selectTab3(4)",:class="currtTable==4?'active':''")  推广教程
                    li(@click="selectTab3(5)",:class="currtTable==5?'active':''")  返佣金额表
            .tab-con
                // 我的推广
                .tab01(v-show="currtTable==1")
                    .user-all-con
                        .money-list
                            .money-left
                                .name 可领取佣金(元)：
                                .number
                                    span ¥{{table02.unlimitRebateUnreceivedTotal | format}}
                                    //span.btn(v-if="table02.unlimitRebateUnreceivedTotal && table02.unlimitRebateUnreceivedTotal >0 ",@click="lingquyongjin")  领取

                            .money-left
                                .name 累计领取佣金(元)：
                                .number ¥{{table02.unlimitRebateReceivedTotal | format}}
                            .money-left
                                .name 团队人数：
                                .number {{table01.teamNum}}
                            .money-right
                                .name 直属人数:
                                .number {{table01.directNum}}
                        .money-list
                            .money-left
                                .name 今日团队新增：
                                .number {{table01.newTeamNum}}
                            .money-left
                                .name 今日直属新增：
                                .number {{table01.newChildNum}}
                            .money-left
                                .name 今日团队业绩：
                                .number ¥{{table01.teamScore | format}}
                            .money-right
                                .name 今日直推业绩:
                                .number ¥{{table01.childScore | format}}
                        .money-list
                            .money-left
                                .name 今日佣金预估：
                                .number ¥{{table01.amount | format}}
                            .money-left
                                .name 昨日佣金：
                                .number ¥{{table01.yesterdayAmount | format}}
                            .money-left
                                .name
                                .number
                            .money-right
                                .name
                                .number

                    .lingquBtn(v-if="table02.unlimitRebateUnreceivedTotal && table02.unlimitRebateUnreceivedTotal >0 ",@click="lingquyongjin")  领取
                    .friend
                        .title 以下是您的专属推广二维码和链接：手机扫码二维码或点击复制链接按钮后发送给好友
                        .qr-con-unit
                            .qr-item
                                qrcode(:codeurl="calculation.url",clasz="myqrcodeu2",v-if="calculation.url")
                                .qr-title 手机扫描转发
                            .qr-item
                                .title 以下是您得专属链接:
                                .qr-url.elli {{calculation.url}}
                                .qr-btn.vd-copy0(:data-clipboard-text="calculation.url" @click="copySub('vd-copy0')") 点击复制


                // 直属管理
                .tab02(v-if="currtTable==2")
                    .search-con
                        .item
                            .name 会员ID:
                            input.userid(maxlength=20,placeholder='请输入会员ID', v-model='userId' )
                            .name 时间:
                            comRangDatepicker(@putTimeEvent="getTimeEventUnit",:showAllBtn="false")
                            .search-item(@click="resetUnitData")
                                span 重置
                            .search-item.ok(@click="directManagement(true)")
                                span 查询

                    .data-con(v-if="table10 && table10.records.length>0")
                        span 合计：直属人数：
                        span {{directHead.headDirectNum?directHead.headDirectNum:'0'}}
                        span 人；  今日总流水：
                        span {{directHead.headTotalFlow?directHead.headTotalFlow:'0'}}
                        span 元；
                    .table-con.table-unit
                        ul
                            li.title
                                span 会员ID
                                span 今日流水
                                span 总流水
                                span 团队人数
                                span 直属人数
                                span 加入时间
                            li(v-for="item in table10.records")
                                span {{item.childId}}
                                span {{item.todayFlow?item.todayFlow:'-'}}
                                span {{item.totalFlow?item.totalFlow:'-'}}
                                span {{item.teamNum}}
                                span {{item.directNum}}
                                span {{item.createTime}}

                    .page-list(v-if="table10 && table10.records.length>0")
                        comPagination(:total="table10.total",@change="getPageEnv3")
                    .nodata(v-if="table10 && table10.records.length == 0")


                // 业绩查询
                .tab03(v-if="currtTable==3")
                    .search-con
                        .item
                            .name 时间:
                            comRangDatepicker2(@putTimeEvent="getTimeEventUnit",:showAllBtn="false")
                            .search-item(@click="resetUnitData")
                                span 重置
                            .search-item.ok(@click="selectPerformanceFun(true)")
                                span 查询

                    .table-con.table-unit
                        ul
                            li.title
                                span 日期
                                span 直属新增
                                span 直推业绩
                                span 团队新增
                                span 团队业绩
                                span 所得佣金
                                span 操作
                            li(v-for="item in table20.records")
                                span {{item.bizDate}}
                                span {{item.newChildNum}}
                                span {{item.childScore}}
                                span {{item.newTeamNum}}
                                span {{item.teamScore}}
                                span {{item.amount}}
                                span.iteam-detial(@click="openDialog(item)") 业绩来源

                    .page-list(v-if="table20 && table20.records.length>0")
                        comPagination(:total="table20.total",@change="getPageEnv4")
                    .nodata(v-if="table20 && table20.records.length == 0")
                // 推广教程
                .tab04(v-show="currtTable==4")
                    img(:src="table30.picUrl")
                // 返佣金额表
                .tab05(v-if="currtTable==5")
                    .table-con
                        ul
                            li.title
                                span 代理级别
                                span 团队业绩/日
                                span 返佣额度
                            li(v-if="table40 && table40.rebateForm.length>0",v-for="item in table40.rebateForm")
                                span {{item.vipName}}
                                span {{changeMoney(item.flowAmount)}}
                                span 每万元返佣{{item.rebateAmount}}元

                        .leavel(v-if="table40 && table40.currtPx",:style="{'top': table40.currtPx +'px'}") 我
        comDialog(:show-footer='false',:show="showDialog",@on-cancel="closeDialog")
            div(slot="header") 详情
            div.dialog-con.unit-dialog-con(slot="default")
                .table-con.table-unit
                    ul
                        li.title
                            span 会员ID
                            span 直属新增
                            span 团队新增
                            span 自营业绩
                            span 团队业绩
                            span 佣金贡献
                        li(v-for="item in table21.records")
                            span {{item.playerId}}
                            span {{item.newChildNum}}
                            span {{item.newTeamNum}}
                            span {{item.selfScore}}
                            span {{item.teamScore}}
                            span {{item.contributeAmount}}

                .page-list(v-if="table21 && table21.records.length>0")
                    comPagination(:total="table21.total",@change="getPageEnv5")
                .nodata(v-if="table21 && table21.records.length == 0")
            div(slot="footer")
</template>

<script>
import comPagination from "@pon/template3/comPagination"
import assetslist from "./assetsList";
import comDatepicker from "@pon/template3/comDatepicker"
import comRangDatepicker from "@/views/business/center/comRangDatepicker"
import comRangDatepicker2 from "@/views/business/center/comRangDatepicker2"
import {mapGetters, mapState, mapMutations, mapActions} from 'vuex';
import thatStore from "@/store/comstore/center/business/agentStore"; // 获取模板
import store from '@/store/Store';
import qrcode from "@pon/template3/comQrcode"
import clipboard from "clipboard";
import {formatAmount, formatDate} from '@m/utils'
import comDialog from '@pon/template3/comDialog'

export default {
    name: "hadAgent",
    components: {
        comPagination,
        comDatepicker,
        "comDatepicker2": comDatepicker,
        "assets": assetslist,
        qrcode,
        comRangDatepicker,
        comRangDatepicker2,
        comDialog
    },
    data() {
        return {
            joinPic1: require('@img/template3/join/pic1.png'),
            joinPic2: require('@img/template3/join/pic2.png'),
            jlist:[{
                icon: 'icon01',
                text:'最精确的数据'
            },{
                icon: 'icon02',
                text:'最优质的产品'
            },{
                icon: 'icon03',
                text:'超高返佣比'
            }],
            jslist:[{
                icon: 'bigicon01',
                text:'更丰富',
                content:'丰富的游戏产品你想要的我们都有'
            },{
                icon: 'bigicon02',
                text:'更私密',
                content:'三重数据加密保护您的资料安全'
            },{
                icon: 'bigicon03',
                text:'更安全',
                content:'独家网络技术超强防劫持'
            },{
                icon: 'bigicon04',
                text:'更稳定',
                content:'强大的技术团队提供最稳定的产品'
            }],
            isReqFlag: true, // 请求是否结束
            currtTable: '1', // 当前类型 1： 存款 1.存款 2.取款 3.转账 4.加扣款 5.活动(彩金) 6.洗码返水 7.代理返佣
            currtTime: '1',// 1: 今天 357 15 30 进xx天
            //查询对象
            order: {
                startDate: '',
                endDate: '',
                page: 0,
                pageSize: 10,
                activityName: ""
            },
            //数据列表
            data: [],
            //总条数
            total: 100,
            //当前选中的行
            capitalInfo: "",

            startDate: '',
            endDate: '',
            dataType: '',
            current: 1,// 当前页
            size: 10, // 每页的数量

            startDate2: '',
            endDate2: '',
            dataType2: '',
            current2: 1,// 当前页
            size2: 10, // 每页的数量

            userId: '',//会员id
            rangeTime: '',//时间
            showDialog:false,// 详情弹框
            current3: 1,// 当前页
            size3: 10, // 每页的数量
            currtItem:"",// 详情对象
        }
    },
    filters: {
        format(vlaue) {
            if (vlaue) {
                return formatAmount(vlaue);
            } else {
                return "0"
            }
        }
    },
    watch: {
        userInfo(val, old) {
            // 洗码代理
            if(this.userInfo.type==2){
                this.getgentStatisticsActionFun()
            }
            // 无限代理
            if(this.userInfo.type==4){
                this.selectPromotionBasicInfoAction()
                this.selectReceiveCommissionInfoAction();
            }
        },
    },
    created() {
        let that = this;
        // 动态store
        if (!store.state["agentStore"]) {
            thatStore.install(this);
        }
        this.agentCalculationFun().then(function (res) {})
    },
    mounted() {
        this.returnTop()
        window.agent = this;
        // 洗码代理
        if(this.userInfo.type==2){
            this.getgentStatisticsActionFun()
        }
        // 无限代理
        if(this.userInfo.type==4){
            this.selectPromotionBasicInfoAction()
            this.selectReceiveCommissionInfoAction();
        }
    },
    computed: {
        ...mapState({
            banner: state => state['agentStore'].banner,
            statistics: state => state['agentStore'].statistics,
            //  代理计算
            calculation: state => state['agentStore'].calculation,
            // 下线会员
            suborMember: state => state['agentStore'].suborMember,
            // 下线会员对象
            suborMemberData: state => state['agentStore'].suborMemberData,
            // 累计返水总金额
            suborMemberAmount: state => state['agentStore'].suborMemberAmount,
            // 运营分析
            operationAnalysis: state => state['agentStore'].operationAnalysis,
            // 运营分析对象
            operationAnalysisData: state => state['agentStore'].operationAnalysisData,
            // 共计
            operationAnalysisAmount: state => state['agentStore'].operationAnalysisAmount,
            userInfo: state => state['centerStore'].userInfo, // // userInfo.type    1: 普通玩家: 2: 洗码代理 3: 合营代理 4: 无限代理
            platformInfo: state => state.platformInfo,// 平台信息  rebateAgentEnabled:洗码代理 teamAgentEnabled: 合营代理  unlimitAgentEnabled:无线代理
            table01: state => state.agentStore.table01,
            table02: state => state.agentStore.table02,
            table10: state => state.agentStore.table10,
            table20: state => state.agentStore.table20,
            table21: state => state.agentStore.table21,
            table30: state => state.agentStore.table30,
            table40: state => state.agentStore.table40,
            // 统计
            directHead: state => state.agentStore.directHead,


        }),
    },
    methods: {
        ...mapActions({
            // 代理计算
            agentCalculationFun(dispatch, param) {
                return dispatch(`agentStore/agentCalculationAction`, param);
            },
            // 下线会员
            suborMemberFun(dispatch, param) {
                return dispatch(`agentStore/suborMemberAction`, param);
            },
            // 累计返水总金额
            suborMemberAmountFun(dispatch, param) {
                return dispatch(`agentStore/suborMemberAmountAction`, param);
            },
            // 运营分析
            operationAnalysisFun(dispatch, param) {
                return dispatch(`agentStore/operationAnalysisAction`, param);
            },
            // 共计
            operationAnalysisAmountFun(dispatch, param) {
                return dispatch(`agentStore/operationAnalysisAmountAction`, param);
            },
            getgentStatisticsActionFun(dispatch, param) {
                return dispatch(`agentStore/getgentStatisticsAction`, param);
            },
            // 推广基本信息查询
            selectPromotionBasicInfoAction(dispatch, param) {
                return dispatch(`agentStore/selectPromotionBasicInfoAction`, param);
            },
            // 领取佣金信息
            selectReceiveCommissionInfoAction(dispatch, param) {
                return dispatch(`agentStore/selectReceiveCommissionInfoAction`, param);
            },
            // 领取佣金
            receiveCommissionAction(dispatch, param) {
                return dispatch(`agentStore/receiveCommissionAction`, param);
            },
            // 直属管理查询
            directManagementAction(dispatch, param) {
                return dispatch(`agentStore/directManagementAction`, param);
            },
            // 直属管理查询--统计
            directHeadAction(dispatch, param) {
                return dispatch(`agentStore/directHeadAction`, param);
            },

            // 业绩来源查询
            selectPerformanceSourceAction(dispatch, param) {
                return dispatch(`agentStore/selectPerformanceSourceAction`, param);
            },
            // 业绩查询
            selectPerformanceAction(dispatch, param) {
                return dispatch(`agentStore/selectPerformanceAction`, param);
            },
            // 推广教程查询
            selectPromoteTutorialsAction(dispatch, param) {
                // 终端类型： 1、H5 2、PC
                return dispatch(`agentStore/selectPromoteTutorialsAction`, {deviceType: 2});
            },
            // 返佣金额表查询
            selectRebateAmountAction(dispatch, param) {
                return dispatch(`agentStore/selectRebateAmountAction`, param);
            },


        }),
        selectTab(item) {
            this.currtTable = item;
            if (this.currtTable == 2) {
                this.getHuiYuanList()
            }
            if (this.currtTable == 3) {
                this.searchList2()
            }
        },
        // 无限代理切换事件
        selectTab3(item) {
            this.resetUnitData();
            this.currtTable = item;
            this.current = 1;
            this.resetUnitData();
            if (this.currtTable == 1) {
                this.selectPromotionBasicInfoAction()
                this.selectReceiveCommissionInfoAction();
            }
            if (this.currtTable == 2) {
                // 等待日期组件初始化完成
                setTimeout(()=>{
                    this.directManagement()
                },300)
            }
            if (this.currtTable == 3) {
                // 等待日期组件初始化完成
                setTimeout(()=>{
                    this.selectPerformanceFun()
                },300)
            }
            if (this.currtTable == 4) {
                this.selectPromoteTutorialsAction()
            }
            if (this.currtTable == 5) {
                this.selectRebateAmountAction()
            }

        },
        selectTime(item) {
            this.currtTime = item;
        },
        //分页
        getPageEnv(num) {
            this.current = num;
            this.getHuiYuanList()
        },
        getPageEnv2(num) {
            this.current2 = num;
            this.searchList2()
        },
        getPageEnv3(num) {
            this.current = num;
            this.directManagement()
        },
        getPageEnv4(num) {
            this.current = num;
            this.selectPerformanceFun()
        },
        // 业绩来源详情分页
        getPageEnv5(num) {
            this.current3 = num;
            this.getDetailService()
        },


        // 复制内容
        copySub(c) {
            const btnCopy = new clipboard(`.${c}`);
            btnCopy.on('success', e => {
                this.$tips.toast(`复制成功`)
                e.clearSelection();
            });
        },
        //时间事件
        getTimeEvent(obj) {
            // 判断是不是全部按钮
            if (obj.isAll) {
                this.startDate = formatDate(obj.startTime, true) + " 00:00:00";
                this.endDate = formatDate(obj.endTime, true) + " 23:59:59";
                this.dataType = null;
                this.resetPageSize()
                this.getHuiYuanList()
            } else {
                this.startDate = formatDate(obj.startTime, true) + " 00:00:00";
                this.endDate = formatDate(obj.endTime, true) + " 23:59:59";
                this.dataType = obj.dataType + "";
                this.resetPageSize()
                this.getHuiYuanList()
            }

        },
        //时间事件
        getTimeEvent2(obj) {
            this.startDate2 = formatDate(obj.startTime, true) + " 00:00:00";
            this.endDate2 = formatDate(obj.endTime, true) + " 23:59:59";
            this.dataType2 = obj.dataType + "";
            this.resetPageSize2()
            this.searchList2()
        },
        getHuiYuanList() {
            let that = this;
            // 判断是否是请求中
            if (this.isReqFlag) {
                this.isReqFlag = false;
            } else {
                return;
            }
            let param = {
                //startTime:this.startDate,// 订单开始时间
                //endTime:this.endDate,// 订单结束时间
                dataType: this.dataType,// 时间类型 null 全部 1、今日 2、昨日 3、近3天 4、近7天 5、近10天 6、近15天 7、本月 8、最近60
                query: {
                    current: parseInt(this.current), // 当前页
                    size: parseInt(this.size), // 每页的数量
                },
            }
            this.suborMemberFun(param).then(function () {
                that.isReqFlag = true;
            });
            this.suborMemberAmountFun(param)
        },
        searchList2() {
            let that = this;
            // 判断是否是请求中
            if (this.isReqFlag) {
                this.isReqFlag = false;
            } else {
                return;
            }
            let param = {
                //startTime:this.startDate2,// 订单开始时间
                //endTime:this.endDate2,// 订单结束时间
                dataType: this.dataType2,// 时间类型 null 全部 1、今日 2、昨日 3、近3天 4、近7天 5、近10天 6、近15天 7、本月 8、最近60
                query: {
                    current: parseInt(this.current2), // 当前页
                    size: parseInt(this.size2), // 每页的数量
                },
            }
            this.operationAnalysisFun(param).then(function () {
                that.isReqFlag = true;
            });
            this.operationAnalysisAmountFun(param)
        },
        returnTop() {
            // let l = document.documentElement.scrollTop;
            let l = document.getElementById('app').scrollTop;
            let s = l / 600 * 50;  //路程/时间=s *25每隔25ms秒 动的路程
            let st = setInterval(function () {
                l -= s;
                if (l <= 0) {
                    l = 0; //当l<=0时，设置l=0
                    clearInterval(st);
                }
                document.getElementById('app').scrollTop = l;
            }, 25)
        },
        resetPageSize() {
            this.current = 1;// 当前页
            this.size = 10; // 每页的数量
        },
        resetPageSize2() {
            this.current2 = 1;// 当前页
            this.size2 = 10; // 每页的数量
        },
        gotoApply() {
            let url = window.location.protocol + "//" + window.location.host + '/proxypc/#/homePage'
            // window.location.href = url;
            window.open(url, "_blank");
        },
        // 领取佣金
        lingquyongjin() {
            // 判断是否是请求中
            if (this.isReqFlag) {
                this.isReqFlag = false;
            } else {
                return;
            }

            this.receiveCommissionAction().then(res => {
                this.isReqFlag = true;
                this.selectPromotionBasicInfoAction()
                this.selectReceiveCommissionInfoAction();
            })
        },
        // 直属管理
        directManagement(research) {
            // 判断是否是请求中
            if (this.isReqFlag) {
                this.isReqFlag = false;
            } else {
                return;
            }
            if(research){
                this.current = 1;
            }
            let param = {
                id: this.userId,// 用户id
                startTime: this.startDate,// 订单开始时间
                endTime: this.endDate,// 订单结束时间
                query: {
                    current: parseInt(this.current), // 当前页
                    size: parseInt(this.size), // 每页的数量
                },
            }
            this.directManagementAction(param).then(res => {
                this.isReqFlag = true;

            })
            // 统计查询
            this.directHeadAction(param);
        },
        getTimeEventUnit(range) {
            this.rangeTime = range;
            this.resetPageSize()
            if (this.currtTable == 2) {
                this.startDate = range.startTime?formatDate(range.startTime, true) + " 00:00:00" :"";
                this.endDate = range.endTime?formatDate(range.endTime, true) + " 23:59:59":"";
                // this.directManagement()
            }
            if (this.currtTable == 3) {
                this.startDate = range.startTime?formatDate(range.startTime, true):"";
                this.endDate = range.endTime?formatDate(range.endTime, true):"";
                // this.selectPerformanceFun()
            }
        },
        resetUnitData() {
            this.userId = "";
            this.$root.eventHub.$emit('unitTimeClear');
        },
        // 业绩查询
        selectPerformanceFun(research) {
            // 判断是否是请求中
            if (this.isReqFlag) {
                this.isReqFlag = false;
            } else {
                return;
            }
            if(research){
                this.current = 1;
            }
            let param = {
                startBizDate: this.startDate,// 订单开始时间
                endBizDate: this.endDate,// 订单结束时间
                query: {
                    current: parseInt(this.current), // 当前页
                    size: parseInt(this.size), // 每页的数量
                },
            }
            if(param.startBizDate){
                param.startBizDate = param.startBizDate;
            }
            if(param.endBizDate){
                param.endBizDate = param.endBizDate;
            }
            this.selectPerformanceAction(param).then(res => {
                this.isReqFlag = true;

            })
        },
        closeDialog(){
            this.showDialog = false;
        },
        // 查看业绩来源详情
        openDialog(item){
            // 重置分页数据
            this.current3 = 1;
            this.size3 = 10;
            this.currtItem = item;
            this.showDialog = true;
            this.getDetailService()
        },
        // 业绩来源查询
        getDetailService(){
            let param = {
                bizDate:this.currtItem.bizDate,
                query: {
                    current: parseInt(this.current3), // 当前页
                    size: parseInt(this.size3), // 每页的数量
                },
                agentId:this.currtItem.playerId,
            }
            this.selectPerformanceSourceAction(param).then(res=>{
                if (res && res.success) {
                    // 打开弹框...
                    this.showDialog = true;
                }
            })
        },
        changeMoney(money) {
            let str = "";
            if(!money){
                return "";
            }
            // 如果大于10000 且小于 100000000
            if(money - 10000 >=0 && money < 100000000){
                str = Math.floor(money/10000) +"万+"
            }else if(money - 100000000 >=0){
                str = Math.floor(money/100000000) +"亿+"
            }else if (money < 10000){
                return money +"+"
            }
            return str;
        }

    }

}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template3/themes/mixin.styl'
@import "~@styl/template3/common/fun.styl"

.hadAgent

    .money-list
        height: 125px;
        bg_color(bg2)
        border-radius: 10px;
        display flex
        flex-direction row
        flex-wrap nowrap
        justify-content center
        align-items center
        opacity .8
        margin-bottom 20px

        .money-left
            flex 1
            height 100%
            display flex
            flex-direction column
            justify-content center
            align-items center
            padding-left 30px
            position relative

            &:after
                content ''
                display block
                width 1px
                height 90px
                bg_color(bg2)
                position absolute
                right 10px
                top 50%
                transform translateY(-50%)

        .money-right
            flex 1
            height 100%
            display flex
            flex-direction column
            justify-content center
            align-items center
            padding-left 30px
            position relative

        .name
            font-size: 18px;
            font_color(fc3);

        .number
            margin-top 15px
            font-size: 30px;
            font_color(fc3);

        .refrash
            position absolute
            font-size: 14px;
            font_color(fc3)
            right 20px
            top 10px
            cursor pointer

        .btn
            background #d8bd8b
            color #fff
            font-size 14px
            padding 5px 15px
            border-radius 10px
            text-align center


    .com-tab
        width 100%
        height: 70px;
        line-height 70px
        font-size: 20px;
        letter-spacing: 0px;
        font_color(fc3);
        bg_color(bg2);
        border-radius: 10px 10px 0px 0px;
        border_com(1px, solid, border_common, bottom)
        position relative
        transition all .3s
        position relative

        ul
            resetul()
            display flex
            flex-wrap nowrap
            justify-content flex-start

            li
                flex none
                width 136px
                text-align center
                position relative
                cursor pointer

                &:hover
                    font_color(fc4)

                &.active
                    font_color(fc4)

                    &:after
                        content ''
                        display block
                        width 100px
                        height 4px
                        bg_color(fc4)
                        bottom 2px
                        left 50%
                        transform translateX(-50%)
                        position: absolute;
                        border-radius: 4px;

        .all-list
            position absolute
            top 0px
            right 20px
            font-size: 16px;
            font_color(fc3);

            &:before
                content ''
                display block
                width 1px
                height 50px
                bg_color(bg1)
                position absolute
                top 50%
                transform translateY(-50%)
                right 240px

            span
                &.money
                    font_color(fc3)

    .search-con
        bg_color(bg2)
        padding 0px 20px

        .item
            display flex
            flex-direction row
            flex-wrap nowrap
            justify-content flex-start
            align-items center
            margin-bottom 20px

            .name
                font-size: 14px;
                font_color(fc3);
                flex none
                padding-right 10px

            .userid
                border 1px solid #eaeaea
                width 240px
                margin-right 30px
                height 30px
                line-height 30px
                border-radius 4px
                font-size 12px

            ul
                resetul()
                display flex
                flex-direction row
                flex-wrap nowrap
                justify-content flex-start
                align-items center

                li
                    text-align center
                    line-height 30px
                    flex none
                    width 100px
                    font-size: 14px;
                    font_color(fc2)
                    position relative

                    &.submit-btn
                        width: 63px;
                        height: 30px;
                        line-height 30px
                        bg_color(bg3)
                        border-radius: 5px;

                    &.active
                        font-size: 14px;
                        font_color(fc3)

                        &:after
                            content ''
                            display block
                            border-radius 2px
                            width: 60px;
                            height: 3px;
                            bg_color(bg3)
                            position absolute
                            bottom 0px
                            left 50%
                            transform translateX(-50%)

                    &:nth-child(1), &:nth-child(2), &:nth-child(3), &:nth-child(4)
                        &:after
                            width: 40px;

            .search-item
                cursor: pointer;
                width: 63px;
                height: 30px;
                line-height: 30px;
                line-height: 30px;
                bg_color(bg3)
                border-radius: 5px;
                font-size: 14px;
                font_color(fc2)
                text-align: center;
                margin-left: 10px;

    .data-con
        padding-left 20px
        margin-bottom 10px
        color #6a7180
    .table-con
        bg_color(bg2)
        padding 0px 10px 60px
        overflow auto
        ul
            resetul()
            width 1200px
            li
                line-height 45px
                width 100%
                display flex
                flex-direction row
                flex-wrap nowrap
                justify-content center
                align-items center

                &.title
                    height: 40px;
                    bg_color(bg4)
                    font_color(fc5)
                    border-radius: 1px;
                    opacity: 0.5;

                    span
                        font-size: 14px;

                span
                    flex 1
                    align-self center
                    display flex
                    justify-content center
                    font-size: 14px;
                    font_color(fc3)

    .table-unit
        ul
            width 100%

    .user-all-con
        bg_color(bg2)
        padding 2px 20px

    .com-tab
        &.secend
            border-radius 0px
            position relative

            .flow-con
                position absolute
                right 30px
                top 0px

                span
                    &:nth-child(1)
                        font_color(fc3)
                        font-size 18px

    .tab-con
        bg_color(bg2)
        padding 20px
        border-radius 0 0 10px 10px

        .tab01
            width 100%
            position relative
            .lingquBtn
                background #d8bd8b
                color #fff
                font-size 14px
                border-radius 10px
                text-align center
                position absolute
                height 36px
                width 120px
                line-height 36px
                top 108px
                z-index 2
                left 86px
            .friend
                .title
                    font-size: 16px;
                    letter-spacing: 0px;
                    font_color(fc3)

                .qr-img
                    margin 20px auto
                    width: 124px;
                    height: 124px;
                    bg_color(bg2)
                    border-radius: 10px;

                .qr-title
                    margin 10px auto
                    font-size: 14px;
                    letter-spacing: 0px;
                    font_color(fc3)
                    width 90px

                .qr-con
                    border_all(1px, dashed, border55)
                    width: 500px;
                    height: 70px;
                    margin 10px auto
                    line-height 70px
                    font-size: 20px;
                    font_color(fc3)
                    padding-left 20px
                    display flex
                    flex-direction row
                    flex-wrap nowrap
                    justify-content space-between
                    align-items center

                    .qr-url
                        flex 1
                        cursor pointer

                    .qr-btn
                        flex none
                        width 100px
                        bg_color(bg3)
                        height: 40px;
                        line-height: 40px;
                        text-align: center;
                        border-radius: 20px;
                        font-size: 14px;
                        font_color(fc3)
                        font-weight: 600;
                        cursor pointer

                .qr-con-unit

                    height 240px
                    width 100%
                    flexcon()

                    .qr-item
                        flex 1

                        &:nth-child(1)
                            flex none
                            width 200px

                        &:nth-child(2)
                            border 1px solid #eaeaea
                            border-radius 10px
                            height 180px

                            .title
                                margin 20px 10px

                            .qr-url
                                cursor pointer
                                margin 10px
                                font-size 14px

                        .qr-btn
                            flex none
                            width 100px
                            background-color #d8bd8b
                            height: 40px;
                            line-height: 40px;
                            text-align: center;
                            border-radius: 20px;
                            font-size: 14px;
                            color #fff
                            font-weight: 600;
                            margin 20px 0px 0px 600px

            .user-money
                bg_color(bg2)
                padding 40px 20px 20px

                .title
                    font-size: 24px;
                    line-height: 30px;
                    font_color(fc3)
                    text-align center
                    position relative

                    &:before
                        content ''
                        display block
                        background url("~@img/template3/center/sby.png") center no-repeat
                        width 42px
                        height 23px
                        position absolute
                        left 230px
                        top 50%
                        transform translateY(-50%)

                    &:after
                        content ''
                        display block
                        background url("~@img/template3/center/sby.png") center no-repeat
                        width 42px
                        height 23px
                        position absolute
                        right 230px
                        top 50%
                        transform translateY(-50%)

            .money-con
                height 360px
                background url("~@img/template3/center/dengjitu.png") right 0px top 0px / contain no-repeat
                padding: 160px 0px;

                .user
                    width: 252px;
                    height: 92px;
                    bg_color(bg2)
                    border-radius: 10px;
                    opacity: 0.5;
                    display flex
                    flex-direction column
                    justify-content center
                    align-items center

                    span
                        margin-bottom 10px
                        display inline-block

                        &:nth-child(1)
                            width: 120px;
                            height: 24px;
                            font-size: 24px;
                            line-height: 30px;
                            letter-spacing: 0px;
                            font_color(fc3)

                        &:nth-child(2)
                            height: 19px;
                            font-size: 20px;
                            line-height: 30px;
                            letter-spacing: 0px;
                            font_color(fc3)

            .moneyjs-con
                padding 0px 20px 20px

                .title
                    font-size: 24px;
                    line-height: 30px;
                    font_color(fc3)
                    text-align center
                    position relative
                    padding 20px

                    &:before
                        content ''
                        display block
                        background url("~@img/template3/center/sby.png") center no-repeat
                        width 42px
                        height 23px
                        position absolute
                        left 280px
                        top 50%
                        transform translateY(-50%)

                    &:after
                        content ''
                        display block
                        background url("~@img/template3/center/sby.png") center no-repeat
                        width 42px
                        height 23px
                        position absolute
                        right 280px
                        top 50%
                        transform translateY(-50%)


                .content
                    bg_color(bg2)
                    border-radius: 10px;
                    padding 20px

                    ul
                        li
                            font-size: 20px;
                            line-height: 36px;
                            font_color(fc3)
                            margin-bottom 10px

            .rules
                padding 0px 20px 20px

                .title
                    font-size: 24px;
                    line-height: 30px;
                    font_color(fc3)
                    text-align center
                    position relative
                    padding 20px

                    &:before
                        content ''
                        display block
                        background url("~@img/template3/center/sby.png") center no-repeat
                        width 42px
                        height 23px
                        position absolute
                        left 300px
                        top 50%
                        transform translateY(-50%)

                    &:after
                        content ''
                        display block
                        background url("~@img/template3/center/sby.png") center no-repeat
                        width 42px
                        height 23px
                        position absolute
                        right 300px
                        top 50%
                        transform translateY(-50%)

                ul
                    li
                        font-size: 20px;
                        line-height: 36px;
                        font_color(fc3)

        .tab03
            .statices-list
                padding-left 10px
                font-size: 14px;
                line-height: 30px;
                letter-spacing: 0px;
                font_color(fc3)
                div
                    span
                        &:nth-child(odd)
                            padding-left 10px
            .iteam-detial
                color #2f7ce4
                cursor pointer

        .tab05
            position relative

            ul
                width 100%

                li
                    border-bottom 1px solid #eaeaea
                    &.title
                        font-weight 600
                    span
                        border-left 1px solid #eaeaea

                        &:last-child
                            border-right 1px solid #eaeaea

            .leavel
                position absolute
                width 34px
                height 24px
                line-height 24px
                text-align center
                left 30px
                background-color #d8bd8b
                color #fff
                border-radius 10px
                &:after
                    after()
                    position absolute
                    bottom -6px
                    left 50%
                    transform translateX(-50%)
                    triangle-down(8px, 6px, #d8bd8b)


.dixian
    border_all(1px, solid, border10)

.join-main
    width 100%
    font-size: 20px;
    letter-spacing: 0px;
    color #5c6e95
    bg_color(bg2);
    border-radius: 10px;
    border_com(1px, solid, border_common, bottom)
    position relative
    transition all .3s
    padding 20px
    margin-bottom 20px
    .join-banner
        margin 0px auto
        text-align center
    .join-list
        display flex
        justify-content space-between
        width 70%
        margin 40px auto
        p
            text-align center
        .joinl-text
            font-size 24px
        .joinl-ticon
            img
                width 60px
                height 60px
    .join-button
        text-align center
        margin 10px 0px 40px
        border_com(1px, solid, border_common, bottom)
        padding-bottom 20px
    .join-foot-banner
        text-align center
    .join-btext
        text-align center
        padding 10px 0px
    .join-tit
        display flex
        justify-content center
        align-items center
        margin 35px 0px
        .join-lin
            height 1px
            bg_color(border_common)
            // background #697294
            width 100px
        .join-text
            font-size 24px
            padding 0px 15px
            width 200px
            text-align center
            display inline-block
    .join-sefty-list
        display flex
        justify-content center
        align-items center
        margin 35px 0px
        li
            width 150px
            text-align center
            margin 0px 15px
            .join-sl-i
                text-align center
                img
                    width 100px
                    height 100px
            .join-sl-t
                font-size 26px
                text-align center
                margin 5px 0px
            .join-sl-c
                font-size 12px
                text-align center
    .join-fapprove
        text-align center
        margin 0px 15px

.unit-dialog-con
    width 800px
</style>
