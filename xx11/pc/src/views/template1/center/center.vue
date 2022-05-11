<template lang="pug">
    .center-con
        .center.layout
            .center-left
                .left-menu
                    // 如果开启了代理或者已经加入了代理
                    ul(v-if="platformInfo.rebateAgentEnabled || platformInfo.teamAgentEnabled || platformInfo.unlimitAgentEnabled || userInfo.type >1")
                        // 已经加入代理
                        template(v-if="agentable")
                            li(v-for="(it,ind) in menuList" :class="it.line?'line':''",@click="returnTop")
                                router-link(:to="it.url", :exact="it.url=='keeprouter'" @click.native="getClick(it)")
                                    //i(:class='it.ico')
                                    span {{menu_t[ind]}}
                        // 未加入代理
                        template(v-else)
                            li(v-for="(it,ind) in menuList1" :class="it.line?'line':''",@click="returnTop")
                                router-link(:to="it.url", :exact="it.url=='keeprouter'" @click.native="getClick(it)")
                                    //i(:class='it.ico')
                                    span {{menu_t1[ind]}}
                    // 未开启代理
                    ul(v-else)
                        li(v-for="(it,ind) in menuList2" :class="it.line?'line':''",@click="returnTop")
                            router-link(:to="it.url", :exact="it.url=='keeprouter'" @click.native="getClick(it)")
                                //i(:class='it.ico')
                                span {{menu_t2[ind]}}

                    qrcode(v-if="app.pcDownloadUrl && showAppDownLoad", :codeurl="app.pcDownloadUrl",:clasz="'centerqr'")
                    .down-text(v-if="app.pcDownloadUrl && showAppDownLoad") 扫码下载APP

            .center-right
                transition(name="display")
                    router-view.center-content

</template>

<script>
import {mapActions, mapState} from 'vuex';
import thatStore from "@/store/comstore/center/centerStore"; // 获取模板
import store from '@/store/Store';
//import qrcode from '@com/comQrcode'
import qrcode from "@pon/template1/comQrcode"

