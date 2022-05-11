<template lang="pug">
    .discount-page
        Banner(:bannerType="bannerType")
        Notice
        .discount-flow
            .discount-left
                ul
                    li(v-for="(item,index) in discountTypeList" , @click="selectMenu(item,index)" , :class="index==currtMenuId?'active':''") {{item.name}}
            .discount-right
                ul
                    li(v-for="(item,index) in discountList", @click="openDiscountDialog(item)" , :class="`status${item.status}`",:style="$bgImg(item.picUrl)" )

</template>

<script>
import Banner from '@pon/template3/banner'; // Banner轮播图片
import Notice from '@pon/template3/notice';
import {mapActions, mapState} from "vuex"; // 公告栏

export default {
    name: 'discount',
    components: {
        Banner,
        Notice
    },

    data() {
        return {
            bannerType: 8, // 0 首页 1 真人娱乐 2 棋牌游戏 3 电子游戏 4 捕鱼游戏 5 彩票投注 6 电子竞技 7 体育投注 8 优惠活动
            currtMenu: '',  // 当前menu
            currtMenuId: 0,  // 当前menu
            statusObj: {
                "1": "未开始",
                "2": "进行中",
                "3": "已完成",
                "4": "已结束",
            }
        }
    },
    computed: {
        ...mapState({
            discountTypeList: state => state.homeStore.discountTypeList, // 优惠类型
            discountList: state => state.homeStore.discountList, // 优惠类型
            discountDetail: state => state.homeStore.discountDetail, // 优惠详情
        })
    },
    created() {

    },
    activated() {
        this.$setBuriedPoint('J10040');
    },
    watch: {},
    mounted() {
        this.pageInit()
    },
    methods: {
        ...mapActions({
            // 活动类型列表
            discountTypeListFun(dispatch, param) {
                return dispatch("homeStore/discountTypeListAction", param);
            },
            // 活动类型列表-- id:活动类型id
            discountListFun(dispatch, id) {
                return dispatch("homeStore/discountListAction", {id: id});
            },
            // 活动详情-- id:活动类型id
            discountDetailFun(dispatch, id) {
                return dispatch("homeStore/discountDetailAction", {id: id});
            },

        }),
        pageInit() { // 构造方法
            // 类型查询
            this.discountTypeListFun().then(res => {
                if (res && res.success) {
                    // 列表查询
                    this.discountListFun(res.data[0].id);
                }
            })
        },
        // 选中菜单
        selectMenu(item, index) {
            this.currtMenu = item;
            this.currtMenuId = index;
            // 查询活动
            this.discountListFun(item.id);
        },
        // 打开活动弹框--活动详情
        openDiscountDialog(item) {
            window.win.myloading.show();
            this.discountDetailFun(item.id).then(res => {
                window.win.myloading.hidden();
                if (res && res.success) {
                    this.$myDialog({title: '活动详情', con: res.data.content, diatxtClass: true}, (res) => {

                    });
                }
            })
        }
    }
}
</script>
<style lang="stylus" scoped>
@import '~@/assets/styles/template3/themes/mixin.styl'
@import "~@styl/template3/common/fun.styl"

.discount-page
    position relative
    min-height: 1200px

    .discount-flow
        width 1200px
        margin 36px auto 60px
        flexcon()
        justify-content flex-start
        align-items flex-start

        .discount-left
            width 200px
            min-height 200px
            border-radius 10px
            bg_color(bg2)
            padding 30px 0

            ul
                resetul()
                border-radius 10px

                li
                    height 68px
                    line-height 68px
                    text-align center
                    font-size: 20px;
                    font_color(fc2)
                    cursor pointer
                    transition ease-in-out .3s

                    &.active
                        font_color(fc4)

                        &:after
                            after()
                            background url("~@img/template3/home/bg/fenlei.png") center / contain no-repeat
                            width 200px
                            height 1px

                    &:hover
                        font_color(fc4)

        .discount-right
            flex none
            width 960px
            margin-left 40px
            min-height 600px

            ul
                resetul()

                li
                    cursor pointer
                    width: 960px;
                    height: 260px;
                    bg_color(bg2)
                    border-radius: 6px;
                    margin-bottom 20px
                    transition ease-in-out .3s
                    position relative
                    cursor pointer

                    &:hover
                        transform scale(1.02)
                        box_shadow(shadow_yellow2)

                    &:after
                        after()
                        width 88px
                        height 96px
                        top: -10px;
                        right: -4px;
                        z-index 1

                    &.status1
                        &:after
                            background url("~@img/template3/preferent/pstate0.png") 0px center / 100% no-repeat

                    &.status2
                        &:after
                            background url("~@img/template3/preferent/pstate1.png") 0px center / 100% no-repeat

                    &.status3
                        &:after
                            background url("~@img/template3/preferent/pstate2.png") 0px center / 100% no-repeat

                    &.status4
                        //filter: grayscale(100%)

                        &:after
                            background url("~@img/template3/preferent/pstate3.png") 0px center / 100% no-repeat


</style>
