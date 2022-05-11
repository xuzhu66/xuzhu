<template lang="pug">
    .telcode-con
        comDialog(:show-footer='false',:show="showTelDialog",@on-cancel="closeDialog")
            div(slot="header") {{headerTitle}}
            .dialog-con(slot="default")
                .top-tip(v-if="showTopTip") 为了您的安全，信息在确认后将无法修改，如需帮助请联系客服
                .form
                    .form-item
                        .lable 手机号码:
                        input.user-tel(type="tel", @keyup="handleInputNum11", v-model="telephone" ,maxlength=13,placeholder="输入手机号码",:readonly="step ? 'readonly' : false")
                        .icon.tel
                            SendMsg(curDownNameProp="sendTelephoneCode" :isPassProp="reg.telephone.isPass" :mobileProp="telephoneFillter" :codeProp="telType"  @getSmsg="getSmsg")
                    .form-item
                        .lable 验证码:
                        input.tel-code(type="number", v-model="telCode",@keyup="handleInputNum4", placeholder="输入短信验证码",maxlength=8)
                        .icon.tel
                    .service(v-if="showService")
                        span(@click="openService") 如需帮助?联系客服
                .btn-con
                    .common-btn.submit-btn(@click="submit",:class="submitFlag?'ok':'hidden'") 确定
            div(slot="footer")

</template>

