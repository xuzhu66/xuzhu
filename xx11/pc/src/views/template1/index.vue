<template lang="pug">
    .app-con
        //头部
        Header(v-if="teamAgentEnabled !== ''")
        //路由 (:name="transitionName")
        .main-con
            transition
                keep-alive(:include="keepAliveList")
                    router-view
        // 底部
        Footer
        // 左侧导航
        Left
        // 登录弹框
        LoadingDialog(v-show="isShowLoad" :dialProp="loadContent")
        // 注册登录
        LoginReg(v-show="showLogin")
        // 游戏弹框
        GameDialog
        // 取款弹窗 -- 弃用
        //DrawDialog
        // 活动弹框
        activityDialog
        // 活动小窗口
        activityWindown
</template>

<script>
import Header from '@/views/template1/common/headerIndex'; // 头部
import Footer from '@/views/template1/common/footer/footerIndex'; // 底部
import LoadingDialog from "@/plugins/template1/loadingDialog/loadingDialog"; // 弹出框
import LoginReg from '@/views/template1/login/loginIndex'; // 登录
import Left from '@/views/template1/common/left'; // 左边客服
import DrawDialog from '@/views/template1/center/drawDialog'; // 取款弹窗
import GameDialog from '@/views/template1/game/gameDialog';
import gameStore from "@/store/comstore/game/gameStore"; // 登入游戏状态
import homeStore from "@/store/template1/homeStore";
import headerStore from "@/store/comstore/home/headerStore";
import loginRegStore from "@/store/comstore/user/loginRegStore";
import drawStore from "@/store/comstore/assets/drawStore";
import store from "@/store/Store";
import centerStore from "@/store/comstore/center/centerStore"; // 进入游戏弹窗
import activityStore from "@/store/comstore/activity/activityStore";
import '@styl/template1/index.styl';
import {mapActions, mapState} from "vuex"; // 总颜色配置
import activityDialog from '@/views/business/activity/activityDialog';
import activityWindown from '@/views/business/activity/activityWindown';

export default {
    name: 'index',
    components: {
        "Header": Header, // 头部
        "Footer": Footer, // 底部
        "LoadingDialog": LoadingDialog,
        "LoginReg": LoginReg, // 登录
        "Left": Left, // 左边客服
        "DrawDialog": DrawDialog, // 取款弹框
        "GameDialog": GameDialog, // 游戏入口弹框
        "activityDialog": activityDialog,// 活动弹框
        "activityWindown": activityWindown,// 活动入口
    },
    data() {
        return {
            transitionName: 'slide-right',
            keepAliveList: ['home', 'beauty', 'chess', 'electronic', 'fish', 'lottery', 'gamerace', 'sport', 'discount'],
            bannerComponetsList: [0, 1, 2, 3, 5, 6, 7, 8],// 0 首页 1 真人娱乐 2 棋牌游戏 3 电子游戏 4 捕鱼游戏 5 彩票投注 6 电子竞技 7 体育投注 8 优惠活动
        }
    },
    computed: {
        ...mapState({
            templateNumber: state => state.templateStore.template, // 模板编号
            teamAgentEnabled: state => state.teamAgentEnabled, // 是否配置合营代理
        }),

        loadContent: { // 加载弹窗内容
            get() {
                return this.$store.state.loadContent;
            },
            set(item) {
                return item
            }
        },
        isShowLoad: { // 加载弹窗是否显示
            get() {
                return this.$store.state.isShowLoad;
            },
            set(item) {
                return item
            }
        },
        showLogin: { // 登入是否显示
            get() {
                return this.$store.state.showLogin;
            },
            set(item) {
                return item
            }
        },
    },
    created() {
        // 首页头部信息状态
        if (!this.$store.state["homeStore"]) {
            homeStore.install(this);
        }
        // 初始化store 放在一个公共的文件里面去, 不然不知道store有没有初始化;
        if (!this.$store.state["gameStore"]) {
            gameStore.install(this);
        }
        if (!this.$store.state["headerStore"]) { // 头部store
            headerStore.install(this);
        }
        if (!this.$store.state["loginRegStore"]) { // 登录注册主状态
            loginRegStore.install(this);
        }
        if (!this.$store.state["drawStore"]) { // 取款
            drawStore.install(this);
        }
        if (!store.state["centerStore"]) {// 个人中心动态store
            centerStore.install(this);
        }
        if (!store.state["activityStore"]) {// 活动store
            activityStore.install(this);
        }

        this.getPlatformInfo()
    },
    watch: {
        teamAgentEnabled: {
            handler(newValue, oldValue) {
            }
        },
        immediate: true
    },
    mounted() {

    },
    methods: {
        ...mapActions({
            // 获取app下载对象
            getAppDownLoadFun(dispatch, param) {
                return dispatch(`homeStore/getAppDownLoadAction`, param);
            },
            getPlatInfoFun(dispatch, param) {
                return dispatch(`homeStore/getPlatInfo`, param);
            },
            getCustomerUrlFun(dispatch, param) {
                return dispatch(`homeStore/getCustomerUrl`, param);
            },
            getLogoImgFun(dispatch, param) {
                return dispatch(`homeStore/getLogoImg`, param);
            },
            getHeaderIntroduceFun(dispatch, param) {
                return dispatch(`homeStore/getHeaderIntroduce`, param);
            },
            // 获取页面icon
            getPageIconFun(dispatch, param) {
                return dispatch('homeStore/getPageIconAction', param);
            },
        }),

        async getPlatformInfo() {
            // 基础信息参数
            let infoParam = {
                channelId: this.$store.state.sourceid // 渠道id
            };
            // 获取基础信息
            let resInfo = await this.$store.dispatch("homeStore/getPlatInfo", infoParam);

            // LOGO图片参数
            let logoImgParam = {
                deviceType: 2, // 终端：1、H5  2、PC 3、android 4、ios
                templateNo: this.templateNumber, // 模板number
            };
            // LOGO图片参数
            let logoIntoParam = {
                deviceType: 2, // 终端：1、H5  2、PC 3、android 4、ios
                templateNo: this.templateNumber, // 模板number
            };
            // 头部LOGO图片
            this.getLogoImgFun(logoImgParam)
            // 头部logo右侧文字
            this.getHeaderIntroduceFun(logoIntoParam);
            // 获取app下载地址
            this.getAppDownLoadFun();
            // 获取客服连接
            this.getCustomerUrlFun();
            // 8. 角标
            this.getPageIconFun();
        },
    },
}
</script>
<style lang="stylus" scoped>
@import '~@/assets/styles/template1/themes/mixin.styl'
.app-con
    width 100%
    height 100%

    .main-con
        min-height 883px
        margin-top 130px

.e-pickPlay-bak
    width 300px
    height 205px
    bg_color(bg001)
    border-radius 6px
    padding 20px 0px
    position fixed
    left 50%
    top 50%
    transform: translate(-50%, -60%)
    z-index 11
    display flex
    align-items center
    justify-content center
    flex-wrap wrap

    .e-but
        width 210px
        height 44px
        bg_color(bg02)
        border-radius 22px
        text-align center
        line-height 44px
        font_color(fc045)
        font-size: 15px
        cursor pointer

    .e-bcur
        bg_color(bg03)
        font_color(fc12)

        span
            display block

    .ep-free
        text-align center

    p
        font-size 12px
        font_color(fc02)
        padding-top 10px

    .ep-close
        width: 40px
        height: 40px
        position absolute
        bottom -50px
        cursor pointer

        svg
            border-radius 50%
            border_all(2px, solid, border01)
            font_color(fc01)
            padding 8px
            width 40px
            height 40px
</style>
