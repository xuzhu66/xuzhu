<template lang="pug">
    .comBanner(:class="curMenuId == bannerType?'active':''", v-if="list && list.length>=1")
        template(v-if="list && list.length>1" )
            slider(:options="options" ,:style="height",@slide='slide',:ref="refSlider")
                slideritem(v-for="(it,inx) in list",:key='inx')
                    .img(:style="`background: url(${$ossImg(it.picUrl)})center/auto 100% no-repeat`",@mousemove="onmousemove",@mousedown="onmousedown",@mouseup="onmouseup",@mouseout="onmouseout")
            .left-next(@click="preFunction")
            .right-next(@click="nextFunction")
        template(v-if="list && list.length == 1")
            .img(:style="`background: url(${$ossImg(list[0].picUrl)})center/auto 100% no-repeat`",height="520px",@click="enterBannerFun(list[0])")

</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import {slider, slideritem} from 'vue-concise-slider'

export default {
    components: {
        slider,
        slideritem
    },

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
    computed: {
        ...mapState({
            // 全局第一次加载swiper的时候 手动触发一下;
            firstResetFlag: state => state.bannerStore.firstResetFlag,
            bannerList0: state => state.bannerStore.bannerList0,
            bannerList1: state => state.bannerStore.bannerList1,
            bannerList2: state => state.bannerStore.bannerList2,
            bannerList3: state => state.bannerStore.bannerList3,
            bannerList4: state => state.bannerStore.bannerList4,
            bannerList5: state => state.bannerStore.bannerList5,
            bannerList6: state => state.bannerStore.bannerList6,
            bannerList7: state => state.bannerStore.bannerList7,
            bannerList8: state => state.bannerStore.bannerList8,
            curMenu: state => state.curMenu, // 当前菜单
            curMenuId: state => state.curMenuId, // 当前菜单ID
        }),
        refSlider: function () {
            return "slider" + this.bannerType
        },
        list: function () {
            let data = "";
            switch (this.bannerType) {
                case 0:
                    data = this.bannerList0;
                    break;
                case 1:
                    data = this.bannerList1;
                    break;
                case 2:
                    data = this.bannerList2;
                    break;
                case 3:
                    data = this.bannerList3;
                    break;
                case 4:
                    data = this.bannerList4;
                    break;
                case 5:
                    data = this.bannerList5;
                    break;
                case 6:
                    data = this.bannerList6;
                    break;
                case 7:
                    data = this.bannerList7;
                    break;
                case 8:
                    data = this.bannerList8;
                    break;
            }
            return data;
        },
        // currutClasz:function(){
        //
        // }

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
        // 保存浏览器当前尺寸
        this.winWidth = window.innerWidth;
        //this.pageInit()
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
        ...mapMutations({
            resetSwiperState(commit, data) {
                return commit('bannerStore/SET_FIRST_RESETFLAG', data)
            }
        }),
        ...mapActions({
            getBannerListFun(dispatch, data) {
                return dispatch("bannerStore/getBannerListAction", data);
            },
            enterBannerFun(dispatch, data) {
                return dispatch('gameStore/enterBannerAction', data);
            }
        }),
        pageInit() { // 构造方法
            this.getBannerList()
        },
        // 查询banner
        getBannerList() {
            let param = {
                seatType: this.bannerType, // 0 首页 1 真人娱乐 2 棋牌游戏 3 电子游戏 4 捕鱼游戏 5 彩票投注 6 电子竞技 7 体育投注 8 优惠活动
            };
            this.getBannerListFun(param).then(res => {
                if (res && res.success) {
                    // 延迟加载数据, 解决图片加载左侧半个的bug
                    setTimeout(() => {
                        this.bannerList = res.data;
                        this.banner = res.data;
                        this.keepFlag = true;
                        //this.nextFunction()
                    }, 180)

                }
            })
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
.comBanner
    cursor pointer
    height 520px
    position absolute
    top 0px
    left 0px
    width 100%

    .img
        height 100%
        width 100%

    &.active
        z-index 3
    &:hover
        .left-next,.right-next
            display block
    .left-next
        display none
        width 45px
        height 90px
        position absolute
        z-index 2
        left 100px
        top 50%
        transform translateY(-50%) rotate(180deg)
        background url("~@img/comimages/home/rightjt.png") center no-repeat #000
        opacity .3
        transition all .8s
        border-radius 4px
        &:hover
            opacity .6
    .right-next
        display none
        width 45px
        height 90px
        position absolute
        z-index 2
        right 100px
        top 50%
        transform translateY(-50%)
        background url("~@img/comimages/home/rightjt.png") center no-repeat #000
        opacity .3
        transition all .8s
        border-radius 4px
        &:hover
            opacity .6



/deep/ .slider-pagination-bullet
    height: 12px !important;
    width: 32px !important;
    border-radius: 10px!important;
</style>
