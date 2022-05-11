<template lang="pug">
    .draw-dialog
        .dialog-flow(v-if="showJumpDialog.display",@click="closeJumpDialog")
        .dialog-flow(v-if="showDialog",@click="closeDialog2")
        comDialog(:show-footer='false',:show="showDialog",@on-cancel="closeDialog2")
            div(slot="header") 温馨提示
            div.dialog-con(slot="default")
                .user-con
                    .title 请先完善您的取款密码！
                    .form
                        .form-item
                            .lable 新密码:
                            input(maxlength=4,placeholder='请输入新密码',v-model="newWithdrawPwd",@keyup="newWithdrawPwdVerif",@keydown="newWithdrawPwdVerif" )
                        .form-item
                            .lable 确认密码:
                            input(maxlength=4,placeholder='请再次输入提款密码',v-model="confirmedPwd",@keyup="confirmedPwdVerif",@keydown="confirmedPwdVerif" )

                    .common-btn.big(@click="saveDrawPwd" ,:class="subFlag2?'ok':'hidden'") 保存

            div(slot="footer")

        comDialog(:show-footer='false',:show="showJumpDialog.display",@on-cancel="closeJumpDialog")
            div(slot="header") 温馨提示
            div.dialog-con(slot="default")
                .user-con.checkcon
                    //.title(v-if="checkCode == 20325 || checkCode == 20330") 您当前未绑定银行卡，为了您的取款安全，请立即前往“个人资料-银行卡管理”完善您的银行卡信息！！
                    //.title(v-if="checkCode == 20326") 您当前未设置取款密码，为了您的取款安全，请立即完善您的相关信息
                    //.title(v-if="checkCode == 20331") 首次提款，需要完成手机号验证!
                    .bankver(v-if="showJumpDialog.type==1 || showJumpDialog.type==5")
                        .title1 为了保障您的账户取款安全,您需要完成以下四个步骤:
                        .title
                            p 第一步: 手机验证;
                            p
                                span.ok(v-if='userInfo.mobileChecked') [已验证]
                                span.no(v-if='!userInfo.mobileChecked') [未验证]
                                span.go(v-if='!userInfo.mobileChecked' , @click="jumpPage(1)") 去验证
                        .title
                            p 第二步: 个人真实姓名认证;
                            p
                                span.ok(v-if='userInfo.realName') [已验证]
                                span.no(v-if='!userInfo.realName') [未验证]
                                span.go(v-if='!userInfo.realName' , @click="jumpPage(1)") 去验证
                        .title
                            p 第三步: 绑定真实银行卡;
                            p
                                span.ok(v-if='userInfo.bankSetStatus') [已绑定]
                                span.no(v-if='!userInfo.bankSetStatus') [未绑定]
                                span.go(v-if='!userInfo.bankSetStatus')(@click="jumpPage(1)") 去绑定
                        .title
                            p 第四步: 设置您的取款密码;
                            p
                                span.ok(v-if='userInfo.withdrawSetStatus') [已设置]
                                span.no(v-if='!userInfo.withdrawSetStatus') [未设置]
                                span.go(v-if='!userInfo.withdrawSetStatus' , @click="jumpPage(1)") 去设置
                        .submit-btn.ok(@click="jumpPage(1)") 前往完善资料


                    .usdtver(v-if="showJumpDialog.type==2 || showJumpDialog.type==6")
                        .title1 为了保障您的账户取款安全,您需要完成以下 3 个步骤:
                        .title
                            p 第一步: 手机验证;
                            p
                                span.ok(v-if='userInfo.mobileChecked') [已验证]
                                span.no(v-if='!userInfo.mobileChecked') [未验证]
                                span.go(v-if='!userInfo.mobileChecked' , @click="jumpPage(2)") 去验证
                        .title(v-if="showJumpDialog.type==2")
                            p 第二步: 绑定虚拟币帐户;
                            p
                                span.ok(v-if='userInfo.virBankSetStatus') [已验证]
                                span.no(v-if='!userInfo.virBankSetStatus') [未验证]
                                span.go(v-if='!userInfo.virBankSetStatus' , @click="jumpPage(2)") 去验证
                        .title(v-if="showJumpDialog.type==6")
                            p 第二步: 绑定DDB帐户;
                            p
                                span.ok(v-if='userInfo.bankDDBSetStatus') [已验证]
                                span.no(v-if='!userInfo.bankDDBSetStatus') [未验证]
                                span.go(v-if='!userInfo.bankDDBSetStatus' , @click="jumpPage(6)") 去验证

                        .title
                            p 第三步: 设置您的取款密码;
                            p
                                span.ok(v-if='userInfo.withdrawSetStatus') [已设置]
                                span.no(v-if='!userInfo.withdrawSetStatus') [未设置]
                                span.go(v-if='!userInfo.withdrawSetStatus' , @click="jumpPage(2)") 去设置

                        .submit-btn.ok(@click="jumpPage(2)") 前往完善资料

            div(slot="footer")

