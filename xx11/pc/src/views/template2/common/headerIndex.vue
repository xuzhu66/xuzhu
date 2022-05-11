<template lang="pug">
    header.header
        .w1200.flex-box
            //- logo
            .logo-obj(@click="goUrl('/home')" :style="`background-image: url(${logoImg})`")
            // 导航栏
            .menu-list
                ul
                    li(v-for="(item,i) in menuList" :key="i" v-if='menuList && item.showFlag' :class="[{'active': item.page == curMenu}]" @click="setCurrentMenu(item,i)") {{item.name}}
            // 登录后状态
            .login-obj
                .login-con(v-show="userId")
                    .login-left
                        .item(v-for="(v,i) in qmenu" :key="i" @click="goUrl(v.url)") {{v.name}}
                    .login-right
                        .login-r-top
                            span(@click="goUrl('/center/assetsOverview')") {{userInfo.username?userInfo.username:numHidf3l4(userInfo.mobile)}}
                            span.vip-live(:class="`vip-${vipLevel}`",@click="goUrl('/center/vipCenter')")
                        .login-r-down
                            span ¥ {{ centerWallet | format}}
                    .login-user
                        .center-flow
                            .center-cont
                                .center-item.top
                                    .item(@click="goUrl('/center/assetsOverview')")
                                        .icon-con
                                            svg-icon(:icon-class="`card`")
                                        .item-name 资产总览
                                    .item(@click="goUrl('/center/capitalRecord')")
                                        .icon-con
                                            svg-icon(:icon-class="`hm_transfer`")
                                        .item-name 交易记录
                                    .item(@click="goUrl('/center/bettingRecord')")
                                        .icon-con
                                            svg-icon(:icon-class="`betting`")
                                        .item-name 投注记录
                                .center-item.down(@click="playLogOut()")
                                    .item
                                        .icon-con
                                            svg-icon(:icon-class="`hm_logout`")
                                        .item-name 退出登录

                .no-login-con(v-show="!userId")
                    .btn-empty(@click="showReg()") 注册
                    .btn-kind(@click="showLogin()") 登录

        vipDialog(:showDialog="showDialog",:closeDialog="closeDialog",v-if="showDialog")
        drawCenter(:showDialog="showDialogDraw",:closeDialog="closeDialogDraw",v-show="showDialogDraw")

</template>
<script>
import vipDialog from '../center/vipDialog'
import {mapActions, mapGetters, mapState} from 'vuex';
import {formatAmount, formatTelNo, numHidf3l4} from "@js";
import headerStore from "@/store/comstore/home/headerStore";
import drawCenter from "@/views/template2/center/drawCenter";

