<template lang="pug">
    .bankCard
        .dialog-flow(v-if="showCommonDialogFlag || showCommonDialogFlag1 || showCommonDialogFlag2",@click="closeDialog")
        .info
            .list-title.ponint(v-if="usdtStatus==1",@click="jumpTab")
                span 我的虚拟币帐户>编辑虚拟币帐户
            .info-con(v-if="usdtStatus==1")
                .form
                    .form-item
                        .lable 虚拟币种类:
                            .virtual-list
                                ul
                                    li(v-for="item in usdtProto", @click="selectVirCur(item)", :class="[{'active': curProtoList.vircurrency == item.vircurrency}]")
                                        .name {{item.vircurrency}}
                    .form-item
                        .lable 协议:
                            .virtual-list
                                ul
                                    li(v-for="item in curProtoList.protocols", @click="selectProtoCur(item)", :class="[{'active': curProto.protocol == item.protocol}]")
                                        .name {{item.protocol}}
                    .form-item
                        .lable
                            span 钱包地址:
                            span.proto-curfont {{protoAddMsg}}
                            input(maxlength=50,placeholder='请输入钱包地址', v-model='usdtAddress', @input="usdtAddressVerif()")
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
                .common-btn.submit-btn(:class="submitFlag?'ok':'hidden'" @click="addUsdtAddress()" ) 提交
            .info-list(v-if="usdtStatus==2")
                .list-title
                    span 我的虚拟币帐户
                    span 共{{usdtList.length}}/{{usdtMaxNumber}}个
                .list-con
                    ul
                        li
                            .card-list
                                .card(v-for="item in usdtList")
                                    .bank-name  链名称： {{item.protocol}}
                                    .card-tit  钱包地址
                                    .card-number {{item.virAddress}}
                                    .default(v-if="item.defaultable")
                                    .action
                                        .item(v-if="item.defaultable")
                                            span.quan(:class="item.defaultable?'active':''")
                                            span(v-if="item.defaultable") 默认
                                            //span(v-else,@click="setDefault(item)") 设为默认
                                        .item(v-if="!item.defaultable",@click="setDefault(item)")
                                            span.quan(:class="item.defaultable?'active':''")
                                            //span(v-if="item.defaultable") 默认
                                            span 设为默认
                                        .item(@click="editCard(item)")
                                            span.icon
                                            span.edit 编辑

                                .add-card(v-if="usdtStatus==2 && (usdtMaxNumber > usdtList.length)")
                                    .card(@click="addCard")
                                        span 添加虚拟币帐户

        comTelCode(v-if='showTelDialog',:showTelDialog="showTelDialog",@on-cancel="closeTelDialog",@on-success="telCodeSuccess",:telType="telType")


        //-     div(slot="footer")
</template>

<script>
import thatStore from "@/store/comstore/center/base/bankCardStore"; // 获取模板
import store from '@/store/Store';
import {mapActions, mapMutations, mapState} from "vuex";
import Rule from "@m/rule"; // 验证
import comDialog from '@pon/template3/comDialog';
import comTelCode from "@pon/template2/comTelCode";
import sendMsg from "@/plugins/template3/sendMsg/sendMsg"; // 发送验证码

