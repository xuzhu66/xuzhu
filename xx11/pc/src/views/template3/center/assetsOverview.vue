<template lang="pug">
    .assetsOverview
        .layout-con
            .user
                .com-title 账户总览
                    .refesh(@click="refrash") 刷新
                .user-con
                    .user-left
                        ul
                            li
                                .item
                                    .photo
                                .item
                                    .item-top
                                        span.name {{userInfo.username?userInfo.username:numHidf3l4(userInfo.mobile)}}
                                        span.vip(:class="'vipLevel'+userInfo.vipLevel",@click="goPage('/center/vipCenter')")
                                    .claz   安全等级: {{safe}}
                            li
                                .icon-user(:class="userInfo.realName?'ok':''")
                                .icon-card(:class="userInfo.bankSetStatus?'ok':''")
                                .icon-phone(:class="userInfo.mobileChecked?'ok':''")
                            li
                                p(@click="goPage('/center/userinfo')") 立即完成资料认证，提升账户等级>
                    .user-right
                        ul
                            li
                                .item
                                    .name 总资产(元)
                                    .num-acount   {{wallet.sumAssets | format}}
                                .item
                                    .name 中心钱包(元)
                                    .num-acount   {{wallet.balance | format}}
                                .item
                                    .back(@click="turnInAllwalletFun") 一键回收
                            li
                                .btn.deposit(@click="goPage('/center/draw')") 取款
                                .btn(@click="goPage('/center/transfer')") 转账
                                .btn(@click="goPage('/center/deposit')") 存款
        .order-list-con
            .order-list
                .order-con(v-for="item in drawOrderList")
                    .top
                        .status(:class="getOrderStatusClass(item.status)") {{getOrderStatus(item.status)}}
                        .detail(v-if="item.isSuccess",@click="openDetailDialog(item)") 详情>>
                        .detail.error(v-else) 获取进度失败

                    .down
                        .per-title
                            span {{item.isSuccess?'已完成':'已失败'}}(
                            span.yellow(v-if="item.isSuccess") {{item.finishAmount}}
                            span.red(v-else) {{item.finishAmount}}
                            span /{{item.shouldAmount}})
                        .progress-con(v-if="item.isSuccess")
                            .progress-obj
                                .progress-father
                                .progress-child(:style="{width: getPersentProress(item)+'%'}")
                            .progress-title {{getPersentProress(item)}}%
                        .progress-con(v-else)
                            .progress-obj
                                .progress-father
                                .progress-child(:style="{width: '0%'}")
                            .progress-title 0%


            .tips(v-if="drawOrderList && drawOrderList.length")
                span *如已完成的取款未到账，请尽快联系
                span.service-link(:style="{color:'#e6a23c'}" @click="openServiceDialog") 在线客服
                span 处理！

        .layout-con
            .line
                .com-title 线路钱包
                .line-con(:class="more?'open':'close'")
                    .item(v-for="item in wallet.assetss")
                        .line-top
                            .line-name {{item.lineName}}
                            .line-btn(v-if="item.start == 0",@click="transferAllSubmit(item)") 一键转入
                            .line-btn(v-if="item.start == 1",class="closed") 维护中
                        .line-center
                            .game {{item.lineChName?item.lineChName:'--'}}
                        .line-num(v-if="item.start == 0")
                            span.money-icon ￥
                            span {{item.balance | format}}
                        .line-num(v-if="item.start == 1") --

                .more(@click="openMore")
                    span(v-if="more") 展开更多线路钱包
                    span(v-if="!more") 收起
                    span.fh(:class="more?'open':'close'")


        .layout-con
            .line-table
                .com-title 资金明细
                .search-con
                    .search-item.time 时间 :
                    .search-item
                        comDatepicker(@putTimeEvent="getTimeEvent")
                    //.search-item.ok
                        span(@click="searchAmountDetail") 确定
                .statistics
                    ul
                        li
                            .title 总存款(元)
                            .num {{(amountDetail.totalDetail && amountDetail.totalDetail.totalDeposite)?amountDetail.totalDetail.totalDeposite:'0' | format}}
                        li
                            .title 总取款(元)
                            .num {{(amountDetail.totalDetail && amountDetail.totalDetail.totalWithdraw)?amountDetail.totalDetail.totalWithdraw:'0' | format}}
                        li
                            .title 总投注(元)
                            .num {{(amountDetail.totalDetail && amountDetail.totalDetail.totalOrderBet)?amountDetail.totalDetail.totalOrderBet:'0' | format}}
                        li
                            .title 总输赢(元)
                            .num {{(amountDetail.totalDetail && amountDetail.totalDetail.totalWinLoss)?amountDetail.totalDetail.totalWinLoss:'0' | format}}
                .table-list
                    .title-con
                        span 线路名称
                        span 总投注
                        span 总输赢
                        span 线路名称
                        span 总投注
                        span 总输赢
                    ul
                        li(v-for="item in amountDetail.platDetail")
                            //span {{item.gameLineName}}
                            span {{item.chName?item.chName:item.gameLineName}}
                            span {{item.totalOrderBet | format}}
                            span {{item.totalWinLoss | format}}

            //div(slot="footer")
        vipDialog(:showDialog="showDialog",:closeDialog="closeDialog")

        comDialog(:show-footer='false',:show="showJumpDialog",@on-cancel="closeJumpDialog")
            div(slot="header") 温馨提示
            div.dialog-con(slot="default")
                .jump-con
                    .success-icon
                    .title(v-if="tempTurnIn.lineId !=0") 已经成功转入，祝您大杀四方!
                    .title(v-else) 已经成功转出，祝您游戏愉快!
                    .btns-con
                        .common-btn(@click="closeJumpDialog") 我知道了
                        .common-btn.ok(@click="jumpGame",v-if="tempTurnIn.lineId !=0") 立即进入游戏
            div(slot="footer")
        // 取款详情弹框
        comDialog(:show-footer="false",:show="drawDetailDialog",@on-cancel="closeDrawDetailDialog",clasz="draw-detail")
            div(slot="header") 订单详情
            div.dialog-con(slot="default")
                .title-con
                    .send-money ¥ {{currtDrawOrder.finishAmount}}
                    .all-money /{{currtDrawOrder.shouldAmount}}
                    .status(:class="getOrderStatusClass(currtDrawOrder.status)") {{getOrderStatus(currtDrawOrder.status)}}
                .tip-msg 取款金额 {{currtDrawOrder.withdrawAmount}} 元，已完成{{currtDrawOrder.finishAmount}}元，出款中{{currtDrawOrder.outingAmount}}元
                .service-con
                    span 如已完成取款未到账，请尽快联系
                    span.service-link(:style="{color:'#e6a23c'}" @click="openServiceDialog") 在线客服
                    span 处理
                .data-con
                    .data-item
                        .lable 订单编号:
                        .text  {{currtDrawOrder.orderNo}}
                    .data-item
                        .lable 订单时间:
                        .text  {{currtDrawOrder.createTime}}
                    .data-item
                        .lable 支付方式:
                        .text  {{currtDrawOrder.payType}}
                    .data-item
                        .lable 手续费:
                        .text  {{currtDrawOrder.handlingFees}}

                .title-list
                    span 子订单编号
                    span.money 子订单金额
                    span.status 子订单状态
                    span 失败原因
                ul
                    li(v-for="item in currtDrawOrder.orderWithdrawInfoVOS")
                        .item.order
                            span {{item.orderNo}}
                            span.copy(@click="copyText(item.orderNo)") 复制
                        .item.money {{item.orderAmt}}
                        .item.status(:class="getChildOrderStatusClass(item.orderStatus)") {{getChildOrderStatus(item.orderStatus)}}
                        .item {{item.msg}}
        // AI客服弹框
        comDialog(:show-footer='false',clasz="service-dialog",:show="serviceDialogFlag",@on-cancel="closeServiceDialog",:show-close="true")
            .dialog-con(slot="default")
                .ifram-con
                    iframe(:src="serviceIframeUrl",height="600px",frameborder="0" width='600px' ,@load="serviceIframOnload")
        //粘贴板
        .clipboard-con(:data-clipboard-text="copyValue")
