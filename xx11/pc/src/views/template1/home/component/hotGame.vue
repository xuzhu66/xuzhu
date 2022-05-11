<template lang="pug">
    .hh-game.w1200.flex-jb
        ul.hhg-lis(v-if="hotGame.length>0")
            li(v-for="(value, index) in hotGame" :key="index" @click="getGame(value, index)")
                img(:src="value && $ossImg(value.picUrl)" @error="imgError(value)")
</template>

<script>
import gameStore from "@/store/comstore/game/gameStore"; // 登入游戏状态
export default {
    name: 'HotGame',
    components: {},
    computed: {
        tenatPlatId: { // 平台ID
            get() {
                return this.$store.state.homeStore.tenatPlatId;
            },
            set(item) {
                return item
            }
        },
        hotGame: { // 首页热门游戏
            get() {
                return this.$store.state.homeStore.hotGame;
            },
            set(item) {
                return item
            }
        }
    },
    props: {},
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
            this.getHotGame(); // 获取热门游戏
        },
        imgError(item) {
            if (item) {
                item.picUrl = require('@img/template1/home/noImg.png');
            } else {
                return null
            }
        },
        getHotGame() { // 获取热门游戏
            let param = {
                type: 2, // 类型： 1、首页热门推荐 2、首页热门游戏 3、首页热门优惠 4、洗码代理banner
            };
            this.$store.dispatch("homeStore/getHot", param).then(res => {
                this.$store.commit('homeStore/set_hotGame', res.data) // 热门游戏
            });
        },
        getGame(value, index) {
            this.$store.dispatch("gameStore/enterBannerAction", value).then(res => {});
        },
    }
}
</script>
<style lang="stylus" scoped>
@import '~@styl/template1/themes/mixin.styl'
@import '~@styl/template1/common/fun.styl'
.hh-game
    .hhg-lis
        display flex
        justify-content flex-start
        flex-wrap wrap

        li
            width 224px
            height 224px
            bg_color(bg04)
            border-radius 10px
            margin-right 20px
            margin-top 20px
            cursor pointer
            overflow hidden
            display flex
            justify-content center
            align-items center
            hvr-grow()
            &:nth-child(5n - 0)
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
