<template lang="pug">
    .discout-con
        .discout-flow.w1200
            .item-con.c01
                .item(class='banner1')
                    HotBanner(v-if='showFlag(recommendList,0)', :list="recommendList[0].array",bannerType="banner1",width="596",height="518")
            .item-con.c02
                .item(class='banner2')
                    HotBanner(v-if='showFlag(recommendList,1)', :list="recommendList[1].array",bannerType="banner2",width="290",height="254")
                .item(class='banner3')
                    HotBanner(v-if='showFlag(recommendList,2)', :list="recommendList[2].array",bannerType="banner3",width="290",height="254")
                .item(class='banner4')
                    HotBanner(v-if='showFlag(recommendList,3)', :list="recommendList[3].array",bannerType="banner4",width="290",height="254")
                .item(class='banner5')
                    HotBanner(v-if='showFlag(recommendList,4)', :list="recommendList[4].array",bannerType="banner5",width="290",height="254")

</template>

<script>
import {mapActions, mapState} from "vuex";
import HotBanner from '@pon/template3/hotBanner'; // 热门banner
export default {
    name: 'live', // 真人娱乐
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
            recommendList: state => state.homeStore.recommendList, //首页热门推荐
        }),
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
            this.getHotListFun({type: 1}); // 类型： 1、首页热门推荐 2、首页热门游戏 3、首页热门优惠 4、洗码代理banner
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
                height 518px
                flex none

            &.c02
                width 595px
                height 518px
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
                img
                    border-radius 10px

                &:hover
                    bigShadow()
                    .popbtn-con
                        bottom 0px

                &.banner1
                    width 600px
                    height 518px
                    flex none

                &.banner2, &.banner3, &.banner4, &.banner5
                    width 290px
                    height 254px
                    flex none

                &.banner2, &.banner4
                    margin-right 10px

                &.banner2, &.banner3
                    margin-bottom 10px

                .popbtn-con
                    position absolute
                    width 100%
                    height 100px
                    bottom -100px
                    left 0px
                    flexcon()
                    transition ease-in-out .3s
                    display noe
                    background rgba(204, 204, 204, .5)

//box_shadow(shadow_common)

</style>