export default {
    components: {
        qrcode,
    },
    filters: {
        Number(vlaue) {
            if (vlaue) {
                return Number(vlaue);
            }
        }
    },
    data() {
        return {
            isReqFlag: true, // 请求是否结束
            rootModule: 'centerStore',//命名空间
            isAagent: true, // 是否是高级代理人
            // 代理人
            menuList: [
                {ico: 'icon-list-06', url: '/center/vipCenter'},
                {ico: 'icon-list-01', url: '/center/assetsOverview'},
                {ico: 'icon-list-02', url: '/center/userinfo', line: true},
                {ico: 'icon-list-03', url: '/center/deposit'},
                {ico: 'icon-list-04', url: '/center/draw'},
                {ico: 'icon-list-05', url: '/center/transfer', line: true},
                {ico: 'icon-list-11', url: '/center/capitalRecord'},
                {ico: 'icon-list-07', url: '/center/bettingRecord'},
                {ico: 'icon-list-09', url: '/center/washCodeRecord'},
                {ico: 'icon-list-10', url: '/center/discountRecord', line: true},
                {ico: 'icon-list-06', url: '/center/passWord'},
                {ico: 'icon-list-08', url: '/center/hadAgent', name: 'hadAgent'},
                {ico: 'icon-list-08', url: '/center/message'},
            ],
            // 申请高级代理人
            menuList1: [
                {ico: 'icon-list-06', url: '/center/vipCenter'},
                {ico: 'icon-list-01', url: '/center/assetsOverview'},
                {ico: 'icon-list-02', url: '/center/userinfo', line: true},
                {ico: 'icon-list-03', url: '/center/deposit'},
                {ico: 'icon-list-04', url: '/center/draw'},
                {ico: 'icon-list-05', url: '/center/transfer', line: true},
                {ico: 'icon-list-11', url: '/center/capitalRecord'},
                {ico: 'icon-list-07', url: '/center/bettingRecord'},
                {ico: 'icon-list-09', url: '/center/washCodeRecord'},
                {ico: 'icon-list-10', url: '/center/discountRecord', line: true},
                {ico: 'icon-list-06', url: '/center/passWord'},
                {ico: 'icon-list-08', url: '/center/applyAgent', name: 'applyAgent'},
                {ico: 'icon-list-08', url: '/center/message'},
            ],
            // 没有高级代理人
            menuList2: [
                {ico: 'icon-list-06', url: '/center/vipCenter'},
                {ico: 'icon-list-01', url: '/center/assetsOverview'},
                {ico: 'icon-list-02', url: '/center/userinfo', line: true},
                {ico: 'icon-list-03', url: '/center/deposit'},
                {ico: 'icon-list-04', url: '/center/draw'},
                {ico: 'icon-list-05', url: '/center/transfer', line: true},
                {ico: 'icon-list-11', url: '/center/capitalRecord'},
                {ico: 'icon-list-07', url: '/center/bettingRecord'},
                {ico: 'icon-list-09', url: '/center/washCodeRecord'},
                {ico: 'icon-list-10', url: '/center/discountRecord', line: true},
                {ico: 'icon-list-06', url: '/center/passWord'},
                {ico: 'icon-list-08', url: '/center/message'},
            ],
            menu_t: [
                'VIP特权',
                '资产总览',
                '个人资料',
                '存款专区',
                '取款专区',
                '转账专区',
                '交易记录',
                '投注记录',
                '洗码记录',
                '优惠记录',
                '密码设置',
                '代理管理',
                '消息中心',
            ],
            menu_t1: [
                'VIP特权',
                '资产总览',
                '个人资料',
                '存款专区',
                '取款专区',
                '转账专区',
                '交易记录',
                '投注记录',
                '洗码记录',
                '优惠记录',
                '密码设置',
                '申请代理',
                '消息中心',
            ],
            menu_t2: [
                'VIP特权',
                '资产总览',
                '个人资料',
                '存款专区',
                '取款专区',
                '转账专区',
                '交易记录',
                '投注记录',
                '洗码记录',
                '优惠记录',
                '密码设置',
                '消息中心',
            ],

            isshow: false,
            teme: '',
            codeurl: '',
            interval: '',
            intervalNum: 0, // 循环次数
        }
    },
    computed: {
        ...mapState({
            commonData: state => state['centerStore'].commonData,
            userInfo: state => state['centerStore'].userInfo, // // userInfo.type    1: 普通玩家: 2: 洗码代理 3: 合营代理 4: 无限代理
            app: state => state['centerStore'].app,
            agentable: state => state.agentable, //是否是高级代理人
            teamAgentEnabled: state => state.teamAgentEnabled, // 合营代理是否开启
            showAppDownLoad:state=>state.showAppDownLoad,// 是否显示app下载
            platformInfo: state => state.platformInfo,// 平台信息  rebateAgentEnabled: false,// 洗码代理 teamAgentEnabled: false,// 合营代理  unlimitAgentEnabled:false,//无线代理
        }),
    },
    created() {
        // 动态store
        if (!store.state["centerStore"]) {
            thatStore.install(this);
        }
        this.initPage();
    },
    mounted() {
        this.isAagent = this.agentable
    },
    destroyed() {
        //清空轮序引用
        clearInterval(this.interval);
        this.interval = "";

    },
    methods: {
        ...mapActions({
            // 查询用户信息
            getUserInfoFun(dispatch, param) {
                return dispatch(`centerStore/getUserInfoAction`, param);
            },
            // 查询用户信息--非安全
            getAssetsFun(dispatch, param) {
                return dispatch(`centerStore/getAssetsAction`, param);
            },
            // 查询用户信息--安全
            getAssetsSafeFun(dispatch, param) {
                return dispatch(`centerStore/getAssetsSafeAction`, param);
            },
            // 获取app下载对象
            getAppDownLoadFun(dispatch, param) {
                return dispatch(`centerStore/getAppDownLoadAction`, param);
            },
        }),
        // 页面初始化
        initPage() {
            let that = this;
            // 获取最后调用时间
            let lastTime = localStorage.getItem("assetsLastTime");
            this.getUserInfoFun().then(() => {
                that.getAppDownLoadFun().then((res) => {

                })
            })

            // 获取当前时间
            let currtTime = new Date().getTime();
            // 如果距离上次请求时间在3秒内,则走安全方法;
            if (lastTime && (currtTime - lastTime <= 3 * 1000)) {
                that.intervalSafeFun();
            } else {
                // 记录当前调用时间
                localStorage.setItem("assetsLastTime", new Date().getTime());
                // 判断缓存中是否存在上次调用的时间; 如果有则进入安全调用, 如果不存在,直接调用;
                this.getAssetsFun().then(res => {
                    if (res && res.success) {
                        // 成功, 清除轮询 & 清除缓存数据;
                        clearInterval(that.interval);
                        localStorage.removeItem("assetsLastTime");
                    } else {
                        // 触发轮询;
                        that.intervalSafeFun()
                    }
                })
            }
        },
        // 轮询去查询资产 次数限制为9次 间隔3秒
        intervalSafeFun() {
            let that = this;
            this.interval = setInterval(function () {
                // 如果最大轮询次数大于10次 则停止;
                if (that.intervalNum >= 6) {
                    clearInterval(that.interval);
                    localStorage.removeItem("assetsLastTime");
                    that.intervalNum = 0;
                    return;
                }
                // 记录当前调用时间
                localStorage.setItem("assetsLastTime", new Date().getTime());
                // 记录循环次数
                that.intervalNum = that.intervalNum + 1;
                // 判断调用时机 & 调用总次数
                that.getAssetsSafeFun().then(function (res) {
                    if (res && res.success) {
                        // 成功, 清除轮询 & 清除缓存数据;
                        clearInterval(that.interval);
                        localStorage.removeItem("assetsLastTime");
                    } else {
                        // 触发轮询;
                    }
                })
            }, 3000)
        },

        //切换主题样式
        async changeTheme() {
            //let cssModule = await import(`@/assets/styles/template1/modules/login.styl/color.styl`);
        },
        goPage(path, param) {
            this.$router.push({path: path, query: param})
        },
        returnTop() {
            // let l = document.documentElement.scrollTop;
            let l = document.getElementById('app').scrollTop;
            let s = l / 600 * 50;  //路程/时间=s *25每隔25ms秒 动的路程
            let st = setInterval(function () {
                l -= s;
                if (l <= 0) {
                    l = 0; //当l<=0时，设置l=0
                    clearInterval(st);
                }
                document.getElementById('app').scrollTop = l;
            }, 25)
        },
         async getClick (it) {
            if(it.url == '/center/hadAgent' || it.url == '/center/applyAgent') {
                this.$store.commit('set_curMenu', '/center/applyAgent')
            }else{
                this.$store.commit('set_curMenu', '')
            }
            if(this.userInfo.type == 3 && (it.url == '/center/hadAgent' || it.url == '/center/applyAgent')) {
                let url  = window.location.protocol+"//"+ window.location.host + '/proxypc/#/homePage'
                // window.location.href = url;
                window.open(url, "_blank");
            }
        }

    },

}
</script>

