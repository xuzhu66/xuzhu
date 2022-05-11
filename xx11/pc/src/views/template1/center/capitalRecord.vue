<template lang="pug">
    .capitalRecord
        assets
        .com-tab
            ul
                li  交易记录
        .search-con
            .item
                .name 类型:
                // 查询订单类型 1 存款 ，2提现，3转账，4 加扣款，5活动，6 洗码返水，7代理返佣，9 洗码代理推广返佣, 10 购买会员 11VIP礼金 12营销活动 13无限佣金 14 佣金自转 15 佣金代存 16 额度代存
                // userInfo.type    1: 普通玩家: 2: 洗码代理 3: 合营代理 4: 无限代理
                ul
                    // 一直展示
                    li(@click="selectType(1)",:class="currtTable==1?'active':''") 存款
                    li(@click="selectType(2)",:class="currtTable==2?'active':''") 取款
                    li(@click="selectType(3)",:class="currtTable==3?'active':''") 转账
                    li(@click="selectType(4)",:class="currtTable==4?'active':''") 加扣款
                    li(@click="selectType(5)",:class="currtTable==5?'active':''") 优惠活动
                    li(@click="selectType(6)",:class="currtTable==6?'active':''") 洗码返水
                    // 2: 洗码代理展示
                    li(@click="selectType(7)",:class="currtTable==7?'active':''",v-if="userInfo.type == 2") 洗码佣金
                    li(@click="selectType(9)",:class="currtTable==9?'active':''",v-if="userInfo.type == 2") 推广返佣
                    // 一直展示
                    li(@click="selectType(11)",:class="currtTable==11?'active':''") VIP礼金
                    li(@click="selectType(12)",:class="currtTable==12?'active':''") 营销活动
                    // 4: 无限代理
                    li(@click="selectType(13)",:class="currtTable==13?'active':''",v-if="userInfo.type == 4") 无限佣金
                    // 3: 合营代理 -- 一直展示
                    li(@click="selectType(14)",:class="currtTable==14?'active':''") 佣金自转
                    li(@click="selectType(15)",:class="currtTable==15?'active':''") 佣金代存
                    li(@click="selectType(16)",:class="currtTable==16?'active':''") 额度代存

            .item
                .name 时间:
                comDatepicker(@putTimeEvent="getTimeEvent")
                //.search-item.ok(@click="searchList")
                    span 确定
            // 存款
            .item(v-if="currtTable == 1")
                .name 状态:
                ul
                    li(@click="selectOrderStatus('')",:class="orderStatus==''?'active':''") 全部
                    li(v-for="(value, name)  in depositOrderStatus",@click="selectOrderStatus(name)",:class="orderStatus==name?'active':''") {{value}}
            // 取款
            .item(v-if="currtTable == 2")
                .name 状态:
                ul
                    li(@click="selectOrderStatus('')",:class="orderStatus==''?'active':''") 全部
                    li(v-for="(value, name)  in drawOrderStatusSearch",@click="selectOrderStatus(name)",:class="orderStatus==name?'active':''") {{value}}
            // 转账
            .item(v-if="currtTable == 3")
                .name 状态:
                ul
                    li(@click="selectOrderStatus('')",:class="orderStatus==''?'active':''") 全部
                    li(v-for="(value, name)  in transferOrderStatus",@click="selectOrderStatus(name)",:class="orderStatus==name?'active':''") {{value}}
            // 优惠活动
            .item(v-if="currtTable == 5")
                .name 状态:
                ul
                    li(@click="selectOrderStatus('')",:class="orderStatus==''?'active':''") 全部
                    li(v-for="(value, name)  in activityStatus",@click="selectOrderStatus(name)",:class="orderStatus==name?'active':''") {{value}}
            // vip礼金
            .item(v-if="currtTable == 11")
                .name 状态:
                ul
                    li(@click="selectOrderStatus('')",:class="orderStatus==''?'active':''") 全部
                    li(v-for="(value, name)  in vipStatus",@click="selectOrderStatus(name)",:class="orderStatus==name?'active':''") {{value}}


        // 存款
        .table-con.deposit(v-if="currtTable == 1")
            ul
                li.title
                    span 创建时间
                    span 存款金额
                    span 存款方式
                    span 订单编号
                    span 订单状态
                li.con(v-for="item in tableList")
                    span {{item.createTime}}
                    span {{item.amount | format}}
                    span {{item.payTypeName}}
                    span {{item.orderId}}
                    span.orderStatus(v-if="item.status == 1",class="statusMiddle")
                        span 处理中
                        span.ca-so(@click="openDetail(item)",v-if="isBnakType(item)",class="orderDetail") 订单详情
                        //span.ca-cancel(v-if="isBnakType(item)",@click="cancelOrder(item)") 取消
                    span(v-else,:class='"status"+item.status') {{depositOrderStatus[item.status]}}

        // 取款
        .table-con.draw(v-if="currtTable == 2")
            ul
                li.title
                    span 订单创建时间
                    span 订单金额
                    span 手续费
                    span 实际到账金额
                    span 平台订单编号
                    span 订单状态
                li.con.draw-con(v-for="item in tableList",@click="openDrawDialog(item)")
                    span {{item.createTime}}
                    span {{item.amount | format}}
                    span {{item.feeAmount | format}}
                    span {{item.actAmount | format}}
                    span {{item.orderId}}
                    span.orderStatus(:class='"status"+item.status')  {{item.statusName}}

        // 转账
        .table-con.transfer(v-if="currtTable == 3")
            ul
                li.title
                    span 创建时间
                    span 转账金额
                    span 转出线路
                    span 转入线路
                    span 订单编号
                    span 订单状态
                li.con(v-for="item in tableList")
                    span {{item.createTime}}
                    span {{item.amount | format}}
                    span {{item.fromPlat}}
                    span {{item.toPlat}}
                    span {{item.orderId}}
                    span.orderStatus(:class='"status"+item.status') {{item.statusName}}
        // 加扣款
        .table-con(v-if="currtTable == 4")
            ul
                li.title
                    span 创建时间
                    span 操作类型
                    span 加扣款金额
                    span 订单编号
                    span 备注
                li.con.flow-con(v-for="item in tableList")
                    span {{item.createTime}}
                    span {{item.typeName}}
                    span {{item.amount | format}}
                    span {{item.orderId}}
                    span.long-con {{item.remark}}
                    .long {{item.remark}}

        // 优惠活动
        .table-con.activity(v-if="currtTable == 5")
            ul
                li.title
                    span 创建时间
                    span 活动名称
                    span 奖励金额
                    span 订单状态
                    span 订单编号
                li.con(v-for="item in tableList")
                    span {{item.createTime}}
                    span.name(@click="openActivityDetail(item)") {{item.activityName}}
                    span {{item.amount | format}}
                    span.orderStatus(:class='"status"+item.status') {{activityStatus[item.status]}}
                    span {{item.orderId}}
                //li.con(v-for="item in activityList")
                    span {{item.createTime}}
                    span.name(@click="openActivityDetail(item)") {{item.activityName}}
                    span {{item.amount}}
                    span {{item.orderId}}

        // 洗码返水
        .table-con(v-if="currtTable == 6")
            ul
                li.title
                    span 订单编号
                    span 返水业务日期
                    span 返水金额
                    span 返水操作人
                    span 返水操作时间
                li.con(v-for="item in tableList")
                    span {{item.orderId}}
                    span {{item.startTime}}
                    span {{item.amount | format}}
                    span {{item.createBy}}
                    span {{item.createTime}}
        // 洗码佣金
        .table-con(v-if="currtTable == 7")
            ul
                li.title
                    span 订单编号
                    span 返佣业务日期
                    span 返佣金额
                    span 返佣操作人
                    span 返佣操作时间
                li.con(v-for="item in tableList")
                    span {{item.orderId}}
                    span {{item.startTime}}
                    span {{item.amount | format}}
                    span {{item.createBy}}
                    span {{item.createTime}}

        // 推广返佣
        .table-con(v-if="currtTable == 9")
            ul
                li.title
                    span 平台订单编号
                    span 返佣金额
                    span 返佣下线
                    span 返佣操作时间
                li.con(v-for="item in tableList")
                    span {{item.orderId}}
                    span {{item.amount | format}}
                    span {{item.childPlayerName}}
                    span {{item.createTime}}

        // vip礼金
        .table-con.vip-amount(v-if="currtTable == 11")
            ul
                li.title
                    span 操作时间
                    span 领取金额
                    span 礼金类型
                    span 类型名称
                    span 订单编号
                    span 订单状态
                li.con(v-for="item in tableList")
                    span {{item.modifyTime}}
                    span {{item.amount | format}}
                    span {{item.typeName}}
                    span {{item.operateRemark}}
                    span {{item.id}}
                    //span.orderStatus {{item.statusName}}
                    span.orderStatus(:class='"status"+item.status') {{vipStatus[item.status]}}

        // 营销活动
        .table-con.vip-amount(v-if="currtTable == 12")
            ul
                li.title
                    span 订单编号
                    span 领取金额
                    span 营销类型
                    span 营销活动名称
                    span 订单状态
                    span 操作时间
                li.con(v-for="item in tableList")
                    span {{item.id}}
                    span {{item.amount | format}}
                    span {{item.typeName}}
                    span {{item.promoteActivityName}}
                    span.orderStatus(:class='"status"+item.status') {{yingxiaoStatus[item.status]}}
                    span {{item.modifyTime}}


        // 无限佣金
        .table-con.vip-amount(v-if="currtTable == 13")
            ul
                li.title
                    span 平台订单编号
                    span 返佣业务日期
                    span 返佣金额
                    span 订单状态
                    span 返佣操作时间
                li.con(v-for="item in tableList")
                    span {{item.id}}
                    span {{item.bizDate}}
                    span {{item.amount | format}}
                    //span.orderStatus(:class='"status"+item.status') {{wuxianStatus[item.status]}}
                    span {{item.statusName}}
                    span {{item.modifyTime}}

        // 佣金自转
        .table-con.vip-amount(v-if="currtTable == 14")
            ul
                li.title
                    span 平台订单编号
                    span 金额
                    span 订单状态
                    span 订单创建时间
                li.con(v-for="item in tableList")
                    span {{item.id}}
                    span {{item.amount | format}}
                    //span.orderStatus(:class='"status"+item.status') {{yongjinzizhuanStatus[item.status]}}
                    span {{item.statusName}}
                    span {{item.createTime}}

        // 佣金代存
        .table-con.vip-amount(v-if="currtTable == 15")
            ul
                li.title
                    span 平台订单编号
                    span 金额
                    span 订单状态
                    span 上级代理ID
                    span 订单创建时间
                    span 代存备注
                li.con.flow-con(v-for="item in tableList")
                    span {{item.id}}
                    span {{item.amount | format}}
                    //span.orderStatus(:class='"status"+item.status') {{yongjindaicunStatus[item.status]}}
                    span {{item.statusName}}
                    span {{item.otherPlayerId}}
                    span {{item.createTime}}
                    span.long-con {{item.remark}}
                    .long {{item.remark}}
                //li.flow-con
                    span wr42324234
                    span 234234234
                    span 234234
                    span 234234
                    span 234234
                    span.long-con test23424234242424234222222222222222222222222222342342xdfsf2423sfs234
                    .long   asf asdf adf asdf asdf asdf asdf adf asf asdf adf asdf asdf asdf asf asdf adf asdf asdf asdf asdf adf asf asdf adf asdf asdf asdfasf asdf adf asdf asdf asdf asdf adf asf asdf adf asdf asdf asdfasf asdf adf asdf asdf asdf asdf adf asf asdf adf asdf asdf asdf

        // 额度代存
        .table-con.vip-amount(v-if="currtTable == 16")
            ul
                li.title
                    span 平台订单编号
                    span 金额
                    span 订单状态
                    span 上级代理ID
                    span 订单创建时间
                    span 代存备注
                li.con.flow-con(v-for="item in tableList")
                    span {{item.id}}
                    span {{item.amount | format}}
                    //span.orderStatus(:class='"status"+item.status') {{edudaicunStatus[item.status]}}
                    span {{item.statusName}}
                    span {{item.otherPlayerId}}
                    span {{item.createTime}}
                    span.long-con {{item.remark}}
                    .long {{item.remark}}

                //li.flow-con
                    span wr42324234
                    span 234234234
                    span 234234
                    span 234234
                    span 234234
                    span.long-con test23424234242424234222222222222222222222222222342342xdfsf2423sfs234
                    .long   asf asdf adf asdf asdf asdf asdf adf asf asdf adf asdf asdf asdf asf asdf adf asdf asdf asdf asdf adf asf asdf adf asdf asdf asdfasf asdf adf asdf asdf asdf asdf adf asf asdf adf asdf asdf asdfasf asdf adf asdf asdf asdf asdf adf asf asdf adf asdf asdf asdf


        // 统计金额
        .tongji-con(v-if="tableList.length>0")
            .tongji-flow
                .left
                // 取款
                template(v-if="currtTable == 2")
                    .right
                        .title 订单金额(元):
                        .money
                            span ¥
                            span {{transferObj.sumAmount | format}}
                    .right
                        .title 手续费(元):
                        .money
                            span ¥
                            span {{transferObj.feeAmount | format}}
                    .right
                        .title 实际到账金额(元):
                        .money
                            span ¥
                            span {{transferObj.actAmount | format}}
                template(v-else)
                    .right
                        .title {{typeList[currtTable]}}金额(元):
                        .money
                            span ¥
                            span {{transferMoney | format}}


        // 分页
        .page-list(v-if="tableList.length>0")
            comPagination(:total="tableListData.total",@change="getPageEnv")
        .nodata(v-if="tableList.length == 0")

        comDialog(:show-footer='false',:show="showDialog",@on-cancel="closeDialog")
            div(slot="header") 银行卡存款
            div.dialog-con(slot="default")
                .deposit-con
                    .top
                        .top-title 向商家付款
                        .top-money ¥ {{bankTransferDetail.amount | format}}
                        .top-time
                            span 付款剩余时间
                            span.blue 00:00

                    .middle
                        .item
                            .lable 订单编号:
                            .text.galery
                                span {{bankTransferDetail.orderId ? bankTransferDetail.orderId :'--'}}
                                span.copy-btn.vd-copy0(:data-clipboard-text="currtItem.orderId" @click="copySub('vd-copy0')")

                        .item
                            .lable 创建时间:
                            .text
                                span {{bankTransferDetail.createTime ? bankTransferDetail.createTime : '--'}}
                        .item
                            .lable 订单状态:
                            .text.galery
                                span {{getBankStatus(bankTransferDetail.status)}}

                    .com-line

                    .down.success
                        .item
                            .lable 收款人姓名:
                            .text.galery
                                span {{bankTransferDetail.receivedName}}
                                span.copy-btn.vd-copy1(:data-clipboard-text="bankTransferDetail.receivedName" @click="copySub('vd-copy1')")
                        .item
                            .lable 收款人账户:
                            .text.galery
                                span {{bankTransferDetail.receivedBankCard}}
                                span.copy-btn.vd-copy2(:data-clipboard-text="bankTransferDetail.receivedBankCard" @click="copySub('vd-copy2')")
                        .item
                            .lable 银行名称:
                            .text.galery
                                span {{bankTransferDetail.receivedBankName}}
                                span.copy-btn.vd-copy3(:data-clipboard-text="bankTransferDetail.receivedBankName" @click="copySub('vd-copy3')")
                        .item
                            .lable 银行分行:
                            .text.galery
                                span {{bankTransferDetail.receivedSubBankName}}
                                span.copy-btn.vd-copy4(:data-clipboard-text="bankTransferDetail.receivedSubBankName" @click="copySub('vd-copy4')")


        comDialog(:show-footer='false',:show="showVertureDialog",@on-cancel="closeDialog")
            div(slot="header") 虚拟币充值
            div.dialog-con(slot="default")
                .virtual-con
                    .top
                        .top-title 向商家付款
                        .top-money {{virtualDetail.virOrderAmt}} USDT
                        .top-time
                            span 付款剩余时间
                            span.blue  00:00
                        .top-msg
                            span 本次付款
                            span.galery ≈{{virtualDetail.orderAmt | format}}
                            span 元, 参考汇率
                            span.galery 1{{virtualDetail.virCurrency}} ≈ {{virtualDetail.unitPrice}}
                            span 元
                    .middle
                        .item
                            .lable 订单编号:
                            .text
                                span {{currtItem.orderId ? currtItem.orderId :'--'}}
                                span.copy-btn.vd-copy0(:data-clipboard-text="currtItem.orderId" @click="copySub('vd-copy0')")

                        .item
                            .lable 创建时间:
                            .text
                                span {{virtualDetail.createTime ? virtualDetail.createTime : '--'}}
                        .item
                            .lable 订单状态:
                            .text.galery
                                span {{getBankStatus(virtualDetail.status)}}

                    .com-line

                    .down.success
                        .item
                            .lable 需存入:
                            .text.galery
                                span {{virtualDetail.virOrderAmt}} USDT
                                span.copy-btn.vd-copy007(:data-clipboard-text="virtualDetail.virOrderAmt" @click="copySub('vd-copy007')")
                        .item
                            .lable 链协议:
                            .text.galery
                                span {{virtualDetail.protocol}}
                                span.copy-btn.vd-copy009(:data-clipboard-text="virtualDetail.protocol" @click="copySub('vd-copy009')")
                        .item
                            .lable 充币地址:
                            .text.galery
                                span
                                span.copy-btn.vd-copy008(:data-clipboard-text="virtualDetail.recAcctNo" @click="copySub('vd-copy008')")
                        .item.address
                            .lable
                            .text.galery
                                span {{virtualDetail.recAcctNo}}

                        .item
                            .lable 充币二维码:
                            .text

                        .qrcode-con
                            .qrcode-flow
                                qrcode(v-if="virtualDetail.recAcctNo", :codeurl="virtualDetail.recAcctNo",:clasz="'virtual1'")



        comDialog(:show-footer='false',:show="showErrorDialog",@on-cancel="closeDialog")
            div(slot="header") 失败原因
            div.dialog-con.errmsg-con(slot="default")
                .draw-con
                    .error-msg {{errorMsg}}

        comDialog(:show-footer='false',:show="showDrawDialog",@on-cancel="closeDrawDialog")
            div(slot="header") 取款详情
            div.dialog-con.draw-detail-con(slot="default")
                .draw-detail-flow
                    .title ￥{{drawDetail.amount}}
                    .item-con
                        // 银行卡
                        template(v-if="drawDetail.bankName")
                            .item
                                span 取款人姓名 :
                                span {{drawDetail.accountName}}
                            .item
                                span 开户银行:
                                span {{drawDetail.bankName}}
                            .item
                                span 银行卡号：
                                span {{drawDetail.accountNo}}
                            .item
                                span 开户省：
                                span {{drawDetail.bankProvince}}
                            .item
                                span 开户市：
                                span {{drawDetail.bankCity}}
                            .item
                                span 开户支行：
                                span {{drawDetail.bankAddress}}

                        // 虚拟币
                        template(v-if="drawDetail.virCurrency")
                            .item
                                span 虚拟币币种：
                                span {{drawDetail.virCurrency}}
                            .item
                                span 虚拟币账户：
                                span {{drawDetail.recAcctNo}}

                        // 通用
                        .item
                            //状态 1、审核中 2、处理中 3、成功 4、失败
                            span 订单状态：
                            span(:class="'status'+drawDetail.status") {{drawDetail.statusName}}
                        .item
                            span 手续费：
                            span {{drawDetail.feeAmount?drawDetail.feeAmount:'-'}}
                        .item
                            span 实际到账金额：
                            span {{drawDetail.actAmount}}
                        .item
                            span 订单创建时间：
                            span {{drawDetail.createTime}}
                        .item
                            span 订单编号：
                            span {{drawDetail.orderId}}
                            span.copy-btn.draw-01(:data-clipboard-text="drawDetail.orderId" @click="copySub('draw-01')")
                        .item(v-show="stateRem(drawDetail.statusName)")
                            span 备注：
                            span {{drawDetail.auditRemark}}
                        //.item
                            span 备注：
                            span 备注：备注：备注：备注：备注：备注：备注：备注：备注：备注：备注：备注：备注：备注：备注：备注：备注：备注：备注：备注：备注：备注：备注：备注：备注：备注：


