<template lang="pug">
    .banner-con
        template(v-if="bannerList.length > 0")
            .banner-left
                .banner-wrap
                    img(v-if="currtBanner && currtBanner.picUrl1", :src="currtBanner && $ossImg(currtBanner.picUrl1)")
            .banner-right
                .banner-title
                    p(v-if="currtBanner && currtBanner.gameLineTitle") {{currtBanner.gameLineTitle}}
                .banner-detail
                    p(v-if="currtBanner && currtBanner.gameLineRemark") {{currtBanner.gameLineRemark}}
                .banner-feather
                    .feather(v-if="currtBanner && currtBanner.gameLineTitle",:class="'feather'+seatType")
                ul.banner-list
                    li(v-for="(item, index) in bannerList" :key="index" @click="setCurrtBanner(item)" :class="[{'active': currtBanner == item }]")
                        .banner-bg
                            img(:src="$ossImg(item.picUrl2)")
                        .name {{item.gameSeriesName}}

                .buts-con(v-if="currtBanner")
                    .common-btn.ok(@click="enterBannerFun") 立即游戏
                    .common-btn.empty(v-if="currtBanner && currtBanner.pcfreePlayFlag",@click="enterBannerFun") 开始试玩

        template(v-if="bannerList.length == 0 && showNoData")
            .nodata
</template>

<script>
import {mapActions} from "vuex";

export default {
    name: "bannerItem",
    components: {},
    props: {
        seatType: {
            type: Number,
            default: 0
        },
    },
    data() {
        return {
            currtBanner: '',// 当前选中的对象
            bannerList: [],//
            showNoData:false,// 显示无数据
        }
    },
    watch: {},
    created() {
        // 获取游戏列表
        this.getGameListFun({seatType: this.seatType}).then(res => {
            if (res && res.success) {
                this.bannerList = res.data;
                // 默认选中第一个
                this.currtBanner = this.bannerList[0];
                this.showNoData = false;
                this.closeInitAnimate()
            }else{
                this.showNoData = true;
            }
        })
    },
    mounted() {

    },
    methods: {
        ...mapActions({
            // 获取游戏列表
            getGameListFun(dispatch, param) {
                return dispatch('homeStore/gameBannerAction', param)
            },
            // 进入banner
            enterBannerAction(dispatch, param) {
                return dispatch('gameStore/enterBannerAction', param)
            },
        }),
        // 路由跳转
        jumpPage(page) {
            this.$router.push({path: page});
        },
        // 设置当前选中的banner
        setCurrtBanner(item) {
            this.animateFlag = true;
            this.closeInitAnimate();
            this.currtBanner = ""
            setTimeout(()=>{
                this.currtBanner = item;
            },100)
        },
        // 点击banner
        enterBannerFun() {
            this.enterBannerAction(this.currtBanner)
        },
        // 关闭初始化动画
        closeInitAnimate(){
            setTimeout(()=>{
                this.animateFlag = false;
            },1050)
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '~@styl/template1/themes/mixin.styl'
@import '~@styl/template1/common/fun.styl'
.banner-con
    width 1200px
    margin 0px auto
    display flex
    .nodata
        background url("~@img/template1/home/nogame.png") center no-repeat
        width: 334px;
        height: 246px;
        margin: 0px auto 0;
    .banner-left
        width 600px
        transition all 0.3s ease-in-out
        hvr-bob2()
        .banner-wrap
            transition all 0.3s ease-in-out
            &:hover
                hvr-grow()
            img
                transition all .3s ease-in-out
                animate__bounceInLeft()
    .banner-right
        width 600px
        padding-left 30px
        padding-top 150px
        .banner-title
            font-size: 45px
            font_color(fc055)
            font-weight bold
            height 60px
            transition all .3s ease
            &:hover
                hvr-float()
            p
                animate__bounceInRight()
        .banner-detail
            font_color(fc016)
            font-size: 16px
            width 580px
            height 100px
            display flex
            align-items center
            transition all .3s ease
            &:hover
                font_color(fc055)
            p
                animate__bounceInRight()
        .banner-feather
            height 60px
            transition all .3s ease
            &:hover
                hvr-float()
            .feather
                animate__bounceInRight()
                &.feather1
                    background url("~@img/template1/home/sbanner01.png") no-repeat
                    width 457px
                    height 39px
                &.feather2
                    background url("~@img/template1/home/sbanner02.png") no-repeat
                    width 267px
                    height 40px
                &.feather5
                    background url("~@img/template1/home/sbanner03.png") no-repeat
                    width 306px
                    height 58px
                &.feather6
                    background url("~@img/template1/home/sbanner04.png") no-repeat
                    width 493px
                    height 42px
                &.feather7
                    background url("~@img/template1/home/sbanner05.png") no-repeat
                    width 600px
                    height 35px

        .banner-list
            display flex
            justify-content flex-start
            padding 30px 0px 50px
            flxe-wrap wrap
            animate__bounceInRight()
            li
                width 100px
                text-align center
                cursor pointer

                .banner-bg
                    width 90px
                    height 110px
                    line-height 110px
                    background-image url('~@img/template1/icon/gamebg.png')
                    background-size 100% 100%
                    display flex
                    flex-direction row
                    justify-content center
                    align-items center
                    transition all 0.3s ease-in-out
                    &:hover
                        hvr-pulse-grow()
                        background-image url('~@img/template1/icon/gamecurbg.png')
                        img
                            flex 1
                            width 85%
                            height 70%
                            -webkit-filter: invert(100%)
                            filter: invert(100%)
                    img
                        flex 1
                        width 85%
                        height 70%
                        -webkit-filter: brightness(0)
                        filter: brightness(0)

                .name
                    font-size: 14px
                    font_color(fc06)
                    line-height 40px
                    transition all .3s ease
                    &:hover
                        font_color(fc055)
                &.active
                    .banner-bg
                        background-image url('~@img/template1/icon/gamecurbg.png')
                        img
                            -webkit-filter: invert(100%)
                            filter: invert(100%)

        .buts-con
            width 450px
            display flex
            flex-direction row
            justify-content flex-start
            align-items flex-start
            transition all .3s ease
            animate__bounceInRight()
            .common-btn
                flex none
                width 155px
                cursor pointer
                height 50px
                line-height 50px
                &:hover
                    bg_img_linear(linear10, linear09)
                    color #fff
                    hvr-float()
                    //hvr-pulse-grow()
</style>
