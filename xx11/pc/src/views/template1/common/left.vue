<template lang="pug">
    .left-con
        ul.list-con
            // 福利中心
            li.welfare-center(v-if="leftCenterNum > 0")
                p.item-icon
                    svg-icon(icon-class="f_discount")
                p.item-title 福利中心
                .number(v-if="welfareNumber") {{welfareNumber > 99 ? '99+' : welfareNumber}}
                .flow-con(v-if="leftCenterNum > 0",:class="'num'+leftCenterNum")
                    .flow
                        .item(v-if="goldenEggConfig",@click="openActivityDialog('goldenEgg')")
                            .img.img01
                            .text
                                span 你有
                                span {{goldenEggNum}}次
                                span 砸蛋机会

                        .item(v-if="turntableConfig",@click="openActivityDialog('turntable')")
                            .img.img02
                            .text
                                span 你有
                                span {{turntableNum}}次
                                span 抽奖机会

                        .item(v-if="fruitMachineConfig",@click="openActivityDialog('fruitMachine')")
                            .img.img03
                            .text
                                span 你有
                                span {{fruitMachineNum}}次
                                span 抽奖机会


            // 领取中心
            li.position-li(@click="getMoney()")
                p.item-icon
                    svg-icon(:icon-class="`get_money`")
                p.item-title 领取中心
                .number(v-if="drawNumber") {{drawNumber > 99 ? '99+' : drawNumber}}

            // 在线客服
            li(@click="openServiceDialog")
                p.item-icon
                    svg-icon(:icon-class="`l_kefu`")
                p.item-title 在线客服

            // 专属专员
            li.wechat-con(v-if="wechat && wechat.wxQrcodeImg")
                p.item-icon
                    svg-icon(:icon-class="`wechat`")
                p.item-title 专属专员
                .flow-con
                    .flow
                        .title Element专员
                        img(:src="$ossImg(wechat.wxQrcodeImg)")
                        .down-text 扫码添加Element专员
                        .down-text 解锁更多优惠

            // APP下载 (v-if="showAppDownLoad")
            li.qrcode-con
                p.item-icon
                    svg-icon(:icon-class="`l_tel`")
                p.item-title APP下载
                .flow-con
                    .flow
                        qrcode(v-if="app.pcDownloadUrl", :codeurl="app.pcDownloadUrl",:clasz="'leftqr'")
                        .down-text(v-if="app.pcDownloadUrl") 扫码下载APP

            // 返回顶部
            li(@click="returnTop()")
                p.item-icon
                    svg-icon(:icon-class="`l_top`")
                p.item-title 返回顶部

        vipDialog(:showDialog="showDialog",:closeDialog="closeDialog",v-if="showDialog")

        // AI客服弹框
        comDialog(:show-footer='false',clasz="service-dialog",:show="serviceDialogFlag",@on-cancel="closeServiceDialog",:show-close="true")
            .dialog-con(slot="default")
                .ifram-con
                    iframe(:src="serviceIframeUrl",height="600px",frameborder="0" width='600px' ,@load="serviceIframOnload")