<script>
import thatStore from "@/store/comstore/center/base/telephoneStore"; // 获取模板
import store from '@/store/Store';
import comDialog from "./comDialog";
import SendMsg from "@/plugins/template2/sendMsg/sendMsg"; // 发送验证码
import Rule from "@m/rule"; // 验证
import {resNum, spacesForma, numHidf3l4} from '@m/utils'
import {mapActions, mapState} from "vuex"; // 工具类
export default {
    name: "comTelCode",
    components: {
        comDialog,
        SendMsg
    },
    props:{
        // 模块名称
        moduleName:{
            type:String,
            default:''
        },
        showTelDialog:{
            type:Boolean,
            default:false
        },
        // 发送验证码类型
        telType:{
            type:String,
            default:''
        },
        showService: {
          type:Boolean,
          default:true
        },
        showTopTip: {
          type:Boolean,
          default:false
        },
        headerTitle: {
          type:String,
          default:'安全验证'
        }

    },
    data() {
        return {
            submitFlag: false, // 是否可提交
            telephone: '', // 电话号码
            telCode: '', // 短信验证码
            reg: { // 验证
                telephone: { // 密码验证
                    rem: "",
                    isPass: false
                },
                telCode: { // 验证码验证
                    rem: "",
                    isPass: false
                }
            },
            //校验错误提示信息
            errorMsg: "",
            sendMsg: false, // 验证码是否发送成功
            step:'', // true: 手机号码未验证 false: 手机号码已经验证

            // 手机号码验证对象
            telCodeObj:{

            }

        }
    },
    computed: {
        ...mapState({
            userInfo: state => state.centerStore.userInfo,
            kefuUrl: state => state.homeStore.kefuUrl,
            isGetKefu: state => state.homeStore.isGetKefu,
        }),
        telephoneFillter: function () {
            return this.telephone.replace(/\s/g, "")
        },
    },
    watch: {
        telephone(val, old) {
            this.telephoneCheck();
        },
        telCode(val, old) {
            this.telCodeCheck();
        },
        userInfo(val, old) {
            this.initPage();
        },
    },
    created() {
        // 动态store
        if (!store.state["telephoneStore"]) {
            thatStore.install(this);
        }
    },
    mounted() {
        this.initPage();
        console.log(this.telType);
    },
    methods: {
        ...mapActions({
            // 手机号码设置 & 短信验证
            setPhoneAction(dispatch, param) {
                return dispatch(`telephoneStore/setPhoneAction`, param);
            },
        }),
        spacesForma: spacesForma,
        numHidf3l4: numHidf3l4,
        // 0.init page
        initPage() {
            if (this.userInfo.mobileChecked) {
                this.step = true;
                this.telephone = this.userInfo.mobile;
                this.reg.telephone.isPass = true;
            } else {
                this.step = false;
            }
        },
        // 校验入口
        handleInputNum11(e) { // 通过正则过滤小数点后两位
            if (e) {
                let n = 13
                resNum(e, n)
                this.telephone = resNum(e, n)
            }
            this.telephoneCheck();
        },
        // 校验入口
        handleInputNum4(e) { // 验证码过滤
            if (e) {
                let n = 4
                resNum(e, n)
                this.telCode = resNum(e, n)
            }
            this.telCodeCheck();
        },
        // 手机号码
        telephoneCheck() {
            let mobile = this.telephone ? this.telephone.replace(/\s/g, "") : "";
            if (!mobile) {
                this.telephone = "";
            } else {
                this.telephone = this.spacesForma(mobile);
            }
            let rule = Rule.init().rules.tel,
                bool = rule.reg.test(mobile);
            if (bool) {
                this.reg.telephone.isPass = true;
                this.reg.telephone.msg = "";
            } else {
                this.reg.telephone.isPass = false;
                this.reg.telephone.msg = rule.desc;
                this.errorMsg = rule.desc;
            }
            this.formCheck();
        },
        // 验证码校验
        telCodeCheck() {
            let rule = Rule.init().rules.vcode,
                bool = rule.reg.test(this.telCode);
            if (bool) {
                this.reg.telCode.isPass = true;
                this.reg.telCode.msg = "";
            } else {
                this.reg.telCode.isPass = false;
                this.reg.telCode.msg = rule.desc;
                this.errorMsg = rule.desc;
            }
            this.formCheck();
        },
        // 按钮校验
        formCheck() {
            let goBut = [];
            // 如果是二次发送老手机号码 手机号码校验直接放行
            if (this.userInfo.mobileChecked) {
                this.reg.telephone.isPass = true;
            }
            // 先全部校验一次
            Object.keys(this.reg).forEach((key, val) => {
                if (this.reg[key].isPass) {
                    goBut.push(this.reg[key].isPass);
                }
            });
            // 所有的校验通过 && this.sendMsg == true
            if (goBut.length == Object.keys(this.reg).length ) {
                this.submitFlag = true;
                this.errorMsg = "";
            } else {
                this.submitFlag = false;
            }
        },
        closeDialog() {
            this.$emit('on-cancel');
        },
        getSmsg(v) {
            this.sendMsg = true;
        },
        // 提交表单
        submit(){
            // 表单未校验通过
            if(!this.submitFlag){
                return;
            }
            // 参数
            let param = {
                moduleName:this.moduleName,
                mobile: this.telephone.replace(/\s/g, ""), // 手机号码
                verifyCode: this.telCode.replace(/\s/g, ""), // 验证码
                mobileVerifyCode: this.telCode.replace(/\s/g, ""), // 验证码
            };
            this.$emit('on-success',param);
        },
        // 打开客服链接
        // openService(){
        //     if (this.isGetKefu && this.kefuUrl) {
        //         window.open(this.kefuUrl, "_blank");
        //     } else {
        //         window.win.tips.success('客服连接未生成，请稍后');
        //     }
        // }
        // 打开客服链接
        openService(){
            if(this.isGetKefu && this.kefuUrl) {
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
        }
    }

}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template2/themes/mixin.styl'
@import "~@styl/template2/common/fun.styl"
.telcode-con

    .dialog-con
        bg_color(bg59)
        width: 600px;
        height: 330px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .top-tip
          font-size 17px
          text-align left
          margin 20px 0 30px
          width 500px
          color #ccccc0
        .form
            .form-item
                width: 500px;
                height: 68px;
                line-height 68px
                border-radius: 5px;
                border_all(1px, solid, border51);
                margin-bottom 20px
                display flex
                flex-direction row
                flex-wrap nowrap
                padding-right 10px

                input
                    font-size 16px
                    background-color transparent
                    font_color(fc089)

                    &::placeholder
                        font_color(fc097);

                .lable
                    flex none
                    width 90px
                    text-align right
                    font-size: 16px;
                    letter-spacing: 2px;
                    font_color(fc091);
            .service
                color: #aa9375;
                font-size 14px
                text-align right
                margin-bottom 20px
                cursor pointer
            .submit-btn
                width: 290px;
                line-height 60px
                text-align center
                font-size: 18px;
            .btn-con
                margin-top 60px
                display flex
                flex-direction row

                .common-btn
                    width 200px
</style>
