<template lang="pug">
    .page-con
        // vip中心
        .vip-page(v-show="currtPage == 1")
            // vip头部信息
            .vipinfo
                .item
                    .vip-icon
                .item
                    .vip-name-dj
                        span.name 欢迎您:  {{userInfo.username?userInfo.username:numHidf3l4(userInfo.mobile)}}
                        span.vip(:class="'vipLevel'+userInfo.vipLevel",@click="")
                    .msg(v-if="myVipAwardArr.length > 0") {{myVipAwardArr.length}}大特权尊享中
                .item
                    .btn-detail(@click="currtPage = 2") 查看VIP详情

            // 进度模块
            .schedule
                // 存款进度
                .schedule-item
                    .item
                        span.title 当前存款
                        span.btn(@click="jumpPage('/center/deposit')") 去充值
                    .item.money
                        span ¥
                        span {{vipPersonlInfo.depositTotalAmount | format}}
                    .item
                        .progress-con
                            .progress-currt(:style="{width: vipPersonlInfo.vipId == 10 ? '100%' : depositPercent}")
                    .item
                        span(v-if="vipPersonlInfo.vipId != 10") 距离{{vipPersonlInfo.nextLevelName}}等级还需要存款{{vipPersonlInfo.nextLevelDeposit}}可升级
                        span(v-if="vipPersonlInfo.vipId == 10") 距离VIP9等级还需要存款0
                // 流水进度
                .schedule-item
                    .item
                        span.title 当前流水
                        span.btn(@click="jumpPage('/center/transfer')") 去完成
                    .item
                        span ¥
                        span {{vipPersonlInfo.betTotalAmount | format}}
                    .item
                        .progress-con
                            .progress-currt(:style="{width: vipPersonlInfo.vipId == 10 ? '100%' : betPercent}")
                    .item
                        span(v-if="vipPersonlInfo.vipId != 10") 距离{{vipPersonlInfo.nextLevelName}}等级还需要流水{{vipPersonlInfo.nextLevelBet}}可升级
                        span(v-if="vipPersonlInfo.vipId == 10") 距离VIP9等级还需要流水0

            // 会员等级
            .membership-level
                .title 会员等级
                carousel-3d(
                    v-if="slides.length > 0",
                    ref='mycarousel',
                    :width="400"
                    :space="140"
                    :height="207"
                    :autoplay="false"
                    :autoplay-timeout="3000"
                    :display="9"
                    :start-index="currentIndex"
                    @after-slide-change="onSlideChange"
                )
                    slide(v-for='(item, i) in slides' :index='i' :key="i")
                        .con-box
                            img(:src='item.src')
                            .current-vip(v-if="item.vipId == vipPersonlInfo.vipId")
                            .word-con(:class="'vip'+item.vipId")
                                .word-item.word1 {{item.depositTotal | format}}
                                .word-item {{item.withdrawalTimes | format}}
                                .word-item {{item.betTotalUp | format}}
                                .word-item.word3 {{item.betTotalKeep | format}}




            // 会员特权
            .vip-power(v-if="vipAwards.length > 0")
                .title-obj {{'VIP' + (vipInfo.vipId ? vipInfo.vipId - 1 : 0)}}尊享特权
                .item-con
                    .item(v-for="(item, index) in vipAwards")
                        .title {{item.typeName}}
                        .money
                            span ¥
                            span {{item.vipAmount | format}}
                        .msg 会员专享


        // vip 详情页面
        .detail-page(v-show="currtPage == 2")
            .goback(@click="currtPage=1") < VIP 详情
            // 详情列表
            .detail-con
                //.title  VIP详情
                .menu-list(v-if="myVipAwardArr.length != 0")
                    .item(
                        v-for="(item, index) in myVipAwardArr",
                        :class="{active: activeRed == index}",
                        @click="changeRed(index)"
                    ) {{ item.typeName }}
                        .angle
                .detail-table(v-if="myVipAwardArr.length != 0")
                    .item.label-title
                        span 会员等级
                        span VIP0
                        span VIP1
                        span VIP2
                        span VIP3
                        span VIP4
                        span VIP5
                        span VIP6
                        span VIP7
                        span VIP8
                        span VIP9
                    .item
                        span 礼金额度
                        span {{ vipRedNum.vip0Amount }}
                        span {{ vipRedNum.vip1Amount }}
                        span {{ vipRedNum.vip2Amount }}
                        span {{ vipRedNum.vip3Amount }}
                        span {{ vipRedNum.vip4Amount }}
                        span {{ vipRedNum.vip5Amount }}
                        span {{ vipRedNum.vip6Amount }}
                        span {{ vipRedNum.vip7Amount }}
                        span {{ vipRedNum.vip8Amount }}
                        span {{ vipRedNum.vip9Amount }}



            // 反水比例
            .worter-con
                .title  VIP返水比例
                    span.title-percent （百分比%）
                .worter-table.detail-table(v-if="vipRebate.length > 0")
                    .item.label-title
                        span 会员等级
                        span VIP0
                        span VIP1
                        span VIP2
                        span VIP3
                        span VIP4
                        span VIP5
                        span VIP6
                        span VIP7
                        span VIP8
                        span VIP9
                    .item(v-for="(item, index) in vipRebate")
                        span {{ item.gameTypeName }}
                        span(v-for="(vipItem, index) in item.ruleDetailVips") {{ vipItem.rate }}

                .tip-msg 注：以上为各游戏类型最高返水，具体返水金额请以实际游戏为准。

            //规则
            .rule-con
                .title VIP条款与规则
                div
                    .title3
                        span.icon
                            svg-icon(icon-class="star_blank" )
                        span 晋升标准
                    .item 会员的累计存款以及累计投注额达到相应级别，且最近90天达到了对应等级的提款成功次数,并且在最近30天达到了保级流水要求，即可在次日24点前晋级相应VIP等级。
                div
                    .title3
                        span.icon
                            svg-icon(icon-class="star_blank" )
                        span 晋升顺序
                    .item VIP等级达到相应的要求可每天晋升一级，但VIP等级不可越级晋升。
                div
                    .title3
                        span.icon
                            svg-icon(icon-class="star_blank" )
                        span 保级要求
                    .item 会员在达到某VIP等级后，90天内投注需要完成保级要求。如果在此期间完成晋升，保级要求重新按照当前等级计算。
                div
                    .title3
                        span.icon
                            svg-icon(icon-class="star_blank" )
                        span 降级标准
                    .item 如果会员在一个季度（90天计算）内没有完成相应的保级要求流水，系统会自动降级一个等级，相应的返水及其它优惠也会随之调整至降级后的等级。
                div(v-if="showRule(1)")
                    .title3
                        span.icon
                            svg-icon(icon-class="star_blank" )
                        span 晋级礼金
                    .item 晋级礼金在会员达到该会员级别后，即可在领取中心页面领取相应等级的晋级礼金。
                div(v-if="showRule(2)")
                    .title3
                        span.icon
                            svg-icon(icon-class="star_blank" )
                        span 每周红包
                    .item 会员在上周有过至少1次的成功存款，即可在本周星期3去领取中心页面领取相应等级的红包彩金。
                div(v-if="showRule(3)")
                    .title3
                        span.icon
                            svg-icon(icon-class="star_blank" )
                        span 每月红包
                    .item 会员在上个月有过至少1次的成功存款，即可在本月2号去领取中心页面领取相应等级的红包彩金。
                div(v-if="showRule(4)")
                    .title3
                        span.icon
                            svg-icon(icon-class="star_blank" )
                        span 年度红包
                    .item 会员在领奖月份的前一个月有过至少1次的成功存款，即可在1月2号去领取中心页面领取相应等级的红包彩金。
                div.tip-msg  __________
                .tip-msg 为了避免文字理解差异，平台保留最终解释权。

        // 领取中心
        comDialog(:show-footer='false',:show="showDialog",@on-cancel="closeDialog")
            div(slot="header") 领取中心
            div.dialog-con(slot="default")
                .item-con
                    .item
                        .vip VIP1
                        .title 晋级礼金
                        .money
                            span ¥
                            span 5888
                        .btn-lingqu 领取
                        .msg 以满足领取条件
                    .item
                        .vip VIP1
                        .title 晋级礼金
                        .money
                            span ¥
                            span 5888
                        .btn-lingqu 领取
                        .msg 以满足领取条件
                    .item
                        .vip VIP1
                        .title 晋级礼金
                        .money
                            span ¥
                            span 5888
                        .btn-lingqu 领取
                        .msg 以满足领取条件
                    .item
                        .vip VIP1
                        .title 晋级礼金
                        .money
                            span ¥
                            span 5888
                        .btn-lingqu 领取
                        .msg 以满足领取条件




                    .item
                        .vip VIP1
                        .title 晋级礼金
                        .money
                            span ¥
                            span 5888
                        .btn-lingqu 领取
                        .msg 以满足领取条件
                    .item
                        .vip VIP1
                        .title 晋级礼金
                        .money
                            span ¥
                            span 5888
                        .btn-lingqu 领取
                        .msg 以满足领取条件
                    .item
                        .vip VIP1
                        .title 晋级礼金
                        .money
                            span ¥
                            span 5888
                        .btn-lingqu 领取
                        .msg 以满足领取条件
                    .item
                        .vip VIP1
                        .title 晋级礼金
                        .money
                            span ¥
                            span 5888
                        .btn-lingqu 领取
                        .msg 以满足领取条件





                    .item.empty
                    .item.empty

                .btn-con 一键领取

            div(slot="footer")
