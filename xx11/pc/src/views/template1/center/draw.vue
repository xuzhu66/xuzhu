<template lang="pug">
    .draw
        .dialog-flow(v-if="showDateDialogFlag",@click="closeDialog")
        .info
            .tip *注：为了您的资金账户安全！如您的提款金额过大，我们会将您的资金分成若干笔转入您的账户中，请您耐心等待，通常您的取款只需3 - 15 分钟即可到账, 若超过30分钟仍未到账， 请联系在线客服核查，感谢您的理解与配合。
            .virtual-list
                ul
                    li(v-for="item in currencyType" , @click="selectCurrtItem(item)",:class="currtItem.id == item.id?'active':''")
                        .name {{item.name}}
                            .fether(v-if="item.frontType == 6") 送1%
            .info-con
                // 人民币取款
                .form(v-show="isBankType")
                    .form-item.dialog-con(:class="bankCardList.length?'common-down':''")
                        .lable 开户银行:
                        input(placeholder='取款银行',maxlength=20,@click="toggleBankDialog",v-model="currtBankName",readonly)
                        .right-text(v-if="!userInfo.bankSetStatus" @click="openBankCardDialog") 添加银行卡
                        .common-dialog(v-if="showDateDialogFlag && bankCardList.length>0")
                            .card-list
                                ul
                                    template(v-for="(it,ind) in bankCardList")
                                        li(@click="selectCard(it)",:class="currtCard.cardNo==it.cardNo?'active':''") {{it.bankName}}({{it.cardNo | get4Str}})

                    .com-tab
                        ul
                            li(v-if="withdrawBankObj.category == 1 || withdrawBankObj.category == 3" :class="withType == 1?'active':''" @click="changeWithtype(1)")  快速取款
                            li(v-if="withdrawBankObj.category == 2 || withdrawBankObj.category == 3" :class="withType == 2?'active':''" @click="changeWithtype(2)")  普通取款

                    .btn-list(v-if="withType == 1")
                        ul
                            li( v-for="item in withdrawFastArr",@click="setWithValue(item)",:class="withdrawalAmount == item?'active':''") {{item}}
                        .tip-with {{ withdrawBankObj.fastRemark }}
                    .form-item(v-if="withType == 2")
                        .lable 取款金额:
                        input(maxlength=9,:placeholder='"单笔提款金额："+drawMin+"元 - "+drawMax+"元"',v-model="withdrawalAmount",name="withdrawalAmount",autocomplete="new-password")
                        //input(type="text", style="height: 0;opacity: 0")
                        .all(@click="turnAll") 全部金额
                    .tip-with(v-if="withType == 2") {{ withdrawBankObj.normalRemark }}
                    .form-item
                        .lable 取款密码:
                        input(maxlength=4,type="password",placeholder='请输入取款密码',v-model="withdrawalPassword" :change="checkNum",name="withdrawalPassword", autocomplete="new-password" ,:readonly="!userInfo.withdrawSetStatus?true:false")
                        .right-text(v-if="!userInfo.withdrawSetStatus" @click="openPwdDialog") 设置取款密码

                    .common-btn.big(@click="drawSubmitBefore" ,:class="subFlagWithRmb?'ok':'hidden'") 立即取款
                    .charge(v-if="chargeConfig.rmbChargeFlag && chargeConfig.rmb && chargeConfig.rmb.trim()") 提示: {{chargeConfig.rmb}}

                // 虚拟币取款 2:虚拟币 6: ddpay
                .form(v-show="isVirtualType")
                    .title-usdt 虚拟币种类:
                    .form-usdt
                        .virtual-list
                            // 如果是虚拟币
                            ul(v-if="currtItem.frontType == 2")
                                li(v-for="item in usdtProto" , v-if="item.vircurrency!='DDB'" ,@click="selectCurrtVirtual(item)",:class="currtVirtualItem.vircurrency == item.vircurrency?'active':''")
                                    .name {{item.vircurrency}}
                            ul(v-else)
                                li(class="active")
                                    .name DDB
                    .title-usdt
                        .title-left 选择虚拟币帐户: 
                        .title-right(v-show="currtItem.frontType == 6" @click="jumpUsdtDetail('ddpay')")  滴滴付出金教程 >>
                    .form-item.dialog-con(:class="virBankList.length?'common-down':''")
                        input(placeholder='请先绑定虚拟币帐户',maxlength=60,@click="toggleDialog",v-model="curVirBankAddress.virAddress",readonly)
                        .right-text(v-if="currtItem.frontType == 2 && !userInfo.virBankSetStatus" @click="openVirtureDialog") 添加虚拟账户
                        .right-text(v-if="currtItem.frontType == 6 && !userInfo.bankDDBSetStatus" @click="openVirtureDialog") 添加虚拟账户
                        .common-dialog(v-if="showDateDialogFlag")
                            .card-list
                                ul
                                    template(v-for="(it,ind) in virBankList")
                                        li(@click="selectVirAddress(it)",:class="currtCard.cardNo==it.cardNo?'active':''") {{it.virAddress}}

                    .title-usdt 取款金额:
                    .form-item
                        input(maxlength=9,:placeholder='"单笔提款金额："+drawMin+"元 - "+drawMax+"元"',v-model="virWithdrawalAmount",@keyup="virAmount",@keydown="virAmount", name="withdrawalAmount",autocomplete="new-password")
                        .all(@click="turnAll") 全部金额
                    .usdt-rem(v-if="currtItem.frontType == 2 && currtVirtualItem.vircurrency")
                        p
                            span 参考汇率
                            span.usdt-cur 1{{currtVirtualItem.vircurrency}}={{virRate}}CNY
                        P
                            span 预计到帐
                            span.usdt-cur {{ getTateAmount() }}{{currtVirtualItem.vircurrency}}
                    .usdt-rem(v-if="currtItem.frontType == 6")
                        p
                            span 参考汇率
                            span.usdt-cur 1DDB=1CNY
                        P
                            span 预计到帐
                            span.usdt-cur {{parseInt(virWithdrawalAmount)>0?virWithdrawalAmount:0}} DDB

                    .title-usdt 取款密码:
                    .form-item
                        input(maxlength=4,type="password",placeholder='请输入取款密码',v-model="withdrawalPassword",@keyup="virWithdrawPwdVerif",@keydown="virWithdrawPwdVerif",:change="checkNum",name="withdrawalPassword", autocomplete="new-password" ,:readonly="!userInfo.withdrawSetStatus?true:false")
                        .right-text(v-if="!userInfo.withdrawSetStatus" @click="openPwdDialog") 设置取款密码
                    .common-btn.big(@click="drawVirSubmitBefore" ,:class="subFlagWithRir?'ok':'hidden'") 立即取款

                    .charge(v-if="chargeConfig.erc20ChargeFlag && isErc20 && chargeConfig.usdtErc20 && chargeConfig.usdtErc20.trim()") 提示: {{chargeConfig.usdtErc20}}
                    .charge(v-if="chargeConfig.trc20ChargeFlag && isTrc20 && chargeConfig.usdtTrc20 && chargeConfig.usdtTrc20.trim()") 提示: {{chargeConfig.usdtTrc20}}
                    .charge(v-if="chargeConfig.ddbChargeFlag && isDDB && chargeConfig.ddb && chargeConfig.ddb.trim()") 提示: {{chargeConfig.ddb}}

        // 拆单提示弹框
        comDialog(:show-footer='false',:show="showMsgDialog",@on-cancel="closeMsgDialog")
            div(slot="header") 温馨提示
            div.dialog-con(slot="default")
                .msg-con
                    .success-icon
                    .title(v-if="splitSize == 1") 取款提交成功,请注意查收到账信息;如有疑问请联系客服!
                    .title(v-else)
                        span 为了保障您的收款卡安全级别，并且能更快收到款项，您的订单将会拆分成
                        span.num {{splitSize}}
                        span 笔子订单进行汇款。在"交易记录"可以查看到每笔子订单金额。
                    .btns-con
                        .common-btn.ok.big(@click="closeMsgDialog") 我知道了
            div(slot="footer")
        // 老版本-完善资料
        comDialog(:show-footer='false',:show="showInfoDialog",@on-cancel="closeInfoDialog")
            div(slot="header") 完善资料
            div.dialog-con(slot="default")
                .dialog-info-tit(v-if='!userInfo.mobileChecked') 手机认证
                .dialog-info-con2(v-if='!userInfo.mobileChecked')
                    p.dialog-inif-stit 手机号码：
                    P.info-bord.w150
                        input.info-inp(type="tel",v-model="tel" ,maxlength=13,placeholder="输入手机号码")
                    P.dialog-inif-stit 验证码：
                    p.info-bord.w150
                        input.info-inp(maxlength=4,v-model="vcode",placeholder='验证码' )
                        s-semdmsg.infsms(curDownNameProp="sendMsg" :isPassProp="regtel.tel.isPass" :mobileProp="telPo" codeProp="3"  @getSmsg="getSmsg")
                .dialog-rnameCard(v-if='!userInfo.bankSetStatus || !userInfo.realName')
                    .dialog-info-tit
                        span 绑定银行卡
                        span.dialog-info-trem 请确保姓名与银行卡的开户姓名一致；如需修改，请联系在线客服。
                    .dialog-info-con
                        p.info-item
                            span.dialog-inif-stit 真实姓名：
                            span.info-bord
                                input.info-inp.w300(maxlength=20,placeholder='请输入真实姓名',:readonly="!!userInfo.realName", v-model='realName' ,@keyup="realNameVerif",@keydown="realNameVerif")
                    .dialog-info-con(v-if="cardList.length<=0")
                        p.info-item
                            span.dialog-inif-stit 银行卡号：
                            span.info-bord
                                input.info-inp.w300(maxlength=23,placeholder='请输入银行卡号',v-model='bankCard' ,@keyup="bankCardVerif",@keydown="bankCardVerif",@blur="bankCardOnBlur")
                        p.info-item.common-down(@click="toggleDialog2")
                            span.dialog-inif-stit 开户银行：
                            span.info-bord
                                span.w300.dial-select
                                    input.info-inp(placeholder='开户银行',maxlength=20,v-model="bankName",readonly)
                    // 虚拟币地址
                    .common-dialog.bank-con(v-if="showCommonDialogFlag2")
                        .bank-list(:class="[{'bank-notel': userInfo.mobileChecked }]")
                            ul
                                template(v-for="(it,ind) in bankList")
                                    li(@click="selectBank(it)",:class="bankName==it.name?'active':''") {{it.name}}
                    .dialog-info-con2
                        p.dialog-inif-stit 开户省：
                        p.info-bord.common-down(@click="toggleDialog1")
                            span.w150.dial-select
                                input.info-inp(placeholder='开户省',maxlength=20,v-model='pvorvince.name')
                        p.dialog-inif-stit 开户市：
                        p.info-bord.common-down(@click="toggleDialog1")
                            span.w150.dial-select
                                input.info-inp(placeholder='开户市',maxlength=20,v-model='city.name')
                    .dialog-info-con
                        p.info-item
                            span.dialog-inif-stit 开户支行：
                            span.info-bord
                                input.info-inp.w300(maxlength=20,v-model='bankFeather', @keyup="bankFeatherVerif", @keydown="bankFeatherVerif", placeholder='请输入开户支行')

                .dialog-info-tit(v-if="!userInfo.withdrawSetStatus") 密码设置
                .dialog-info-con2(v-if="!userInfo.withdrawSetStatus")
                    p.dialog-inif-stit 取款密码：
                    p.info-bord.w150
                        input.info-inp(:type="inputType5", maxlength=4,placeholder='请输入新密码',v-model="newWithdrawPwd" ,@keyup="newWithdrawPwdVerif",@keydown="newWithdrawPwdVerif")
                    p.dialog-inif-stit 确认密码：
                    p.info-bord.w150
                        input.info-inp(:type="inputType5", maxlength=4,placeholder='请再次输入新密码',v-model="confirmedPwd",@keyup="confirmedPwdVerif",@keydown="confirmedPwdVerif" )
                .dialog-pvor(:class="[{'pvor-notel': userInfo.mobileChecked }]", v-if="showCommonDialogFlag1")
                    .dialog-title
                        span(@click="checkTab(1)",:class="currtTab == 1?'active':''" ) 省区
                        span(@click="checkTab(2)",:class="currtTab == 2?'active':''" ) 市区
                    .pvorvince-list(v-if="currtTab == 1")
                        ul
                            template(v-for="(it,ind) in pvorvinceList")
                                li
                                    .col {{it.name}}
                                    .col
                                        span(v-for="item in it.list",:class="pvorvince.code==item.code?'active':''",@click="selectPvorvince(item)") {{item.name}}
                    .city-list(v-if="currtTab == 2")
                        ul
                            template(v-for="(it,ind) in cityList")
                                li(@click="selectCity(it)",:class="city.id==it.id?'active':''") {{it.name}}
                .btns-con.mt20(:class="[{'btn-nopwd': userInfo.withdrawSetStatus }]")
                    .common-btn.big(@click="withdrawalInfoBefore()", :class="subFlagInfoRmb?'ok':'hidden'") 提交








        // 老版本-虚拟币完善资料
        comDialog(:show-footer='false',:show="showUsdtDialog",@on-cancel="closeInfoDialog")
            div(slot="header") 完善资料
            div.dialog-con(slot="default")
                .dialog-info-tit(v-if='!userInfo.mobileChecked') 手机认证
                .dialog-info-con2(v-if='!userInfo.mobileChecked')
                    p.dialog-inif-stit 手机号码：
                    P.info-bord.w150
                        input.info-inp(type="tel",v-model="telVir" ,maxlength=13,placeholder="输入手机号码")
                    P.dialog-inif-stit 验证码：
                    p.info-bord.w150
                        input.info-inp(maxlength=4,v-model="vcodeVir",placeholder='验证码' )
                        s-semdmsg.infsms(curDownNameProp="sendMsg" :isPassProp="regtel.tel.isPass" :mobileProp="telPoVir" codeProp="3"  @getSmsg="getSmsg")


                // 虚拟币
                template(v-if="currtItem.frontType == 2")
                    .dialog-info-tit(v-if='!userInfo.virBankSetStatus') 绑定虚拟币帐户
                    .dialog-info-con3(v-if='!userInfo.virBankSetStatus')
                        .dialog-inif-stit 虚拟币种类：
                        .w300
                            .virtual-list
                                // 如果是虚拟币
                                ul
                                    li(v-for="item in usdtProto" , @click="selectVirCur(item)",:class="curProtoList.vircurrency == item.vircurrency?'active':''")
                                        .name {{item.vircurrency}}

                    .dialog-info-con3(v-if='!userInfo.virBankSetStatus')
                        .dialog-inif-stit 链名(协议)：
                        .w300
                            .virtual-list
                                // 虚拟币
                                ul
                                    li(v-for="item in curProtoList.protocols" , @click="selectProtoCur(item)",:class="curProto.protocol == item.protocol?'active':''")
                                        .name {{item.protocol}}

                    .dialog-info-con3(v-if='!userInfo.virBankSetStatus')
                        .dialog-inif-stit 钱包地址：
                        .w300
                            .info-bord
                                input.info-inp(placeholder='钱包地址',maxlength=50,@click="toggleDialog2",v-model="usdtAddress",@keyup="usdtAddressVerif",@keydown="usdtAddressVerif")
                            .default-con
                                span.default.active
                                span 设为默认地址
                                span.proto-curfont {{protoAddMsg}}

                // DDB
                template(v-if="currtItem.frontType == 6")
                    .dialog-info-tit(v-if='!userInfo.bankDDBSetStatus') 绑定虚拟币帐户
                    .dialog-info-con3(v-if='!userInfo.bankDDBSetStatus')
                        .dialog-inif-stit 虚拟币种类：
                        .w300
                            .virtual-list
                                // 如果是DDB
                                ul(v-if="currtItem.frontType == 6")
                                    li(class="active")
                                        .name DDB

                    .dialog-info-con3(v-if='!userInfo.bankDDBSetStatus')
                        .dialog-inif-stit 链名(协议)：
                        .w300
                            .virtual-list
                                // DDB
                                ul
                                    li(class="active")
                                        .name DDB
                    .dialog-info-con3(v-if='!userInfo.bankDDBSetStatus')
                        .dialog-inif-stit 钱包地址：
                        .w300
                            .info-bord
                                input.info-inp(placeholder='钱包地址',maxlength=50,@click="toggleDialog2",v-model="usdtAddress",@keyup="usdtAddressVerif",@keydown="usdtAddressVerif")
                            .default-con
                                span.default.active
                                span 设为默认地址
                                span.proto-curfont {{protoAddMsg}}

                .dialog-info-tit(v-if="!userInfo.withdrawSetStatus") 密码设置
                .dialog-info-con2(v-if="!userInfo.withdrawSetStatus")
                    p.dialog-inif-stit 取款密码：
                    p.info-bord.w150
                        input.info-inp(:type="inputType5", maxlength=4,placeholder='请输入新密码',v-model="newWithdrawPwdVir" ,@keyup="newWithdrawPwdVerifVir",@keydown="newWithdrawPwdVerifVir")
                    p.dialog-inif-stit 确认密码：
                    p.info-bord.w150
                        input.info-inp(:type="inputType5", maxlength=4,placeholder='请输入新密码',v-model="confirmedPwdVir",@keyup="confirmedPwdVerifVir",@keydown="confirmedPwdVerifVir")

                    //- p.dialog-inif-stit 取款密码：
                    //- p.info-bord.w150
                    //-     input.info-inp(:type="inputType5", maxlength=4,placeholder='请输入新密码',v-model="newWithdrawPwd" ,@keyup="newWithdrawPwdVerif",@keydown="newWithdrawPwdVerif")
                    //- p.dialog-inif-stit 确认密码：
                    //- p.info-bord.w150
                    //-     input.info-inp(:type="inputType5", maxlength=4,placeholder='请再次输入新密码',v-model="confirmedPwd",@keyup="confirmedPwdVerif",@keydown="confirmedPwdVerif" )



                .btns-con.mt20
                    .common-btn.big(@click="submitBefore()", :class="subFlagInfoVir?'ok':'hidden'") 提交
        // 老手机验证码
        comTelCode(v-if='showTelDialog',:showTelDialog="showTelDialog",@on-cancel="closeTelDialog",@on-success="telCodeSuccess",:telType="telType", :moduleName='moduleName')
        // 拆单前弹框
        comDialog(v-if='chargeDialogFlag',:show-footer='false',:show="chargeDialogFlag",@on-cancel="closeChargeDialog")
            div(slot="header") 温馨提示
            div.dialog-con(slot="default")
                .charge-con
                    .msg-item-new(v-if="msgType ==1")
                        .top  *本次提款将收取手续费
                        .middle
                            .money ￥{{isBankType?withdrawalAmount:virWithdrawalAmount}}
                            .text 取款金额
                        .down
                            .left 预计手续费{{isBankType?currtFee:currtFee}}元
                            .right 预计到账{{isBankType?actualArrivals:virActualArrivals}}元
                        .tip *以上手续费为预计金额，请以实际订单为准！

                    // 需要手续费
                    //.msg-item(v-if="msgType ==1")
                        // 人民币
                        div(v-if="isBankType") 本次提款金额 {{withdrawalAmount}} 元，手续费扣除{{currtFee}}元，实际到账{{actualArrivals}}元
                        // 虚拟币
                        div(v-else) 本次提款金额 {{virWithdrawalAmount}} 元，手续费扣除{{currtFee}}元，实际到账{{virActualArrivals}}元

                    // 需要手续费 - 拆单
                    .msg-item(v-if="msgType ==2")
                        div 您的提款金额合计为{{resultConfig.total}}元，手续费合计为{{resultConfig.fee}}元。实际到账合计{{resultConfig.actualArrivals}}元。
                        div 为了保障您的更快收到款项，您的订单将会拆分成{{resultConfig.subOrders}}笔子订单进行汇款
                        div 请注意查收到账信息，如有疑问请联系客服。
                    // 需要手续费 - 不拆单
                    .msg-item(v-if="msgType ==3")
                        div 您的提款金额合计为{{resultConfig.total}}元，手续费合计为{{resultConfig.fee}}元。实际到账合计{{resultConfig.actualArrivals}}元。
                        div 请注意查收到账信息，如有疑问请联系客服。
                    // 不需要手续费 - 拆单
                    .msg-item(v-if="msgType ==4")
                        div 为了保障您的更快收到款项，您的订单将会拆分成{{resultConfig.subOrders}}笔子订单进行汇款
                        div 请注意查收到账信息，如有疑问请联系客服。
                    // 不需要手续费 - 不拆单
                    .msg-item(v-if="msgType ==5")
                        div 请注意查收到账信息，如有疑问请联系客服。

                    .btns-con.mt20
                        .common-btn(v-if="msgType == 1", class="hidden" ,@click="closeChargeDialog") 取消提款
                        .common-btn(v-if="msgType == 1 && isBankType",class="ok" ,@click="drawSubmit") 继续提款
                        .common-btn(v-if="msgType == 1 && isVirtualType",class="ok", @click="drawVirSubmit") 继续提款
                        .common-btn(v-if="msgType != 1" ,class="ok" ,@click="closeChargeDialog") 我知道了

        // 提款密码
        passWordDialog(v-if='showPwdDialog',:showDialog="showPwdDialog" @on-cancel="closePwdDialog")
        // 虚拟币弹框
        usdtDialog(v-if='virtureAcountDialog',:showDialog="virtureAcountDialog" ,:isDDB='isDDB' @on-cancel="closeVirtureDialog")
        // 银行卡弹框
        bankDialog(v-if='bankAcountDialog',:showBankDialog="bankAcountDialog" @on-cancel="closeBankDialog")
        //粘贴板
        .clipboard-con(:data-clipboard-text="copyValue")

