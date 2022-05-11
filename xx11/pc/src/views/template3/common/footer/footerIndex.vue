<template lang="pug">
    footer.v-foot
        .vf-blog.w1200
            img(:src="flog")
        ul.w1200.flex-box.vf-ilis
            li(v-for="(value, index) in finfo" :key="index" @click="openUrl(value)")
                p.vfb-i
                    svg-icon(:icon-class="`${value.icon}`")
                p.vfb-t {{value.tit}}
                p.vfb-f {{value.com}}
        ul.flex-box.vf-menu
            li(v-for="(value, index) in fmenu" :key="index" @click="openUrl(value)") {{value.name}}
            li  © 2008-2023 . All rights Reserved
</template>
<script>
export default {
    name: "Footer", // 底部
    computed: {
        agentable: { // 是否申请了代理 布尔类型：true表示是，false表示不是
            get() {
                return this.$store.state.agentable;
            },
            set(item) {
                return item
            }
        },

        kefuUrl: { // 客服URL
            get() {
                return this.$store.state.homeStore.kefuUrl;
            },
            set(item) {
                return item
            }
        },
        isGetKefu: { // 客服是否已请求
            get() {
                return this.$store.state.homeStore.isGetKefu;
            },
            set(item) {
                return item
            }
        },
        userId: { // 用户ID
            get() {
                return this.$store.state.userId;
            },
            set(item) {
                return item
            }
        },
    },
    data() {
        return {
            flog: require('@img/template3/home/cooperative.png'),
            finfo: [{
                id: 'ff1',
                icon: 'f_money',
                tit: '真钱开户',
                com: '开设账户申请即可获得首存礼金，并尊享网站的其他优惠及抽奖'
            }, {
                id: 'ff2',
                icon: 'f_cooper',
                tit: '合作加盟',
                com: '高返利，高收益的合作模式让您轻松赚取巨额佣金，与我们共同成长'
            }, {
                id: 'ff3',
                icon: 'f_discount',
                tit: '优惠活动',
                com: '优惠活动多样化,美女/大保健/机票/酒店/高额彩金等多重优惠，等您来拿！'
            }, {
                id: 'ff4',
                icon: 'f_customer',
                tit: '联系我们',
                com: '客服提供7*24全天候周到服务免费回拨服务无需支付长途及市话费用，欢迎使用'
            }],
            fmenu: [{
                id: 'fm1',
                name: '用户协议'
            }, {
                id: 'fm2',
                name: '博彩责任'
            }, {
                id: 'fm3',
                name: '免责条款'
            }, {
                id: 'fm4',
                name: '用户隐私'
            }, {
                id: 'fm5',
                name: '帮助中心'
            }, {
                id: 'fm6',
                name: '在线客服'
            }]
        };
    },
    watch: {},
    created() {

    },
    mounted() {

    },
    methods: {
        openUrl(v) {
            let id = v.id
            if (id == 'ff1') {
                if (this.userId == '') {
                    this.$store.commit('set_showLogin', true)
                    this.$store.commit("loginRegStore/set_curTemp", 'reg')
                    return
                }
                return;
            }
            if (id == 'ff2') {
                if (!this.userId) {
                    this.toLogin()
                    return
                }
                this.$store.dispatch('returnTop')
                if (this.agentable) {
                    this.$store.commit('set_curMenu', '/center/hadAgent')
                    this.$router.push({
                        path: '/center/hadAgent'
                    })
                } else {
                    this.$store.commit('set_curMenu', '/center/applyAgent')
                    this.$router.push({
                        path: '/center/applyAgent'
                    })
                }

                return
            }
            if (id == 'ff3') {
                this.$store.dispatch('returnTop')
                this.$store.commit('set_curMenu', '/discount')
                this.$router.push({
                    path: '/discount'
                })
                return
            }
            if (id == 'fm6' || id == 'ff4') {
                this.openKefu()
                // if (this.kefuUrl) {
                //     window.open(this.kefuUrl, "_blank");
                // } else {
                //     window.win.tips.success('客服连接未生成，请稍后');
                // }
            } else {
                let temp = ''
                if (id == 'fm1') {
                    temp = 'userAgreement'
                }
                if (id == 'fm2') {
                    temp = 'respons'
                }
                if (id == 'fm3') {
                    temp = 'exceptions'
                }
                if (id == 'fm4') {
                    temp = 'privacy'
                }
                if (id == 'fm5') {
                    temp = 'help'
                }
                this.$myDialog({title: v.name, curTemp: temp}, (res) => {
                });
            }
        },
        toLogin() {
            this.$store.commit('set_showLogin', true)
            this.$store.commit("loginRegStore/set_curTemp", 'login')
        },
        openKefu(){
            if(this.kefuUrl) {
                let str = this.kefuUrl.substr(this.kefuUrl.lastIndexOf("imClient?"))
                    console.log(str, window.location.host)
                let url  = this.kefuUrl
                if(this.kefuUrl.indexOf('imClient')> -1) {
                    url  = `${window.location.protocol}//${window.location.host}/vhtml/#/${str}`
                }
                window.open(url, "_blank");
            }else{
                window.win.tips.success('客服连接未生成，请稍后')
            }
        }
    }
}
</script>
<style lang="stylus" scoped>
@import '~@/assets/styles/template3/themes/mixin.styl'
@import '~@styl/template3/common/fun.styl'
.v-foot
    width 100%
    padding-top 20px
    bg_color(bg2)

    .vf-blog
        border_com(1px, solid, border_common, bottom)
        padding 20px 0px

    .vf-ilis
        border_com(1px, solid, border_common, bottom)

        li
            width 279px
            height 270px
            position relative
            display flex
            flex-wrap wrap
            align-items center
            align-content center
            cursor pointer

            p
                width 100%
                text-align center

            .vfb-i
                width: 98px
                height: 98px
                display flex
                align-items center
                justify-content center
                border-radius 50%
                margin 0px auto 10px
                transition all .3s ease-in-out
                box-shadow 0 0 1px 1px #eaeaea
                &:hover
                    box-shadow 0 0 4px 4px #eaeaea
                    svg
                        font_color(fc4)
                svg
                    transition all .3s ease-in-out
                    width 44px
                    height 44px
                    font_color(fc3)

            &:nth-child(3)
                svg
                    width 38px
                    height 38px

            .vfb-t
                height 30px
                font-size: 18px
                font_color(fc2)
                transition all .3s ease-in-out
                &:hover
                    font_color(fc4)
            .vfb-f
                height 98px
                padding 0px 30px
                font_color(fc3)
                transition all .3s ease-in-out
                &:hover
                    font_color(fc4)
            &:after
                content: ""
                right -10px
                top: 60px;
                border_com(1px, solid, border_common, right)
                height: 160px;
                position absolute

            &:last-child
                &:after
                    display none

    .vf-menu
        width 1200px
        height 60px
        margin 0px auto
        flexcon()

        li
            font-size: 14px
            font_color(fc3)
            position relative
            flex 1
            text-align center
            line-height 30px
            cursor pointer
            transition all .3s ease-in-out
            &:hover
                font_color(fc4)
            &:last-child
                flex 6
                flexcon()
                justify-content flex-end

    .f-rem
        text-align center
        line-height 50px
</style>
