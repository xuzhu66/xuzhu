<template lang="pug">
    .common-dialog-con
        comDialog(:show-footer='false',:show="showDialog",@on-cancel="closeDialog")
            div(slot="header") 设置取款密码
            .dialog-con(slot="default")
                //.login-con(v-if="curttTab == 1")
                    .info
                        .tip *为了您的账号安全，请设置登录密码！
                        .info-con
                            .form
                                .form-item(v-if="userInfo.loginPwdSetStatus == 1")
                                    .lable 原密码:
                                    input(:type="inputType1",maxlength=12,placeholder='请输入原密码',v-model="oldPwd",@keyup="oldPwdVerif",@keydown="oldPwdVerif" )
                                    .kefu(@click="openKefu") 忘记密码？联系客服
                                    p.log-eye(@click="changeEye('inputType1','eye1')")
                                        svg-icon(:icon-class="eye1 ? 'eyeo' : 'eyec'" )
                                .form-item
                                    .lable 新密码:
                                    input(:type="inputType2",maxlength=12,placeholder='请输入新密码',v-model="newPwd",@keyup="newPwdVerif",@keydown="newPwdVerif" )
                                    p.log-eye(@click="changeEye('inputType2','eye2')")
                                        svg-icon(:icon-class="eye2 ? 'eyeo' : 'eyec'" )
                                .form-item
                                    .lable 确认密码:
                                    input(:type="inputType3",maxlength=12,placeholder='请再次输入登录密码',v-model="confirmedPwd" ,@keyup="confirmedPwdVerif",@keydown="confirmedPwdVerif")
                                    p.log-eye(@click="changeEye('inputType3','eye3')")
                                        svg-icon(:icon-class="eye3 ? 'eyeo' : 'eyec'" )
                                .form-item
                                    .lable 手机号码:
                                    input(maxlength=11,placeholder='请输入手机号码',v-model='mobile' :readonly="userInfo.mobile?true:false")
                                .form-item
                                    .lable 验 证 码:
                                    input(maxlength=4,v-model="mobileCode",placeholder='验证码' )
                                    sendMsg.send-msg(curDownNameProp="bank" :isPassProp="mobileFlag" :mobileProp="mobile" :codeProp="telType"  @getSmsg="sendMsgSuccess")

                            .common-btn(@click="saveLoginPwdBefore",:class="submitFlag?'ok':''") 确定

                //(v-if="curttTab == 2")
                .draw-con
                    .info
                        //.tip *为了您的账号安全，请设置提款密码！
                        .info-con
                            .form
                                .form-item(v-if="userInfo.withdrawSetStatus == 1")
                                    .lable 原密码:
                                    input(:type="inputType4",maxlength=4,placeholder='请输入原密码',v-model="oldWithdrawPwd",@keyup="oldWithdrawPwdVerif",@keydown="oldWithdrawPwdVerif" )
                                    //.kefu(@click="openKefu") 忘记密码？联系客服
                                    p.log-eye(@click="changeEye('inputType4','eye4')")
                                        svg-icon(:icon-class="eye4 ? 'eyeo' : 'eyec'" )
                                .form-item
                                    .lable 新密码:
                                    input(:type="inputType5",maxlength=4,placeholder='请输入新密码',v-model="newWithdrawPwd" ,@keyup="newWithdrawPwdVerif",@keydown="newWithdrawPwdVerif")
                                    p.log-eye(@click="changeEye('inputType5','eye5')")
                                        svg-icon(:icon-class="eye5 ? 'eyeo' : 'eyec'" )
                                .form-item
                                    .lable 确认密码:
                                    input(:type="inputType6",maxlength=4,placeholder='请再次输入提款密码',v-model="confirmedPwd2",@keyup="confirmedPwd2Verif",@keydown="confirmedPwd2Verif" )
                                    p.log-eye(@click="changeEye('inputType6','eye6')")
                                        svg-icon(:icon-class="eye6 ? 'eyeo' : 'eyec'" )
                                .form-item
                                    .lable 手机号码:
                                    input(maxlength=11,placeholder='请输入手机号码',v-model='mobile',:readonly="userInfo.mobile?true:false")
                                .form-item
                                    .lable 验 证 码:
                                    input(maxlength=4,v-model="mobileCode",placeholder='验证码' )
                                    sendMsg.send-msg(curDownNameProp="bank" :isPassProp="mobileFlag" :mobileProp="mobile" :codeProp="telType"  @getSmsg="sendMsgSuccess")
                            .service-con
                                span 如需帮助?
                                span.kefu(@click="openService") 联系客服
                            .common-btn(@click="saveDrawPwdBefore",:class="submitFlag2?'ok':'hidden'") 确定

            div(slot="footer")

