<template lang="pug">
    .game-page
        .game-list-con
            .game-flow
                .game-item(v-for="item in list")
                    .flex-con
                        .item-left(:style="`background-image:url(${item.picUrl})`")
                        .item-right
                            .game-line-name {{item.title}}
                    .item-pop
                        .title {{item.title}}
                        .futitle {{item.intro}}
                        .detial  {{item.content}}
                        .buts-con
                            .common-btn.ok(@click="enterBannerFun(item)") 立即游戏
                            .common-btn.empty(v-if="item.pcfreePlayFlag",@click="enterBannerFun(item)") 开始试玩

</template>
<script>
import {mapActions} from "vuex";

export default {
    name: 'BannerItem', // 玩家
    components: {},
    computed: {},
    props: {
        seatType: {
            type: Number,
            default: 0
        },
    },
    data() {
        return {
            list: '', // 游戏列表
        }
    },
    created() {
        // 获取游戏列表
        this.getGameListFun({seatType: this.seatType}).then(res => {
            if (res && res.success) {
                this.list = res.data;
            }
        })
    },
    mounted() {

    },
    methods: {
        ...mapActions({
            // 获取游戏列表
            getGameListFun(dispatch, param) {
                return dispatch('homeStore/getGameListAction', param)
            },
            //  进入banner
            enterBannerFun(dispatch, param) {
                return dispatch('gameStore/enterBannerAction', param)
            },

        }),
        eventFun() {
            this.$emit('input', false);
            this.$emit('on-cancel');
        },
    }
}
</script>
<style lang="stylus" scoped>
@import '~@/assets/styles/template2/themes/mixin.styl'
@import "~@styl/template2/common/fun.styl"
.game-page
    overflow-x hidden
    padding-bottom 6px

    .game-list-con
        width 1200px
        margin 60px auto

        .game-flow
            flexcon()
            flex-wrap wrap
            justify-content flex-start

            .game-item
                background url("~@img/template2/home/bg/bg_001.png") center / contain no-repeat
                position relative
                flex none
                border 1px sllid transparent
                width: 590px;
                height: 280px;
                background-color: #2b2b32;
                border-radius: 6px;
                margin-bottom 20px
                transition ease-in-out .3s

                &:hover
                    box_shadow(shadow01)
                    transform scale(1.03)

                &:nth-child(even)
                    margin-left 20px

                .flex-con
                    flexcon()

                    .item-left
                        flex none
                        width: 400px;
                        height: 280px;
                        background-origin: center
                        background-size cover
                        background-repeat no-repeat
                        border-top-left-radius 10px
                        border-bottom-left-radius 10px

                    .item-right
                        flex none
                        width: 190px;
                        height: 280px;
                        padding 20px

                        .game-line-name
                            font-size: 24px;
                            color: #d3a352;
                            padding-left 10px
                            position relative
                            font-weight 600
                            letter-spacing 2px

                            &:after
                                after()
                                width: 3px;
                                height: 18px;
                                background-image: linear-gradient(0deg, #ecb350 0%, #fcd694 100%), linear-gradient(#98a0a6, #98a0a6);
                                left 0px
                                top 10px
                                border-radius 2px

                .item-pop
                    padding 36px 10px 10px 36px
                    position absolute
                    bottom 0px
                    right 0px
                    width: 294px;
                    height: 214px;
                    background url("~@img/template2/home/bg/bg_banner.png") center / contain no-repeat

                    .title
                        font-size: 20px;
                        color: #fafafa;
                        font-weight 600

                    .futitle
                        font-size: 14px;
                        color: #ecb351;
                        margin-bottom 10px

                    .detial
                        margin-bottom 10px
                        font-size: 12px;
                        color: #cccccc;
                        word-break: break-all;

                    .buts-con
                        margin-top 10px
                        position absolute
                        bottom 20px
                        left 50%
                        transform translateX(-50%)
                        flexcon()

                        .common-btn
                            width: 108px;
                            height: 48px;
                            border-radius: 10px;
                            transition all .3s ease-in-out
                            &:hover
                                transform scale(1.1)
                            &.ok
                                background-image: linear-gradient(90deg, #ecb350 0%, #fcd694 100%), linear-gradient(#98a0a6, #98a0a6);

                            &.empty
                                font_color(fc092)
                                margin-left 20px
                                background url("~@img/template2/home/bg/bg_btn02.png") center / contain no-repeat
</style>
