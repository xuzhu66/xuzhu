<template lang="pug">
    .message
        assets
        .com-tab
            ul
                li(@click="backToList")
                    span 消息中心
                    span(v-if="detailFlag") > 消息详情

        .table-con(v-if="!detailFlag")
            ul
                li.title
                    span 标题
                    span 内容
                    span 发布时间
                li.con(v-for="(item,index) in tableList",@click="openDetail(item,index)")
                    //span.elli {{item.title}}
                    //span.elli {{item.content}}
                    span.elli(v-html="item.title")
                    span.elli(v-html="item.content")
                    span {{item.auditTime}}

        .page-list(v-if="tableList.length>0 && !detailFlag")
            comPagination(:total="tableListData.total",@change="getPageEnv")
        .nodata(v-if="tableList.length == 0 && !detailFlag")


        .detail-con(v-if="detailFlag")
            //.title-con
            //    span.name {{tableList[currtIndex].title}}
            //    span.time {{tableList[currtIndex].auditTime}}
            //.article {{tableList[currtIndex].content}}
            .title-con
                span.name(v-html="tableList[currtIndex].title")
                span.time {{tableList[currtIndex].auditTime}}
            .article(v-html="tableList[currtIndex].content")

            .preArticle(v-if="currtIndex",@click="preMsg")
                span 上一篇：
                span {{tableList[currtIndex-1].title}}
            .nextArticle(v-if="currtIndex != (tableList.length-1)",@click="nextMsg")
                span 下一篇：
                span {{tableList[currtIndex+1].title}}

</template>

<script>
import comPagination from "@pon/template1/comPagination"
import assetslist from "./assetsList";
import {mapGetters, mapState, mapMutations, mapActions} from 'vuex';
import thatStore from "@/store/comstore/center/business/messageStore"; // 获取模板
import store from '@/store/Store';

export default {
    name: "message",
    components: {
        comPagination,
        //comDatepicker,
        //comDialog
        "assets": assetslist,
    },
    data() {
        return {
            isReqFlag: true, // 请求是否结束
            //数据列表
            data: [],
            //总条数
            total: 100,
            //当前选中的行
            capitalInfo: "",
            detailFlag: false,//

            current: 1,// 当前页
            size: 10, // 每页的数量

            currtItem: '',// 当前选中公告
            currtIndex: '',// 当前选中公告index
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state['centerStore'].userInfo,
            tableList: state => state['messageStore'].tableList,
            tableListData: state => state['messageStore'].tableListData,
        }),
    },
    created() {
        // 动态store
        if (!store.state["messageStore"]) {
            thatStore.install(this);
        }

    },
    mounted() {
        this.getList()
    },
    methods: {
        ...mapActions({
            getMsgListActionFun(dispatch, param) {
                return dispatch(`messageStore/getMsgListAction`, param);
            },
        }),
        //分页
        getPageEnv(num) {
            this.current = num;
            this.getList();
        },
        getList() {
            let that = this;
            // 判断是否是请求中
            if (this.isReqFlag) {
                this.isReqFlag = false;
            } else {
                return;
            }
            let obj = this.getSearchParam();
            this.getMsgListActionFun(obj).then(function () {
                that.isReqFlag = true;
            });
        },
        getSearchParam() {
            let param = {
                query: {
                    current: parseInt(this.current), // 当前页
                    size: parseInt(this.size), // 每页的数量
                },
            }
            return param;
        },
        openDetail(item, index) {
            this.currtItem = item;
            this.currtIndex = index;
            this.detailFlag = true;

        },
        backToList() {
            this.detailFlag = false;
        },
        preMsg() {
            this.currtIndex = this.currtIndex - 1;
        },
        nextMsg() {
            this.currtIndex = this.currtIndex + 1;
        }
    }

}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template1/themes/mixin.styl'
@import "~@styl/template1/common/fun.styl"

.message
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
        position relative

        ul
            resetul()
            display flex
            flex-wrap nowrap
            justify-content flex-start

            li
                flex none
                width 380px
                text-align left
                position relative
                cursor pointer
                padding-left 20px

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

        .all-list
            position absolute
            top 0px
            right 20px
            font-size: 16px;
            font_color(fc05);

            &:before
                content ''
                display block
                width 1px
                height 50px
                bg_color(bg13)
                position absolute
                top 50%
                transform translateY(-50%)
                right 240px

            span
                &.money
                    font_color(fc023)

    .table-con
        bg_color(bg04)
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
                    bg_color(bg13)

                &.title
                    height: 40px;
                    bg_color(bg13)
                    border-radius: 1px;
                    opacity: 0.5;

                    span
                        font-size: 14px;

                span
                    flex 1
                    align-self center
                    font-size: 14px;
                    font_color(fc017)
                    padding 0px 10px

                    &:nth-child(1)
                        flex 1.5

                    &:nth-child(2)
                        flex 3


    .empty-con
        bg_color(bg04)
        padding 60px
        border-radius 0 0 10px 10px

        .img
            background url("~@img/template1/center/kongbaitu.png") center no-repeat
            width 334px
            height 287px
            margin 0 auto

    .detail-con
        bg_color(bg04)
        padding 20px
        border-radius 0 0 10px 10px

        .title-con
            span
                &.name
                    font-size: 18px;
                    font_color(fc017)

                &.time
                    font-size: 14px;
                    font_color(fc017)
                    margin-left 20px

        .article
            font-size: 14px;
            letter-spacing: 0px;
            font_color(fc017)
            margin 20px auto
            padding-bottom 30px
            border_com(1px, solid, border09, bottom)
            line-height 36px
            min-height 300px

    .preArticle
        font-size: 14px;
        font_color(fc017)
        cursor pointer

        &:hover
            font_color(fc041)

    .nextArticle
        font-size: 14px;
        font_color(fc017)
        margin-top 20px
        margin-bottom 50px
        cursor pointer

        &:hover
            font_color(fc041)


</style>
