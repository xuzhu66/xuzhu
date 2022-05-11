<template lang="pug">
    .h-hot.w1200.flex-jb
        .hh-l(v-if="!isReq" :class="[{'nohw':nohw01}]")
            img(v-if="hotRecomm.length>=1" :src="$ossImg(hotRecomm[0].picUrl)" @click="getGame(hotRecomm[0], 0)" @error="imgError01(hotRecomm)")
        ul.hh-r(v-if="!isReq")
            li(:class="[{'nohw':nohw02}]")
                img(v-if="hotRecomm.length>=2" :src="$ossImg(hotRecomm[1].picUrl)" @click="getGame(hotRecomm[1], 1)" @error="imgError02(hotRecomm)")
            li(:class="[{'nohw':nohw03}]")
                img(v-if="hotRecomm.length>=3" :src="$ossImg(hotRecomm[2].picUrl)" @click="getGame(hotRecomm[2], 2)" @error="imgError03(hotRecomm)")
            li(:class="[{'nohw':nohw04}]")
                img(v-if="hotRecomm.length>=4" :src="$ossImg(hotRecomm[3].picUrl)" @click="getGame(hotRecomm[3], 3)" @error="imgError04(hotRecomm)")
            li(:class="[{'nohw':nohw05}]")
                img(v-if="hotRecomm.length>=5" :src="$ossImg(hotRecomm[4].picUrl)" @click="getGame(hotRecomm[4], 4)" @error="imgError05(hotRecomm)")
</template>

<script>
import gameStore from "@/store/comstore/game/gameStore"; // 登入游戏状态
import homeStore from "@/store/template1/homeStore"; // 首页头部信息状态
export default {
    name: 'HotRecom',
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
        hotRecomm: { // 首页热门推荐
            get() {
                return this.$store.state.homeStore.hotRecomm;
            },
            set(item) {
                return item
            }
        }
    },
    props: {},
    data() {
        return {
            isReq: false, // 请求是否完成
            nohw01: false, // 是否不够显示无图
            nohw02: false, // 是否不够显示无图
            nohw03: false, // 是否不够显示无图
            nohw04: false, // 是否不够显示无图
            nohw05: false, // 是否不够显示无图
        }
    },
    created() {
        if (!this.$store.state["homeStore"]) { // 首页头部信息状态
            homeStore.install(this);
            this.getPlatInfo(); // 获取平台信息
        }
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
            this.getHotRecom(); // 获取热门推荐
        },
        imgError01(item) {
            item[0].picUrl = require('@img/template1/home/noImg.png');
            this.nohw01 = true
        },
        imgError02(item) {
            item[1].picUrl = require('@img/template1/home/noImg.png');
            this.nohw02 = true
        },
        imgError03(item) {
            item[2].picUrl = require('@img/template1/home/noImg.png');
            this.nohw03 = true
        },
        imgError04(item) {
            item[3].picUrl = require('@img/template1/home/noImg.png');
            this.nohw04 = true
        },
        imgError05(item) {
            item[4].picUrl = require('@img/template1/home/noImg.png');
            this.nohw05 = true
        },
        getHotRecom() { // 获取热门推荐
            this.isReq = true
            let param = {
                type: 1, // 类型： 1、首页热门推荐 2、首页热门游戏 3、首页热门优惠 4、洗码代理banner
            };
            this.$store.dispatch("homeStore/getHot", param).then(res => {
                this.isReq = false
                this.$store.commit('homeStore/set_hotRecomm', res.data) // 热门优惠
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

.h-hot
    .hh-l
        width: 588px;
        height: 588px;
        bg_color(bg04);
        border-radius: 10px
        cursor pointer
        margin-top 20px
        display flex
        align-items center
        justify-content center
        hvr-grow()
        img
            width 100%
            height 100%
            border-radius: 10px

        &:hover
            box_shadow(shadow01)

    .nohw
        img
            width auto !important
            height auto !important
            max-width 100%
            max-height 100%

    .hh-r
        display flex
        justify-content flex-start
        width 608px
        flex-wrap wrap

        li
            width: 284px
            height: 284px
            bg_color(bg04)
            border-radius: 10px
            margin-left 20px
            margin-top 20px
            cursor pointer
            overflow hidden
            display flex
            align-items center
            justify-content center
            hvr-grow()
            img
                border-radius 10px
                width 100%
                height 100%

            &:hover
                box_shadow(shadow01)

        .nohw
            img
                width auto !important
                height auto !important
                max-width 100%
                max-height 100%
</style>
