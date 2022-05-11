<template lang="pug">
    .app-con
        // 头部
        Header(v-if="teamAgentEnabled !== ''")
        // 路由
        .main-con
            .banner-con(:class="($route.meta.keep && $route.name != 'fish' && $route.name != 'welcome') ?'keep':'nokeep'")
                template(v-for="item in bannerComponetsList")
                    Banner(:bannerType="item")
                .banner-flow
            transition
                keep-alive(:include="keepAliveList")
                    router-view
        // 底部
        Footer
        // 左侧导航
        Left
        // 通用弹框
        LoadingDialog(v-show="isShowLoad" :dialProp="loadContent")
        // 注册登录
        LoginReg(v-show="showLogin")
        // 游戏弹框
        GameDialog
        // 取款弹窗
        DrawDialog
        // 活动弹框
        activityDialog
        // 活动小窗口
        activityWindown
</template>

<script>
import Header from '@/views/template3/common/headerIndex'; // 头部
import Footer from '@/views/template3/common/footer/footerIndex'; // 底部
import LoadingDialog from "@/plugins/template3/loadingDialog/loadingDialog"; // 弹出框
import LoginReg from '@/views/template3/login/loginIndex'; // 登录
import Left from '@/views/template3/common/left'; // 左边客服
import DrawDialog from '@/views/template3/center/drawDialog'; // 取款弹窗
import GameDialog from '@/views/template3/game/gameDialog';
import gameStore from "@/store/comstore/game/gameStore"; // 登入游戏状态
import homeStore from "@/store/template3/homeStore";
import headerStore from "@/store/comstore/home/headerStore";
import loginRegStore from "@/store/comstore/user/loginRegStore";
import drawStore from "@/store/comstore/assets/drawStore";
import store from "@/store/Store";
import centerStore from "@/store/comstore/center/centerStore"; // 进入游戏弹窗
import noticeStore from "@/store/comstore/modules/noticeStore"; // notice状态
import '@styl/template3/index.styl';
import {mapActions, mapMutations, mapState} from "vuex";
import {getUrlParam} from "@m/utils";
import bannerStore from "@/store/template3/bannerStore"; // 工具类
import Banner from '@pon/template3/homeBanner'; // Banner轮播图片
import activityDialog from '@/views/business/activity/activityDialog';
import activityWindown from '@/views/business/activity/activityWindown';
import activityStore from "@/store/comstore/activity/activityStore";
export default {
    name: 'index',
    components: {
        "Header": Header, // 头部
        "Footer": Footer, // 底部
        "LoadingDialog": LoadingDialog,// loadding 弹框
        "LoginReg": LoginReg, // 登录
        "Left": Left, // 左边客服
        "DrawDialog": DrawDialog, // 取款弹框
        "GameDialog": GameDialog, // 游戏入口弹框
        Banner,
        "activityDialog":activityDialog,// 活动弹框
        "activityWindown":activityWindown,// 活动入口
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
            themeNumber: state => state.templateStore.theme, // 主题风格编号
            sourceid: state => state.sourceid, // 渠道id
            loadContent: state => state.loadContent, // 通用弹框
            isShowLoad: state => state.isShowLoad, // 加载弹窗是否显示
            showLogin: state => state.showLogin, // 登入是否显示
            curMenu: state => state.curMenu, // 当前菜单
            curMenuId: state => state.curMenuId, // 当前菜单ID
            teamAgentEnabled: state => state.teamAgentEnabled, // 是否配置合营代理
        }),
    },
    watch: {
        teamAgentEnabled: {
            handler(newValue, oldValue) {
                }
            },
            immediate: true
    },
    created() {
        this.appInit();
    },
    mounted() {

    },
    methods: {
        ...mapMutations({
            // 设置渠道ID
            setSourceId(commit, param) {
                return commit('SET_SOURCEID', param);
            }
        }),
        ...mapActions({
            // 获取app下载对象
            getAppDownLoadFun(dispatch, param) {
                return dispatch(`homeStore/getAppDownLoadAction`, param);
            },
            // 获取平台配置
            getPlatInfoFun(dispatch, param) {
                return dispatch(`homeStore/getPlatInfo`, param);
            },
            // 获取客服链接
            getCustomerUrlFun(dispatch, param) {
                return dispatch(`homeStore/getCustomerUrl`, param);
            },
            // 获取logo
            getLogoImgFun(dispatch, param) {
                return dispatch(`homeStore/getLogoImg`, param);
            },
            // 获取logo右侧文字
            getHeaderIntroduceFun(dispatch, param) {
                return dispatch(`homeStore/getHeaderIntroduce`, param);
            },
            // 获取平台配置
            getPlatformConfigFun(dispatch, param) {
                return dispatch("homeStore/getPlatInfo", param);
            },
            // 查询notice列表
            getNoticeListFun(dispatch, param) {
                return dispatch('noticeStore/getHomeNotice', param);
            },
            // 获取页面icon
            getPageIconFun(dispatch, param) {
                return dispatch('homeStore/getPageIconAction', param);
            },


        }),

        // 初始化app store
        initStore() {
            if (!this.$store.state["homeStore"]) { // home store
                homeStore.install(this);
            }
            if (!this.$store.state["gameStore"]) { // game store
                gameStore.install(this);
            }
            if (!this.$store.state["headerStore"]) { // 头部store
                headerStore.install(this);
            }
            if (!this.$store.state["loginRegStore"]) { // 登录注册主store
                loginRegStore.install(this);
            }
            if (!this.$store.state["drawStore"]) { // 取款store
                drawStore.install(this);
            }
            if (!store.state["centerStore"]) {// 个人中心动态store
                centerStore.install(this);
            }
            if (!store.state["noticeStore"]) {// 消息里列表store
                noticeStore.install(this);
            }
            if (!this.$store.state["bannerStore"]) { // home页面 banner store
                bannerStore.install(this);
            }
            if (!store.state["activityStore"]) {// 活动store
                activityStore.install(this);
            }

        },

        // app 初始化操作
        appInit() {
            // 1. 初始化store
            this.initStore();
            // 2. 获取渠道ID (查询平台信息需要)
            this.getSourceIDFromUrl();
            // 3. 查询平台信息
            this.getPlatformInfo();
            // 4. 查询平台轮播公告
            this.getNoticeListFun();
            // 5. 获取app下载地址
            this.getAppDownLoadFun();
            // 6. 获取客服连接
            this.getCustomerUrlFun();
            // 7. 获取平台logo
            this.getPlateformLogo();
            // 8. 角标
            this.getPageIconFun();
        },

        // 获取平台配置
        async getPlatformInfo() {
            // 基础信息参数
            let infoParam = {
                channelId: this.sourceid // 渠道id
            };
            // 获取基础信息
            this.getPlatformConfigFun(infoParam);
        },
        // 获取平台logo
        getPlateformLogo() {
            // LOGO图片参数
            let logoImgParam = {
                deviceType: 2, // 终端：1、H5  2、PC 3、android 4、ios
                templateNo: this.templateNumber, // 模板number
            };
            // 头部LOGO图片
            this.getLogoImgFun(logoImgParam);
        },
        // 获取渠道ID
        getSourceIDFromUrl() {
            // 获取渠道id -- 获取地址栏url中的参数
            let sourceId = getUrlParam('source');
            if (sourceId && sourceId.indexOf("#")) {
                sourceId = sourceId.split("#")[0]
            }
            // 保存到store
            this.setSourceId(sourceId);
        },

    },
}
</script>
<style lang="stylus" scoped>
@import '~@/assets/styles/template3/themes/mixin.styl'
@import "~@styl/template3/common/fun.styl"
.app-con
    bg_color(bg1)
    padding-top 86px

    .main-con
        min-height 900px
        position relative

        .banner-con
            width 100%
            height 520px

            &.keep
                //position relative
                //top 0px
            &.nokeep
                position absolute
                top -800px

            .banner-flow
                cursor: pointer;
                height: 520px;
                position: absolute;
                top: 0px;
                left: 0px;
                width: 100%;
                z-index 2
                bg_color(bg1)
</style>