<style lang="stylus">

@import '~@/assets/styles/template1/themes/mixin.styl'
.center-con
    bg_img_linear(linear01)
    position relative
    //padding-bottom: 30px;

    .center
        padding-top: 39px;
        position relative
        padding-bottom: 30px;

        .center-left
            bg_color(bg04)
            width 220px
            position: absolute;
            top: 39px;
            left: 0;
            bottom: 30px;
            height: 960px;
            border-radius: 10px;

            .left-menu
                ul
                    padding-bottom: 20px;

                    li
                        cursor: pointer;
                        text-align: center;

                        a
                            display: block;
                            height: 60px;
                            line-height: 60px;
                            font-size: 16px;
                            font_color(fc05)
                            position relative
                            text-decoration: none;
                            transition all .3s

                            &.active
                                font_color(fc01)
                                bg_color(bg43)

                            *
                                vertical-align middle

                        &:hover a
                            font_color(fc041)

                            &.active
                                font_color(fc01)

                        &:nth-child(1)
                            a.active
                                border-radius: 10px 10px 0px 0px;

                        &.line
                            position relative

                            &:after
                                content: "";
                                position: absolute;
                                width: 180px;
                                height: 1px;
                                bottom: 0px;
                                left 50%
                                transform translate(-50%)
                                bg_color(bg21)

                .down-text
                    font-size 14px
                    font_color(fc05)
                    font-weight 500
                    text-align: center;

        .center-right
            width: calc(100% - 235px);
            margin-left 235px
            min-height: 1000px;
            border-radius: 10px;


</style>