</template>

<script>
import comPagination from "@pon/template1/comPagination"
import assetslist from "./assetsList";
import comDatepicker from "@pon/template1/comDatepicker"
import comDialog from "@pon/template1/comDialog"
import {formatAmount, formatDate,numHidf4l4} from '@m/utils'
import {mapGetters, mapState, mapMutations, mapActions} from 'vuex';
import thatStore from "@/store/comstore/center/business/capitalRecordStore"; // 获取模板
import depositStore from "@/store/comstore/assets/depositStore"; // 获取模板
import clipboard from "clipboard"
import store from '@/store/Store';
import qrcode from "@pon/template1/comQrcode"

export default {
    name: "capitalRecord",
    components: {
        comPagination,
        comDatepicker,
        comDialog,
        "assets": assetslist,
        qrcode,
    },
    data() {
        return {
            isReqFlag: true, // 请求是否结束
            showDialog: false,// 弹框显示
            currtTable: '1', // 当前类型 1： 存款 1.存款 2.取款 3.转账 4.加扣款 5.活动(彩金) 6.洗码返水 7.代理返佣
            currtTime: '1',// 1: 今天 357 15 30 进xx天
            //查询对象
            order: {
                startDate: '',
                endDate: '',
                page: 0,
                pageSize: 10,
                activityName: ""
            },
            //数据列表
            data: [],
            //总条数
            total: 100,
            //当前选中的行
            capitalInfo: "",

            startDate: '',
            endDate: '',
            dataType: '',// 时间标识
            current: 1,// 当前页
            size: 10, // 每页的数量
            // 存款订单状态
            depositOrderStatus: {
                "1": "处理中",
                "2": "成功",
                "3": "失败",
                "4": "已取消",
            },
            // 取款订单状态
            drawOrderStatus: {
                "1": "审批中",
                "2": "付款中",
                "3": "支付成功",
                "4": "取款失败",
            },
            // 取款订单状态--查询用
            drawOrderStatusSearch: {
                "1": "审批中",
                "2": "付款中",
                "3": "支付成功",
                "4": "取款失败",
            },
            // 洗码返水订单状态
            washOrderStatus: {
                "1": "已提交，待审核",
                "2": "已审核，已完成",
            },
            // 转账订单状态
            transferOrderStatus: {
                "1": "成功",
                "2": "失败",
            },
            // 加扣款款订单状态
            addOrderStatus: {
                "2": "成功",
            },
            // 存款类型code
            payTypeList: {
                "alipay": "支付宝-扫码支付",
                "weChat": "微信-扫码支付",
                "cloud_flash": "云闪付-扫码支付",
                "alipay_h5": "支付宝-H5支付",
                "weChat_h5": "微信-H5支付",
                "bank_card": "银行卡转账",
            },

            // vip礼金 状态
            vipStatus: {
                "1": "待领取",
                "2": "已领取",
                "3": "已失效",
            },
            // 优惠活动 状态
            activityStatus: {
                "1": "待领取",
                "2": "已领取",
            },
            yingxiaoStatus:{
                "1": "成功",
            },
            // 无限佣金 1，未结算2，已结算，待领取 3，已结算，已领取
            wuxianStatus:{
                "1": "未结算",
                "2":"未领取",
                "3":"已领取"
            },
            // 佣金自转 1，成功 2，失败
            yongjinzizhuanStatus:{
                "1": "进行中",
                "2":"成功",
                "3":"取消",
            },
            // 佣金代存 1，已提交，待审核 2，已审核，已完成 3，已驳回，已取消
            yongjindaicunStatus:{
                "1": "进行中",
                "2":"成功",
                "3":"取消",
            },
            // 额度代存  1，已提交，待审核 2，已审核，已完成 3，已驳回，已取消
            edudaicunStatus:{
                "1": "进行中",
                "2":"成功",
                "3":"取消",
            },
            orderInfo: {
                payAmount: "",
                payInfo: {}
            },// 存款信息
            depositList: [
                {
                    "orderId": "1276046916089495554",
                    "createTime": "2020-06-25 14:57:47",
                    "amount": "222",
                    "payTypeName": "支付宝-H5支付",
                    "payTypeCode": "",
                    "status": 4,
                    "statusName": "",
                    "bankTransferId": ""
                },
                {
                    "orderId": "1276046916089495554",
                    "createTime": "2020-06-25 14:57:47",
                    "amount": "100",
                    "payTypeName": "支付宝-H5支付",
                    "payTypeCode": "",
                    "status": 3,
                    "statusName": "",
                    "bankTransferId": ""
                },
                {
                    "orderId": "1275810121263300610",
                    "createTime": "2020-06-24 23:16:50",
                    "amount": "333",
                    "payTypeName": "支付宝-H5支付",
                    "payTypeCode": "",
                    "status": 2,
                    "statusName": "",
                    "bankTransferId": ""
                },
                {
                    "orderId": "1275810121263300610",
                    "createTime": "2020-06-24 23:16:50",
                    "amount": "3333",
                    "payTypeName": "支付宝-H5支付",
                    "payTypeCode": "bank_card",
                    "status": 1,
                    "statusName": "",
                    "bankTransferId": "2"
                }
            ],
            drawList: [
                {
                    "orderId": "1275810121263300610",
                    "createTime": "2020-06-24 23:16:50",
                    "amount": "3333",
                    "payTypeName": "支付宝-H5支付",
                    "payTypeCode": "bank_card",
                    "status": 1,
                    "statusName": "",
                    "bankTransferId": "2",
                    accountNo: "12345678901234567890",
                    bankName: "afasdfadsf",
                },
                {
                    "orderId": "1275810121263300610",
                    "createTime": "2020-06-24 23:16:50",
                    "amount": "3333",
                    "payTypeName": "支付宝-H5支付",
                    "payTypeCode": "bank_card",
                    "status": 2,
                    "statusName": "",
                    "bankTransferId": "2",
                    accountNo: "12345678901234567890",
                    bankName: "afasdfadsf",
                },
                {
                    "orderId": "1275810121263300610",
                    "createTime": "2020-06-24 23:16:50",
                    "amount": "3333",
                    "payTypeName": "支付宝-H5支付",
                    "payTypeCode": "bank_card",
                    "status": 3,
                    "statusName": "",
                    "bankTransferId": "2",
                    accountNo: "12345678901234567890",
                    bankName: "afasdfadsf",
                },
                {
                    "orderId": "1275810121263300610",
                    "createTime": "2020-06-24 23:16:50",
                    "amount": "3333",
                    "payTypeName": "支付宝-H5支付",
                    "payTypeCode": "bank_card",
                    "status": 4,
                    "statusName": "",
                    "bankTransferId": "2",
                    recAcctNo: "xxxxx222222222222222222222222xxxxxxxx",
                    bankName: "afasdfadsf",
                    auditRemark:"xxx",
                },
                {
                    "orderId": "1275810121263300610",
                    "createTime": "2020-06-24 23:16:50",
                    "amount": "3333",
                    "payTypeName": "支付宝-H5支付",
                    "payTypeCode": "bank_card",
                    "status": 4,
                    "statusName": "",
                    "bankTransferId": "2",
                    recAcctNo: "12345697",
                    bankName: "afasdfadsf",
                    auditRemark:"xxx",
                }
            ],
            transferList: [
                {
                    "orderId": "1275810121263300610",
                    "createTime": "2020-06-24 23:16:50",
                    "amount": "3333",
                    "payTypeName": "支付宝-H5支付",
                    "payTypeCode": "bank_card",
                    "status": 1,
                    "statusName": "成功",
                    "bankTransferId": "2",
                    accountNo: "xxxxxxxxxxxxx",
                    bankName: "afasdfadsf",
                    fromPlat: "xxxxx",
                    toPlat: "xxx",
                },
                {
                    "orderId": "1275810121263300610",
                    "createTime": "2020-06-24 23:16:50",
                    "amount": "3333",
                    "payTypeName": "支付宝-H5支付",
                    "payTypeCode": "bank_card",
                    "status": 2,
                    "statusName": "失败",
                    "bankTransferId": "11",
                    accountNo: "xxxxxxxxxxxxx",
                    bankName: "afasdfadsf",
                    fromPlat: "xxxxx",
                    toPlat: "xxx",
                },

            ],
            activityList: [
                {
                    "orderId": "1275810121263300610",
                    "createTime": "2020-06-24 23:16:50",
                    "amount": "3333",
                    "activityName": "hahahhahaha",

                }
            ],
            showVertureDialog: false, //是否展示虚拟币详情
            orderStatus: '', // 订单状态
            // 类型名称
            typeList: {
                "1": "存款",
                "2": "取款",
                "3": "转账",
                "4": "加扣款",
                "5": "派彩",
                "6": "洗码返水",
                "7": "代理返佣",
                "9":"推广返佣"
            },
            showErrorDialog:false, // 错误展示弹框
            errorMsg:'',// 错误信息
            currtItem:'',//当前选中的行
            showDrawDialog:false,// 取款详情弹框
            currtDrawItem:"",// 选中得取款订单记录

            drawDetail:{

            }
        }
    },
    filters: {
        getOrderStatus(val) {
            let status = this.orderStatus[parseInt(val) + 1];
            return status;
        },
        format(vlaue) {
            if (vlaue) {
                if(typeof(value) =="string"){
                    return formatAmount(Number(vlaue))
                }
                return formatAmount(vlaue);
            } else {
                return "0"
            }
        },
        numHidf4l4Fillter(str) {
            if (str) {
                if(str.toString().length > 7 ){
                    return numHidf4l4(str);
                }else{
                    return str;
                }
            } else {
                return ""
            }
        },

    },
    created() {
        // 动态store
        if (!store.state["capitalRecordStore"]) {
            thatStore.install(this);
        }
        // 动态store
        if (!store.state["depositStore"]) {
            depositStore.install(this);
        }
    },
    mounted() {

    },
    computed: {
        ...mapState({
            userInfo: state => state['centerStore'].userInfo,
            tableList: state => state['capitalRecordStore'].tableList,
            tableListData: state => state['capitalRecordStore'].tableListData,
            bankTransferDetail: state => state['capitalRecordStore'].bankTransferDetail,
            transferMoney: state => state['capitalRecordStore'].transferMoney,//统计金额
            transferObj: state => state['capitalRecordStore'].transferObj,//统计金额对象
            agentable: state => state.agentable, //是否是高级代理人
            virtualDetail: state => state.depositStore.virtualDetail,// 虚拟币订单详情
        }),
    },
    methods: {
        ...mapActions({
            // 查询交易记录
            getTransactionsListFun(dispatch, param) {
                return dispatch(`capitalRecordStore/getTransactionsListAction`, param);
            },
            // 统计金额
            getTransactionsAmountFun(dispatch, param) {
                return dispatch(`capitalRecordStore/getTransactionsAmountAction`, param);
            },

            // 查询交易记录详情
            getBankTransferDetailFun(dispatch, param) {
                return dispatch(`capitalRecordStore/getBankTransferDetailAction`, param);
            },
            // 取消订单
            cancelDepositFun(dispatch, param) {
                return dispatch(`capitalRecordStore/cancelDepositAction`, param);
            },
            activityDetailFun(dispatch, param) {
                return dispatch(`capitalRecordStore/activityDetailAction`, param);
            },
            // 虚拟币订单详情
            getVirtualDetailFun(dispatch, param) {
                return dispatch('depositStore/getVirtualDetailAction', param);
            },
        }),
        stateRem(v){ // 是否业示备注，如果失败显示备注
            if(v && v.indexOf('失败') > 0) {
                return true
            }else{
                return false
            }
        },
        selectType(item) {
            // 清空订单状态
            this.orderStatus = '';
            this.currtTable = item;
            this.resetPageSize()
            this.searchList();
        },
        selectTime(item) {
            this.currtTime = item;
        },
        //分页
        getPageEnv(num) {
            this.current = num;
            this.searchList();
        },
        //时间事件
        getTimeEvent(obj) {
            this.startDate = formatDate(obj.startTime, true) + " 00:00:00";
            this.endDate = formatDate(obj.endTime, true) + " 23:59:59";
            this.dataType = obj.dataType + "";
            this.resetPageSize()
            this.searchList()
        },
        searchList() {
            let that = this;
            // 判断是否是请求中
            if (this.isReqFlag) {
                this.isReqFlag = false;
            } else {
                return;
            }
            let obj = this.getSearchParam();
            this.getTransactionsListFun(obj).then(function () {
                that.isReqFlag = true;
            });
            this.getTransactionsAmountFun(obj);
        },
        getSearchParam() {
            let param = {
                type: parseInt(this.currtTable), // 查询订单类型 null 全部 1 存款 ，2取款，3转账，4 加扣款，5活动，6 洗码返水，7代理返佣
                //startTime:this.startDate,// 订单开始时间
                //endTime:this.endDate,// 订单结束时间
                dataType: this.dataType,// 时间类型 null 全部 1、今日 2、昨日 3、近3天 4、近7天 5、近10天 6、近15天 7、本月 8、最近60
                query: {
                    current: parseInt(this.current), // 当前页
                    size: parseInt(this.size), // 每页的数量
                },
            }
            // 如果是存款,取款,转账,vip礼金 加上订单状态
            if (param.type == 1 || param.type == 2 || param.type == 3 ||  param.type == 5 || param.type == 11) {
                param.status = this.orderStatus;
            }
            return param;
        },
        // 查看订单详情 --- 只有银行卡转账才有
        openDetail(item) {
            let that = this;
            this.currtItem = item;
            // 虚拟币支付详情
            if (item.payTypeCode == "usdt_pay") {
                this.getVirtualDetailFun({id: item.orderId}).then(res => {
                    if (res && res.success) {
                        that.showVertureDialog = true;
                    }
                })
            } else {
                // 银行卡,二维码类别详情
                this.getBankTransferDetailFun({id: item.orderId}).then(function (res) {
                    if (res && res.success) {
                        that.showDialog = true;
                    }
                })
            }

        },
        //取消订单
        cancelOrder(item) {
            let that = this;
            let obj = this.getSearchParam();
            let o = {
                oprm: {id: item.orderId},
                sprm: obj

            }
            this.cancelDepositFun(o).then(res => {
                if (res && res.success) {
                    window.win.myloading.show()
                    setTimeout(() => {
                        window.win.myloading.hidden()
                        that.resetPageSize();
                        that.searchList();
                    }, 2000)
                }
            })
        },
        // 复制内容
        copySub(c) {
            const btnCopy = new clipboard(`.${c}`);
            btnCopy.on('success', e => {
                this.$tips.toast(`复制成功`)
                e.clearSelection();
            });
        },
        //关闭弹框
        closeDialog() {
            this.showDialog = false;
            this.showVertureDialog = false;
            this.showErrorDialog = false;
        },
        openActivityDetail(item) {
            let param = {
                id: item.activityId
            }
            //param.id = 26;
            this.activityDetailFun(param).then(res => {
                if (res && res.success) {
                    this.$myDialog({title: '活动详情', con: res.data.content, diatxtClass: true}, (res) => {

                    });
                }
            })

        },
        resetPageSize() {
            this.current = 1;// 当前页
            this.size = 10; // 每页的数量
        },
        // 是否是银行卡类型 :payModeId: 1 在线支付  2线下转账 3虚拟币;  银行卡转账, 支付宝-h5 微信-h5, 后两种为银行卡封装类型;
        isBnakType: function (currtItem) {
            if (currtItem.payModeId == 2 || currtItem.payModeId == 3){
                return true;
            } else {
                return false;
            }
        },
        // 状态选择
        selectOrderStatus(status) {
            this.orderStatus = status;
            this.resetPageSize()
            this.searchList();
        },
        openErrorRession(item){
            this.errorMsg = item.auditRemark;
            this.showErrorDialog = true;
        },
        // 获取虚拟币订单状态
        getVirtuaStatus(status){
            let obj = {
                "1":"已提交，待审核",
                "2":"已审核，已完成"
            }
            return obj[status] ? obj[status] :"";
        },
        // 获取银行卡订单状态 1、处理中 2、成功 3、失败 4、已取消
        getBankStatus(status){
            let obj = {
                "1":"进行中",
                "2":"成功",
                "3":"失败",
                "4":"已取消",
            }
            return obj[status] ? obj[status] :"";
        },
        // 打开取款弹框
        openDrawDialog(item){
            this.showDrawDialog = true;
            this.drawDetail = item;

        },
        // 关闭取款弹框
        closeDrawDialog(){
            this.showDrawDialog = false;
        }

    }

}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template1/themes/mixin.styl'
@import "~@styl/template1/common/fun.styl"

