<template lang="pug">
    .login
        ul.v-l-list.pth50
            li
                .v-l-d
                    p.vlog-inp
                        input.log-inp(:maxlength="12" @keyup="handleInputZM" @keydown="handleInputZM" v-model="userName" placeholder="请输入用户账户或手机号码" autocomplete="off")
                    p.log-close(@click="clearInpName()" v-show="userName")
                        svg-icon(icon-class='close')
                .vlog-errprom
                    span(v-show="errProm01") {{ errProm01 }}
            li
                .v-l-d
                    p.vlog-inp
                        input.log-inp(:maxlength="12" @keyup="handleInputZM_12" @keydown="handleInputZM_12" :type="logInpType" v-model="passWord"  placeholder="登录密码" autocomplete="off")
                    p.log-eye(@click="changeEye" v-show="passWord")
                        svg-icon(:icon-class="eye ? 'eyeo' : 'eyec'" )
                .vlog-errprom
                    span(v-show="errProm02") {{ errProm02 }}
        .vlog-togo
            span(@click="changeTemp('loginVerif')")  验证码登录
        .vlog-butwrap
            button.log-but(@click="getlogin()" :disabled="!curBut" :class="[{ 'but-cur': curBut }]")
                .butf-w
                    span.but-f 登录
                    span.but-lad-wrap
                        s-load-but(class="lb-load" v-show="!isReq" :isRepProp="isReq")
        .bgw(v-if="!isReq")
        div.vlg-qmeun
            span(@click="changeTemp('forgetPwd')") 忘记密码
            span(@click="changeTemp('reg')") 快速注册