</template>

<script>
import {mapActions, mapState} from "vuex";
import store from '@/store/Store';
import rootStore from "@/store/comstore/center/business/assetsOverviewStore"; // 获取模板
import {formatAmount, formatDate, numHidf3l4} from '@m/utils' // 工具类
import comDatepicker from "@pon/template3/comDatepicker"
import comDialog from '@pon/template3/comDialog'
import vipDialog from './vipDialog'
import clipboard from "clipboard"

export default {
    name: "assetsOverview",
    components: {
        // comPagination,
        comDatepicker,
        comDialog,
        vipDialog
    },
    data() {
        return {
            isReqFlag: true, // 请求是否结束
            more: false, // 更多 , false: 可展开, true:可收起
            order: {
                startDate: "",
                endDate: "",
            },
            showDialog: false, // 弹框状态
            showDialog2: false,
            turnOut: '',
            turnIn: '', //转入线路
            tempTurnIn: '', // 临时转入线路
            showJumpDialog: false, //显示跳转弹框
            copyValue: '',// 粘贴板
            drawDetailDialog: false,
            tableList: '',
            currtDrawOrder:'',// 当前取款对象
            serviceDialogFlag:false,
            serviceIframeUrl:'',
        }
    },
    computed: {
        ...mapState({
            commonData: state => state['centerStore'].commonData,
            userInfo: state => state['centerStore'].userInfo,
            wallet: state => state['centerStore'].wallet,
            amountDetail: state => state['assetsOverviewStore'].amountDetail,
            drawOrderList: state => state['drawStore'].drawOrderList,// 取款进度对象
            kefuUrl: state => state['homeStore'].kefuUrl,
        }),
        safe: function () {
            let num = 0;
            let safeStr = "低";
            if (this.userInfo && this.userInfo.bankSetStatus) { // 银行卡设置情况：0表示未设置，1表示已设置
                num += 1;
            }
            if (this.userInfo && this.userInfo.realName) { // 真实姓名，为空表示【未完善】
                num += 1;
            }
            if (this.userInfo && this.userInfo.mobile && this.userInfo.mobile.length > 0) { // 手机号码
                num += 1;
            }
            if (num == 0 || num == 1) {
                safeStr = "低";
            }
            if (num == 2) {
                safeStr = "中";
            }
            if (num == 3) {
                safeStr = "高";
            }
            return safeStr;
        },
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
    created() {
        // 动态store
        if (!store.state["assetsOverview" + "Store"]) {
            rootStore.install(this);
        }
        this.initPage();
    },
    mounted() {
        // 初始化粘贴板
        this.initClipboard()
        // 查询取款中的订单
        this.getWithdrawProgressAction()
    },
    methods: {
        numHidf3l4: numHidf3l4,
        //formatAmountFun:formatAmount,

        ...mapActions({
            // 查询用户信息
            getAssetsFun(dispatch, param) {
                return dispatch(`centerStore/getAssetsAction`, param);
            },
            // 查询用户信息
            getUserInfoFun(dispatch, param) {
                return dispatch(`centerStore/getUserInfoAction`, param);
            },
            // 一键回收
            turnInAllwalletFun(dispatch, param) {
                return dispatch(`centerStore/turnInAllwalletAction`, param);
            },
            // 一键转入
            transferAllSubmitFun(dispatch, id) {
                return dispatch(`centerStore/transferAllSubmitAction`, {tochangeIntoLineId: id});
            },
            // 个人资金明细查询 timeFlag: 时间标签：1表示今天，2表示3天内，3表示一周内，4表示一个月内
            getPersonalAmountDetailFun(dispatch, param) {
                return dispatch(`assetsOverviewStore/getPersonalAmountDetailAction`, param);
            },
            // 查询最近3条提款进度及子弹详情
            getWithdrawProgressAction(dispatch, param) {
                return dispatch(`drawStore/getWithdrawProgressAction`, param);
            }
        }),
        // 页面初始化
        initPage() {

        },
        goPage(path, param) {
            this.$router.push({path: path, query: param})
        },
        //刷新
        refrash() {
            let that = this;
            if (this.isReqFlag) {
                this.isReqFlag = false;
                this.getUserInfoFun();
                this.getAssetsFun().then(function () {
                    that.isReqFlag = true;
                });
            }

        },
        //展开更多
        openMore() {
            this.more = !this.more;
        },
        //时间事件
        getTimeEvent(obj) {
            this.startDate = formatDate(obj.startTime, true) + " 00:00:00";
            this.endDate = formatDate(obj.endTime, true) + " 23:59:59";
            this.searchAmountDetail()
        },
        searchAmountDetail() {
            let that = this;
            if (this.isReqFlag) {
                this.isReqFlag = false;
                this.getPersonalAmountDetailFun({
                    startTime: this.startDate,
                    endTime: this.endDate
                }).then(function () {
                    that.isReqFlag = true;
                });
            }
        },
        // 关闭弹框
        closeDialog() {
            this.showDialog = false;
            this.showDialog2 = false;
        },
        openVipDialog() {
            this.showDialog = true;
        },
        // 关闭弹框
        closeJumpDialog() {
            this.showJumpDialog = false;
        },
        // 跳转游戏
        jumpGame() {
            // 判断转入平台是不是中心钱包
            if (this.tempTurnIn.lineId == 0) {

            } else {
                //判断是跳转自己平台还是跳转三方平台
                if (this.tempTurnIn.thirdLobby) {
                    this.enterGame()
                } else {
                    this.goPage('/electronic', {gameLine: this.tempTurnIn.lineId})
                    this.$store.commit('set_curMenu', '/electronic',);
                }
            }
        },
        //进入游戏
        enterGame() {
            let that = this;
            let wintab = window.open("", "_blank");
            let obj = {
                gameLineId: this.tempTurnIn.lineId,
                index: 'player'
            }
            // 1. 查询游戏对象 2. 进入游戏
            this.$store.dispatch("gameStore/enterGameAction", obj).then(res => {
                if (res && res.success) {
                    if (res.data.status == '0' || res.data.status == 0) {
                        wintab.location.href = res.data.url;
                        that.showJumpDialog = false;
                    } else {
                        wintab.close();
                    }
                } else {
                    wintab.close();
                }
            });
        },
        //一键转入
        transferAllSubmit(item) {
            let that = this;
            this.tempTurnIn = item;
            this.transferAllSubmitFun(item.lineId).then(function (res) {
                if (res && res.success) {
                    that.showJumpDialog = true;
                } else {

                }
            })
        },
        // 初始化黏贴版
        initClipboard() {
            const btnCopy = new clipboard('.clipboard-con');
            btnCopy.on('success', e => {
                this.$tips.toast(`复制成功`)
                e.clearSelection();
            });
        },
        // 复制内容
        copyText(text) {
            this.copyValue = text;
            setTimeout(() => {
                document.getElementsByClassName('clipboard-con')[0].click()
            }, 300)
        },
        // 打开订单详情弹框
        openDetailDialog(item) {
            this.currtDrawOrder = item;
            this.drawDetailDialog = true
        },
        // 关闭订单详情弹框
        closeDrawDetailDialog() {
            this.drawDetailDialog = false
        },
        // 获取订单状态
        getOrderStatus(item) {
            let obj = {
                "0": '审核中',
                "1": '出款中',
                "2": '已完成',
                "3": '失败'
            }
            return obj[item]
        },
        // 获取订单状态class
        getOrderStatusClass(item) {
            let obj = {
                "0": 'start',
                "1": 'middle',
                "2": 'success',
                "3": 'fail'
            }
            return obj[item]
        },
        // 获取子订单状态
        getChildOrderStatus(item) {
            let obj = {
                "10": '处理中',
                "100": '交易成功',
                "-100": '交易失败'
            }
            return obj[item]
        },
        // 获取子订单状态class
        getChildOrderStatusClass(item) {
            let obj = {
                "10": 'start',
                "100": 'success',
                "-100": 'middle'
            }
            return obj[item]
        },
        // 获取百分比
        getPersentProress(item){
            if(item && item.finishAmount && item.shouldAmount){
                return parseInt((item.finishAmount / item.shouldAmount).toFixed(2)*100)
            }else{
                return 0;
            }

        },
        // 打开客服弹框
        openServiceDialog() {
            if (this.kefuUrl) {
                let str = this.kefuUrl.substr(this.kefuUrl.lastIndexOf("imClient?"))
                let url = this.kefuUrl + '&channelType=1'
                if (this.kefuUrl.indexOf('imClient') > -1) {
                    url = `${window.location.protocol}//${window.location.host}/vhtml/#/${str}&channelType=2`
                }
                this.serviceIframeUrl = url;
                this.serviceDialogFlag = true;
                window.win.myloading.show()
            } else {
                window.win.tips.success('客服连接未生成，请稍后')
            }
        },
        // 关闭客服弹框
        closeServiceDialog(){
            this.serviceDialogFlag = false;
        },
        // AI客服加载完毕
        serviceIframOnload() {
            window.win.myloading.hidden()
        },
    }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template3/themes/mixin.styl'
@import "~@styl/template3/common/fun.styl"

.assetsOverview
    .dialog-flow
        width: 100%;
        height: 100%;
        bg_color(bg2)
        opacity: .1;
        position: fixed;
        top: 0;
        left: 0;
        z-index 2;
        test()

    .dialog-con
        .jump-con
            min-height 200px
            min-width 500px

            .success-icon
                background url("~@img/template3/home/success.svg") center / contain no-repeat
                width 60px
                height 60px
                margin 10px auto
                font_color(fc3)

            .title
                font-size: 16px;
                font_color(fc6);
                text-align center

            .btns-con
                display flex
                flex-direction row
                justify-content space-between

                .common-btn
                    flex none
                    width: 200px;
                    height: 60px;
                    line-height 60px
                    text-align center
                    font_color(fc3)
                    border-radius: 10px;
                    font-size 18px
                    margin 40px auto 14px
                    bg_color(btn_bg_ng)

                    &.ok
                        line-height 60px
                        text-align center
                        font-size: 18px;
                        font_color(fc6);
                        bg_img_linear(linear_common)
                        border-radius: 10px;
                        margin 20 auto

    .layout-con
        margin-bottom 20px

        .com-title
            width 100%
            height: 70px;
            line-height 70px
            padding-left 25px
            font-size: 20px;
            letter-spacing: 0px;
            font_color(fc2);
            bg_color(bg2);
            border-radius: 10px 10px 0px 0px;
            border_com(1px, solid, border_common, bottom)
            position relative

            .refesh
                width: 50px;
                height: 12px;
                font-size: 12px;
                letter-spacing: 0px;
                font_color(fc3);
                float right
                margin-right 0px
                cursor pointer

        .user
            bg_color(bg2)
            border-radius: 10px 10px 0 0 ;

            .user-con
                height 260px
                display flex
                flex-direction row
                flex-wrap nowrap

                .user-left
                    position relative
                    flex none
                    width 345px

                    &:after
                        content ''
                        display block
                        width 1px
                        height 200px
                        bg_color(btn_bg_ng)
                        position absolute
                        right 0px
                        top 50%
                        transform translateY(-50%)

                    ul
                        resetul()

                        li

                            &:nth-child(1)
                                height 160px
                                display flex
                                flex-direction row
                                align-items center
                                justify-content center

                                .item
                                    flex 1

                                    &:nth-child(2)
                                        flex 1.8

                                    .photo
                                        width 90px
                                        height 90px
                                        border-radius 50%
                                        margin: 0px auto;
                                        background url("~@img/template3/center/user.png") center no-repeat

                                    .item-top
                                        display: flex;
                                        flex-direction: row;
                                        align-items: center;
                                        .name
                                            font-size: 20px;
                                            font_color(fc3);

                                        .vip
                                            width 87px
                                            height 31px
                                            display: inline-block;
                                            transform: scale(.7);
                                            cursor pointer
                                            background-position center
                                            background-size contain
                                            background-repeat no-repeat
                                        .vipLevel1
                                            background-image url("~@img/comimages/center/vip/vip0.png")

                                        .vipLevel2
                                            background-image url("~@img/comimages/center/vip/vip1.png")

                                        .vipLevel3
                                            background-image url("~@img/comimages/center/vip/vip2.png")

                                        .vipLevel4
                                            background-image url("~@img/comimages/center/vip/vip3.png")

                                        .vipLevel5
                                            background-image url("~@img/comimages/center/vip/vip4.png")

                                        .vipLevel6
                                            background-image url("~@img/comimages/center/vip/vip5.png")

                                        .vipLevel7
                                            background-image url("~@img/comimages/center/vip/vip6.png")
                                        .vipLevel8
                                            background-image url("~@img/comimages/center/vip/vip7.png")
                                        .vipLevel9
                                            background-image url("~@img/comimages/center/vip/vip8.png")
                                        .vipLevel10
                                            background-image url("~@img/comimages/center/vip/vip9.png")


                                        //.vipLevel1
                                        //    background url("~@img/template3/comm/vip0.png") center no-repeat
                                        //
                                        //.vipLevel2
                                        //    background url("~@img/template3/comm/vip1.png") center no-repeat
                                        //
                                        //.vipLevel3
                                        //    background url("~@img/template3/comm/vip2.png") center no-repeat
                                        //
                                        //.vipLevel4
                                        //    background url("~@img/template3/comm/vip3.png") center no-repeat
                                        //
                                        //.vipLevel5
                                        //    background url("~@img/template3/comm/vip4.png") center no-repeat
                                        //
                                        //.vipLevel6
                                        //    background url("~@img/template3/comm/vip5.png") center no-repeat
                                        //
                                        //.vipLevel7
                                        //    background url("~@img/template3/comm/vip6.png") center no-repeat

                                    .claz
                                        padding-top 10px
                                        font-size: 12px;
                                        font_color(fc3);

                            &:nth-child(2)
                                width 60%
                                height 60px
                                display flex
                                align-items center
                                justify-content center
                                margin-left 20px
                                text-align center

                                .icon-user
                                    flex: 1
                                    background url("~@img/template3/center/geren.png") center no-repeat
                                    width 30px
                                    height 30px

                                    &.ok
                                        background url("~@img/template3/center/nameok.png") center no-repeat

                                .icon-card
                                    flex: 1
                                    background url("~@img/template3/center/yinhagk.png") center no-repeat
                                    width 30px
                                    height 30px

                                    &.ok
                                        background url("~@img/template3/center/cardok.png") center no-repeat

                                .icon-phone
                                    flex: 1
                                    background url("~@img/template3/center/shouji.png") center no-repeat
                                    width 30px
                                    height 30px

                                    &.ok
                                        background url("~@img/template3/center/mobileok.png") center no-repeat

                            &:nth-child(3)
                                height 40px
                                line-height 40px
                                text-align right
                                font-size: 12px;
                                letter-spacing: 0px;
                                font_color(fc4)
                                margin-right 20px
                                cursor pointer

                .user-right
                    margin-left 20px
                    flex 1

                    ul
                        resetul()

                        li
                            height 130px

                            &:nth-child(1)
                                display flex
                                padding-top 40px

                                .item
                                    flex 2

                                    .name
                                        height 30px
                                        height: 17px;
                                        font-size: 16px;
                                        font_color(fc2)

                                    .num-acount
                                        height 30px
                                        font-size: 30px;
                                        letter-spacing: 0px;
                                        font_color(fc3);
                                        font-weight 500
                                        padding-top 10px

                                    &:nth-child(3)
                                        flex 1
                                        text-align right
                                        padding-right 20px
                                        font-size: 12px;
                                        font_color(fc4)
                                        cursor pointer

                            &:nth-child(2)
                                margin-top 20px
                                display flex
                                justify-content flex-start

                                .btn
                                    width: 150px;
                                    height: 50px;
                                    line-height 50px
                                    text-align center
                                    margin-right 24px
                                    bg_img_linear(linear_common)
                                    border-radius: 10px;
                                    font-size: 16px;
                                    font_color(fc6);

                                    &.deposit
                                        border-radius: 10px;
                                        border_all(1px, solid, btn_bg_ok)
                                        background-color transparent
                                        font_color(fc4)
                                        background-image none

        .line
            bg_color(bg2)
            border-radius: 10px;

            .line-con
                padding 2px 10px
                min-height 120px
                display flex
                flex-wrap wrap
                justify-content flex-wrap
                align-items center
                transition all 1s

                &.open
                    height 120px
                    overflow hidden

                .item
                    margin-left 15px
                    margin-top 10px
                    width: 23%;
                    height: 100px;
                    border-radius: 10px;
                    //border_all(1px, solid, border_common)
                    //bg_color(bg1)
                    box_shadow(shadow_common)

                    .line-top
                        display flex
                        height 40%
                        padding 10px 18px 0px

                        .line-name
                            flex 1
                            font-size: 18px;
                            font_color(fc2);

                        .line-btn
                            text-align center
                            width: 68px;
                            height: 24px;
                            line-height 24px
                            font_color(fc4)
                            border-radius: 12px;
                            bg_color(bg3)
                            flex none
                            cursor pointer

                            &.closed
                                font_color(fc3)
                                border_all(1px, solid, border_common)
                                bg_color(bg1)
                                opacity .6

                    .line-center
                        .game
                            font-size 12px
                            padding-left 20px
                            font_color(fc5)

                    .line-num
                        padding 0px 20px 10px
                        font-size: 24px;
                        font_color(fc3);

                        .money-icon
                            font-size 18px

            .more
                height: 30px;
                line-height 30px
                text-align center
                font-size: 14px;
                letter-spacing: 0px;
                font_color(fc3)
                position relative
                cursor pointer

                .fh
                    margin-left 10px
                    transition all .2s

                    &:before
                        content ''
                        display: inline-block;
                        border_com(1px, solid, fc3, top)
                        border_com(1px, solid, fc3, right)
                        width: 8px;
                        height: 8px;
                        transform: rotate(135deg);
                        position absolute
                        top 10px

                    &:after
                        content ''
                        display: inline-block;
                        border_com(1px, solid, fc3, top)
                        border_com(1px, solid, fc3, right)
                        width: 8px;
                        height: 8px;
                        transform: rotate(135deg);
                        position absolute
                        top 6px

                    &.close
                        &:before
                            top 14px
                            transform: rotate(-45deg);

                        &:after
                            top 10px
                            transform: rotate(-45deg);

        .line-table
            bg_color(bg2)
            border-radius: 10px;

            .search-con
                padding 20px 20px
                display flex
                flex-direction row
                flex-wrap nowrap
                justify-content flex-start
                align-items center

                .search-item
                    font-size: 14px;
                    font_color(fc4)

                    &.time
                        margin 0 10px
                        padding-bottom 4px
                    &.ok
                        cursor pointer
                        width: 63px;
                        height: 30px;
                        line-height 30px
                        line-height: 30px;
                        bg_color(bg1)
                        border-radius: 5px;
                        font-size: 14px;
                        font_color(fc4)
                        text-align center
                        margin-left 10px

            .statistics
                margin 0px 20px
                padding 0px 10px
                border-radius 10px
                box_shadow(shadow_common)
                ul
                    resetul()
                    height: 100px;
                    bg_color(bg2)
                    opacity .7
                    border-radius: 10px;
                    display flex
                    flex-wrap nowrap
                    justify-content center
                    align-items center
                    padding-top 15px

                    li
                        flex 1
                        padding-left 20px
                        position relative

                        .title
                            font-size: 16px;
                            font_color(fc3);

                        .num
                            line-height 60px
                            font-size: 30px;
                            font_color(fc2);

                        &:not(:last-child):after
                            content ''
                            display block
                            width 1px
                            height 90px
                            bg_color(btn_bg_ng)
                            right 0px
                            top 50%
                            transform translateY(-50%)
                            position absolute

            .table-list
                padding 2px 20px 30px

                .title-con
                    display flex
                    flex-wrap nowrap
                    justify-content center
                    align-items center
                    line-height 45px

                    span
                        display inline-block
                        font_color(fc3);
                        flex 1
                        align-self center
                        text-align center
                        font-size 14px

                ul
                    resetul()
                    display flex
                    flex-direction row
                    flex-wrap wrap
                    justify-content flex-start
                    align-items center

                    li
                        flex none
                        width 50%
                        display flex
                        flex-wrap nowrap
                        justify-content center
                        align-items center
                        line-height 45px

                        span
                            font_color(fc2);
                            flex 1
                            align-self center
                            text-align center
                            font-size 14px



    .order-list-con
        margin-top -20px
        bg_color(bg2)
        border-bottom-right-radius 10px
        border-bottom-left-radius 10px
        border-top 1px solid #f0f4fe
        margin-bottom 20px
        font-size 12px
        .order-list
            display flex
            flex-direction row
            flex-wrap nowrap
            .order-con
                margin 10px
                flex 1
                border 1px solid #f0f4fe
                border-radius 10px
                .top
                    display flex
                    flex-direction row
                    justify-content center
                    align-items center
                    margin 10px 10px 30px 10px
                    .status
                        flex none
                        width 60px
                        height 24px
                        line-height 24px
                        text-align center
                        border-radius 12px
                        &.success
                            background-color #b3e19d
                            color #67c23a
                        &.fail
                            background-color #fbc4c4
                            color #f56c6c
                        &.middle
                            background-color #a0cfff
                            color #409eff
                        &.start
                            background-color #fdf6ec
                            color #e6a23c

                    .detail
                        flex 1
                        text-align right
                        color #409eff
                        cursor pointer
                        &.error
                            color #f56c6c

                .down
                    .per-title
                        color #808080
                        padding-left 10px
                        min-height 18px
                        .yellow
                            color #e6a23c
                        .red
                            color #f56c6c
                    .progress-con
                        display flex
                        flex-direction row
                        justify-content center
                        align-items center
                        padding 10px
                        margin-bottom 20px
                        .progress-obj
                            flex 1
                            position relative
                            .progress-father
                                border-radius 4px
                                height 6px
                                background-color #cccccc
                                margin-right 2px
                            .progress-child
                                border-radius 4px
                                height 6px
                                background-color #e6a23c
                                top -6px
                                position relative
                                width 80%
                        .progress-title
                            flex none
                            padding-bottom 4px
                            padding-left 2px
                            color #808080
        .tips
            text-align right
            color #808080
            margin 10px
            padding-bottom 20px
            .service-link
                cursor pointer
    // 订单详情
    .draw-detail
        .dialog-con
            width 810px
            min-height 300px
            color #808080
            .title-con
                display flex
                flex-direction row
                justify-content center
                align-items center
                font-size 14px
                margin-bottom 10px
                .send-money
                    flex none
                    font-size 18px
                    font-weight 600
                    color #666666
                .all-money
                    flex none
                .status
                    flex none
                    display inline-block
                    width 60px
                    height 24px
                    line-height 24px
                    text-align center
                    border-radius 12px
                    font-size 12px
                    margin-left 10px
                    &.success
                        background-color #b3e19d
                        color #67c23a
                    &.middle
                        background-color #a0cfff
                        color #409eff
                    &.start
                        background-color #fdf6ec
                        color #e6a23c
                    &.fail
                        background-color #fbc4c4
                        color #f56c6c
            .tip-msg
                color #dba057
                text-align center
                font-size 14px
            .service-con
                text-align center
                font-size 14px
                margin 10px auto
                .service-link
                    cursor pointer
            .data-con
                display flex
                flex-direction row
                justify-content flex-start
                align-items flex-start
                flex-wrap wrap
                margin-bottom 20px
                //border 1px solid #eaeaea
                border-radius 8px

                .data-item
                    flex none
                    width 50%
                    display flex
                    flex-direction row
                    justify-content flex-start
                    align-items center
                    height 36px
                    font-size 14px
                    color #808080
                    .lable
                        flex none
                        width 66px
                        text-align right
                        margin-right 20px

                    .text
                        flex 1

                    .gold
                        color #dba057
                        font-size 18px
                        font-weight 600

            .title-list
                display flex
                flex-direction row
                background-color #d3d3e6
                height 45px
                line-height 45px
                color #454a53
                border-radius 6px

                span
                    flex 1
                    text-align center
                    &.money
                        flex .5

                    &.status
                        flex .5
            ul
                list-style none
                padding 0
                margin 0
                max-height 360px
                overflow-y auto
                margin-bottom 10px
                min-height 150px

                li
                    text-align center
                    height 36px
                    line-height 36px
                    display flex
                    flex-direction row
                    justify-content center
                    align-items center

                    .item
                        flex 1
                        color #808080
                        border-bottom 1px solid #eaeaea
                        text-align center
                        height: 100%;
                        display inline-block
                        white-space nowrap
                        overflow hidden
                        text-overflow ellipsis
                        &.money
                            flex .5

                        &.status
                            flex .5
                        &.order
                            position relative
                            display inline-block
                            white-space nowrap
                            overflow hidden
                            text-overflow ellipsis

                            .copy
                                border 1px solid #2989eb
                                border-radius 4px
                                text-align center
                                position absolute
                                width 30px
                                display flex
                                flex-direction row
                                justify-content center
                                align-items center
                                height 18px
                                right 0px
                                top 50%
                                transform translateY(-50%)
                                color #2989eb
                                cursor pointer

                        &.success
                            color #67c23a
                        &.middle
                            color #409eff
                        &.start
                            color #e6a23c
                        &.fail
                            color #f56c6c
.service-dialog
    /deep/.dialog-content
        .ifram-con
            font-family: initial;
        .dialog-main
            padding 0 !important
        .dialog-header
            height auto !important
</style>
