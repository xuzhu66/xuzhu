<template lang="pug">
    .telephone
        .info
            .info-con(v-if="step==2")
                .form
                    .form-item
                        .lable 手机号码:
                        input.user-tel(type="tel",  v-model="tel" , @keyup="handleInputNum11",maxlength=13,placeholder="输入手机号码")
                        .icon.tel
                            s-semdmsg(curDownNameProp="sendMsg" :isPassProp="reg.tel.isPass" :mobileProp="telPo" codeProp="3"  @getSmsg="getSmsg")
                    .form-item
                        .lable 验证码:
                        input.tel-code(type="number", v-model="vcode",@keyup="handleInputNum4", placeholder="输入短信验证码",maxlength=8)
                        .icon.tel

            .detail-con(v-if="step!=2")
                .img
                .detail
                    span(v-if="!userInfo.mobile") 阁下未绑定手机号：
                    span(v-if="userInfo.mobile") 阁下已绑定手机号：
                    span {{userInfo.mobile?numHidf3l4(userInfo.mobile):''}}
                    span.yellow(v-if="step==1 && userInfo.mobile") (未验证)
                    span.yellow(v-if="step==1 && !userInfo.mobile") (去绑定)
                    span.green(v-if="step==3") (已验证)

            .common-btn.ok.submit-btn(v-if="step==1 && userInfo.mobile",@click="changeStep(2)") 去验证
            .common-btn.ok.submit-btn(v-if="step==1 && !userInfo.mobile",@click="changeStep(2)") 去绑定
            .common-btn.submit-btn(v-if="step==2",@click="submit()" :disabled="!curBut" :class="subFlag?'ok':'hidden'") 保存
            .common-btn.ok.submit-btn(v-if="step==3",@click="changeStep(2)") 修改手机号

        // 老手机验证码
        comTelCode(v-if='showTelDialog',:showTelDialog="showTelDialog",@on-cancel="closeTelDialog",@on-success="telCodeSuccess",:telType="telType")

</template>

