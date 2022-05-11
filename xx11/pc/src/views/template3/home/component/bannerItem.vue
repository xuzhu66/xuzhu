<template lang="pug">
    .game-page
        .game-list-con
            .game-flow
                .game-item(v-for="item in list")
                    .flex-con
                        .item-left(:style="`background-image:url(${item.picUrl})`")
                        .item-right
                            .game-line-name {{item.title}}
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
@import '~@/assets/styles/template3/themes/mixin.styl'
@import "~@styl/template3/common/fun.styl"
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
                position relative
                flex none
                border 1px sllid transparent
                width: 590px;
                height: 280px;
                bg_color(bg2)
                border-radius: 6px;
                margin-bottom 20px
                transition ease-in-out .3s

                &:hover
                    box_shadow(shadow_yellow)
                    transform scale(1.03)

                &:nth-child(even)
                    margin-left 20px

                .flex-con
                    flexcon()

                    .item-left
                        flex none
                        width: 400px;
                        height: 280px;
                        background-position center
                        background-size cover
                        background-repeat no-repeat
                        border-top-left-radius 10px
                        border-bottom-left-radius 10px

                    .item-right
                        flex none
                        width: 190px;
                        height: 280px;
                        padding 20px
                        position relative

                        .game-line-name
                            font-size: 20px;
                            font_color(fc4)
                            padding-left 10px
                            position relative
                            font-weight 600
                            letter-spacing 2px

                            &:after
                                after()
                                width: 3px;
                                height: 20px;
                                bg_img_linear(linear_common)
                                left 0px
                                top 5px
                                border-radius 2px

                        .futitle
                            font-size: 14px;
                            font_color(fc4)
                            margin 10px 0

                        .detial
                            margin-top 30px
                            margin-bottom 10px
                            font-size: 12px;
                            font_color(fc3)
                            word-break: break-all;

                        .buts-con
                            margin-top 10px
                            position absolute
                            bottom 20px
                            left 50%
                            transform translateX(-50%)
                            flexcon()
                            justify-content space-between
                            width 100%
                            padding-left 10px
                            .common-btn
                                width: 80px;
                                height: 36px;
                                line-height 36px
                                border-radius: 4px;
                                font-size 14px
                                transition all .3s ease-in-out
                                &:hover
                                    transform scale(1.1)
                                &.ok
                                    bg_img_linear(linear_common)
                                    font_color(fc6)
                                    margin-left auto

                                &.empty
                                    font_color(fc4)
                                    background none
                                    border_img_linear(btn_linear)
                                    &:hover
                                        bg_img_linear(linear_common)
                                        font_color(fc6)

</style>
