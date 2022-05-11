<template lang="pug">
    .hot-con
        .hot-flow.w1200
            .item-con.c01
                .item(class='banner1')
                    img(v-if="recommendList.length>=1" :src="$ossImg(recommendList[0].picUrl)" @click="enterBannerFun(recommendList[0], 0)" @error="imgError01(recommendList)")
                    .popbtn-con(v-if="recommendList.length>=1 && (recommendList[0].jumpCategory == 3 || recommendList[0].jumpCategory == 7)")
                        .common-btn.ok(@click="enterBannerFun(recommendList[0], 0)")   立即游戏
                        .common-btn.empty(v-if="recommendList[0].pcfreePlayFlag",@click="enterBannerFun(recommendList[0], 0)") 开始试玩

            .item-con.c02
                .item(class='banner2')
                    img(v-if="recommendList.length>=2" :src="$ossImg(recommendList[1].picUrl)" @click="enterBannerFun(recommendList[1], 1)" @error="imgError02(recommendList)")
                    .popbtn-con(v-if="recommendList.length>=2 && (recommendList[1].jumpCategory == 3 || recommendList[1].jumpCategory == 7)")
                        .common-btn.ok(@click="enterBannerFun(recommendList[1], 1)")   立即游戏
                        .common-btn.empty(v-if="recommendList[1].pcfreePlayFlag", @click="enterBannerFun(recommendList[1], 1)") 开始试玩
                .item(class='banner3')
                    img(v-if="recommendList.length>=3" :src="$ossImg(recommendList[2].picUrl)" @click="enterBannerFun(recommendList[2], 2)" @error="imgError03(recommendList)")
                    .popbtn-con(v-if="recommendList.length>=3 && (recommendList[2].jumpCategory == 3 || recommendList[2].jumpCategory == 7)")
                        .common-btn.ok(@click="enterBannerFun(recommendList[2], 2)")   立即游戏
                        .common-btn.empty(v-if="recommendList[2].pcfreePlayFlag",@click="enterBannerFun(recommendList[2], 2)") 开始试玩

            .item-con.c03
                .item(class='banner4')
                    img(v-if="recommendList.length>=4" :src="$ossImg(recommendList[3].picUrl)" @click="enterBannerFun(recommendList[3], 3)" @error="imgError04(recommendList)")
                    .popbtn-con(v-if="recommendList.length>=4 && (recommendList[3].jumpCategory == 3 || recommendList[3].jumpCategory == 7)")
                        .common-btn.ok(@click="enterBannerFun(recommendList[3], 3)")   立即游戏
                        .common-btn.empty(v-if="recommendList[3].pcfreePlayFlag",@click="enterBannerFun(recommendList[3], 3)") 开始试玩

</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
    name: 'HotRecom',
    components: {},
    computed: {
        ...mapState({
            recommendList: state => state.homeStore.recommendList, //首页热门推荐
        })
    },
    props: {},
    data() {
        return {
            isReq: false, // 请求是否完成
            nohw01: false, // 是否不够显示无图
            nohw02: false, // 是否不够显示无图
            nohw03: false, // 是否不够显示无图
            nohw04: false, // 是否不够显示无图
            nohw05: false, // 是否不够显示无图
        }
    },
    created() {

    },
    watch: {},
    mounted() {
        this.pageInit()
    },
    methods: {
        ...mapActions({
            getHotListFun(dispatch, param) {
                return dispatch('homeStore/getHotListAction', param);
            },
            enterBannerFun(dispatch, data) {
                return dispatch('gameStore/enterBannerAction', data);
            }
        }),
        pageInit() {
            this.getHotListFun({type: 1}); // 类型： 1、首页热门推荐 2、首页热门游戏 3、首页热门优惠 4、洗码代理banner

        },
        imgError01(item) {
            item[0].picUrl = require('@img/template2/home/noImg.png');
            this.nohw01 = true
        },
        imgError02(item) {
            item[1].picUrl = require('@img/template2/home/noImg.png');
            this.nohw02 = true
        },
        imgError03(item) {
            item[2].picUrl = require('@img/template2/home/noImg.png');
            this.nohw03 = true
        },
        imgError04(item) {
            item[3].picUrl = require('@img/template2/home/noImg.png');
            this.nohw04 = true
        },
        imgError05(item) {
            item[4].picUrl = require('@img/template2/home/noImg.png');
            this.nohw05 = true
        },
    }
}
</script>
<style lang="stylus" scoped>
@import '~@/assets/styles/template2/themes/mixin.styl'
@import "~@styl/template2/common/fun.styl"
.hot-con
    height 500px

    .hot-flow
        flexcon()

        .item-con
            border-radius 10px

            &.c01
                width 490px
                height 500px
                flex none

            &.c02
                width 390px
                height 500px
                flex none
                margin 0 10px
                flexcon()
                flex-direction column

            &.c03
                width 300px
                height 500px
                flex none

            .item
                position relative
                cursor pointer
                border-radius 10px
                overflow hidden
                transition all .3s ease-in-out
                img
                    border-radius 10px

                &:hover
                    box_shadow(shadow01)
                    bigShadow()
                    .popbtn-con
                        bottom 0px

                &.banner1
                    width 490px
                    height 500px
                    flex none

                &.banner2
                    width 390px
                    height 245px
                    flex none

                &.banner3
                    width 390px
                    height 245px
                    flex none
                    margin-top 10px

                &.banner4
                    width 300px
                    height 500px
                    flex none

                .popbtn-con
                    position absolute
                    width 100%
                    height 100px
                    bottom -100px
                    left 0px
                    flexcon()
                    transition ease-in-out .3s
                    display noe
                    background rgba(0, 0, 0, .5)

//box_shadow(shadow01)

</style>
