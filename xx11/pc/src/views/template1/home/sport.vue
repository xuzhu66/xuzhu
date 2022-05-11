<template lang="pug">
    .beauty-page
        BannerItem(:seatType="bannerType")
</template>
<script>
import BannerItem from "@/views/template1/home/component/bannerItem";
export default {
    name: 'beauty', // 真人
    components: {
        BannerItem,
    },
    computed: {},
    props: {},
    data() {
        return {
            bannerType: 7, // 0 首页 1 真人娱乐 2 棋牌游戏 3 电子游戏 4 捕鱼游戏 5 彩票投注 6 电子竞技 7 体育投注 8 优惠活动
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
@import '~@styl/template1/themes/mixin.styl'
.beauty-page
    height 888px
    width 100%
    background-image url('~@img/template1/home/plangbg7.jpg')
    background-repeat no-repeat
    background-position center center
    background-size 100% 100%
    overflow-x hidden

</style>
