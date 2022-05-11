<template lang="pug">
    .login
        ul.v-l-list.pth50
            li
                .v-l-d
                    p.vlog-inp
                        input.log-inp(type="tel" @keyup="handleInputNum11" @keydown="handleInputNum11" v-model="tel" placeholder="输入手机号码" autocomplete="off")
                    p
                        s-semdmsg(curDownNameProp="sendMsg" :isPassProp="reg.tel.isPass" :mobileProp="telPo" codeProp="1")
                .vlog-errprom
                    span(v-show="errProm01") {{ errProm01 }}
            li
                .v-l-d
                    p.vlog-inp
                        input.log-inp(type="number" @keyup="handleInputNum4" @keydown="handleInputNum4" v-model="vcode" placeholder="输入短信验证码" autocomplete="off")
                    p.log-close(@click="clearInpName()" v-show="vcode")
                        svg-icon(icon-class='close')
                .vlog-errprom
                    span(v-show="errProm02") {{ errProm02 }}
        .vlog-togo
            span(@click="changeTemp('login')")  密码登录
        .vlog-butwrap
            button.log-but(@click="login()" :disabled="!curBut" :class="[{ 'but-cur': curBut }]")
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
import {mapGetters, mapState} from 'vuex';
import loginStore from "@/store/comstore/user/loginStore"; // 登录状态库
import loginRegStore from "@/store/comstore/user/loginRegStore"; // 登录注册
import Rule from "@m/rule"; // 验证
import SendMsg from "@/plugins/template2/sendMsg/sendMsg"; // 发送验证码
import {resNum, spacesForma} from '@js' // 工具类
import TencentCode from "@m/tencentCode"; // 工具类
export default {
    name: 'Loging', // 登录
    components: {
        "s-semdmsg": SendMsg, // 发送短信验证码
    },
    data() {
        return {
            isReq: true, // 请求是否结束
            tel: '', // 手机号码
            vcode: '', // 密码
            errProm01: "", // 报错提示
            errProm02: "", // 报错提示
            curBut: false, // 按扭是否可点
            reg: { // 验证
                tel: { // 用户名验证
                    rem: "",
                    isPass: false
                },
                vcode: { // 密码验证
                    rem: "",
                    isPass: false
                }
            }
        }
    },
    computed: {
        ...mapGetters(['sourceid', 'rebaid']),
        ...mapState({
            smsappid: state => state.homeStore.smsappid, // 拖拽验证码ID
            telephoneLogin: state => state.telephoneLogin, // 登录需要验证的电话号码
        }),
        telPo: function () {
            return this.tel.replace(/\s/g, "")
        }
    },
    created() {
        if (!this.$store.state["loginStore"]) { // 登录状态库
            loginStore.install(this);
        }
        if (!this.$store.state["loginRegStore"]) { // 登录注册主状态
            loginRegStore.install(this);
        }
        this.subscribeName = this.$store.subscribe(action => {
            if (action.type === `set_showLogin`) {
                if (action.payload) {
                    this.tel = '' // 手机号码
                    this.vcode = '' // 密码
                }
            }
        });
        document.onkeydown = () => {
            let key = window.event.keyCode;
            if (key === 13) {
                this.login(); //方法
            }
        };
    },
    mounted() {
        this.pageInit();
        this.$nextTick(() => {
            TencentCode.init().initTcCodeJs();
        });
    },
    methods: {
        pageInit() {
            this.errProm01 = "";
            this.errProm02 = "";
            // 设定需要登录验证的手机号码
            if(this.telephoneLogin){
                this.tel = this.telephoneLogin;
                // 手机号码校验
                this.telVerif()
            }
        },
        spacesForma: spacesForma,
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
        },
        getButVerif() { // 登入按扭验证
            let param = {
                reg: this.reg, // 需要验证的对象
                acheckd: true // 是否需要检测用户协议
            };
            this.$store.dispatch("loginRegStore/getButVerific", param).then((res) => {
                this.butVerif = res.pasVerif;
                this.curBut = res.pasVerif;
            })
        },
        login(p) { // 登录
            if (!this.curBut || !this.isReq) {
                return
            }
            this.isReq = false
            let param = {
                grant_type: "sms_code", // 授权码
                mobile: this.tel.replace(/\s+/g, ""), // 用户名
                mobileVerifyCode: this.vcode, // 验证码
                scope: "all", // 授权范围
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
                    // 0表示不需要图形验证码，成功; 1表示需要图形验证码,2 需要图形验证码,发送短信成功
                } else if (res.data && res.data.picCodeCheck == 1) {
                    this.getPicVcode();
                } else if (res.data && res.data.picCodeCheck == 2) {
                    // 失败
                }
            });
        },
        changeTemp(t) { // 密码登录
            this.$store.commit("loginRegStore/set_curTemp", t)
        },
        clearInpName() { // 清空输入框
            this.vcode = "" // 清空验证码
            this.vcodeVerif();
        },
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
        },
        getPicVcode() {
            const appId = this.smsappid; // 防水墙APP_ID
            let capuche = new TencentCaptcha(appId,
                (r) => {
                    let parm = {
                        ticket: r.ticket,
                        randstr: r.randstr
                    }
                    this.login(parm)
                }
            );
            capuche.show();
        },
    }
}
</script>
<style lang="stylus" scoped>
@import '~@styl/template2/modules/login.styl'
@import '~@styl/template2/themes/mixin.styl'
.login
    width 320px
    margin 0px auto

</style>