.capitalRecord
    .com-tab
        width 100%
        height: 70px;
        line-height 70px
        font-size: 20px;
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
            flex-wrap nowrap
            justify-content flex-start

            li
                flex none
                width 136px
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

    .search-con
        bg_color(bg04)
        padding: 10px 20px 2px 10px;
        width 100%
        .item
            display flex
            flex-direction row
            flex-wrap wrap
            justify-content flex-start
            align-items center
            margin-bottom 20px

            .name
                font-size: 14px;
                font_color(fc05);
                flex none
                padding-right 10px
                flex none
                width 50px
            ul
                resetul()
                display flex
                flex-direction row
                flex-wrap wrap
                justify-content flex-start
                align-items center
                flex 1
                li
                    text-align center
                    line-height 36px
                    flex none
                    width 88px
                    font-size: 14px;
                    font_color(fc017)
                    position relative
                    cursor pointer

                    &.submit-btn
                        width: 63px;
                        height: 30px;
                        line-height 30px
                        bg_color(bg18)
                        border-radius: 5px;

                    &.active
                        font-size: 14px;
                        font_color(fc026)

                        &:after
                            content ''
                            display block
                            border-radius 2px
                            width: 60px;
                            height: 3px;
                            bg_color(bg18)
                            position absolute
                            bottom 0px
                            left 50%
                            transform translateX(-50%)

                    &:nth-child(1), &:nth-child(2), &:nth-child(3), &:nth-child(4)
                        &:after
                            width: 40px;

            .search-item
                cursor: pointer;
                width: 63px;
                height: 30px;
                line-height: 30px;
                line-height: 30px;
                bg_color(bg18)
                border-radius: 5px;
                font-size: 14px;
                font_color(fc017)
                text-align: center;
                margin-left: 10px;

    .table-con
        bg_color(bg04)
        padding 10px 10px 60px

        ul
            resetul()

            li
                line-height 45px
                width 100%
                display flex
                flex-direction row
                flex-wrap nowrap
                justify-content center
                align-items center
                &:hover
                    bg_color(bg13)
                &.title
                    height: 40px;
                    bg_color(bg13)
                    border-radius: 1px;
                    opacity: 0.5;

                    span
                        font-size: 14px;

                span
                    display inline-block
                    white-space nowrap
                    overflow hidden
                    text-overflow ellipsis
                    flex 1
                    //align-self center
                    //display flex
                    //justify-content center
                    text-align center
                    font-size: 14px;
                    font_color(fc017)

                    span + span
                        margin-left 10px
                        margin-right 10px
            .flow-con
                flex none
                position relative
                span
                    display inline-block
                    width 16%
                    overflow inherit
                .long-con
                    position relative
                    cursor pointer
                    display block
                    width 120px
                    overflow hidden
                    &:hover
                        background #c7f3ea
                        & + .long
                                display block
                .long
                    display none
                    width 500px
                    border-radius 6px
                    line-height 30px
                    text-align center
                    position absolute
                    right -250px
                    bottom 54px
                    background-color #ffd5a0
                    transform translateX(-50%)
                    z-index 2
                    &::after
                        content ''
                        position absolute
                        width: 0;
                        height: 0;
                        bottom  -10px
                        left 80%
                        border-style: solid;
                        border-width: 10px 10px 0 10px;
                        border-color: #ffd5a0 transparent transparent transparent;

            .draw-con
                cursor pointer
        &.deposit
            .title
                span:last-child
                    flex 1.5

            .con
                .ca-so
                    cursor pointer

                .ca-cancel
                    cursor pointer

                span:last-child
                    flex 1.5

                    &.statusMiddle
                        span:nth-child(1)
                            font_color(fc029)

                        span.orderDetail
                            cursor pointer
                            font_color(fc016)
                            border_com(1px, solid, border16, bottom)
                            line-height 30px

                        span:nth-child(3)
                            cursor pointer
                            font_color(fc030)

                    &.status1
                        font_color(fc029);

                    &.status2
                        font_color(fc031)

                    &.status3
                        font_color(fc032)

                    &.status4
                        font_color(fc016);

                .orderStatus
                    &.status1
                        font_color(fc029);

                    &.status2
                        font_color(fc031)

                    &.status3
                        font_color(fc032)

                    &.status4
                        font_color(fc016);

        &.draw
            .con
                position relative
                .err
                    font_color(fc032)
                .ca-so
                    cursor pointer
                .orderStatus
                    &.status1
                        font_color(fc029);

                    &.status2
                        font_color(fc029);

                    &.status3
                        font_color(fc031)

                    &.status4
                        font_color(fc032)
                .show-account
                    position relative
                    .long
                        display none
                    &:hover
                        .long
                            display block
                            width 500px
                            height 30px
                            border-radius 6px
                            line-height 30px
                            text-align center
                            position absolute
                            left 50%
                            bottom 58px
                            background-color #ffd5a0
                            transform translateX(-50%)
                            &::after
                                content ''
                                position absolute
                                width: 0;
                                height: 0;
                                top 30px
                                left 50%
                                border-style: solid;
                                border-width: 10px 10px 0 10px;
                                border-color: #ffd5a0 transparent transparent transparent;

        &.transfer
            .con
                .orderStatus
                    &.status1
                        font_color(fc031)

                    &.status2
                        font_color(fc032)

        &.activity
            .con
                .name
                    font_color(fc033)
                    cursor pointer
                .orderStatus
                    &.status1
                        font_color(fc032)

                    &.status2
                        font_color(fc031)
        &.vip-amount
            .con
                .orderStatus
                    &.status1
                        font_color(fc033)

                    &.status2
                        font_color(fc031)
                    &.status3
                        font_color(fc032)

    .tongji-con
        height 150px
        bg_color(bg04)
        padding 10px

        .tongji-flow
            border-radius 10px
            height 120px
            //box_shadow(shadow_common)
            border_all(1px, solid, border08)
            flexcon()

            .left
                flex 2

            .right
                flex 1
                height 100%
                padding 20px
                position relative

                .title
                    font-size 18px
                    font_color(fc017)

                .money
                    font-size 20px
                    font-weight 600
                    font_color(fc017)
                    margin-top 20px

                &:after
                    content: "";
                    left 0
                    border_com(1px, solid, border08, left)
                    height: 80%;
                    position absolute
                    top 50%
                    transform translateY(-50%)


    .dialog-con
        width 600px
        //height 500px

        &.errmsg-con
            height 150px
        .deposit-con, .virtual-con
            width 100%
            overflow auto
            .yellow,.galery
                font_color(fc034)

            .title
                font-size: 16px;
                line-height: 25px;
                font_color(fc017)
                margin-bottom 10px


            .top
                color #999
                font-size 14px
                text-align center

                .top-title
                    margin-top 20px

                .top-money
                    font-size 24px
                    margin 10px 0 4px
                    font_color(fc034)

                .top-time
                    font-size 12px

                    .blue
                        color #a9a9f8

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

                &.address
                    .text
                        justify-content center

                &.qrcode-con
                    border 1px solid skyblue



        .draw-con
            .error-msg
                min-height 90px
                font-size 18px
                line-height 30px
                text-align center

        &.draw-detail-con
            .draw-detail-flow
                .title
                    text-align center
                    font-size 16px
                    font-weight 600
                    line-height 30px
                .item-con
                    .item
                        min-height 36px
                        font-size 14px
                        flexcon()
                        span
                            flex 1
                            &:nth-child(2)
                                text-align right
                            &.copy-btn
                                flex none
                                background url("~@img/comimages/center/deposit/copy.png") center no-repeat
                                width 19px
                                height 19px
                                margin-left 10px
                                cursor pointer

                            &.status1
                                color #339dff
                            &.status2
                                color #339dff
                            &.status3
                                color #10bd1c
                            &.status4
                                color #f33

    .nodata-con
        width 100%
        min-height 450px
        bg_color(bg59)
        padding-top 20px
</style>
