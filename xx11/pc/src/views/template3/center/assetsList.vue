<template lang="pug">
    .money-list
        .money-left
            .name 总资产(元)：
            .number ¥{{wallet.sumAssets | format}}
        .money-right
            .name 中心钱包(元)：
            .number ¥{{wallet.balance | format}}
            .refrash(@click="turnInAllwalletFun") 一键回收
</template>

<script>
import {formatAmount, thousandBitForma} from '@m/utils'
import {mapActions, mapState} from "vuex";

export default {
    name: "assetsList",
    filters: {
        format(vlaue) {
            if (vlaue) {
                return formatAmount(vlaue);
            } else {
                return "0"
            }
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state['centerStore'].userInfo,
            wallet: state => state['centerStore'].wallet,
        }),
    },
    methods: {
        ...mapActions({
            // 查询用户信息
            getAssetsFun(dispatch, param) {
                return dispatch(`centerStore/getAssetsAction`, param);
            },
            // 一键回收
            turnInAllwalletFun(dispatch, param) {
                return dispatch(`centerStore/turnInAllwalletAction`, param);
            },
        }),
        //刷新
        refrash() {
            this.getAssetsFun();
        },

    }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template3/themes/mixin.styl'
.money-list
    height: 125px;
    bg_color(bg2)
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
            bg_color(border_common)
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
        font_color(fc3);

    .number
        margin-top 15px
        font-size: 30px;
        font_color(fc2);

    .refrash
        position absolute
        font-size: 14px;
        font_color(fc4)
        right 20px
        top 10px
        cursor pointer

</style>
