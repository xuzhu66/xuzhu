<template lang="pug">
    .hh-pre.w1200
        ul.hhp-lis
            li(v-for="(value, index) in hotPre" :key="index" @click="getGame(value, index)")
                img(:src="$ossImg(value.picUrl)" @error="imgError(value)")
</template>

<script>
import gameStore from "@/store/comstore/game/gameStore"; // 登入游戏状态
export default {
    name: 'HotPre', // 热门优惠
    components: {},
    props: {},
    computed: {
        tenatPlatId: { // 平台ID
            get() {
                return this.$store.state.homeStore.tenatPlatId;
            },
            set(item) {
                return item
            }
        },
        hotPre: { // 首页热门优惠
            get() {
                return this.$store.state.homeStore.hotPre;
            },
            set(item) {
                return item
            }
        }
    },
    data() {
        return {}
    },
    created() {
        if (!this.$store.state["gameStore"]) {
            gameStore.install(this);
        }
    },
    watch: {},
    mounted() {
        this.pageInit()
    },
    methods: {
        pageInit() {
            this.getHotPre(); // 获取热门优惠
        },
        imgError(item) {
            item.picUrl = require('@img/template1/home/noImg.png');
        },
        getHotPre() { // 获取热门优惠
            let param = {
                type: 3, // 类型： 1、首页热门推荐 2、首页热门游戏 3、首页热门优惠 4、洗码代理banner
            };
            this.$store.dispatch("homeStore/getHot", param).then(res => {
                this.$store.commit('homeStore/set_hotPre', res.data) // 热门优惠
            });
        },
        getGame(value, index) {
            this.$store.dispatch("gameStore/enterBannerAction", value).then(res => {
            });
        },
    }
}
</script>
<style lang="stylus" scoped>
@import '~@styl/template1/themes/mixin.styl'
@import '~@styl/template1/common/fun.styl'
.hh-pre
    .hhp-lis
        display flex
        justify-content flex-start
        flex-wrap wrap
        margin-bottom 50px

        li
            width: 386px
            height: 239px
            bg_color(bg04)
            border-radius: 10px
            margin-right 20px
            margin-top 20px
            cursor pointer
            //overflow hidden
            display flex
            justify-content center
            align-items center
            hvr-float-shadow()
            position relative

            &:nth-child(3n - 0)
                margin-right 0px

            img
                border-radius 10px
                width auto
                height auto
                max-width 100%
                max-height 100%

            &:hover
                box_shadow(shadow01)
</style>
