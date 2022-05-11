<template lang="pug">
    .modual-dialog.comPop(v-if="showFlag",class="comdialog")
        .dialog-wrap
            .dialog-content
                .dialog-main
                    .title 尊敬的客户您好:
                    .con
                        span 您的专属专员微信号
                        span.number {{wechat.wxCode}}
                        span 将为您提供热情优质的服务,与您携手共进、共创辉煌。
                    .btn-con(@click="closeModule") 我知道了
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
    name: "wechatDialog",
    data() {
        return {
            showFlag: false,
        };
    },
    watch: {
        wechat(val, oldval) {
            if(val){
                //this.showFlag = this.wechat.followWechatChange;
            }

        },
    },
    computed: {
        ...mapState({
            userId: state => state.userId, // 会员id
            wechat: state => state.headerStore.wechat, // 微信专员对象
        })
    },
    mounted() {

    },
    methods: {
        closeModule() {
            this.$emit('wechatClose');
            this.showFlag = false;
        }
    }
}
</script>

<style lang="stylus" scoped>
.modual-dialog
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .7);
    z-index: 998;

    .dialog-content
        position fixed
        top 50%
        left 50%
        transform: translate(-50%, -50%)
        background url("~@img/comimages/home/wechat/wechat.png") center / contain no-repeat
        width 723px
        height 693px

        .dialog-main
            height 180px
            margin 240px auto 0px
            width 540px
            padding 20px
            overflow auto
            font-size 18px
            .title
                margin-bottom 10px
            .con
                span
                    line-height 30px
                    &.number
                        padding 0 6px
            .btn-con
                color #fff
                width 200px
                height 60px
                background linear-gradient(#dba057, #ffd5a0)
                position absolute
                bottom 10px
                z-index 2
                line-height 60px
                text-align center
                border-radius 18px
                letter-spacing 4px
                left 50%
                transform translateX(-50%)
                cursor pointer
</style>

