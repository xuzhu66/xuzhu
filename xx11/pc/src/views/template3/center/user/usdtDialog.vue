<template lang="pug">
    .common-dialog-con
        comDialog(:show-footer='false',:show="showDialog",@on-cancel="closeDialog")
            div(slot="header") 设置虚拟币账户
            .dialog-con(slot="default")
                .info-con
                    .form
                        .form-item-tel
                            .lable 虚拟币账户:
                            input(maxlength=50,placeholder='请输入钱包地址',v-model='usdtAddress'  @input="usdtAddressVerif()")
                        .tip *请认真校对账户信息，地址错误资金将无法到账

                        .form-item(v-if="isDDB")
                            .lable 虚拟币种类:
                                .virtual-list
                                    ul
                                        li.active
                                            .name DDB
                        .form-item(v-else)
                            .lable 虚拟币种类:
                                .virtual-list
                                    ul
                                        li(v-for="item in usdtProto", @click="selectVirCur(item)", :class="[{'active': curProtoList.vircurrency == item.vircurrency}]")
                                            .name {{item.vircurrency}}
                        .form-item(v-if="isDDB")
                            .lable 虚拟币协议:
                                .virtual-list
                                    ul
                                        li.active
                                            .name DDB
                        .form-item(v-else)
                            .lable 虚拟币协议:
                                .virtual-list
                                    ul
                                        li(v-for="item in curProtoList.protocols", @click="selectProtoCur(item)", :class="[{'active': curProto.protocol == item.protocol}]")
                                            .name {{item.protocol}}

                        .form-item-tel
                            .lable 手机号码:
                            input(maxlength=11,placeholder='请输入手机号码',v-model='mobile' :readonly="userInfo.mobile?true:false")
                        .form-item-tel
                            .lable 验 证 码:
                            input(maxlength=4,v-model="mobileCode",placeholder='验证码' )
                            sendMsg.send-msg(curDownNameProp="bank" :isPassProp="mobileFlag" :mobileProp="mobile" :codeProp="telType"  @getSmsg="sendMsgSuccess")

                    .default-con(@click="checkDefault")
                        span.default(:class="isDefault?'active':''")
                        span 设为默认虚拟币帐户
                    .service-con
                        span 如需帮助?
                        span.kefu(@click="openService") 联系客服
                    .common-btn.submit-btn(:class="submitFlag?'ok':'hidden'" @click="addUsdtAddress()" ) 确定

            div(slot="footer")

</template>

<script>
import thatStore from "@/store/comstore/center/base/bankCardStore"; // 获取模板
import store from '@/store/Store';
import {mapActions, mapMutations, mapState} from "vuex";
import Rule from "@m/rule"; // 验证
import comDialog from '@pon/template3/comDialog';
import comTelCode  from "@pon/template3/comTelCode";
import sendMsg from "@/plugins/template3/sendMsg/sendMsg"; // 发送验证码

