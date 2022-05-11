<template lang="pug">
    .hot-con
        .hot-flow.w1200
            .item-con
                .item(class='banner1')
                    img(v-if="hotGameList.length>=1" :src="$ossImg(hotGameList[0].picUrl)" @click="enterBannerFun(hotGameList[0], 0)" @error="imgError01(hotGameList)")
                    //.popbtn-con(v-if="hotGameList.length>=1 && (hotGameList[0].jumpCategory == 3 || hotGameList[0].jumpCategory == 7)")
                        .common-btn.ok(@click="enterBannerFun(hotGameList[0], 0)")   立即游戏
                        .common-btn.empty(v-if="hotGameList[0].pcfreePlayFlag",@click="enterBannerFun(hotGameList[0], 0)") 开始试玩

                .item(class='banner2')
                    img(v-if="hotGameList.length>=2" :src="$ossImg(hotGameList[1].picUrl)" @click="enterBannerFun(hotGameList[1], 1)" @error="imgError02(hotGameList)")
                    //.popbtn-con(v-if="hotGameList.length>=2 && (hotGameList[1].jumpCategory == 3 || hotGameList[1].jumpCategory == 7)")
                        .common-btn.ok(@click="enterBannerFun(hotGameList[1], 1)")   立即游戏
                        .common-btn.empty(v-if="hotGameList[1].pcfreePlayFlag", @click="enterBannerFun(hotGameList[1], 1)") 开始试玩

                .item(class='banner3')
                    img(v-if="hotGameList.length>=3" :src="$ossImg(hotGameList[2].picUrl)" @click="enterBannerFun(hotGameList[2], 2)" @error="imgError03(hotGameList)")
                    //.popbtn-con(v-if="hotGameList.length>=3 && (hotGameList[2].jumpCategory == 3 || hotGameList[2].jumpCategory == 7)")
                        .common-btn.ok(@click="enterBannerFun(hotGameList[2], 2)")   立即游戏
                        .common-btn.empty(v-if="hotGameList[2].pcfreePlayFlag",@click="enterBannerFun(hotGameList[2], 2)") 开始试玩

                .item(class='banner4')
                    img(v-if="hotGameList.length>=4" :src="$ossImg(hotGameList[3].picUrl)" @click="enterBannerFun(hotGameList[3], 3)" @error="imgError04(hotGameList)")
                    //.popbtn-con(v-if="hotGameList.length>=4 && (hotGameList[3].jumpCategory == 3 || hotGameList[3].jumpCategory == 7)")
                        .common-btn.ok(@click="enterBannerFun(hotGameList[3], 3)")   立即游戏
                        .common-btn.empty(v-if="hotGameList[3].pcfreePlayFlag",@click="enterBannerFun(hotGameList[3], 3)") 开始试玩

            .list-con(@mouseenter="mouseenterFun", @mouseleave="mouseleaveFun")
                ul(:style="`transform: translate3d(-${translateNum}px, 0px, 0px);`",:class="transFlag?'trans-flag':''")
                    li(v-for="(item, i) in hotGameSwiperList")
                        .game-flow
                            .left
                                .img( :style="`background-image: url(${$ossImg(item.picUrl)})`",@click="enterBannerFun(item)")
                            .right
                                .game-name {{item.title}}
                                .line-name {{item.intro}}
                                .btn-con
                                    .common-btn.ok(v-if="item.jumpCategory == 3 || item.jumpCategory == 7",@click="enterBannerFun(item)")   立即游戏
                                    .common-btn.empty(v-if="item.pcfreePlayFlag",@click="enterBannerFun(item)") 开始试玩


