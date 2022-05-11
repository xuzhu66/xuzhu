<template lang="pug">
    header.v-header
        .w1200.flex-jb.vh-t
            .had-logo(@click="goUrl('/home')" :style="`background-image: url(${logoImg})`")
            .had-indu {{headerIntroduce}}
            .had-qmenu.flex-jb

                .had-uinfo(v-show="userId != ''")
                    .user
                        span(@click="goUrl('/center/assetsOverview')") 欢迎您，
                        span.had-wc(@click="goUrl('/center/assetsOverview')") {{userInfo.username?userInfo.username:numHidf3l4(userInfo.mobile)}}
                        span.had-vlico(:class="`had-iv${vipLevel}`",@click="goUrl('/center/vipCenter')")
                    .center(@click="goUrl('/center/assetsOverview')")
                        span 中心钱包:
                        span.mn ¥ {{ centerWallet | format}}

                //-存提转
                ul.had-menu-l.flex-jb
                    li(v-for="(v,i) in qmenu" :key="i" @click="goUrl(v.url)")
                        p.had-icon
                            svg-icon(:icon-class="`hm_${v.code}`")
                        p.had-mfont {{v.name}}
                //-登出
                ul.had-mlogout.flex-jb(v-show="userId != ''")
                    li(v-for="(v,i) in loginOut" :key="i" @click="playLogOut()")
                        p
                            svg-icon(:icon-class="`hm_${v.code}`")
                        p.had-mfont {{v.name}}
                //-登录
                ul.had-menu-m.flex-jb(v-show="userId == ''")
                    li(v-for="(v,i) in loginMenu" :key="i" @click="showLogin()")
                        p
                            svg-icon(:icon-class="`hm_${v.code}`")
                        p.had-mfont {{v.name}}
                //-注册
                ul.had-menu-r(v-show="userId == ''" @click="showReg()")
                    li(v-for="(v,i) in regMenu" :key="i") {{v.name}}

        .w1200.had-menu
            ul.had-mlist
                template(v-for="(item,i) in menuList")
                    li(v-if='item.showFlag' :key="i" :class="[{'cur-menu': item.page == curMenu}]" @click="setCurrentMenu(item,i, true)") {{item.name}}

        vipDialog(:showDialog="showDialog",:closeDialog="closeDialog",v-if="showDialog")

        
        drawCenter(:showDialog="showDialogDraw",:closeDialog="closeDialogDraw",v-show="showDialogDraw")