export default {
    name: "usdtDialog",
    components: {
        comDialog,
        comTelCode,
        sendMsg
    },
    props:{
        showDialog:{
            type:Boolean,
            default:false
        },
        isDDB:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            // 校验规则
            isReqFlag: true, // 请求是否结束
            showCommonDialogFlag: false,
            showCommonDialogFlag1: false,
            showCommonDialogFlag2: false,
            editItem:{}, // 当前编辑列表
            usdtAddress: '', //真实姓名
            reg: { // 验证
                usdtAddress: {
                    msg: "",
                    isPass: false
                }
            },
            //校验错误提示信息

            actionType: "", // add edit
            // currtItme: '',//当前选中的银行卡
            isFirstCard: false, // 是否是第一次添加卡

            protoAddMsg: '', // 协议地址验证信息
            isDefault: true,
            errorMsg: "",
            virtualList:[{
                name: 'USDT',
                id: 1
            },
                {
                    name: 'USDT',
                    id: 2
                },{
                    name: 'USDT',
                    id: 3
                },
                {
                    name: 'USDT',
                    id: 4
                },{
                    name: 'USDT',
                    id: 5
                },
                {
                    name: 'USDT',
                    id: 6
                }
            ],
            currtItem: {
                id: 1
            },// 当前存款方式对象
            subFlag: false, // 是否校验通过
            showTelDialog:false,
            telType:'',
            telCodeObj: {},
            mobile: '',// 手机号码
            mobileFlag: false,
            mobileCode: '', // 短信验证码
            mobileCodeFlag: false,
            sendFlag: false, //发送短信验证码状态

        }
    },
    computed: {
        ...mapState({
            userInfo: state => state['centerStore'].userInfo,
            usdtList: state => state['bankCardStore'].usdtList,
            usdtMaxNumber: state => state['bankCardStore'].usdtMaxNumber,
            usdtProto: state => state['bankCardStore'].usdtProto,
            curProtoList: state => state['bankCardStore'].curProtoList,
            curProto: state => state['bankCardStore'].curProto,
        }),

        usdtStatus: {
            // 默认选中的tab
            get() {
                return this.$store.state['bankCardStore'].usdtStatus;
            },
            set(val) {
                this.setUsdtStatus(val);
            }
        },
        virAddressFlag: function () {
            let flag = /^([A-Za-z0-9]){10,50}$/.test(this.usdtAddress)
            return flag
        },
        submitFlag: function () {
            let flag = this.virAddressFlag && this.mobileFlag && this.mobileCodeFlag
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
        }
    },
    created() {
        // 动态store
        if (!store.state["bankCardStore"]) {
            thatStore.install(this);
        }
        this.getUsdtListFun()
        this.getUsdtMaxNumberFun()
    },
    mounted() {
        this.status = 2;
        this.mobile = this.userInfo.mobile
        this.addCard()
    },
    methods: {
        ...mapMutations({
            setUsdtStatus(commit, param) {
                return commit('bankCardStore/SET_USDTSTATUS', param);
            }
        }),
        ...mapActions({
            // 查询用户信息
            getUserInfoFun(dispatch, param) {
                return dispatch(`centerStore/getUserInfoAction`, param);
            },
            getUsdtListFun(dispatch, param) {
                return dispatch(`bankCardStore/getvirAcountList`, param);
            },
            updateVirAcountFun(dispatch, param) {
                return dispatch(`bankCardStore/updateVirAcount`, param);
            },
            getCardListFun(dispatch, param) {
                return dispatch(`bankCardStore/getCardListAction`, param);
            },
            getUsdtMaxNumberFun(dispatch, param) {
                return dispatch(`bankCardStore/getUsdtMaxNumberAction`, param);
            },
            getUsdtProtoFun(dispatch, param) {
                return dispatch(`bankCardStore/getUsdtProto`, param);
            },
            addvirAcountFun(dispatch, param) {
                return dispatch(`bankCardStore/addvirAcount`, param);
            },
        }),
        selectVirCur(item) {
            this.$store.commit('bankCardStore/SET_CURPROTOLIST', item);
            this.$store.commit('bankCardStore/SET_CURPROTO', item.protocols[0]);
            this.usdtAddressVerif()
        },
        selectProtoCur(item) {
            this.$store.commit('bankCardStore/SET_CURPROTO', item);
            this.usdtAddressVerif()
        },
        // 修改
        editCard(item) {
            this.editItem=item
            this.setUsdtStatus(1)
            this.actionType = "edit";
            this.telType = '27'
            this.usdtAddress = item.virAddress;
            this.isDefault = item.defaultable;
            this.getUsdtProtoFun().then(()=>{
                this.usdtProto.forEach((v,k) => {
                    if(item.vircurrency == v.vircurrency) {
                        this.$store.commit('bankCardStore/SET_CURPROTOLIST', v);
                        this.$store.commit('bankCardStore/SET_CURVIR', v.vircurrency);
                        v.protocols.forEach((vv,kk) => {
                            if(vv.protocol == item.protocol) {
                                this.$store.commit('bankCardStore/SET_CURPROTO', vv)
                                this.usdtAddressVerif()
                            }
                        });
                    }
                });
            })
        },
        addUsdtAddress(confirm) { // 提交地址
            this.checkForm()
            if(!this.submitFlag) return
            // 判断是否是请求中
            if (this.isReqFlag) {
                this.isReqFlag = false;
            } else {
                return;
            }
            let param = {
                vircurrency: this.isDDB ? 'DDB':this.curProtoList.vircurrency,
                protocol: this.isDDB ? 'DDB':this.curProto.protocol,
                virAddress: this.usdtAddress,
                defaultable: this.isDefault,
                mobileVerifyCode: this.mobileCode,
                mobile: this.mobile,
            }
            if(this.actionType == 'add') {
                this.addvirAcountFun(param).then((res) => {
                    this.isReqFlag = true;
                    if(res && res.success){
                        this.getUsdtListFun()
                        this.setUsdtStatus(2)
                        this.getUserInfoFun()
                        this.closeDialog()
                    }
                })
            }else{
                let o = {
                    id:this.editItem.id
                }
                param = Object.assign(param, o)
                this.updateVirAcountFun(param).then((res) => {
                    this.isReqFlag = true;
                    if(res && res.success){
                        this.getUsdtListFun()
                        this.setUsdtStatus(2)
                        this.getUserInfoFun()
                        this.closeDialog()
                    }
                });
            }
        },
        //设置默认
        setDefault(item) {
            item.defaultable = true;
            let param = {
                ...item,
                updateDefault: true
            }
            this.updateVirAcountFun(param).then(() => {
                this.getUsdtListFun()
            });
        },
        jumpTab() {
            // this.currtBank = "";//清空bank
            this.setUsdtStatus(2)
        },
        checkDefault() {
            if (!this.isFirstCard) {
                this.isDefault = !this.isDefault;
            }
            this.usdtAddressVerif()
        },
        resetPageData() { // 清空重置数据
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
        usdtAddressVerif() { // 虚拟币地址验证
            if(!this.usdtAddress){
                this.protoAddMsg = "";
                this.reg.usdtAddress.msg = ""
                this.reg.usdtAddress.isPass = false;
                this.subFlag = false;
                return
            }
            this.protoAddVerif()
            let rule = Rule.init().rules.virAddress,
                bool = rule.reg.test(this.usdtAddress);
            if (bool) {
                this.reg.usdtAddress.isPass = true;
                this.reg.usdtAddress.msg = "";
            } else {
                this.reg.usdtAddress.isPass = false;
                this.reg.usdtAddress.msg = rule.desc;
                this.errorMsg = rule.desc;
            }
            this.btnVerif();
        },
        protoAddVerif(){
            if(this.curProto.protocol == 'ERC20') {
                var protoVer = this.usdtAddress.substring(0,2)
                if(protoVer.toLowerCase() != '0x') {
                    this.protoAddMsg = "您填写的地址非标准ERC20地址";
                }else{
                    this.protoAddMsg = "";
                }
            } else if(this.curProto.protocol == 'TRC20') {
                var protoVer = this.usdtAddress.substring(0,1)
                if(protoVer.toLowerCase() != 't') {
                    this.protoAddMsg = "您填写的地址非标准TRC20地址";
                }else{
                    this.protoAddMsg = "";
                }
            } else {
                this.protoAddMsg = "";
            }
        },
        //添加虚拟币帐户
        addCard() {
            this.actionType = "add";
            this.telType = '26'
            // 重置页面数据
            this.resetPageData();
            this.getUsdtProtoFun();
            this.setUsdtStatus(1)
            this.actionType = "add";
            this.usdtAddress = '';
            // 判断是否是第一次添加
            if (!this.userInfo.virBankSetStatus) {
                this.isDefault = true;
                this.isFirstCard = true;
            } else {
                this.isFirstCard = false;
            }

        },
        returnTop() {
            // let l = document.documentElement.scrollTop;
            let l = document.getElementById('app').scrollTop;
            let s = l / 600 * 50;  //路程/时间=s *25每隔25ms秒 动的路程
            let st = setInterval(function () {
                l -= s;
                if (l <= 0) {
                    l = 0; //当l<=0时，设置l=0
                    clearInterval(st);
                }
                document.getElementById('app').scrollTop = l;
            }, 25)
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
            // 调用接口
            this.addUsdtAddress(true)
        },
        // 校验表单
        checkForm(){
            if(!this.curProtoList.vircurrency){
                this.$tips.info('请选择虚拟币种类')
                return false;
            }
            if(!this.curProto.protocol){
                this.$tips.info('请选择协议')
                return false;
            }
            if(!this.virAddressFlag){
                this.$tips.info('请输入正确的钱包地址')
                return false;
            }
            if(!this.mobileFlag){
                this.$tips.info('请输入正确的手机号码')
                return false;
            }
            if(!this.mobileCodeFlag){
                this.$tips.info('请输入正确的验证码')
                return false;
            }

        },
        sendMsgSuccess(){

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
@import '~@/assets/styles/template3/themes/mixin.styl'
@import "~@styl/template3/common/fun.styl"
.common-dialog-con
    .dialog-con
        width: 600px;
        min-height: 330px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .info-con
            width 520px
            margin 0 auto
            padding 10px 10px

            .form
                .form-item-tel
                    width: 500px;
                    height: 68px;
                    line-height 68px
                    border-radius: 5px;
                    //border_all(1px, solid, border02);
                    color #808080
                    border 1px solid #f2f2f2
                    margin-bottom 20px
                    display flex
                    flex-direction row
                    flex-wrap nowrap
                    position relative

                    input
                        font-size 16px
                        background-color transparent
                    .lable
                        flex none
                        min-width 90px
                        padding-left 4px
                        text-align right
                        font-size: 16px;
                        letter-spacing: 2px;
                        font_color(fc05);
                    .send-msg
                        position absolute
                        right 10px
                        top 50%
                        transform translateY(-50%)
                .form-item
                    display flex
                    flex-direction row
                    justify-content flex-start
                    align-items center
                    flex-wrap nowrap
                    font-size: 16px;
                    line-height: 25px;
                    letter-spacing: 0px;
                    font_color(fc091);
                    color #808080
                    &.address
                        border-radius: 5px;
                        border_all(1px, solid, border02);
                        margin-bottom 20px

                    .lable
                        font-size: 16px;
                        font_color(fc091);
                        color #808080
                        margin 10px 0px
                        width 100%

                    .virtual-list
                        margin-bottom 10px

                        ul
                            resetul()
                            display flex
                            flex-direction row
                            flex-wrap wrap
                            justify-content flex-start
                            align-items center

                            li
                                flex none
                                width: 114px;
                                height: 42px;
                                line-height 42px
                                text-align center
                                border-radius: 6px;
                                //border_all(1px, solid, border07)
                                border 1px solid #cccccc
                                margin 4px
                                position relative
                                cursor pointer
                                font_color(fc028)

                                &.active
                                    bg_color(bg58);

                                    .name
                                        font_color(fc06)

                                    &:after
                                        content ''
                                        display block
                                        width 24px
                                        height 24px
                                        position absolute
                                        bottom 0px
                                        right 0px
                                        background url("~@img/template3/center/duihao.png") center / contain no-repeat

                                    &.not
                                        cursor not-allowed

                                .name
                                    font-size: 14px;
                                    font_color(fc094);


                    input
                        font-size 16px
                        //bg_color(border05);
                        font_color(fc06);
                        height 60px
                        border-radius 5px
                        width 100%

                        &::placeholder
                            font_color(fc028);

                    &.dialog-con
                        flex none
                        position relative

                        .common-dialog
                            z-index: 3;
                            position absolute
                            top 66px
                            left 0px
                            width 500px
                            bg_color(border07);
                            //border_all(1px, solid, border03)
                            border-radius: 0px 0px 10px 10px;
                            //.bank-con

                            .address-con
                                height 320px

                            .dialog-title
                                span
                                    display inline-block
                                    width: 50%;
                                    height: 60px;
                                    line-height 60px
                                    text-align center
                                    bg_color(bg68);
                                    font-size: 18px;
                                    font_color(fc06);
                                    //border_com(1px, solid, border01, right)

                                    &.active
                                        bg_color(bg60);
                                        font_color(fc088);

                            .pvorvince-list
                                padding-bottom 20px

                                ul
                                    resetul()

                                    li
                                        width 100%
                                        text-align center
                                        font-size: 16px;
                                        font_color(fc06);
                                        display flex
                                        flex-direction row
                                        flex-wrap nowrap
                                        line-height 30px
                                        cursor pointer

                                        .col
                                            &:nth-child(1)
                                                flex none
                                                width 60px

                                            &:nth-child(2)
                                                display flex
                                                flex-direction row
                                                flex-wrap wrap

                                            span
                                                border-radius: 5px;
                                                cursor pointer
                                                padding: 2px 12px;
                                                margin-bottom: 10px;
                                                margin-right 10px

                                                &.active, &:hover
                                                    bg_color(bg60);
                                                    font_color(fc088);
                                                    border-radius: 5px;

                            .city-list
                                padding-bottom 20px

                                ul
                                    resetul()
                                    width 100%
                                    text-align center
                                    font-size: 16px;
                                    font_color(fc06);
                                    display flex
                                    flex-direction row
                                    flex-wrap wrap
                                    line-height 30px
                                    justify-content space-between
                                    align-items center
                                    padding 10px

                                    li
                                        flex none
                                        align-self center
                                        margin-right 10px
                                        cursor pointer
                                        padding-right: 10px;
                                        padding-left: 10px;
                                        margin-bottom: 10px;

                                        &.active, &:hover
                                            bg_color(bg60);
                                            font_color(fc088);
                                            border-radius: 5px;

                            .bank-list
                                //height 320px
                                overflow auto

                                ul
                                    resetul()
                                    width 100%
                                    text-align center
                                    font-size: 16px;
                                    bg_color(border05);
                                    font_color(fc06);
                                    display flex
                                    flex-direction row
                                    flex-wrap wrap
                                    line-height 30px
                                    justify-content space-between
                                    align-items center
                                    padding 10px

                                    li
                                        flex none
                                        align-self center
                                        margin-right 10px
                                        padding 2px 4px
                                        cursor pointer
                                        margin-bottom: 10px;

                                        &:last-child
                                            margin-right auto

                                        &.active, &:hover
                                            bg_color(bg60);
                                            font_color(fc088);
                                            border-radius: 5px;


            .default-con
                display flex
                align-items center
                margin-bottom 20px

                span
                    flex none
                    font-size: 16px;
                    font_color(fc07);

                .default
                    margin-right 10px
                    display inline-block
                    width 15px
                    height 15px
                    border_all(1px, solid, border04)
                    position relative
                    cursor pointer

                    &.active
                        bg_color(bg06);

            .submit-btn
                width: 290px;
                line-height 60px

            .tip
                color #dfa760
                margin-top -5px
            .service-con
                color #ccc
                font-size 12px
                text-align center
                margin-bottom 10px
                .kefu
                    color #dfa760
                    cursor pointer
                    padding-left 10px

</style>