</template>

<script>
import thatStore from "@/store/comstore/assets/drawStore"; // 获取模板
import store from '@/store/Store';
import {mapActions, mapMutations, mapState} from "vuex";
import Rule from "@m/rule"; // 验证
import comDialog from '@pon/template3/comDialog'
import {mymd5} from '@m/utils' // 工具类
export default {
    name: "draw",
    components: {
        comDialog,
    },
    data() {
        return {
            isReqFlag: true, // 请求是否结束
            showDialog: false, // 提款密码dialog
            showDateDialogFlag: false,// 弹层
            currtCard: '',
            card: '',

            withdrawalAmount: "",
            withdrawalPassword: "",
            bankId: "",

            oldWithdrawPwd: "",
            newWithdrawPwd: "",
            confirmedPwd: '',


            // 校验规则
            reg2: {
                newWithdrawPwd: {
                    msg: "",
                    isPass: false
                },
                confirmedPwd: {
                    msg: "",
                    isPass: false
                },

            },
            //校验错误提示信息
            errorMsg2: "",
            subFlag2: false, // 是否校验通过

        }
    },
    computed: {
        ...mapState({
            userInfo: state => state['centerStore'].userInfo,
            showJumpDialog: state => state['drawStore'].showJumpDialog,
            checkCode: state => state['drawStore'].checkCode,
        }),

    },

    created() {
        let that = this;
        // 动态store
        if (!store.state["drawStore"]) {
            thatStore.install(this);
        }
    },
    mounted() {
    },
    methods: {
        ...mapMutations({
            setDialogStatus(commit, param) {
                return commit('drawStore/SET_SHOW_JUMP_DIALOG', param);
            }
        }),
        ...mapActions({
            updateUserInfoFun(dispatch, param) {
                return dispatch(`centerStore/updateUserInfoAction`, param);
            },
            setDrawPwdFun(dispatch, param) {
                return dispatch(`drawStore/setDrawPwdAction`, param);
            },
            // 查询用户信息
            getUserInfoFun(dispatch, param) {
                return dispatch(`centerStore/getUserInfoAction`, param);
            },
            // 提款校验dialog
            checkDrawFun(dispatch, param) {
                return dispatch(`drawStore/checkDrawAction`, param);
            },
            getUsdtProto(dispatch) {
                return dispatch(`drawStore/getUsdtProto`);
            },
        }),

        // 关闭弹框
        closeDialog2() {
            this.showDialog = false;
        },
        // 关闭弹框
        closeJumpDialog() {
            this.setDialogStatus(false)
        },
        // 检测依赖
        checkdependent() {
            // 是否设置银行卡
            if (!this.userInfo.bankSetStatus) {

            }
            // 是否设置提款密码
            if (!this.userInfo.withdrawSetStatus) {
                this.showDialog = true;
            } else {
                this.showDialog = false;
            }
        },
        // 更新取款密码
        saveDrawPwd() {
            let that = this;
            let param = {
                newWithdrawPwd: mymd5(this.newWithdrawPwd),
                confirmedPwd: mymd5(this.confirmedPwd),
                opFlag: ""
            }
            // 校验
            this.runCheckList2()
            // 校验
            if (!this.subFlag2) {
                window.win.tips.info(this.errorMsg2);
                return;
            }
            // 判断是否是请求中
            if (this.isReqFlag) {
                this.isReqFlag = false;
            } else {
                return;
            }
            if (this.userInfo.withdrawSetStatus == 0) {
                param.opFlag = "1";
            } else {
                param.opFlag = "0";
            }
            this.setDrawPwdFun(param).then(function (res) {
                that.isReqFlag = true;
                if (res && res.success) {
                    that.showDialog = false;
                    that.newWithdrawPwd = "";
                    that.confirmedPwd = "";
                    that.getUserInfoFun().then(function () {
                        that.checkdependent()
                    })
                    // 调用检测接口
                    that.checkDrawFun();
                    that.goPage("/center/draw")
                }
            })
        },

        //2-1 取款新密码
        newWithdrawPwdVerif() {
            this.newWithdrawPwd = this.checkNum(this.newWithdrawPwd);

            let rule = Rule.init().rules.drawPassWord,
                bool = rule.reg.test(this.newWithdrawPwd);
            if (bool) {
                this.reg2.newWithdrawPwd.isPass = true;
                this.reg2.newWithdrawPwd.msg = "";
            } else {
                this.reg2.newWithdrawPwd.isPass = false;
                this.reg2.newWithdrawPwd.msg = rule.desc;
                this.errorMsg2 = rule.desc;
            }
            this.btnVerif2();
        },
        //2-2 取款确认密码
        confirmedPwdVerif() {
            this.confirmedPwd = this.checkNum(this.confirmedPwd);
            let rule = Rule.init().rules.drawPassWord,
                bool = rule.reg.test(this.confirmedPwd);
            if (bool) {
                this.reg2.confirmedPwd.isPass = true;
                this.reg2.confirmedPwd.msg = "";
            } else {
                this.reg2.confirmedPwd.isPass = false;
                this.reg2.confirmedPwd.msg = rule.desc;
                this.errorMsg2 = rule.desc;
            }
            this.btnVerif2();
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
        runCheckList2() {
            this.confirmedPwdVerif();
            this.newWithdrawPwdVerif();
        },

        jumpPage(v) {
            this.setDialogStatus(false)
            if(v==1) {
                this.$store.commit('drawStore/SET_SHOW_INFO_DIALOG', true);
            }
            if(v==2) {
                this.getUsdtProtoAction()
                this.$store.commit('drawStore/SET_SHOW_USDT_DIALOG', true);
            }
            if(v==6) {
                this.getUsdtProtoAction()
                this.$store.commit('drawStore/SET_SHOW_USDT_DIALOG', true);
            }

            // this.setDialogStatus(false)
            // if (this.checkCode == 20330) { // 真实姓名
            //     this.goPage('/center/userinfo', {tab: 1})
            //     this.$root.eventHub.$emit('userTab', 1);
            // } else if (this.checkCode == 20325) { // 银行卡
            //     this.goPage('/center/userinfo', {tab: 3})
            //     this.$root.eventHub.$emit('userTab', 3);
            // } else if (this.checkCode == 20326) { // 取款密码
            //     this.showDialog = true;
            // } else if (this.checkCode == 20331) { // 手机号码
            //     this.goPage('/center/userinfo', {tab: 2})
            //     this.$root.eventHub.$emit('userTab', 2);
            // }

        },
        goPage(path, param) {
            this.$router.push({path: path, query: param})
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
        goNext(step) {
            if (step == 1) {
                this.goPage('/center/userinfo', {tab: 2})
                this.$root.eventHub.$emit('userTab', 2);
            }
            if (step == 2) {
                this.goPage('/center/userinfo', {tab: 1})
                this.$root.eventHub.$emit('userTab', 1);
            }
            if (step == 3) {
                this.goPage('/center/userinfo', {tab: 3})
                this.$root.eventHub.$emit('userTab', 3);
            }
            if (step == 4) {
                this.showDialog = true;
            }
            this.closeJumpDialog()
        },
        getUsdtProtoAction(){
            this.getUsdtProto()
        }

    }

}
</script>


<style lang="stylus" scoped>
@import '~@/assets/styles/template3/themes/mixin.styl'
@import "~@styl/template3/common/fun.styl"

.draw-dialog
    bg_color(bg2)
    border-radius: 0px 0px 10px 10px;
    //min-height 750px

    .dialog-flow
        width: 100%;
        height: 100%;
        bg_color(bg2)
        opacity: .1;
        position: fixed;
        top: 0;
        left: 0;
        z-index 2;

    .dialog-con
        .user-con
            min-height 200px
            min-width 500px

            &.checkcon
                min-height 180px
                width 300px

                .submit-btn
                    margin-top 96px

            .title1
                font-size: 16px;
                font_color(fc3);
                line-height 30px
                margin-bottom 10px

                &:nth-child(1)
                    font_color(fc2)

            .title
                font-size: 16px;
                font_color(fc3);
                line-height 45px
                display flex
                flex-direction row
                flex-wrap nowrap

                p
                    flex 1

                    &:nth-child(2)
                        text-align right

                    span
                        margin-right 10px

                        &.ok
                            font_color(green_c)

                        &.no
                            font_color(fc3)

                        &.go
                            font_color(blue_c)
                            border_com(1px, solid, border_hui2, bottom)
                            padding-right 8px
                            position relative
                            cursor pointer

                            &:after
                                content ''
                                display block
                                width 1px
                                height 8px
                                border_com(1px, solid, border_hui2, right)
                                position absolute
                                bottom -2px
                                right 2px
                                transform rotate(-45deg)


            .form
                .form-item
                    height: 68px;
                    line-height 68px
                    border-radius: 5px;
                    border_all(1px, solid, border_common);
                    margin-bottom 20px
                    margin-top 20px
                    display flex
                    flex-direction row
                    flex-wrap nowrap

                    input
                        font-size 16px
                        background-color transparent
                        //border_all(1px, solid, border_common);
                        font_color(fc2);

                        &::placeholder
                            font_color(fc5);

                    .lable
                        flex none
                        width 90px
                        text-align right
                        font-size: 16px;
                        letter-spacing: 2px;
                        font_color(fc3);

            .submit-btn
                width: 290px;
                height: 60px;
                line-height 60px
                text-align center
                font_color(fc3)
                bg_color(bg3)
                border-radius: 10px;
                font-size 18px
                margin 24px auto
                margin-bottom: 4px;
                cursor pointer

                &.ok
                    width: 290px;
                    line-height 60px
                    text-align center
                    font-size: 18px;
                    font_color(fc6)
                    bg_img_linear(linear_common)
                    border-radius: 10px;
                    margin-top 30px
</style>
