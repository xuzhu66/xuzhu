<template lang="pug">
    .drawIndex
        assets
        .com-tab
            ul
                //li(@click="tabClick(1)" :class="curttTab == 1?'active':''")  存款
                li(@click="tabClick(2)" :class="curttTab == 2?'active':''")  取款专区
                //li(@click="tabClick(3)" :class="curttTab == 3?'active':''")  转账
        .deposit-con
            component(:is="currtTemplateIndex")

</template>

<script>
import draw from './draw' ;
import deposit from './deposit' ;
import transfer from './transfer' ;
import assetslist from "./assetsList";

export default {
    name: "drawIndex",
    components: {
        "draw": draw,
        "deposit": deposit,
        "transfer": transfer,
        "assets": assetslist,
    },
    data() {
        return {
            isReqFlag: true, // 请求是否结束
            curttTab: 2,
            currtTemplateIndex: draw
        };
    },
    methods: {
        tabClick(tab) {
            if (tab == 1) {
                this.curttTab = tab;
                this.currtTemplateIndex = deposit;
            } else if (tab == 2) {
                this.curttTab = tab;
                this.currtTemplateIndex = draw;
            } else if (tab == 3) {
                this.curttTab = tab;
                this.currtTemplateIndex = transfer;
            }
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template1/themes/mixin.styl'
@import "~@styl/template1/common/fun.styl"

.drawIndex
    .com-tab
        width 100%
        height: 70px;
        line-height 70px
        font-size: 20px;
        letter-spacing: 0px;
        font_color(fc06);
        bg_color(bg04);
        border-radius: 10px 10px 0px 0px;
        border_com(1px, solid, border08, bottom)
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
                    font_color(fc015)

                &.active
                    font_color(fc015)

                    &:after
                        content ''
                        display block
                        width 100px
                        height 4px
                        bg_color(bg12)
                        bottom 2px
                        left 50%
                        transform translateX(-50%)
                        position: absolute;
                        border-radius: 4px;


</style>
