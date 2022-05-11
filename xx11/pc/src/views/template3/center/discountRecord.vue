<template lang="pug">
    .discountRecord
        assets
        .com-tab
            ul
                li  优惠记录
            .all-list
                span 奖品总金额(元)：
                span.money {{amount | format}}
        .search-con
            .item
                .name 时间:
                comDatepicker(@putTimeEvent="getTimeEvent")
                //.search-item.ok(@click="searchList")
                    span 确定
            .item
                .name 类型:
                ul
                    li(@click="selectActivitTab(1)",:class="currtActivityTab=='1'?'active':''") 优惠活动
                    li(@click="selectActivitTab(2)",:class="currtActivityTab=='2'?'active':''") 营销活动

            // 优惠活动
            .item(v-if="currtActivityTab == 1")
                .name 状态:
                ul
                    li(@click="selectOrderStatus('')",:class="orderStatus==''?'active':''") 全部
                    li(v-for="(value, name)  in activityStatus",@click="selectOrderStatus(name)",:class="orderStatus==name?'active':''") {{value}}

        .table-con(v-if="currtActivityTab == 1")
            ul
                li.title
                    span 奖励时间
                    span 活动名称
                    span 奖品类型
                    span 奖品名称
                    span 奖品价值
                    span(v-if="currtActivityTab == 1") 订单状态
                    span 实物详情

                li.con(v-for="item in tableList")
                    span {{item.modifyTime?item.modifyTime:'-'}}
                    span.act-name(@click="openActivityDetail(item)") {{item.name?item.name:'-'}}
                    span {{item.awardTypeType==1?'彩金':'实物'}}
                    span.elli {{item.awardName?item.awardName:'-'}}
                    span {{item.awardPrice | format}}
                    span(v-if="currtActivityTab == 1") {{item.statusName?item.statusName:'-'}}
                    span.yellow(v-if="item.awardTypeType==2",@click="openPicDialog(item)") 预览
                    span(v-else) -

        .table-con(v-if="currtActivityTab == 2")
            ul
                li.title
                    span 奖励时间
                    span 活动名称
                    span 奖品类型
                    span 奖品名称
                    span 奖品价值
                    span 实物详情

                li.con(v-for="item in tableList")
                    span {{item.sendTime?item.sendTime:'-'}}
                    span.act-name(@click="openActivityDetail(item)") {{item.promoteActivityName?item.promoteActivityName:'-'}}
                    span {{item.awardTypeName}}
                    span.elli {{item.awardName?item.awardName:'-'}}
                    span {{item.awardPrice | format}}
                    span.yellow(v-if="item.awardType==2",@click="openPicDialog(item)") 预览
                    span(v-else) -

        .page-list(v-if="tableList.length>0")
            comPagination(:total="tableListData.total",@change="getPageEnv")
        .nodata-con
            .nodata(v-if="tableList.length == 0")

        .vprec-spic.h520(v-if="showPic")
            comBanner(:banner="images",:height="height")
            .vprce-close(@click="closePrePic()")
                svg-icon(icon-class='close')
        .bg(v-if="showPic" )

        comDialog(:show-footer='false',:show="showDialog",@on-cancel="closeDialog")
            div(slot="header") 详情预览
            div.dialog-con(slot="default")
                .liwu-con
                    .swiper(v-if="images && images.length>0")
                        comBanner(:banner="images",:height="height")
                    .swiper(v-else)
                        .img
                .detail-con
                    .title 相关信息:
                    .item
                        p 快递公司:
                        p {{currtItem.expressCompany}}
                    .item
                        p 快递单号:
                        p
                            span {{currtItem.expressNo}}
                            span.vd-copy02(:data-clipboard-text="currtItem.expressNo" @click="copySub('vd-copy02')") 复制



            div(slot="footer")
</template>

<script>
import Vue from 'vue';
import comPagination from "@pon/template3/comPagination"

import assetslist from "./assetsList";
import comDatepicker from "@pon/template3/comDatepicker"
import comDialog from "@pon/template3/comDialog"
import {formatAmount, formatDate} from '@m/utils'
import {mapActions, mapState} from 'vuex';
import thatStore from "@/store/comstore/center/business/discountRecordStore"; // 获取模板
import store from '@/store/Store';
import comBanner from './comBanner'
import {Lazyload, Swipe, SwipeItem} from 'vant';
import clipboard from "clipboard";

