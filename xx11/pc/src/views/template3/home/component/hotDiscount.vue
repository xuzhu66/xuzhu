<template lang="pug">
    .discout-con
        .discout-flow.w1200
            .item-con.c01
                .item(class='banner1')
                    HotBanner(v-if='showFlag(hotDiscountList,0)', :list="hotDiscountList[0].array",bannerType="banner1",width="595",height="450")
            .item-con.c02
                .item(class='banner2')
                    HotBanner(v-if='showFlag(hotDiscountList,1)', :list="hotDiscountList[1].array",bannerType="banner2",width="290",height="220")

                .item(class='banner3')
                    HotBanner(v-if='showFlag(hotDiscountList,2)', :list="hotDiscountList[2].array",bannerType="banner3",width="290",height="220")

                .item(class='banner4')
                    HotBanner(v-if='showFlag(hotDiscountList,3)', :list="hotDiscountList[3].array",bannerType="banner4",width="290",height="220")

                .item(class='banner5')
                    HotBanner(v-if='showFlag(hotDiscountList,4)', :list="hotDiscountList[4].array",bannerType="banner5",width="290",height="220")

</template>

<script>
import {mapActions, mapState} from "vuex";
import HotBanner from '@pon/template3/hotBanner'; // 热门banner
export default {
    name: 'HotPre', // 热门优惠
    components: {
        HotBanner
    },
    props: {},
    data() {
        return {

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
            item.picUrl = require('@img/template3/home/noImg.png');
        },
        showFlag(item, inx) {
            if (item && item[inx] && item[inx].array) {
                return true;
            } else {
                return false;
            }
        }
    }
}
</script>
<style lang="stylus" scoped>
@import '~@/assets/styles/template3/themes/mixin.styl'
@import "~@styl/template3/common/fun.styl"
.discout-con
    .discout-flow
        flexcon()

        .item-con
            border-radius 10px

            &.c01
                width 595px
                height 450px
                flex none

            &.c02
                width 595px
                height 450px
                flex none
                margin-left 10px
                flexcon()
                flex-wrap wrap

            .item
                position relative
                cursor pointer
                border-radius 10px
                overflow hidden
                transition all .3s ease-in-out
                &:hover
                    bigShadow()
                img
                    border-radius 10px

                &.banner1
                    width 595px
                    height 450px
                    flex none

                &.banner2, &.banner3, &.banner4, &.banner5
                    width 290px
                    height 220px
                    flex none

                &.banner2, &.banner4
                    margin-right 10px

                &.banner2, &.banner3
                    margin-bottom 10px


</style>