</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex';
import TencentCode from '@m/tencentCode';
import SendMsgStore from '@/store/comstore/modules/sendMsgStore';
import loginStore from "@/store/comstore/user/loginStore"; // 登录状态库
import Rule from "@m/rule"; // 验证
import {resZM, mymd5} from '@js' // 工具类
export default {
    name: 'Loging', // 登录
    components: {},
    computed: {
        ...mapGetters(['sourceid', 'rebaid']),
        ...mapState({
            smsappid: state => state.homeStore.smsappid, // 拖拽验证码ID
        }),
        enableImgCode: { // 是否调用图形验证码
            get() {
                return this.$store.state.enableImgCode;
            },
            set(item) {
                return item
            }
        },
    },
    data() {
        return {
            isReq: true, // 请求是否结束
            subscribeName: null,
            eye: false, // 眼镜是否打开
            logInpType: "password", // 输入框状态
            userName: '', // 用户名
            passWord: '', // 密码
            errProm01: "", // 报错提示
            errProm02: "", // 报错提示
            curBut: false, // 按扭是否可点
            reg: { // 验证
                name: { // 用户名验证
                    rem: "",
                    isPass: false
                },
                pwd: { // 密码验证
                    rem: "",
                    isPass: false
                }
            }
        }
    },
    watch: {
        userName: function (val) {
            this.userNameVerif()
        },
        passWord: function (val) {
            this.pwdVerif()
        },
    },
    created() {
        if (!this.$store.state["loginStore"]) { // 登录状态库
            loginStore.install(this);
        }
        if (!this.$store.state["sendMsgStore"]) {
            SendMsgStore.install(this)
        }
        this.subscribeName = this.$store.subscribe(action => {
            if (action.type === `set_showLogin`) {
                if (action.payload) {
                    this.userName = '' // 用户名
                    this.passWord = '' // 密码
                }
            }
        });
        document.onkeydown = () => {
            let key = window.event.keyCode;
            if (key === 13) {
                this.getlogin(); //方法
            }
        };
    },
    mounted() {
        this.$nextTick(() => {
            //if(this.enableImgCode) {
            TencentCode.init().initTcCodeJs();
            //}
        });
    },
    methods: {
        ...mapActions({
            // 查询资金总览--安全
            getAssetsSafeFun(dispatch, param) {
                return dispatch(`centerStore/getAssetsSafeAction`, param);
            },
        }),
        userNameVerif() {  // noCheck是否需要验证按扭 用户名验证
            let rr = Rule.init().rules.userName,
                rrt = rr.reg.test(this.userName);
            if (rrt) {
                this.reg.name.isPass = true;
                this.reg.name.rem = "";
                this.errProm01 = "";
            } else {
                this.reg.name.isPass = false;
                this.reg.name.rem = rr.desc;
                this.errProm01 = rr.desc;
            }
            this.getButVerif();
            return this.errProm01
        },
        pwdVerif() {  // 密码验证
            let rr = Rule.init().rules.passWordOld,
                rrt = rr.reg.test(this.passWord);
            if (rrt) {
                this.reg.pwd.isPass = true;
                this.reg.pwd.rem = "";
                this.errProm02 = "";
            } else {
                this.reg.pwd.isPass = false;
                this.reg.pwd.rem = rr.desc;
                this.errProm02 = rr.desc;
            }
            this.getButVerif();
            return this.errProm02
        },
        getButVerif() { // 登入按扭验证
            let param = {
                reg: this.reg // 需要验证的对象
            };
            this.$store.dispatch("loginRegStore/getButVerific", param).then((res) => {
                this.butVerif = res.pasVerif;
                this.curBut = res.pasVerif;
            })
        },
        getPicVcode() {
            const appId = this.smsappid; // 防水墙APP_ID
            var capuche1 = new TencentCaptcha(appId,
                (r) => {
                    let parm = {
                        ticket: r.ticket,
                        randstr: r.randstr
                    }
                    this.login(parm)
                }
            );
            capuche1.show();
        },
        getlogin() { // 登录
            if (!this.curBut || !this.isReq) {
                return
            }
            this.isReq = false
            if (this.enableImgCode) {
                this.getPicVcode()
            } else {
                this.login()
            }
        },
        login(p) { // 登录
            let param = {
                grant_type: "password", // 授权码
                username: this.userName.replace(/\s+/g, ""),
                password: mymd5(this.passWord), //
                scope: "all", // 范围
                channelId: this.sourceid, // 渠道id
                rebateAgentId: this.rebaid // 洗码代理对应的会员id
            };
            Object.assign(param, p)
            if (p) {
                if (!p.randstr || p.randstr == '') {
                    this.isReq = true
                    return
                }
            }
            this.$store.dispatch("login", param).then(res => {
                this.isReq = true;
                // 0: 不需要票据 登录失败 1: 需要票据 但无票据传给后台,登录失败, 需要开启验证码 2: 有票据传给后台, 但登录失败,
                if (res.data && res.data.picCodeCheck == 0) {
                    // 成功
                } else if (res.data && res.data.picCodeCheck == 1) {
                    this.getPicVcode();
                } else if (res.data && res.data.picCodeCheck == 2) {
                    // 成功
                }
            });
        },
        changeEye() { // 修改眼镜状态
            this.eye = !this.eye
            if (this.eye) {
                this.logInpType = "text"
            } else {
                this.logInpType = "password"
            }
        },
        clearInpName() { // 清空输入框
            this.userName = "" // 清空用户名
            this.userNameVerif();
        },
        changeTemp(t) {
            let u = t
            this.$store.commit("loginRegStore/set_curTemp", u)
        },
        handleInputZM(e) { // 过滤
            let n = 12
            resZM(e, n)
            this.userName = resZM(e, n)
        },
        handleInputZM_12(e) { // 过滤
            let n = 12
            resZM(e, n)
            this.passWord = resZM(e, n)
        },
        // 获取资金总览
        getAssets() {
            let that = this;
            // 获取最后调用时间
            let lastTime = localStorage.getItem("assetsLastTime");
            // 获取当前时间
            let currtTime = new Date().getTime();
            // 如果距离上次请求时间在3秒内,则走安全方法;
            if (lastTime && (currtTime - lastTime <= 3 * 1000)) {
                // 如果是刷新或者个人中心先加载则延迟加载调用
                setTimeout(that.getAssetsSafeFun(), 1500);
            } else {
                // 记录当前调用时间
                localStorage.setItem("assetsLastTime", new Date().getTime());
                // 判断缓存中是否存在上次调用的时间; 如果有则进入安全调用, 如果不存在,直接调用;
                this.getAssetsSafeFun().then(res => {
                    if (res && res.success) {
                        // 成功, 清除轮询 & 清除缓存数据;
                        localStorage.removeItem("assetsLastTime");
                    }
                })
            }
        },
    }
}
</script>
<style lang="stylus" scoped>
@import '~@styl/template3/modules/login.styl'
@import '~@styl/template3/themes/mixin.styl'
.login
    width 320px
    margin 0px auto
</style>
