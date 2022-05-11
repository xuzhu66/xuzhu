<template lang="pug">
    .page-con
        // 领取中心
        comDialog(:show-footer='false',:show="showDialog",@on-cancel="closeDialog")
            div(slot="header") 领取中心
            div.dialog-con(slot="default")
                .item-con
                    .item(v-for="(item, index) in drawList" :key="index")
                        .vip(v-if="item.type==1") VIP{{item.vipId - 1}}
                        .title(:class="item.type==2?'activity':''") {{item.name}}
                        .money
                            span ¥
                            span {{item.amount}}
                        .type-title(v-if="item.type==2") 活动彩金
                        .btn-lingqu(@click="drawSingle(item)", :class="{'has-get': item.hasGet}") {{item.hasGet ? '已领取' : '领取'}}
                        .msg 已满足领取条件
                .nodata(v-if="drawList.length == 0")
                .btn-con(v-if="drawList.length != 0",@click="drawAll", :class="{'has-get': drawNumber <= 0}") 一键领取

            div(slot="footer")
</template>

<script>
import comDialog from '@pon/template1/comDialog'
import {mapGetters, mapState, mapMutations, mapActions} from 'vuex';
import store from '@/store/Store';
import {formatAmount} from '@m/utils'

export default {
    name: "drawCenter",
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
            drawList: state => state['headerStore'].drawList,
            drawNumber: state => state['headerStore'].drawNumber,
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
            // this.gameVipObjFun().then(res => {
            //     if (res && res.success) {
            //
            //     }
            // })
        },
        drawSingle(item) {
            this.$store.dispatch('headerStore/drawSingle', item);
        },
        drawAll() {
            if (this.drawList.length == 0) return
            this.$store.dispatch('headerStore/drawAll');
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template1/themes/mixin.styl'
@import "~@styl/template1/common/fun.styl"
// notdata
.nodata
    background url("~@/assets/images/template1/center/kongbaitu.png") center / auto 270px no-repeat #fff
    display: block;
    width: 100%;
    height: 450px;
// 弹框--领取中心
.dialog-con
    width 707px
    max-height 450px
    overflow auto
    .item-con
        //flexcon()
        display flex
        flex-wrap wrap
        align-items center
        .item
            flex none
            width: 220px;
            height: 174px;
            background-color: #ffffff;
            border-radius: 10px;
            border: solid 1px #f6e9d2;
            position relative
            margin-bottom 10px
            margin-left 20px
            &:nth-child(3n + 1)
                margin-left 0
            .vip
                position absolute
                width: 46px;
                height: 18px;
                background-color: #cd9636;
                border-radius: 10px 0px 18px 0px;
                opacity: 0.5;
                top 0px
                left 0px
                text-align center
                color: #3a2807;
                font-size 12px
            .title
                color: #c88f2d;
                text-align center
                border-bottom 1px solid #f2f2f2
                height 30px
                line-height 30px
                overflow hidden
                white-space nowrap
                text-overflow ellipsis
                padding 0 20px
                &.activity
                    cursor pointer
            .money
                line-height: 24px;
                letter-spacing: 0px;
                color: #1b1203;
                text-align center
                font-size 20px
                font-weight 500
                margin 20px
                span:nth-child(1)
                    font-size 14px
            .type-title
                text-align center
                font-size 12px
                color #c88f2d
                position absolute
                top 35px
                left 50%
                transform translateX(-50%)
            .btn-lingqu
                width: 90px;
                height: 36px;
                background-color: #ecb452
                border-radius: 18px;
                color #fff
                text-align center
                line-height 36px
                margin 0 auto
                cursor pointer
                &.has-get
                    background-color #cccccc
                    cursor none
            .msg
                color: #cccccc;
                font-size 12px
                text-align center
                margin-top 10px

        .empty
            border none
            height 0

    .btn-con
        width: 221px;
        height: 40px;
        background-color #bb9759
        border-radius: 20px;
        color #fff
        margin 10px auto
        text-align center
        line-height 40px
        cursor pointer
        &.has-get
            background-color #cccccc
            cursor none


</style>