</template>

<script>
import thatStore from "@/store/comstore/assets/drawStore"; // 获取模板
import bankCardStore from "@/store/comstore/center/base/bankCardStore"; // 获取模板
import store from '@/store/Store';
import {mapActions, mapState, mapMutations} from "vuex";
import Rule from "@m/rule"; // 验证
import comDialog from '@pon/template1/comDialog'
import {formatAmount, mymd5} from '@m/utils' // 工具类
// import bankCardStore from './user/bankCardStore' ;
import SendMsg from "@/plugins/template1/sendMsg/sendMsg"; // 发送验证码
import {spacesForma} from '@m/utils'
import comTelCode from "@pon/template1/comTelCode";
import comPagination from "@pon/template1/comPagination"
import clipboard from "clipboard"
import passWordDialog from "@/views/template1/center/passWordDialog";
import usdtDialog from "@/views/template1/center/user/usdtDialog";
import bankDialog from "@/views/template1/center/user/bankDialog";

export default {
    name: "draw",
    components: {
        comDialog,
        comTelCode,
        "s-semdmsg": SendMsg, // 发送短信验证码
        comPagination,
        passWordDialog,
        usdtDialog,
        bankDialog
    },
    data() {
        return {
            readonlyFlay: false,//是否只读
            isReqFlag: true, // 请求是否结束
            showDialog: false,
            showJumpDialog: false,
            showDateDialogFlag: false,
            showMsgDialog: false, // 提示弹框
            // showInfoDialog: false, // 提示完善资料
            currtCard: '',
            card: '',
            currtTab: '1',
            withdrawalAmount: "",
            withdrawalPassword: "",
            virWithdrawalAmount: '',
            bankId: "",
            pvorvince: '', //开户省
            bankFeather: '',// 开户支行
            oldWithdrawPwd: "",
            newWithdrawPwd: "",
            confirmedPwd: '',

            newWithdrawPwdVir: "",
            confirmedPwdVir: '',

            currtItem: {},
            currtVirtualItem: {}, // 当前选中虚拟币种
            tel: '', // 手机号码
            vcode: '', // 验证码
            telVir: '', // 手机号码
            vcodeVir: '', // 验证码
            city: '',//开户市
            bankCard: '', //银行卡号
            bankName: '',// 开户银行name
            showCommonDialogFlag1: false,
            showCommonDialogFlag2: false,
            realName: '', //真实姓名
            isDefault: false,
            usdtAddress: '', //真实姓名
            inputType5: 'password', // text password
            protoAddMsg: '', // 协议地址验证信息
            virtualList: [{
                name: '人民币取款',
                id: 1
            }, {
                name: '虚拟币取款',
                id: 2
            }],
            regVirAdd: { // 虚拟币地址验证
                usdtAddress: {
                    msg: "",
                    isPass: false
                }
            },
            regVirWith: {// 虚拟币取款验证
                usdtAddress: {
                    msg: "",
                    isPass: false
                },
                curVirType: {
                    msg: "",
                    isPass: false
                },
                withdrawalAmount: {
                    msg: "",
                    isPass: false
                },
                withdrawalPassword: {
                    msg: "",
                    isPass: false
                },
            },
            reg: {// 人民币取款验证
                currtBankName: {
                    msg: "",
                    isPass: false
                },
                withdrawalAmount: {
                    msg: "",
                    isPass: false
                },
                withdrawalPassword: {
                    msg: "",
                    isPass: false
                },
            },
            regtel: { // 验证手机号
                tel: { // 密码验证
                    rem: "",
                    isPass: false
                },
                vcode: { // 验证码验证
                    rem: "",
                    isPass: false
                }
            },
            regInfo: { //用户信息验证
                realName: {
                    msg: "",
                    isPass: false
                },
                bankName: {
                    msg: "",
                    isPass: false
                },
                bankCard: {
                    msg: "",
                    isPass: false
                },
                pvorvince: {
                    msg: "",
                    isPass: false
                },
                city: {
                    msg: "",
                    isPass: false
                },
                bankFeather: {
                    msg: "",
                    isPass: false
                },
            },
            regPwd: { // 密码校验规则
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
            errorMsg: "",
            subFlagWithRmb: false, // 人民币取款是否校验通过
            subFlagWithRir: false, // 虚拟币取款是否校验通过
            subFlagInfoRmb: false, // 人民币取款完善资料是否通过
            subFlagInfoVir: false, // 虚拟币取款完善资料是否通过
            subFlagTel: false, // 人民币取款手机资料是否通过
            subFlagPwd: false, // 人民币取款密码资料是否通过
            subFlagBank: false, // 人民币取款银行卡资料是否通过
            subFlagVirAddress: false, // 虚拟币地址是否通过
            subFlagPwdVir: false, // 虚拟币取款密码资料是否通过
            subFlagTelVir: false, // 虚拟币取款手机资料是否通过
            pvorvinceList: [
                {
                    name: 'A-G',
                    list: [
                        {"name": "北京", "code": "110000"},
                        {"name": "安徽", "code": "340000"},
                        {"name": "澳门", "code": "820000"},
                        {"name": "重庆", "code": "500000"},
                        {"name": "福建", "code": "350000"},
                        {"name": "甘肃", "code": "620000"},
                        {"name": "广东", "code": "440000"},
                        {"name": "广西", "code": "450000"},
                        {"name": "贵州", "code": "520000"},
                        {"name": "钓鱼岛", "code": "900000"}
                    ]
                },
                {
                    name: 'H-K',
                    list: [
                        {"name": "海南", "code": "460000"},
                        {"name": "河北", "code": "130000"},
                        {"name": "河南", "code": "410000"},
                        {"name": "黑龙江", "code": "230000"},
                        {"name": "湖北", "code": "420000"},
                        {"name": "湖南", "code": "430000"},
                        {"name": "吉林", "code": "220000"},
                        {"name": "江苏", "code": "320000"},
                        {"name": "江西", "code": "360000"}
                    ]
                },
                {
                    name: 'L-S',
                    list: [
                        {"name": "辽宁", "code": "210000"},
                        {"name": "内蒙古", "code": "150000"},
                        {"name": "宁夏", "code": "640000"},
                        {"name": "青海", "code": "630000"},
                        {"name": "山东", "code": "370000"},
                        {"name": "山西", "code": "140000"},
                        {"name": "陕西", "code": "610000"},
                        {"name": "上海", "code": "310000"},
                        {"name": "四川", "code": "510000"}
                    ]
                },
                {
                    name: 'T-Z',
                    list: [
                        {"name": "天津", "code": "120000"},
                        {"name": "西藏", "code": "540000"},
                        {"name": "新疆", "code": "650000"},
                        {"name": "云南", "code": "530000"},
                        {"name": "浙江", "code": "330000"},
                        {"name": "香港", "code": "810000"},
                        {"name": "台湾", "code": "710000"}
                    ]
                }
            ],
            //校验错误提示信息
            errorMsg2: "",


            checkFlag: "",// 检测状态码
            splitSize: 1, // 提款金额拆分数量，1表示没有拆分，大于1的数表示已拆分

            // 手机验证码弹框
            showTelDialog: false,
            // 0表示注册操作，1表示登录操作,2表示忘记密码操作，3表示手机号码校验，10表示新增登录密码，11表示修改登录密码，12表示新增提款密码，13表示修改提款密码，14表示第一次提款
            telType: '14',
            // 手机号码验证对象
            telCodeObj: {
                moduleName: '',// usdtDialog:1  rmbDialog:2    usdtDraw:3  rmbDraw:4
                mobile: '', // 手机号码
                verifyCode: '',// 验证码
                checkFlag: false,// 验证状态
            },
            moduleName: '', // usdtDialog:1  rmbDialog:2    usdtDraw:3  rmbDraw:4

            // 手续费配置
            chargeConfig: {
                rmbChargeFlag: true, // 是否开启手续费
                rmbNeedChargeFlag: true,// 本比订单是否需要手续费
                rmbChargeType: 1,// 1: 按笔收费, 2: 按比例收费
                rmbDeal: 0,// 按笔收费
                rmbPercent: 0,//按比例收费
                rmb: "",// 提示语

                erc20ChargeFlag: true, // 是否开启手续费
                erc20NeedChargeFlag: true,// 本比订单是否需要手续费
                erc20ChargeType: 1,// 1: 按笔收费, 2: 按比例收费
                erc20Deal: 0,// 按笔收费
                erc20Percent: 0,//按比例收费
                usdtErc20: "",// 提示语

                trc20ChargeFlag: true, // 是否开启手续费
                trc20NeedChargeFlag: true,// 本比订单是否需要手续费
                trc20ChargeType: 1,// 1: 按笔收费, 2: 按比例收费
                trc20Deal: 0,// 按笔收费
                trc20Percent: 0,//按比例收费
                usdtTrc20: "",// 提示语

                ddbChargeFlag: true, // 是否开启手续费
                ddbNeedChargeFlag: true,// 本比订单是否需要手续费
                ddbChargeType: 1,// 1: 按笔收费, 2: 按比例收费
                ddbDeal: 0,// 按笔收费
                ddbPercent: 0,//按比例收费
                ddb: "",// 提示语

            },
            //接口后提示配置
            resultConfig: {
                needChargeFlag: false,//本笔订单是否需要收费
                total: "",// 合计金额
                fee: "",//手续费合计
                actualArrivals: "",//实际到账
                subOrders: "",//子订单
            },
            chargeDialogFlag: false, // 消息弹框标识
            msgType: 1,// 1: 手续费提示 2: 需要手续费 - 拆单 3:  需要手续费 - 不拆单 4: 不需要手续费 - 拆单 5: 不需要手续费 - 不拆单

            //取款类型
            curttTab: 1,
            withType: '',
            withdrawBankObj: {
                // category: 3,
            },
            withdrawFastArr: [],
            withdrawValue: '',
            showPickDiy: true,

            drawListDialog: false,// 取款列表弹框
            tableList: '', // 详情列表
            tableListData: '',// 详情列表数据
            currentPage: 1,//详情分页
            copyValue: '',// 粘贴板
            drawDetailDialog: false,

            currtPayModeId: '',// 5 ddpay 支付
            paddingOrderList: [],//进行中的订单

            showPwdDialog: false,//提款密码弹框
            virtureAcountDialog:false,//虚拟币账户弹框
            bankAcountDialog:false,//银行卡弹框
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state['centerStore'].userInfo,
            bankCardList: state => state['drawStore'].bankCardList,
            drawMax: state => state['drawStore'].drawMax,
            drawMin: state => state['drawStore'].drawMin,
            drawLimtObj: state => state['drawStore'].drawLimtObj,
            wallet: state => state['centerStore'].wallet,
            cityList: state => state['bankCardStore'].cityList,
            bankList: state => state['bankCardStore'].bankList,
            cardList: state => state['bankCardStore'].cardList,
            showInfoDialog: state => state['drawStore'].showInfoDialog,
            showUsdtDialog: state => state['drawStore'].showUsdtDialog,
            usdtProto: state => state['drawStore'].usdtProto,
            curProtoList: state => state['drawStore'].curProtoList, // // 当前协议
            curProto: state => state['drawStore'].curProto,
            virBankList: state => state['drawStore'].virBankList,
            curVirBankAddress: state => state['drawStore'].curVirBankAddress,
            virRate: state => state['drawStore'].virRate,
            currencyType: state => state['drawStore'].currencyType,
        }),
        currtBankName: function () {
            if (this.currtCard.cardNo) {
                let cardNo = this.get4StrFun(this.currtCard.cardNo);
                let str = this.currtCard.bankName + `(${cardNo})`;
                return str;
            } else {
                return "";
            }

        },
        telPo: function () {
            return this.tel.replace(/\s/g, "")
        },
        telPoVir: function () {
            return this.telVir.replace(/\s/g, "")
        },
        isErc20: function () {
            // if (!this.curVirBankAddress) {
            //     return false;
            // }
            let protocol = this.curVirBankAddress?.protocol ? this.curVirBankAddress.protocol : "";
            if (protocol.toLowerCase() == "erc20") {
                return true;
            } else if (!this.isTrc20 && this.currtItem?.frontType == 2) {
                return true
            }
            return false;
        },
        isTrc20: function () {
            // if (!this.curVirBankAddress) {
            //     return false;
            // }
            let protocol = this.curVirBankAddress?.protocol ? this.curVirBankAddress.protocol : "";
            if (protocol.toLowerCase() == "trc20") {
                return true;
            }
            return false;
        },
        isDDB: function () {
            // if (!this.curVirBankAddress) {
            //     return false;
            // }
            let protocol = this.curVirBankAddress?.protocol ? this.curVirBankAddress.protocol : "";
            if (protocol && protocol.toLowerCase() == "ddb") {
                return true;
            } else if (!this.isTrc20 && !this.isErc20 && this.currtItem?.frontType == 6) {
                return true
            }
            return false;
        },
        currtFee: function () {
            let fee = this.getCurrtFee();
            return fee;
        },
        actualArrivals: function () {
            return this.withdrawalAmount - this.getCurrtFee();
        },
        virActualArrivals: function () {
            return this.virWithdrawalAmount - this.getCurrtFee();
        },
        isBankType: function () {
            let flag = false;
            if (this.currtItem && (this.currtItem.frontType == 1 || this.currtItem.frontType == 5)) {
                flag = true;
            }
            return flag;
        },
        // 是虚拟币类型 & ddpay类型
        isVirtualType: function () {
            let flag = false;
            if (this.currtItem && (this.currtItem.frontType == 2 || this.currtItem.frontType == 6)) {
                flag = true;
            }
            return flag;
        }

    },
    filters: {
        get4Str(val) {
            let str = val ? val.toString() : "";
            if (str.length > 0) {
                str = str.substring(str.length - 4, str.length)
            }
            return str;
        },
        format(vlaue) {
            if (vlaue) {
                if (typeof (value) == "string") {
                    return formatAmount(Number(vlaue))
                }
                return formatAmount(vlaue);
            } else {
                return "0"
            }
        }
    },
    watch: {
        withdrawalPassword(val, old) {
            this.withdrawalPasswordVerif();
        },
        withdrawalAmount(val, old) {
            this.withdrawalAmountVerif();
        },
        currtBankName(val, old) {
            this.currtBankNameVerif();
        },
        userInfo(val, old) {
            this.realName = val.realName;
        },
        tel(val, old) {
            this.handleInputNum11();
        },
        vcode(val, old) {
            this.handleInputNum4();
        },
        telVir(val, old) {
            this.handleInputNum11Vir();
        },
        vcodeVir(val, old) {
            this.handleInputNum4Vir();
        },
    },
    created() {
        let that = this;
        // 动态store
        if (!store.state["drawStore"]) {
            thatStore.install(this);
        }
        // 动态store
        if (!store.state["bankCardStore"]) {
            bankCardStore.install(this);
        }
        // 获取银行卡列表
        this.getBankCardFun()
        // 获取价格区间
        this.getWithdrawRulerFun().then(() => {
            // 校验
            that.runCheckList()
            // 价格区间
            this.setMaxMinZoneFun()
        })
        // 获取银行列表
        this.getBankListFun()
        //  个人银行卡信息
        this.getCardListFun()
        // 获取取款配置
        this.getChargeConfigFun();
    },
    activated() {
        this.$setBuriedPoint('J10060');
    },
    mounted() {
        window.draw = this;
        //判断  银行卡--真实姓名   提款密码
        let that = this;
        this.readonlyFlay = false;//是否只读
        this.realName = this.userInfo.realName;
        // 获取通道列表
        this.getCurrencyTypeFun().then(res => {
            if (res && res.success) {
                this.currtItem = res.data[0]
                // 虚拟币协议
                this.getUsdtXieYiFun()
                // 限额-区间
                this.setMaxMinZoneFun()
            }
        });
        this.$setBuriedPoint('J10060');
        // 初始化粘贴板
        this.initClipboard();
        // 进行中的订单
        this.getOrderMsgFun()
    },
    methods: {
        ...mapMutations({
            setCurproto(commit, param) {
                return commit(`drawStore/SET_CURPROTO`, param);
            },
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
            // 获取银行卡信息
            getBankCardsFun(dispatch, param) {
                return dispatch(`drawStore/getBankCardsAction`, param);
            },
            // 获取银行卡限额
            getWithdrawRulerFun(dispatch, param) {
                return dispatch(`drawStore/getWithdrawRulerAction`, param);
            },
            // 提交
            drawSubmitFun(dispatch, param) {
                return dispatch(`drawStore/drawSubmitAction`, param);
            },
            // 校验
            withdrawalVerifFun(dispatch, param) {
                return dispatch(`drawStore/withdrawalVerifAction`, param);
            },
            // 查询用户信息--非安全
            getAssetsFun(dispatch, param) {
                return dispatch(`centerStore/getAssetsAction`, param);
            },
            getProvicesOrCitiesFun(dispatch, param) {
                return dispatch(`bankCardStore/getProvicesOrCitiesAction`, param);
            },
            // 检查银行卡归属定
            checkCardFun(dispatch, param) {
                return dispatch(`bankCardStore/checkCardAction`, param);
            },
            getBankListFun(dispatch, param) {
                return dispatch(`bankCardStore/getBankListAction`, param);
            },
            getCardListFun(dispatch, param) {
                return dispatch(`bankCardStore/getCardListAction`, param);
            },
            setWithdrawalInfo(dispatch, param) {
                return dispatch(`drawStore/withdrawalInfo`, param);
            },
            getVirtualAddressListAction(dispatch, param) {
                return dispatch(`drawStore/getVirBankList`, param);
            },
            // 获取虚拟币协议
            getUsdtXieYiAction(dispatch) {
                return dispatch(`drawStore/getUsdtProto`);
            },
            // 查询虚拟币汇率
            getHuiLvFun(dispatch, param) {
                return dispatch(`drawStore/getVirRate`, param);
            },
            virWithdrawalFun(dispatch, param) {
                return dispatch(`drawStore/virWithdrawal`, param);
            },
            getCurrencyTypeFun(dispatch) {
                return dispatch(`drawStore/getCurrencyType`);
            },
            // 获取取款配置
            getChargeConfigAction(dispatch) {
                return dispatch(`drawStore/getChargeConfigAction`);
            },
            // 取款中的订单列表
            getDrawOrderListAction(dispatch) {
                return dispatch(`drawStore/getDrawOrderListAction`);
            },
            // 查询进行中的订单
            getOrderMsgAction(dispatch) {
                return dispatch(`drawStore/getOrderMsgAction`);
            },

        }),
        spacesForma: spacesForma,
        checkTab(tab) {
            this.currtTab = tab;
        },
        // 完善个人信息
        openUserInfoDialog() {
            let showJump = {
                display: true,
                type: this.currtItem.frontType
            }
            // 银行卡
            if (this.isBankType) {
                if (!this.userInfo.mobileChecked || !this.userInfo.realName || !this.userInfo.bankSetStatus || !this.userInfo.withdrawSetStatus) {
                    // 弃用
                    this.$store.commit('drawStore/SET_SHOW_JUMP_DIALOG', showJump);
                } else {
                }
            }
            // 虚拟币
            if (this.currtItem.frontType == 2) {
                let param = {
                    vircurrency: this.currtVirtualItem.vircurrency
                }
                // 查询虚拟币汇率
                this.getHuiLvFun(param)
                // 虚拟地址列表
                this.getVirtualAddressListAction(param).then((res) => {
                    // 限额-区间
                    this.setMaxMinZoneFun()
                    // 虚拟币种类校验
                    this.checkVirTualType()
                    if (!this.userInfo.virBankSetStatus || !this.userInfo.withdrawSetStatus || !this.userInfo.mobileChecked) {
                        // 弃用
                        this.$store.commit('drawStore/SET_SHOW_JUMP_DIALOG', showJump);
                    } else {
                        if (this.curVirBankAddress && !this.curVirBankAddress.protocol) {
                            this.$store.commit('drawStore/SET_CURVIRBANKADDRESS', []);
                            window.win.tips.warning('您暂未绑定对应币种的提款地址信息。');
                        }
                    }

                })
            }
            // ddpay
            if (this.currtItem.frontType == 6) {
                let param = {
                    vircurrency: this.currtVirtualItem.vircurrency
                }
                // 虚拟地址列表
                this.getVirtualAddressListAction(param).then((res) => {
                    // 限额-区间
                    this.setMaxMinZoneFun()
                    if (this.curVirBankAddress && !this.curVirBankAddress.protocol) {
                        // 弃用
                        this.$store.commit('drawStore/SET_SHOW_JUMP_DIALOG', showJump);
                    }
                    // 虚拟币种类校验
                    this.checkVirTualType()
                    if (!this.userInfo.bankDDBSetStatus || !this.userInfo.withdrawSetStatus || !this.userInfo.mobileChecked) {
                        // 弃用
                        this.$store.commit('drawStore/SET_SHOW_JUMP_DIALOG', showJump);
                    } else {
                        if (this.curVirBankAddress && !this.curVirBankAddress.protocol) {
                            this.$store.commit('drawStore/SET_CURVIRBANKADDRESS', []);
                            window.win.tips.warning('您暂未绑定对应币种的提款地址信息。');
                        }
                    }
                })
            }
        },
        // 校验当前用户
        checkUserInfoFun() {
            this.realName = this.userInfo.realName;
            if (this.userInfo.mobileChecked == undefined) {
                this.getUserInfoFun().then((res) => {
                    this.openUserInfoDialog()
                })
            } else {
                this.openUserInfoDialog()
            }
        },
        // 限额-区间
        setMaxMinZoneFun() {
            if (this.drawLimtObj && this.drawLimtObj.length > 0) {
                this.drawLimtObj.forEach((val, key) => {
                    // 如果是银行卡 & 人民币 & 银行卡取款
                    if (this.isBankType && val.currency == 'CNY' && val.withdrawalTypeId == 1) {
                        this.$store.commit('drawStore/SET_DRAWMAX', val.singleMaxAmount)
                        this.$store.commit('drawStore/SET_DRAWMIN', val.singleMinAmount)

                        if (val.category == 3) {
                            this.withType = 1
                        } else if (val.category == 2) {
                            this.withType = 2
                        } else if (val.category == 1) {
                            this.withType = 1
                        }
                        if (val.fastAmount) {
                            this.withdrawFastArr = val.fastAmount.split(',')
                        }

                        this.withdrawBankObj = val
                    }
                    // 如果是 虚拟币
                    if (this.currtItem.frontType == 2 && val.currency == 'USDT' && val.withdrawalTypeId == 2 && this.curVirBankAddress.protocol == val.protocol) {
                        this.$store.commit('drawStore/SET_DRAWMAX', val.singleMaxAmount)
                        this.$store.commit('drawStore/SET_DRAWMIN', val.singleMinAmount)
                    }
                    // 如果是 ddpay
                    if (this.currtItem.frontType == 6 && this.curVirBankAddress.protocol == val.protocol) {
                        this.$store.commit('drawStore/SET_DRAWMAX', val.singleMaxAmount)
                        this.$store.commit('drawStore/SET_DRAWMIN', val.singleMinAmount)
                    }

                });
            }
        },
        selectCard(item) {
            this.currtCard = item;
            this.closeDialog()
        },
        selectVirAddress(item) {
            this.$store.commit('drawStore/SET_CURVIRBANKADDRESS', item);
            this.setMaxMinZoneFun()
            this.closeDialog()
        },
        closeDialog() {
            this.showDateDialogFlag = false;
        },

        selectBank(item) {
            this.bankName = item.name;
            this.currtBank = item;
            this.showCommonDialogFlag2 = false;
            this.bankNameVerif()
        },
        // 关闭弹框
        closeDialog2() {
            this.showDialog = false;
        },
        closeInfoDialog() {
            this.$store.commit('drawStore/SET_SHOW_INFO_DIALOG', false);
            this.$store.commit('drawStore/SET_SHOW_USDT_DIALOG', false);
        },
        // 关闭弹框
        closeJumpDialog() {
            this.showJumpDialog = false;
        },
        // 关闭弹框
        closeMsgDialog() {
            this.showMsgDialog = false;
        },
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
            if (!this.subFlagPwd) {
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
            this.setDrawPwdFun(param).then((res) => {
                this.isReqFlag = true;
                if (res && res.success) {
                    this.showDialog = false;
                    this.newWithdrawPwd = "";
                    this.confirmedPwd = "";
                    this.getUserInfoFun().then(() => {
                        this.checkdependent()
                    })
                }
            })
        },
        //
        get4StrFun(val) {
            let str = val ? val.toString() : "";
            if (str.length > 0) {
                str = str.substring(str.length - 4, str.length)
            }
            return str;
        },
        //
        turnAll() {
            let that = this;
            if (this.wallet.balance > 0) {
                this.withdrawalAmount = parseInt(this.wallet.balance).toString();
                this.virWithdrawalAmount = parseInt(this.wallet.balance).toString();
            }
            setTimeout(() => {
                this.runCheckList()
            }, 300)

        },

        // 提交前过滤
        drawSubmitBefore() {
            let amount = ''
            if (this.withType == 1 && this.isBankType) {
                amount = this.withdrawalAmount
            } else {
                amount = parseInt(this.withdrawalAmount)
            }
            let param = {
                amount: amount,
                password: mymd5(this.withdrawalPassword),
                bankId: this.currtCard.id,
                withdrawalTypeId: this.currtItem.id
            }
            // 校验
            this.runCheckList()
            // 校验
            if (!this.subFlagWithRmb) {
                window.win.tips.info(this.errorMsg);
                return;
            }

            if (this.withType == 1 && this.isBankType) {
                if (!param.amount) {
                    window.win.tips.info('请选择不为0的取款金额');
                    return;
                }
            } else {
                // 判断取款区间是否正确
                if (!(param.amount >= this.drawMin && param.amount <= this.drawMax)) {
                    window.win.tips.info(`请输入${this.drawMin} - ${this.drawMax}之间的取款金额!`);
                    return;
                }
            }

            // 开启手续费 + 本次需要
            if (this.chargeConfig.rmbChargeFlag && this.chargeConfig.rmbNeedChargeFlag) {
                this.msgType = 1;
                this.openChargeDialog();
            } else {
                this.drawSubmit();
            }


        },
        // 提交
        drawSubmit() {
            let that = this;
            let amount = ''
            if (this.withType == 1 && this.isBankType) {
                amount = this.withdrawalAmount
            } else {
                amount = parseInt(this.withdrawalAmount)
            }
            let param = {
                amount: amount,
                password: mymd5(this.withdrawalPassword),
                bankId: this.currtCard.id,
                withdrawalTypeId: this.currtItem.id
            }
            // 关闭提示弹框
            this.closeChargeDialog();
            // 校验
            this.runCheckList()
            // 校验
            if (!this.subFlagWithRmb) {
                window.win.tips.info(this.errorMsg);
                return;
            }
            if (this.withType == 1 && this.isBankType) {
                if (!param.amount) {
                    window.win.tips.info('请选择不为0的取款金额');
                    return;
                }
            } else {
                // 判断取款区间是否正确
                if (!(param.amount >= this.drawMin && param.amount <= this.drawMax)) {
                    window.win.tips.info(`请输入${this.drawMin} - ${this.drawMax}之间的取款金额!`);
                    return;
                }
            }

            // 判断是否是请求中
            if (this.isReqFlag) {
                this.isReqFlag = false;
            } else {
                return;
            }
            Object.assign(param, this.telCodeObj);
            this.drawSubmitFun(param).then((res) => {
                this.isReqFlag = true;
                this.resetTelObj();

                if (res && res.success) {
                    // smsSendFlag 1表示需要短信验证码，0或者null表示不需要
                    if (res.data.smsSendFlag == 1) {
                        this.telType = '14';
                        this.moduleName = "rmbDraw";
                        this.openTelDialog();
                    } else {
                        this.withdrawalAmount = "";
                        this.withdrawalPassword = "";
                        this.bankId = "";
                        //this.showMsgDialog = true;
                        // 判断是否拆单,提款金额拆分数量，1表示没有拆分，大于1的数表示已拆分
                        if (res.data.splitSize >= 1) {
                            this.splitSize = res.data.splitSize;
                        }
                        //刷新钱包
                        this.getAssetsFun()
                        this.runCheckList()
                        // 设置提醒配置
                        this.setResultConfigFun(res.data);
                        this.getChargeConfigFun()
                    }
                }
            })
        },


        // ---------------------------------------- 人民币取款 校验 start
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
                this.subFlagWithRmb = true;
                this.errorMsg = "";
            } else {
                this.subFlagWithRmb = false;
            }
        },
        //1 开户银行
        currtBankNameVerif() {
            let rule = Rule.init().rules.nonempty,
                bool = rule.reg.test(this.currtBankName);
            if (bool) {
                this.reg.currtBankName.isPass = true;
                this.reg.currtBankName.msg = "";
            } else {
                this.reg.currtBankName.isPass = false;
                this.reg.currtBankName.msg = "开户银行" + rule.desc;
                this.errorMsg = "开户银行" + rule.desc;
            }
            this.btnVerif();
        },
        //2 取款金额
        withdrawalAmountVerif() {
            if (this.withType == 1 && this.isBankType) {
                this.reg.withdrawalAmount.isPass = true;
                this.reg.withdrawalAmount.msg = "";
            } else {
                this.withdrawalAmount = this.withdrawalAmount.replace(/[^\d]/g, '')
                let rule = Rule.init().rules.money,
                    bool = rule.reg.test(this.withdrawalAmount);
                if (bool) {
                    this.reg.withdrawalAmount.isPass = true;
                    this.reg.withdrawalAmount.msg = "";
                } else {
                    this.reg.withdrawalAmount.isPass = false;
                    this.reg.withdrawalAmount.msg = rule.desc;
                    this.errorMsg = rule.desc;
                }
            }
            this.btnVerif();

        },
        //3 取款密码
        withdrawalPasswordVerif() {
            // 只能输入正整数
            this.withdrawalPassword = this.checkNum(this.withdrawalPassword);
            let rule = Rule.init().rules.drawPassWord,
                bool = rule.reg.test(this.withdrawalPassword);
            if (bool) {
                this.reg.withdrawalPassword.isPass = true;
                this.reg.withdrawalPassword.msg = "";
            } else {
                this.reg.withdrawalPassword.isPass = false;
                this.reg.withdrawalPassword.msg = rule.desc;
                this.errorMsg = rule.desc;
            }
            this.btnVerif();
        },

        // 执行校验 -- 倒序
        runCheckList() {
            this.withdrawalPasswordVerif();
            this.withdrawalAmountVerif();
            this.currtBankNameVerif();
        },
        // ---------------------------------------- 人民币取款 校验  end


        judgmVerif() {
            if (this.userInfo.mobileChecked) {
                this.subFlagTel = true
            }
            if (this.userInfo.realName) {
                this.subFlagBank = true;
            }
            if (this.userInfo.bankSetStatus) {
                this.subFlagBank = true;
            }
            if (this.userInfo.withdrawSetStatus) {
                this.subFlagPwd = true;
            }
            if (this.subFlagTel && this.subFlagBank && this.subFlagPwd) {
                this.subFlagInfoRmb = true
            }
        },
        // ---------------------------------------- 人民币完善 手机校验 start
        // 按钮校验
        btnVerifTel() {
            let goBut = [];
            // 先全部校验一次
            Object.keys(this.regtel).forEach((key, val) => {
                if (this.regtel[key].isPass) {
                    goBut.push(this.regtel[key].isPass);
                }
            });
            // 所有的校验通过
            if (goBut.length == Object.keys(this.regtel).length) {
                this.subFlagTel = true;
                this.errorMsg2 = "";
                this.judgmVerif()
            } else {
                this.subFlagTel = false;
            }
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
                this.regtel.tel.isPass = true;
                this.regtel.tel.msg = "";
            } else {
                this.regtel.tel.isPass = false;
                this.regtel.tel.msg = rule.desc;
                this.errorMsg = rule.desc;
            }
            this.btnVerifTel();
        },
        // 验证码校验
        vcodeVerif() {
            let rule = Rule.init().rules.vcode,
                bool = rule.reg.test(this.vcode);
            if (bool) {
                this.regtel.vcode.isPass = true;
                this.regtel.vcode.msg = "";
            } else {
                this.regtel.vcode.isPass = false;
                this.regtel.vcode.msg = rule.desc;
                this.errorMsg = rule.desc;
            }
            this.btnVerifTel();
        },
        // ---------------------------------------- 人民币完善 手机校验 end

        // ---------------------------------------- 取款密码 校验  start
        // 按钮校验
        btnVerifPwd() {
            let goBut = [];
            // 先全部校验一次
            Object.keys(this.regPwd).forEach((key, val) => {
                if (this.regPwd[key].isPass) {
                    goBut.push(this.regPwd[key].isPass);
                }
            });
            // 所有的校验通过
            if (goBut.length == Object.keys(this.regPwd).length) {
                this.subFlagPwd = true;
                this.errorMsg2 = "";
                this.judgmVerif()
            } else {
                this.subFlagPwd = false;
            }
        },
        //2-1 取款新密码
        newWithdrawPwdVerif() {
            this.newWithdrawPwd = this.checkNum(this.newWithdrawPwd);

            let rule = Rule.init().rules.drawPassWord,
                bool = rule.reg.test(this.newWithdrawPwd);
            if (bool) {
                this.regPwd.newWithdrawPwd.isPass = true;
                this.regPwd.newWithdrawPwd.msg = "";
            } else {
                this.regPwd.newWithdrawPwd.isPass = false;
                this.regPwd.newWithdrawPwd.msg = rule.desc;
                this.errorMsg2 = rule.desc;
            }
            this.btnVerifPwd();
        },
        //2-2 取款确认密码
        confirmedPwdVerif() {
            this.confirmedPwd = this.checkNum(this.confirmedPwd);
            let rule = Rule.init().rules.drawPassWord,
                bool = rule.reg.test(this.confirmedPwd);
            if (bool) {
                this.regPwd.confirmedPwd.isPass = true;
                this.regPwd.confirmedPwd.msg = "";
            } else {
                this.regPwd.confirmedPwd.isPass = false;
                this.regPwd.confirmedPwd.msg = rule.desc;
                this.errorMsg2 = rule.desc;
            }
            this.btnVerifPwd();
        },
        // ---------------------------------------- 取款密码 校验  end


        // ---------------------------------------- 银行卡真实姓名 校验  start
        // 按钮校验
        btnVerifBank() {
            let goBut = [];
            // 先全部校验一次
            Object.keys(this.regInfo).forEach((key, val) => {
                if (this.regInfo[key].isPass) {
                    goBut.push(this.regInfo[key].isPass);
                }
            });
            // 所有的校验通过
            if (goBut.length == Object.keys(this.regInfo).length) {
                this.subFlagBank = true;
                this.errorMsg2 = "";
                this.judgmVerif()
            } else {
                this.subFlagBank = false;
            }
        },
        // 银行卡校验
        bankCardVerif() {
            let card = this.bankCard.replace(/\s/g, "");
            if (!card) {
                this.bankCard = "";
            } else {
                this.bankCard = this.spacesForma(card);
            }
            let rule = Rule.init().rules.bankCard,
                bool = rule.reg.test(card);

            if (bool) {
                this.regInfo.bankCard.isPass = true;
                this.regInfo.bankCard.msg = "";
            } else {
                this.regInfo.bankCard.isPass = false;
                this.regInfo.bankCard.msg = rule.desc;
                this.errorMsg = rule.desc;
            }
            this.btnVerifBank();
        },
        // 失去焦点的时候,查询银行卡归属地&银行;
        bankCardOnBlur() {
            // 当银行卡的位数大于16位的时候 进行查询;
            let card = this.bankCard.replace(/\s+/g, "");
            if (card && card.length >= 16) {
                // 查询接口
                this.checkCardFun({cardNo: card}).then(res => {
                    // 赋值 provinceCode  cityCode
                    this.pvorvince = {"name": res.data.province, "code": res.data.provinceId};
                    this.city = {"name": res.data.city, "id": res.data.cityId};
                    this.getBankById(res.data.bankId);
                    // 校验
                    this.pvorvinceVerif()
                    this.cityVerif()
                    this.bankNameVerif()
                })
            }
        },

        // 获取银行卡
        getBankById(id) {
            let currt = "";
            this.bankList.forEach(item => {
                if (item.id == id) {
                    currt = item;
                    return;
                }
            })
            if (currt) {
                this.selectBank(currt);
            }
        },
        // 银行校验
        bankNameVerif() {
            let rule = Rule.init().rules.cn,
                bool = rule.reg.test(this.bankName);
            if (bool) {
                this.regInfo.bankName.isPass = true;
                this.regInfo.bankName.msg = "";
            } else {
                this.regInfo.bankName.isPass = false;
                this.regInfo.bankName.msg = "开户银行" + rule.desc;
                this.errorMsg = "开户银行" + rule.desc;
            }
            this.btnVerifBank();
        },
        // 省份校验
        pvorvinceVerif() {
            let rule = Rule.init().rules.cn,
                bool = rule.reg.test(this.pvorvince.name);
            if (bool) {
                this.regInfo.pvorvince.isPass = true;
                this.regInfo.pvorvince.msg = "";
            } else {
                this.regInfo.pvorvince.isPass = false;
                this.regInfo.pvorvince.msg = "省份" + rule.desc;
                this.errorMsg = "省份" + rule.desc;
            }
            this.btnVerifBank();
        },
        //城市校验
        cityVerif() {
            let rule = Rule.init().rules.cn,
                bool = rule.reg.test(this.city.name);
            if (bool) {
                this.regInfo.city.isPass = true;
                this.regInfo.city.msg = "";
            } else {
                this.regInfo.city.isPass = false;
                this.regInfo.city.msg = "城市" + rule.desc;
                this.errorMsg = "城市" + rule.desc;
            }
            this.btnVerifBank();
        },
        // 真实姓名校验
        realNameVerif() {
            let rule = Rule.init().rules.realName,
                bool = rule.reg.test(this.realName);
            if (bool) {
                this.regInfo.realName.isPass = true;
                this.regInfo.realName.msg = "";
            } else {
                this.regInfo.realName.isPass = false;
                this.regInfo.realName.msg = "真实姓名" + rule.desc;
                this.errorMsg = "真实姓名" + rule.desc;
            }
            this.btnVerifBank();
        },
        bankFeatherVerif() {
            let rule = Rule.init().rules.nonempty,
                bool = rule.reg.test(this.bankFeather) && typeof (this.bankFeather) != "undefined";
            if (bool) {
                this.regInfo.bankFeather.isPass = true;
                this.regInfo.bankFeather.msg = "";
            } else {
                this.regInfo.bankFeather.isPass = false;
                this.regInfo.bankFeather.msg = "真实姓名" + rule.desc;
                this.errorMsg = "真实姓名" + rule.desc;
            }
            this.btnVerifBank();
        },
        // ---------------------------------------- 银行卡真实姓名 校验  end


        // ---------------------------------------- 虚拟币完善资料
        judgmVerifVir() {
            if (this.userInfo.mobileChecked) {
                this.subFlagTelVir = true
            }
            if (this.userInfo.virBankSetStatus) {
                this.subFlagVirAddress = true
            }
            if (this.userInfo.withdrawSetStatus) {
                this.subFlagPwdVir = true;
            }
            if (this.subFlagVirAddress && this.subFlagPwdVir && this.subFlagTelVir) {
                this.subFlagInfoVir = true
            }
        },

        // ---------------------------------------- 人民币完善 手机校验 start
        // 按钮校验
        btnVerifVirTel() {
            let goBut = [];
            // 先全部校验一次
            Object.keys(this.regtel).forEach((key, val) => {
                if (this.regtel[key].isPass) {
                    goBut.push(this.regtel[key].isPass);
                }
            });
            // 所有的校验通过
            if (goBut.length == Object.keys(this.regtel).length) {
                this.subFlagTelVir = true;
                this.errorMsg2 = "";
                this.judgmVerifVir()
            } else {
                this.subFlagTelVir = false;
            }
        },
        // 校验入口
        handleInputNum11Vir(e) { // 通过正则过滤小数点后两位
            if (e) {
                let n = 13
                resNum(e, n)
                this.telVir = resNum(e, n)
            }
            this.telVerifVir();
        },
        // 校验入口
        handleInputNum4Vir(e) { // 验证码过滤
            if (e) {
                let n = 4
                resNum(e, n)
                this.vcode = resNum(e, n)
            }
            this.vcodeVerifVir();
        },
        // 手机号码
        telVerifVir() {
            let mobile = this.telVir ? this.telVir.replace(/\s/g, "") : "";
            if (!mobile) {
                this.telVir = "";
            } else {
                this.telVir = this.spacesForma(mobile);
            }
            let rule = Rule.init().rules.tel,
                bool = rule.reg.test(mobile);
            if (bool) {
                this.regtel.tel.isPass = true;
                this.regtel.tel.msg = "";
            } else {
                this.regtel.tel.isPass = false;
                this.regtel.tel.msg = rule.desc;
                this.errorMsg = rule.desc;
            }
            this.btnVerifVirTel();
        },
        // 验证码校验
        vcodeVerifVir() {
            let rule = Rule.init().rules.vcode,
                bool = rule.reg.test(this.vcodeVir);
            if (bool) {
                this.regtel.vcode.isPass = true;
                this.regtel.vcode.msg = "";
            } else {
                this.regtel.vcode.isPass = false;
                this.regtel.vcode.msg = rule.desc;
                this.errorMsg = rule.desc;
            }
            this.btnVerifVirTel();
        },
        // ---------------------------------------- 人民币完善 手机校验 end


        selectVirCur(item) {
            // 虚拟币
            if(this.currtItem.frontType == 2){
                this.$store.commit('drawStore/SET_CURPROTOLIST', item);
                this.$store.commit('drawStore/SET_CURPROTO', item.protocols[0]);
            }
            // DDB
            if(this.currtItem.frontType == 6){
                this.$store.commit('drawStore/SET_CURPROTOLIST', {"vircurrency": "DDB", "protocols": [{"protocol": "DDB"}]});
                this.$store.commit('drawStore/SET_CURPROTO',{"protocol": "DDB"});
            }

            this.newWithdrawPwdVerif()
            this.usdtAddressVerif()
        },
        selectProtoCur(item) {
            this.$store.commit('drawStore/SET_CURPROTO', item);
            this.newWithdrawPwdVerif()
            this.usdtAddressVerif()
        },
        // ---------------------------------------- 虚拟币完善资料--- 地址 ---  start
        // 按钮校验
        btnVerifVirAddress() {
            let goBut = [];
            // 先全部校验一次
            Object.keys(this.regVirAdd).forEach((key, val) => {
                if (this.regVirAdd[key].isPass) {
                    goBut.push(this.regVirAdd[key].isPass);
                }
            });
            // 所有的校验通过
            if (goBut.length == Object.keys(this.regVirAdd).length) {
                this.subFlagVirAddress = true;
                this.errorMsg2 = "";
                this.judgmVerifVir()
            } else {
                this.subFlagVirAddress = false;
            }
        },

        usdtAddressVerif() { // 虚拟币地址验证
            if (!this.usdtAddress) {
                this.protoAddMsg = "";
                this.regVirAdd.usdtAddress.msg = ""
                this.regVirAdd.usdtAddress.isPass = false;
                this.subFlagVirAddress = false;
                return
            }
            if (this.currtItem.frontType == 6) {
                this.setCurproto({protocol: "DDB"})
                // this.
                this.protoAddMsg = "";
            }
            this.protoAddVerif()

            let rule = Rule.init().rules.nonempty,
                bool = rule.reg.test(this.usdtAddress);
            if (bool) {
                this.regVirAdd.usdtAddress.isPass = true;
                this.regVirAdd.usdtAddress.msg = "";
                this.subFlagVirAddress = true;
            } else {
                this.regVirAdd.usdtAddress.isPass = false;
                this.regVirAdd.usdtAddress.msg = "虚拟币地址" + rule.desc;
                this.errorMsg = "虚拟币地址" + rule.desc;
                this.subFlagVirAddress = false;
            }
            this.btnVerifVirAddress();
        },
        // ---------------------------------------- 虚拟币完善资料 --- 地址---  end

        protoAddVerif() {
            if (this.curProto.protocol == 'ERC20') {
                var protoVer = this.usdtAddress.substring(0, 2)
                if (protoVer.toLowerCase() != '0x') {
                    this.protoAddMsg = "您填写的地址非标准ERC20地址";
                } else {
                    this.protoAddMsg = "";
                }
            } else if (this.curProto.protocol == 'TRC20') {
                var protoVer = this.usdtAddress.substring(0, 1)
                if (protoVer.toLowerCase() != 't') {
                    this.protoAddMsg = "您填写的地址非标准TRC20地址";
                } else {
                    this.protoAddMsg = "";
                }
            } else {
                this.protoAddMsg = "";
            }
        },

        // ---------------------------------------- 取款密码 校验  start
        // 按钮校验
        btnVerifPwdVir() {
            let goBut = [];
            // 先全部校验一次
            Object.keys(this.regPwd).forEach((key, val) => {
                if (this.regPwd[key].isPass) {
                    goBut.push(this.regPwd[key].isPass);
                }
            });
            // 所有的校验通过
            if (goBut.length == Object.keys(this.regPwd).length) {
                this.subFlagPwdVir = true;
                this.errorMsg2 = "";
                this.judgmVerifVir()
            } else {
                this.subFlagPwdVir = false;
            }
        },
        //2-1 取款新密码
        newWithdrawPwdVerifVir() {
            this.newWithdrawPwdVir = this.checkNum(this.newWithdrawPwdVir);

            let rule = Rule.init().rules.drawPassWord,
                bool = rule.reg.test(this.newWithdrawPwdVir);
            if (bool) {
                this.regPwd.newWithdrawPwd.isPass = true;
                this.regPwd.newWithdrawPwd.msg = "";
            } else {
                this.regPwd.newWithdrawPwd.isPass = false;
                this.regPwd.newWithdrawPwd.msg = rule.desc;
                this.errorMsg2 = rule.desc;
            }
            this.btnVerifPwdVir();
        },
        //2-2 取款确认密码
        confirmedPwdVerifVir() {
            this.confirmedPwd = this.checkNum(this.confirmedPwdVir);
            let rule = Rule.init().rules.drawPassWord,
                bool = rule.reg.test(this.confirmedPwdVir);
            if (bool) {
                this.regPwd.confirmedPwd.isPass = true;
                this.regPwd.confirmedPwd.msg = "";
            } else {
                this.regPwd.confirmedPwd.isPass = false;
                this.regPwd.confirmedPwd.msg = rule.desc;
                this.errorMsg2 = rule.desc;
            }
            this.btnVerifPwdVir();
        },
        // ---------------------------------------- 取款密码 校验  end


        // 执行校验 -- 倒序
        runCheckList2() {
            this.confirmedPwdVerif();
            this.newWithdrawPwdVerif();
        },
        checkFun() {
            let that = this;
            this.withdrawalVerifFun().then((res) => {
                if (res && res.success) {
                    that.checkFlag = "";
                } else {

                    if (res.code == 20331) { // 未完成手机验证
                        that.checkFlag = 20331;
                    }
                    if (res.code == 20330) { // 未绑定真实姓名 -- 显示跳转弹框
                        that.checkFlag = 20330;
                    }
                    if (res.code == 20325) { //绑定银行卡 -- 显示跳转弹框
                        that.checkFlag = 20325;
                    }
                    if (res.code == 20326) { // 取款密码
                        that.checkFlag = 20326;
                    }
                    // that.showJumpDialog = true;
                }
            })
        },
        jumpPage() {
            this.showJumpDialog = false;
            if (this.checkFlag == 20330) { // 真实姓名
                this.goPage('/center/userinfo', {tab: 1})
                this.$root.eventHub.$emit('userTab', 1);
            } else if (this.checkFlag == 20325) { // 银行卡
                this.goPage('/center/userinfo', {tab: 3})
                this.$root.eventHub.$emit('userTab', 3);
            } else if (this.checkFlag == 20326) { // 取款密码
                this.showDialog = true;
            } else if (this.checkFlag == 20331) { // 手机号码
                this.goPage('/center/userinfo', {tab: 2})
                this.$root.eventHub.$emit('userTab', 2);
            }
        },
        goPage(path, param) {
            this.$router.push({path: path, query: param})
        },
        // 只能输入正整数
        checkNum(num) {
            num = num.replace(/[^\d]/g, '').replace(/\./g, ''); // 清除“数字”和“.”以外的字符
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
        // 选择取款方式
        selectCurrtItem(item) {
            // 如果是当前货币 则返回;
            if (this.currtItem.name == item.name) {
                return;
            }
            this.resetPageData()
            this.currtItem = item;
            this.getUsdtXieYiFun()
        },
        // 选择虚拟币种类
        selectCurrtVirtual(item) {
            // 如果是当前货币 则返回;
            this.checkVirTualType()
            if (this.currtVirtualItem.vircurrency == item.vircurrency) {
                return;
            }
            this.resetPageData()
            this.currtVirtualItem = item;
            let param = {
                vircurrency: this.currtVirtualItem.vircurrency
            }
            // 获取虚拟币协议
            this.getHuiLvFun(param)
            // 获取虚拟地址
            this.getVirtualAddressListAction(param).then((res) => {
                if (res.data.length <= 0) {
                    this.$store.commit('drawStore/SET_CURVIRBANKADDRESS', []);
                    window.win.tips.warning('您暂未绑定对应币种的提款地址信息。');
                }
            })
        },
        getSmsg(v) {
            this.sessMsg = true
        },

        selectPvorvince(item) {
            this.pvorvince = item;
            this.city = {}
            this.checkTab(2)
            this.pvorvinceVerif()
            // 查询对应的市
            // this.getProvicesOrCitiesFun({parentId: item.code, command: 2})
        },
        selectCity(item) {
            this.city = item;
            this.closePvinDialog()
            this.cityVerif()
        },
        closePvinDialog() {
            this.showCommonDialogFlag1 = false;
            this.showCommonDialogFlag2 = false;
        },
        toggleDialog1() {
            this.closePvinDialog();
            this.showCommonDialogFlag1 = !this.showCommonDialogFlag1;
            this.checkTab(1)
        },
        toggleDialog2() {
            this.closePvinDialog();
            this.showCommonDialogFlag2 = !this.showCommonDialogFlag2;
        },
        checkDefault() {
            if (!this.isFirstCard) {
                this.isDefault = !this.isDefault;
            }
        },
        submitBefore() {
            // 取款密码状态
            if (!this.userInfo.withdrawSetStatus && this.userInfo.mobileChecked) {
                this.telType = '29';
                this.moduleName = "usdtDialog";
                this.openTelDialog();
            } else if ((!this.userInfo.virBankSetStatus || !this.userInfo.bankDDBSetStatus) && this.userInfo.mobileChecked) {
                this.telType = '29';
                this.moduleName = "usdtDialog";
                this.openTelDialog();
            }  else {
                this.submit();
            }
        },
        submit() {
            let mobile = this.telVir
            let param = {}
            if (!this.userInfo.mobileChecked) { // 手机号码是否验证
                let mobPro = {
                    mobileCheckVO: { // 玩家手机认证信息
                        verifyCode: this.vcodeVir,  // 验证码
                        mobile: mobile.replace(/\s/g, "") // 手机号码
                        // ticket:3,  // 防水码ticket
                        // randstr:4  // 防水码randstr
                    }
                }
                param = Object.assign(param, mobPro)
            } else {
                param = Object.assign(param, {
                    verifyCode: this.telCodeObj.verifyCode,  // 验证码
                    mobile: this.telCodeObj.mobile // 手机号码
                })
            }


            if (!this.userInfo.virBankSetStatus) { //虚拟币地址是否验证
                let virObj = {
                    virBankVO: { //
                        vircurrency: this.curProtoList.vircurrency,  // 虚拟币币种
                        protocol: this.curProto.protocol, // 虚拟币支持的公链协议或网络。根据虚拟币种不同，校验条件不同
                        virAddress: this.usdtAddress, // 虚拟币地址
                        defaultable: this.isDefault, // 是否默认 true 表示“是”，false表示“否”
                    }
                }
                param = Object.assign(param, virObj)
            }
            if (!this.userInfo.bankDDBSetStatus) { //DDB虚拟币地址是否验证
                let virObj = {
                    virBankVO: { //
                        vircurrency: 'DDB',  // 虚拟币币种
                        protocol: 'DDB', // 虚拟币支持的公链协议或网络。根据虚拟币种不同，校验条件不同
                        virAddress: this.usdtAddress, // 虚拟币地址
                        defaultable: this.isDefault, // 是否默认 true 表示“是”，false表示“否”
                    }
                }
                param = Object.assign(param, virObj)
            }
            if (!this.userInfo.withdrawSetStatus) { // 设置您的取款密码
                let witPsd = {
                    withdrawalPwdMap: {  // 提款密码认证信息
                        newWithdrawPwd: mymd5(this.newWithdrawPwdVir), // 新提款密码
                        confirmedPwd: mymd5(this.confirmedPwdVir), // 确认提款密码
                        mobileVerifyCode: this.telCodeObj.verifyCode, // 短信验证码
                    }
                }
                param = Object.assign(param, witPsd)
            }
            this.setWithdrawalInfo(param).then(res => {
                this.resetTelObj();
                if (res && res.success) {
                    this.getUserInfoFun()
                    let param = {
                        vircurrency: this.currtVirtualItem.vircurrency
                    }
                    this.getVirtualAddressListAction(param)
                    this.$store.commit('drawStore/SET_SHOW_USDT_DIALOG', false);
                    // let showJump = {
                    //     display:false,
                    //     type: this.currtVirtual.id
                    // }
                    // this.$store.commit('drawStore/SET_SHOW_JUMP_DIALOG', showJump);


                }
            })
        },
        withdrawalInfoBefore() {
            // 取款密码状态
            if ((!this.userInfo.withdrawSetStatus || !this.userInfo.bankSetStatus || !this.userInfo.realName) && this.userInfo.mobileChecked) {
                this.telType = '29';
                this.moduleName = "rmbDialog";
                this.openTelDialog();
            } else {
                this.withdrawalInfo();
            }
        },
        withdrawalInfo() { // 完善人民币取款资料
            let mobile = this.tel
            let param = {}
            if (!this.userInfo.mobileChecked) { // 手机号码是否验证
                let mobPro = {
                    mobileCheckVO: { // 玩家手机认证信息
                        verifyCode: this.vcode,  // 验证码
                        mobile: mobile.replace(/\s/g, "") // 手机号码
                        // ticket:3,  // 防水码ticket
                        // randstr:4  // 防水码randstr
                    }
                }
                param = Object.assign(param, mobPro)
            } else {
                param = Object.assign(param, {
                    verifyCode: this.telCodeObj.verifyCode,  // 验证码
                    mobile: this.telCodeObj.mobile // 手机号码
                })
            }
            if (!this.userInfo.realName) { // 用户名是否验证
                let remProd = {
                    realNameCheckVO: {  // 玩家身份信息
                        realName: this.realName // 真实姓名
                    }
                }
                param = Object.assign(param, remProd)
            }
            if (!this.userInfo.bankSetStatus) { // 绑定真实银行卡
                let bankcard = {
                    playerBankCardVO: {  // 玩家银行卡认证信息
                        playerId: 1,  // 玩家id
                        cardNo: this.bankCard.replace(/\s/g, ""),   // 银行卡号
                        bankName: this.currtBank.name,  // 银行名称
                        bankId: this.currtBank.id,  // 银行id
                        province: this.pvorvince.name,  // 省名称
                        city: this.city.name,   // 市名称
                        address: this.bankFeather,  // 支行名称
                        accountName: this.realName,  // 开户名
                        defaultable: this.isDefault,  // 是否市默认银行卡，true表示是，false表示不是
                        cityId: this.city.id,  // 市id
                        provinceId: this.pvorvince.code // 省id
                    }
                }
                param = Object.assign(param, bankcard)
            }
            if (!this.userInfo.withdrawSetStatus) { // 设置您的取款密码
                let witPsd = {
                    withdrawalPwdMap: {  // 提款密码认证信息
                        newWithdrawPwd: mymd5(this.newWithdrawPwd), // 新提款密码
                        confirmedPwd: mymd5(this.confirmedPwd), // 确认提款密码
                        mobileVerifyCode: this.telCodeObj.verifyCode, // 短信验证码
                    }
                }
                param = Object.assign(param, witPsd)
            }
            this.setWithdrawalInfo(param).then(res => {
                this.resetTelObj();
                if (res && res.success) {
                    this.getUserInfoFun()
                    this.getBankCardsFun().then(res => {
                        if (res && res.success) {
                            // that.checkFun();
                            res.data.forEach(item => {
                                if (item.defaultable) {
                                    this.currtCard = item;
                                }
                            })
                        }
                    })
                    this.$store.commit('drawStore/SET_SHOW_INFO_DIALOG', false);

                }
            })
        },
        // 获取虚拟币协议
        getUsdtXieYiFun() {
            // 清空当前协议
            this.currtVirtualItem = {}
            // 判断是否是ddpay
            if (this.currtItem.frontType == 6) {
                this.currtVirtualItem = {"vircurrency": "DDB", "protocols": [{"protocol": "DDB"}]}
                this.checkUserInfoFun()
                this.setMaxMinZoneFun()
            } else if (this.currtItem.frontType == 2) {
                this.getUsdtXieYiAction().then((res) => {
                    this.currtVirtualItem = res.data.records[0]
                    this.checkUserInfoFun()
                    this.setMaxMinZoneFun()
                })
            }else{
                this.checkUserInfoFun()
                this.setMaxMinZoneFun()
            }
        },
        getTateAmount() {
            return (this.virWithdrawalAmount / this.virRate).toFixed(2)
        },
        // 提交前过滤
        drawVirSubmitBefore() {
            let param = {
                vircurrency: this.currtVirtualItem.vircurrency,  // 虚拟币币种
                virAddress: this.curVirBankAddress.virAddress,  // 虚拟币地址
                password: mymd5(this.withdrawalPassword),  // 取款密码
                withdrawalTypeId: this.currtItem.id,  // 提款通道ID
                protocol: this.curVirBankAddress.protocol,  // 协议
                amount: parseInt(this.virWithdrawalAmount),  // 额度
            }
            // 校验
            this.runCheckVirList()
            // 校验
            if (!this.subFlagWithRir) {
                window.win.tips.info(this.errorMsg2);
                return;
            }
            // 判断取款区间是否正确
            if (!(param.amount >= this.drawMin && param.amount <= this.drawMax)) {
                window.win.tips.info(`请输入${this.drawMin} - ${this.drawMax}之间的取款金额!`);
                return;
            }
            // 当前协议
            let currtProtocol = this.getProtocol();
            if (currtProtocol == "erc20") {
                // 开启手续费 + 本次需要
                if (this.chargeConfig.erc20ChargeFlag && this.chargeConfig.erc20NeedChargeFlag) {
                    this.msgType = 1;
                    this.openChargeDialog();
                } else {
                    this.drawVirSubmit()
                }
            } else if (currtProtocol == "trc20") {
                // 开启手续费 + 本次需要
                if (this.chargeConfig.trc20ChargeFlag && this.chargeConfig.trc20NeedChargeFlag) {
                    this.msgType = 1;
                    this.openChargeDialog();
                } else {
                    this.drawVirSubmit()
                }
            } else {
                // 如果是ddpay 开启手续费 + 本次需要
                if (this.chargeConfig.ddbChargeFlag && this.chargeConfig.ddbNeedChargeFlag) {
                    this.msgType = 1;
                    this.openChargeDialog();
                } else {
                    this.drawVirSubmit()
                }
            }

        },
        // 提交
        drawVirSubmit() {
            let that = this;
            let param = {
                vircurrency: this.currtVirtualItem.vircurrency,  // 虚拟币币种
                virAddress: this.curVirBankAddress.virAddress,  // 虚拟币地址
                password: mymd5(this.withdrawalPassword),  // 取款密码
                withdrawalTypeId: this.currtItem.id,  // 提款通道ID
                protocol: this.curVirBankAddress.protocol,  // 协议
                amount: parseInt(this.virWithdrawalAmount),  // 额度
            }
            // 关闭提示弹框
            this.closeChargeDialog();
            // 校验
            this.runCheckVirList()
            // 校验
            if (!this.subFlagWithRir) {
                window.win.tips.info(this.errorMsg);
                return;
            }
            // 判断取款区间是否正确
            if (!(param.amount >= this.drawMin && param.amount <= this.drawMax)) {
                window.win.tips.info(`请输入${this.drawMin} - ${this.drawMax}之间的取款金额!`);
                return;
            }

            // 判断是否是请求中
            if (this.isReqFlag) {
                this.isReqFlag = false;
            } else {
                return;
            }
            Object.assign(param, this.telCodeObj);
            this.virWithdrawalFun(param).then(res => {
                this.isReqFlag = true;
                this.resetTelObj();
                if (res && res.success) {
                    // smsSendFlag 1表示需要短信验证码，0或者null表示不需要
                    if (res.data.smsSendFlag == 1) {
                        this.telType = '14';
                        this.moduleName = "usdtDraw";
                        this.openTelDialog();
                    } else {
                        this.resetPageData()
                        //this.showMsgDialog = true;
                        // 判断是否拆单,提款金额拆分数量，1表示没有拆分，大于1的数表示已拆分
                        if (res.data.splitSize >= 1) {
                            this.splitSize = res.data.splitSize;
                        }
                        //刷新钱包
                        this.getAssetsFun()
                        this.runCheckVirList()
                        // 设置提醒配置
                        this.setResultConfigFun(res.data);
                        this.getChargeConfigFun()
                    }
                }
            })
        },

        //1
        resetPageData() { // 重置取款数据
            // this.currtBankName = ''
            this.withdrawalAmount = ''
            this.withdrawalPassword = ''
            this.virWithdrawalAmount = ''
            this.withdrawalPassword = ''
            this.subFlagWithRir = false
            this.subFlagWithRmb = false
        },

        toggleBankDialog() {
            if(this.userInfo.bankSetStatus){
                this.showDateDialogFlag = !this.showDateDialogFlag;
                this.virAddressVerif()
            }
        },
        toggleDialog() {
            if(this.userInfo.virBankSetStatus){
                this.showDateDialogFlag = !this.showDateDialogFlag;
                this.virAddressVerif()
            }
        },


        // ---------------------------------------- 虚拟币存款 校验  start
        // 执行校验 -- 倒序
        runCheckVirList() {
            this.checkVirTualType()
            this.virAddressVerif()
            this.virWithdrawPwdVerif()
            this.virAmount()
        },

        // 按钮校验
        btnVerifVirWith() {
            let goBut = [];
            // 先全部校验一次
            Object.keys(this.regVirWith).forEach((key, val) => {
                if (this.regVirWith[key].isPass) {
                    goBut.push(this.regVirWith[key].isPass);
                }
            });
            // 所有的校验通过
            if (goBut.length == Object.keys(this.regVirWith).length) {
                this.subFlagWithRir = true;
                this.errorMsg = "";
            } else {
                this.subFlagWithRir = false;
            }
        },
        //3-1 虚拟币种类校验
        checkVirTualType() {
            let virCur = this.currtVirtualItem.vircurrency,
                rule = Rule.init().rules.nonempty,
                bool = rule.reg.test(virCur) && typeof (virCur) != "undefined";
            if (bool) {
                this.regVirWith.curVirType.isPass = true;
                this.regVirWith.curVirType.msg = "";
            } else {
                this.regVirWith.curVirType.isPass = false;
                this.regVirWith.curVirType.msg = rule.desc;
                this.errorMsg2 = rule.desc;
            }
            this.btnVerifVirWith();
        },
        //3-3 虚拟币地址校验
        virAddressVerif() {
            let address = this.curVirBankAddress.virAddress,
                rule = Rule.init().rules.nonempty,
                bool = rule.reg.test(address) && typeof (address) != "undefined";
            if (bool) {
                this.regVirWith.usdtAddress.isPass = true;
                this.regVirWith.usdtAddress.msg = "";
            } else {
                this.regVirWith.usdtAddress.isPass = false;
                this.regVirWith.usdtAddress.msg = rule.desc;
                this.errorMsg2 = '账户地址不能为空！';
            }
            this.btnVerifVirWith();
        },
        //3-3 取款密码
        virWithdrawPwdVerif() {
            let rule = Rule.init().rules.wpwd,
                bool = rule.reg.test(this.withdrawalPassword);
            if (bool) {
                this.regVirWith.withdrawalPassword.isPass = true;
                this.regVirWith.withdrawalPassword.msg = "";
                this.checkVirTualType();
                this.virAddressVerif();
            } else {
                this.regVirWith.withdrawalPassword.isPass = false;
                this.regVirWith.withdrawalPassword.msg = rule.desc;
                this.errorMsg2 = '请输入正确的取款密码！';
            }

            this.btnVerifVirWith();
        },
        //3-4 取款金额
        virAmount() {
            let rule = Rule.init().rules.wAmount,
                bool = rule.reg.test(this.virWithdrawalAmount);
            if (bool) {
                this.regVirWith.withdrawalAmount.isPass = true;
                this.regVirWith.withdrawalAmount.msg = "";
                this.checkVirTualType();
                this.virAddressVerif();
            } else {
                this.regVirWith.withdrawalAmount.isPass = false;
                this.regVirWith.withdrawalAmount.msg = rule.desc;
                this.errorMsg2 = rule.desc;
            }
            this.btnVerifVirWith();
        },
        // ---------------------------------------- 虚拟币存款 校验  end

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
            if (this.telCodeObj.moduleName == 'usdtDialog') { // 虚拟币信息认证
                this.submit();
            } else if (this.telCodeObj.moduleName == 'rmbDialog') { // 人民币信息认证
                this.withdrawalInfo();
            } else if (this.telCodeObj.moduleName == 'usdtDraw') { // 虚拟币取款
                this.drawVirSubmit();
            } else if (this.telCodeObj.moduleName == 'rmbDraw') { // 人民币取款
                this.drawSubmit();
            }
        },
        // 重置手机验证对象
        resetTelObj() {
            this.telCodeObj = {
                moduleName: '',// usdtDialog:1  rmbDialog:2    usdtDraw:3  rmbDraw:4
                mobile: '', // 手机号码
                verifyCode: '',// 验证码
                checkFlag: false,// 验证状态
            };
        },
        // 当前虚拟币协议
        getProtocol() {
            let protocol = this.curVirBankAddress.protocol ? this.curVirBankAddress.protocol : "";
            return protocol.toLowerCase();
        },
        // 关闭消息弹框
        closeChargeDialog() {
            this.chargeDialogFlag = false;
        },
        // 开启消息弹框
        openChargeDialog() {
            this.chargeDialogFlag = true;
        },
        // 获取取款配置
        getChargeConfigFun() {
            // let res = {
            //     "code": 200,
            //     "success": true,
            //     "data": [{
            //         feeFlag: true, // 是否开启手续费
            //         needChargeFlag:true,//本比订单是否需要手续：true 收费 false 免费
            //         currency:"CNY",// 币种（人民币：CNY，虚拟币：USDT）
            //         protocol:"",//  trc20 erc20
            //         feeRemark: "本次提款手续费为0，超过1000USDT则收取手续费13%",//
            //         feeType: 1,// 1: 按笔收费, 2: 按比例收费
            //         feeAmount: 10,// 按笔收费
            //         feeRate: 0,//按比例收费
            //     },{
            //         needChargeFlag:true,//本比订单是否需要手续：true 收费 false 免费
            //         currency:"USDT",// 币种（人民币：CNY，虚拟币：USDT）
            //         protocol:"trc20",//  trc20 erc20
            //         feeFlag: true, // 是否开启手续费
            //         feeRemark: "本次提款手续费为0，超过1000USDT则收取手续费13%",//
            //         feeType: 1,// 1: 按笔收费, 2: 按比例收费
            //         feeAmount: 10,// 按笔收费
            //         feeRate: 0,//按比例收费
            //     },{
            //         needChargeFlag:true,//本比订单是否需要手续：true 收费 false 免费
            //         currency:"USDT",// 币种（人民币：CNY，虚拟币：USDT）
            //         protocol:"erc20",//  trc20 erc20
            //         feeFlag: true, // 是否开启手续费
            //         feeRemark: "本次提款手续费为0，超过1000USDT则收取手续费13%",//
            //         feeType: 1,// 1: 按笔收费, 2: 按比例收费
            //         feeAmount: 10,// 按笔收费
            //         feeRate: 0,//按比例收费
            //     }],
            //     "msg": "操作成功"
            // };

            this.getChargeConfigAction().then(res => {
                // 封装数据结构 withdrawalTypeId : 1 人民币 2 虚拟币 提款通道id
                res.data.forEach(item => {
                    if (item.withdrawalTypeId == 1) {
                        this.chargeConfig.rmbChargeFlag = item.feeFlag;
                        this.chargeConfig.rmbNeedChargeFlag = item.needChargeFlag;
                        this.chargeConfig.rmb = item.feeRemark;
                        this.chargeConfig.rmbChargeType = item.feeType;
                        this.chargeConfig.rmbDeal = item.feeAmount;
                        this.chargeConfig.rmbPercent = item.feeRate;
                    }
                    if (item.withdrawalTypeId == 2 && item.protocol.toLowerCase() == "erc20") {
                        this.chargeConfig.erc20ChargeFlag = item.feeFlag;
                        this.chargeConfig.erc20NeedChargeFlag = item.needChargeFlag;
                        this.chargeConfig.usdtErc20 = item.feeRemark;
                        this.chargeConfig.erc20ChargeType = item.feeType;
                        this.chargeConfig.erc20Deal = item.feeAmount;
                        this.chargeConfig.erc20Percent = item.feeRate;
                    }
                    if (item.withdrawalTypeId == 2 && item.protocol.toLowerCase() == "trc20") {
                        this.chargeConfig.trc20ChargeFlag = item.feeFlag;
                        this.chargeConfig.trc20NeedChargeFlag = item.needChargeFlag;
                        this.chargeConfig.usdtTrc20 = item.feeRemark;
                        this.chargeConfig.trc20ChargeType = item.feeType;
                        this.chargeConfig.trc20Deal = item.feeAmount;
                        this.chargeConfig.trc20Percent = item.feeRate;
                    }
                    // DDB
                    if (item.withdrawalTypeId == 2 && item.protocol.toLowerCase() == "ddb") {
                        this.chargeConfig.ddbChargeFlag = item.feeFlag;
                        this.chargeConfig.ddbNeedChargeFlag = item.needChargeFlag;
                        this.chargeConfig.ddb = item.feeRemark;
                        this.chargeConfig.ddbChargeType = item.feeType;
                        this.chargeConfig.ddbDeal = item.feeAmount;
                        this.chargeConfig.ddbPercent = item.feeRate;
                    }
                })
            })

        },
        // 获取当前费率类型
        getCurrtFee() {
            let fee = 0;
            let type = "";
            // 如果是RMB
            if (this.isBankType) {
                type = "rmb";
                if (this.chargeConfig.rmbChargeType == 1) {
                    fee = this.chargeConfig.rmbDeal;
                } else {
                    fee = parseInt(this.withdrawalAmount * this.chargeConfig.rmbPercent / 100);
                }
            } else {
                // 虚拟币
                if(this.currtItem.frontType == 2){
                    if (this.curVirBankAddress && this.curVirBankAddress.protocol && this.curVirBankAddress.protocol.toLowerCase() == "erc20") {
                        if (this.chargeConfig.erc20ChargeType == 1) {
                            fee = this.chargeConfig.erc20Deal;
                        } else {
                            fee = parseInt(this.virWithdrawalAmount * this.chargeConfig.erc20Percent / 100);
                        }
                    }
                    if (this.curVirBankAddress && this.curVirBankAddress.protocol && this.curVirBankAddress.protocol.toLowerCase() == "trc20") {
                        if (this.chargeConfig.trc20ChargeType == 1) {
                            fee = this.chargeConfig.trc20Deal;
                        } else {
                            fee = parseInt(this.virWithdrawalAmount * this.chargeConfig.trc20Percent / 100);
                        }
                    }
                }
                // DDB
                if(this.currtItem.frontType == 6){
                    if (this.chargeConfig.ddbChargeType == 1) {
                        fee = this.chargeConfig.ddbDeal;
                    } else {
                        fee = parseInt(this.virWithdrawalAmount * this.chargeConfig.ddbPercent / 100);
                    }
                }
            }
            // feeType 1: 按笔收费, 2: 按比例收费
            return fee.toFixed(2);
        },

        // 设置取款后提醒消息配置
        setResultConfigFun(res) {
            this.resultConfig.total = res.amount;
            this.resultConfig.fee = res.feeAmount;
            this.resultConfig.actualArrivals = res.actAmount;
            this.resultConfig.subOrders = res.splitSize;
            this.resultConfig.needChargeFlag = res.needChargeFlag;

            // 需要手续费 + 拆单
            if (this.resultConfig.needChargeFlag && this.resultConfig.subOrders > 1) {
                this.msgType = 2;
            }
            // 需要手续费 + 不拆单
            if (this.resultConfig.needChargeFlag && this.resultConfig.subOrders == 1) {
                this.msgType = 3;
            }
            // 不需要手续费 + 拆单
            if (!this.resultConfig.needChargeFlag && this.resultConfig.subOrders > 1) {
                this.msgType = 4;
            }
            // 不需要手续费 - 不拆单
            if (!this.resultConfig.needChargeFlag && this.resultConfig.subOrders == 1) {
                this.$message({
                    showClose: true,
                    message: '取款申请提交成功，可在我的钱包界面查看取款进度',
                    type: 'success'
                });
                this.msgType = 5;
                return
            }

            this.openChargeDialog();
        },
        changeWithtype(type) {
            // console.log(type)
            this.withType = type
            this.withdrawalAmount = ''
        },
        setWithValue(val) {
            this.withdrawalAmount = val
        },

        closeDrawListDialog() {
            this.drawListDialog = false;
        },
        openDrawListDialog() {
            this.drawListDialog = true;
        },
        //详情分页
        getPageEnv(num) {
            this.currentPage = num;
        },
        // 获取详情列表
        getDetailPageList() {

        },
        // 初始化黏贴版
        initClipboard() {
            const btnCopy = new clipboard('.clipboard-con');
            btnCopy.on('success', e => {
                this.$tips.toast(`复制成功`)
                e.clearSelection();
            });
        },
        // 复制内容
        copyText(text) {
            this.copyValue = text;
            setTimeout(() => {
                document.getElementsByClassName('clipboard-con')[0].click()
            }, 300)
        },
        // 打开订单详情弹框
        openDetailDialog() {
            this.drawDetailDialog = true
        },
        // 关闭订单详情弹框
        closeDrawDetailDialog() {
            this.drawDetailDialog = false
        },
        // 进行中订单提示
        getOrderMsgFun() {
            this.getOrderMsgAction().then(res => {
                if (res && res.success) {
                    this.paddingOrderList.push[res.data]
                    res.data.forEach((item,index) => {
                        setTimeout(()=>{
                            this.$message({
                                showClose: true,
                                message: item,
                                type: 'success'
                            });
                        },index*100)
                    })
                }
            })
        },
        // 打开虚拟账户窗口
        openVirtureDialog() {
            this.virtureAcountDialog = true
        },
        closeVirtureDialog(){
            this.virtureAcountDialog = false
            this.openUserInfoDialog()
        },
        openBankCardDialog() {
            this.bankAcountDialog = true
        },
        openPwdDialog() {
            this.showPwdDialog = true
        },
        closePwdDialog() {
            this.showPwdDialog = false
        },
        closeBankDialog(){
            this.bankAcountDialog = false
            this.getBankCardFun()
        },
        // 获取银行卡列表
        getBankCardFun(){
            this.getBankCardsFun().then(res => {
                if (res && res.success) {
                    // that.checkFun();
                    res.data.forEach(item => {
                        if (item.defaultable) {
                            this.currtCard = item;
                        }
                    })
                }
            })
        },
        jumpUsdtDetail(type) {
            let url
            if(type == 'ddpay') {
                url = 'https://ddpaywzo.com/index2.html'
            }
            window.open(url, '_blank')
        },
    }

}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template1/themes/mixin.styl'
@import "~@styl/template1/common/fun.styl"

