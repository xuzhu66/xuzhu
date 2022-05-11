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
                .order-con
                    .top
                        .status.success 审核中
                        .detail 详情>>
                    .down
                        .per-title
                            span 已完成(
                            span.yellow 0
                            span /100)
                        .progress-con
                            .progress-obj
                                .progress-father
                                .progress-child
                            .progress-title 0%

                .order-con
                    .top
                        .status.middle 审核中
                        .detail 详情>>
                    .down
                        .per-title
                            span 已完成(
                            span.yellow 0
                            span /100)
                        .progress-con
                            .progress-obj
                                .progress-father
                                .progress-child
                            .progress-title 0%

                .order-con
                    .top
                        .status.start 审核中
                        .detail 详情>>
                    .down
                        .per-title
                            span 已完成(
                            span.yellow 0
                            span /100)
                        .progress-con
                            .progress-obj
                                .progress-father
                                .progress-child
                            .progress-title 0%

            .tips *如已完成的取款未到账，请尽快联系在线客服处理！

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

</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import store from '@/store/Store';
import rootStore from "@/store/comstore/center/business/assetsOverviewStore"; // 获取模板
import {formatAmount, thousandBitForma, formatDate, numHidf3l4} from '@m/utils' // 工具类
import comDatepicker from "@pon/template1/comDatepicker"
import comDialog from '@pon/template1/comDialog'
import vipDialog from './vipDialog'

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
        }
    },
    computed: {
        ...mapState({
            commonData: state => state['centerStore'].commonData,
            userInfo: state => state['centerStore'].userInfo,
            wallet: state => state['centerStore'].wallet,
            amountDetail: state => state['assetsOverviewStore'].amountDetail,
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
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template1/themes/mixin.styl'
@import "~@styl/template1/common/fun.styl"

.assetsOverview
    .dialog-flow
        width: 100%;
        height: 100%;
        bg_color(bg44)
        opacity: .1;
        position: fixed;
        top: 0;
        left: 0;
        z-index 2;

    .dialog-con
        .jump-con
            min-height 200px
            min-width 500px

            .success-icon
                background url("~@img/template1/home/success.svg") center / contain no-repeat
                width 60px
                height 60px
                margin 10px auto
                font_color(fc019)

            .title
                font-size: 16px;
                font_color(fc06);
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
                    font_color(fc020)
                    border-radius: 10px;
                    font-size 18px
                    margin 40px auto 14px
                    bg_color(bg15)

                    &.ok
                        line-height 60px
                        text-align center
                        font-size: 18px;
                        font_color(fc01);
                        bg_img_linear(linear02, linear03)
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
            font_color(fc06);
            bg_color(bg04);
            border-radius: 10px 10px 0px 0px;
            border_com(1px, solid, border08, bottom)
            position relative

            .refesh
                width: 50px;
                height: 12px;
                font-size: 12px;
                letter-spacing: 0px;
                font_color(fc05);
                float right
                margin-right 0px
                cursor pointer

        .user
            bg_color(bg04)
            border-radius: 10px 10px 0 0

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
                        bg_color(bg16)
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
                                        background url("~@img/template1/center/user.png") center no-repeat

                                    .item-top
                                        display: flex;
                                        flex-direction: row;
                                        align-items: center;

                                        .name
                                            font-size: 20px;
                                            font_color(fc06);

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
                                        //    background url("~@img/template1/comm/vip0.png") center no-repeat
                                        //
                                        //.vipLevel2
                                        //    background url("~@img/template1/comm/vip1.png") center no-repeat
                                        //
                                        //.vipLevel3
                                        //    background url("~@img/template1/comm/vip2.png") center no-repeat
                                        //
                                        //.vipLevel4
                                        //    background url("~@img/template1/comm/vip3.png") center no-repeat
                                        //
                                        //.vipLevel5
                                        //    background url("~@img/template1/comm/vip4.png") center no-repeat
                                        //
                                        //.vipLevel6
                                        //    background url("~@img/template1/comm/vip5.png") center no-repeat
                                        //
                                        //.vipLevel7
                                        //    background url("~@img/template1/comm/vip6.png") center no-repeat

                                    .claz
                                        padding-top 10px
                                        font-size: 12px;
                                        font_color(fc05);

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
                                    background url("~@img/template1/center/geren.png") center no-repeat
                                    width 30px
                                    height 30px

                                    &.ok
                                        background url("~@img/template1/center/nameok.png") center no-repeat

                                .icon-card
                                    flex: 1
                                    background url("~@img/template1/center/yinhagk.png") center no-repeat
                                    width 30px
                                    height 30px

                                    &.ok
                                        background url("~@img/template1/center/cardok.png") center no-repeat

                                .icon-phone
                                    flex: 1
                                    background url("~@img/template1/center/shouji.png") center no-repeat
                                    width 30px
                                    height 30px

                                    &.ok
                                        background url("~@img/template1/center/mobileok.png") center no-repeat

                            &:nth-child(3)
                                height 40px
                                line-height 40px
                                text-align right
                                font-size: 12px;
                                letter-spacing: 0px;
                                font_color(fc021)
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
                                        font_color(fc022)

                                    .num-acount
                                        height 30px
                                        font-size: 30px;
                                        letter-spacing: 0px;
                                        font_color(fc06);
                                        font-weight 500
                                        padding-top 10px

                                    &:nth-child(3)
                                        flex 1
                                        text-align right
                                        padding-right 20px
                                        font-size: 12px;
                                        font_color(fc021)
                                        cursor pointer

                            &:nth-child(2)
                                margin-top 20px
                                display flex
                                justify-content flex-start

                                .btn
                                    width: 150px;
                                    height: 50px;
                                    line-height 50px
                                    border-radius: 10px;
                                    text-align center
                                    margin-right 24px
                                    bg_img_linear(linear02, linear03)
                                    background-blend-mode: normal, normal;
                                    //box-shadow: 0px 5px 15px 0px rgba(83, 59, 18, 0.05);
                                    border-radius: 10px;
                                    font-size: 16px;
                                    font_color(fc01);

                                    &.deposit
                                        border-radius: 10px;
                                        border_all(1px, solid, border11)
                                        bg_color(bg04)
                                        font_color(fc015)
                                        background-image none

        .line
            bg_color(bg04)
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
                    border_all(1px, solid, border12)

                    .line-top
                        display flex
                        height 40%
                        padding 10px 18px 0px

                        .line-name
                            flex 1
                            font-size: 18px;
                            font_color(fc07);

                        //padding-top 15px

                        .line-btn
                            text-align center
                            width: 68px;
                            height: 24px;
                            line-height 24px
                            font_color(fc023)
                            border-radius: 12px;
                            border_all(1px, solid, border13)
                            flex 1
                            cursor pointer

                            &.closed
                                font_color(fc01)
                                border_all(1px, solid, border04)
                                bg_color(bg17)
                                opacity .6

                    .line-center
                        .game
                            font-size 14px
                            padding-left 20px
                            font_color(fc024)

                    .line-num
                        padding 0px 20px 10px
                        font-size: 24px;
                        font_color(fc06);

                        .money-icon
                            font-size 18px

            .more
                height: 30px;
                line-height 30px
                text-align center
                font-size: 14px;
                letter-spacing: 0px;
                font_color(fc025)
                position relative
                cursor pointer

                .fh
                    margin-left 10px
                    transition all .2s

                    &:before
                        content ''
                        display: inline-block;
                        border_com(1px, solid, border14, top)
                        border_com(1px, solid, border14, right)
                        width: 8px;
                        height: 8px;
                        transform: rotate(135deg);
                        position absolute
                        top 10px

                    &:after
                        content ''
                        display: inline-block;
                        border_com(1px, solid, border14, top)
                        border_com(1px, solid, border14, right)
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
            bg_color(bg04)
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
                    font_color(fc018)

                    &.time
                        margin 0 10px

                    &.ok
                        cursor pointer
                        width: 63px;
                        height: 30px;
                        line-height 30px
                        line-height: 30px;
                        bg_color(bg18)
                        border-radius: 5px;
                        font-size: 14px;
                        font_color(fc017)
                        text-align center
                        margin-left 10px

            .statistics
                margin 0px 10px
                padding 0px 10px

                ul
                    resetul()
                    height: 100px;
                    bg_color(bg10)
                    opacity .7
                    border-radius: 10px;
                    display flex
                    flex-wrap nowrap
                    justify-content center
                    align-items center

                    li
                        flex 1
                        padding-left 20px
                        position relative

                        .title
                            font-size: 16px;
                            font_color(fc05);

                        .num
                            line-height 60px
                            font-size: 30px;
                            font_color(fc06);

                        &:not(:last-child):after
                            content ''
                            display block
                            width 1px
                            height 90px
                            bg_color(bg19)
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
                        font_color(fc07);
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
                            font_color(fc07);
                            flex 1
                            align-self center
                            text-align center
                            font-size 14px



    .order-list-con
        margin-top -20px
        bg_color(bg04)
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
                .down
                    .per-title
                        color #808080
                        padding-left 10px
                        .yellow
                            color #e6a23c
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
        .tips
            text-align right
            color #808080
            margin 10px
            padding-bottom 20px
</style>
