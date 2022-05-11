<template lang="pug">
    .about-con
        .about-flow
            .item
                ul(v-if="aboutList")
                    li {{aboutUs.title}}
                    li(v-for="item in aboutList",:class="item?'':'empty'") {{item}}
            .item(@click="enterBannerFun(aboutUs)")
                .img(:style="$bgImg($ossImg(aboutUs.picUrl))")
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
    name: "AboutUs",
    created() {
        // 关于我们
        this.getAboutUsFun();
    },
    computed: {
        ...mapState({
            aboutUs: state => state.homeStore.aboutUs, // 关于我们
            aboutList: state => state.homeStore.aboutList, // 关于我们文案列表
        }),
    },
    methods: {
        ...mapActions({
            // 关于我们
            getAboutUsFun(dispatch, param) {
                return dispatch('homeStore/getAboutUsAction', param);
            },
            enterBannerFun(dispatch, data) {
                return dispatch('gameStore/enterBannerAction', data);
            }
        }),
        imgError(item) {
            item.picUrl = require('@img/template3/home/noImg.png');
        },
    }
}
</script>

<style lang="stylus" scoped>
@import '~@styl/template3/themes/mixin.styl'
@import "~@styl/template3/common/fun.styl"
.about-con
    .about-flow
        width: 1200px;
        height: 380px;
        bg_color(bg2)
        border-radius: 6px;
        margin 0px auto
        padding 20px
        flexcon()

        .item
            font_color(fc3)
            position relative
            overflow hidden
            border-radius 10px
            flex 1
            width 100%
            height 100%

            &:nth-child(1)
                font-size: 14px;
                margin-right 10px
                line-height 25px
            &:nth-child(2)
                flex none
                width: 632px;
                height 340px;
            .img
                width: 632px;
                height 340px;
                cursor pointer
                background-repeat no-repeat
                background-size contain
                background-position center
                bg_color(bg4)
                transition all .3s ease-in-out
                &:hover
                    transform scale(1.1)
            ul
                resetul()

                li
                    text-indent: 2em;
                    font-size 15px
                    margin-bottom 4px

                    &.empty
                        height 24px
                        line-height 24px

                    &:nth-child(1)
                        font_color(fc4)
                        font-size 20px
                        font-weight 500

</style>
