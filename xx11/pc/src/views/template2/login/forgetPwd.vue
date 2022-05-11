<template lang="pug">
    .forgetpwd
        ul.v-l-list.pth50
            //- li
            //-   .v-l-d
            //-     p.vlog-inp
            //-       input.log-inp(:maxlength="11" @keyup="handleInputZM" @keydown="handleInputZM" v-model="userName" placeholder="用户账号" autocomplete="off")
            //-     p.log-close(@click="clearInpName()" v-show="userName")
            //-       svg-icon(icon-class='close')
            //-   .vlog-errprom
            //-     span {{ errProm01 }}
            li
                .v-l-d
                    p.vlog-inp
                        input.log-inp(type="tel" @keyup="handleInputNum11" @keydown="handleInputNum11" v-model="tel" placeholder="输入手机号码（必填）" autocomplete="off")
                    p
                        s-semdmsg(curDownNameProp="sendMsg" :isPassProp="reg.tel.isPass" :usernameProp="userName" :mobileProp="telPo" codeProp="2")
                .vlog-errprom
                    span {{ errProm02 }}
            li
                .v-l-d
                    p
                        input.log-inp(type="number" @keyup="handleInputNum4" @keydown="handleInputNum4" v-model="vcode" placeholder="验证码（必填）" autocomplete="off")
                    p.log-close(@click="clearInpVcode()" v-show="vcode")
                        svg-icon(icon-class='close')
                .vlog-errprom
                    span(v-show="errProm03") {{ errProm03 }}
        .vlog-butwrap.mt10
            button.log-but(@click="checkAcount()" :disabled="!curBut" :class="[{ 'but-cur': curBut }]")
                .butf-w
                    span.but-f 下一步
                    span.but-lad-wrap
                        s-load-but(class="lb-load" v-show="!isReq" :isRepProp="isReq")
        div.vlg-qmeun
            span(@click="changeTemp('reg')") 快速注册
            span(@click="changeTemp('login')") 立即登录

        .forg-b 如需帮助，请联系
            span.forg-lin(@click="openUrl()") 在线客服
</template>

<script>
import Rule from "@m/rule"; // 验证
import SendMsg from "@/plugins/template2/sendMsg/sendMsg"; // 发送验证码
import {resNum, resZM, spacesForma, mymd5} from '@js' // 工具类
export default {
    name: 'Register', // 注册
    components: {
        "s-semdmsg": SendMsg, // 发送短信验证码
    },
    computed: {
        kefuUrl: { // 客服URL
            get() {
                return this.$store.state.homeStore.kefuUrl;
            },
            set(item) {
                return item
            }
        },
        isGetKefu: { // 客服是否已请求
            get() {
                return this.$store.state.homeStore.isGetKefu;
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
            showPN: false, // 手机号码键盘是否显示
            showCV: false, // 验证码键盘是否显示
            tel: '', // 手机号码
            vcode: '', // 验证码
            pvcode: null, // 图形验证码
            userName: '', // 用户密
            errProm01: "", // 报错提示
            errProm02: "", // 报错提示
            errProm03: "", // 报错提示
            isReq: true, // 请求是否结束
            curBut: false, // 按扭是否可点
            reg: { // 验证
                // name: { // 手机号码验证
                //   rem: "",
                //   isPass: false
                // },
                tel: { // 密码验证
                    rem: "",
                    isPass: false
                },
                vcode: { // 验证码验证
                    rem: "",
                    isPass: false
                }
            }
        }
    },
    mounted() {
        this.pageInit();
    },
    methods: {
        pageInit() {
            this.errProm01 = ""
            this.errProm02 = ""
            this.errProm03 = ""
        },
        spacesForma: spacesForma,
        showPNKeyBoard() { // 手机号码键盘是否显示
            this.showPN = true;
        },
        showCVKeyBoard() { // 验证码键盘是否显示
            this.showCV = true;
        },
        // userNameVerif() {  // 用户名验证
        //   let rr = Rule.init().rules.regUserName,
        //     rrt = rr.reg.test(this.userName);
        //   if (rrt) {
        //     this.reg.name.isPass = true;
        //     this.reg.name.rem = "";
        //     this.errProm01 = "";
        //   } else {
        //     this.reg.name.isPass = false;
        //     this.reg.name.rem = rr.desc;
        //     this.errProm01 = rr.desc;
        //   }
        //   this.getButVerif();
        //   return this.errProm01
        // },
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
                this.errProm02 = "";
            } else {
                this.reg.tel.isPass = false;
                this.reg.tel.rem = rr.desc;
                this.errProm02 = rr.desc;
            }
            this.getButVerif();
            return this.errProm;
        },
        vcodeVerif() {  // 验证码验证
            let rr = Rule.init().rules.vcode,
                rrt = rr.reg.test(this.vcode);
            if (rrt) {
                this.reg.vcode.isPass = true;
                this.reg.vcode.rem = "";
                this.errProm03 = "";
            } else {
                this.reg.vcode.isPass = false;
                this.reg.vcode.rem = rr.desc;
                this.errProm03 = rr.desc;
            }
            this.getButVerif();
            return this.errProm;
        },
        getButVerif() { // 登入按扭验证
            let param = {
                reg: this.reg,
                username: this.userName // 玩家账号
            };
            this.$store.dispatch("loginRegStore/getButVerific", param).then((res) => {
                this.butVerif = res.pasVerif;
                this.curBut = res.pasVerif;
            })
        },
        checkAcount() { // 检查玩家账号，
            if (!this.curBut || !this.isReq) {
                return
            }
            this.isReq = false
            let param = {
                username: this.userName.replace(/\s/g, ""), // 玩家账号
                mobile: this.tel.replace(/\s+/g, ""), // 玩家手机号
                mobileVerifyCode: this.vcode // 验证码
            };
            this.$store.dispatch("loginStore/checkAcount", param).then(res => {
                this.isReq = true
                if (res && res.success) {
                    this.changeTemp('updatePwd')
                    this.$store.commit('loginStore/set_fPwdMobile', this.tel)
                }
            });
        },
        clearInpName() { // 清空用户名
            this.userName = ""
            // this.userNameVerif()
        },
        clearInpVcode() { // 清空验证码
            this.vcode = ""
            this.vcodeVerif()
        },
        changeTemp(t) {
            this.$store.commit("loginRegStore/set_curTemp", t)
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
        handleInputZM(e) { // 验证码过滤
            let n = 11
            resZM(e, n)
            this.userName = resZM(e, n)
        },
        // openUrl() {
        //     // this.$router.push('/customer')
        //     if (this.kefuUrl) {
        //         window.open(this.kefuUrl, "_blank");
        //     } else {
        //         window.win.tips.success('客服连接未生成，请稍后');
        //     }
        // }
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
    }
}
</script>
<style lang="stylus" scoped>
@import '~@styl/template2/modules/login.styl'
@import '~@styl/template2/themes/mixin.styl'
.forgetpwd
    width 320px
    margin 0px auto
    height calc(100% - 200px)

    .forg-b
        text-align center
        font-size 12px
        padding-top 66px
        font_color(fc058)

        .forg-lin
            font_color(fc060)
            line-height: 0.4rem
            margin-left 4px
            border_com(1px, solid, border33, bottom)
            cursor pointer
</style>