</template>
<script>
import vipDialog from '../center/vipDialog'
import {mapActions, mapGetters, mapState} from 'vuex';
import {formatAmount, formatTelNo, numHidf3l4} from "@js";
import headerStore from "@/store/comstore/home/headerStore";
import drawCenter from "@/views/template1/center/drawCenter";
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
            // showDialogDraw: false
        };
    },
    computed: {
        ...mapGetters(['userId']),
        ...mapState({
            wallet: state => state['centerStore'].wallet,
            userInfo: state => state['centerStore'].userInfo,
            centerWallet: state => state.centerWallet,// 中心钱包
            menuList: state => state.headerStore.menuList, // 菜单列表
            wechat: state => state.headerStore.wechat, // 微信专员对象
            userId: state => state.userId, // 会员id
            token: state => state.token, // 权限token
            agentable: state => state.agentable, // 是否申请了代理 布尔类型：true表示是，false表示不是
            showDialogDraw: state => state.headerStore.showDialogDraw,

        }),
        logoImg: { // 平台Logo
            get() {
                return this.$store.state.homeStore.logoImg;
            },
            set(item) {
                return item
            }
        },
        headerIntroduce: { // 获取头部信息
            get() {
                return this.$store.state.homeStore.headerIntroduce;
            },
            set(item) {
                return item
            }
        },
        username: { // 用户名
            get() {
                return this.$store.state.username;
            },
            set(item) {
                return item
            }
        },
        vipLevel: { // VIP等级 1表示普通会员 2-VIP1 3-VIP2 4-VIP3 5-VIP4 6-VIP5 7-VIP6
            get() {
                return this.$store.state.vipLevel;
            },
            set(item) {
                return item
            }
        },
        curMenu: { // 当前选中菜单
            get() {
                return this.$store.state.curMenu;
            },
            set(item) {
                return item
            }
        },
        isReq: { // 游戏请求是否完成
            get() {
                return this.$store.state.gameStore.isReq;
            },
            set(item) {
                return item
            }
        }
    },
    watch: {
        userId: {
            handler(newValue, oldValue) {
                if (newValue && newValue != '') {
                    this.setSelectedMenu()
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
        // 设置动态菜单导航
        this.getMenuList();
        this.pageInit();
        if(this.userId){
            // 获取微信
            this.getWechatChangeFun();
            // 获取领取数量
            // this.getDrawCenterNumber()
        }
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
        pageInit() { // 构造方法
            this.setSelectedMenu();
            this.getLogon(); // 检查用户是否登入
        },
        // 设置选中的菜单
        setSelectedMenu() {
            let p = this.$route.path,
                arr = ['/home', '/beauty', '/chess', '/electronic', '/fish', '/lottery', '/gameRace', '/sport', '/discount','/agent']
            if (arr.includes(p) && this.menuList) {
                this.menuList.forEach((val, key) => {
                    if (val.page == p) this.setCurrentMenu(val)
                });
            } else {
                // 清空首页选中
                this.setCurrentMenu({code: '', page: '', name: ''})
            }
        },
        getLogon() {
            this.$store.dispatch("getLogon").then(res => {
            });
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
        showReg() {
            this.$setBuriedPoint('J10010');
            this.$store.commit('set_showLogin', true)
            this.$store.commit("loginRegStore/set_curTemp", 'reg')
        },
        showLogin() {
            this.$setBuriedPoint('J10020');
            this.$store.commit('set_showLogin', true)
            this.$store.commit("loginRegStore/set_curTemp", 'login')
        },
        // 跳转页面
        async goUrl(url) {
            //1
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
        playLogOut() { // 玩家退出
            this.$store.dispatch("headerStore/logOut").then(res => {
            });
            this.$store.commit("headerStore/SET_DRAW_NUMBER", 0);

        },
        // 关闭弹框
        closeDialog() {
            this.showDialog = false;
        },
        closeDialogDraw() {
            // this.showDialogDraw = false;
            this.$store.commit('headerStore/SET_DRAW_CENTER', false)
            this.$store.dispatch('headerStore/getDrawCenterNumber')
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
@import '~@styl/template1/themes/mixin.styl'
@import '~@styl/template1/common/fun.styl'
.v-header
    height 130px
    align-items center
    margin 0px auto
    position fixed
    top 0
    left 0
    bg_color(bg04)
    z-index 5
    width 100%

    .vh-t
        padding 5px 0px
        cursor pointer

    .had-logo
        width 250px
        height 70px
        background-size: contain
        background-repeat no-repeat

    .had-indu
        width 250px
        height 70px
        display flex
        align-items center
        text-align left
        font-size 18px
        font_color(fc045)

    .had-qmenu
        width 700px
        display flex
        justify-content flex-end

        .had-uinfo
            margin-right 20px

            .user
                display flex
                flex-direction row
                align-items center
                font-size: 16px

                .had-wc
                    font-size: 18px
                    font_color(fc046)

                .had-um
                    font-size: 18px
                    font_color(fc047)

            .center
                margin-top 5px
                height 24px
                font-size 14px
                bg_color(bg29)
                border-radius 20px
                padding 2px
                padding-left 10px

                .mn
                    font_color(fc048)
                    padding-left 10px
                    font-weight 600

            .had-vlico
                width 90px
                height 31px
                background-size contain
                background-position 0px center
                background-repeat no-repeat
                display inline-block
                margin-left 5px
                transform: scale(.7);
            .had-iv1
                background-image  url("~@img/comimages/center/vip/vip0.png")

            .had-iv2
                background-image  url("~@img/comimages/center/vip/vip1.png")

            .had-iv3
                background-image  url("~@img/comimages/center/vip/vip2.png")

            .had-iv4
                background-image  url("~@img/comimages/center/vip/vip3.png")

            .had-iv5
                background-image  url("~@img/comimages/center/vip/vip4.png")

            .had-iv6
                background-image  url("~@img/comimages/center/vip/vip5.png")

            .had-iv7
                background-image  url("~@img/comimages/center/vip/vip6.png")
            .had-iv8
                background-image  url("~@img/comimages/center/vip/vip7.png")
            .had-iv9
                background-image  url("~@img/comimages/center/vip/vip8.png")
            .had-iv10
                background-image  url("~@img/comimages/center/vip/vip9.png")

            //.had-iv1
            //    background-image url('~@img/template1/comm/vip0.png')
            //
            //.had-iv2
            //    background-image url('~@img/template1/comm/vip1.png')
            //
            //.had-iv3
            //    background-image url('~@img/template1/comm/vip2.png')
            //
            //.had-iv4
            //    background-image url('~@img/template1/comm/vip3.png')
            //
            //.had-iv5
            //    background-image url('~@img/template1/comm/vip4.png')
            //
            //.had-iv6
            //    background-image url('~@img/template1/comm/vip5.png')
            //
            //.had-iv7
            //    background-image url('~@img/template1/comm/vip6.png')

        .had-icon
            svg
                width 24px
                height 24px
                text-align center
                font_color(fc045)

        .had-mfont
            font-size: 14px
            font_color(fc017)

        .had-menu-l
            width 240px
            height 60px
            margin-right 10px

            li
                bg_color(bg30)
                width 93px
                height 60px
                text-align center
                position relative
                cursor pointer
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                transition all .5s
                &:after
                    content: ""
                    left 0px
                    top: 50%
                    transform translateY(-50%)
                    border_com(1px, solid, border26, right)
                    height: 38px
                    position absolute

                &:hover
                    bg_color(bg31)
                    font_color(fc01)

                    p
                        &.had-mfont
                            font_color(fc01)

                        &.had-icon
                            .svg-icon
                                font_color(fc01)

            li:nth-child(1)
                border-bottom-left-radius 10px
                border-top-left-radius 10px

                &:after
                    border-right: none;

            li:last-child
                border-top-right-radius 10px
                border-bottom-right-radius 10px

    .had-menu-m
        width: 80px
        height 60px
        bg_color(bg30)
        margin-right 10px
        border-radius: 10px

        li
            width 93px
            text-align center
            position relative
            cursor pointer
            margin 0px auto
            bg_color(bg30)
            height 60px
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-radius 10px

            svg
                width 24px
                height 24px
                text-align center
                font_color(fc045)

            &:hover
                bg_color(bg31)
                font_color(fc01)

                p
                    &.had-mfont
                        font_color(fc01)

                    .svg-icon
                        font_color(fc01)

    .had-mlogout
        width: 50px
        height 60px
        border-radius: 10px

        li
            width 93px
            text-align center
            position relative
            cursor pointer

            .had-mfont
                font_color(fc049)

            svg
                width 24px
                height 24px
                text-align center
                font_color(fc049)

    .had-menu-r
        width 180px
        height 60px
        background url("~@img/template1/home/loginBg.png") center no-repeat
        background-size 180px 60px
        text-align center
        padding-top 34px
        font_color(fc01)
        font-size 14px
        cursor pointer
        hvr-pop()
    .had-menu
        .had-mlist
            display flex
            justify-content space-around

            li
                text-align center
                font-size: 20px
                font_color(fc06)
                line-height: 45px
                cursor pointer
                position relative
                transition:0.2s all linear;
                &:after
                    after()
                    bottom 0px
                    width 0px
                    height: 3px;
                    bg_img_linear(linear03)
                    background-blend-mode: normal, normal;
                    border-radius: 4px;
                    transition:0.2s all linear;
                    left:0%;
                &:hover
                    font_color(fc013)
                &:hover::after
                    width 100%
                    left 0
                &:hover +  &:hover::after
                    left 0
                &.cur-menu
                    font_color(fc013)
                    &:after
                        width 100%
                        left 0





</style>