</template>

<script>
import {mapGetters, mapState, mapMutations, mapActions} from 'vuex';
import thatStore from "@/store/comstore/center/base/passWordStore"; // 获取模板
import store from '@/store/Store';
import assetslist from "./assetsList";
import {mymd5} from '@m/utils' // 工具类
import Rule from "@m/rule"; // 验证
import comTelCode from "@pon/template1/comTelCode";
import sendMsg from "@/plugins/template1/sendMsg/sendMsg"; // 发送验证码
import comDialog from "@pon/template1/comDialog"
export default {
    name: "passWord",
    components: {
        "assets": assetslist,
        comTelCode, // 手机号码校验
        sendMsg,
        comDialog
    },
    props:{
        showDialog:{
            type:Boolean,
            default:false
        },
    },
    data() {
        return {
            isReqFlag: true, // 请求是否结束
            curttTab: 1,
            currtTemplateIndex: '',

            oldPwd: '',
            newPwd: "",
            confirmedPwd: "",
            oldPwdFlag: '',
            newPwdFlag: "",
            confirmedPwdFlag: "",
            opFlag: "",//1表示无登陆密码时的修改，0表示有登陆密码时的修改
            oldWithdrawPwd: "",
            newWithdrawPwd: "",
            confirmedPwd2: "",
            oldWithdrawPwdFlag: "",
            newWithdrawPwdFlag: "",
            confirmedPwd2Flag: "",

            // 校验规则
            reg: {
                oldPwd: {
                    msg: "",
                    isPass: false
                },
                newPwd: {
                    msg: "",
                    isPass: false
                },
                confirmedPwd: {
                    msg: "",
                    isPass: false
                }
            },
            reg2: {
                oldWithdrawPwd: {
                    msg: "",
                    isPass: false
                },
                newWithdrawPwd: {
                    msg: "",
                    isPass: false
                },
                confirmedPwd2: {
                    msg: "",
                    isPass: false
                },
            },
            //校验错误提示信息
            errorMsg: "",
            subFlag: false, // 是否校验通过

            //校验错误提示信息
            errorMsg2: "",
            subFlag2: false, // 是否校验通过

            eye1: false,
            eye2: false,
            eye3: false,
            eye4: false,
            eye5: false,
            eye6: false,

            inputType1: 'password', // text password
            inputType2: 'password', // text password
            inputType3: 'password', // text password
            inputType4: 'password', // text password
            inputType5: 'password', // text password
            inputType6: 'password', // text password

            // 手机验证码弹框
            showTelDialog: false,
            // 0表示注册操作，1表示登录操作,2表示忘记密码操作，3表示手机号码校验，10表示新增登录密码，11表示修改登录密码，12表示新增提款密码，13表示修改提款密码，14表示第一次提款
            telType: '',
            // 手机号码验证对象
            telCodeObj: {
                mobile: '', // 手机号码
                verifyCode: '',// 验证码
                checkFlag: false,// 验证状态
            },
            mobile: '',// 手机号码
            mobileFlag: false,
            mobileCode: '', // 短信验证码
            mobileCodeFlag: false,
            sendFlag: false, //发送短信验证码状态
        };
    },
    computed: {
        ...mapState({
            commonData: state => state['centerStore'].commonData,
            userInfo: state => state['centerStore'].userInfo,
        }),
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
        submitFlag: function () {
            let flag = this.mobileCodeFlag && this.mobileFlag && this.oldPwdFlag && this.newPwdFlag && this.confirmedPwd
            return flag
        },
        submitFlag2: function () {
            let flag = this.mobileCodeFlag && this.mobileFlag && this.oldWithdrawPwdFlag && this.newWithdrawPwdFlag && this.confirmedPwd2Flag &&  (this.newWithdrawPwd == this.confirmedPwd2)
            return flag
        }
    },
    watch: {
        mobile: function (val) {
            if (this.userInfo.mobile) {
                this.mobileFlag = true;
            } else {
                this.mobileFlag = /^([1]{1})\d{10}$/.test(this.mobile.replace(/\s/g, ""))
            }
        },
        mobileCode: function (val) {
            if (val && val.length == 4) {
                this.mobileCodeFlag = true;
            } else {
                this.mobileCodeFlag = false
            }
        },
        oldPwd: function (val) {
            if (this.userInfo.loginPwdSetStatus == 0) {
                this.oldPwdFlag = true
            } else {
                this.oldPwdFlag = /^([A-Za-z0-9]){4,12}$/.test(this.oldPwd.replace(/\s/g, ""))
            }
        },
        newPwd: function (val) {
            this.newPwdFlag = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,12}$/.test(this.newPwd.replace(/\s/g, ""))
        },
        confirmedPwd: function (val) {
            this.confirmedPwdFlag = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,12}$/.test(this.confirmedPwd.replace(/\s/g, ""))
        },
        oldWithdrawPwd: function (val) {
            if (this.userInfo.withdrawSetStatus == 0) {
                this.oldWithdrawPwdFlag = true
            } else {
                this.oldWithdrawPwdFlag = /^\d{4}$/.test(this.oldWithdrawPwd.replace(/\s/g, ""))
            }
        },
        newWithdrawPwd: function (val) {
            this.newWithdrawPwdFlag = /^\d{4}$/.test(this.newWithdrawPwd.replace(/\s/g, ""))
        },
        confirmedPwd2: function (val) {
            this.confirmedPwd2Flag = /^\d{4}$/.test(this.confirmedPwd2.replace(/\s/g, ""))
        },

    },
    created() {
        // 动态store
        if (!store.state["passWordStore"]) {
            thatStore.install(this);
        }

    },
    mounted() {
        this.initPage();

    },
    methods: {
        ...mapActions({
            setLoginPwdFun(dispatch, param) {
                return dispatch(`passWordStore/setLoginPwdAction`, param);
            },
            setDrawPwdFun(dispatch, param) {
                return dispatch(`passWordStore/setDrawPwdAction`, param);
            },
            // 查询用户信息
            getUserInfoFun(dispatch, param) {
                return dispatch(`centerStore/getUserInfoAction`, param);
            },
        }),

        tabClick(tab) {
            this.resetPageData();
            if (tab == 1) {
                this.curttTab = tab;
                this.runCheckList()
                // 判断登录密码
                if (this.userInfo.loginPwdSetStatus == 1) {
                    this.telType = "11";
                } else {
                    this.telType = "10";
                    this.oldPwdFlag = true
                }
            } else if (tab == 2) {
                this.curttTab = tab;
                this.runCheckList2();
                if (this.userInfo.withdrawSetStatus == 1) {
                    this.telType = "13";
                } else {
                    this.telType = "12";
                    this.oldWithdrawPwdFlag = true
                }
            }
        },
        //重置页面数据
        resetPageData() {
            this.oldPwd = '';
            this.newPwd = '';
            this.confirmedPwd = '';
            this.confirmedPwd2 = "";
            this.opFlag = '';//1表示无登陆密码时的修改，0表示有登陆密码时的修改
            this.oldWithdrawPwd = '';
            this.newWithdrawPwd = '';
            this.errorMsg = "";
            this.subFlag = false;
            this.errorMsg2 = "";
            this.subFlag2 = false;
        },
        //
        initPage() {
            setTimeout(() => {
                this.mobile = this.userInfo.mobile
            }, 300)
            this.tabClick(2)
        },
        // 保存登录密码判断
        saveLoginPwdBefore() {
            // 校验
            this.checkForm()
            if (!this.submitFlag) {
                return;
            }
            // 判断是否是请求中
            if (!this.isReqFlag) {
                return;
            }
            // 判断登录密码
            if (this.userInfo.loginPwdSetStatus == 1) {
                this.telType = "11";
            } else {
                this.telType = "10";
            }
            //this.openTelDialog();
            this.saveLoginPwd();
        },
        saveLoginPwd() {
            let that = this;
            // 判断是否是请求中
            if (this.isReqFlag) {
                this.isReqFlag = false;
            } else {
                return;
            }
            let param = {
                oldPwd: this.oldPwd ? mymd5(this.oldPwd) : "",
                newPwd: this.newPwd ? mymd5(this.newPwd) : "",
                confirmedPwd: this.confirmedPwd ? mymd5(this.confirmedPwd) : "",
                mobile: this.mobile,
                mobileVerifyCode: this.mobileCode,
                opFlag: ""
            }

            // 1表示无登陆密码时的修改，0表示有登陆密码时的修改
            if (this.userInfo.loginPwdSetStatus == 0) { // 登录密码设置情况：0表示未设置，1表示已设置
                param.opFlag = "1";
            } else {
                param.opFlag = "0";
            }
            Object.assign(param, this.telCodeObj);
            this.setLoginPwdFun(param).then(function () {
                that.isReqFlag = true;
                that.oldPwd = "";
                that.newPwd = "";
                that.confirmedPwd = "";
                that.subFlag = false;
                that.errorMsg = "";
                that.mobileCode = '';
                that.btnVerif()
                that.getUserInfoFun().then(function (res) {
                    that.btnVerif()
                })
            });
        },
        saveDrawPwdBefore() {
            // 校验
            this.checkForm2()
            if (!this.submitFlag2) {
                return;
            }
            // 判断是否是请求中
            if (!this.isReqFlag) {
                return;
            }
            if (this.userInfo.withdrawSetStatus == 1) {
                this.telType = "13";
            } else {
                this.telType = "12";
            }
            this.saveDrawPwd();
        },
        saveDrawPwd() {
            let that = this;
            // 判断是否是请求中
            if (this.isReqFlag) {
                this.isReqFlag = false;
            } else {
                return;
            }
            let param = {
                oldWithdrawPwd: mymd5(this.oldWithdrawPwd),
                newWithdrawPwd: mymd5(this.newWithdrawPwd),
                confirmedPwd: mymd5(this.confirmedPwd2),
                mobile: this.mobile,
                mobileVerifyCode: this.mobileCode,
                opFlag: this.userInfo.withdrawSetStatus
            }
            // 1表示无登陆密码时的修改，0表示有登陆密码时的修改
            if (this.userInfo.withdrawSetStatus == 0) { // 密码设置情况：0表示未设置，1表示已设置
                param.opFlag = "1";
            } else {
                param.opFlag = "0";
            }
            /*if(this.userInfo.withdrawSetStatus){
                param.oldWithdrawPwd = mymd5(this.oldWithdrawPwd)
            }*/
            // Object.assign(param, this.telCodeObj);
            this.setDrawPwdFun(param).then(function (res) {
                that.isReqFlag = true;
                if(res && res.success){
                    // 清空密码
                    that.oldWithdrawPwd = "";
                    that.newWithdrawPwd = "";
                    that.confirmedPwd2 = "";
                    that.subFlag2 = false;
                    that.errorMsg2 = "";
                    that.getUserInfoFun()
                    that.closeDialog()
                }
            });
        },
        // 打开客服链接
        // openKefu() {
        //     if (this.kefuUrl) {
        //         window.open(this.kefuUrl, "_blank");
        //     } else {
        //         window.win.tips.success('客服连接未生成，请稍后');
        //     }
        // },
        // 打开客服链接
        openKefu() {
            if (this.kefuUrl) {
                let str = this.kefuUrl.substr(this.kefuUrl.lastIndexOf("imClient?"))
                console.log(str, window.location.host)
                let url = this.kefuUrl
                if (this.kefuUrl.indexOf('imClient') > -1) {
                    url = `${window.location.protocol}//${window.location.host}/vhtml/#/${str}`
                }
                window.open(url, "_blank");
            } else {
                window.win.tips.success('客服连接未生成，请稍后')
            }
        },
        //1 原密码
        oldPwdVerif() {
            // 密码设置情况：0表示未设置，1表示已设置
            if (this.userInfo.loginPwdSetStatus == 0) {
                this.reg.oldPwd.isPass = true;
                this.reg.oldPwd.msg = "";
                return;
            }
            let rule = Rule.init().rules.passWordOld,
                bool = rule.reg.test(this.oldPwd);
            if (bool) {
                this.reg.oldPwd.isPass = true;
                this.reg.oldPwd.msg = "";
            } else {
                this.reg.oldPwd.isPass = false;
                this.reg.oldPwd.msg = "原密码" + rule.desc;
                this.errorMsg = "原密码" + rule.desc;
            }
            this.btnVerif();
        },
        //2 新密码
        newPwdVerif() {
            let rule = Rule.init().rules.passWord,
                bool = rule.reg.test(this.newPwd);
            if (bool) {
                this.reg.newPwd.isPass = true;
                this.reg.newPwd.msg = "";
            } else {
                this.reg.newPwd.isPass = false;
                this.reg.newPwd.msg = "新密码" + rule.desc;
                this.errorMsg = "新密码" + rule.desc;
            }
            this.btnVerif();
        },
        //3 确认密码
        confirmedPwdVerif() {
            let rule = Rule.init().rules.passWord,
                bool = rule.reg.test(this.confirmedPwd);
            if (bool) {
                this.reg.confirmedPwd.isPass = true;
                this.reg.confirmedPwd.msg = "";
            } else {
                this.reg.confirmedPwd.isPass = false;
                this.reg.confirmedPwd.msg = "确认密码" + rule.desc;
                this.errorMsg = "确认密码" + rule.desc;
            }
            this.btnVerif();
        },
        //2-1 原密码
        oldWithdrawPwdVerif() {
            // 密码设置情况：0表示未设置，1表示已设置
            if (this.userInfo.withdrawSetStatus == 0) {
                this.reg2.oldWithdrawPwd.isPass = true;
                this.reg2.oldWithdrawPwd.msg = "";
                return;
            }
            this.oldWithdrawPwd = this.checkNum(this.oldWithdrawPwd)
            let rule = Rule.init().rules.drawPassWord,
                bool = rule.reg.test(this.oldWithdrawPwd);
            if (bool) {
                this.reg2.oldWithdrawPwd.isPass = true;
                this.reg2.oldWithdrawPwd.msg = "";
            } else {
                this.reg2.oldWithdrawPwd.isPass = false;
                this.reg2.oldWithdrawPwd.msg = "原密码" + rule.desc;
                this.errorMsg2 = "原密码" + rule.desc;
            }
            this.btnVerif2();
        },
        //2-2 新密码
        newWithdrawPwdVerif() {
            this.newWithdrawPwd = this.checkNum(this.newWithdrawPwd)
            let rule = Rule.init().rules.drawPassWord,
                bool = rule.reg.test(this.newWithdrawPwd);
            if (bool) {
                this.reg2.newWithdrawPwd.isPass = true;
                this.reg2.newWithdrawPwd.msg = "";
            } else {
                this.reg2.newWithdrawPwd.isPass = false;
                this.reg2.newWithdrawPwd.msg = "新密码" + rule.desc;
                this.errorMsg2 = "新密码" + rule.desc;
            }
            this.btnVerif2();
        },
        //2-3 确认密码
        confirmedPwd2Verif() {
            this.confirmedPwd2 = this.checkNum(this.confirmedPwd2)
            let rule = Rule.init().rules.drawPassWord,
                bool = rule.reg.test(this.confirmedPwd2);
            if (bool) {
                this.reg2.confirmedPwd2.isPass = true;
                this.reg2.confirmedPwd2.msg = "";
            } else {
                this.reg2.confirmedPwd2.isPass = false;
                this.reg2.confirmedPwd2.msg = "确认密码" + rule.desc;
                this.errorMsg2 = "确认密码" + rule.desc;
            }
            this.btnVerif2();
        },

        // 按钮校验
        btnVerif() {
            let goBut = [];
            // 先全部校验一次
            Object.keys(this.reg).forEach((key, val) => {
                if (this.reg[key].isPass) {
                    goBut.push(this.reg[key].isPass);
                }
            });
            // 所有的校验通过
            if (goBut.length == Object.keys(this.reg).length) {
                this.subFlag = true;
                this.errorMsg = "";
            } else {
                this.subFlag = false;
            }
        },
        // 按钮校验
        btnVerif2() {
            let goBut = [];
            // 先全部校验一次
            Object.keys(this.reg2).forEach((key, val) => {
                if (this.reg2[key].isPass) {
                    goBut.push(this.reg2[key].isPass);
                }
            });
            // 所有的校验通过
            if (goBut.length == Object.keys(this.reg2).length) {
                this.subFlag2 = true;
                this.errorMsg2 = "";
            } else {
                this.subFlag2 = false;
            }
        },
        // 执行校验 -- 倒序
        runCheckList() {
            this.confirmedPwdVerif()
            this.newPwdVerif()
            this.oldPwdVerif()
        },
        // 执行校验 -- 倒序
        runCheckList2() {
            this.confirmedPwd2Verif()
            this.newWithdrawPwdVerif()
            this.oldWithdrawPwdVerif()
        },
        // 修改眼镜状态
        changeEye(inp, eye) {
            this[eye] = !this[eye]
            if (this[eye]) {
                this[inp] = "text"
            } else {
                this[inp] = "password"
            }
        },
        // 只能输入正整数
        checkNum(num) {
            num = num.replace(/[^\d]/g, '').replace(/\./g, ''); // 清除“数字”和“.”以外的字符
            // if (num.indexOf('.') < 0 && num != '') {
            //     // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
            //     num = parseInt(num);
            // }
            return num;
        },

        // 打开短信验证弹框
        openTelDialog() {
            this.showTelDialog = true;
        },
        // 关闭短信验证弹框
        closeTelDialog() {
            this.showTelDialog = false;
        },
        // 短信验证码成功回调
        telCodeSuccess(data) {
            this.telCodeObj = data;
            this.closeTelDialog();
            // 调用接口
            if (this.curttTab == 1) {
                this.saveLoginPwd();
            } else if (this.curttTab == 2) {
                this.saveDrawPwd();
            }
        },
        sendMsgSuccess() {

        },
        // 校验表单
        checkForm() {
            if (!this.oldPwdFlag) {
                this.$tips.info('请输入4-12位数字和字母的原密码')
                return false;
            }
            if (!this.newPwdFlag) {
                this.$tips.info('请输入8-12位数字和字母的新密码')
                return false;
            }
            if (!this.confirmedPwdFlag) {
                this.$tips.info('请输入8-12位数字和字母的确认密码')
                return false;
            }

            if (!this.mobileFlag) {
                this.$tips.info('请输入正确的手机号码')
                return false;
            }
            if (!this.mobileCodeFlag) {
                this.$tips.info('请输入4位验证码')
                return false;
            }
        },
        checkForm2() {
            if (!this.oldWithdrawPwdFlag) {
                this.$tips.info('请输入4位数字原始密码')
                return false;
            }
            if (!this.newWithdrawPwdFlag) {
                this.$tips.info('请输入4位数字新密码')
                return false;
            }
            if (!this.confirmedPwd2Flag) {
                this.$tips.info('请输入4位数字确认密码')
                return false;
            }
            if (this.newWithdrawPwd != this.confirmedPwd2) {
                this.$tips.info('新密码和确认密码不一致！')
                return false;
            }
            if (!this.mobileFlag) {
                this.$tips.info('请输入正确的手机号码')
                return false;
            }
            if (!this.mobileCodeFlag) {
                this.$tips.info('请输入4位验证码')
                return false;
            }
        },
        closeDialog() {
            this.$emit('on-cancel');
        },
        openService(){
            this.closeDialog()
            this.$root.eventHub.$emit('openServiceDialg')
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template1/themes/mixin.styl'
@import "~@styl/template1/common/fun.styl"
.common-dialog-con
    .dialog-con
        width: 600px;
        min-height: 330px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .info
            padding 20px

            .tip
                font-size: 14px;
                font_color(fc05);
                margin-botton 20px

            .info-con
                width 520px
                margin 0 auto
                padding 20px 10px 10px 10px

                .form
                    .form-item
                        width: 500px;
                        height: 68px;
                        line-height 68px
                        border-radius: 5px;
                        border_all(1px, solid, border02);
                        margin-bottom 20px
                        display flex
                        flex-direction row
                        flex-wrap nowrap
                        position relative

                        input
                            font-size 16px

                        .lable
                            flex none
                            width 90px
                            text-align right
                            font-size: 16px;
                            letter-spacing: 2px;
                            font_color(fc05);

                        .kefu
                            cursor pointer
                            font-size: 12px;
                            font_color(fc034)
                            width: 200px;
                            position: absolute;
                            right: -210px;

                        .send-msg
                            position absolute
                            right 10px
                            top 50%
                            transform translateY(-50%)

                .submit-btn
                    width: 290px;
                    line-height 60px
                    text-align center
                    font-size: 18px;
                    font_color(fc08);
                    bg_img_linear(linear04, linear03)
                    background-blend-mode: normal, normal;
                    border-radius: 10px;
                    margin 0 auto
                .service-con
                    color #ccc
                    font-size 12px
                    text-align center
                    margin-bottom 10px
                    .kefu
                        color #dfa760
                        cursor pointer
                        padding-left 10px
            .draw-con
                bg_color(bg04)
                min-height 600px
                border-radius 0 0 10px 10px

            .login-con
                bg_color(bg04)
                min-height 600px
                border-radius 0 0 10px 10px

            .log-eye
                width 10%
                display flex
                justify-content center
                align-items center
                margin-right 10px

                svg
                    font_color(fc042)
                    width 24px
                    height 24px
</style>
