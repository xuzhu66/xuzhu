<template lang="pug">
    #dialogEffect.dialog-effect-wrap
        #dialogBox.dialog-box
            .dialog-header
                .title {{ title }}
                span.icon-box(@click='closeBut()' v-show='showTopClose')
                    svg-icon(icon-class='close')
            .dialog-body(:class="[{ 'dcon-left': conClass == 'left', 'dialog-mb20': !btnTextLeft&& !btnTextRight }]")
                component(v-if='curTemp' :is='`s-${curTemp}`')
                span.text(:class="[{ 'diatxt-left': diatxtClass }]" v-html='text')
                .dialog-footer
                    button.btn.my-dbut(v-show='btnTextLeft' @click='confirmBut(urlLeft,actionLeft)' :class="[{'diog-but-console' : leftBut}]")
                        | {{ btnTextLeft }}
                    button.btn.my-dbut(v-show='btnTextRight' @click='confirmBut(urlRight,actionRight)' :class="[{'diog-but-console' : rightBut}]")
                        | {{ btnTextRight }}
        #bg.bg(@click='closeBut()')

</template>

<script>
const UserAgreement = () => import(/* webpackPrefetch: true */ '@/views/template2/common/footer/userAgreement'); // 用户协议
const Respons = () => import(/* webpackPrefetch: true */ '@/views/template2/common/footer/respons'); // 责任
const Exceptions = () => import(/* webpackPrefetch: true */ '@/views/template2/common/footer/exceptions'); // 免责条款
const Privacy = () => import(/* webpackPrefetch: true */ '@/views/template2/common/footer/privacy'); // 用户隐私
const Help = () => import(/* webpackPrefetch: true */ '@/views/template2/common/footer/help'); // 帮助中心

export default {
    name: "DialogComponet",
    components: {
        "s-userAgreement": UserAgreement, // Banner轮播图片
        "s-respons": Respons, // 责任
        "s-exceptions": Exceptions, // 免责条款
        "s-privacy": Privacy, // 用户隐私
        "s-help": Help, // 帮助中心
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: "温馨提示"
        },
        conClass: String,
        text: String,
        btnTextLeft: {
            type: String,
            default: ""
        },
        btnTextRight: {
            type: String,
            default: ""
        },
        showTopClose: { // 是否显示标题处关闭图标
            type: Boolean,
            default: true
        },
        leftBut: { // 左边按扭是否白底
            type: Boolean
        },
        rightBut: { // 右边按扭是否白底
            type: Boolean,
            default: false
        },
        urlLeft: { // 左边连接
            type: String,
            default: ""
        },
        urlRight: { // 右边连接
            type: String,
            default: ""
        },
        actionRight: { // 右边连接方法
            type: Boolean,
            default: true
        },
        actionLeft: { // 左边连接方法
            type: Boolean,
            default: true
        },
        curTemp: { // 左边连接方法
            type: String,
            default: ""
        },
        diatxtClass: { // 是否居右
            type: Boolean,
            default: false
        },
        cb: null,
        closeFun: {
            type: Function,
            default: () => {}
        }
    },
    methods: {
        closeBut() {
            if (this.btnTextLeft != "去登录") {
                window.win.mydialog.hidden(null,this.closeFun);
            } else {
                window.win.mydialog.hidden(this.cb,this.closeFun);
            }
        },
        confirmBut(url, isAction) {
            if (this.cb && typeof this.cb === "function") {
                if (isAction) {
                    window.win.mydialog.hidden(this.cb);
                } else {
                    window.win.mydialog.hidden(null,this.closeFun);
                }
                if (url) {
                    if (url.indexOf("http") !== -1) {
                        window.open(url, "_blank");
                    } else {
                        window.win.router.push(url)
                    }
                }
            } else {
                this.closeBut();
            }
            if (this.cb && this.actionRight) {
            }
            if (url) {
                return url;
            } else {
                return "---------"
            }
        }
    }
};
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template2/themes/mixin.styl'
@import "~@styl/template2/common/fun.styl"
.dialog-effect-wrap
    @keyframes closebox
        from
            opacity: 1;
        to
            opacity: 0;
            top: 55%;
    @keyframes fadeOut
        from
            opacity: 0.8;
        to
            opacity: 0;


    .dialog-fadeOut
        animation: fadeOut 0.5s ease forwards;

    .dialog-box
        width: 700px;
        min-height: 140px;
        height: auto;
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 200000;
        background-color: #32323c;
        color: #cccccc;
        border-radius: 12px;
        font-size: 18px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        animate__dialogFadeInDownBig()
        &.dialog-closebox
            animate__dialogFadeOutDownBig()
        .dialog-header
            line-height: 70px;
            height: 70px;
            background-color: #2b2b32;
            border-radius: 12px 12px 0px 0px;

            .title
                color: #cccccc;
                text-align: center;
                font-size: 20px;

            .icon-box
                position: absolute;
                right: 18px;
                top: 20px;
                width: 30px;
                height: 30px;
                display: flex;
                justify-content: center;
                align-content: center;
                cursor pointer
                transition: all .5s
                &:hover
                    transform rotate(100deg)
                .svg-icon
                    width: 28px;
                    height: 28px;
                    margin: auto;
                    color: #a9b5cc;
                    border 2px solid #a9b5cc
                    border-radius 50%
                    padding 3px

        .dialog-body
            width: 100%;
            margin: 0 auto 100px;
            flex: 1;
            padding: 20px 30px;
            line-height: 26px;
            min-height: 40px;
            max-height 60vh
            font-size: 18px;
            color: #cccccc;
            overflow auto

            .text
                justify-content: center;
                align-items: flex-start;
                display: flex
                min-height: 40px;
                max-height 60vh

            .diatxt-left
                display: block

        .dialog-mb20
            margin-bottom 20px !important

        .backTitle
            font-size: 16px;
            color: #1ccbfe;

        .dcon-left
            justify-content: flex-start;

        .dialog-footer
            height: 60px
            width 100%
            display: flex
            justify-content: center
            align-content: center
            position absolute
            bottom 20px
            left 0px;

            button
                margin 0px 10px
                border: none;
                bg_img_linear(linear16, linear17)
                font_color(fc076)
                padding: 0px 20px;
                height: 60px;
                line-height: 60px;
                text-align: center;
                border-radius: 10px;
                min-width 240px;
                width auto;
                font-size: 18px;
                cursor: pointer;

            button.diog-but-console
                background-image none
                bg_color(bg65)
                font_color(fc093)
</style>
