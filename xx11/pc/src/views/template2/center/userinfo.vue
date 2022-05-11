<template lang="pug">
    .userinfo
        .com-tab
            ul
                li(@click="tabClick(1)" :class="curttTab == 1?'active':''")  基本资料
                li(@click="tabClick(2)" :class="curttTab == 2?'active':''")  手机认证
                li(@click="tabClick(3)" :class="curttTab == 3?'active':''")  银行卡管理
                li(@click="tabClick(4)" :class="curttTab == 4?'active':''")  虚拟币帐户
                li(@click="tabClick(5)" :class="curttTab == 5?'active':''")  收货地址
        .info-con
            component(:is="currtTemplateIndex")

</template>

<script>
import addressManager from './user/addressManager' ;
import usdtAcount from './user/usdtAcount';
import bankCard from './user/bankCard' ;
import baseInfo from './user/baseInfo' ;
import telephone from './user/telephone' ;

export default {
    name: "userinfo",
    comments: [addressManager, usdtAcount, bankCard, baseInfo, telephone],
    data() {
        return {
            isReqFlag: true, // 请求是否结束
            curttTab: 1,
            currtTemplateIndex: baseInfo
        };
    },
    watch: {
        $route(to, from) {
            if (this.$route.query.tab) {
                this.tabClick(this.$route.query.tab);
            }
        }
    },
    mounted() {

        if (this.$route.query.tab) {
            this.tabClick(this.$route.query.tab);
        }
        // 设置tab
        this.$root.eventHub.$off("userTab").$on("userTab", (res) => {
            this.tabClick(res);
        })
    },
    methods: {
        tabClick(tab) {
            if (tab == 1) {
                this.curttTab = tab;
                this.currtTemplateIndex = baseInfo;
            } else if (tab == 2) {
                this.curttTab = tab;
                this.currtTemplateIndex = telephone;
            } else if (tab == 3) {
                this.curttTab = tab;
                this.currtTemplateIndex = bankCard;
            } else if (tab == 4) {
                this.curttTab = tab;
                this.currtTemplateIndex = usdtAcount;
            } else if (tab == 5) {
                this.curttTab = tab;
                this.currtTemplateIndex = addressManager;
            }
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template2/themes/mixin.styl'
@import "~@styl/template2/common/fun.styl"

.userinfo
    .com-tab
        width 100%
        height: 70px;
        line-height 70px
        font-size: 20px;
        letter-spacing: 0px;
        font_color(fc087);
        bg_color(bg55);
        border-radius: 10px 10px 0px 0px;
        border_com(1px, solid, border48, bottom)
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
                    font_color(fc092)

                &.active
                    font_color(fc092)

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