.draw
    bg_color(bg04)
    border-radius: 0px 0px 10px 10px;
    min-height 750px

    .dialog-flow
        width: 100%;
        height: 100%;
        bg_color(bg44)
        opacity: .1;
        position: fixed;
        top: 0;
        left: 0;
        z-index 2;

    .info
        padding 20px

        .tip
            font-size: 14px;
            font_color(fc05);
            margin-botton 20px

        .order-status
            margin 10px 0
            font-size: 14px;
            color: #6a7180;

            .blue
                color #2989eb

            .detail-action
                margin-left 20px
                cursor pointer

        .info-con
            width 520px
            margin 0 auto
            padding 20px 10px 10px 10px

            .form
                .title-usdt
                    display block
                    font-size 16px
                    font_color(fc06);
                    margin-bottom 8px
                    overflow: hidden;
                    .title-left
                        float left
                    .title-right
                        float right
                        cursor pointer
                        font_color(fc047)
                        font-size 14px

                .usdt-rem
                    display flex
                    justify-content space-between
                    margin-top -15px
                    margin-bottom 20px
                    font-size 14px
                    font_color(fc091);

                .usdt-cur
                    font_color(fc010)
                    margin-left 5px

                .form-item
                    width: 520px;
                    height: 68px;
                    line-height 68px
                    border-radius: 5px;
                    border_all(1px, solid, border02);
                    margin-bottom 20px
                    display flex
                    flex-direction row
                    flex-wrap nowrap

                    input
                        font-size 15px

                    .lable
                        flex none
                        width 90px
                        text-align right
                        font-size: 16px;
                        letter-spacing: 2px;
                        font_color(fc05);

                    .right-text
                        flex none
                        padding-right 10px
                        color #2f7ce4
                        cursor pointer

                    &.dialog-con
                        flex none
                        position relative
                        padding-bottom 0px

                        .common-dialog
                            z-index: 3;
                            position absolute
                            top 66px
                            left 0px
                            //height 320px
                            width 500px
                            bg_color(bg04);
                            border_all(1px, solid, border03)
                            border-radius: 0px 0px 10px 10px;

                            .dialog-title
                                span
                                    display inline-block
                                    width: 50%;
                                    height: 60px;
                                    line-height 60px

                                    text-align center
                                    bg_color(bg05);
                                    font-size: 18px;
                                    font_color(fc06);
                                    border_com(1px, solid, border01, right)

                                    &.active
                                        bg_color(bg04);

                            .card-list
                                max-height 320px
                                overflow auto

                                ul
                                    resetul()
                                    width 100%
                                    text-align center
                                    font-size: 16px;
                                    font_color(fc06);
                                    display flex
                                    flex-direction row
                                    flex-wrap wrap
                                    line-height 60px
                                    justify-content flex-start
                                    align-items center

                                    li
                                        flex none
                                        width 100%
                                        align-self center
                                        margin-right 10px
                                        padding 2px 4px
                                        cursor pointer

                                        &.active
                                            bg_color(bg26)

                                        &:hover
                                            bg_color(bg15)

                    .all
                        flex none
                        width 80px
                        text-align center
                        font-size: 14px;
                        font_color(fc014)

                .charge
                    font-size 14px
                    margin-top 20px
                    color orangered
                    text-align center
                    white-space pre-wrap

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
                font_color(fc06);
                line-height 30px
                margin-bottom 10px

                &:nth-child(1)
                    font_color(fc05)

            .title
                font-size: 16px;
                font_color(fc06);
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
                            font_color(fc039)

                        &.no
                            font_color(fc040)

                        &.go
                            font_color(fc027)
                            border_com(1px, solid, border22, bottom)
                            padding-right 8px
                            position relative
                            cursor pointer

                            &:after
                                content ''
                                display block
                                width 1px
                                height 8px
                                border_com(1px, solid, border22, right)
                                position absolute
                                bottom -2px
                                right 2px
                                transform rotate(-45deg)


            .form
                .form-item
                    height: 68px;
                    line-height 68px
                    border-radius: 5px;
                    border_all(1px, solid, border02);
                    margin-bottom 20px
                    margin-top 20px
                    display flex
                    flex-direction row
                    flex-wrap nowrap

                    input
                        font-size 16px

                    .lable
                        flex none
                        width 90px
                        text-align right
                        font-size: 16px;
                        letter-spacing: 2px;
                        font_color(fc05);

            .submit-btn
                width: 290px;
                height: 60px;
                line-height 60px
                text-align center
                bg_img_linear(linear02, linear03)
                font_color(fc01)
                border-radius: 10px;
                font-size 18px
                margin 24px auto
                margin-bottom: 4px;

                &.ok
                    width: 290px;
                    line-height 60px
                    text-align center
                    font-size: 18px;
                    font_color(fc01);
                    bg_img_linear(linear02, linear03)
                    border-radius: 10px;
                    margin-top 30px

        .msg-con
            min-height 200px
            min-width 500px

            .success-icon
                background url("~@img/template1/home/success.svg") center / contain no-repeat
                width 60px
                height 60px
                margin 10px auto
                font_color(fc019)

            .title
                font-size: 16px;
                font_color(fc06);
                text-align center

                .num
                    color #bb9759
                    padding 0 2px

            .btns-con
                display flex
                flex-direction row
                justify-content space-between

                .common-btn
                    flex none
                    width: 200px;
                    height: 60px;
                    line-height 60px
                    text-align center
                    //bg_img_linear(linear02,linear03)
                    font_color(fc020)
                    border-radius: 10px;
                    font-size 18px
                    margin 40px auto 14px
                    bg_color(bg15)

                    &.ok
                        line-height 60px
                        text-align center
                        font-size: 18px;
                        font_color(fc01);
                        bg_img_linear(linear02, linear03)
                        border-radius: 10px;
                        margin 20 auto

        .charge-con
            font-size 14px
            height 300px
            width 550px
            position relative
            .msg-item-new
                color #808080
                .top
                    color #dba057
                    font-size 12px
                .middle
                    text-align center
                    color #080808
                    font-weight 600
                    font-size 20px
                    margin 20px auto
                    .text
                        color #808080
                        font-size 12px
                        font-weight 500
                .down
                    display flex
                    flex-direction row
                    border-bottom 1px solid #f2f2f2
                    padding-bottom 10px
                    margin-bottom 10px
                    .left
                        flex 1
                    .right
                        flex 1
                        text-align right
                .tip
                    color: #808080;
                    font-size 12px
            .msg-item
                text-align center

                div
                    margin 24px
                    font-size: 16px;
                    color: #444952;
                    text-align: center;

            .btns-con
                position absolute
                bottom 10px
                width 100%
                margin-top 120px
                flexcon()
                flex-direction row

                .common-btn
                    flex none
                    width 200px

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
            border_all(1px, solid, bg16)
            margin 4px
            position relative
            cursor pointer
            font_color(fc028)

            &.active
                bg_color(bg58);

                .name
                    font_color(fc06)
                    position relative

                &:after
                    content ''
                    display block
                    width 24px
                    height 24px
                    position absolute
                    bottom 0px
                    right 0px
                    background url("~@img/template1/center/duihao.png") center / contain no-repeat

                &.not
                    cursor not-allowed

            .name
                font-size: 14px;
                font_color(fc094);

