<template lang="pug">
    .depositIndex
        //assets
        //.com-tab
        //    ul
        //        li(v-for="item in depositType",@click="selectDepositType(item)",:class="[currtDepositType.id==item.id?'active':'']")
        //            span.type-icon(:style="`background-image: url(${$ossImg(item.iconUrl)})`")
        //            span {{item.name}}
        //            span(:class="item.activityFlag?'show-icon':''")
        .deposit-con
            component(:is="currtTemplateIndex")

</template>

<script>
import draw from './draw';
import deposit from './deposit';
import transfer from './transfer';
import assetslist from './assetsList';
import {mapActions, mapMutations, mapState} from "vuex";
import store from "@/store/Store";
import thatStore from "@/store/comstore/assets/depositStore"; // 工具类
export default {
    name: "depositIndex",
    //comments:[draw,deposit,transfer,assetslist],
    components: {
        "draw": draw,
        "deposit": deposit,
        "transfer": transfer,
        "assets": assetslist,
    },
    data() {
        return {
            isReqFlag: true, // 请求是否结束
            curttTab: 1,
            currtTemplateIndex: deposit
        };
    },
    computed: {
        ...mapState({
            depositType: state => state['depositStore'].depositType,//支付类型列表
            currtDepositType: state => state['depositStore'].currtDepositType,// 当前支付类型
            showIcon: state => state.depositStore.showIcon,// 是否显示活动图标
        }),
    },
    created() {
        // 动态store
        if (!store.state["depositStore"]) {
            thatStore.install(this);
        }
        // 获取支付类型-tab列表
        this.getDepositTypeFun().then(res => {
            if (res && res.success) {
                // 默认选中第一个
                // this.selectDepositType(res.data[0])
                let data = res.data
                for (let i = 0; i < data.length; i++) {
                    if (data[i].id == 888) {
                        this.selectDepositType(res.data[i])
                    }
                }
            }
        })
    },
    methods: {
        ...mapMutations({
            // 设置当前支付类型
            setCurrtDepositTypeFun(commit, param) {
                return commit('depositStore/SET_CURRT_DEPOSIT_TYPE', param);
            }
        }),
        ...mapActions({
            // 获取支付类型-tab列表
            getDepositTypeFun(dispatch, param) {
                return dispatch(`depositStore/getDepositTypeAction`, param);
            },
        }),
        // 选择存款方式
        selectDepositType(item) {
            // 如果是点击的相同的tab 则返回;
            if (this.currtDepositType && item.id == this.currtDepositType.id) {
                return;
            }
            this.setCurrtDepositTypeFun(item);
            // 触发支付列表查询方法
            // this.$root.eventHub.$emit("depositTab");
        }

    }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template3/themes/mixin.styl'
@import "~@styl/template3/common/fun.styl"

.depositIndex
    margin-bottom 60px

    .money-list
        height: 125px;
        bg_color(bg2)
        box_shadow(shadow_common)
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
            font_color(fc3);

        .refrash
            position absolute
            font-size: 14px;
            font_color(fc4)
            right 20px
            top 10px
            cursor pointer

    .com-tab
        width 100%
        height: 80px;
        overflow auto;
        line-height 70px
        font-size: 18px;
        letter-spacing: 0px;
        font_color(fc3);
        bg_color(bg2);
        border-radius: 10px 10px 0px 0px;
        border_com(1px, solid, border_common, bottom)
        position relative
        transition all .3s

        ul
            resetul()
            display flex
            flex-wrap nowrap
            justify-content flex-start

            li
                flex none
                //width 190px
                text-align center
                position relative
                cursor pointer
                flexcon()
                padding-left 24px
                &:hover
                    font_color(fc4)

                &.active
                    font_color(fc4)
                .show-icon
                    background url("~@img/comimages/center/deposit/feather01.png") center / contain no-repeat
                    width 36px
                    height 18px
                    position absolute
                    top 0px
                    right 0px
                &:not(:last-child)
                    &:after
                        content ''
                        display block
                        width 1px
                        height 30px
                        bg_color(border_common)
                        position: absolute;
                        border-radius: 2px;
                        top 50%
                        transform translateY(-50%)
                        right -10px

                .type-icon
                    display: inline-block;
                    width 24px
                    height 24px
                    background-position center
                    background-size contain
                    background-repeat no-repeat
                    margin-right 4px
                    border-radius 4px

</style>
