<template lang="pug">
    .deposit
        //.dialog-flow(v-if="showDiscountPopFlay",@click="closeDialog")
        //.com-tab
        //    ul
        //        li(v-for="item in depositList",@click="selectPayType(item)", :class="[{'active': currtItem.id == item.id,'pl0': item.iconUrl==''}]")
        //            span.type-icon(:style="`background-image: url(${$ossImg(item.iconUrl)})`")
        //            span {{item.name}}
        //            span.quote-name {{item.dataDescribe}}
        //            //span(:class="item.activityFlag?'show-icon':''")
        //            span.fether(v-if="item.subscript") {{item.subscript}}
        .info(v-if="currtStep==1")
            .pay-list
                ul
                    li(v-for="item in depositList" , @click="selectPayType(item)",:class="[{'active': currtItem.id == item.id,'pl0': item.iconUrl==''}]")
                        .icon(v-show="item.iconUrl!=''" :class="item.code",:style="`background: url(${$ossImg(item.iconUrl)})center/contain`")
                        .quote-name {{item.dataDescribe}}
                        .name(:class="item.dataDescribe?'':'middle'") {{item.name}}
                        .message-box(v-if="item.activityFlag")
                            span(class="message") 送
                        .fether(v-if="item.subscript") {{item.subscript}}
                    li(class="empty")
                    li(class="empty")
                    li(class="empty")
            .tip-currt.red {{currtItem.frontRemark}}
            .tip(v-if="currtItem.id != 99") *请正确选择您的转账方式，否则无法到账！
            .info-con(v-if="currtItem.id != 99")
                .form
                    //.item
                    //    .lable 支付通道：
                    //    .pay-list
                    //        ul
                    //            li(v-for="item in depositList" , @click="selectPayType(item)",:class="[{'active': currtItem.id == item.id,'pl0': item.iconUrl==''}]")
                    //                .icon(v-show="item.iconUrl!=''" :class="item.code",:style="`background: url(${$ossImg(item.iconUrl)})center/contain`")
                    //                .quote-name {{item.dataDescribe}}
                    //                .name(:class="item.dataDescribe?'':'middle'") {{item.name}}
                    //                span(:class="item.activityFlag?'show-icon':''")
                    //                .fether(v-if="item.subscript") {{item.subscript}}
                    //            li(class="empty")
                    //            li(class="empty")
                    //            li(class="empty")

                    .item(v-if="isVirtualType")
                        .lable 虚拟币种类:
                        .virtual-list
                            ul(v-if="currtItem.code=='usdt_pay' && virtualList && virtualList.length >0")
                                li(v-for="item in virtualList" , @click="selectVirtua(item)",:class="currtVirtual.id == item.id?'active':''")
                                    .name {{item.name}}
                            ul(v-if="currtItem.code == 'blockchain'")
                                li(class="active")
                                    .name DDB
                    .item(v-if="isVirtualType")
                        .lable 协议:
                        .protocol-list
                            ul(v-if="currtItem.code=='usdt_pay' && protocolList && protocolList.length >0")
                                li(v-for="item in protocolList" , @click="selectProtocol(item)",:class="currtProtocol.name == item.name?'active':''")
                                    .name {{item.name}}
                            ul(v-if="currtItem.code == 'blockchain'")
                                li(class="active")
                                    .name DDB

                    // 虚拟币才有
                    .item(v-if="currtItem.code == 'usdt_pay'")
                        .lable-con
                            .lable(@click="selectUsdtPayType(1)",:class="currtUsdtType==1?'active':''") 按金额购买
                            .lable(@click="selectUsdtPayType(2)",:class="currtUsdtType==2?'active':''") 按数量购买

                    // currtItem.code != 'usdt_pay'
                    .form-item(v-if="!isOnlineType")
                        .lable 存款姓名:
                        input(maxlength=15,placeholder='',v-model="depositName", :readonly="userInfo.realName?true:false" )

                    // 固定金额
                    .item(v-if="!(isVirtualType && currtUsdtType==2)")
                        .btn-list
                            ul
                                li( v-for="item in fixedAmountList",@click="selectMoney(item)",:class="depositAmount == item?'active':''") {{item}}

                    // 按数量购买的时候 , 显示存款数量
                    .form-item(v-if="isVirtualType && currtUsdtType==2")
                        .lable 存款数量:
                        input(maxlength=9,type="tel",:placeholder='qutoCount',v-model="depositCount" , :readonly="inputFlag ? false : 'readonly'",:class="inputFlag ? '' : 'readonly'")

                    template(v-else)
                        .form-item(v-if="qutoMoneyFlag")
                            .lable 存款金额:
                            input(maxlength=9,type="tel",:placeholder='qutoMoney',v-model="depositAmount" , :readonly="inputFlag ? false : 'readonly'",:class="inputFlag ? '' : 'readonly'")

                    //- 虚拟币支付 币种 汇率
                    .item.usdt-tip(v-if="currtItem.code == 'usdt_pay' && currtVirtual && exchangeRate " )
                        .top
                            p
                                span 参考汇率
                                span.yellow 1 {{currtVirtual.name}} ≈ {{exchangeRate}}
                                span CNY
                            p(v-if="currtItem.code == 'usdt_pay' && currtUsdtType==2")
                                span 预计支付
                                span.yellow {{countRmb}}
                                span RMB
                            p(v-else)
                                span 预计支付
                                span.yellow {{usdtNum}}
                                span {{currtVirtual.name}}
                        .down
                            p
                                span 到账金额为提交订单时的RMB金额
                                span |
                                span 请以实际支付时的汇率为准
                    //- ddpay 虚拟币支付
                    .item.usdt-tip(v-if="currtItem.code == 'blockchain'" )
                        .top
                            p
                                span 参考汇率
                                span.yellow 1 DDB ≈ 1CNY
                            p
                                span 预计支付
                                span.yellow(v-if="currtUsdtType==1") {{parseInt(depositAmount)?depositAmount:0}}
                                span.yellow(v-if="currtUsdtType==2") {{parseInt(depositCount)?depositCount:0}}
                                span RMB
                        .down
                            p
                                span 到账金额为提交订单时的RMB金额
                                span |
                                span 请以实际支付时的汇率为准


                    // 活动
                    .item(v-if="discountList && discountList.length>0")
                        .lable 选择首存返利:
                        .discount-con
                            .txt-obj(@click="openDiscountPop")
                                .title {{discountName}}
                                .down-icon()
                                    svg-icon(:icon-class="'down'")
                            .discount-list(:class="showDiscountPopFlay?'show':''")
                                ul
                                    template(v-for="item in discountList")
                                        li(v-if="item.needConfirm",@click="selectDiscount(item)",:class="discountId==item.id?'active':''") {{item.name}}
                                        li(v-else , class="active-hui not") {{item.name}}

                .btns-con
                    .common-btn.big(@click="submit",:class="subFlag?'ok':'hidden'") 立即存款
                    .usdt-jump(v-if="currtItem.code == 'blockchain'" ,@click="jumpUsdtDetail('ddpay')") 滴滴付入金教程 >>
                    .usdt-jump(v-if="currtItem.code == 'usdt_pay'" ,@click="jumpUsdtDetail('usdt')") 了解虚拟币 >>

            // 如果是ai客服存款
            div.cs-link(v-if="currtItem.id == 99")
                img(src="../../../assets/images/comimages/center/deposit/cs_deposit.png")
                .btns-con
                    .common-btn.big.ok(@click="goToCS") 立即存款
        // 银行卡支付详情2 -- 新版本
        .step-con(v-if="currtStep==2")
            .nav-title(@click="goBackStep") < {{currtItem.name}}
            .deposit-con
                .detail-con
                    .left
                        .top
                            //.top-title 向商家付款
                            .top-money ¥ {{orderInfo.payAmount | format}}
                            .top-time
                                span 请在
                                span.blue  {{minute?minute+":":""}}{{second}}
                                span 内完成支付
                            //.top-msg(v-if="currtItem.code == 'usdt_pay' && currtVirtual && exchangeRate " )
                            //    span 本次付款
                            //    span.galery ≈{{orderInfo.payAmount | format}}
                            //    span 元, 参考汇率
                            //    span.galery 1{{currtVirtual.name}} ≈ {{exchangeRate}}
                            //    span 元
                            .top-service
                                span 长时间无反应，请
                                span.blue(@click="goService") 联系客服
                                span 确认
                        .middle
                            .item
                                .lable 订单编号:
                                .text
                                    span {{orderInfo.orderDepositId ? orderInfo.orderDepositId :'--'}}
                                    span.copy-btn.vd-copy0(:data-clipboard-text="orderInfo.orderDepositId" @click="copySub('vd-copy0')")

                            .item
                                .lable 交易时间:
                                .text
                                    span {{orderInfo.createTime ? orderInfo.createTime : '--'}}
                            .item
                                .lable 订单状态:
                                .text.galery
                                    span {{allStatus | formatBankStatus }}
                                    loadingBut(v-if="blueRefreshLoading")
                                    span.blueRefresh(@click="blueRefresh('bank', orderInfo.orderDepositId)") 刷新

                        .com-line

                        .down.success
                            .item.orange
                                .lable 收款人姓名:
                                .text
                                    span {{orderInfo.payInfo.receivedName}}
                                    span.copy-btn.vd-copy1(:data-clipboard-text="orderInfo.payInfo.receivedName" @click="copySub('vd-copy1')")
                            .item.orange
                                .lable 收款人账户:
                                .text
                                    span {{orderInfo.payInfo.receivedBankCard}}
                                    span.copy-btn.vd-copy2(:data-clipboard-text="orderInfo.payInfo.receivedBankCard" @click="copySub('vd-copy2')")
                            .item.orange
                                .lable 银行名称:
                                .text
                                    span {{orderInfo.payInfo.receivedBankName}}
                                    span.copy-btn.vd-copy3(:data-clipboard-text="orderInfo.payInfo.receivedBankName" @click="copySub('vd-copy3')")
                            .item.orange
                                .lable 银行分行:
                                .text
                                    span {{orderInfo.payInfo.receivedSubBankName}}
                                    span.copy-btn.vd-copy4(:data-clipboard-text="orderInfo.payInfo.receivedSubBankName" @click="copySub('vd-copy4')")
                            .item.orange
                                .lable 金额:
                                .text
                                    span {{orderInfo.payAmount}}
                                    span  元
                                    span.copy-btn.vd-copy5(:data-clipboard-text="orderInfo.payAmount" @click="copySub('vd-copy5')")

                            .item.tipItem
                                .lable.redTip (转账金额务必与订单金额一致)
                                .text

                        .bs
                            //.btn.common-btn.blueBgBtn(@click="openOrderDetail") 查看订单详情
                            .btn.common-btn.whiteBgBtn(@click="openServieUrl") 取消存款订单


                        //.btn-con.success
                        //    .common-btn.ok.big(@click="goBackStep")  我已付款成功


                    .right
                        .open-con(v-if="!serviceFlag")
                            .icon-servie
                            .text 在线客服
                            .text 7*24小时在线客服,贴心至上
                            .btn(@click="openServieUrl") 存款遇到问题,点击联系客服
                        .ifram-con(v-if="serviceFlag")
                            iframe(:src="kefuUrl",height="100%",frameborder="0")

                .down-con
                    .title 温馨提示
                    ul
                        li 1. 转账金额须与订单金额一致，否则存款无法及时到账；
                        li.redTip 2. 下次存款时，请获取新的账号，存入旧账号将无法到账；
                        li 3. 请及时前往存款，订单有效时间只有30分钟；
                        li 4. 请勿使用支付宝、微信转账至公司账户；
                        li 5. 如您涉嫌洗钱或使用黑钱存款，一经发现将做封停账号处理；
                        li 6. 若存款存在疑问，请及时联系客服；



        // 所有支付的中间页面 都先跳转到这个页面 3
        .step-con(v-if="currtStep==3")
            .nav-title(@click="goBackStep") < {{currtItem.name}}
            .deposit-con
                .detail-con
                    .left
                        .time-con(v-if="!showErrorFlag") 正在与支付服务商通讯
                        .time-con.red(v-if="showErrorFlag") 商家未接单,请重新下单!
                        .traver-time-com
                            .outer
                                .inner
                                    span {{minute?minute+":":""}}{{second}}


                    .right
                        .open-con(v-if="!serviceFlag")
                            .icon-servie
                            .text 在线客服
                            .text 7*24小时在线客服,贴心至上
                            .btn(@click="openServieUrl") 存款遇到问题,点击联系客服
                        .ifram-con(v-if="serviceFlag")
                            iframe(:src="kefuUrl",height="100%",frameborder="0")

                .down-con
                    .title 温馨提示
                    ul
                        li
                            span 1. 成功付款后，将会自动到账。若长时间无反应，请联系客服；
                        li
                            span 2.请勿频繁提交无效订单，若多次提交且不充值，账号可能会被暂停充值功能；




        // 虚拟币详情 4
        .step-con(v-if="currtStep==4")
            .nav-title(@click="goBackStep") < {{currtItem.name}}
            .deposit-con
                .detail-con
                    .left
                        .top
                            //.top-title 向商家付款
                            .top-money ¥{{orderInfo.orderAmt}}
                            .top-time
                                span 请在
                                span.blue  {{minute?minute+":":""}}{{second}}
                                span 内完成支付
                            //.top-msg(v-if="currtItem.code == 'usdt_pay' && currtVirtual && exchangeRate " )
                            //    span 本次付款
                            //    span.galery ≈{{orderInfo.orderAmt | format}}
                            //    span 元, 参考汇率
                            //    span.galery 1{{currtVirtual.name}} ≈ {{exchangeRate}}
                            //    span 元
                            .top-service
                                span 长时间无反应，请
                                span.blue(@click="goService") 联系客服
                                span 确认
                        .middle
                            .item
                                .lable 订单编号:
                                .text
                                    span {{orderInfo.id ? orderInfo.id :'--'}}
                                    span.copy-btn.vd-copy0(:data-clipboard-text="orderInfo.id" @click="copySub('vd-copy0')")

                            .item
                                .lable 交易时间:
                                .text
                                    span {{orderInfo.createTime ? orderInfo.createTime : '--'}}
                            .item
                                .lable 订单状态:
                                .text.galery
                                    span {{allStatus | formatBankStatus }}
                                    loadingBut(v-if="blueRefreshLoading")
                                    span.blueRefresh(@click="blueRefresh('', orderInfo.id)") 刷新

                        .com-line

                        .down.success
                            .item.orange
                                .lable 金额:
                                .text
                                    span {{orderInfo.virOrderAmt }} USDT ≈ {{orderInfo.orderAmt}} CNY
                                    span.copy-btn.vd-copy007(:data-clipboard-text="orderInfo.virOrderAmt" @click="copySub('vd-copy007')")
                            .item.tipItem
                                .lable.redTip (请确保支付{{orderInfo.virOrderAmt }}USDT(不含手续费))
                                .text
                            .item.orange
                                .lable 币种:
                                .text
                                    span {{orderInfo.virCurrency}} / {{orderInfo.protocol}}
                                    span.copy-btn.vd-copy009(:data-clipboard-text="orderInfo.virCurrency + '/' + orderInfo.protocol" @click="copySub('vd-copy009')")
                            .item.tipItem
                                .lable.redTip (请勿支付任何非 {{orderInfo.virCurrency}} - {{orderInfo.protocol}} 资产)
                                .text
                            .item.orange
                                .lable 充币地址:
                                .text
                                    span
                                    span.copy-btn.vd-copy008(:data-clipboard-text="orderInfo.recAcctNo" @click="copySub('vd-copy008')")
                            .item.address.orange
                                .lable
                                .text
                                    span {{orderInfo.recAcctNo}}

                            .item
                                .lable 充币二维码:
                                .text

                            .qrcode-con
                                .qrcode-flow(@click="openQrDialog")
                                    qrcode( :codeurl="orderInfo.recAcctNo",:clasz="'virtual'")


                        //.btn-con.success
                        //    .common-btn.ok.big(@click="goBackStep")  我已付款成功
                        .bs
                            //.btn.common-btn.blueBgBtn(@click="openOrderDetail") 查看订单详情
                            .btn.common-btn.whiteBgBtn(@click="openServieUrl") 取消存款订单


                    .right
                        .open-con(v-if="!serviceFlag")
                            .icon-servie
                            .text 在线客服
                            .text 7*24小时在线客服,贴心至上
                            .btn(@click="openServieUrl") 存款遇到问题,点击联系客服
                        .ifram-con(v-if="serviceFlag")
                            iframe(:src="kefuUrl",height="100%",frameborder="0")

                .down-con
                    .title 温馨提示
                    ul
                        li 1. 转账金额须与订单金额一致，否则存款无法及时到账；
                        li.redTip 2. 请仔细核对币种协议，请勿支付错误的币种和协议资产，将无法找回；
                        li.redTip 3. 下次存款时，请获取新的充币地址，存入旧地址将无法到账；
                        li 4. 请及时前往存款，订单有效时间只有30分钟；
                        li 5. 若存款存在疑问，请及时联系客服；
                        //li
                        //    span 1.请勿向上述地址支付任何非
                        //    span.yellow {{orderInfo.virCurrency}}
                        //    span 资产，否则资产将无法找回;
                        //li
                        //    span 2.当前OKEx/火币/币安交易所USDT最新卖出价
                        //    span.yellow {{orderInfo.unitPrice}}
                        //    span 元;
                        //li
                        //    span 3.请确保实际到账数量
                        //    span.yellow {{orderInfo.virOrderAmt}} USDT
                        //    span ,数量错误可能无法及时到账;
                        //li
                        //    span 4.您支付至上述地址,需要整个网络节点确认,请耐心等待;




        // 代客充值详情 5
        .step-con(v-if="currtStep==5")
            .nav-title(@click="goBackStep") < {{currtItem.name}}
            .deposit-con
                .detail-con
                    .left
                        .top(v-if="currtItem.code == 'usdt_pay'")
                            //.top-title 向商家付款
                            .top-money  {{usdtNum}} USDT
                            //.top-time
                                span 付款剩余时间
                                span.blue  {{minute?minute+":":""}}{{second}}
                            //.top-msg(v-if="currtItem.code == 'usdt_pay' && currtVirtual && exchangeRate " )
                            //    span 本次付款
                            //    span.galery ≈ {{depositAmount}}
                            //    span 元, 参考汇率
                            //    span.galery 1{{currtVirtual.name}} ≈ {{exchangeRate}}
                            //    span 元
                            .top-service
                                span 长时间无反应，请
                                span.blue(@click="goService") 联系客服
                                span 确认
                        .top(v-else)
                            //.top-title 向商家付款
                            .top-money ¥ {{depositAmount}}
                            .top-time
                                span 请在
                                span.blue  {{minute?minute+":":""}}{{second}}
                                span 内完成支付
                            .top-service
                                span 长时间无反应，请
                                span.blue(@click="goService") 联系客服
                                span 确认
                        .middle
                            .item
                                .lable 订单编号:
                                .text
                                    span {{orderInfo.payInfo.id ? orderInfo.payInfo.id :'--'}}
                                    span.copy-btn.vd-copy0(:data-clipboard-text="orderInfo.payInfo.id" @click="copySub('vd-copy0')")

                            .item
                                .lable 创建时间:
                                .text
                                    span {{orderInfo.payInfo.createTime ? orderInfo.payInfo.createTime : '--'}}

                            .item
                                .lable 订单状态:
                                .text.galery(v-if="valetFlag")
                                    span {{allStatus | formatBankStatus }}
                                    loadingBut(v-if="blueRefreshLoading")
                                    span.blueRefresh(@click="blueRefresh(currtItem.code == 'usdt_pay' ? '' : 'bank', orderInfo.payInfo.id)") 刷新
                                .text(v-else)
                                    span.red 商家未接单
                        .com-line

                        .down.error
                            .btn-chat.success(v-if="valetFlag") 您的订单已生成,请注意查收!
                            .btn-chat(v-else @click="getValetChat") 商家未接单,去找人工充值>>


                        //.btn-con.chat(v-if="valetFlag")
                        //    //.common-btn.hidden(@click="goBackStep")  取消订单
                        //    .common-btn.ok(@click="goBackStep")  我已付款成功
                        .bs(v-if="valetFlag")
                            //.btn.common-btn.blueBgBtn(@click="openOrderDetail") 查看订单详情
                            .btn.common-btn.whiteBgBtn(@click="openServieUrl") 取消存款订单

                    .right
                        .open-con(v-if="!valetFlag")
                            .icon-servie
                            .text 在线客服
                            .text 7*24小时在线客服,贴心至上
                        .ifram-con(v-if="valetFlag")
                            iframe(:src="iframeUrl",height="100%",frameborder="0",@load="iframOnload")

                .down-con
                    .title 温馨提示
                    ul
                        li 1. 请用同名卡账户进行转账, 否则存款将无法到账;
                        li 2. 转账金额务必与订单金额一致,否则存款无法及时到账;
                        li 3. 如您涉嫌洗钱或使用黑钱存款,一经发现立马封停账号;

        // 专用---- 6
        .step-con(v-if="currtStep==6")
            .nav-title(@click="goBackStep") < {{currtItem.name}}
            .deposit-con
                .detail-con
                    .left
                        .time-con(v-if="!showErrorFlag") 正在与支付服务商通讯
                        .time-con.red(v-if="showErrorFlag") 商家未接单,请重新下单!
                        .traver-time-com
                            .outer
                                .inner
                                    span {{minute?minute+":":""}}{{second}}


                    .right
                        .open-con(v-if="!serviceFlag")
                            .icon-servie
                            .text 在线客服
                            .text 7*24小时在线客服,贴心至上
                            .btn(@click="openServieUrl") 存款遇到问题,点击联系客服
                        .ifram-con(v-if="serviceFlag")
                            iframe(:src="kefuUrl",height="100%",frameborder="0")

                .down-con
                    .title 温馨提示
                    ul
                        li
                            span 1. 成功付款后，将会自动到账。若长时间无反应，请联系客服；
                        li
                            span 2.请勿频繁提交无效订单，若多次提交且不充值，账号可能会被暂停充值功能；




        // 代客充值方式页面 7
        .step-con(v-if="currtStep==7")
            .nav-title(@click="goBackStep") < {{currtItem.name}}
            .deposit-con
                .detail-con
                    .left
                        .title.weight 操作提示：
                        .title.weight.size01 *新发起支付订单：
                        .tit-item 1、选择右侧客服聊天窗输入文本框上方的充值方式；
                        .tit-item 2、点击聊天窗内客服发送的充值方式获取充值信息；
                        .tit-item 3、按照充值信息支付成功；
                        .tit-item 4、在客服聊天窗内上传支付成功的截图；

                        .title.weight.size01 *已存在同类型支付订单：
                        .tit-item 1、点击“继续支付”，完成上笔同类型支付订单；
                        .tit-item 2、如若需要取消订单,请点击联系客服；

                        .title.weight.size01.size02 温馨提示：
                        .tit-item 1. 请用同名卡账户进行转账, 否则存款将无法到账;
                        .tit-item 2. 转账金额务必与订单金额一致,否则存款无法及时到账;
                        .tit-item 3. 如您涉嫌洗钱或使用黑钱存款,一经发现立马封停账号;

                    .right
                        .ifram-con
                            iframe(:src="iframeUrl",height="100%",frameborder="0",@load="iframOnload")

        // DDB-滴滴币详情 8
        .step-con(v-if="currtStep==8")
            .nav-title(@click="goBackStep") < {{currtItem.name}}
            .deposit-con
                .detail-con.ddb
                    .left
                        .top
                            //.top-title 向商家付款
                            .top-money {{orderInfo.orderAmt}} DDB
                            .top-time
                                span 请在
                                span.blue  {{minute?minute+":":""}}{{second}}
                                span 内完成支付
                            .top-msg.top-service
                                span 本次付款
                                span.galery ≈{{orderInfo.orderAmt | format}}
                                span 元, 参考汇率
                                span.galery 1DDB ≈ 1
                                span 元
                            .top-service
                                span 长时间无反应，请
                                span.blue(@click="goService") 联系客服
                                span 确认
                        .middle
                            .item
                                .lable 订单编号:
                                .text
                                    span {{orderInfo.orderNo ? orderInfo.orderNo :'--'}}
                                    span.copy-btn.ddb-copy0(:data-clipboard-text="orderInfo.orderNo" @click="copySub('ddb-copy0')")

                            .item
                                .lable 交易时间:
                                .text
                                    span {{orderInfo.createTime ? orderInfo.createTime : '--'}}
                            .item
                                .lable 订单状态:
                                .text.galery
                                    span {{allStatus | formatBankStatus }}
                                    loadingBut(v-if="blueRefreshLoading")
                                    span.blueRefresh(@click="blueRefresh('', orderInfo.orderNo)") 刷新

                        .com-line

                        .down.success
                            .item.orange
                                .lable 需存入:
                                .text
                                    span {{orderInfo.orderAmt }} DDB
                                    span.copy-btn.ddb-copy007(:data-clipboard-text="orderInfo.orderAmt" @click="copySub('ddb-copy007')")
                            //.item
                                .lable 需存入:
                                .text
                                    span {{orderInfo.orderAmt }} DDB
                                    span.copy-btn.ddb-copy007(:data-clipboard-text="orderInfo.orderAmt" @click="copySub('ddb-copy007')")

                            .item
                                .lable 充币二维码:
                                .text

                            .qrcode-con
                                .qrcode-flow(@click="openQrDialog")
                                    qrcode(v-if='orderInfo.recAcctNo' :codeurl="orderInfo.recAcctNo",:clasz="'virtual'")
                                    .tips 点击放大
                        .jumpt-con
                            .btn(@click="openDDBPage(orderInfo.payUrl)") 去官网支付
                            .btn(@click="openDDBPage(ddpaLinkUrl)") 下载APP

                        //.btn-con.success
                        //    .common-btn.ok.big(@click="goBackStep")  我已付款成功
                        .bs
                            //.btn.common-btn.blueBgBtn(@click="openOrderDetail") 查看订单详情
                            .btn.common-btn.whiteBgBtn(@click="openServieUrl") 取消存款订单


                    .right
                        .open-con(v-if="!serviceFlag")
                            .icon-servie
                            .text 在线客服
                            .text 7*24小时在线客服,贴心至上
                            .btn(@click="openServieUrl") 存款遇到问题,点击联系客服
                        .ifram-con(v-if="serviceFlag")
                            iframe(:src="kefuUrl",height="100%",frameborder="0")


                .down-con
                    .title 温馨提示
                    ul
                        li
                            span 1.“启动滴滴付”唤起支付失败时，请选择“去官网支付”
                        li
                            span 2.充币->打开[滴滴付APP]->点击扫码付款->充币成功
                        li
                            span 3.提币->输入[滴滴付加密地址]->一键[提币]到账
                        li
                            span 4.卖币变现->出售挂单->确认收款->放币完成交易



        comDialog(:show-footer='false',:show="qrDialogFlag",@on-cancel="closeQrDialog")
            div(slot="header") 二维码
            .dialog-con(slot="default")
                .qr-page
                    .item(v-if="orderInfo.protocol")
                        span 链名称:
                        span.yellow(style="color:#ebb427")  {{orderInfo.protocol}}
                    .item
                        .lable 充币二维码:
                        .text

                    .qrcode-con
                        .qrcode-flow
                            qrcode( :codeurl="orderInfo.recAcctNo",:clasz="'virtual2'",width="240",height="240")

            div(slot="footer")

        comDialog(:show-footer='false',clasz="valet-dialog common-width",:show="msgDialogFlag",@on-cancel="closeMsgDialog",:show-close="false")
            div(slot="header") 温馨提示
            .dialog-con.valet-tip-con(slot="default")
                .msg2 您有一笔正在进行中的订单,点击继续支付,如需取消请联系客服
                .btn-con
                    .btn(@click="openServiceValet") 联系客服
                    .btn(@click="openValet") 继续支付
            div(slot="footer")

        comDialog(:show-footer='false',clasz="common-width",:show="showDialogCom",@on-cancel="closeDialogPhone")
            div(slot="header") 温馨提示
            div.dialog-con(slot="default")
                .apply-con
                    .title 检测到您还没有绑定手机号码，为了保障您的资金安全，请绑定后再操作
                    .btn-con
                        .common-btn.hidden(@click="closeDialogPhone") 取消
                        .common-btn.ok(@click="enterPhone") 去绑定
            div(slot="footer")

        // AI客服弹框
        comDialog(:show-footer='false',clasz="service-dialog",:show="serviceDialogFlag",@on-cancel="closeServiceDialog",:show-close="true")
            .dialog-con(slot="default")
                .ifram-con
                    iframe(:src="serviceIframeUrl",height="600px",frameborder="0" width='600px' ,@load="serviceIframOnload")

        // 充值未完成订单-跳转弹框
        comDialog(:show-footer='false',clasz="aitip-dialog common-width",:show="aitipDialogFlag",@on-cancel="closeAitipDialog",:show-close="true")
            div(slot="header") 温馨提示
            .dialog-con(slot="default")
                .title 您有一笔未完成的充值订单
                .money ¥ {{orderInfo.amount}}
                .msg-con
                    span 如需取消订单，请
                    span.service(@click="goService") 联系客服
                .btn-con
                    .common-btn.ok(v-if="orderInfo.fourRecharge" @click="closeAitipDialog2") 去完成
                    .common-btn.ok(v-else @click="goService") 去完成
            div(slot="footer")
        // 银行卡充值失败 提示弹框
        comDialog(:show-footer='false',clasz="aitip-dialog common-width",:show="jumpAiDialogFlag",@on-cancel="closeJumpAiDialog",:show-close="true")
            div(slot="header") 温馨提示
            .dialog-con(slot="default")
                .title2.cccColor 与支付商家通讯失败，您可以选择取消尝试其他支付方式，或者联系客服进行人工充值
                //.btn-con
                //    .common-btn.ok(@click="goToAiService") 联系专属客服
                .btn-con.common-btn-box
                    .common-btn.hidden(@click="closeJumpAiDialog(true)") 取消
                    .common-btn.ok(@click="goToAiService") 人工充值
            div(slot="footer")


        comDialog(:show-footer='false',clasz="common-width" :show="showDepositBefore",@on-cancel="closeDepositBefore")
            div(slot="header") 温馨提示
            div.dialog-con(slot="default")
                .deposit-before
                    .titleConfirm
                        .titleConfirmItem
                            span 请核对存款姓名：
                            span.name {{depositParam.depositName}}
                    .tipBox
                        .tipTitle 重要提醒
                        .redTip 公司银行卡不定期更换，每次充值请根据提交订单生成的银行卡转账，切勿直接转账至之前转入的银行卡，否则无法到账造成的损失，将由个人承担，公司概不负责负责！
                    .btn-con.common-btn-box
                        .common-btn.hidden(@click="closeDepositBefore") 取消
                        .common-btn.ok(@click="submit($event, true)") 确定
            div(slot="footer")

        comTelCode(v-if='showTelDialog',:showTelDialog="showTelDialog",@on-cancel="closeTelDialog",@on-success="telCodeSuccess",:telType="telType", :moduleName='moduleName', :showTopTip="true", :showService="false", header-title="手机号码")
        comDialog(:show-footer='false',clasz="common-width" :show="showConfirmDepositInfo")
            div(slot="header") 温馨提示
            div.dialog-con(slot="default")
                .deposit-before
                    .titleConfirm
                        .titleConfirmItem
                            span 转账请核对以下信息：
                    .titleConfirm
                        .titleConfirmItem
                            span 收款人姓名：
                            span.name(v-if="orderInfo.payInfo") {{orderInfo.payInfo.receivedName}}
                        .titleConfirmItem
                            span 存款金额：
                            span.name {{orderInfo.payAmount | format}} 元
                    .tipBox
                        .tipTitle 重要提醒
                        .redTip 转账时请认真核对以上信息填写是否正确，否则转账将不能到账，影响游戏体验！
                    .btn-con.common-btn-box
                        //.common-btn.hidden(@click="closeDepositBefore") 取消
                        .common-btn.ok(@click="showConfirmDepositInfo = false") 确定
            div(slot="footer")
        comDialog(:show-footer='false',clasz="aitip-dialog common-width",:show="showNoList",@on-cancel="showNoList = false",:show-close="true")
            div(slot="header") 温馨提示
            .dialog-con(slot="default")
                .title2 当前暂无可用的支付方式，请稍后再试
                .btn-con.common-btn-box
                    //.common-btn.hidden(@click="jumpAiDialogFlag = false") 取消
                    .common-btn.ok(@click="showNoList = false") 确定
            div(slot="footer")
        comDialog(:show-footer='false',clasz="aitip-dialog common-width",:show="showCountDone",@on-cancel="showCountDone = false",:show-close="true")
            div(slot="header") 温馨提示
            .dialog-con(slot="default")
                .title2 您的充值订单已超时，请勿继续支付！继续充值无法到账，自行承担损失！
                .btn-con.common-btn-box
                    //.common-btn.hidden(@click="jumpAiDialogFlag = false") 取消
                    .common-btn.ok(@click="showCountDone = false") 确定
            div(slot="footer")