<script>
import thatStore from "@/store/comstore/center/base/telephoneStore"; // 获取模板
import store from '@/store/Store';
import {mapState} from "vuex";
import Rule from "@m/rule"; // 验证
import {numHidf3l4, resNum, spacesForma} from '@m/utils' // 工具类
import SendMsg from "@/plugins/template3/sendMsg/sendMsg"; // 发送验证码
import comTelCode  from "@pon/template3/comTelCode";
export default {
    name: "telephone",
    components: {
        "s-semdmsg": SendMsg, // 发送短信验证码
        comTelCode
    },
    data() {
        return {
            isReqFlag: true, // 请求是否结束
            step: 1,// 当前状态 1. 未验证 2. 验证 3. 已验证
            tel: '', // 手机号码
            vcode: '', // 密码
            errProm: "", // 报错提示
            curBut: false, // 按扭是否可点
            reg: { // 验证
                tel: { // 密码验证
                    rem: "",
                    isPass: false
                },
                vcode: { // 验证码验证
                    rem: "",
                    isPass: false
                }
            },
            //校验错误提示信息
            errorMsg: "",
            subFlag: false, // 是否校验通过
            sessMsg: false, // 是否发送成功

            // 手机验证码弹框
            showTelDialog:false,
            // 0表示注册操作，1表示登录操作,2表示忘记密码操作，3表示手机号码校验，10表示新增登录密码，11表示修改登录密码，12表示新增提款密码，13表示修改提款密码，14表示第一次提款
            telType:"3",
            // 手机号码验证对象
            telCodeObj:{
                mobile:'', // 手机号码
                verifyCode:'',// 验证码
                checkFlag:false,// 验证状态
            }
        }
    },
    computed: {
        ...mapState({
            commonData: state => state['centerStore'].commonData,
            userInfo: state => state['centerStore'].userInfo,
        }),
        telPo: function () {
            return this.tel.replace(/\s/g, "")
        }
    },
    watch: {
        tel(val, old) {
            this.handleInputNum11();
        },
        vcode(val, old) {
            this.handleInputNum4();
        },
    },
    created() {
        // 动态store
        if (!store.state["telephoneStore"]) {
            thatStore.install(this);
        }
    },
    mounted() {
        this.initPage()
    },
    methods: {
        spacesForma: spacesForma,
        numHidf3l4: numHidf3l4,
        changeStep(num) {
            this.step = num;
        },
        initPage() {
            if (this.userInfo.mobileChecked) {
                this.step = 3;
            } else {
                this.step = 1;
            }
        },
        // 设置手机号码
        setPhone() {
            // 判断是第一次绑定手机号  还是更新手机号码
            let param = {
                mobile: this.tel, // 手机号码
                verifyCode: this.vcode, // 验证码
            };
            if (param.mobile) {
                param.mobile = param.mobile.replace(/\s/g, "")
            }
            let that = this;
            // 校验
            this.runCheckList()
            if (!this.subFlag) {
                window.win.tips.info(this.errorMsg);
                return;
            }

            //防重复
            if (this.isReqFlag) {
                this.isReqFlag = false;
                this.$store.dispatch("telephoneStore/setPhoneAction", param).then(res => {
                    that.isReqFlag = true;
                    if (res && res.success) {
                        that.$store.dispatch("centerStore/getUserInfoAction")
                        that.step = 3;
                        that.clearInpName()
                    }
                });
            }
        },
        // 更新手机号码
        updatePhone() {
            let param = {
                newMobile: this.tel, // 新手机号码
                newVerifyCode: this.vcode, // 新验证码
            };
            if (param.newMobile) {
                param.newMobile = param.newMobile.replace(/\s/g, "")
            }
            Object.assign(param,this.telCodeObj);
            let that = this;
            // 校验
            this.runCheckList()
            if (!this.subFlag) {
                window.win.tips.info(this.errorMsg);
                return;
            }
            //防重复
            if (this.isReqFlag) {
                this.isReqFlag = false;
                this.$store.dispatch("telephoneStore/setPhoneAction", param).then(res => {
                    that.isReqFlag = true;
                    if (res && res.success) {
                        that.$store.dispatch("centerStore/getUserInfoAction")
                        that.step = 3;
                        that.clearInpName();
                        // this.closeTelDialog();
                    }
                });
            }
        },
        clearInpName() { // 清空输入框
            this.vcode = "" // 清空验证码
            this.vcodeVerif();
        },
        // 校验入口
        handleInputNum11(e) { // 通过正则过滤小数点后两位
            if (e) {
                let n = 13
                resNum(e, n)
                this.tel = resNum(e, n)
            }
            this.telVerif();
        },
        // 校验入口
        handleInputNum4(e) { // 验证码过滤
            if (e) {
                let n = 4
                resNum(e, n)
                this.vcode = resNum(e, n)
            }
            this.vcodeVerif();
        },
        // 手机号码
        telVerif() {
            let mobile = this.tel ? this.tel.replace(/\s/g, "") : "";
            if (!mobile) {
                this.tel = "";
            } else {
                this.tel = this.spacesForma(mobile);
            }
            let rule = Rule.init().rules.tel,
                bool = rule.reg.test(mobile);
            if (bool) {
                this.reg.tel.isPass = true;
                this.reg.tel.msg = "";
            } else {
                this.reg.tel.isPass = false;
                this.reg.tel.msg = rule.desc;
                this.errorMsg = rule.desc;
            }
            this.formCheck();
        },
        // 验证码校验
        vcodeVerif() {
            let rule = Rule.init().rules.vcode,
                bool = rule.reg.test(this.vcode);
            if (bool) {
                this.reg.vcode.isPass = true;
                this.reg.vcode.msg = "";
            } else {
                this.reg.vcode.isPass = false;
                this.reg.vcode.msg = rule.desc;
                this.errorMsg = rule.desc;
            }
            this.formCheck();
        },
        // 执行校验 -- 倒序
        runCheckList() {
            this.handleInputNum4();
            this.handleInputNum11();
            this.formCheck();
        },
        // 按钮校验
        formCheck() {
            let goBut = [];
            // 先全部校验一次
            Object.keys(this.reg).forEach((key, val) => {
                if (this.reg[key].isPass) {
                    goBut.push(this.reg[key].isPass);
                }
            });
            // 所有的校验通过
            if (goBut.length == Object.keys(this.reg).length && this.sessMsg == true) {
                this.subFlag = true;
                this.errorMsg = "";
            } else {
                this.subFlag = false;
            }
        },
        getSmsg(v) {
            this.sessMsg = true;
            this.formCheck();
        },

        // 打开短信验证弹框
        openTelDialog(){
            this.showTelDialog = true;
        },
        // 关闭短信验证弹框
        closeTelDialog(){
            this.showTelDialog = false;
        },
        // 短信验证码成功回调
        telCodeSuccess(data){
            this.telCodeObj = data;
            this.closeTelDialog();
            this.updatePhone();
        },
        // 提交
        submit(){
            // 校验
            this.runCheckList()
            if (!this.subFlag) {
                window.win.tips.info(this.errorMsg);
                return;
            }
            // 手机已经校验通过
            if (this.userInfo.mobileChecked) {
                this.openTelDialog();
            }else{
                // 第一次设置手机号码
                this.setPhone();
            }
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template3/themes/mixin.styl'
@import "~@styl/template3/common/fun.styl"

.yellow
    font_color(yellow_c)

.green
    font_color(green_c)

.telephone
    bg_color(bg2)
    border-radius: 0px 0px 10px 10px;
    min-height 890px

    .info
        padding 20px

        .info-con
            width 520px
            margin 0 auto
            padding 100px 10px 24px

            .form
                .form-item
                    width: 500px;
                    height: 68px;
                    line-height 68px
                    border-radius: 5px;
                    border_all(1px, solid, border_common);
                    margin-bottom 20px
                    display flex
                    flex-direction row
                    flex-wrap nowrap
                    padding-right 10px

                    input
                        font-size 16px
                        background-color transparent
                        font_color(fc2)

                        &::placeholder
                            font_color(fc5);

                    .lable
                        flex none
                        width 90px
                        text-align right
                        font-size: 16px;
                        letter-spacing: 2px;
                        font_color(fc3);

        .detail-con
            padding 100px 10px

            .img
                margin 0 auto
                background url("~@img/template3/center/shouj.png") center no-repeat
                width 348px
                height 345px

            .detail
                text-align center
                height: 16px;
                font-size: 16px;
                font_color(fc3);

        .submit-btn
            width: 290px;
            line-height 60px
            text-align center
            font-size: 18px;


</style>