Vue.use(Lazyload);
export default {
    name: "washCodeRecord",
    components: {
        comPagination,
        comDatepicker,
        comDialog,
        "assets": assetslist,
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        comBanner,
    },
    data() {
        return {
            currtItem: '',
            isReqFlag: true, // 请求是否结束
            showDialog: false,// 弹框显示
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
            dataType: '',//时间标识
            current: 1,// 当前页
            size: 10, // 每页的数量

            showPic: false, // 预览是否显示
            images: [],

            height: '350px',
            // 优惠活动 状态
            activityStatus: {
                "1": "待领取",
                "2": "已领取",
                "3": "已取消",
            },
            list: [
                {
                    "id": "10",
                    "orderId": "1277185400372379649",
                    "name": "充值即送--选择充值方式--不选择充",
                    "status": "",
                    "picUrl": "",
                    "typeName": "实物",
                    "activityTypeName": "",
                    "awardTypeName": "实物类",
                    "awardType": 2,
                    "awardName": "充气娃娃",
                    "awardPrice": "1000.00",
                    "content": "",
                    "statusName": "",
                    "introduction": "",
                    "startCreateTime": "2020-06-28 18:21:43",
                    "strings": [],
                    expressCompany: "顺丰快递",
                    expressNo: "800088888"
                },
                {
                    "id": "39",
                    "orderId": "1276827918403805185",
                    "name": "测试参与范围",
                    "status": "",
                    "picUrl": "",
                    "typeName": "实物",
                    "activityTypeName": "",
                    "awardTypeName": "彩金类",
                    "awardType": 1,
                    "awardName": "茶杯",
                    "awardPrice": "302.00",
                    "content": "",
                    "statusName": "",
                    "introduction": "",
                    "startCreateTime": "2020-06-27 18:41:12",
                    "strings": []
                },
                {
                    "id": "13",
                    "orderId": "1275404963484233730",
                    "name": "和规范化股份",
                    "status": "",
                    "picUrl": "",
                    "typeName": "实物",
                    "activityTypeName": "",
                    "awardTypeName": "实物类",
                    "awardType": 2,
                    "awardName": "充气娃娃",
                    "awardPrice": "1000.00",
                    "content": "",
                    "statusName": "",
                    "introduction": "",
                    "startCreateTime": "2020-06-23 20:26:53",
                    "strings": []
                },
                {
                    "id": "11",
                    "orderId": "1275404753957777410",
                    "name": "自定义活动",
                    "status": "",
                    "picUrl": "",
                    "typeName": "实物",
                    "activityTypeName": "",
                    "awardTypeName": "实物类",
                    "awardType": 2,
                    "awardName": "充气娃娃",
                    "awardPrice": "1000.00",
                    "content": "",
                    "statusName": "",
                    "introduction": "",
                    "startCreateTime": "2020-06-23 20:26:03",
                    "strings": []
                }

            ],
            orderStatus: '', // 订单状态
            currtActivityTab:1,// 1:优惠活动 2:营销活动

        }
    },
    computed: {
        ...mapState({
            userInfo: state => state['centerStore'].userInfo,
            tableList: state => state['discountRecordStore'].tableList,
            tableListData: state => state['discountRecordStore'].tableListData,
            amount: state => state['discountRecordStore'].amount,
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
        if (!store.state["discountRecordStore"]) {
            thatStore.install(this);
        }
    },
    mounted() {
        this.searchList()
    },
    methods: {
        ...mapActions({
            getActivityAmountFun(dispatch, param) {
                return dispatch(`discountRecordStore/getActivityAmountAction`, param);
            },
            getActivityListFun(dispatch, param) {
                return dispatch(`discountRecordStore/getActivityListAction`, param);
            },
            activityDetailFun(dispatch, param) {
                return dispatch(`discountRecordStore/activityDetailAction`, param);
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
            this.current = num;
            this.searchList()
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
            this.getActivityListFun(obj).then(function () {
                that.isReqFlag = true;
            });
            this.getActivityAmountFun(obj)
        },
        getSearchParam() {
            let param = {
                //startTime:this.startDate,// 订单开始时间
                //endTime:this.endDate,// 订单结束时间
                dataType: this.dataType,// 时间类型 null 全部 1、今日 2、昨日 3、近3天 4、近7天 5、近10天 6、近15天 7、本月 8、最近60
                query: {
                    current: parseInt(this.current), // 当前页
                    size: parseInt(this.size), // 每页的数量
                },
                type: this.currtActivityTab,// 1.优惠活动 2营销奖金
            }
            // 如果是优惠活动 加上订单状态 1.待领取 2 已领取
            if (param.type == 1 ) {
                param.status = this.orderStatus;
            }
            return param;
        },
        openPicDialog(item) {
            this.currtItem = item;
            this.images = item.strings ? item.strings : []
            //this.showPic = true
            this.showDialog = true;
        },
        closePrePic() { // 预览图片是否关闭
            this.showPic = false
        },
        openActivityDetail(item) {
            let param = {
                id: item.id
            }
            //param.id = 26;
            this.activityDetailFun(param).then(res => {
                if (res && res.success) {
                    this.$myDialog({title: '活动详情', con: res.data.content, diatxtClass: true}, (res) => {

                    });
                }
            })

        },
        resetPageSize() {
            this.current = 1;// 当前页
            this.size = 10; // 每页的数量
        },
        closeDialog() {
            this.showDialog = false;
        },
        // 复制内容
        copySub(c) {
            const btnCopy = new clipboard(`.${c}`);
            btnCopy.on('success', e => {
                this.$tips.toast(`复制成功`)
                e.clearSelection();
            });
        },
        // 状态选择
        selectOrderStatus(status) {
            this.orderStatus = status;
            this.resetPageSize()
            this.searchList();
        },
        // 活动tab
        selectActivitTab(tab){
            this.currtActivityTab = tab;
            // 借用这个方法
            this.selectOrderStatus("");
        }
    },

}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template3/themes/mixin.styl'
@import "~@styl/template3/common/fun.styl"
.discountRecord
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

    .search-con
        bg_color(bg2)
        padding 16px 10px 10px 10px

        .item
            display flex
            flex-direction row
            flex-wrap nowrap
            position relative
            margin-bottom 2px

            .name
                font-size: 14px;
                font_color(fc3);
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
                    line-height 30px
                    flex none
                    width 100px
                    font-size: 14px;
                    font_color(fc3)
                    position relative
                    cursor pointer

                    &.submit-btn
                        width: 63px;
                        height: 30px;
                        line-height 30px
                        bg_color(bg3)
                        border-radius: 5px;

                    &.active
                        font-size: 14px;
                        font_color(fc4)

                        &:after
                            content ''
                            display block
                            border-radius 2px
                            width: 60%;
                            height: 3px;
                            //bg_color(bg3)
                            position absolute
                            bottom 0px
                            left 50%
                            transform translateX(-50%)

            .more
                position absolute
                right 20px
                top 10px
                font_color(fc4)
                cursor pointer

    .search-item
        cursor: pointer;
        width: 63px;
        height: 30px;
        line-height: 30px;
        bg_color(bg3)
        border-radius: 5px;
        font-size: 14px;
        font_color(fc2)
        text-align: center;
        margin-left: 10px;

    .table-con
        bg_color(bg2)
        font_color(fc3);
        padding 10px 10px 60px

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
                cursor pointer

                &:hover
                    font_color(fc3)
                    bg_color(bg2);

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
                    text-align center
                    //align-self center
                    //display flex
                    //justify-content center
                    font-size: 14px;
                    font_color(fc3)

                    &:nth-child(1)
                        flex 1.3

                    &:nth-child(2)
                        flex 2

                    &:nth-child(4)
                        flex 1.5

                    &.yellow
                        font_color(fc4)
                        cursor pointer

                    &.act-name
                        font_color(blue_c)
                        cursor pointer


    .nodata-con
        width 100%
        min-height 450px
        bg_color(bg2)
        padding-top 20px

.heg-banner
.vprec-spic
    width 100%
    height 600px
    position fixed
    top 50%
    left 50%
    z-index 11
    transform translate(-50%, -50%)

    .vprce-close
        width 30px
        height 30px
        border-radius 15px
        border_all(2px, solid, border_common)
        display flex
        justify-content center
        align-items center
        margin 10px auto
        position absolute
        top 0px
        right 120px
        z-index 13

        svg
            font_color(fc5)

.b-wh
    height 100%
    background-position center center
    background-repeat no-repeat
    cursor pointer

.dialog-con
    .liwu-con
        bg_color(bg23)

        .swiper
            .img
                height 300px
                background url("~@img/template3/center/default.jpeg") center / contain no-repeat

    .detail-con
        padding 34px 20px 0px
        font_color(fc3)

        .title
            font-size 13px
            font-weight 500
            position relative
            line-height 26px

            &:after
                content ''
                display block
                width 60px
                height 1px
                bg_color(fc3)
                position absolute
                bottom 0px
                left 0px

        .item
            display flex
            flex-direction row
            margin 20px 0px

            p
                font_color(fc3)
                line-height 30px
                font-size 14px
                flex 1

                &:nth-child(2)
                    text-align right

                .vd-copy02
                    bg_color(bg3)
                    font_color(fc6)
                    cursor pointer
                    padding 2px 6px
                    border-radius 3px
                    margin-left 10px
                    font-size 12px


/deep/ .modual-dialog
    /deep/ .dialog-content
        /deep/ .dialog-main
            padding 0px

/deep/ .slider-pagination
    visibility hidden
</style>
