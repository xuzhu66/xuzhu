<template lang="pug">
    //.comBanner(:class="refSlider")
        template(v-if="bannerList && bannerList.length>1" )
            slider(v-show='keepFlag', :options="options" ,:style="height",@slide='slide',:ref="refSlider")
                slideritem(v-for="(it,inx) in bannerList",:key='inx')
                    .img(:style="`background: url(${it.picUrl})center/auto 100% no-repeat`",@mousemove="onmousemove",@mousedown="onmousedown",@mouseup="onmouseup")

        template(v-if="bannerList && bannerList.length == 1")
            .img(:style="`background: url(${bannerList[0].picUrl})center/auto 100% no-repeat`",:height="height",@click="")


</template>

<script>
import {mapActions} from "vuex";
//import {slider, slideritem} from 'vue-concise-slider'

export default {
    // components: {
    //     slider,
    //     slideritem
    // },
    // computed: {
    //     refSlider: function () {
    //         return "slider" + this.bannerType
    //     }
    // },
    props: {
        bannerType: {
            type: Number,
            default: 0
        },
    },
    data() {
        return {
            bannerList: '',
            banner: '',
            options: {
                autoplay: "3000",
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
            height: {
                height: '520px'
            },
            winWidth: '',
            keepFlag: false,
        };
    },
    filters: {},
    created() {

    },
    mounted() {
        // 保存浏览器当前尺寸
        this.winWidth = window.innerWidth;
        this.pageInit()
    },
    // activated() {
    //     this.bannerList = this.banner;
    //     this.keepFlag = true;
    //     // 解决切换浏览器尺寸的时候, 会显示半个图片,且轮播对象停止的问题;
    //     // 判断浏览器尺寸是否发生改变,如果改变,激活一次轮播
    //     if (window.innerWidth != this.winWidth) {
    //         this.nextFunction()
    //         // 更新浏览器当前尺寸;
    //         this.winWidth = window.innerWidth;
    //     }
    // },
    // deactivated() {
    //     this.bannerList = "";
    //     this.keepFlag = false;
    // },

    methods: {
        ...mapActions({
            getBannerListFun(dispatch, data) {
                return dispatch("bannerStore/getBannerListAction", data);
            },

        }),
        pageInit() { // 构造方法
            this.getBannerList()
        },
        // getGame(value, index) {
        //     let obj = {
        //         value: value,
        //         index: index
        //     }
        //     this.$store.dispatch("gameStore/enterBannerAction", obj)
        // },
        // 查询banner
        getBannerList() {
            let param = {
                seatType: this.bannerType, // 0 首页 1 真人娱乐 2 棋牌游戏 3 电子游戏 4 捕鱼游戏 5 彩票投注 6 电子竞技 7 体育投注 8 优惠活动
            };
            this.getBannerListFun(param).then(res => {
                if (res && res.success) {
                    this.bannerList = res.data;
                    this.banner = res.data;
                    this.keepFlag = true;
                    // 延迟加载数据, 解决图片加载左侧半个的bug
                    // setTimeout(() => {
                    //     // this.bannerList = res.data;
                    //     // this.banner = res.data;
                    //     // this.keepFlag = true;
                    //     this.nextFunction()
                    // }, 180)

                }
            })
        },
        // Listener slide  event
        /*slide(data) {
            if (data.currentPage == this.bannerList.length) {
                this.currtItem = this.bannerList[0];
            } else {
                this.currtItem = this.bannerList[data.currentPage];
            }

        },
        //点击事件--双击
        onTap(data) {
            this.currtItem = this.bannerList[data.currentPage];
            // 跳转
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
        },*/
    }
};
</script>

<style lang="stylus" scoped>
.comBanner
    cursor pointer
    height 520px

    .img
        height 100%
        width 100%

</style>
