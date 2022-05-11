<template lang="pug">
    .reg-acount
        .main-midreg
            ul.v-l-list
                li
                    .v-l-d
                        p.vlog-inp
                            input.log-inp(:maxlength="8" @keyup="handleInputZM" @keydown="handleInputZM" v-model="userName"  placeholder="请输入用户账户" autocomplete="off")
                        p.log-close(@click="clearInpName()" v-show="userName")
                            svg-icon(icon-class='close')
                    .vlog-errprom
                        span(v-show="errProm01") {{ errProm01 }}
                li
                    .v-l-d
                        p.vlog-inp
                            input.log-inp(:maxlength="12" :type="logInpType"  @keyup="handleInputZM_12" @keydown="handleInputZM_12" v-model="passWord"  placeholder="请设置登录密码" autocomplete="off")
                        p.log-eye(@click="changeEye" v-show="passWord")
                            svg-icon(:icon-class="eye ? 'eyeo' : 'eyec'" )
                    .vlog-errprom
                        span(v-show="errProm02") {{ errProm02 }}
            .vlog-butwrap
                button.log-but(@click="getReg()" :disabled="!curBut" :class="[{ 'but-cur': curBut }]")
                    .butf-w
                        span.but-f 注册
                        span.but-lad-wrap
                            s-load-but(class="lb-load" v-show="!isReq" :isRepProp="isReq")
                p.reg-logfont
                    s-agent(@getAgentChecked="agentVerif")
                    .bgw(v-if="!isReq")
        .reg-log(@click="changeLoginTemp('login')") 已有账号，点击
            span.reg-cu 立即登录
</template>
<script>
import {mapGetters, mapState} from 'vuex';
import TencentCode from '@m/tencentCode';
import SendMsgStore from '@/store/comstore/modules/sendMsgStore';
import Rule from "@m/rule"; // 验证
import Agent from '@/views/template3/login/agent'; // 同意服务协议
import {resZM, mymd5} from '@js' // 工具类
export default {
    name: 'Register', // 注册
    components: {
        "s-agent": Agent, // 同意服务协议
    },
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
        showAgent: { // 用户服务协议是否显示
            get() {
                return this.$store.state.loginRegStore.showAgent;
            },
            set(item) {
                return item
            }
        },
        agentChecked: { // 用户协义是否选中
            get() {
                return this.$store.state.loginRegStore.agentChecked;
            },
            set(item) {
                return item
            }
        },
    },
    data() {
        return {
            eye: false, // 眼镜是否打开
            isReq: true, // 请求是否结束
            logInpType: "password", // 输入框状态
            userName: '', // 用户名
            passWord: '', // 密码
            errProm01: "", // 报错提示
            errProm02: "", // 报错提示
            // errProm03: "", // 报错提示
            curBut: false, // 按扭是否可点
            reg: { // 验证
                name: { // 用户名验证
                    rem: "",
                    isPass: false
                },
                pwd: { // 密码验证
                    rem: "",
                    isPass: false
                },
                reg: { // 用户协议验证
                    rem: "",
                    isPass: true
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
                this.getReg(); //方法
            }
        };
    },
    mounted() {
        this.pageInit();
    },
    methods: {
        pageInit() {
            this.errProm01 = "";
            this.errProm02 = "";
            this.$nextTick(() => {
                TencentCode.init().initTcCodeJs();
            })
        },
        userNameVerif(noCheck) {  // noCheck是否需要验证按扭 用户名验证
            let rr = Rule.init().rules.regUserName,
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
        pwdVerif(noCheck) {  // 密码验证
            let rr = Rule.init().rules.passWord,
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
        agentVerif(v) {  // 验证码
            let rrdesc = "请阅读并同意《用户服务协议》";
            if (v) {
                this.reg.reg.isPass = true;
                this.reg.reg.rem = "";
            } else {
                this.reg.reg.isPass = false;
                this.reg.reg.rem = rrdesc;
            }
            this.getButVerif();
        },
        getButVerif() { // 登入按扭验证
            let param = {
                reg: this.reg
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
                    this.playerRegister(parm)
                }
            );
            capuche1.show();
        },
        getReg() { // 登录
            if (!this.curBut || !this.isReq) {
                return
            }
            this.isReq = false
            if (this.enableImgCode) {
                this.getPicVcode()
            } else {
                this.playerRegister()
            }
        },
        playerRegister(p) { // 注册
            let username = this.userName.replace(/\s+/g, ""),
                password = this.passWord
            let param = {
                username: username,
                password: mymd5(password),
                regType: "1", // 1表示用户账号注册，2表示手机号注册
                mobile: "", // 手机号码
                mobileVerifyCode: "", // 手机验证码
                channelId: this.sourceid, // 渠道id
                deviceType: "2", // 注册终端 注册终端： 1、H5 2、PC 3、android 4、ios
                rebateAgentId: this.rebaid, // 洗码代理对应的会员id
                advicePage: "0"  //  0表示非推广页请求，1表示推广页请求
            };
            Object.assign(param, p)
            if (p) {
                if (!p.randstr || p.randstr == '') {
                    this.isReq = true
                    return
                }
            }
            this.$store.dispatch("registerStore/playerRegister", param).then(res => {
                this.isReq = true
                if (res && res.success) {
                    this.isReq = false
                    // 发送成功
                    this.login(res.data.code)
                }
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
        login(code) { // 登录
            let param = {
                // grant_type: "password", // 授权码
                // username: u, // 用户名
                // password: mymd5(p),
                // scope: "all", // 授权范围
                grant_type: "pin_code", // 授权码
                code: code, // // 授权码验证
                scope: "all", // 授权范围
                jumpWelcome: true, //跳转welcom欢迎页面
            };
            this.$store.dispatch("login", param).then(res => {
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
            this.userNameVerif()
        },
        changeTemp(t) {
            this.$store.commit("registerStore/set_curTemp", t)
        },
        changeLoginTemp(t) { // 密码登录
            this.$store.commit("loginRegStore/set_curTemp", t)
        },
        handleInputZM(e) { // 验证码过滤
            let n = 8
            resZM(e, n)
            this.userName = resZM(e, n)
        },
        handleInputZM_12(e) { // 验证码过滤
            let n = 12
            resZM(e, n)
            this.passWord = resZM(e, n)
        },
    }
}
</script>
<style lang="stylus" scoped>
@import '~@styl/template3/modules/login.styl'
@import '~@styl/template3/themes/mixin.styl'
.reg-acount
    width 320px
    margin 0px auto
    height 100%

    .ra-list
        li
            display flex
            justify-content center

    .reg-log
        text-align center
        cursor pointer
        font-size 14px
        font_color(fc3)

        .reg-cu
            font_color(fc4)

.main-midreg
    height calc(100% - 136px)
    min-height 300px
    overflow auto
</style>
