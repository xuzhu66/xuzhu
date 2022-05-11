<template lang="pug">
    .discout-con.w1200
        ul
            li(v-for="(value, index) in hotDiscountList" :key="index" @click="enterBannerFun(value)")
                img(:src="$ossImg(value.picUrl)" @error="imgError(value)")
            //li
                img( @error="imgError(value)")
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
    name: 'HotPre', // 热门优惠
    components: {},
    props: {},
    data() {
        return {
            //
        }
    },
    computed: {
        ...mapState({
            hotDiscountList: state => state.homeStore.hotDiscountList, //首页热门优惠
        })
    },
    created() {

    },
    watch: {},

    mounted() {
        this.pageInit()
    },
    methods: {
        ...mapActions({
            getHotListFun(dispatch, param) {
                return dispatch('homeStore/getHotListAction', param);
            },
            enterBannerFun(dispatch, data) {
                return dispatch('gameStore/enterBannerAction', data);
            }
        }),
        pageInit() {
            this.getHotListFun({type: 3}); // 类型： 1、首页热门推荐 2、首页热门游戏 3、首页热门优惠 4、洗码代理banner
        },
        imgError(item) {
            item.picUrl = require('@img/template2/home/noImg.png');
        },
        getGame(value, index) {
            this.$store.dispatch("gameStore/enterBannerAction", value).then(res => {});
        },
    }
}
</script>
<style lang="stylus" scoped>
@import '~@/assets/styles/template2/themes/mixin.styl'
@import "~@styl/template2/common/fun.styl"
.discout-con
    ul
        display flex
        justify-content flex-start
        flex-wrap wrap

        li
            border-radius: 10px
            cursor pointer
            overflow hidden
            flexcon()
            flex-wrap wrap
            transition all .3s ease-in-out
            img
                border-radius 10px
                width auto
                height auto
                max-width 100%
                max-height 100%

            &:hover
                box_shadow(shadow01)
                bigShadow()
            &:nth-child(1)
                width 810px
                height 220px
                flex none
                margin-right 10px

            &:nth-child(2)
                width 380px
                height 220px
                flex none

            &:nth-child(3)
                width 380px
                height 220px
                flex none
                margin-right 10px
                margin-top 10px

            &:nth-child(4)
                width 810px
                height 220px
                flex none
                margin-top 10px

</style>
