<template lang="pug">
    .transferIndex
        assets
        .com-tab
            ul
                //li(@click="tabClick(1)" :class="curttTab == 1?'active':''")  存款
                //li(@click="tabClick(2)" :class="curttTab == 2?'active':''")  取款
                li(@click="tabClick(3)" :class="curttTab == 3?'active':''")  转账专区
        .deposit-con
            component(:is="currtTemplateIndex")

</template>

<script>
import draw from './draw' ;
import deposit from './deposit' ;
import transfer from './transfer' ;
import assetslist from './assetsList' ;

export default {
    name: "transferIndex",
    components: {
        "draw": draw,
        "deposit": deposit,
        "transfer": transfer,
        "assets": assetslist,
    },
    data() {
        return {
            isReqFlag: true, // 请求是否结束
            curttTab: 3,
            currtTemplateIndex: transfer
        };
    },
    methods: {
        tabClick(tab) {
            if (tab == 1) {
                this.curttTab = tab;
                this.currtTemplateIndex = deposit;
            } else if (tab == 2) {
                window.win.store.dispatch("drawStore/checkDrawAction").then(res => {
                    if (res && res.success) {
                        this.curttTab = tab;
                        this.currtTemplateIndex = draw;
                    } else {

                    }
                })
            } else if (tab == 3) {
                this.curttTab = tab;
                this.currtTemplateIndex = transfer;
            }
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template2/themes/mixin.styl'
@import "~@styl/template2/common/fun.styl"

.transferIndex
    .money-list
        height: 125px;
        bg_color(bg63)
        border-radius: 10px;
        display flex
        flex-direction row
        flex-wrap nowrap
        justify-content center
        align-items center
        opacity .8
        margin-bottom 20px

        .money-left
            flex 1
            height 100%
            display flex
            flex-direction column
            justify-content center
            align-items flex-start
            padding-left 30px
            position relative

            &:after
                content ''
                display block
                width 1px
                height 90px
                bg_color(bg11)
                position absolute
                right 10px
                top 50%
                transform translateY(-50%)

        .money-right
            flex 1
            height 100%
            display flex
            flex-direction column
            justify-content center
            align-items flex-start
            padding-left 30px
            position relative

        .name
            font-size: 18px;
            font_color(fc05);

        .number
            margin-top 15px
            font-size: 30px;
            font_color(fc05);

        .refrash
            position absolute
            font-size: 14px;
            font_color(fc014)
            right 20px
            top 10px
            cursor pointer

    .com-tab
        width 100%
        height: 70px;
        line-height 70px
        font-size: 20px;
        letter-spacing: 0px;
        font_color(fc087);
        bg_color(bg55);
        border-radius: 10px 10px 0px 0px;
        //border_com(1px,solid,border51,bottom)
        position relative
        transition all .3s

        ul
            resetul()
            display flex
            flex-wrap nowrap
            justify-content flex-start

            li
                flex none
                width 180px
                text-align center
                position relative
                cursor pointer

                &:hover
                    font_color(fc092)

                &.active
                    font_color(fc092)

                    &:after
                        content ''
                        display block
                        width 100px
                        height 4px
                        bg_color(fc092)
                        bottom 2px
                        left 50%
                        transform translateX(-50%)
                        position: absolute;
                        border-radius: 4px;


</style>
