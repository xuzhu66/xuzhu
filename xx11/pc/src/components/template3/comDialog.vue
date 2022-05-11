<template lang="pug">
    .modual-dialog.comPop(v-if="show",:class="clasz?clasz:''",class="comdialog")
        .dialog-wrap
            .dialog-content(:class="closeFlag?'close-animate':''")
                .dialog-header
                    .close-icon(v-if="showClose",@click="closeModule")
                        svg-icon(icon-class='close')
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
@import '~@/assets/styles/template3/themes/mixin.styl'
@import "~@styl/template3/common/fun.styl"
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
        transform: translate(-50%, -50%)
        min-height 300px
        min-width 500px
        overflow: hidden;
        bg_color(bg2)
        animate__dialogFadeInDownBig()
        &.close-animate
            animate__dialogFadeOutDownBig()
        .dialog-header
            height: 50px
            line-height 50px
            text-align center
            bg_color(bg1)
            font_color(fc3)
            font-size 16px
            .close-icon
                width 16px
                height 16px
                line-height 16px
                position absolute
                right 10px
                top 12px
                transition all .3s ease-in-out
                cursor pointer
                &:hover
                    transform rotate(180deg)

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
            bg_color(bg1)

            .cancel
                border: 1px solid;
                padding: 6px 28px;
                border-radius: 6px;
                font-size: 16px;
                font_color(fc6)
                border_all(1px, solid, btn_border_ng)

            .ok
                padding: 6px 28px;
                border-radius: 6px;
                font_color(fc6)
                bg_color(btn_bg_ok)
                border: 0;
                margin-right 20px


</style>