</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
    name: 'HotRecom',
    components: {},
    computed: {
        ...mapState({
            hotGameList: state => state.homeStore.hotGameList, //首页热门推荐
            hotGameSwiperList: state => state.homeStore.hotGameSwiperList, //首页热门游戏-轮播

        })
    },
    props: {},
    data() {
        return {
            isReq: false, // 请求是否完成
            translateNum: 0, // 热门游戏移动的距离 一个距离是330px
            currt: 0, // 当前游戏
            maxNum: 0, // 一定要减去页面上的3个完成元素的宽度
            iter: '', //遍历器
            transFlag: false, //轮播回到第一位
            swiperTime:2000,// 轮播时间
        }
    },
    created() {

    },
    watch: {},
    mounted() {
        this.pageInit();

    },
    methods: {
        ...mapActions({
            getHotListFun(dispatch, param) {
                return dispatch('homeStore/getHotListAction', param);
            },
            enterBannerFun(dispatch, data) {
                return dispatch('gameStore/enterBannerAction', data);
            },
            //首页热门游戏-轮播
            getHomeHotGameListFun(dispatch, data) {
                return dispatch('homeStore/getHomeHotGameListAction', data);
            },

        }),
        pageInit() {
            this.getHotListFun({type: 2}); // 类型： 1、首页热门推荐 2、首页热门游戏 3、首页热门优惠 4、洗码代理banner
            this.getHomeHotGameListFun().then(res => {
                this.transFlag = false;
                if (res && res.success) {
                    if (res.data.length >= 5) {
                        this.maxNum = res.data.length - 4;
                        this.gameSwiper()
                    }
                } else {
                    clearInterval(this.iter);
                }
            })
        },
        gameSwiper() {
            clearInterval(this.iter);
            this.iter = setInterval(res => {
                if (this.maxNum <= this.currt) {
                    this.transFlag = true;
                    this.currt = 0;
                    this.translateNum = 0;
                    setTimeout(() => {
                        this.transFlag = false;
                    }, 1000)
                } else {
                    this.translateNum = this.translateNum + 298;
                    this.currt++;
                    this.transFlag = false;
                }
            }, this.swiperTime)
        },
        //鼠标进入事件
        mouseenterFun(){
            clearInterval(this.iter);
        },
        //鼠标移出事件
        mouseleaveFun(){
            this.gameSwiper()
        },

    }
}
</script>
<style lang="stylus" scoped>
@import '~@/assets/styles/template3/themes/mixin.styl'
@import "~@styl/template3/common/fun.styl"
.hot-con
    height 500px

    .hot-flow
        .item-con
            border-radius 10px
            //bg_color(bg2)
            flexcon()
            justify-content space-between
            .item
                position relative
                cursor pointer
                border-radius 10px
                overflow hidden
                //margin-right 6px
                transition all .3s ease-in-out
                img
                    border-radius 10px

                &:hover
                    box_shadow(shadow_common)
                    bigShadow()
                    .popbtn-con
                        bottom 0px

                &.banner1
                    width 365px
                    height 330px
                    flex none

                &.banner2
                    width 220px
                    height 330px
                    flex none

                    .popbtn-con
                        height 150px
                        flex-direction column

                        .common-btn
                            margin-bottom 10px

                &.banner3
                    width 220px
                    height 330px
                    flex none

                    .popbtn-con
                        height 150px
                        flex-direction column

                        .common-btn
                            margin-bottom 10px

                &.banner4
                    width 365px
                    height 330px
                    flex none

                .popbtn-con
                    position absolute
                    width 100%
                    height 100px
                    bottom -150px
                    left 0px
                    flexcon()
                    transition ease-in-out .3s
                    background rgba(0, 0, 0, .5)

        .list-con
            margin-top 24px
            height 140px
            border-radius 10px
            bg_color(bg2)
            flexcon()
            justify-content flex-start
            overflow hidden
            padding-left 10px
            ul
                height 120px
                width 1200px
                flex 1
                flexcon()
                justify-content flex-start
                transition all .3s ease-in-out

                &.trans-flag
                    transition none

                li
                    flex none
                    height 120px
                    margin-right 10px
                    .game-flow
                        width 288px
                        height 120px
                        border-radius 6px
                        flexcon()
                        bg_color(bg2)
                        &:hover
                            box_shadow(shadow_hui)
                            bg_color(bg1)
                        .left
                            .img
                                height 120px
                                width 120px
                                background-size contain
                                background-repeat no-repeat
                                background-position center
                                border-radius 10px
                                cursor pointer
                                transition all .3s ease-in-out
                                &:hover
                                    transform scale(1.1)
                        .right
                            width 180px
                            height 120px
                            padding-left 10px

                            .game-name
                                font-size 18px
                                font-weight 500
                                font_color(fc2)

                            .line-name
                                padding 5px 0 18px
                                font-size 16px
                                font_color(fc4)

                            .btn-con
                                margin-top 10px
                                flexcon()
                                justify-content flex-start

                                .common-btn
                                    cursor pointer
                                    flex none
                                    margin: 0 10px 0 0;
                                    font-size 12px
                                    line-height 30px
                                    border-radius 4px
                                    width 70px !important
                                    height 30px !important
                                    transition all .3s ease-in-out
                                    &:hover
                                        hvr-float()


</style>