export default {
    name: "Header", // 头部
    components: {
        vipDialog,
        drawCenter,
    },
    data() {
        return {
            qmenu: [{
                code: 'deposit',
                url: '/center/deposit',
                name: '存款'
            }, {
                code: 'draw',
                url: '/center/draw',
                name: '取款'
            }, {
                code: 'transfer',
                url: '/center/transfer',
                name: '转账'
            }],

            loginMenu: [{
                code: 'login',
                name: '登录'
            }],

            loginOut: [{
                code: 'logout',
                name: '退出'
            }],

            regMenu: [{
                code: 'reg',
                name: '极速注册'
            }],
            showDialog: false,// vip dialog
        };
    },
    computed: {
        ...mapGetters(['userId']),
        ...mapState({
            wallet: state => state['centerStore'].wallet,
            userInfo: state => state['centerStore'].userInfo,
            centerWallet: state => state.centerWallet,// 中心钱包
            logoImg: state => state.homeStore.logoImg,// 平台Logo
            headerIntroduce: state => state.homeStore.headerIntroduce,// 获取头部信息
            username: state => state.username,// 用户名
            vipLevel: state => state.vipLevel,//  VIP等级 1表示普通会员 2-VIP1 3-VIP2 4-VIP3 5-VIP4 6-VIP5 7-VIP6
            curMenu: state => state.curMenu,//  当前选中菜单
            isReq: state => state.gameStore.isReq,//  游戏请求是否完成
            menuList: state => state.headerStore.menuList, // 菜单列表
            wechat: state => state.headerStore.wechat, // 微信专员对象
            userId: state => state.userId, // 会员id
            token: state => state.token, // 权限token
            agentable: state => state.agentable, // 是否申请了代理 布尔类型：true表示是，false表示不是
            showDialogDraw: state => state.headerStore.showDialogDraw,
        }),
    },
    watch: {
        "$store.state.userId": {
            handler(newValue, oldValue) {
                // 监听用户id,查询当前子栏目的数据;
                if (newValue && newValue != '') {
                    this.setSelectedMenu()
                    // 查询用户详情信息;
                    this.getUserInfoFun()
                    // 获取微信
                    this.getWechatChangeFun();
                    this.getDrawCenterNumber()
                }
            },
            immediate: true
        }
    },
    created() {
        if (!this.$store.state["headerStore"]) { // 头部store
            headerStore.install(this);
        }
    },
    mounted() {
        this.pageInit();
    },
    filters: {
        format(vlaue) {
            if (vlaue) {
                return formatAmount(vlaue);
            } else {
                return "0"
            }
        }
    },
    methods: {
        formatTelNo: formatTelNo,
        formatAmount: formatAmount,
        numHidf3l4: numHidf3l4,
        ...mapActions({
            // 查询资金总览--安全
            getAssetsSafeFun(dispatch, param) {
                return dispatch(`centerStore/getAssetsSafeAction`, param);
            },
            // 查询用户信息
            getUserInfoFun(dispatch, param) {
                return dispatch(`centerStore/getUserInfoAction`, param);
            },
            // 查询菜单列表
            gameMenuListFun(dispatch, param) {
                return dispatch(`headerStore/gameMenuListAction`, param);
            },
            // 微信变更
            getWechatChangeFun(dispatch, param){
                return dispatch('headerStore/getWechatChangeAction',param);
            },
            // 获取领取中心数量
            getDrawCenterNumber(dispatch, param){
                return dispatch('headerStore/getDrawCenterNumber',param);
            }
        }),
        // 初始化
        pageInit() {
            // 设置动态菜单导航
            this.getMenuList();
            this.getLogon(); // 检查用户是否登入
            if(this.userId){
                // 获取微信
                this.getWechatChangeFun();
            }
        },
        // 设置当前菜单
        setCurrentMenu(item) {
            // 判断当前菜单是否是选中的菜单;
            if (this.curMenu == item.page) {
                return
            }
            // this.$store.commit("gameStore/set_isReq", false);
            this.$store.dispatch('returnTop');
            this.$store.commit('set_curMenu', item.page);
            this.$store.commit('set_curMenuId', item.code);
            // 如果是代理路由 && 登录状态
            if(item && item.page == "/agent" && this.token){
                // 判断是不是代理
                if(this.agentable){ // 高级代理人
                    this.$router.push('/center/hadAgent');
                }else{ // 申请代理
                    this.$router.push('/center/applyAgent');
                }
            }else{
                this.goUrl(`${item.page}`)
            }

        },
        // 设置选中的菜单
        setSelectedMenu() {
            let p = this.$route.path,
                arr = ['/home', '/beauty', '/chess', '/electronic', '/fish', '/lottery', '/gameRace', '/sport', '/discount','/agent'];

            if (arr.includes(p) && this.menuList) {
                this.menuList.forEach((val, key) => {
                    if (val.page == p) this.setCurrentMenu(val)
                });
            } else {
                // 清空首页选中
                this.setCurrentMenu({code: '', page: '', name: ''})
            }
        },
        // 查询banner
        getBannerList(item) {
            let param = {
                seatType: item.id, // 1、首页轮播banner 2、首页热门图片管理 3、洗码代理banner
            };
            this.$store.dispatch("headerStore/gameBanner", param).then(res => {
                //
            });
        },
        // 检查用户是否登入
        getLogon() {
            this.$store.dispatch("getLogon");
        },

        // 显示注册
        showReg() {
            this.$setBuriedPoint('J10010');
            this.$store.commit('set_showLogin', true)
            this.$store.commit("loginRegStore/set_curTemp", 'reg')
        },
        //  显示登录
        showLogin() {
            this.$setBuriedPoint('J10020');
            this.$store.commit('set_showLogin', true)
            this.$store.commit("loginRegStore/set_curTemp", 'login')
        },
        // 跳转页面
        async goUrl(url) {
            if (this.$route.path == url) { // 当前相同路径不跳转
                return;
            }
            if (url == '/home') {
                this.$store.commit('set_curMenu', '/home')
            }


            let arr = ['/center/deposit', '/center/draw', '/center/transfer', '/center/assetsOverview'],
                u = url;
            if (arr.includes(url) && this.userId == '') {
                this.$store.commit('set_showLogin', true)
                this.$store.commit("loginRegStore/set_curTemp", 'login')
            } else {
                if (arr.includes(url)) {
                    this.$store.commit('set_curMenu', '')
                }
                this.$router.push({ path: u  })
            }
        },
        // 玩家退出
        playLogOut() {
            this.$store.dispatch("headerStore/logOut");
            this.$store.commit("headerStore/SET_DRAW_NUMBER", 0);
        },
        // 关闭弹框
        closeDialog() {
            this.showDialog = false;
        },
        closeDialogDraw() {
            // this.showDialogDraw = false;
            this.$store.commit('headerStore/SET_DRAW_CENTER', false)
        },
        // 设置动态菜单导航
        getMenuList() {
            // 调用服务
            if(!this.menuList){
                this.gameMenuListFun().then(res =>{
                    this.setSelectedMenu();
                });
            }else{
                this.setSelectedMenu();
            }
        },
        relayInitWechat(){
            if(!this.wechat){
                this.getWechatChangeFun();
            }
        },

    }
};
</script>
<style lang="stylus" scoped>
@import '~@styl/template2/themes/mixin.styl'
@import '~@styl/template2/common/fun.styl'
.header
    height 86px
    margin 0px auto
    position fixed
    top 0
    left 0
    bg_color(hader_bg_001)
    z-index 4
    width 100%

    .w1200
        height 100%

        .logo-obj
            background-size: contain
            background-repeat no-repeat
            width: 190px;
            height: 60px;
            flex none
            cursor()

        .menu-list
            margin-left 20px
            flex 1
            font-size: 16px;
            font_color(hader_fc_001)

            ul
                resetul()
                flexcon()
                justify-content space-around

                li

                    flex none
                    flexcon()
                    position relative
                    cursor pointer
                    transition:0.2s all linear;
                    &:after
                        after()
                        bottom -9px
                        width 0
                        height: 4px;
                        bg_img_linear(linear14, linear15)
                        border-radius: 2px;
                        transition:0.2s all linear;
                        left:0%;
                    &:hover
                    &.active
                        color #ecb351
                        &:after
                            width 100%
                            left 0

        .login-obj
            flex none
            min-width 330px

            .login-con
                flexcon()
                position relative

                .login-left
                    padding-right 60px
                    flex none
                    width 210px
                    height: 48px;
                    bg_img_linear(linear14, linear15)
                    background-blend-mode: normal, normal;
                    border-radius: 24px;
                    flexcon()

                    .item
                        flex 1
                        flexcon()
                        width: 32px;
                        height: 16px;
                        font-size: 16px;
                        letter-spacing: 0px;
                        font_color(fc069)
                        cursor()

                        &:hover
                            color: #2b2b32

                .login-right
                    padding-left 10px
                    flex 1
                    font-size: 16px;

                    .login-r-top
                        font_color(fc070)
                        flexcon()

                        .vip-live
                            cursor()
                            width: 90px;
                            height: 30px;
                            background-size contain
                            background-position 0px center
                            background-repeat no-repeat
                            display inline-block
                            transform: scale(.7);
                        .vip-1
                            background-image  url("~@img/comimages/center/vip/vip0.png")

                        .vip-2
                            background-image  url("~@img/comimages/center/vip/vip1.png")

                        .vip-3
                            background-image  url("~@img/comimages/center/vip/vip2.png")

                        .vip-4
                            background-image  url("~@img/comimages/center/vip/vip3.png")

                        .vip-5
                            background-image  url("~@img/comimages/center/vip/vip4.png")

                        .vip-6
                            background-image  url("~@img/comimages/center/vip/vip5.png")

                        .vip-7
                            background-image  url("~@img/comimages/center/vip/vip6.png")
                        .vip-8
                            background-image  url("~@img/comimages/center/vip/vip7.png")
                        .vip-9
                            background-image  url("~@img/comimages/center/vip/vip8.png")
                        .vip-10
                            background-image  url("~@img/comimages/center/vip/vip9.png")

                        //.vip-1
                        //    background-image url('~@img/template2/comm/vip0.png')
                        //
                        //.vip-2
                        //    background-image url('~@img/template2/comm/vip1.png')
                        //
                        //.vip-3
                        //    background-image url('~@img/template2/comm/vip2.png')
                        //
                        //.vip-4
                        //    background-image url('~@img/template2/comm/vip3.png')
                        //
                        //.vip-5
                        //    background-image url('~@img/template2/comm/vip4.png')
                        //
                        //.vip-6
                        //    background-image url('~@img/template2/comm/vip5.png')
                        //
                        //.vip-7
                        //    background-image url('~@img/template2/comm/vip6.png')

                    .login-r-down
                        font_color(fc071)

                .login-user
                    cursor()
                    absolute()
                    left 150px
                    top 50%
                    transform translateY(-50%)
                    border-radius 50%
                    width 60px
                    height 60px
                    background url("~@img/template2/logo/logo.png") center / contain no-repeat

                    &:hover
                        .center-flow
                            display block

                            .center-cont
                                display block

                    .center-flow
                        display none
                        width: 120px;
                        height: 180px;

                        &:hover
                            .center-cont
                                display block

                        .center-cont
                            display none
                            position absolute
                            bottom: -200px;
                            width: 330px;
                            height: 180px;
                            bg_color(bg49)
                            border-radius: 10px;
                            left: -130px;
                            outline 30px

                            &:hover
                                display block

                            &:after
                                after()
                                triangle-top(10px, 10px, #2b2b32)
                                top: -9px;
                                left: 45%;

                            .center-item
                                &.top
                                    width: 330px;
                                    height 120px
                                    flexcon()

                                    .item
                                        flex 1
                                        flexcon()
                                        flex-direction column

                                        &:hover
                                            .icon-con
                                                .svg-icon
                                                    font_color(bg50)

                                            .item-name
                                                font_color(fc072)

                                        .icon-con
                                            width: 50px;
                                            height: 50px;
                                            bg_color(bg51)
                                            border-radius: 25px;
                                            flexcon()

                                            .svg-icon
                                                font_color(fc073)

                                        .item-name
                                            font-size: 14px;
                                            letter-spacing: 0px;
                                            font_color(fc070)
                                            margin-top 6px

                                &.down
                                    border_com(1px, solid, border41, top)
                                    width: 330px;
                                    height: 60px;
                                    flexcon()
                                    font-size: 14px;
                                    font_color(fc074)

                                    &:hover
                                        .icon-con
                                            .svg-icon
                                                font_color(fc075)

                                        .item-name
                                            font_color(fc072)

                                    .item
                                        flexcon()

                                        .item-name
                                            margin-left 10px

            .no-login-con
                flexcon()

                .btn-empty
                    //wobble-bottom()
                    cursor()
                    flexcon()
                    width: 90px;
                    height: 48px;
                    font-size: 20px;
                    font_color(fc075)
                    border-radius 24px
                    border_all(1px, solid, border42)
                    transition all .3s ease-in-out
                    &:hover
                        //border_com(1px, solid, border43, bottom)
                        //bg_img_linear(linear16, linear17)
                        //font_color(fc076)
                        transform scale(1.1)
                .btn-kind
                    //wobble-bottom()
                    cursor()
                    flexcon()
                    width: 90px;
                    height: 48px;
                    font-size: 20px;
                    border-radius 24px
                    border_com(1px, solid, border43, bottom)
                    bg_img_linear(linear16, linear17)
                    font-size: 20px;
                    font_color(fc076)
                    margin-left 10px
                    transition all .3s ease-in-out
                    &:hover
                        transform scale(1.1)



</style>
