<template lang="pug">
    .reg-phone
        .main-midreg
            ul.v-l-list.pth50
                li
                    .v-l-d
                        p.vlog-inp
                            input.log-inp(type="tel" @keyup="handleInputNum11" @keydown="handleInputNum11" v-model="tel" placeholder="请输入手机号码" autocomplete="off")
                        p
                            s-semdmsg(curDownNameProp="sendMsg" :isPassProp="reg.tel.isPass" :mobileProp="telPo" codeProp="0")
                    .vlog-errprom
                        span(v-show="errProm01") {{ errProm01 }}
                li
                    .v-l-d
                        p.vlog-inp
                            input.log-inp(type="number" @keyup="handleInputNum4" @keydown="handleInputNum4" v-model="vcode" placeholder="验证码" autocomplete="off")
                        p.log-close(@click="clearInpName()" v-show="vcode")
                            svg-icon(icon-class='close')
                    .vlog-errprom
                        span(v-show="errProm02") {{ errProm02 }}
            .vlog-togo(v-show="regType==3 || regType==2")
                span(@click="changeTemp('regphone')")  普通注册
            .vlog-butwrap
                button.log-but(@click="playerRegister()" :disabled="!curBut" :class="[{ 'but-cur': curBut }]")
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
import {mapGetters} from 'vuex';
import Rule from "@m/rule"; // 验证
import Agent from '@/views/template3/login/agent'; // 同意服务协议
import SendMsg from "@/plugins/template3/sendMsg/sendMsg"; // 发送验证码
import {resNum, spacesForma} from '@js' // 工具类
export default {
    name: 'Register', // 注册
    components: {
        "s-agent": Agent, // 同意服务协议
        "s-semdmsg": SendMsg, // 发送短信验证码
    },
    computed: {
        ...mapGetters(['sourceid', 'rebaid']),
        regType: { // 平台注册方式
            get() {
                return this.$store.state.homeStore.regType;
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
        telPo: function () {
            return this.tel.replace(/\s/g, "")
        }
    },
    data() {
        return {
            // regType: 2,
            eye: false, // 眼镜是否打开
            showPN: false, // 手机号码键盘是否显示
            showCV: false, // 验证码键盘是否显示
            logInpType: "password", // 输入框状态
            tel: '', // 手机号码
            vcode: '', // 验证码
            pvcode: null, // 图形验证码
            passWord: '', // 密码
            errProm01: "", // 报错提示
            errProm02: "", // 报错提示
            isReq: true, // 请求是否结束
            curBut: false, // 按扭是否可点
            reg: { // 验证
                tel: { // 手机号码验证
                    rem: "",
                    isPass: false
                },
                vcode: { // 验证码验证
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
    created() {
        this.subscribeName = this.$store.subscribe(action => {
            if (action.type === `set_showLogin`) {
                if (action.payload) {
                    this.tel = '' // 手机号码
                    this.vcode = '' // 验证码
                    this.pvcode = '' // 图形验证码
                    this.passWord = '' // 密码
                }
            }
        });
        document.onkeydown = () => {
            let key = window.event.keyCode;
            if (key === 13) {
                this.playerRegister(); //方法
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
        },
        spacesForma: spacesForma,
        showPNKeyBoard() { // 手机号码键盘是否显示
            this.showPN = true;
        },
        showCVKeyBoard() { // 验证码键盘是否显示
            this.showCV = true;
        },
        telVerif() {  // 用户名验证
            let mobile = this.tel ? this.tel.replace(/\s/g, "") : '';
            if (!mobile) {
                this.tel = "";
            } else {
                this.tel = this.spacesForma(mobile);
            }

            let rr = Rule.init().rules.tel,
                rrt = rr.reg.test(mobile);
            if (rrt) {
                this.reg.tel.isPass = true;
                this.reg.tel.rem = "";
                this.errProm01 = "";
            } else {
                this.reg.tel.isPass = false;
                this.reg.tel.rem = rr.desc;
                this.errProm01 = rr.desc;
            }
            this.getButVerif();
            return this.errProm01;
        },
        vcodeVerif() {  // 验证码验证
            let rr = Rule.init().rules.vcode,
                rrt = rr.reg.test(this.vcode);
            if (rrt) {
                this.reg.vcode.isPass = true;
                this.reg.vcode.rem = "";
                this.errProm02 = "";
            } else {
                this.reg.vcode.isPass = false;
                this.reg.vcode.rem = rr.desc;
                this.errProm02 = rr.desc;
            }
            this.getButVerif();
            return this.errProm02;
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
        playerRegister() { // 注册
            if (!this.curBut || !this.isReq) {
                return
            }
            this.isReq = false
            let username = this.tel.replace(/\s+/g, "")
            let param = {
                regType: "4", // 1表示用户账号注册，2表示手机号注册
                mobile: username, // 手机号码
                mobileVerifyCode: this.vcode, // 手机验证码
                channelId: this.sourceid, // 渠道id
                deviceType: "2", // 注册终端 注册终端： 1、H5 2、PC 3、android 4、ios
                rebateAgentId: this.rebaid, // 洗码代理对应的会员id
                advicePage: "0" // 0表示非推广页请求，1表示推广页请求
            };
            this.$store.dispatch("registerStore/playerRegister", param).then(res => {
                this.isReq = true
                let code = res.data.code
                if (res && res.success) {
                    this.isReq = false
                    this.login(code)
                }
            });
        },
        login(code) { // 登录
            let param = {
                grant_type: "pin_code", // 授权码
                code: code, // // 手机验证码
                scope: "all", // 授权范围
                jumpWelcome: true, //跳转welcom欢迎页面
            };
            this.$store.dispatch("login", param).then(res => {
            });
        },
        sendVerifcode() { // 发送验证码

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
            this.vcode = "" // 清空验证码
            this.vcodeVerif()
        },
        changeTemp(t) {
            let tt = t
            if (this.regType == 2) {
                tt = 'regphone'
            }
            this.$store.commit("registerStore/set_curTemp", tt)
        },
        changeLoginTemp(t) { // 密码登录
            this.$store.commit("loginRegStore/set_curTemp", t)
        },
        // handleInputNum11(e) { // 通过正则过滤小数点后两位
        //   let n = 13
        //   resNum(e,n)
        //   this.tel = resNum(e,n)
        //   this.telVerif();
        // },
        handleInputNum11(e) { // 通过正则过滤小数点后两位
            let n = 13
            resNum(e, n)
            this.tel = resNum(e, n)
            this.telVerif();
        },
        handleInputNum4(e) { // 验证码过滤
            let n = 4
            resNum(e, n)
            this.vcode = resNum(e, n)
            this.vcodeVerif();
        }
    }
}
</script>
<style lang="stylus" scoped>
@import '~@styl/template3/modules/login.styl'
@import '~@styl/template3/themes/mixin.styl'
.reg-phone
    width 320px
    margin 0px auto

    .rp-list
        li
            display flex
            justify-content center
            padding 2px 0

            .reg-numinp
                width 150px
                height 20px
                bg_color(bg2)

    .reg-log
        text-align center
        cursor pointer
        font-size 14px
        font_color(fc3)

        .reg-cu
            font_color(fc4)

.main-midreg
    height calc(100% - 136px)
    min-height 350px
    overflow auto
</style>
