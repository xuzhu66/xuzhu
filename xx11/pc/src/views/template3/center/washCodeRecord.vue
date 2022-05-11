<template lang="pug">
    .washCodeRecord
        assets
        .com-tab
            ul
                li  洗码记录
            .all-list
                span 总返水金额(元)：
                span.money {{sumAmount | format}}

        .table-con
            ul
                li.title
                    span 返水业务时间
                    span 返水金额
                    span 注单数
                    span 投注额
                    span 有效投注额
                    span 输赢金额
                li.con(v-for="item in tableList")
                    span {{item.bizDate}}
                    span {{item.amount | format}}
                    span {{item.betNum}}
                    span {{item.betAmount | format}}
                    span {{item.validBetAmount | format}}
                    span {{item.winAmount | format}}


        //.page-list
            comPagination(:total="total",@change="getPageEnv")
        .nodata-con
            .nodata(v-if="tableList.length == 0")
</template>

<script>
import comPagination from "@pon/template3/comPagination"
import assetslist from "./assetsList";
import {mapGetters, mapState, mapMutations, mapActions} from 'vuex';
import thatStore from "@/store/comstore/center/business/washCodeRecordStore"; // 获取模板
import store from '@/store/Store';
import {formatAmount} from "@m/utils";

export default {
    name: "washCodeRecord",
    components: {
        comPagination,
        //comDatepicker,
        //comDialog
        "assets": assetslist,
    },
    data() {
        return {
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
        }
    },
    computed: {
        ...mapState({
            tableList: state => state['washCodeRecordStore'].tableList,
            tableListData: state => state['washCodeRecordStore'].tableListData,
            sumAmount: state => state['washCodeRecordStore'].sumAmount,
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
        if (!store.state["washCodeRecordStore"]) {
            thatStore.install(this);
        }
        this.getWashingListFun()
    },
    methods: {
        ...mapActions({
            getWashingListFun(dispatch, param) {
                return dispatch(`washCodeRecordStore/getWashingListAction`, param);
            },

        }),
        selectType(item) {
            this.currtTable = item;
        },
        selectTime(item) {
            this.currtTime = item;
        },
        //分页
        getPageEnv(num) {
            this.order.page = num;
            this.getWashingListFun();
        },


    }

}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template3/themes/mixin.styl'
@import "~@styl/template3/common/fun.styl"

.washCodeRecord
    padding-bottom 60px

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
            align-items flex-start
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
                    font_color(fc3)

                &.active
                    font_color(fc3)

                    &:after
                        content ''
                        display block
                        width 100px
                        height 4px
                        bg_color(bg3)
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
                bg_color(bg4)
                position absolute
                top 50%
                transform translateY(-50%)
                right 240px

            span
                &.money
                    font_color(fc3)

    .table-con
        padding 10px 10px 60px
        font_color(fc3);
        bg_color(bg2);

        ul
            resetul()

            li
                line-height 45px
                width 100%
                display flex
                flex-direction row
                flex-wrap nowrap
                justify-content center
                align-items center

                &:hover
                    font_color(fc3)
                    bg_color(bg2);

                &.active
                    font_color(fc3)

                &.title
                    height: 40px;
                    bg_color(bg4)
                    font_color(fc3)
                    border-radius: 1px;
                    opacity: 0.5;

                    span
                        font-size: 14px;
                        font_color(fc3)

                span
                    flex 1
                    align-self center
                    display flex
                    justify-content center
                    font-size: 14px;
                    font_color(fc3)


    .nodata-con
        width 100%
        min-height 450px
        bg_color(bg2)
        padding-top 20px
</style>
