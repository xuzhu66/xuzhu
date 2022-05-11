<template lang="pug">
    comDialog(:show-footer='false',:show="showDialog",@on-cancel="closeDialog")
        div(slot="header") 会员等级
        div.dialog-con(slot="default")
            .vipcon
                .title 等级规则详情(升级):实时生效
                .vip-list-con
                    ul
                        li
                            span 等级级别
                            span 存款金额(升级达标金额)
                        li(v-for="item in vipObj.upgrade")
                            span(:class="item.name") {{item.name}}
                            span {{item.depositMaxAmout}}

                        //li
                            span.vip1 VIP1
                            span 1

                .rule-up-con
                    .rule-title 升级规则
                    ul
                        li 1.只计算当月累计的存款金额,当月存款累计金额达到某个等级的升级条件的存款起始金额,那么就立即变为该等级;
                        li 2.次月清空上月的存款金额,重新计算,如游戏会员A,当前等级为VIP2,上个月累计存款了4,999元；本月存款了1元,总存款为VIP3等级存款金额的起始金额5,000元,那么该会员不会由VIP2变为VIP3，本月还需存款4,999元,才会成为VIP3;
                        li 3.可跳级升级;如游戏用户A当前等级为普通会员,VIP3等级存款金额的起始金额为5,000元,本月存款了5,000元,那么会员等级直接由普通会员变成VIP3。

                .rule-down-con
                    .rule-title 等级规则详情(降级):次月一日生效
                    ul
                        li
                            span 等级级别
                            span 月最低存款额
                        li(v-for="item in vipObj.downgrade")
                            span(:class="item.name") {{item.name}}
                            span {{item.depositMinAmout}}
                        //li
                            span VIP6--VIP5
                            span 1,800,000

                .rule-down-con2
                    .rule-title 降级规则
                    ul
                        li 按月逐级降级；如游戏会员A当前等级为VIP6，VIP6的保级月最低存款金额为{{getLastAmount(vipObj)}}元；
                        li 1.本月存款未达到VIP6的保级月最低存款金额{{getLastAmount(vipObj)}}元，那么次月降为VIP5；
                        li 2.本月存款达到VIP6的保级月最低存款金额{{getLastAmount(vipObj)}}元，那么次月不降级还是VIP6；
                        li 3.本月未存款，那么次月降为VIP5，不会直接变为普通会员，需要连续6个月未存款才会变成普通会员，一个月只降一级

        //div(slot="footer")
</template>

<script>
import comDialog from '@pon/template3/comDialog'
import {mapGetters, mapState, mapMutations, mapActions} from 'vuex';
import store from '@/store/Store';
import {formatAmount} from '@m/utils'

export default {
    name: "vipDialog",
    components: {
        comDialog,
    },
    props: {
        showDialog: {
            type: Boolean,
            default: false
        },
        closeDialog: {
            type: Function,
        }

    },
    computed: {
        ...mapState({
            vipObj: state => state['headerStore'].vipObj,
        }),
    },
    /*updated() {
        if(!this.vipObj){
            this.initPage()
        }
    },*/
    mounted() {
        if (!this.vipObj) {
            this.initPage()
        }
    },
    data() {
        return {}
    },
    methods: {
        ...mapActions({
            gameVipObjFun(dispatch, param) {
                return dispatch(`headerStore/gameVipObj`, param);
            },
        }),
        formatAmount: formatAmount,
        initPage() {
            this.gameVipObjFun().then(res => {
                if (res && res.success) {

                }
            })
        },
        getLastAmount(item){
            let num = 0;
            if(item && item.downgrade && item.downgrade[5] && item.downgrade[5].depositMinAmout){
                num = item.downgrade[5].depositMinAmout
            }
            return num;

        }
    }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template3/themes/mixin.styl'
@import "~@styl/template3/common/fun.styl"

.dialog-con
    width 700px
    height 450px

    .vipcon
        .title
            height: 20px;
            font-size: 18px;
            font_color(fc3);
            padding-bottom 20px

        .vip-list-con
            ul
                resetul()
                margin-top 20px

                li
                    display flex
                    flex-direction row
                    justify-content center
                    align-items center
                    height 50px
                    border_com(1px, solid, border_common, bottom)

                    &:nth-child(1)
                        bg_color(bg1)
                        border-radius 10px 10px 0px 0px
                        font-size: 16px;
                        font_color(fc3);

                    span
                        display inline-block
                        height 50px
                        line-height 50px
                        text-align center
                        font-size: 14px;
                        font-weight: normal;
                        font-stretch: normal;
                        letter-spacing: 0px;
                        font_color(fc3)
                        position relative

                        &:nth-child(1)
                            flex 2
                            border_com(1px, solid, border_common, right)

                        &:nth-child(2)
                            flex 3

                        &.普通会员:after
                            content ""
                            display block
                            background url("~@img/template3/center/v0.png") center no-repeat
                            width 28px
                            height 25px
                            position absolute
                            top 50%
                            transform translateY(-50%)
                            left 80px

                        &.vip1:after
                            content ""
                            display block
                            background url("~@img/template3/center/v1.png") center no-repeat
                            width 28px
                            height 25px
                            position absolute
                            top 50%
                            transform translateY(-50%)
                            left 80px

                        &.vip2:after
                            content ""
                            display block
                            background url("~@img/template3/center/v2.png") center no-repeat
                            width 28px
                            height 25px
                            position absolute
                            top 50%
                            transform translateY(-50%)
                            left 80px

                        &.vip3:after
                            content ""
                            display block
                            background url("~@img/template3/center/v3.png") center no-repeat
                            width 28px
                            height 25px
                            position absolute
                            top 50%
                            transform translateY(-50%)
                            left 80px

                        &.vip4:after
                            content ""
                            display block
                            background url("~@img/template3/center/v4.png") center no-repeat
                            width 28px
                            height 25px
                            position absolute
                            top 50%
                            transform translateY(-50%)
                            left 80px

                        &.vip5:after
                            content ""
                            display block
                            background url("~@img/template3/center/v5.png") center no-repeat
                            width 28px
                            height 25px
                            position absolute
                            top 50%
                            transform translateY(-50%)
                            left 80px

                        &.vip6:after
                            content ""
                            display block
                            background url("~@img/template3/center/v6.png") center no-repeat
                            width 28px
                            height 25px
                            position absolute
                            top 50%
                            transform translateY(-50%)
                            left 80px


        .rule-up-con, .rule-down-con2
            .rule-title
                height: 18px;
                font-size: 18px;
                font_color(fc3);
                margin 20px 0px

            ul
                resetul()
                margin-bottom 20px
                font-size: 14px;
                font_color(fc3);

                li
                    line-height: 30px;

        .rule-down-con
            .rule-title
                height: 18px;
                font-size: 18px;
                font_color(fc3);
                margin 20px 0px

            ul
                resetul()
                margin-bottom 20px
                font-size: 14px;
                font_color(fc3);

                li
                    display flex
                    flex-direction row
                    justify-content center
                    align-items center
                    height 50px
                    border_com(1px, solid, border_common, bottom)

                    &:nth-child(1)
                        bg_color(bg1)
                        border-radius 10px 10px 0px 0px
                        font-size: 16px;
                        font_color(fc3);

                    span
                        display inline-block
                        height 50px
                        line-height 50px
                        text-align center
                        font-size: 14px;
                        font-weight: normal;
                        font-stretch: normal;
                        letter-spacing: 0px;
                        font_color(fc3)
                        position relative

                        &:nth-child(1)
                            flex 2
                            border_com(1px, solid, border_common, right)

                        &:nth-child(2)
                            flex 3
</style>
