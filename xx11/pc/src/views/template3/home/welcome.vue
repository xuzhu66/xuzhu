<template lang="pug">
    .welcome-page
        .wlc-flow
            .wlc-obj
                .ok-icon
                .title 恭喜您,您的账户已经创建成功!
                .title1 距离精彩游戏仅一步之遥
                .item-con
                    .item(v-for='(it,ind) in welcome',:class="'i'+it.seq",:style="`background-image:url(${it.picUrl})`",@click="enterBannerFun(it)")

                    //.item(:style="`background-image:url(${picUrl4})`", class="i1")
                    //.item(:style="`background-image:url(${picUrl4})`" , class="i2")
                    //.item(:style="`background-image:url(${picUrl4})`" , class="i3")
                    //.item(:style="`background-image:url(${picUrl4})`" , class="i4")
                    //.item(:style="`background-image:url(${picUrl4})`" , class="i5")

</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
    name: "welcome",
    data() {
        return {
            // picUrl:'https://bbs.qn.img-space.com/202012/7/811f4e5ca4ebd4230c233ded97978e37.jpg?imageView2/2/w/1200/q/75/ignore-error/1/',
            // picUrl2:'https://bbs.qn.img-space.com/202012/7/ebf1083037a1910ff243279e2bb45696.jpg?imageView2/2/w/1200/q/75/ignore-error/1/',
            // picUrl3:'https://bbs.qn.img-space.com/202012/7/b38731ec9a3144c3b8761b0da89b1305.jpg?imageView2/2/w/1200/q/75/ignore-error/1/',
             //picUrl4:'http://n.sinaimg.cn/sinacn10112/566/w1018h1148/20191111/fd6e-iieqapt6530904.jpg',
            // picUrl5:'https://bbs.qn.img-space.com/202012/15/0c505958ba89d82022a46bb7c180b560.jpg?imageView2/2/w/1024/q/75/ignore-error/1/'
        }
    },
    computed: {
        ...mapState({
            templateNumber: state => state.templateStore.template, // 模板编号
            welcome: state => state.homeStore.welcome, // 欢迎页面内容
        }),
    },
    created() {
        let obj = {
            deviceType: 2, //终端类型： 1、H5 2、PC 3、android 4、ios
            templateNo: this.templateNumber, // 模板ID：1，2，3
        }
        // 获取欢迎页面内容
        this.getWelcomeDetailFun(obj).then(res=>{

        })
    },
    methods: {
        ...mapActions({
            // 获取欢迎页面内容
            getWelcomeDetailFun(dispatch, param) {
                return dispatch('homeStore/getWelcomeDetailAction', param);
            },
            enterBannerFun(dispatch, data) {
                return dispatch('gameStore/enterBannerAction', data);
            }
        })
    }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template3/themes/mixin.styl'
@import "~@styl/template3/common/fun.styl"
/deep/ .app-con
    /deep/ .main-con
        min-height 600px !important

.welcome-page
    min-width 1200px
    max-width 1820px
    margin 30px auto 0px
    bg_color(bg1)
    padding-top 30px
    padding-bottom 30px
    .wlc-flow
        .wlc-obj
            .ok-icon
                background url("~@img/comimages/center/right.svg") center / contain no-repeat
                width 60px
                height 60px
                margin 20px auto

            .title
                font-size 36px
                font-weight 600
                font_color(fc2)
                margin 20px auto
                text-align center

            .title1
                font-size 16px
                font_color(fc3)
                margin 10px auto 30px
                text-align center

            .item-con
                margin 30px 0px
                flexcon()
                .item
                    cursor pointer
                    flex 1
                    width 330px
                    height 475px
                    background-position center
                    background-size cover
                    background-repeat no-repeat
                    border-radius 10px
                    transition all .3s ease-in-out
                    &:hover
                        transform scale(1.05)
                    &:not(:last-child)
                        margin-right 20px
                    &.i1
                        order 3
                        flex none
                        width 400px
                        height 580px

                    &.i2
                        order 2
                        flex none
                        width 330px
                        height 475px
                    &.i3
                        order 4
                        flex none
                        width 330px
                        height 475px
                    &.i4
                        order 1


                    &.i5
                        order 5


</style>