.virtual-list, .protocol-list
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
            border_all(1px, solid, border02)
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
                    background url("~@img/template1/center/duihao.png") center / contain no-repeat

                &.not
                    cursor not-allowed

            .name
                font-size: 14px;
                font_color(fc094);

.pvor-notel
    top 385px !important

.dialog-pvor
    width 600px
    margin-left 80px
    position absolute
    left 20px
    top 470px
    height 300px

    .dialog-title
        span
            display inline-block
            width: 50%;
            height: 40px;
            line-height 40px
            text-align center
            bg_color(bg68);
            font-size: 18px;
            font_color(fc06);
            //border_com(1px, solid, border01, right)

            &.active
                bg_color(bg60);
                font_color(fc088);

    // .dialog-title
    //     bg_color(bg65)
    //     width 480px
    //     height 36px
    //     line-height 36px
    //     text-align center
    //     text-align center
    //     display inline-block
    //     bg_color(bg68);
    //     font-size: 18px;
    //     font_color(fc089);
    //border_com(1px, solid, border01, right)

    .pvorvince-list
        padding-bottom 20px
        width 600px
        bg_color(border07);

        ul
            resetul()

            li
                width 100%
                text-align center
                font-size: 14px;
                font_color(fc06);
                display flex
                flex-direction row
                flex-wrap nowrap
                line-height 24px
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
                        margin-bottom: 5px;
                        margin-right 5px

                        &.active, &:hover
                            bg_color(fc052);
                            font_color(bg04);
                            border-radius: 5px;

