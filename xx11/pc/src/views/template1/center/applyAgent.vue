<template lang="pug">
    .applyAgent
        assets

        // 合营代理
        .join-main(v-show="teamAgentEnabled==true")
            .join-banner
                img(:src="joinPic1")
            ul.join-list
                li(v-for="(v,i) in jlist" :key='i')
                    p.joinl-ticon
                        img(:src="require(`@img/template1/join/${v.icon}.png`)")
                    p.joinl-text {{v.text}}
            p.join-button(@click="applyCoompSubmit()")
                img(:src="require(`@img/template1/join/button.png`)")
            .join-foot-banner
                img(:src="joinPic2")
            p.join-btext PC端，H5还有独家开发的移动端，全面支持IOS和安卓系统下的所有移动设备
            p.join-tit
                span.join-lin
                span.join-text 业内最强APP
                span.join-lin
            ul.join-sefty-list
                li(v-for="(v,i) in jslist" :key='i')
                    p.join-sl-i
                        img(:src="require(`@img/template1/join/${v.icon}.png`)")
                    p.join-sl-t {{v.text}}
                    p.join-sl-c {{v.content}}
            p.join-tit
                span.join-lin
                span.join-text 权威机构认证
                span.join-lin
            p.join-fapprove
                img(:src="require(`@img/template1/join/approve.png`)")


        // 洗码代理
        .apply-main(v-show="platformInfo && platformInfo.rebateAgentEnabled")
            .com-tab
                ul
                    li  加盟代理
            .apply-con
                //img(:src="banner && banner[0].picUrl").img
                van-swipe.t1-banner(:autoplay="3000" :show-indicators="false")
                    van-swipe-item(v-for="(item, index) in banner" :key="index")
                        p.b-wh(@click="enterBannerFun(item,index)" :style="`background-image: url(${$ossImg(item.picUrl)})`")
                .user-list
                    .item
                        .icon.all
                        .number {{statistics.totalNum}}
                        .title 累计服务代理
                    .item
                        .icon.week
                        .number {{statistics.weekAvgAmount}}
                        .title 平均每周出款(元)
                    .item
                        .icon.yesterday
                        .number {{statistics.yesterdayJoinNum}}
                        .title 昨日新增代理

                .user-money
                    .title 佣金无上限 邀好友一起拿
                    .money-con
                        .user
                            span 推广人佣金
                            span 直属会员佣金

                .moneyjs-con
                    .content
                        .title 佣金计算
                        ul
                            li(v-if="statistics.typeName && statistics.promoteAmount && statistics.promoteAmountCount") 推广佣金=每邀请一个用户{{ statistics.typeName }}成功奖励彩金{{ statistics.promoteAmount }}元,每日奖励上限{{ statistics.promoteAmountCount }}次
                            li 代理佣金=下线会员洗码优惠金额总和 * {{statistics.rate}}
                            li 例如:A会员发展B会员、C会员与D会员。那么A会员当天的代理佣金=（B会员当天洗码优惠金额+C会员当天洗码优惠金额+D会员当天洗码优惠金额）* {{statistics.rate}}

                .rules
                    .title 代理规则
                    ul
                        li 1. 必须是有效会员
                        li 2.有效会员必须为30天内有成功入款记录，非有效会员洗码优惠金额不列入佣金计算范围。

            .submit-btn-con
                .submit-btn(@click="openDialog") 申请加入

            comDialog(:show-footer='false',:show="showDialog",@on-cancel="closeDialog")
                div(slot="header") 合作代理
                div.dialog-con(slot="default")
                    .apply-con
                        .title 确定加入我们吗?
                        .btn-con
                            .common-btn.ng(@click="closeDialog") 再考虑考虑
                            .common-btn.ok(@click="applySubmit") 确定加入
                div(slot="footer")

        // 无限代理
        .unit-main(v-show="platformInfo && platformInfo.unlimitAgentEnabled")
            p.join-button(@click="applySubmit")
                img(:src="require(`@img/comimages/center/wuxianbg.png`)")


</template>