export default {
    name: "bankCard",
    components: {
        comDialog,
        comTelCode,
        sendMsg
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
            isDefault: false,
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
            // if (confirm !== true) {
            //     this.openTelDialog()
            //     return;
            // }
            let param = {
                vircurrency: this.curProtoList.vircurrency,
                protocol: this.curProto.protocol,
                virAddress: this.usdtAddress,
                defaultable: this.isDefault,
                mobileVerifyCode: this.mobileCode,
                mobile: this.mobile,
            }
            if(this.actionType == 'add') {
                this.addvirAcountFun(param).then(()=>{
                    this.getUsdtListFun()
                    this.setUsdtStatus(2)
                })
            }else{
                let o = {
                    id:this.editItem.id
                }
                param = Object.assign(param, o)
                this.updateVirAcountFun(param).then(() => {
                    this.getUsdtListFun()
                    this.setUsdtStatus(2)
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

        }
    }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template3/themes/mixin.styl'
@import "~@styl/template3/common/fun.styl"

.bankCard
    bg_color(bg59)
    border-radius: 0px 0px 10px 10px;
    min-height 890px

    .dialog-flow
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .5);
        opacity: .1;
        position: absolute;
        top: 0;
        left: 0;
        z-index 2;

    .list-title
        margin 20px 0

        span
            &:nth-child(1)
                height: 18px;
                font-size: 18px;
                font_color(fc089);

            &:nth-child(2)
                margin-left 10px
                font-size: 14px;
                font_color(fc089);

    .info
        padding 20px

        .tip
            font-size: 14px;
            font_color(fc5);
            margin-botton 20px

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
                        width 90px
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
                    font_color(fc5);
                    .lable
                        font-size: 16px;
                        font_color(fc3);
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
                                border_all(1px, solid, border_hui2)
                                margin 4px
                                position relative
                                cursor pointer
                                font_color(fc097)

                                &.active
                                    bg_color(bg58);

                                    .name
                                        font_color(fc4)

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
                        bg_color(border_hui2);
                        font_color(fc089);
                        height 60px
                        border-radius 5px
                        width 100%

                        &::placeholder
                            font_color(fc097);

                    // .lable
                    //     flex none
                    //     width 90px
                    //     text-align right
                    //     font-size: 16px;
                    //     letter-spacing: 2px;
                    //     font_color(fc091);

                    &.dialog-con
                        flex none
                        position relative

                        .common-dialog
                            z-index: 3;
                            position absolute
                            top 66px
                            left 0px
                            width 500px
                            bg_color(border_hui2);
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
                                    font_color(fc089);
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
                                        font_color(fc089);
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
                                    font_color(fc089);
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
                                    bg_color(border_hui2);
                                    font_color(fc089);
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
                    border_all(1px, solid, border_hui2)
                    position relative
                    cursor pointer

                    &.active
                        bg_color(green_c);

            .submit-btn
                width: 290px;
                line-height 60px

        .info-list

            .list-con
                ul
                    resetul()
                    display flex
                    flex-direction row
                    flex-wrap wrap
                    justify-content flex-start
                    align-items center

                    li
                        .card-list
                            display flex
                            flex-direction row
                            flex-wrap wrap
                            justify-content flex-start

                            .card
                                background url("~@img/template3/center/yinhangk_usdt.png") center / contain no-repeat
                                width: 450px;
                                height: 192px;
                                position relative
                                margin-bottom 36px
                                margin-right 20px
                                &:nth-child(2n)
                                    margin-right 0px

                                .bank-name
                                    font-size: 16px;
                                    font-weight: bold;
                                    font-stretch: normal;
                                    line-height: 40px;
                                    letter-spacing: 0px;
                                    font_color(fc01);
                                    position relative
                                    left: 21px;
                                    top: 24px;
                                    padding-bottom 30px
                                .card-tit
                                    margin-top 30px;
                                    margin-left 21px
                                    font-size: 18px;
                                    font_color(fc01);
                                .card-number
                                    font-size: 14px;
                                    font-stretch: normal;
                                    line-height: 24px;
                                    word-break break-all;
                                    margin-right 30px
                                    letter-spacing: 0px;
                                    font_color(fc01);
                                    left: 21px;
                                    top: 0px;
                                    position relative

                                .default
                                    background url("~@img/template3/center/moren.png") center / contain no-repeat
                                    width 75px
                                    height 75px
                                    position absolute
                                    top: 2px;
                                    right: -13px;

                                .action
                                    height 36px
                                    width: 450px;
                                    position absolute
                                    bottom -10px
                                    padding 0 0px 0 0px
                                    display flex
                                    flex-direction row
                                    flex-wrap nowrap
                                    justify-content center
                                    align-items center

                                    .item
                                        cursor pointer
                                        font-size: 13px;
                                        font-stretch: normal;
                                        letter-spacing: 0px;
                                        font_color(fc05);
                                        flex 1
                                        display flex
                                        align-items center
                                        flex-direction row

                                        span
                                            margin-right 10px

                                            &.quan
                                                display inline-block
                                                width: 18px;
                                                height: 18px;
                                                border_all(2px, solid, border_hui1)
                                                border-radius 50%

                                                &.active
                                                    border none
                                                    bg_color(green_c);

                                            &.icon
                                                background url("~@img/template3/center/edit.png") center / contain no-repeat
                                                width 18px
                                                height 18px

                                        &:nth-child(2)
                                            display flex
                                            flex-direction row
                                            justify-content flex-end


                            .add-card
                                .card
                                    background-image none
                                    width: 448px;
                                    height: 150px;
                                    line-height 150px
                                    text-align center
                                    border-radius: 10px;
                                    border_all(1px, solid, border_hui2);
                                    opacity: 0.5;
                                    font-size: 16px;
                                    font-weight: bold;
                                    font-stretch: normal;
                                    letter-spacing: 0px;
                                    font_color(fc05);
                                    position relative
                                    margin-left 0px
                                    margin-bottom: 60px;

        .add-card
            .card
                width: 267px;
                height: 150px;
                line-height 150px
                text-align center
                border-radius: 10px;
                border_all(1px, solid, border_hui2);
                opacity: 0.5;
                font-size: 16px;
                font-weight: bold;
                font-stretch: normal;
                letter-spacing: 0px;
                font_color(fc05);
                position relative
                margin-left 20px
                margin-bottom: 60px;

                &:before
                    content ""
                    display block
                    width 13px
                    height 2px
                    bg_color(bg6)
                    position absolute
                    top 50%
                    transform translateY(-50%)
                    left 144px

                &:after
                    content ""
                    display block
                    width 2px
                    height 13px
                    bg_color(bg6);
                    position absolute
                    top 50%
                    transform translateY(-50%)
                    left 149px

    .dialog-con
        .user-con
            min-height 200px
            min-width 500px

            .title
                font-size: 16px;
                font_color(fc090);

            .title-2
                font-size: 14px;
                font_color(fc3);
                margin 10px 0px 20px

            .form
                .form-item
                    height: 68px;
                    line-height 68px
                    border-radius: 5px;
                    border_all(1px, solid, border51);
                    margin-bottom 20px
                    display flex
                    flex-direction row
                    flex-wrap nowrap

                    input
                        font-size 16px
                        background-color transparent
                        font_color(fc089);

                        &::placeholder
                            font_color(fc097);

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


.common-down
    input
        cursor pointer

.ponint
    cursor pointer
.proto-curfont
    color #f00
    padding-left 12px
</style>
