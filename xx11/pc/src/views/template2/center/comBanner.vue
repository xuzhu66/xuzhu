<template lang="pug">
    .comBanner(v-if="banner")
        slider(:options="options",v-if="banner&&banner.length>1",:style="{ height: height }",@slide='slide',ref="slider")
            slideritem(v-for="(it,inx) in banner",:key='inx')
                .img(:style="'background-image:url(' + $ossImg(it) + ')'")
        .img(v-else,:style="'background-image:url(' + $ossImg(banner) + ')'",:height="height")
        .pre(@click="preFunction")
        .next(@click="nextFunction")
</template>

<script>
import {slider, slideritem} from 'vue-concise-slider'

export default {
    components: {
        slider,
        slideritem
    },
    props: ['banner', 'height'],
    data() {
        return {
            options: {
                autoplay: false,
                currentPage: 0,
                loop: true,
                speed: 300,
                freeze: true, //冻结... 拖动莫名其妙的会触发两次轮播
                //thresholdDistance:300,
                // thresholdTime:100, // 滑动判定时间
                // slidesToScroll:1,//每次滑动项数
                //centeredSlides: true
            },
            //当前的选项
            currtItem: "",
            //点击标示
            clickFlag: false,
        }
    },
    mounted() {

    },
    methods: {
        // Listener slide  event
        slide(data) {
            let that = this;
            this.options.freeze = true;
            this.$refs.slider.options.freeze = true
            return false;
        },
        //点击事件--双击
        onTap(data) {
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
            this.clickFlag = false;
        },
        onInit(data) {

        },
        preFunction() {
            this.$refs.slider.pre()
        },
        nextFunction() {
            this.$refs.slider.next()
        },
    },
    activated() {

    },
    deactivated() {

    }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template2/themes/mixin.styl'
.comBanner
    cursor pointer
    position relative
    width 100%

    .img
        height 350px
        width 100%
        background-repeat: no-repeat;
        background-position: 50%;
        background-size contain

    .pre
        position: absolute;
        width: 45px;
        height: 45px;
        top: 50%;
        left: 6%;
        transform: translateY(-50%) rotate(180deg);
        background url("~@img/template2/center/next.svg") center / contain no-repeat
        z-index: 3;
        opacity .2
        transition all 300ms ease

        &:hover
            opacity .6

    .next
        position: absolute;
        width: 45px;
        height: 45px;
        top: 50%;
        right: 6%;
        transform: translateY(-50%);
        background url("~@img/template2/center/next.svg") center / contain no-repeat
        z-index: 3;
        opacity .2
        transition all 300ms ease

        &:hover
            opacity .6


/deep/ .slider-pagination
    /deep/ .slider-pagination-bullet
        height: 12px !important;
        width: 12px !important;
</style>
