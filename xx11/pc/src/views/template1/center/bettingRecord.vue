<template lang="pug">
    .bettingRecord
        assets
        .com-tab
            ul
                li  投注记录
        .search-con
            .item
                .name 线路:
                ul(:class="more?'close':'open'")
                    li(@click="selectType(item)",:class="currtItem.lineChName==item.lineChName?'active':''",v-for="item in bettingLine") {{item.lineChName?item.lineChName:item.lineName}}

                .more(@click="openMore")
                    span(v-if="more")  展开
                    span(v-if="!more") 收起

            .item
                .name 时间:
                comDatepicker(@putTimeEvent="getTimeEvent")
                //.search-item.ok(@click="searchList")
                    span 确定

        //存款
        .table-con
            .item-con
                .item.title(v-if="tableList && tableList.length>0")
                    span.title 投注时间
                    span.title 订单编号
                    span.title 线路名称
                    span.title 游戏类型
                    span.title 下注金额
                    span.title 有效投注
                    span.title 派彩金额
                    span.title 输赢金额
                    span.title 结算状态
                    span.title 是否返水
                    span.title 返水状态
                    span.title 结算时间
                    span.title 投注内容

                .item.con(v-for="item in tableList")
                    span {{item.betTime}}
                    span {{item.orderNo}}
                    span {{item.lineName}}
                    span {{item.gameTypeName}}
                    span {{item.betAmount}}
                    span {{item.validBetAmount | format}}
                    span {{item.payouAmount | format}}
                    span {{item.winLossAmount | format}}
                    span.js-status(:class="'status'+item.settleStatus") {{item.settleStatus?"已结算":"未结算"}}
                    span {{item.refrenceReturnAmount?"是":"否"}}
                    span {{item.returnAmountStatus?"已返水":"未返水"}}
                    span {{item.settleTime}}
                    span.detail-con {{item.betContent1}}
                        span.detail2 {{item.betContent}}

        .foot-con
            .money-list(v-if="tableList && tableList.length>0")
                .money-left
                    .name 投注数量(单)：
                    .number {{amount.totalBetOrderRecords}}
                .money-left
                    .name 有效投注额(元)：
                    .number ¥{{amount.totalValidBetAmount | format}}
                .money-right
                    .name 输赢金额(元)：
                    .number ¥{{amount.totalWinLoss | format}}

            .page-list(v-if="tableList && tableList.length>0")
                comPagination(:total="tableListData.total",@change="getPageEnv")
            .nodata(v-if="tableList && tableList.length == 0")

</template>

<script>
import comPagination from "@pon/template1/comPagination"
import assetslist from "./assetsList";
import comDatepicker from "@pon/template1/comDatepicker"
import comDialog from "@pon/template1/comDialog"
import {formatAmount, formatDate} from '@m/utils'
import {mapGetters, mapState, mapMutations, mapActions} from 'vuex';
import thatStore from "@/store/comstore/center/business/bettingRecordStore"; // 获取模板
import clipboard from "clipboard"
import store from '@/store/Store';

export default {
    name: "bettingRecord",
    components: {
        comPagination,
        comDatepicker,
        comDialog,
        "assets": assetslist,
    },
    data() {
        return {
            isReqFlag: true, // 请求是否结束
            showDialog: false,// 弹框显示
            currtItem: '', //{lineId: 0, lineName: "全平台", balance: "", start: 0}
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
            dataType: '',//时间标识
            current: 1,// 当前页
            size: 10, // 每页的数量

            more: true, // 更多 , false: 可展开, true:可收起
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state['centerStore'].userInfo,
            tableList: state => state['bettingRecordStore'].tableList,
            tableListData: state => state['bettingRecordStore'].tableListData,
            bettingLine: state => state['bettingRecordStore'].bettingLine,
            amount: state => state['bettingRecordStore'].amount,
        }),
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
        if (!store.state["bettingRecordStore"]) {
            thatStore.install(this);
        }
        this.getBettingLineFun().then(res => {
            if (res && res.success) {
                this.currtItem = res.data[0];
            }
        })
    },
    methods: {
        ...mapActions({
            getBettingListFun(dispatch, param) {
                return dispatch(`bettingRecordStore/getBettingListAction`, param);
            },
            getBettingLineFun(dispatch, param) {
                return dispatch(`bettingRecordStore/getBettingLineAction`, param);
            },
            getBettingAmountFun(dispatch, param) {
                return dispatch(`bettingRecordStore/getBettingAmountAction`, param);
            },
        }),
        selectType(item) {
            this.currtItem = item;
            this.resetPageSize()
            this.searchList()
        },
        selectTime(item) {
            this.currtTime = item;
        },
        //分页
        getPageEnv(num) {
            this.current = num;
            this.searchList();
        },
        //时间事件
        getTimeEvent(obj) {
            this.startDate = formatDate(obj.startTime, true) + " 00:00:00";
            this.endDate = formatDate(obj.endTime, true) + " 23:59:59";
            this.dataType = obj.dataType + "";
            this.resetPageSize()
            this.searchList()
        },
        searchList() {
            let that = this;
            // 判断是否是请求中
            if (this.isReqFlag) {
                this.isReqFlag = false;
            } else {
                return;
            }
            let obj = this.getSearchParam();
            this.getBettingListFun(obj).then(function () {
                that.isReqFlag = true;
            });
            this.getBettingAmountFun(obj);
        },
        getSearchParam() {
            let param = {
                lineId: this.currtItem.lineId,
                //startTime:this.startDate,// 订单开始时间
                //endTime:this.endDate,// 订单结束时间
                dataType: this.dataType,// 时间类型 null 全部 1、今日 2、昨日 3、近3天 4、近7天 5、近10天 6、近15天 7、本月 8、最近60
                query: {
                    current: parseInt(this.current), // 当前页
                    size: parseInt(this.size), // 每页的数量
                },
            }
            return param;
        },
        //展开更多
        openMore() {
            this.more = !this.more;
        },
        resetPageSize() {
            this.current = 1;// 当前页
            this.size = 10; // 每页的数量
        }
    }

}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template1/themes/mixin.styl'
@import "~@styl/template1/common/fun.styl"

