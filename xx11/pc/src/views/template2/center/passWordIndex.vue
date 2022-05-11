<template lang="pug">
    .depositIndex
        assets
        .com-tab
            ul
                li(@click="tabClick(1)" :class="curttTab == 1?'active':''")  登录密码
                li(@click="tabClick(2)" :class="curttTab == 2?'active':''")  提款密码
        .draw-con(v-if="curttTab == 2")
            .info
                .tip *为了您的账号安全，请设置提款密码！
                .info-con
                    .form
                        .form-item
                            .lable 原密码:
                            input(maxlength=20,placeholder='请输入原密码' )
                            .kefu 忘记密码？联系客服
                        .form-item
                            .lable 新密码:
                            input(maxlength=20,placeholder='请输入新密码' )
                        .form-item
                            .lable 确认密码:
                            input(maxlength=20,placeholder='请再次输入提款密码' )

                    .submit-btn 保存
        .login-con(v-if="curttTab == 1")
            .info
                .tip *为了您的账号安全，请设置登录密码！
                .info-con
                    .form
                        .form-item
                            .lable 原密码:
                            input(maxlength=20,placeholder='请输入原密码' )
                            .kefu 忘记密码？联系客服
                        .form-item
                            .lable 新密码:
                            input(maxlength=20,placeholder='请输入新密码' )
                        .form-item
                            .lable 确认密码:
                            input(maxlength=20,placeholder='请再次输入登录密码' )

                    .submit-btn 保存


</template>

<script>
import assetslist from "./assetsList";

export default {
    name: "depositIndex",
    components: {
        "assets": assetslist,
    },
    data() {
        return {
            isReqFlag: true, // 请求是否结束
            curttTab: 1,
            currtTemplateIndex: ''
        };
    },
    methods: {
        tabClick(tab) {
            if (tab == 1) {
                this.curttTab = tab;
            } else if (tab == 2) {
                this.curttTab = tab;
            } else if (tab == 3) {
                this.curttTab = tab;
            }
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template2/themes/mixin.styl'
@import "~@styl/template2/common/fun.styl"

.depositIndex
    .money-list
        height: 125px;
        bg_color(bg10)
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


    .info
        padding 20px

        .tip
            font-size: 14px;
            font_color(fc091);
            margin-botton 20px

        .info-con
            width 520px
            margin 0 auto
            padding 20px 10px 10px 10px

            .form
                .form-item
                    width: 500px;
                    height: 68px;
                    line-height 68px
                    border-radius: 5px;
                    border_all(1px, solid, border02);
                    margin-bottom 20px
                    display flex
                    flex-direction row
                    flex-wrap nowrap
                    position relative

                    .lable
                        flex none
                        width 90px
                        text-align right
                        font-size: 16px;
                        letter-spacing: 2px;
                        font_color(fc091);

                    .kefu
                        cursor pointer
                        font-size: 12px;
                        font_color(fc034)
                        width: 200px;

            .submit-btn
                width: 290px;
                line-height 60px
                text-align center
                font-size: 18px;
                font_color(fc08);
                bg_img_linear(linear04, linear03)
                background-blend-mode: normal, normal;
                border-radius: 10px;
                margin 0 auto

    .draw-con
        bg_color(bg04)
        min-height 600px
        border-radius 0 0 10px 10px

    .login-con
        bg_color(bg04)
        min-height 600px
        border-radius 0 0 10px 10px

</style>