.city-list
    padding-bottom 20px
    bg_color(border07);

    ul
        resetul()
        width 100%
        text-align center
        font-size: 14px;
        font_color(fc06);
        display flex
        flex-direction row
        flex-wrap wrap
        line-height 24px
        justify-content flex-start
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
                bg_color(fc052);
                font_color(bg04);
                border-radius: 5px;

.bank-list
    //height 320px
    width 600px
    margin-left 80px
    position absolute
    left 20px
    top 400px
    height 300px
    overflow auto
    z-index 10

    ul
        resetul()
        width 100%
        text-align center
        font-size: 14px;
        bg_color(border07);
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

.bank-notel
    top 315px

.dialog-info-tit
    font-size 16px
    font_color(fc06)
    margin-top 15px

.dialog-info-trem
    font-size 14px
    padding-left 5px

.dialog-info-con
    line-height 36px

.dialog-info-con3
    line-height 36px
    display flex
    justify-content flex-start
    // align-items center
    margin 8px 0px

    .virtual-list
        margin-bottom 0px

.dialog-info-con2
    display flex
    justify-content space-between
    height 48px
    align-items center

.info-item
    display flex
    justify-content space-between
    margin-bottom 20px
    margin-top 25px

.info-inp
    font-size 16px
    background-color transparent
    font_color(fc06);
    width 100%
    height 38px

    &::placeholder
        font_color(fc028);