::-webkit-scrollbar
    width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 8px;

.bettingRecord
    .money-list
        height: 125px;
        //bg_color(bg2)
        border-radius: 10px;
        display flex
        flex-direction row
        flex-wrap nowrap
        justify-content center
        align-items center
        opacity .8
        margin-bottom 20px
        //box-shadow 0px 8px 20px 0px rgba(204, 204, 204, 0.5)
        background-color #d3d9e5
        color #6a7180
        .money-left
            flex 1
            height 100%
            display flex
            flex-direction column
            justify-content center
            align-items flex-start
            padding-left 30px
            position relative

            &:after
                content ''
                display block
                width 1px
                height 90px
                background-color #bcc1cc
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
            align-items flex-start
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
            font_color(fc4)
            right 20px
            top 10px
            cursor pointer

    .com-tab
        width 100%
        height: 70px;
        line-height 70px
        font-size: 20px;
        letter-spacing: 0px;
        font_color(fc06);
        bg_color(bg04);
        border-radius: 10px 10px 0px 0px;
        border_com(1px, solid, border08, bottom)
        position relative
        transition all .3s

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
                    font_color(fc015)

                &.active
                    font_color(fc015)

                    &:after
                        content ''
                        display block
                        width 100px
                        height 4px
                        bg_color(bg12)
                        bottom 2px
                        left 50%
                        transform translateX(-50%)
                        position: absolute;
                        border-radius: 4px;

    .search-con
        bg_color(bg04)
        padding: 10px 20px 2px 10px;

        .item
            display flex
            flex-direction row
            flex-wrap nowrap
            position relative
            margin-bottom 20px

            .name
                font-size: 14px;
                font_color(fc05);
                flex none
                width 50px
                line-height 30px

            ul
                resetul()
                display flex
                flex-direction row
                flex-wrap wrap
                flex none
                width 780px
                transition all 1s

                &.close
                    height: 30px;
                    overflow: hidden;

                li
                    text-align center
                    line-height 36px
                    flex none
                    font-size: 14px;
                    font_color(fc017)
                    position relative
                    cursor pointer
                    margin-right 30px

                    &.submit-btn
                        width: 63px;
                        height: 30px;
                        line-height 30px
                        bg_color(bg18)
                        border-radius: 5px;

                    &.active
                        font-size: 14px;
                        font_color(fc026)

                        &:after
                            content ''
                            display block
                            border-radius 2px
                            width: 100%;
                            height: 3px;
                            bg_color(bg18)
                            position absolute
                            bottom 0px
                            left 50%
                            transform translateX(-50%)

            .more
                position absolute
                right 20px
                top 6px
                font_color(fc027)
                cursor pointer
                font-size 14px

    .search-item
        cursor: pointer;
        width: 63px;
        height: 30px;
        line-height: 30px;
        bg_color(bg18)
        border-radius: 5px;
        font-size: 14px;
        font_color(fc017)
        text-align: center;
        margin-left: 10px;

    .table-con
        bg_color(bg04)
        padding 2px 10px 30px
        border-radius 0 0 10px 10px
        overflow: auto;

        .item-con
            display table

            .item
                position relative
                line-height 45px
                display flex
                flex-direction row
                flex-wrap nowrap
                justify-content center
                align-items center
                list-style none
                padding-right 10px

                span
                    flex none
                    width 200px
                    font-size: 14px;
                    font_color(fc017)
                    position relative
                    display inline-block
                    text-align: center;

                    &:last-child
                        width 360px

                    &.title
                        height: 40px;
                        bg_color(bg13)
                        border-radius: 1px;
                        opacity: 0.8;

                    &.detail-con
                        display inline-block
                        white-space nowrap
                        text-overflow ellipsis

                        &:hover
                            .detail2
                                display block

                        .detail2
                            overflow auto
                            display: none;
                            width: 500px;
                            min-height: 90px;
                            position: absolute;
                            top: -33px;
                            right: 300px;
                            z-index: 999;
                            font-size: 12px;
                            font_color(fc028)
                            bg_color(bg04);
                            border_all(1px, solid, border15)

                            //box-shadow: 0 0 14px 0 rgba(0,0,0,.5);
                            border-radius: 11px;

                    &.js-status
                        color #339dff

                        &.status1
                            color green

    .foot-con
        bg_color(bg04)
        padding 0px 10px
        border-radius 0px 0px 10px 10px
        padding-top 20px
</style>