</template>

<script>
import vip0 from '@img/comimages/center/vipBanner/vip0.png'
import vip1 from '@img/comimages/center/vipBanner/vip1.png'
import vip2 from '@img/comimages/center/vipBanner/vip2.png'
import vip3 from '@img/comimages/center/vipBanner/vip3.png'
import vip4 from '@img/comimages/center/vipBanner/vip4.png'
import vip5 from '@img/comimages/center/vipBanner/vip5.png'
import vip6 from '@img/comimages/center/vipBanner/vip6.png'
import vip7 from '@img/comimages/center/vipBanner/vip7.png'
import vip8 from '@img/comimages/center/vipBanner/vip8.png'
import vip9 from '@img/comimages/center/vipBanner/vip9.png'

import comDialog from '@pon/template1/comDialog'
import { Carousel3d, Slide } from 'vue-carousel-3d';
import {formatAmount, thousandBitForma, formatDate, numHidf3l4, numHidf4l4} from '@js' // 工具类
import {vipNumber, getVipPersonlInfo, getVipRule, getVipRuleAndAwardInfo, getVipAward, getVipRebate} from "@/store/comstore/api/apiConfig";
import {mapState} from "vuex";
// import { subtract, bignumber } from 'mathjs'
export default {
    name: "",
    components: {
        comDialog,
        Carousel3d,
        Slide
    },

    filters: {
        format(value) {
            return formatAmount(value)
        },

    },
    data() {
        return {
            currtPage:'1',// 当前页面 1: vip中心页 2: 详情页
            showDialog:false,// 显示弹框
            deposit: '0123',
            userName:"kevin",// 用户名
            depositTotalAmount:'888.88',//当前存款
            nextVip:'VIP3',//下一个等级
            needMoney:'888.88',// 需要多少存款
            needWorter:'888.88',// 需要多少流水
            // 个人信息
            vipPersonlInfo: {
                vipId: '0',
                vipName: '',
                depositTotalAmount: '',
                betTotalAmount: '',
                nextLevelBet: '',
                nextLevelDeposit: '',
                nextLevelID: '',
                nextLevelName: ''
            },
            // 存款进度
            depositPercent: '0%',
            betPercent: '0%',
            // 轮播规则
            slides: [],
            currentIndex: 0,
            sliderTimer: '',
            vipInfo: {},
            // 轮播规则-VIP尊享特权
            vipAwards: [],
            // 详情-我的VIP详情
            myVipAwardArr: [],
            // 详情-礼金额度
            vipRedNum: {
                id: '',
                type: '',
                typeName: '',
                vip0Amount: '',
                vip1Amount: '',
                vip2Amount: '',
                vip3Amount: '',
                vip4Amount: '',
                vip5Amount: '',
                vip6Amount: '',
                vip7Amount: '',
                vip8Amount: '',
                vip9Amount: '',
            },
            // 当前红包
            activeRed: '0',
            // 详情-反水
            vipRebate: [
                // {
                //     gameTypeName: '',
                //     ruleDetailVips: [
                //         {
                //             vipId: '',
                //             rate: ''
                //         }
                //     ]
                // }
            ],

        }
    },
    computed:{
        ...mapState({
            userInfo: state => state['centerStore'].userInfo,
        }),
    },
    watch: {},
    mounted() {
        window.win.myloading.show()
        this.vipPersonInfo()
        // this.getRuleAndAwardInfo()
        // this.getRule()
        this.myVipAward()
    },
    methods: {
        numHidf3l4: numHidf3l4,
        // 路由跳转
        jumpPage(page) {
            this.$router.push({path: page});
        },
        // 关闭弹框
        closeDialog(){
            this.showDialog = false;
        },
        changeRed(index) {
            this.activeRed = index
            this.vipRedNum = this.myVipAwardArr[index]
        },
        onSlideChange(val, item) {
            let vipInfo = {
                depositTotalAmount: this.vipPersonlInfo.depositTotalAmount,
                betTotalAmount: this.vipPersonlInfo.betTotalAmount,
                vipId: this.slides[val].vipId,
            }
            this.getRuleAndAwardInfo(vipInfo)
        },
        // 查询(等级存款流水)
        vipPersonInfo() {
            getVipPersonlInfo().then(res => {
                window.win.myloading.hidden()
                if (res && res.success) {
                    let data = res.data
                    this.vipPersonlInfo.depositTotalAmount = data.depositTotalAmount ? data.depositTotalAmount : 0
                    this.vipPersonlInfo.vipName = data.vipName
                    this.vipPersonlInfo.vipId = data.vipId
                    // this.vipPersonlInfo.vipId = 8
                    this.vipPersonlInfo.betTotalAmount = data.betTotalAmount ? data.betTotalAmount : 0
                    // this.vipPersonlInfo.nextLevelBet = formatAmount(data.nextLevelBet - this.vipPersonlInfo.betTotalAmount)
                    // this.vipPersonlInfo.nextLevelDeposit = formatAmount(data.nextLevelDeposit - this.vipPersonlInfo.depositTotalAmount)
                    // this.vipPersonlInfo.nextLevelBet = formatAmount(900 - 833.2)
                    // this.vipPersonlInfo.nextLevelBet = subtract(bignumber(data.nextLevelBet), bignumber(this.vipPersonlInfo.betTotalAmount))
                    // this.vipPersonlInfo.nextLevelDeposit = subtract(bignumber(data.nextLevelDeposit), bignumber(this.vipPersonlInfo.depositTotalAmount))
                    // if (this.vipPersonlInfo.nextLevelDeposit < 0) {
                    //     this.vipPersonlInfo.nextLevelDeposit = 0
                    // }
                    // if (this.vipPersonlInfo.nextLevelBet < 0) {
                    //     this.vipPersonlInfo.nextLevelBet = 0
                    // }
                    this.vipPersonlInfo.nextLevelID = data.nextLevelID
                    this.vipPersonlInfo.nextLevelName = data.nextLevelName
                    let d = this.vipPersonlInfo.depositTotalAmount / data.nextLevelDeposit
                    let b = this.vipPersonlInfo.betTotalAmount / data.nextLevelBet
                    if (d > 1) {
                        d= 1
                    }
                    if (b > 1) {
                        b = 1
                    }
                    this.depositPercent = d*100 + '%'
                    this.betPercent = b*100 + '%'
                    let vipInfo = {
                        depositTotalAmount: data.depositTotalAmount,
                        betTotalAmount: data.betTotalAmount,
                        vipId: this.vipPersonlInfo.vipId,
                        // nextLevelID: data.nextLevelID
                    }
                    this.getRule()
                    this.getRuleAndAwardInfo(vipInfo)
                } else {
                    let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
                    window.win.tips.warning(msg);
                }
            }).catch(() => {
                window.win.myloading.hidden()
            })
        },
        // VIP中心-查询(VIP升级规则及奖励)-尊享特权
        getRuleAndAwardInfo(vipInfo) {
            let delayInMilliseconds = 300; //1 second
            if (this.sliderTimer) {
                window.clearTimeout(this.sliderTimer);
                // this.sliderTimer.clearTimeout()
            }
            this.sliderTimer = setTimeout(() => {
                //your code to be executed after 1 second
                this.vipInfo = vipInfo
                // window.win.myloading.show()
                getVipRuleAndAwardInfo(vipInfo).then(res => {
                    if (res && res.success) {
                        this.vipAwards = res.data.vipAwards
                        if (res.data.vipId == this.vipPersonlInfo.vipId) {
                            this.vipPersonlInfo.nextLevelBet = res.data.needBet
                            this.vipPersonlInfo.nextLevelDeposit = res.data.needDeposit
                        }
                    } else {
                        window.win.tips.warning(res.msg);
                    }
                    // window.win.myloading.hidden()
                }).catch(() => {
                    // window.win.myloading.hidden()
                })
            }, delayInMilliseconds);
        },
        // VIP中心-查询(VIP规则)-会员等级
        getRule() {
            getVipRule().then(res => {
                if (res && res.success) {
                    // console.log(res)
                    let data = res.data
                    this.slides = []
                    let currentIndex = 0
                    let srcArr = [vip0, vip1, vip2, vip3, vip4, vip5, vip6, vip7, vip8, vip9]
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].vipId == this.vipPersonlInfo.vipId) {
                            currentIndex = i
                        }
                        let obj = data[i]
                        obj.src = srcArr[i]
                        this.slides.push(obj)
                    }
                    // if (data.length > 0) {
                    //     this.goToSlide(currentIndex)
                    // }
                    this.currentIndex = currentIndex
                    // console.log(currentIndex)
                }
            })
        },
        // goToSlide(index) {
        //     this.$refs.mycarousel.goSlide(index)
        // },
        // VIP中心-查询(VIP奖励)
        myVipAward() {
            // this.currtPage = 2
            // window.win.myloading.show()
            getVipAward().then(res => {
                if (res && res.success) {
                    this.myVipAwardArr = [].concat(res.data)
                    if (res.data.length > 0) {
                        this.activeRed = 0
                        this.vipRedNum = this.myVipAwardArr[0]
                    }
                } else {
                    window.win.tips.warning(res.msg);
                }
            })
            this.myVipRebate()
        },
        // VIP返水比例
        myVipRebate() {
            getVipRebate().then(res => {
                if (res && res.success) {
                    this.vipRebate = [].concat(res.data)

                } else {
                    window.win.tips.warning(res.msg);
                }

                // window.win.myloading.hidden()
            })
        },
        showRule(type) {
            let has = false
            for (let i = 0; i < this.myVipAwardArr.length; i++) {
                if (this.myVipAwardArr[i].type == type) {
                    has = true
                }
            }
            return has
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '~@styl/template1/themes/mixin.styl'
@import "~@styl/comstyle/common/fun.styl"

.carousel-3d-slide
    border none
    cursor pointer
    background-color #32343c
    .con-box
        position relative
        .current-vip
            position absolute
            top 0
            right 0
            width 75px
            height 25px
            //font-size 12px
            //text-align center
            //line-height 26px
            //bg_color(bg37)
            //border-bottom-left-radius 15px
            background-image  url("~@img/comimages/center/vip/current_vip.png")
            background-repeat no-repeat
            background-size contain
            background-position center
    ::v-deep .word-con
        width 100%
        position absolute
        font-size 14px
        left 0
        bottom 50px
        display flex
        align-items center
        justify-content space-between
        .word-item
            width 33%
            text-align center
        .word1
            padding-right: 10px;
        .word3
            padding-left: 10px;
        &.vip1
            color #888887
        &.vip2
            color #7b7a7b
        &.vip3
            color #98844f
        &.vip4
            color #6f9952
        &.vip5
            color #5a569c
        &.vip6
            color #9a5387
        &.vip7
            color #e12165
        &.vip8
            color #6915de
        &.vip9
            color #c57439
        &.vip10
            color #505050



.tip-msg
    font-size 12px
    color #808080
    //font_color(fc088)
    margin-top 5px
.page-con
    min-height 960px
    background-color #2b2b32

    //bg_color(bg37)
    border-radius 10px
    padding 20px
    font-size 14px
    .vip-page
        // 头部信息
        .vipinfo
            height 90px
            flexcon()
            flex-direction row
            .item
                height 100%
                flex 1
                &:nth-child(1)
                    flex none
                    width 120px
                    .vip-icon
                        width 90px
                        height 90px
                        border-radius 50%
                        margin: 0px auto;
                        background url("~@img/template1/center/user.png") center no-repeat
                &:nth-child(2)
                    padding-top 10px
                    .msg
                        color #808080
                        margin-top 10px
                        font-size 14px
                    .vip-name-dj
                        font-size: 16px;
                        color: #fafafa;
                        flexcon()
                        justify-content flex-start
                        .name
                            flex none
                        .vip
                            flex none
                            width 88px
                            height 30px
                            display: inline-block;
                            transform: scale(.7);
                            cursor pointer
                            background-position center
                            background-size contain
                            background-repeat no-repeat
                        .vipLevel1
                            background-image url("~@img/comimages/center/vip/vip0.png")

                        .vipLevel2
                            background-image url("~@img/comimages/center/vip/vip1.png")

                        .vipLevel3
                            background-image url("~@img/comimages/center/vip/vip2.png")

                        .vipLevel4
                            background-image url("~@img/comimages/center/vip/vip3.png")

                        .vipLevel5
                            background-image url("~@img/comimages/center/vip/vip4.png")

                        .vipLevel6
                            background-image url("~@img/comimages/center/vip/vip5.png")

                        .vipLevel7
                            background-image url("~@img/comimages/center/vip/vip6.png")
                        .vipLevel8
                            background-image url("~@img/comimages/center/vip/vip7.png")
                        .vipLevel9
                            background-image url("~@img/comimages/center/vip/vip8.png")
                        .vipLevel10
                            background-image url("~@img/comimages/center/vip/vip9.png")

                &:nth-child(3)
                    flex none
                    width 120px
                    flexcon()
                    .btn-detail
                        flex 1
                        color #dac08f
                        border 1px solid #dac08f
                        height 40px
                        border-radius  20px
                        line-height 40px
                        text-align center
                        cursor pointer


        // 进度模块
        .schedule
            margin-top 30px
            flexcon()
            justify-content space-around
            .schedule-item
                flex none
                width: 445px;
                height: 159px;
                background-color: #32343c;
                border-radius: 10px;
                padding 20px
                .item
                    &:nth-child(1)
                        .title
                            color: #808080;
                        .btn
                            display inline-block
                            flex none
                            width 120px
                            height 42px
                            background-color #dac08f
                            border-radius 20px
                            color #fff
                            line-height 42px
                            text-align center
                            margin-left 220px
                    &:nth-child(2)
                        span
                            font-weight 500
                            &:nth-child(1)
                                font-size 14px
                                color: #fafafa;
                            &:nth-child(2)
                                font-size 18px
                                color: #fafafa;
                                font-weight 500
                                margin-left 2px
                    &:nth-child(3)
                        margin-top 10px
                        .progress-con
                            width: 405px;
                            height: 8px;
                            background-color: #cccccc;
                            border-radius: 4px;
                            .progress-currt
                                width: 50%
                                height: 8px;
                                background-color: #dac08f;
                                border-radius: 4px;
                    &:nth-child(4)
                        color: #808080;
                        font-size 12px
                        margin-top 10px


        // 会员等级
        .membership-level
            .title
                color: #B5B4B4;
                font-size 16px
                font-weight 500
                margin-top 36px


        // 会员特权
        .vip-power
            margin-top 60px
            .title-obj
                color: #B5B4B4;
                font-size 16px
                text-align center
                font-weight 500
                position relative
                margin-bottom 30px
                &:before
                    before()
                    width: 150px;
                    height: 1px;
                    background-color: #434554;
                    left 250px
                    top 12px
                &:after
                    before()
                    width: 150px;
                    height: 1px;
                    background-color: #434554;
                    left 524px
                    top 12px
            .item-con
                flexcon()
                justify-content center
                .item
                    flex none
                    width: 216px;
                    height: 110px;
                    border-radius: 10px;
                    //border: solid 2px #e1af57;
                    border: 1px solid #434554;
                    background-color #32343c
                    position relative
                    cursor pointer
                    margin-left 15px
                    &.first-child
                        margin-left 0
                    .title
                        margin 0 auto
                        width: 76px;
                        height: 21px;
                        background-color: #434554;
                        border-radius: 0px 0px 15px 15px;
                        text-align center
                        color: #ccc;
                    .money
                        margin-top 20px
                        text-align center
                        font-weight 500
                        font-size: 24px;
                        line-height: 24px;
                        color: #fafafa;
                        span:nth-child(1)
                            font-size 18px
                            margin-right 2px
                    .msg
                        text-align center
                        margin-top 12px
                        font-size 12px
                        color: #c88f2d;


    // 详情页面
    .detail-page
        .goback
            color: #6a7180;
            //color: #444952;
            font-size 18px
            font-weight 500
            cursor pointer
        .detail-con
            margin-top 30px
            .title
                color: #ccc;
                font-weight 500
                font-size 15px
            .menu-list
                margin-top 10px
                flexcon()
                .item
                    flex 1
                    color: #e6ebf2;
                    height 50px
                    position relative
                    display flex
                    align-items center
                    justify-content center
                    text-align center
                    cursor pointer
                    margin-right: 4px;
                    border: 1px solid #e6ebf2;
                    border-radius: 10px;
                    &:last-child
                        margin-right 0
                    &.active
                        background-color: #e6ebf2;
                        border-radius: 10px;
                        color: #1b1203;
                        .angle
                            position absolute
                            bottom -8px
                            left 50%
                            transform translateX(-50%)
                            triangle-down(12px, 8px, #e6ebf2)


        .detail-table
            margin-top 10px
            flexcon()
            flex-direction column
            .item
                flex 1
                width 100%
                height 54px
                background-color: #32343c;
                flexcon()
                color #fafafa
                span
                    flex 1
                    height 40px
                    font-size 12px
                    line-height 40px
                    text-align center
                    border-right 1px solid #434554
                    border-bottom 1px solid #434554
            .label-title
                span
                    color #b0b7c5
        .worter-con
            margin-top 30px
            .title
                font-size 15px
                color #ccc
                .title-percent
                    font-size 12px
                    color #b0b7c5
        .rule-con
            margin-top 30px
            .title
                color #ccc
                font-weight 500
                font-size 15px
            .title3
                color #e4b65d
                font-size 14px
                margin-top 10px
                .icon
                    margin-right 4px
            .item
                font-size 12px
                color #999

    // 弹框--领取中心
    .dialog-con
        width 750px
        max-height 450px
        overflow auto
        .item-con
            flexcon()
            flex-wrap wrap
            justify-content space-around
            .item
                flex none
                width: 220px;
                height: 174px;
                background-color: #ffffff;
                border-radius: 10px;
                border: solid 1px #f6e9d2;
                position relative
                margin-bottom 10px
                .vip
                    position absolute
                    width: 46px;
                    height: 18px;
                    background-color: #cd9636;
                    border-radius: 10px 0px 18px 0px;
                    opacity: 0.5;
                    top 0px
                    left 0px
                    text-align center
                    color: #3a2807;
                    font-size 12px
                .title
                    color: #c88f2d;
                    text-align center
                    border-bottom 1px solid #f2f2f2
                    height 30px
                    line-height 30px
                .money
                    line-height: 24px;
                    letter-spacing: 0px;
                    color: #1b1203;
                    text-align center
                    font-size 20px
                    font-weight 500
                    margin 20px
                    span:nth-child(1)
                        font-size 14px
                .btn-lingqu
                    width: 90px;
                    height: 36px;
                    background-color: #ecb452
                    border-radius: 18px;
                    color #fff
                    text-align center
                    line-height 36px
                    margin 0 auto
                    cursor pointer
                .msg
                    color: #cccccc;
                    font-size 12px
                    text-align center
                    margin-top 10px

            .empty
                border none
                height 0

        .btn-con
            width: 221px;
            height: 40px;
            background-color #bb9759
            border-radius: 20px;
            color #fff
            margin 10px auto
            text-align center
            line-height 40px
            cursor pointer


</style>
