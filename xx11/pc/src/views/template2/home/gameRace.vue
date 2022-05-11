<template lang="pug">
    .gamerace-page
        Banner(:bannerType="bannerType")
        Notice
        BannerItem(:seatType="bannerType")
</template>
<script>
import BannerItem from "@/views/template2/home/component/bannerItem";
import Banner from '@pon/template2/banner'; // Banner轮播图片
import Notice from '@pon/template2/notice'; // 公告栏
export default {
    name: 'gamerace', // 玩家
    components: {
        BannerItem,
        Banner,
        Notice
    },
    computed: {},
    props: {},
    data() {
        return {
            bannerType: 6, // 0 首页 1 真人娱乐 2 棋牌游戏 3 电子游戏 4 捕鱼游戏 5 彩票投注 6 电子竞技 7 体育投注 8 优惠活动
            list: [],
        }
    },
    created() {

    },
    watch: {},
    mounted() {

    },
    methods: {}
}
</script>
<style lang="stylus" scoped>
@import '~@/assets/styles/template2/themes/mixin.styl'
@import "~@styl/template2/common/fun.styl"
.gamerace-page
    position relative

</style>
