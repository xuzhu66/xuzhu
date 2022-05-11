<template lang="pug">
    .upwd
        ul.v-l-list.pth50
            li
                .v-l-d
                    p.vlog-inp
                        input.log-inp(:maxlength="12" @keyup="handleInputZM_12" @keydown="handleInputZM_12" :type="pwdType" v-model="passWord"  placeholder="请设置新密码" autocomplete="off")
                    p.log-eye(@click="changeEye('passWord')")
                        svg-icon(:icon-class="eye ? 'eyeo' : 'eyec'" )
                .vlog-errprom
                    span(v-show="errProm01") {{ errProm01 }}
            li
                .v-l-d
                    p.vlog-inp
                        input.log-inp(:maxlength="12" @keyup="handleInputZM_12_1" @keydown="handleInputZM_12_1" :type="cpwdType" v-model="cpwd"  placeholder="请再次输入新密码" autocomplete="off")
                    p.log-eye(@click="changeEye('cpwd')")
                        svg-icon(:icon-class="ceye ? 'eyeo' : 'eyec'" )
                .vlog-errprom
                    span(v-show="errProm02") {{ errProm02 }}
        .vlog-butwrap
            button.log-but(@click="updatePwd()" :disabled="!curBut" :class="[{ 'but-cur': curBut }]")
                .butf-w
                    span.but-f 确定
                    span.but-lad-wrap
                        s-load-but(class="lb-load" v-show="!isReq" :isRepProp="isReq")
        .bgw(v-if="!isReq")
        .forg-b 如需帮助，请联系
            span.forg-lin(@click="openUrl()") 在线客服
</template>
<script>
import {mapGetters} from 'vuex';
import Rule from "@m/rule"; // 验证
import {resNum, resZM, mymd5} from '@js' // 工具类
export default {
    name: 'Register', // 注册
    computed: {
        ...mapGetters(['sourceid']),
        fPwdMobile: { // 忘记密码的手机号码
            get() {
                return this.$store.state.loginStore.fPwdMobile;
            },
            set(item) {
                return item
            }
        },
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
        }
    },
    data() {
        return {
            pwdType: "password", // 输入框状态
            cpwdType: "password", // 输入框状态
            eye: false, // 眼镜是否打开
            ceye: false, // 眼镜是否打开
            passWord: '', // 密码
            cpwd: '', // 确认密码
            errProm01: "", // 报错提示
            errProm02: "", // 报错提示
            isReq: true, // 请求是否结束
            curBut: false, // 按扭是否可点
            reg: { // 验证
                pwd: { // 密码验证
                    rem: "",
                    isPass: false
                },
                cpwd: { // 确认密码
                    rem: "",
                    isPass: false
                }
            }
        }
    },
    watch: {
        passWord: function (val) {
            this.pwdVerif()
        },
        cpwd: function (val) {
            this.cpwdVerif()
        },
    },
    mounted() {
        this.pageInit();
    },
    methods: {
        pageInit() {
            this.errProm01 = "";
            this.errProm02 = "";
        },
        pwdVerif(noCheck) {  // 密码验证
            let rr = Rule.init().rules.passWord,
                rrt = rr.reg.test(this.passWord);
            if (rrt) {
                this.reg.pwd.isPass = true;
                this.reg.pwd.rem = "";
                this.errProm01 = "";
            } else {
                this.reg.pwd.isPass = false;
                this.reg.pwd.rem = rr.desc;
                this.errProm01 = rr.desc;
            }
            this.getButVerif();
            return this.errProm;
        },
        cpwdVerif(noCheck) {  // 确认密码验证
            let rr = Rule.init().rules.passWord,
                rrt = rr.reg.test(this.cpwd);
            if (rrt) {
                this.reg.cpwd.isPass = true;
                this.reg.cpwd.rem = "";
                this.errProm02 = "";
            } else {
                this.reg.cpwd.isPass = false;
                this.reg.cpwd.rem = rr.desc;
                this.errProm02 = rr.desc;
            }
            this.getButVerif();
            return this.errProm;
        },
        getButVerif() { // 登入按扭验证
            let goBut = [];
            Object.keys(this.reg).forEach((key, val) => {
                if (this.reg[key].isPass) {
                    goBut.push(this.reg[key].isPass);
                }
            });
            if (goBut.length == Object.keys(this.reg).length) {
                if (this.passWord != this.cpwd) {
                    this.errProm = "新密码和确认密码不相同！";
                    this.butVerif = false;
                    this.curBut = false;
                } else {
                    this.curBut = true;
                }
            } else {
                this.butVerif = false;
                this.curBut = false;
            }
        },
        updatePwd() { // 更新密码
            if (!this.curBut || !this.isReq) {
                return
            }
            this.isReq = false
            let param = {
                mobile: this.fPwdMobile.replace(/\s/g, ""), // 手机号码
                newPwd: mymd5(this.passWord), // 新密码
                confirmedPwd: mymd5(this.cpwd), // 确认密码
                channelId: this.sourceid, // 渠道id
            };
            this.$store.dispatch("loginStore/updatePwd", param).then(res => {
                this.isReq = true
                if (res && res.success) {
                    this.$store.commit("loginRegStore/set_curTemp", 'login')
                }
            });
        },
        changeEye(v) { // 修改眼镜状态
            if (v == 'passWord') {
                this.eye = !this.eye
                if (this.eye) {
                    this.pwdType = "text"
                } else {
                    this.pwdType = "password"
                }
            }
            if (v == 'cpwd') {
                this.ceye = !this.ceye
                if (this.ceye) {
                    this.cpwdType = "text"
                } else {
                    this.cpwdType = "password"
                }
            }
        },
        handleInputZM_12(e) { // 过滤
            let n = 12
            resZM(e, n)
            this.passWord = resZM(e, n)
        },
        handleInputZM_12_1(e) { // 过滤
            let n = 12
            resZM(e, n)
            this.cpwd = resZM(e, n)
        },
        // openUrl() {
        //     // this.$router.push('/customer')
        //     if (this.kefuUrl) {
        //         window.open(this.kefuUrl, "_blank");
        //     } else {
        //         window.win.tips.success('客服连接未生成，请稍后');
        //     }
        // },
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
.upwd
    width 320px
    margin 0px auto

    .forg-b
        text-align center
        font-size 12px
        padding-top 100px
        font_color(fc058)

        .forg-lin
            font_color(fc060)
            line-height: 0.4rem
            margin-left 4px
            border_com(1px, solid, border33, bottom)
            cursor pointer
</style>