.dialog-inif-stit
    font-size 12px
    font_color(fc094);
    width 80px
    text-align right
    line-height 46px

.w300
    width 600px

.w150
    width 258px

.dial-select
    display: inline-block;
    line-height 36px
    padding-left 12px
    font-size 16px
    font_color(fc028);

.info-bord
    border_all(1px, solid, border02)
    height 42px
    border-radius 5px
    position relative

.infsms
    position absolute
    right 2px
    top 3px

.mt20
    margin-top 20px

.btn-nopwd
    margin-top 40px !important
    margin-bottom 40px !important

.default-name
    font_color(fc094)

.default-con
    display flex
    align-items center
    margin-bottom 10px

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

.proto-curfont
    color #f00 !important
    padding-left 12px

.com-tab
    width 100%
    height: 30px;
    line-height 30px
    font-size: 14px;
    letter-spacing: 0px;
    font_color(fc06);
    bg_color(bg04);
    border-radius: 10px 10px 0px 0px;
    //border_com(1px, solid, border08, bottom)
    position relative
    transition all .3s
    margin-bottom 10px

    ul
        resetul()
        display flex
        flex-wrap nowrap
        justify-content flex-start

        li
            flex none
            width 120px
            text-align center
            position relative
            cursor pointer

            &:hover
                font_color(fc015)

            &.active
                font_color(fc015)

                &:after
                    content ''
                    display block
                    width 100px
                    height 4px
                    bg_color(bg12)
                    bottom 2px
                    left 50%
                    transform translateX(-50%)
                    position: absolute;
                    border-radius: 4px;

