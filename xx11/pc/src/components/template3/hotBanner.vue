<template lang="pug">
    .hotBanner(v-if="list && list.length>=1")
        template(v-if="list && list.length>1")
            slider(:options="options" ,:style="`${height}px`",@slide='slide',:ref="refSlider")
                slideritem(v-for="(it,inx) in list",:key='inx')
                    .img(:style="[{background: `url(${$ossImg(it.picUrl)})center/auto 100% no-repeat`},{width:`${width}px`},{height:`${height}px`}]",@mousemove="onmousemove",@mousedown="onmousedown",@mouseup="onmouseup",@mouseout="onmouseout")
                    //.popbtn-con(v-if="it.jumpCategory == 3 || it.jumpCategory == 7")
                        .common-btn.ok(@click="enterBannerFun(it)")   立即游戏
                        .common-btn.empty(v-if="it.pcfreePlayFlag",@click="enterBannerFun(it)") 开始试玩

        template(v-if="list && list.length == 1")
            .img(:style="[{background: `url(${$ossImg(list[0].picUrl)})center/auto 100% no-repeat`},{width:`${width}px`},{height:`${height}px`}]",@click="enterBannerFun(list[0])")
            //.popbtn-con(v-if="list[0].jumpCategory == 3 || list[0].jumpCategory == 7")
                .common-btn.ok(@click="enterBannerFun(list[0])")   立即游戏
                .common-btn.empty(v-if="list[0].pcfreePlayFlag",@click="enterBannerFun(list[0])") 开始试玩
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import {slider, slideritem} from 'vue-concise-slider'

export default {
    components: {
        slider,
        slideritem
    },
    computed: {
        ...mapState({
            // 全局第一次加载swiper的时候 手动触发一下;
            firstResetFlag: state => state.bannerStore.firstResetFlag,
        }),
        refSlider: function () {
            return "slider" + this.bannerType
        },
    },
    props: {
        bannerType: {
            type: String,
            default: '0'
        },
        list: {
            type: Array,
            default:[]
        },
        width: {
            type: String,
            default: '290'
        },
        height: {
            type: String,
            default: '254'
        },

    },
    data() {
        return {
            bannerList: '',
            banner: '',
            options: {
                autoplay: "5000",
                currentPage: 0,
                loop: true,
                speed: 500,
                // currentPage: 0,//当前页码
                // thresholdDistance: 500,//滑动判定距离
                // thresholdTime: 100,//滑动判定时间
                // autoplay:1000,//自动滚动[ms]
                // loop:true,//循环滚动
                // direction:'vertical',//方向设置，垂直滚动
                // loopedSlides:1,//无限滚动前后遍历数
                // slidesToScroll:1,//每次滑动项数
                // timingFunction: 'ease', // 滑动方式
                // speed: 300, // 滑动时间
            },
            //当前的选项
            currtItem: "",
            //点击标示
            clickFlag: false,
            winWidth: '',
        };
    },
    watch: {
        list: function (val) {
            // 如果是初次加载,进行重置轮播组件的位置状态;
            if (this.firstResetFlag) {
                setTimeout(() => {
                    this.resetSwiperState()
                    this.nextFunction()
                }, 180)
            }
        }
    },
    filters: {},
    created() {

    },
    mounted() {

    },
    methods: {
        ...mapMutations({
            resetSwiperState(commit, data) {
                return commit('bannerStore/SET_FIRST_RESETFLAG', data)
            }
        }),
        ...mapActions({
            enterBannerFun(dispatch, data) {
                return dispatch('gameStore/enterBannerAction', data);
            }
        }),
        pageInit() { // 构造方法
            this.getBannerList()
        },
        // Listener slide  event
        slide(data) {
            if (data.currentPage == this.list.length) {
                this.currtItem = this.list[0];
            } else {
                this.currtItem = this.list[data.currentPage];
            }
        },
        //点击事件--双击
        onTap(data) {
            this.currtItem = this.list[data.currentPage];
            // 跳转
        },
        onmouseout() {
            //清除所有的事件标示；
            this.clickFlag = false;
        },
        onmousemove() {
            //清除所有的事件标示；
            this.clickFlag = false;
        },
        onmousedown() {
            //设置标示
            this.clickFlag = true;
        },
        onmouseup() {
            //判断标示
            if (this.clickFlag) {
                // 跳转
                this.enterBannerFun(this.currtItem);
            }
            this.clickFlag = false;
        },
        onInit(data) {

        },
        preFunction() {
            this.$refs['slider' + this.bannerType] && this.$refs['slider' + this.bannerType].pre()
        },
        nextFunction() {
            this.$refs['slider' + this.bannerType] && this.$refs['slider' + this.bannerType].next()
        },
    }
};
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template3/themes/mixin.styl'
@import "~@styl/template3/common/fun.styl"
/deep/.slider-container
        .slider-pagination
            display none
.hotBanner
    cursor pointer
    width 100%
    position relative
    border-radius 10px
    overflow hidden
    img
        border-radius 10px

    &:hover
        box_shadow(shadow_common)

        .popbtn-con
            bottom 0px

    &.banner1
        width 600px
        height 518px
        flex none

    &.banner2, &.banner3, &.banner4, &.banner5
        width 290px
        height 254px
        flex none

    &.banner2, &.banner4
        margin-right 10px

    &.banner2, &.banner3
        margin-bottom 10px

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



</style>