<script>
import comPagination from "@pon/template1/comPagination"
import assetslist from "./assetsList";
import comDatepicker from "@pon/template1/comDatepicker"
import {mapGetters, mapState, mapMutations, mapActions} from 'vuex';
import thatStore from "@/store/comstore/center/business/agentStore"; // 获取模板
import store from '@/store/Store';
import qrcode from "@pon/template1/comQrcode"
import {Swipe, SwipeItem} from 'vant';
import comDialog from '@pon/template1/comDialog'

export default {
    name: "applyAgent",
    components: {
        comPagination,
        comDatepicker,
        "assets": assetslist,
        qrcode,
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        comDialog
    },
    data() {
        return {
            isReqFlag: true, // 请求是否结束
            showDialog: false,
            isJoinGrop: false,
            joinPic1: require('@img/template1/join/pic1.png'),
            joinPic2: require('@img/template1/join/pic2.png'),
            jlist: [{
                icon: 'icon01',
                text: '最精确的数据'
            }, {
                icon: 'icon02',
                text: '最优质的产品'
            }, {
                icon: 'icon03',
                text: '超高返佣比'
            }],
            jslist: [{
                icon: 'bigicon01',
                text: '更丰富',
                content: '丰富的游戏产品你想要的我们都有'
            }, {
                icon: 'bigicon02',
                text: '更私密',
                content: '三重数据加密保护您的资料安全'
            }, {
                icon: 'bigicon03',
                text: '更安全',
                content: '独家网络技术超强防劫持'
            }, {
                icon: 'bigicon04',
                text: '更稳定',
                content: '强大的技术团队提供最稳定的产品'
            }]
        }
    },
    computed: {
        ...mapState({
            banner: state => state['agentStore'].banner,
            statistics: state => state['agentStore'].statistics,
            platformId: state => state.platformId,
            userInfo: state => state['centerStore'].userInfo, // // userInfo.type    1: 普通玩家: 2: 洗码代理 3: 合营代理 4: 无限代理
            agentable: state => state.agentable, // 是否是高级代理人
            teamAgentEnabled: state => state.teamAgentEnabled, // 合营代理是否开启
            platformInfo: state => state.platformInfo,// 平台信息  rebateAgentEnabled: false,// 洗码代理 teamAgentEnabled: false,// 合营代理  unlimitAgentEnabled:false,//无线代理
        }),
    },
    created() {
        // 动态store
        if (!store.state["agentStore"]) {
            thatStore.install(this);
        }
        // 判断高级代理人状态
        if (this.userInfo.type == 2) {
            this.$store.commit('set_curMenu', '/center/hadAgent')
            this.$router.push({
                path: '/center/hadAgent'
            })
        } else if (this.userInfo.type == 3) {
            this.$router.push({
                path: '/center/hadAgent'
            })
            let url = window.location.protocol + "//" + window.location.host + '/proxypc/#/homePage'
            // window.location.href = url;
            window.open(url, "_blank");
        } else {
            this.getAgentBannerFun({type: 4})
            this.getgentStatisticsActionFun()
        }
    },
    methods: {
        ...mapActions({
            getAgentBannerFun(dispatch, param) {
                return dispatch(`agentStore/getAgentBannerAction`, param);
            },
            agentApplyFun(dispatch, param) {
                return dispatch(`agentStore/agentApplyAction`, param);
            },
            getgentStatisticsActionFun(dispatch, param) {
                return dispatch(`agentStore/getgentStatisticsAction`, param);
            },
            cooperateAgentApplyFun(dispatch, param) {
                return dispatch(`agentStore/cooperateAgentApplyAction`, param);
            },
        }),
        applySubmit() {
            let that = this;
            // 判断是否是请求中
            if (this.isReqFlag) {
                this.isReqFlag = false;
            } else {
                return;
            }
            this.agentApplyFun().then(function (res) {
                that.isReqFlag = true;
                that.closeDialog()
                if (res && res.success) {
                    that.$store.dispatch('centerStore/getUserInfoAction').then(() => {
                        that.goPage("/center/hadAgent")
                        that.$store.dispatch('getHomePerInfo');
                    });
                }
            })
        },
        applyCoompSubmit() { // 申请合营代理
            let that = this;
            // 判断是否是请求中
            if (this.isReqFlag) {
                this.isReqFlag = false;
            } else {
                return;
            }
            this.agentApplyFun().then((res) => {
                that.isReqFlag = true;
                that.closeDialog()
                if (res && res.success) {
                    that.$store.dispatch('centerStore/getUserInfoAction').then(() => {
                        if (res.data.mobileChecked == false) {
                            this.$store.commit('set_curMenu', '')
                            this.$router.push({path: '/center/userinfo', query: {tab: 2}})
                            return
                        } else {
                            let url = window.location.protocol + "//" + window.location.host + '/proxypc/#/homePage'
                            // window.location.href = url;
                            window.open(url, "_blank");
                        }
                    });

                }
            })
        },
        goPage(path, param) {
            this.$router.push({path: path, query: param})
        },
        enterBannerFun(value, index) {
            this.$store.dispatch("gameStore/enterBannerAction", value).then(res => {
            });
        },
        closeDialog() {
            this.showDialog = false;
        },
        openDialog() {
            // this.showDialog = true;
            this.$myDialog({
                title: "合作代理",
                con: '确定加入我们吗?',
                btnTextLeft: "再考虑考虑",
                btnTextRight: "确定加入",
                leftBut: true,
                actionLeft: false
            }, (res) => {
                this.applySubmit()
            });
        },

    }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template1/themes/mixin.styl'
@import "~@styl/template1/common/fun.styl"

.applyAgent
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
                width 136px
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

    .apply-con
        bg_color(bg04)
        padding 20px 20px 20px

        .img
            width 900px
            height 240px
            border-radius 10px
            margin 20px auto

        .t1-banner
            width 900px
            height 240px
            margin 0px auto
            border-radius 10px
            z-index 1
            position relative

        .b-wh
            height 100%
            background-position center center
            background-repeat no-repeat
            cursor pointer
            background-size cover

        .user-list
            display flex
            flex-direction row
            justify-content space-around
            align-items center
            flex-wrap nowrap
            border_com(1px, solid, border09, bottom)
            padding-bottom 20px
            padding-top 20px

            .item
                flex 1
                display flex
                flex-direction column
                justify-content center
                align-items center

                .icon
                    width: 80px;
                    height: 80px;
                    margin 10px
                    border-radius 50%

                    &.all
                        background url("~@img/template1/center/daili.png") center no-repeat

                    &.week
                        background url("~@img/template1/center/chukuan.png") center no-repeat

                    &.yesterday
                        background url("~@img/template1/center/xinzeng.png") center no-repeat

                .number
                    font-size: 20px;
                    line-height: 30px;
                    font_color(fc017)

                .title
                    font-size: 18px;
                    line-height: 40px;
                    font_color(fc016)


    .user-money
        bg_color(bg04)
        padding 40px 20px 20px

        .title
            font-size: 24px;
            line-height: 30px;
            font_color(fc017)
            text-align center
            position relative

            &:before
                content ''
                display block
                background url("~@img/template1/center/sby.png") center no-repeat
                width 42px
                height 23px
                position absolute
                left 230px
                top 50%
                transform translateY(-50%)

            &:after
                content ''
                display block
                background url("~@img/template1/center/sby.png") center no-repeat
                width 42px
                height 23px
                position absolute
                right 230px
                top 50%
                transform translateY(-50%)

        .money-con
            height 360px
            background url("~@img/template1/center/dengjitu.png") right 0px top 0px / contain no-repeat
            padding: 160px 0px;

            .user
                width: 252px;
                height: 92px;
                bg_color(bg13)
                border-radius: 10px;
                border_all(1px, solid, bg02)
                opacity: 0.5;
                display flex
                flex-direction column
                justify-content center
                align-items center

                span
                    margin-bottom 10px
                    display inline-block

                    &:nth-child(1)
                        width: 120px;
                        height: 24px;
                        font-size: 24px;
                        line-height: 30px;
                        letter-spacing: 0px;
                        font_color(fc017)

                    &:nth-child(2)
                        height: 19px;
                        font-size: 20px;
                        line-height: 30px;
                        letter-spacing: 0px;
                        font_color(fc016)

    .moneyjs-con
        bg_color(bg04)
        padding 0px 20px 20px

        .title
            font-size: 24px;
            line-height: 30px;
            font_color(fc017)
            text-align center
            position relative
            padding 20px

            &:before
                content ''
                display block
                background url("~@img/template1/center/sby.png") center no-repeat
                width 42px
                height 23px
                position absolute
                left 280px
                top 50%
                transform translateY(-50%)

            &:after
                content ''
                display block
                background url("~@img/template1/center/sby.png") center no-repeat
                width 42px
                height 23px
                position absolute
                right 280px
                top 50%
                transform translateY(-50%)


        .content
            bg_color(bg13)
            border-radius: 10px;
            //height 300px
            padding 20px

            ul
                li
                    font-size: 20px;
                    line-height: 36px;
                    font_color(fc016)
                    margin-bottom 10px

    .rules
        bg_color(bg04)
        padding 0px 20px 20px

        .title
            font-size: 24px;
            line-height: 30px;
            font_color(fc017)
            text-align center
            position relative
            padding 20px

            &:before
                content ''
                display block
                background url("~@img/template1/center/sby.png") center no-repeat
                width 42px
                height 23px
                position absolute
                left 300px
                top 50%
                transform translateY(-50%)

            &:after
                content ''
                display block
                background url("~@img/template1/center/sby.png") center no-repeat
                width 42px
                height 23px
                position absolute
                right 300px
                top 50%
                transform translateY(-50%)

        ul
            li
                font-size: 20px;
                line-height: 36px;
                font_color(fc016)

    .submit-btn-con
        bg_color(bg04)
        height 100px

        .submit-btn
            width: 280px;
            height: 60px;
            bg_color(bg14)
            //box-shadow: 0px 5px 15px 0px rgba(188, 153, 91, 0.35);
            border-radius: 30px;
            font-size: 20px;
            line-height 60px
            font_color(fc01);
            text-align center
            margin 0 auto

    .dixian
        border_all(1px, solid, border10)

    .dialog-con
        .apply-con

            .title
                text-align center
                font-size 16px

            .btn-con
                margin-top 60px
                display flex
                flex-direction row

            .common-btn
                width: 160px;
                line-height: 60px;
                font-size: 16px;

                &.ng
                    bg_color(bg04)
                    font_color(fc018)


.join-main
    width 100%
    font-size: 20px;
    letter-spacing: 0px;
    color #5c6e95
    bg_color(bg10);
    border-radius: 10px;
    border_com(1px, solid, bg11, bottom)
    position relative
    transition all .3s
    padding 20px
    margin-bottom 20px

    .join-banner
        margin 0px auto
        text-align center

    .join-list
        display flex
        justify-content space-between
        width 70%
        margin 40px auto

        p
            text-align center

        .joinl-text
            font-size 24px

        .joinl-ticon
            img
                width 60px
                height 60px

    .join-button
        text-align center
        margin 10px 0px 40px
        border_com(1px, solid, bg11, bottom)
        padding-bottom 20px

    .join-foot-banner
        text-align center

    .join-btext
        text-align center
        padding 10px 0px

    .join-tit
        display flex
        justify-content center
        align-items center
        margin 35px 0px

        .join-lin
            height 1px
            // bg_color(fc098)
            background #697294
            width 100px

        .join-text
            font-size 24px
            padding 0px 15px
            width 200px
            text-align center
            display inline-block

    .join-sefty-list
        display flex
        justify-content center
        align-items center
        margin 35px 0px

        li
            width 150px
            text-align center
            margin 0px 15px

            .join-sl-i
                text-align center

                img
                    width 100px
                    height 100px

            .join-sl-t
                font-size 26px
                text-align center
                margin 5px 0px

            .join-sl-c
                font-size 12px
                text-align center

    .join-fapprove
        text-align center
        margin 0px 15px
</style>

