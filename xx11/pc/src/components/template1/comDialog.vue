<template lang="pug">
    .modual-dialog.comPop(v-if="show",:class="[clasz?clasz:'']",class="comdialog")
        .dialog-wrap
            .dialog-content(:class="closeFlag?'close-animate':''")
                .dialog-header
                    span.icon-close(v-if="showClose",@click="closeModule")
                    slot(name='header')
                .dialog-main
                    slot
                .dialog-footer(v-if="showFooter")
                    slot(name='footer')

</template>

<script>
export default {
    name: "comDialog",
    data() {
        return {
            showFlag: true,
            closeFlag:false,//关闭状态
        };
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: "提示"
        },
        showFooter: {
            type: Boolean,
            default: false
        },
        clasz: {
            type: String,
            default: ""
        },
        showClose:{
            type: Boolean,
            default: true
        }
    },
    methods: {
        closeModule() {
            this.closeFlag = true;
            setTimeout(()=>{
                this.closeFlag = false;
                this.$emit('input', false);
                this.$emit('on-cancel');
            },500)
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '~@styl/template1/common/fun.styl'
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
        top 45%
        left 50%
        border-radius: 8px
        //transform: translate(-50%, -50%)
        min-height 300px
        min-width 500px
        overflow: hidden;
        background: #fff;
        animate__dialogFadeInDownBig()
        &.close-animate
            animate__dialogFadeOutDownBig()
        .dialog-header
            height: 50px
            line-height 50px
            text-align center
            background #f1f3f7
            color #454a53
            font-size 16px

            .icon-close
                position: absolute
                top: 13px
                right: 13px
                font-size: 14px
                padding 2px
                border-radius: 50%
                width 18px
                height 18px
                display inline-block
                cursor: pointer
                transition: all .5s
                color #fff
                background url("~@img/template1/center/close.svg") center / 100% no-repeat

                &:hover
                    transform rotate(100deg)

        .dialog-main
            padding: 20px
            //margin-bottom 50px
            max-height: 700px;
            overflow: auto;

        .dialog-footer
            position absolute
            bottom 0px
            width 100%
            height 50px
            line-height 50px
            text-align center
            background #121212

            .cancel
                border: 1px solid;
                padding: 6px 28px;
                border-radius: 6px;
                font-size: 16px;
                color: #aa9375;
                border-color: #aa9375;

            .ok
                padding: 6px 28px;
                border-radius: 6px;
                color: #333;
                background: #f0d868;
                border: 0;
                margin-right 20px


</style>

