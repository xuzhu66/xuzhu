<template lang="pug">
    .comBanner(v-if="banner")
        slider(:options="options",v-if="banner&&banner.length>1",:style="height",@slide='slide')
            slideritem(v-for="(it,inx) in banner",:key='inx')
                .img(:style="imgBg(it.image?$ossImg(it.image):it.imageLine)",@mousemove="onmousemove",@mousedown="onmousedown",@mouseup="onmouseup",)
        .img(v-else,:style="imgBg($ossImg(banner[0].image))",:height="height",@click="$bannerLink(banner[0].url)")
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
                autoplay: "3000",
                currentPage: 0,
                loop: true,
                speed: 500,
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
            if (data.currentPage == this.banner.length) {
                this.currtItem = this.banner[0];
            } else {
                this.currtItem = this.banner[data.currentPage];
            }

        },
        //点击事件--双击
        onTap(data) {
            this.currtItem = this.banner[data.currentPage];
            if (this.currtItem.gamePlatformVo) {
                this.$gameDet(this.currtItem, 1);
            } else {
                this.$bannerLink(this.currtItem.url);
            }
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
                if (this.currtItem.gamePlatformVo) {
                    this.$gameDet(this.currtItem, 1);
                } else {
                    this.$bannerLink(this.currtItem.url);
                }
            }
            this.clickFlag = false;
        },
        onInit(data) {
            //console.log(data)
        },
        // bannerLink(it){
        //     if(it){
        //         if(/\/#\/discount\/|\/#\/game\/|\/#\/brand\//.test(it)){
        //             it = it.substring(it.lastIndexOf("\#")+1, it.length);
        //             // this.$link(it)
        //             let routeData = this.$router.resolve({
        //                 path: it
        //             });
        //             window.open(routeData.href,'_blank');
        //         }else{
        //             if(/^http/.test(it)){
        //                 window.open(it)
        //             }
        //         }
        //     }
        // }
    },
    activated() {

    },
    deactivated() {

    }
}
</script>

<style lang="stylus" scoped>
.comBanner
    cursor pointer

    .img
        height 100%
        width 100%
</style>