.btn-list
    ul
        resetul()
        display flex
        flex-direction row
        flex-wrap wrap
        justify-content flex-start
        align-items center
        margin-bottom 20px

        li
            flex none
            margin-right 9px
            width: 91px;
            height: 58px;
            line-height 58px
            text-align center
            border-radius: 10px;
            border_all(1px, solid, border19)
            font-size: 16px;
            font_color(fc05);
            margin-bottom 10px
            cursor pointer

            &.active
                bg_img_linear(linear04, linear03)

.tip-with
    font-size 14px
    margin-top 5px
    margin-bottom 10px
    color orangered


// 订单列表
.draw-list
    .dialog-con
        color #454a53
        width 900px
        min-height 300px

        .order-status
            display flex
            flex-direction row
            justify-content flex-start
            margin-bottom 20px

            .order-title
                font-size 14px
                margin-right 20px
                line-height 30px

            .order-btn
                border 1px solid #d3d3e6
                width 60px
                height 30px
                line-height 30px
                text-align center
                border-radius 4px
                margin-right 20px
                cursor pointer
                transition 1s

                &.active, &:hover
                    color #2989eb
                    border-color #2989eb

        .title-list
            display flex
            flex-direction row
            background-color #d3d3e6
            height 45px
            line-height 45px
            color #454a53
            border-radius 6px

            span
                flex 1
                text-align center

            .order
                flex 1.5
                padding-right 34px

            .status, .action
                flex .7

        ul
            list-style none
            padding 0
            margin 0
            max-height 360px
            overflow-y auto
            margin-bottom 10px
            min-height 300px

            li
                text-align center
                height 36px
                line-height 36px
                display flex
                flex-direction row
                justify-content center
                align-items center

                .item
                    flex 1
                    color #454a53
                    border-bottom 1px solid #eaeaea
                    text-align center

                    &.order
                        flex 1.5
                        position relative
                        display inline-block
                        white-space nowrap
                        overflow hidden
                        text-overflow ellipsis
                        padding-right 34px

                        .copy
                            border 1px solid #2989eb
                            border-radius 4px
                            text-align center
                            position absolute
                            width 30px
                            display flex
                            flex-direction row
                            justify-content center
                            align-items center
                            height 18px
                            right 0px
                            top 50%
                            transform translateY(-50%)
                            color #2989eb
                            cursor pointer

                    &.status
                        flex .7

                    &.action
                        flex .7
                        color #2989eb
                        cursor pointer

                    &.green
                        color #67c23a

                    &.red
                        color #f56c6c

                    &.yellow
                        color #e6a23c

        .totle-con
            color #2989eb