</template>

<script>
import {mapActions, mapState} from 'vuex';
import thatStore from "@/store/comstore/assets/depositStore"; // 获取模板
import store from '@/store/Store';
import comDialog from '@pon/template1/comDialog'
import clipboard from "clipboard"
import Rule from "@m/rule"; // 验证
import qrcode from "@pon/template1/comQrcode"
import {formatAmount, toFixedFun} from "@m/utils";
import comTelCode from "@pon/template1/comTelCode";
import { getToken } from "@m/auth";
import loadingBut from "@/plugins/template1/loading/loadingBut";

export default {
    name: "deposit",
    components: {
        comDialog,
        qrcode,
        comTelCode,
        loadingBut
    },
    data() {
        return {
            currtStep: 1, // 当前存款步骤 1:存款 2: 银行卡支付详情 3:二维码支付详情 4:虚拟币详情
            showDiscountPopFlay: false,
            isReqFlag: true, // 请求是否结束
            currtPayType: '',//当前类型
            depositAmount: '', // 存款金额
            depositCount: '', // 存款数量
            currtItem: '',// 当前存款方式对象
            depositName: '',// 银行卡-存款姓名
            showDialog: false,// 弹框显示
            showDialogCom: false,//判断手机号
            showDepositBefore: false,// 点击立即存款 后弹层提示
            orderInfo: {
                payAmount: "",
                payInfo: {

                    // "depositorName":"depositorName",
                    // "depositMsg":"depositMsg",
                    // "receivedName":"receivedName",
                    // "receivedBankCard":"receivedBankCard",
                    // "receivedBankName":"receivedBankName",
                    // "receivedSubBankName":"receivedSubBankName"
                }
            },// 存款信息

            // 校验规则
            reg: {
                depositAmount: {
                    msg: "",
                    isPass: false
                },
                depositName: {
                    msg: "",
                    isPass: false
                },
            },

            //校验错误提示信息
            errorMsg: "",
            subFlag: false, // 是否校验通过

            currtNavTitle: '存款', // 当前回退标题
            time: 30 * 60,//倒计时时间
            minute: '',//分钟
            second: '',//秒
            interval: '',//计时器
            discountId: '', // 优惠id
            discountName: '', // 优惠名称

            virtualList: '',// 虚拟币列表
            currtVirtual: '', //当前虚拟币
            currtProtocol: '', //当前协议

            showIcon: true,// 是否显示活动图标
            currtUsdtType: 1, // 当前选中的usdt输入类型 1: 按金额购买 2: 按数量购买
            iframeUrl: '',//'http://83235bfb1896.ngrok.io/chat/#/chat/24738536c64246c084fa9802fa08a23e&showAsMobile=true'
            qrDialogFlag: false,
            valetFlag: false, // 是否已经请求代客
            serviceFlag: false,// 是否打开客服
            showErrorFlag: false,// 显示错误信息标识
            version: 1,// 版本号 测试用
            msgDialogFlag: false,// 显示提示框消息
            // 在线支付
            onlineList: ['alipay', 'weChat', 'cloud_flash', 'alipay_h5', 'weChat_h5', 'ebank', 'quick_pay', 'Alipay', 'WeChatPay'],
            // 银行卡类型
            bankCardList: ['bank_card', 'alipay_card', 'wechat_card', 'ebank_card', 'BankTransfer', 'OsBank'],
            // 老代客 ai 99
            cscType: ['valet_recharge'],
            // 虚拟币类型
            virtualType: ['usdt_pay'],
            // ddpay 类型
            ddpayType: ['blockchain'],
            serviceDialogFlag: false,// ai客服弹框
            serviceIframeUrl: '',// 客服iframeurl
            aitipDialogFlag: false,// 官方未完成订单
            jumpAiDialogFlag: false,// 银行卡存款跳转ai客服弹框

            depositParam: {},
            // 手机验证码弹框
            showTelDialog: false,
            isReqFlag2: true,
            telType: '3',
            moduleName: 'telCode',
            telCodeObj: {
                moduleName: '',// usdtDialog:1  rmbDialog:2    usdtDraw:3  rmbDraw:4
                mobile: '', // 手机号码
                verifyCode: '',// 验证码
                checkFlag: false,// 验证状态
            },
            showOrderDetail: false,
            showConfirmDepositInfo: false,
            // 银行卡bank 虚拟币vir
            orderDetail: 'bank',
            showNoList: false,
            allStatus: '1',
            blueRefreshLoading: false,
            showCountDone: false,
            paddingOrderList: [],//进行中的订单
        }
    },
    computed: {
        ...mapState({
            commonData: state => state['centerStore'].commonData,
            userInfo: state => state['centerStore'].userInfo,
            depositList: state => state['depositStore'].depositList,
            discountList: state => state['depositStore'].discountList, // 优惠活动列表
            discountItem: state => state['depositStore'].discountItem, // 优惠活动列表
            protocolList: state => state.depositStore.protocolList,// 协议列表
            exchangeRate: state => state.depositStore.exchangeRate,// 汇率
            currtDepositType: state => state.depositStore.currtDepositType,// 当前支付类型
            kefuUrl: state => state['homeStore'].kefuUrl,// 客服链接
            bankDetail: state => state['depositStore'].bankDetail,
            virtualDetail: state => state['depositStore'].virtualDetail,
            ddpaLinkUrl: state => state['depositStore'].ddpaLinkUrl,
        }),
        // 存款金额提示语
        qutoMoney: function () {
            //return `单笔存款金额：${parseInt(this.currtItem.minAmount)}元-${parseInt(this.currtItem.maxAmount)}元`;
            if (this.currtItem.minAmount && this.currtItem.maxAmount && this.currtItem.minAmount >= 0 && this.currtItem.maxAmount >= 0) {
                return `单笔存款金额：${this.currtItem.minAmount}元-${this.currtItem.maxAmount}元`;
            } else {
                return `请选择支付金额`;
            }
        },
        // 存款金额标识
        qutoMoneyFlag: function () {
            if (this.currtItem.minAmount && this.currtItem.maxAmount && this.currtItem.minAmount >= 0 && this.currtItem.maxAmount >= 0) {
                return true
            } else {
                return false
            }
        },
        // 存款数量提示语
        qutoCount: function () {
            if(this.currtItem.code == 'blockchain'){
                if (this.currtItem.minAmount && this.currtItem.maxAmount && this.currtItem.minAmount >= 0 && this.currtItem.maxAmount >= 0 ) {
                    return `单笔充值数量：${Math.ceil(this.currtItem.minAmount )} - ${Math.floor(this.currtItem.maxAmount )}  DDB`;
                } else {
                    return `请输入充值数量`;
                }
            }else{
                if (this.currtItem.minAmount && this.currtItem.maxAmount && this.currtItem.minAmount >= 0 && this.currtItem.maxAmount >= 0 && this.exchangeRate) {
                    return `单笔充值数量：${Math.ceil(this.currtItem.minAmount / this.exchangeRate)} - ${Math.floor(this.currtItem.maxAmount / this.exchangeRate)}  USDT`;
                } else {
                    return `请输入充值数量`;
                }
            }
        },

        // true : 有支付区间 可以输入 false:没有支付区间 不能输入
        inputFlag: function () {
            if (this.currtItem.minAmount && this.currtItem.maxAmount && this.currtItem.minAmount >= 0 && this.currtItem.maxAmount >= 0) {
                return true;
            } else {
                return false;
            }
        },
        fixedAmountList: function () {
            if (this.currtItem.fixedAmountStr) {
                return this.currtItem.fixedAmountStr.split(",")
            } else {
                return []
            }
        },
        // 是否是线上类型 且 不是代客充值(代客的payModeId为1 ,所以要排除一下) payModeId: 1 在线支付  2线下转账 3虚拟币;5:ddpay支付  银行卡转账, 支付宝-h5 微信-h5, 后两种为银行卡封装类型;
        isOnlineType: function () {
            // 1 在线支付  +  3虚拟币 然后排除掉代客
            if (this.currtItem.payModeId == 5 || this.currtItem.payModeId == 3 || (this.currtItem.payModeId == 1 && this.currtItem.code != 'valet_recharge') || this.onlineList.includes(this.currtItem.code)) {
                return true;
            } else {
                return false;
            }
        },
        // 是否是银行卡类型 :payModeId: 1 在线支付  2线下转账 3虚拟币;  银行卡转账, 支付宝-h5 微信-h5, 后两种为银行卡封装类型;
        isBnakType: function () {
            if (this.currtItem.payModeId == 2 || this.bankCardList.includes(this.currtItem.code)) {
                return true;
            } else {
                return false;
            }
        },
        // 是虚拟币类型 虚拟币+ddpay
        isVirtualType: function () {
            if (this.currtItem.code == 'usdt_pay' || this.currtItem.code == 'blockchain') {
                return true;
            } else {
                return false;
            }
        },
        // usdt预付金额
        usdtNum: function () {
            if (this.depositAmount && this.exchangeRate) {
                return (this.depositAmount / this.exchangeRate).toFixed(3);
            }
            return 0;
        },
        countRmb() {
            if (this.depositCount && this.exchangeRate) {
                return (this.depositCount * this.exchangeRate).toFixed(2);
            }
            return 0;
        },


    },
    created() {
        // 动态store
        if (!store.state["depositStore"]) {
            thatStore.install(this);
        }
        // 设置tab事件
        this.$root.eventHub.$off("depositTab").$on("depositTab", (res) => {
            this.initPage();
        })
        this.initPage()
    },
    activated() {
        this.$setBuriedPoint('J10050');
    },
    watch: {
        depositName(val, old) {
            this.runCheckList()
        },
        depositAmount(val, old) {
            //this.depositCount = Math.floor(this.usdtNum);
            this.runCheckList()
        },
        depositCount(val, old) {
            this.depositAmount = Math.ceil(this.countRmb);
            this.runCheckList()
        },
        userInfo(val, oldval) {
            if (val) {
                this.depositName = val.realName;
            }
        },
        // currtDepositType(val, oldval) {
        //     // 判断值是否存在 且 不是相同的tab
        //     if (val && val != oldval) {
        //         this.initPage();
        //     }
        // },


    },
    filters: {
        format(vlaue) {
            if (vlaue) {
                if (typeof (value) == "string") {
                    return formatAmount(Number(vlaue))
                }
                return formatAmount(vlaue);
            } else {
                return "0"
            }
        },
        formatBankStatus(value) {
            if (value) {
                if (value == 1) {
                    return '处理中'
                } else if (value == 2) {
                    return '成功'
                } else if (value == 3) {
                    return '失败'
                } else if (value == 4) {
                    return '已取消'
                } else {
                    return ''
                }
            } else {
                return ""
            }
        },
        formatVirStatus(value) {
            if (value) {
                if (value == 1) {
                    return '已提交，待审核'
                } else if (value == 2) {
                    return '已审核，已完成'
                } else {
                    return ''
                }
            } else {
                return ""
            }
        }
    },
    mounted() {
        this.depositName = this.userInfo.realName;
        this.$setBuriedPoint('J10050');
        window.deposit = this
        // 进行中的订单
        this.getOrderMsgFun()
        this.getddpAddresssFun()
    },
    methods: {
        ...mapActions({
            getDepositListAction(dispatch, param) {
                if (parseInt(param.groupId) == 999) return
                return dispatch(`depositStore/getDepositListAction`, param);
            },
            depositSubmitFun(dispatch, param) {
                return dispatch(`depositStore/depositSubmitAction`, param);
            },
            // 取消存款订单
            cancelDepositFun(dispatch, param) {
                return dispatch(`depositStore/cancelDepositAction`, param);
            },
            // 获取支付优惠活动
            getDescountPopListFun(dispatch, param) {
                return dispatch(`depositStore/getDescountPopListAction`, param);
            },
            // 获取协议
            getProtocolListFun(dispatch, param) {
                return dispatch(`depositStore/getProtocolListAction`, param);
            },
            // 虚拟币保存
            virtualSubmitFun(dispatch, param) {
                return dispatch('depositStore/virtualSubmitAction', param);
            },
            // 回到顶部
            returnTopFun(dispatch, param) {
                return dispatch('returnTop', param);
            },
            getBankTransferDetailAction(dispatch, param) {
                return dispatch('depositStore/getBankTransferDetailAction', param);
            },
            getVirtualDetailAction(dispatch, param) {
                return dispatch('depositStore/getVirtualDetailAction', param);
            },
            // 查询进行中的订单
            getOrderMsgAction(dispatch) {
                return dispatch(`drawStore/getOrderMsgAction`);
            },
        }),
        selectPayType(item) {
            this.currtNavTitle = item.name;
            this.currtItem = item;
            this.depositAmount = "";
            this.errorMsg = "";
            this.subFlag = false;
            //this.depositName = "";

            if (item.id == 99) {
                if(this.kefuUrl){
                    this.goToCS();
                }else{
                    setTimeout(()=>{
                        this.goToCS();
                    },1000)
                }
                // return;
            }
            this.getDiscountList(this.currtItem);
            // 设置虚拟币存款方式;
            if (item && item.code == 'usdt_pay') {
                this.virtualList = item.currencyList;
                // 默认选中第一个
                this.currtVirtual = item.currencyList[0];
                this.getProtocolList();
            } else {
                // 清空当前虚拟币协议;
                this.currtProtocol = "";
            }
        },
        // 选择虚拟货币
        selectVirtua(item) {
            // 如果是当前货币 则返回;
            if (this.currtVirtual.name == item.name) {
                return;
            }
            this.currtVirtual = item;
            // 获取币种下的协议;
            this.getProtocolList();
        },
        // 选择协议
        selectProtocol(item) {
            this.currtProtocol = item;
        },
        // 查询协议
        getProtocolList() {
            // 查询排名第一位的协议;
            this.getProtocolListFun({id: this.currtVirtual.id, value: this.currtVirtual.value}).then(res => {
                // 设置当前协议
                this.currtProtocol = this.protocolList[0];
            })
        },
        selectMoney(item) {
            this.depositAmount = item;
            //校验
            this.depositAmountVerif(true)
        },
        // 页面初始化
        initPage() {
            let that = this;
            this.depositName = this.userInfo.realName;
            this.resetPageData()
            // 现在的代客支付
            // if (this.currtDepositType.id == 999) {
            //     if(this.kefuUrl){
            //         this.goToCS();
            //     }else{
            //         setTimeout(()=>{
            //             this.goToCS();
            //         },1000)
            //     }
            //     return;
            // }
            this.getDepositListAction({groupId: 888}).then((res) => {
                if (res.success && res.data && res.data.length > 0) {
                    that.currtItem = res.data[0];
                    that.currtNavTitle = res.data[0].name;
                    that.depositName = that.userInfo.realName;
                    that.realNameVerif();
                    that.getDiscountList(that.currtItem);

                    if (that.currtItem.id == 99) {
                        if(this.kefuUrl){
                            this.goToCS();
                        }else{
                            setTimeout(()=>{
                                this.goToCS();
                            },1000)
                        }
                        // return;
                    }
                    // 判断第一个是不是虚拟币支付, 如果是虚拟币支付, 则查询虚拟币排名第一位的协议;
                    if (that.currtItem.code == "usdt_pay") {
                        // 设定虚拟币种类列表
                        that.virtualList = res.data[0].currencyList;
                        // 默认选中第一个虚拟币种类
                        that.currtVirtual = res.data[0].currencyList[0];
                        that.getProtocolList();
                    }
                    // this.currtStep = 4
                } else if (res.success && res.data.length == 0) {
                    this.showNoList = true
                }
            })

        },
        submit(event, confirm) {
            let that = this;
            // 1. 参数: 银行卡 & 二维码参数;
            let param = {
                payTypeId: this.currtItem.id, // 支付类型
                payModeId: this.currtItem.payModeId, // 存款方式id
                depositAmount: this.depositAmount,//转账金额
                thirdCode: this.currtItem.thirdCode,//三方编码
                thirdSubCode: this.currtItem.thirdSubCode,//三方编码类型
                depositName: this.depositName.replace(/\s*/g, ""), //存款姓名
            }
            // 是否是银行卡转账
            if (this.currtItem.code == 'bank_card') {
                param.bankCardCode = this.currtItem.bankCardCode;  //银行卡编号 银行卡才有
            }
            // 首存活动参数
            if (this.discountId) {
                Object.assign(param, {activityIds: [this.discountId]}); // 参加的首存
            }
            // 虚拟币参数
            if (this.currtItem.code == 'usdt_pay') {
                param.virCurrency = this.currtVirtual.value;
                param.protocol = this.currtProtocol.value;
            }
            // DDB 参数
            if (this.currtItem.code == 'blockchain') {
                param.virCurrency = 'DDB';
                param.protocol = 'DDB';
            }
            // 2. 表单校验
            this.runCheckList()
            if (!this.subFlag) {
                window.win.tips.info(this.errorMsg);
                return;
            }
            // 3.校验金额是否是固定金额
            if (this.fixedAmountList.includes(this.depositAmount + "")) {

            } else if (this.currtUsdtType === 1) { // 如果输入的是金额
                // 校验金额范围 this.currtItem.minAmount  this.currtItem.maxAmount
                let tip = `请输入：${this.currtItem.minAmount}元-${this.currtItem.maxAmount} 区间内的存款金额`;
                //判断区间金额是否存在
                if (this.currtItem.minAmount && this.currtItem.maxAmount) {
                    if (!(parseInt(this.currtItem.minAmount) <= parseInt(this.depositAmount) && parseInt(this.depositAmount) <= parseInt(this.currtItem.maxAmount))) {
                        window.win.tips.info(tip);
                        return;
                    }
                }
            } else if (this.currtUsdtType === 2) { // 如果是按数量充值
                // 如果是DDB充值
                if(this.currtItem.code == 'blockchain'){
                    let tip = `请输入：${Math.ceil(this.currtItem.minAmount )} - ${Math.floor(this.currtItem.maxAmount )} 区间内的DDB`;
                    //判断区间金额是否存在
                    if (this.currtItem.minAmount && this.currtItem.maxAmount) {
                        if (!(Math.ceil(this.currtItem.minAmount ) <= parseInt(this.depositCount) && parseInt(this.depositCount) <= Math.floor(this.currtItem.maxAmount ))) {
                            window.win.tips.info(tip);
                            return;
                        }
                    }
                }else{
                    let tip = `请输入：${Math.ceil(this.currtItem.minAmount / this.exchangeRate)} - ${Math.floor(this.currtItem.maxAmount / this.exchangeRate)} 区间内的USDT`;
                    //判断区间金额是否存在
                    if (this.currtItem.minAmount && this.currtItem.maxAmount) {
                        if (!(Math.ceil(this.currtItem.minAmount / this.exchangeRate) <= parseInt(this.depositCount) && parseInt(this.depositCount) <= Math.floor(this.currtItem.maxAmount / this.exchangeRate))) {
                            window.win.tips.info(tip);
                            return;
                        }
                    }
                }

            }
            this.depositParam = param
            // 判断是否绑定电话号码
            if (this.userInfo.mobile == "" || this.userInfo.mobileChecked == false) {
                this.showDialogCom = true
                return
            }
            // 银行卡类 弹层提示
            if (this.isBnakType && confirm !== true) {
                this.showDepositBefore = true
                return;
            } else {
                this.showDepositBefore = false
            }
            // 4. 判断是否是请求中
            if (this.isReqFlag) {
                this.isReqFlag = false;
            } else {
                return;
            }


            // 5.打开窗口 银行卡类 & 虚拟支付不需要弹出;
            if (!this.isBnakType && this.currtItem.code != 'usdt_pay' && this.currtItem.code != 'valet_recharge') {
                var wintab = window.open("", "_blank");
            }

            // 6. 先跳转到中间页面 , 接口返回后再进行逻辑操作;
            this.goNextStep(3);
            // 7.请求保存接口: 虚拟币一个接口,其它的方式同一个接口
            if (this.isVirtualType) {
                this.virtualSubmitFun(param).then(res => {
                    // 这里很诡异...不知道什么原因;
                    //res.code = 200;
                    this.isReqFlag = true;
                    if (res && res.success) {
                        this.allStatus = 1
                        if (wintab) {
                            wintab.close()
                        }
                        // 如果是DDB
                        if(this.currtItem.code == 'blockchain'){
                            this.currtStep = 8;
                            let arr = res.data.payUrl.split('?params=')
                            let params = JSON.parse(window.atob(arr[1]))
                            this.orderInfo.createTime = res.data.createTime
                            this.orderInfo.payUrl = res.data.payUrl

                            this.orderInfo.orderAmt = params.orderAmt
                            this.orderInfo.orderNo = res.data.orderDepositId
                            this.orderInfo.recAcctNo = params.qrCode

                        }else{ // 如果是虚拟币
                            this.currtStep = 4;
                            // 兼容线下支付 订单编号 id字段
                            res.data.id = res.data.orderDepositId;
                            this.orderInfo = res.data;
                        }
                        this.returnTopFun()
                    } else {
                        // 如果有未完成的订单
                        if (res.code == 397) {
                            this.currtStep = 4;
                            this.returnTopFun()
                            this.orderInfo = res.data;
                        } else {
                            // 提示订单失败弹框 - ai 客服
                            this.openJumpAiDialog()
                        }
                        // // 如果测试失败, 则判断有没有代客, 判断是否开启了代客
                        // if (this.userInfo.isValet) {
                        //     this.currtStep = 5;
                        // } else {
                        //     that.currtStep = 6;
                        //     that.showErrorFlag = true;
                        //
                        // }
                        this.orderInfo = {
                            payAmount: "",
                            payInfo: {}
                        };
                        if (wintab) {
                            wintab.close()
                        }
                    }
                }).catch(e => {
                    console.log(e);
                })
            } else if (this.currtItem.code == 'valet_recharge') { // 如果是代客充值
                this.depositSubmitFun(param).then((res) => {
                    this.isReqFlag = true;
                    if (res && res.success) {
                        this.allStatus = 1
                        this.valetFlag = true;
                        // 判断是否有上一笔未完成的订单
                        if (res.data.isRepeat == 1) {
                            this.iframeUrl = res.data.chatUrl;
                            // 判断拼接符
                            if (this.iframeUrl.indexOf("?") >= 0) {
                                this.iframeUrl = this.iframeUrl + "&showAsMobile=true";
                            } else {
                                this.iframeUrl = this.iframeUrl + "?showAsMobile=true";
                            }
                            this.openMsgDialog();
                        } else {
                            this.orderInfo = res.data;
                            this.iframeUrl = res.data.payUrl;
                            this.orderInfo.payInfo.id = res.data.orderDepositId;
                            this.orderInfo.payInfo.createTime = res.data.createTime;
                            // 判断拼接符
                            if (this.iframeUrl.indexOf("?") >= 0) {
                                this.iframeUrl = this.iframeUrl + "&showAsMobile=true";
                            } else {
                                this.iframeUrl = this.iframeUrl + "?showAsMobile=true";
                            }
                            this.currtStep = 7;
                            this.valetEvent()
                        }
                    } else {
                        this.valetFlag = false;
                        this.iframeUrl = "";
                    }
                })
            } else { // 银行卡支付
                this.depositSubmitFun(param).then((res) => {
                    // 这里很诡异...不知道什么原因;
                    //res.code = 200;
                    // {"code":200,"success":true,"data":{"amount":100.0,"officialRecharge":1,"isRepeat":0},"msg":"操作成功"}
                    that.isReqFlag = true;
                    if (res && res.success) {
                        this.allStatus = 1
                        if (!window.win.store.state.centerStore.userInfo.realName) {
                            that.$set(that.userInfo, 'realName', that.depositName)
                        }
                        // 判断是不是充值未完成订单
                        if (res.data.officialRecharge == 1) {
                            that.orderInfo = res.data;
                            that.openAitipDialog()
                            // 退回到上一个菜单
                            that.goBackStep();
                            return;
                        }
                        // 四点零订单未完成订单
                        if(res.data.fourRecharge ==1){
                            that.orderInfo = res.data;
                            that.openAitipDialog()
                            that.returnTopFun()
                            return;
                        }
                        // 判断是否有上一笔未完成的订单 -- 老代客的
                        if (res.data.isRepeat == 1) {
                            this.iframeUrl = res.data.chatUrl;
                            // 判断拼接符
                            if (this.iframeUrl.indexOf("?") >= 0) {
                                this.iframeUrl = this.iframeUrl + "&showAsMobile=true";
                            } else {
                                this.iframeUrl = this.iframeUrl + "?showAsMobile=true";
                            }
                            this.openMsgDialog();
                            return;
                        }

                        // 如果是银行卡类型
                        if (that.isBnakType) {
                            that.currtStep = 2;
                            that.orderInfo = res.data;
                            that.showConfirmDepositInfo = true
                            that.returnTopFun()
                        } else {
                            that.returnTopFun()
                            wintab.location.href = res.data.payUrl;
                        }
                    } else {
                        // 如果有未完成的订单
                        if (res.code == 398) {
                            if (that.isBnakType) {
                                that.currtStep = 2;
                                that.returnTopFun()
                                //that.showDialog = true;
                                that.orderInfo = res.data;
                                return;
                            }
                        } else {
                            // 提示订单失败弹框 - ai 客服
                            this.openJumpAiDialog()
                        }
                        // // 判断有没有代客
                        // if (that.userInfo.isValet) {
                        //     that.currtStep = 5;
                        // } else {
                        //     that.currtStep = 6;
                        //     that.showErrorFlag = true;
                        //
                        // }
                        that.orderInfo = {
                            payAmount: "",
                            payInfo: {}
                        };
                        if (wintab) {
                            wintab.close()
                        }
                    }
                }).catch(e => {
                    console.log(e);
                })
            }


        },
        //关闭弹框
        closeDialog() {
            this.showDialog = false;
            this.showDiscountPopFlay = false;
            // 取消app 滚动
            document.getElementById("app").style.overflowY = "";
        },
        // 复制内容
        copySub(c) {
            const btnCopy = new clipboard(`.${c}`);
            btnCopy.on('success', e => {
                this.$tips.toast(`复制成功`)
                e.clearSelection();
            });
        },
        //1 存款金额 flag 代表是按钮过来的金额 不进行小数点过滤
        depositAmountVerif(flag) {
            //this.depositAmount = this.depositAmount.replace(/[^\d]/g, '')
            let rule = Rule.init().rules.depositAmount,
                bool = rule.reg.test(this.depositAmount);
            if (bool) {
                this.reg.depositAmount.isPass = true;
                this.reg.depositAmount.msg = "";
            } else {
                this.reg.depositAmount.isPass = false;
                this.reg.depositAmount.msg = rule.desc;
                this.errorMsg = rule.desc;
            }
            this.btnVerif();
        },
        //  替换小数点的金额校验
        depositAmountVerifRe(flag) {
            // 转成字符串
            this.depositAmount = this.depositAmount + "";
            // 说明带小数点
            if (this.depositAmount.indexOf(".") >= 0) {
                this.depositAmount = parseInt(this.depositAmount).toString();
            }
            this.depositAmount = this.depositAmount.replace(/[^\d]/g, '')
            let rule = Rule.init().rules.depositAmount,
                bool = rule.reg.test(this.depositAmount);
            if (bool) {
                this.reg.depositAmount.isPass = true;
                this.reg.depositAmount.msg = "";

            } else {
                this.reg.depositAmount.isPass = false;
                this.reg.depositAmount.msg = rule.desc;
                this.errorMsg = rule.desc;

            }
            this.btnVerif();
        },
        // 存款姓名
        realNameVerif() {
            let rule = Rule.init().rules.realName,
                bool = rule.reg.test(this.depositName);
            // this.currtItem.code == 'usdt_pay'
            if (bool || this.isOnlineType) {
                this.reg.depositName.isPass = true;
                this.reg.depositName.msg = "";
            } else {
                this.reg.depositName.isPass = false;
                this.reg.depositName.msg = rule.desc;
                this.errorMsg = rule.desc;
            }
            this.btnVerif();
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
        // 执行校验 -- 倒序
        runCheckList() {
            this.depositAmountVerifRe()
            this.realNameVerif()
        },
        goBackStep() {
            this.currtStep = 1;
            this.valetFlag = false; // 是否已经请求代客
            this.serviceFlag = false;// 是否打开客服
            this.showErrorFlag = false;
            clearInterval(this.interval)
            this.interval = "";
            this.depositAmount = "";
            this.depositCount = "";
            this.runCheckList()
            this.getDiscountList(this.currtItem);
            this.returnTopFun()
        },
        goNextStep(step) {
            this.currtStep = step;
            this.showErrorFlag = false;
            clearInterval(this.interval);
            this.countTime();
            this.returnTopFun()
        },
        // 专用跳转
        goThirStep() {
            this.currtStep = 6;
            this.showErrorFlag = true;
            clearInterval(this.interval);
            this.countTime();
            this.returnTopFun()
        },
        cancelFun() {
            let that = this;
            this.cancelDepositFun({id: that.orderInfo.orderDepositId}).then(res => {
                if (res && res.success) {
                    that.currtStep = 1;
                } else {
                    that.currtStep = 1;
                }
                that.returnTopFun()
            })
        },
        //倒计时时间
        countTime() {
            let that = this;
            let time = 15 * 60;
            // 如果是支付宝H5 就是15分钟 剩下的20分钟
            if (this.currtItem.code == 'alipay_h5') {
                time = 15 * 60;
            } else {
                time = 20 * 60;
            }
            this.interval = setInterval(() => {
                if (time <= 0) {
                    clearInterval(that.interval);
                    that.currtStep = 1;
                    that.returnTopFun()
                    that.showCountDone = true
                    return;
                }
                time = time - 1;
                that.minute = parseInt(time / 60).toString().length == 1 ? "0" + parseInt(time / 60) : parseInt(time / 60);
                that.second = parseInt(time % 60).toString().length == 1 ? "0" + parseInt(time % 60) : parseInt(time % 60);
                //console.log('还剩' + that.minute + '分' + that.second + '秒')
            }, 1000);
        },
        openDiscountPop() {
            this.showDiscountPopFlay = !this.showDiscountPopFlay;
            // 滚动到可视区域;
            document.getElementById("app").scrollTop = "600";
            // app 滚动去掉
            //document.getElementById("app").style.overflowY = "hidden"
        },
        selectDiscount(item) {
            if (item) {
                this.discountId = item.id;
                this.discountName = item.name
            }
            this.closeDialog();
        },
        getDiscountList(item) {
            // 获取支付优惠活动
            this.getDescountPopListFun({payTypeId: item.id}).then(res => {
                if (res && res.success) {
                    this.selectDiscount(res.data[0])
                }
            })
        },
        jumpUsdtDetail(type) {
            let url
            if(type == 'usdt') {
                url = 'https://shrkp.com/'
            }
            if(type == 'ddpay') {
                url = 'https://ddpaywzo.com/'
            }
            window.open(url, '_blank')
        },
        // 重置页面数据
        resetPageData() {
            this.currtStep = 1;
            this.valetFlag = false; // 是否已经请求代客
            this.serviceFlag = false;// 是否打开客服
            this.showErrorFlag = false;
            clearInterval(this.interval)
            this.interval = "";
            this.depositAmount = "";
            this.depositCount = "";
            this.returnTopFun()
            this.runCheckList()
        },
        // 重置服务状态数据
        resetServiceData() {
            this.valetFlag = false; // 是否已经请求代客
            this.serviceFlag = false;// 是否打开客服
            clearInterval(this.interval)
            this.interval = "";
            this.depositAmount = "";
            this.returnTopFun()
            this.runCheckList()
        },
        // 设置选中的usdt标签
        selectUsdtPayType(item) {
            this.currtUsdtType = item;
            this.depositCount = "";
            this.depositAmount = "";

        },
        // 打开二维码弹框
        openQrDialog() {
            this.qrDialogFlag = true;
        },
        // 关闭二维码弹框
        closeQrDialog() {
            this.qrDialogFlag = false;
        },
        // 发起代客充值请求
        getValetChat() {
            let param = {
                depositAmount: this.depositAmount,//转账金额
                depositName: this.depositName.replace(/\s*/g, ""), //存款姓名
                payTypeId: this.userInfo.payTypeId, // 支付类型
                payModeId: this.userInfo.payModeId, // 存款方式id
                thirdCode: this.userInfo.thirdCode,//三方编码
                thirdSubCode: this.userInfo.thirdSubCode,//三方编码类型
            }
            // 1. 判断是否是请求中
            if (this.isReqFlag) {
                this.isReqFlag = false;
            } else {
                return;
            }
            this.depositSubmitFun(param).then((res) => {
                this.isReqFlag = true;
                // res = {"code":400,"success":false,"data":{},"msg":"下单失败：去除权重为空和权重为0的商户，无可用商户"}
                // res = {
                //     "code": 200,
                //     "success": true,
                //     "data": {
                //         "success": true,
                //         "message": "下单成功",
                //         "device": 2,
                //         "payModeId": 1,
                //         "thirdOrderNo": "20210625233729000573",
                //         "payAmount": 2500,
                //         "payUrl": "https://chat.ypfwerwerwer.com/#/chat/2bc39e219908476fb6c551096c539d30",
                //         "payInfo": {
                //             "id": "234234234",
                //             "createTime": "2021-06-25 23:37:28",
                //             "modifyTime": "",
                //             "version": "",
                //             "deleted": false,
                //             "depositorName": "",
                //             "depositMsg": "",
                //             "receivedName": "",
                //             "receivedBankCard": "",
                //             "receivedBankName": "",
                //             "receivedSubBankName": "",
                //             "tenantPlatId": "",
                //             "amount": "",
                //             "status": "",
                //             "payTypeGroupName": ""
                //         },
                //         "orderDepositId": "1408449271690252289",
                //         "orderAmt": "",
                //         "virOrderAmt": "",
                //         "currency": "",
                //         "virCurrency": "",
                //         "protocol": "",
                //         "unitPrice": "",
                //         "recAcctNo": "",
                //         "payTypeGroupName": "聚合支付2",
                //         "createTime": "2021-06-25 23:37:28"
                //     },
                //     "msg": "操作成功"
                // };
                if (res && res.success) {
                    this.valetFlag = true;
                    // 判断是否有上一笔未完成的订单
                    if (res.data.isRepeat == 1) {
                        this.iframeUrl = res.data.chatUrl;
                        // 判断拼接符
                        if (this.iframeUrl.indexOf("?") >= 0) {
                            this.iframeUrl = this.iframeUrl + "&showAsMobile=true";
                        } else {
                            this.iframeUrl = this.iframeUrl + "?showAsMobile=true";
                        }
                        this.openMsgDialog();
                        return;
                    } else {
                        this.orderInfo = res.data;
                        this.iframeUrl = res.data.payUrl;
                        this.orderInfo.payInfo.id = res.data.orderDepositId;
                        this.orderInfo.payInfo.createTime = res.data.createTime;
                        // 判断拼接符
                        if (this.iframeUrl.indexOf("?") >= 0) {
                            this.iframeUrl = this.iframeUrl + "&showAsMobile=true";
                        } else {
                            this.iframeUrl = this.iframeUrl + "?showAsMobile=true";
                        }
                        this.valetEvent()
                    }

                } else {
                    this.valetFlag = false;
                    this.iframeUrl = "";
                }
            })
        },
        // 打开客服链接
        openServieUrl() {
            if (this.kefuUrl) {
                let str = this.kefuUrl.substr(this.kefuUrl.lastIndexOf("imClient?"))
                let url = this.kefuUrl + `&channelType=2&platform=2&origin=${window.location.origin}`
                if (this.kefuUrl.indexOf('imClient') > -1) {
                    url = `${window.location.protocol}//${window.location.host}/vhtml/#/${str}&channelType=2&platform=2&origin=${window.location.origin}`
                }
                this.serviceIframeUrl = url;
                this.openServiceDialog();
            } else {
                window.win.tips.success('客服连接未生成，请稍后')
            }
        },
        goToCS() {
            // 判断是否绑定电话号码
            if (this.userInfo.mobile == "" || this.userInfo.mobileChecked == false) {
                this.showDialogCom = true
            } else {
                // &channelType=2
                if (this.kefuUrl) {
                    let str = this.kefuUrl.substr(this.kefuUrl.lastIndexOf("imClient?"))
                    console.log(str, window.location.host)
                    console.log(this.kefuUrl)

                    let url = this.kefuUrl + `&channelType=2&platform=2&origin=${window.location.origin}`
                    if (this.kefuUrl.indexOf('imClient') > -1) {
                        url = `${window.location.protocol}//${window.location.host}/vhtml/#/${str}&channelType=2`
                    }
                    //window.open(url, "_blank");
                    this.serviceIframeUrl = url;
                    this.openServiceDialog();
                } else {
                    window.win.tips.success('客服连接未生成，请稍后')
                }
            }
        },
        // 打开代客事件 laodding3秒后自动关闭
        valetEvent() {
            window.win.myloading.show();
            setTimeout(() => {
                window.win.myloading.hidden()
            }, 3000)
        },
        // 代客充值加载完毕
        iframOnload() {
            setTimeout(() => {
                window.win.myloading.hidden()
            }, 3000)
        },
        // AI客服加载完毕
        serviceIframOnload() {
            window.win.myloading.hidden()
        },
        // 打开消息弹框
        openMsgDialog() {
            this.msgDialogFlag = true;
        },
        // 关闭消息弹框
        closeMsgDialog() {
            this.msgDialogFlag = false;
            this.currtStep = 7;
            this.valetEvent()
        },
        // 打开客服聊天链接
        openServiceValet() {
            this.iframeUrl = this.iframeUrl + "&autosend=isCancelOrder";
            this.currtStep = 7;
            this.msgDialogFlag = false;
            this.valetEvent()
        },
        // 直接打开代客链接
        openValet() {
            this.currtStep = 7;
            this.msgDialogFlag = false;
            this.valetEvent()
        },

        //关闭判断绑定号码dialog
        closeDialogPhone() {
            this.showDialogCom = false
        },
        //判断绑定号码确认
        enterPhone() {
            // this.$router.push({path: '/center/userinfo', query: {tab: 2}})
            this.showDialogCom = false
            this.openTelDialog()
        },
        // 关闭客服弹框
        closeServiceDialog() {
            this.serviceDialogFlag = false;
        },
        // 打开客服弹框
        openServiceDialog(){
            this.serviceDialogFlag = true;
            window.win.myloading.show()
        },
        // 关闭客服弹框
        closeAitipDialog(){
            this.aitipDialogFlag = false;
        },
        // 关闭客服弹框
        closeAitipDialog2(){
            this.aitipDialogFlag = false;
            this.currtStep = 2;
        },
        // 打开客服弹框
        openAitipDialog(){
            this.aitipDialogFlag = true;
        },
        // 跳转ai客服
        goService(){
            this.closeAitipDialog();
            this.goToCS()
        },
        // 关闭银行卡存款失败 跳转ai客服界面
        closeJumpAiDialog(backStep){
            this.jumpAiDialogFlag = false;
            if (backStep === true) {
                this.goBackStep()
            }
        },
        // 打开银行卡存款失败 跳转ai客服界面
        openJumpAiDialog(){
            this.jumpAiDialogFlag = true;
        },
        goToAiService(){
            this.closeJumpAiDialog()
            this.openServieUrl()
        },
        openDDBPage(url){
            // let token = getToken()
            window.open(url,'_blank')
        },
        closeDepositBefore() {
            this.showDepositBefore = false
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

            // 调用接口
            // if (this.telCodeObj.moduleName == 'usdtDialog') { // 虚拟币信息认证
            //     this.submit();
            // } else if (this.telCodeObj.moduleName == 'rmbDialog') { // 人民币信息认证
            //     this.withdrawalInfo();
            // } else if (this.telCodeObj.moduleName == 'usdtDraw') { // 虚拟币取款
            //     this.drawVirSubmit();
            // } else if (this.telCodeObj.moduleName == 'rmbDraw') { // 人民币取款
            //     this.drawSubmit();
            // }
            this.updatePhone()
        },
        updatePhone() {
            let param = {
                newMobile: this.telCodeObj.mobile, // 新手机号码
                newVerifyCode: this.telCodeObj.verifyCode, // 新验证码
            };
            if (param.newMobile) {
                param.newMobile = param.newMobile.replace(/\s/g, "")
            }
            Object.assign(param,this.telCodeObj);
            let that = this;
            // 校验
            // this.runCheckList()
            // if (!this.subFlag) {
            //     window.win.tips.info(this.errorMsg);
            //     return;
            // }
            //防重复
            if (this.isReqFlag2) {
                this.isReqFlag2 = false;
                this.$store.dispatch("telephoneStore/setPhoneAction", param).then(res => {
                    that.isReqFlag2 = true;
                    if (res && res.success) {
                        that.$store.dispatch("centerStore/getUserInfoAction")
                        that.showTelDialog = false
                        // that.step = 3;
                        // that.clearInpName();
                        // that.closeTelDialog();
                    } else {
                        window.win.tips.info(res.msg)
                    }
                });
            }
        },
        openOrderDetail() {
            this.showOrderDetail = true
            // getVirtualDetailAction
            // getBankTransferDetailAction
        },
        blueRefresh(type, id) {
            if (!id) return
            if (this.blueRefreshLoading) return;
            this.blueRefreshLoading = true
            if (type == 'bank') {
                this.getBankTransferDetailAction({
                    id: id
                }).then(res => {
                    if (res.success) {
                        if (this.currtStep == 2) {
                            this.allStatus = res.data.status
                        }
                    }
                    this.blueRefreshLoading = false
                }).catch(() => {
                    this.blueRefreshLoading = false
                })
            } else {
                this.getVirtualDetailAction({
                    id: id
                }).then(res => {
                    if (res.success) {
                        if (this.currtStep == 2) {
                            this.allStatus = res.data.status
                        }
                    }
                    this.blueRefreshLoading = false
                }).catch(() => {
                    this.blueRefreshLoading = false
                })
            }
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
        getddpAddresssFun() {
            console.log('ccc01----')
            this.$store.dispatch("depositStore/getddpAddresssAct").then((res) => {
                console.log('ccc02----',res)
            })
        }
    }

}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template1/themes/mixin.styl'
@import "~@styl/template1/common/fun.styl"

.readonly
    bg_color(bg22)

.galery
    font_color(fc010)

.red
    color #fa5151

.deposit
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

                    input
                        font-size 16px

                    .lable
                        flex none
                        width 90px
                        text-align right
                        font-size: 16px;
                        letter-spacing: 2px;
                        font_color(fc05);

                .item
                    .lable-con
                        display flex
                        flex-direction row
                        justify-content flex-start
                        align-items center

                        .lable
                            cursor pointer

                    .lable
                        font-size: 16px;
                        font_color(fc05);
                        margin 10px 0px
                        margin-right 20px
                        position relative

                        &.active:before
                            before()
                            width 84px
                            height 2px
                            border-radius 4px
                            bg_color(fc010);
                            top 24px

                    .pay-list
                        margin-bottom 10px

                        ul
                            resetul()
                            display flex
                            flex-direction row
                            flex-wrap wrap
                            justify-content space-between
                            align-items center

                            li
                                flex none
                                width: 30%;
                                height: 68px;
                                text-align center
                                border-radius: 10px;
                                border_all(1px, solid, border18)
                                padding-left 30px
                                margin-bottom 6px
                                position relative
                                cursor pointer

                                &.empty
                                    height 0px
                                    border none
                                    background none
                                    box-shadow none

                                &:last-child
                                    margin-right auto

                                &.active
                                    bg_color(bg05);

                                    &:after
                                        content ''
                                        display block
                                        width 32px
                                        height 32px
                                        position absolute
                                        bottom 0px
                                        right 0px
                                        background url("~@img/template1/center/duihao.png") center no-repeat

                                    &.not
                                        cursor not-allowed

                                .show-icon
                                    background url("~@img/comimages/center/deposit/feather01.png") center / contain no-repeat
                                    width 36px
                                    height 18px
                                    position absolute
                                    top 0px
                                    right 0px

                                .icon
                                    position absolute
                                    width 36px
                                    height 36px
                                    top 18px
                                    left 8px

                                    &.wechat, &.weChat
                                        background url("~@img/template1/center/wechat.svg") center / contain no-repeat

                                    &.alipay, &.alipay_h5
                                        background url("~@img/template1/center/zfb.svg") center / contain no-repeat

                                    &.bank_card
                                        background url("~@img/template1/center/card.svg") center / contain no-repeat

                                    &.cloud_flash
                                        background url("~@img/template1/center/quick.svg") center / contain no-repeat

                                    &.ebank_card
                                        background url("~@img/template1/center/deposit/ebankcard.svg") center / contain no-repeat

                                    &.wechat_card
                                        background url("~@img/template1/center/deposit/wechatcard.svg") center / contain no-repeat

                                    &.alipay_card
                                        background url("~@img/template1/center/deposit/alipaycard.svg") center / contain no-repeat

                                    &.usdt_pay
                                        background url("~@img/template1/center/deposit/virtual.svg") center / contain no-repeat

                                    &.cloud_flash
                                        background url("~@img/template1/center/deposit/cloudpay.png") center / contain no-repeat

                                    &.ebank
                                        background url("~@img/template1/center/deposit/ebank.svg") center / contain no-repeat

                                .name
                                    font-size: 12px;
                                    font_color(fc05);
                                    position: absolute;
                                    top 36px
                                    left 47px
                                    &.middle
                                      top 24px
                                .quote-name
                                    font-size: 12px;
                                    font_color(fc05);
                                    position: absolute;
                                    top 16px
                                    left 47px

                                .fether
                                    position: absolute;
                                    padding 0 4px
                                    height: 20px;
                                    line-height 20px
                                    text-align center
                                    top: -2px;
                                    right: -3px;
                                    border-top-right-radius: 6px;
                                    border-bottom-left-radius: 14px;
                                    background-color #f56c6c
                                    color #ffffff
                                    font-size 12px
                                    transform scale(.85)

                            .pl0
                                padding-left 0px

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
                                border_all(1px, solid, border18)
                                margin 4px
                                position relative
                                cursor pointer
                                font_color(fc05);

                                &.active
                                    bg_color(bg05);

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
                                position relative

                                &.active
                                    bg_img_linear(linear04, linear03)
                                    &:after
                                        content ''
                                        display block
                                        width 24px
                                        height 24px
                                        position absolute
                                        bottom 0px
                                        right 0px
                                        background url("~@img/template1/center/duihao.png") center / contain no-repeat

                    .discount-con
                        width: 500px;
                        height: 68px;
                        //background-color: #434554;
                        border-radius: 5px;
                        border: solid 1px #edf0fa;
                        margin-bottom 30px
                        line-height 68px
                        position relative
                        font-size: 16px;
                        padding-right 10px

                        .txt-obj
                            font-size: 16px;
                            color: #cccccc;
                            padding-left 20px
                            cursor pointer
                            flexcon()
                            display flex
                            flex-direction row
                            justify-content center
                            align-items center

                            .right-icon, .down-icon
                                flex none

                                svg
                                    color #6a7180
                                    font-size 18px

                            .title
                                color #6a7180
                                flex 1
                                padding-left 10px

                        .discount-list
                            border: 1px solid #edf0fa;
                            z-index 2
                            position absolute
                            background-color #fff
                            width 100%
                            border-radius 5px
                            display none
                            transition ease-in-out .3s

                            &.show
                                display block

                            ul
                                list-style none
                                padding 0
                                margin 0
                                max-height 200px
                                overflow auto

                                li
                                    color #6a7180
                                    height 50px
                                    line-height 50px
                                    cursor pointer
                                    padding-left 20px

                                    &.active
                                        position relative
                                        background-color #fafafa
                                        color #2d2d2d

                                        &:after
                                            after()
                                            display block
                                            background url("~@img/template1/center/right.svg") center / contain no-repeat
                                            width 18px
                                            height 18px
                                            right 10px
                                            top 50%
                                            transform translateY(-50%)

                                    &.active-hui
                                        position relative
                                        background-color #fafafa
                                        color #c6c6cc

                                        &:after
                                            after()
                                            display block
                                            background url("~@img/template1/center/hui.svg") center / contain no-repeat
                                            width 18px
                                            height 18px
                                            right 10px
                                            top 50%
                                            transform translateY(-50%)

                    &.usdt-tip
                        margin-bottom 10px

                        .top
                            flexcon()
                            margin-top: -12px;
                            font_color(fc05);
                            font-size 14px

                            p
                                flex 1

                                &:last-child
                                    text-align right

                                .yellow
                                    font_color(fc047)
                                    padding 0 4px

                        .down
                            margin-top 5px
                            font-size 14px
                            font_color(fc05);

                            p
                                span
                                    padding-right 10px

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

            .btns-con
                position relative

                .usdt-jump
                    cursor pointer
                    position absolute
                    top 50%
                    transform translateY(-50%)
                    right -30px
                    font_color(fc047)
                    font-size 14px

    .step-con
        width 100%
        padding 20px

        .nav-title
            font-weight 500
            font-size 16px
            font_color(fc017)
            cursor: pointer
            margin-bottom 20px

        .deposit-con, .virtual-con
            .yellow
                font_color(fc034)

            .title, .titleh
                font-size: 16px;
                line-height: 25px;
                font_color(fc017)
                margin-bottom 10px

            .detail-con
                height: 770px;
                border-radius: 10px;
                margin 20px auto
                padding 10px
                flexcon()
                align-items flex-start
                //&.ddb
                //    height 660px
                .left
                    flex 1
                    height 100%
                    padding-right 10px
                    font-size 12px
                    position relative

                    .size01
                        font-size 13px
                        margin-top 10px

                    .size02
                        margin-top 260px

                    .weight
                        font-weight 600

                    .tit-item
                        margin-left 20px
                        margin-top 6px
                        font-size 13px

                    .top
                        color #999
                        font-size 14px
                        text-align center

                        .top-title
                            margin-top 20px

                        .top-money
                            font-size 30px
                            margin 10px 0 4px
                            color #6a7180

                        .top-time
                            margin-top 15px
                            font-size 16px

                            .blue
                                color #0d66ff
                        .top-service
                            margin-top 10px
                            font-size 12px
                            color #60656c
                            cursor pointer
                            .blue
                                color #0d66ff

                    .middle
                        margin-top 25px
                    .com-line
                        margin 10px auto
                        height 1px
                        background-color #eaeaea

                    .down
                        .btn-chat
                            font-size 16px
                            color: #e6a23c;
                            background: #fdf6ec;
                            height 45px
                            line-height 45px
                            text-align center
                            margin 30px auto
                            width 280px
                            border-radius 10px
                            cursor pointer

                            &.success
                                color: #409eff;
                                background: #ecf5ff;
                                border-color: #b3d8ff;

                        .qrcode-con
                            text-align center
                            .qrcode-flow
                                .tips
                                    margin-top -20px
                                    margin-bottom 20px
                    .btn-con
                        position absolute
                        bottom 10px
                        left 50%
                        transform translateX(-50%)
                        width 100%

                        &.chat
                            flexcon()
                            justify-content space-between

                            .common-btn
                                flex 1
                                margin-right 10px

                        .hidden
                            border none

                    .item
                        display flex
                        flex-direction row
                        justify-content flex-end
                        align-items center
                        flex-wrap nowrap
                        height 36px
                        font-size: 14px;
                        line-height: 24px;
                        letter-spacing: 0px;
                        font_color(fc03)
                        width 100%

                        .lable
                            flex none

                        .text
                            flex 1
                            flexcon()
                            justify-content: flex-end;

                            .copy-btn
                                background url("~@img/comimages/center/deposit/copy.png") center no-repeat
                                width 19px
                                height 19px
                                margin-left 10px
                                cursor pointer
                            .blueRefresh
                                color: #409eff;
                                cursor pointer
                                margin-left 10px

                        &.orange
                            .text
                                color #ebb427

                        &.address
                            .text
                                justify-content center

                        &.qrcode-con
                            border 1px solid skyblue
                        &.tipItem
                            height 14px

                .right
                    border 1px solid #eaeaea
                    border-radius 5px
                    flex 1
                    height 600px
                    position relative

                    .open-con
                        .icon-servie
                            background url("~@img/comimages/center/deposit/service.png") center no-repeat
                            width 86px
                            height 86px
                            margin 30px auto 20px

                        .text
                            font-size 14px
                            color #6a7180
                            text-align center
                            margin-bottom 10px

                        .btn
                            font-size 16px
                            height 45px
                            line-height 45px
                            text-align center
                            margin 30px auto
                            width 280px
                            border-radius 10px
                            cursor pointer
                            color: #409eff;
                            background: #ecf5ff;
                            border-color: #b3d8ff;
                            position absolute
                            bottom 0px
                            left 50%
                            transform translateX(-50%)

                    .ifram-con
                        position: absolute;
                        top: 0px
                        left: 0;
                        right: 0;
                        bottom: 0px
                        overflow-y auto
                        -webkit-overflow-scrolling: touch
                        z-index 1

                        iframe
                            width 100%
                            height 100%
                            border: 0;
                            padding-bottom: 0;
                            vertical-align: bottom;
            .btn-con,.jumpt-con
                display flex
                flex-direction row
                justify-content center
                align-items center

                .btn
                    flex none
                    width 240px
                    height 45px
                    text-align center
                    line-height 45px
                    color #dba057
                    border 1px solid #dba057
                    border-radius 24px
                    margin-right 30px
                    cursor pointer
                    &:last-child
                        color cornflowerblue
                        border 1px solid cornflowerblue
            .down-con
                margin-top 30px
                .title
                    position relative

                    &:before
                        before()
                        width 66px
                        height 1px
                        bg_color(bg60)
                        top 24px
                        left 0px

                ul
                    list-style none
                    padding 0
                    margin 0
                    flexcon()
                    flex-direction column

                    li
                        flex 1
                        height 36px
                        font-size: 14px;
                        line-height: 24px;
                        letter-spacing: 0px;
                        font_color(fc091)
                        width 100%


        .time-con
            font-size: 14px;
            font_color(fc05);
            text-align center
            margin-top 30px

            &.red
                color #ff5353

        .traver-time-com
            width: 240px;
            margin 10px auto
            margin-top 60px

            .outer
                width: 240px;
                height: 240px;
                background url("~@img/template1/center/deposit/time.png") center / contain no-repeat
                display flex
                flex-direction row
                justify-content center
                align-items center

                .inner
                    flex none
                    width: 180px;
                    height: 180px;
                    border-radius 50%
                    display flex
                    flex-direction row
                    align-items center
                    justify-content center
                    font-size: 42px;
                    font_color(fc012)

        .tip-con
            width: 900px;
            height: 180px;
            bg_color(bg23)
            border-radius: 10px;
            padding 20px
            margin-top 60px

            .item-title
                font-size: 18px;
                line-height: 44px;
                font_color(fc017)
                position relative

                &:after
                    content ''
                    display block
                    width: 74px;
                    height: 2px;
                    bg_color(bg24)
                    border-radius: 1px;
                    position absolute
                    bottom 0px
                    left 0px

            .item
                font-size: 18px;
                line-height: 44px;
                font_color(fc035)


/deep/ .qr-page
    font-size: 14px;
    font_color(fc091)

    .item
        height 36px
        line-height 36px

        .yellow
            font_color(bg60)
            margin-left 20px

/deep/ .qrcode.virtual2
    width: 240px;
    height: 240px;

.valet-dialog
    /deep/ .dialog-content
        height 220px
        min-height 220px

        .valet-tip-con
            .msg2
                font-size 14px
                text-align center
                margin-top 20px
                transition none
                transform none

            .btn-con
                flexcon()
                justify-content space-evenly
                margin-top 40px

                .btn
                    flex none
                    width 120px
                    text-align center
                    background-color #dba057
                    color #eaeaea

.cs-link
    //display flex
    //justify-content center
    //flex-direction column
    text-align center

    > img
        margin-bottom 20px

.dialog-con
    .apply-con
        .title
            text-align center
            font-size 16px
            font_color(fc3)
            margin-top 60px

        .btn-con
            margin-top 80px
            display flex
            flex-direction row

            .common-btn
                height 48px
                line-height 48px
                width 200px

.aitip-dialog
    .dialog-con
        font-size 14px
        line-height 24px
        color #666666

        .title
            text-align center

        .title2
            text-align center
            margin-top 45px
            font-size 16px
            font-weight 500

        .money
            text-align center
            color #fa5151
            font-size 24px
            margin 20px auto
            font-weight 600

        .msg-con
            text-align center

            .service
                color cornflowerblue
                cursor pointer

        .btn-con
            position absolute
            bottom 30px
            left 50%
            transform translateX(-50%)

.service-dialog
    /deep/ .dialog-content
        .ifram-con
            font-family: initial;

        .dialog-main
            padding 0 !important

        .dialog-header
            height auto !important

.com-tab
    width 100%
    //height: 80px;
    overflow auto;
    line-height 70px
    font-size: 18px;
    letter-spacing: 0px;
    font_color(fc06);
    bg_color(bg04);
    border-radius: 10px 10px 0px 0px;
    border_com(1px, solid, border08, bottom)
    position relative
    transition all .3s

    ul
        resetul()
        display flex
        flex-wrap wrap
        justify-content flex-start

        li
            width 250px
            //flex none
            display flex
            align-items center
            text-align left
            position relative
            cursor pointer
            //flexcon()
            padding-left 24px
            &:hover
                font_color(fc015)

            &.active
                font_color(fc015)
            .show-icon
                background url("~@img/comimages/center/deposit/feather01.png") center / contain no-repeat
                //width 36px
                height 18px
                padding 0 4px
                position absolute
                top 0px
                right 0px
            //&:not(:last-child)
            //    &:after
            //        content ''
            //        display block
            //        width 1px
            //        height 30px
            //        bg_color(bg11)
            //        position: absolute;
            //        border-radius: 2px;
            //        top 50%
            //        transform translateY(-50%)
            //        right -10px

            .type-icon
                display: inline-block;
                width 36px
                height 36px
                background-position center
                background-size contain
                background-repeat no-repeat
                margin-right 4px
                border-radius 4px
            .quote-name
                color red
                position: absolute;
                left: 66px;
                bottom: 10px;
                font-size: 12px;
                line-height 1
            .fether
                position: absolute;
                right: 0px;
                top: 4px;
                display inline-block
                height 16px
                line-height 16px
                font-size: 12px;
                padding 0 6px
                color #ffffff
                background-color red
                border-radius 8px
.pay-list
    margin-bottom 10px
    padding 10px

    ul
        resetul()
        display flex
        flex-direction row
        flex-wrap wrap
        justify-content space-between
        align-items center

        li
            flex none
            width: 30%;
            height: 68px;
            text-align center
            border-radius: 10px;
            border_all(1px, solid, border18)
            padding-left 30px
            margin-bottom 6px
            position relative
            cursor pointer

            &.empty
                height 0px
                border none
                background none
                box-shadow none

            &:last-child
                margin-right auto

            &.active
                bg_color(bg05);

                &:after
                    content ''
                    display block
                    width 32px
                    height 32px
                    position absolute
                    bottom 0px
                    right 0px
                    background url("~@img/template1/center/duihao.png") center no-repeat

                &.not
                    cursor not-allowed

            .show-icon
                background url("~@img/comimages/center/deposit/feather01.png") center / contain no-repeat
                width 36px
                height 18px
                position absolute
                top 0px
                right 0px

            .icon
                position absolute
                width 36px
                height 36px
                top 18px
                left 8px

                &.wechat, &.weChat
                    background url("~@img/template1/center/wechat.svg") center / contain no-repeat

                &.alipay, &.alipay_h5
                    background url("~@img/template1/center/zfb.svg") center / contain no-repeat

                &.bank_card
                    background url("~@img/template1/center/card.svg") center / contain no-repeat

                &.cloud_flash
                    background url("~@img/template1/center/quick.svg") center / contain no-repeat

                &.ebank_card
                    background url("~@img/template1/center/deposit/ebankcard.svg") center / contain no-repeat

                &.wechat_card
                    background url("~@img/template1/center/deposit/wechatcard.svg") center / contain no-repeat

                &.alipay_card
                    background url("~@img/template1/center/deposit/alipaycard.svg") center / contain no-repeat

                &.usdt_pay
                    background url("~@img/template1/center/deposit/virtual.svg") center / contain no-repeat

                &.cloud_flash
                    background url("~@img/template1/center/deposit/cloudpay.png") center / contain no-repeat

                &.ebank
                    background url("~@img/template1/center/deposit/ebank.svg") center / contain no-repeat

            .name
                font-size: 18px;
                font_color(fc05);
                position: absolute;
                top 16px
                left 47px
                &.middle
                    top 24px
            .quote-name
                font-size: 12px;
                //font_color(fc05);
                color red
                position: absolute;
                bottom 12px
                left 47px

            .fether
                position: absolute;
                padding 0 4px
                height: 20px;
                line-height 20px
                text-align center
                top: -2px;
                right: -3px;
                border-top-right-radius: 6px;
                border-bottom-left-radius: 14px;
                background-color #f56c6c
                color #ffffff
                font-size 12px
                transform scale(.85)

        .pl0
            padding-left 0px

.titleConfirm
    font-size 16px
    margin-bottom 15px
    display flex
    .titleConfirmItem
        margin-right 30px
    .name
        font-size 18px
        color #bd9a5c

.tipBox
    .tipTitle
        position relative
        font-size 12px
        width 50px
        margin-bottom 15px
    .tipTitle::after
        content: '';
        display: block;
        width: 100%;
        height: 2px;
        background-color: #bd9a5c;
        bottom: -4px;
        left: 0;
        //transform: translateX(-50%);
        position: absolute;
        border-radius: 4px;
    .redTip
        font-size 12px
        line-height 19px
        color red
.common-btn-box
    display flex
    margin-top 30px
    .common-btn
        width 200px
        &:nth-child(2)
            margin-left 30px
.redTip
    font-size: 12px;
    color: red;
//.deposit-before
.blueBgBtn
    background-image none
    background-color #409eff
    color #ffffff
    line-height 44px
    margin-top 30px
.whiteBgBtn
    margin-top 10px
    line-height 44px
    background-image none
    background-color #ecf5ff
    border-color #409eff
    color #409eff
.bs
    margin-top 30px
.detail-title
    padding 10px 0 20px
    font-size 18px
    color #ebb427
    text-align center
    border-bottom 1px solid #eaeaea
.detail-box
    margin-top 10px
    display flex
    flex-wrap wrap
    //justify-content space-between
    .detail-item
        width 50%
        display flex
        align-items center
        justify-content flex-start
        margin-top 10px
        //flex 1
        font-size 12px
        .detail-label
            width 60px
            text-align right
        .detail-status
            color #ebb427

.message-box
    position: absolute;
    top: 0px;
    left: 0px;
.message {
    position: relative;
    width: 36px;
    height: 18px;
    display inline-block
    background-color: red;
    border-bottom-color: red;
    /*为了给after伪元素自动继承*/
    color: #fff;
    font-size: 12px;
    line-height: 18px;
    box-sizing: border-box;
    border-radius: 9px;
    word-break: break-all;
}
.message::after {
    content: '';
    position: absolute;
    top: 11px;
    left: 8px;
    width: 6px;
    height: 6px;
    border-width: 0px 0px 5px 0px;
    border-style: solid;
    border-bottom-color: inherit;
    border-left-color: transparent;
    border-radius: 0px 0px 5px 0px;
    transform: rotateY(180deg);
}
.common-width
    ::v-deep .dialog-content
        width 700px
.tip-currt
    font-size 14px
    font-weight 400
    margin-bottom 10px
    line-height 24px
</style>