</template>
<script>
import {mapActions, mapState} from "vuex"; // 首页头部信息状态
import qrcode from "@pon/template1/comQrcode"
import drawCenter from "@/views/template1/center/drawCenter";
import comDialog from '@pon/template1/comDialog'
import {getPlatForm} from '@/module/utils'
export default {
    name: "Left", // 左边样式
    components: {
        qrcode,
        drawCenter,
        comDialog
    },
    computed: {
        ...mapState({
            app: state => state['homeStore'].app,
            isShowTop: state => state.isShowTop,
            kefuUrl: state => state['homeStore'].kefuUrl,
            isGetKefu: state => state['homeStore'].isGetKefu,
            wechat: state => state.headerStore.wechat, // 微信专员对象
            showAppDownLoad: state => state.showAppDownLoad,// 是否显示app下载
            userId: state => state.userId, // 会员id
            drawNumber: state => state['headerStore'].drawNumber,
            turntableConfig: state => state['activityStore'].turntableConfig,//大转盘配置
            turntableDetail: state => state['activityStore'].turntableDetail,//大转盘详情
            turntableNum: state => state['activityStore'].turntableNum,//大转盘剩余抽奖次数

            fruitMachineConfig: state => state['activityStore'].fruitMachineConfig,//水果机配置
            fruitMachineDetail: state => state['activityStore'].fruitMachineDetail,//水果机详情
            fruitMachineNum: state => state['activityStore'].fruitMachineNum,//水果机剩余抽奖次数

            goldenEggConfig: state => state['activityStore'].goldenEggConfig,//砸金蛋配置
            goldenEggDetail: state => state['activityStore'].goldenEggDetail,//砸金蛋详情
            goldenEggNum: state => state['activityStore'].goldenEggNum,//砸金蛋剩余抽奖次数

            leftCenterNum: state => state['activityStore'].leftCenterNum,//福利中心活动数量
            userInfo: state => state['centerStore'].userInfo,

        }),

        welfareNumber(){
            return this.turntableNum + this.fruitMachineNum + this.goldenEggNum;
        },
    },
    data() {
        return {
            showDialog: false,
            serviceDialogFlag:false,
            serviceIframeUrl:'',
        }
    },

    created() {

    },
    mounted() {
        this.getActivityConfigAction()
        // 打开客服
        this.$root.eventHub.$off("openServiceDialg").$on("openServiceDialg", (res) => {
            this.openServiceDialog();
        })
    },
    methods: {
        ...mapActions({
            // 开启活动
            openActivityAction(dispatch, param) {
                return dispatch(`activityStore/openActivityAction`, param);
            },
            // 活动配置-- 大转盘/水果机/砸金蛋
            getActivityConfigAction(dispatch, param) {
                return dispatch(`activityStore/getActivityConfigAction`, param);
            },

        }),
        // 打开客服链接
        // openUrl() {
        //     if (this.kefuUrl) {
        //         window.open(this.kefuUrl, "_blank");
        //     } else {
        //         window.win.tips.success('客服连接未生成，请稍后');
        //     }
        // },
        // 打开客服链接
        openUrl(){
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
        },
        returnTop() {
            this.$store.dispatch('returnTop')
        },
        getServeLink() { // 获取用户连接

        },

        getMoney() {
            if (this.userId == '') {
                this.$store.commit('set_showLogin', true)
                this.$store.commit("loginRegStore/set_curTemp", 'login')
            } else {
                this.$store.commit('headerStore/SET_DRAW_CENTER', true)
                this.$store.dispatch('headerStore/getDrawCenterList');
            }
        },
        //  显示登录
        showLogin() {
            this.$store.commit('set_showLogin', true)
            this.$store.commit("loginRegStore/set_curTemp", 'login')
        },
        // 打开活动窗口
        openActivityDialog(type){
            // 如果登录
            if(this.userId){
                this.openActivityAction(type)
            }else{
                this.showLogin();
            }
        },
        // AI客服加载完毕
        serviceIframOnload() {
            window.win.myloading.hidden()
        },
        // 打开客服弹框 终端展示变更为：1、h5 2 pc 3 android 4 ios
        openServiceDialog() {
            if (this.kefuUrl) {
                let str = this.kefuUrl.substr(this.kefuUrl.lastIndexOf("imClient?"))
                let url = this.kefuUrl + `&channelType=1&platform=2&origin=${window.location.origin}`
                if (this.kefuUrl.indexOf('imClient') > -1) {
                    url = `${window.location.protocol}//${window.location.host}/vhtml/#/${str}&channelType=2`
                }
                this.serviceIframeUrl = url;
                this.serviceDialogFlag = true;
                window.win.myloading.show()
            } else {
                window.win.tips.success('客服连接未生成，请稍后')
            }
        },
        // 关闭客服弹框
        closeServiceDialog(){
            this.serviceDialogFlag = false;
        },
    }
};
</script>
<style lang="stylus" scoped>
@import '~@styl/template1/themes/mixin.styl'
@import '~@styl/template1/common/fun.styl'
.left-con
    width 80px
    position fixed
    bottom 50px
    right 10px
    z-index 5

    .list-con
        width 80px
        position relative

        li
            width 80px
            height 80px
            bg_color(bg32)
            display flex
            align-items center
            justify-content space-between
            flex-wrap wrap
            text-align center
            cursor pointer
            border_com(1px, solid, border29, bottom)
            transition all 1s ease-in
            position relative

            &:first-child
                border-radius 10px 10px 0px 0px

            &:last-child
                border-bottom none
                border-radius 0px 0px 10px 10px

            &:hover
                background linear-gradient(0deg, #bb9759 0%, #dac08f 100%), linear-gradient(90deg, #553700 0%, #664200 100%)
                border_com(1px, solid, border30, bottom)

                p
                    font_color(fc01)

            p
                font_color(fc016)
                width 80px
                font-size: 14px
                transition all 1s

                .item-title
                    width 80px
                    pakdding-bottom 10px

                svg
                    width 22px
                    height 22px

                &.item-icon
                    padding-top 10px

            .number
                position absolute
                right 0
                top 0
                width 22px
                height 22px
                border-radius 50%
                background-color red
                font-size 12px
                color white
                line-height 22px
                text-align center


            &.qrcode-con
                &:hover
                    .flow-con
                        bottom -200px
                        animation: fadeIn 1s ease forwards
                .flow-con
                    transition all .3s
                    width 204px
                    height 360px
                    position absolute
                    left -200px
                    bottom -500px
                    flexcon()
                    justify-content flex-start
                    align-items flex-start
                    animation: fadeOut 1s ease forwards

                    .flow
                        transition all .3s linear
                        width 180px
                        height 220px
                        border-radius 10px
                        background-image linear-gradient(0deg, #bb9759 0%, #dac08f 100%), linear-gradient(90deg, #553700 0%, #664200 100%)

            &.wechat-con
                &:hover
                    .flow
                        display block

                .flow
                    display none
                    transition all .5s
                    width 180px
                    height 240px
                    position absolute
                    left -200px
                    border-radius 10px
                    bottom 0
                    font-size 12px
                    background-image linear-gradient(0deg, #bb9759 0%, #dac08f 100%), linear-gradient(90deg, #553700 0%, #664200 100%)

                    .title
                        height 30px
                        line-height 30px

                    img
                        width 160px
                        height 160px
                        margin-bottom 6px


            &.welfare-center
                &:hover
                    .flow-con
                        bottom -100px
                        left -620px
                        opacity 1
                        visibility visible
                        &.num1
                            left -220px
                        &.num2
                            left -420px
                        &.num3
                            left -620px

                .flow-con
                    visibility hidden
                    opacity 0
                    width 720px
                    height 240px
                    position absolute
                    left 300px
                    bottom -100px
                    transition all .5s
                    flexcon()
                    justify-content flex-start
                    .flow
                        flex none
                        transition all .5s
                        //width 600px
                        height 240px
                        border-radius 10px
                        font-size 12px
                        background-image linear-gradient(0deg, #bb9759 0%, #dac08f 100%), linear-gradient(90deg, #553700 0%, #664200 100%)
                        flexcon()
                        justify-content flex-start
                        .item
                            flex none
                            width 200px
                            height 240px

                            .img
                                width 200px
                                height 200px

                                &.img01
                                    background: url('~@img/comimages/activity/center/activity-egg.png') center / 80% no-repeat;
                                &.img02
                                    background: url('~@img/comimages/activity/center/activity-turn.png') center / 80% no-repeat;
                                &.img03
                                    background: url('~@img/comimages/activity/center/activity-fruit.png') center / 80% no-repeat;
                            .text
                                color #fafafa
                                font-size 14px
                                span:nth-child(2)
                                    color #ff1616
                                    padding 0 4px
.service-dialog
    /deep/.dialog-content
        .ifram-con
            font-family: initial;
        .dialog-main
            padding 0 !important
        .dialog-header
            height auto !important
</style>