// 订单详情
.draw-detail
    .dialog-con
        width 800px
        min-height 300px

        .data-con
            display flex
            flex-direction row
            justify-content flex-start
            align-items flex-start
            flex-wrap wrap
            margin-bottom 20px
            border 1px solid #eaeaea
            border-radius 8px

            .data-item
                flex none
                width 50%
                display flex
                flex-direction row
                justify-content flex-start
                align-items center
                height 36px
                font-size 14px
                color #454a53

                .lable
                    flex none
                    width 66px
                    text-align right
                    margin-right 20px

                .text
                    flex 1

                .gold
                    color #dba057
                    font-size 18px
                    font-weight 600

        .title-list
            display flex
            flex-direction row
            background-color #d3d3e6
            height 45px
            line-height 45px
            color #454a53
            border-radius 6px

            span
                flex 1
                text-align center

        ul
            list-style none
            padding 0
            margin 0
            max-height 360px
            overflow-y auto
            margin-bottom 10px
            min-height 150px

            li
                text-align center
                height 36px
                line-height 36px
                display flex
                flex-direction row
                justify-content center
                align-items center

                .item
                    flex 1
                    color #454a53
                    border-bottom 1px solid #eaeaea
                    text-align center

                    &.order
                        position relative
                        display inline-block
                        white-space nowrap
                        overflow hidden
                        text-overflow ellipsis

                        .copy
                            border 1px solid #2989eb
                            border-radius 4px
                            text-align center
                            position absolute
                            width 30px
                            display flex
                            flex-direction row
                            justify-content center
                            align-items center
                            height 18px
                            right 0px
                            top 50%
                            transform translateY(-50%)
                            color #2989eb
                            cursor pointer

                    &.green
                        color #67c23a

                    &.red
                        color #f56c6c

                    &.yellow
                        color #e6a23c

.fether
    position: absolute;
    padding: 0 4px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    top: -2px;
    left: -3px;
    border-top-left-radius: 6px;
    border-bottom-right-radius: 14px;
    background-color: #f56c6c;
    color: #fff;
    font-size: 12px;
    transform: scale(0.85);
</style>
