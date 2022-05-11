<template lang="pug">
    .draw
        .dialog-flow(v-if="showDateDialogFlag || showDateDialogFlag2",@click="closeDialog")
        .info
            .info-con
                .tip *注：线路钱包和线路钱包之间不可以互转！
                .form

                    .form-item.dialog-con.common-down(@click="toggleDialog")
                        .lable 转出线路:
                        input(placeholder='转出线路',maxlength=20,v-model="turnOut.lineName",readonly)
                        .icon.down
                        .common-dialog(v-if="showDateDialogFlag")
                            .line-list
                                ul
                                    template(v-for="(it,ind) in lineList")
                                        li(@click.stop="selectTurnOutLine(it)",:class="turnOut.lineName==it.lineName?'active':''")
                                            div {{it.lineName}}
                                            div.cn {{it.lineChName}}

                    .form-item.dialog-con.common-down(@click="toggleDialog2")
                        .lable 转入线路:
                        input(placeholder='转入线路',maxlength=20,v-model="turnIn.lineName",readonly)
                        .icon.down
                        .common-dialog(v-if="showDateDialogFlag2")
                            .line-list
                                ul
                                    template(v-for="(it,ind) in lineList")
                                        li(@click.stop="selectTurnInLine(it)",:class="turnOut.lineName==it.lineName?'active':''")
                                            div {{it.lineName}}
                                            div.cn {{it.lineChName}}

                    .form-item
                        .lable 转账金额:
                        input(maxlength=20,placeholder='请输入转账金额',v-model="transferAmount" ,@keyup="transferAmountVerif",@keydown="transferAmountVerif")
                        span.all(@click="trunAll") 全部

                .common-btn(@click="submitFun" ,:class="subFlag?'ok':''") 立即转账

            .layout-con
                .line
                    .com-title 线路钱包
                        .colls(@click="openMore")
                            span(v-if="more") 更多
                            //span(v-if="!more") 收起
                    .line-con(:class="more?'open':'close'")
                        .item(v-for="item in wallet.assetss")
                            .line-top
                                .line-name {{item.lineName}}
                                .line-btn(v-if="item.start == 0",@click="transferAllSubmit(item)") 一键转入
                                .line-btn(v-if="item.start == 1",class="closed") 维护中
                            .line-center
                                .game {{item.lineChName?item.lineChName:'--'}}
                            .line-num(v-if="item.start == 0")
                                span.money-icon ￥
                                span {{item.balance | format}}
                            .line-num(v-if="item.start == 1") --
        comDialog(:show-footer='false',:show="showJumpDialog",@on-cancel="closeJumpDialog")
            div(slot="header") 温馨提示
            div.dialog-con(slot="default")
                .jump-con
                    .success-icon
                    .title(v-if="tempTurnIn.lineId !=0") 资金已成功转入，祝您大杀四方!
                    .title(v-else) 资金已成功转出，祝您游戏愉快！
                    .btns-con
                        .common-btn(@click="closeJumpDialog",:class="tempTurnIn.lineId ==0?'ok':''") 我知道了
                        .common-btn.ok(@click="jumpGame",v-if="tempTurnIn.lineId !=0") 立即进入游戏
            div(slot="footer")


</template>

<script>
import thatStore from "@/store/comstore/assets/transferStore"; // 获取模板
import store from '@/store/Store';
import {mapActions, mapMutations, mapState} from "vuex";
import Rule from "@m/rule"; // 验证
import comDialog from '@pon/template1/comDialog'
import {formatAmount, mymd5} from '@m/utils' // 工具类
export default {
    name: "draw",
    components: {
        comDialog,
    },
    data() {
        return {
            isReqFlag: true, // 请求是否结束
            showDialog: false,
            showDateDialogFlag: false,
            showDateDialogFlag2: false,
            turnOut: '',
            turnIn: '', //转入线路
            tempTurnIn: '', // 临时转入线路
            currtCard: '',
            card: '',
            transferAmount: '',
            more: false, // 更多 , false: 可展开, true:可收起

            // 校验规则
            reg: {
                turnOut: {
                    msg: "",
                    isPass: false
                },
                turnIn: {
                    msg: "",
                    isPass: false
                },
                transferAmount: {
                    msg: "",
                    isPass: false
                },

            },
            //校验错误提示信息
            errorMsg: "",
            subFlag: false, // 是否校验通过
            showJumpDialog: false, //显示跳转弹框
            centerItem: '',// 中心钱包
            firstItem: '', //首个钱包
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state['centerStore'].userInfo,
            wallet: state => state['centerStore'].wallet,
            lineList: state => state['transferStore'].lineList,
        }),
    },
    filters: {
        format(vlaue) {
            if (vlaue) {
                return formatAmount(vlaue);
            } else {
                return "0"
            }
        }
    },
    created() {
        let that = this;
        // 动态store
        if (!store.state["transferStore"]) {
            thatStore.install(this);
        }
        this.getLineListFun().then(res => {
            if (res && res.success) {
                // 获取中心钱包 和 第一个非中心钱包
                res.data.forEach(item => {
                    // 中心钱包
                    if (item.lineId == 0) {
                        that.centerItem = item;
                        that.turnOut = that.centerItem;
                    }
                    // 第一个非中心钱包
                    if (item.lineId != 0 && !that.firstItem) {
                        that.firstItem = item;
                        that.turnIn = that.firstItem;
                        that.tempTurnIn = that.firstItem;
                    }
                })
                that.runCheckList()
            } else {

            }
        });
    },
    methods: {
        ...mapMutations({
            setCurrtGame(commit, data) {
                return commit("gameStore/set_currtGame", data);
            }
        }),
        ...mapActions({
            // 线路
            getLineListFun(dispatch, param) {
                return dispatch(`transferStore/getLineListAction`, param);
            },
            transferSubmitFun(dispatch, param) {
                return dispatch(`transferStore/transferSubmitAction`, param);
            },
            // 一键转入
            transferAllSubmitFun(dispatch, id) {
                return dispatch(`centerStore/transferAllSubmitAction`, {tochangeIntoLineId: id});
            },
            getAssetsFun(dispatch, param) {
                return dispatch(`centerStore/getAssetsAction`, param);
            },
            getAssetsSafeFun(dispatch, param) {
                return dispatch(`centerStore/getAssetsSafeAction`, param);
            },
        }),
        selectTurnOutLine(item) {
            this.turnOut = item;
            this.closeDialog()
            // 清空转入线路 & 转账金额
            this.turnIn = '';
            this.tempTurnIn = '';
            this.transferAmount = '';
            // 如果不是中心钱包
            if (item.lineId != 0) {
                // 如果不是中心钱包
                this.turnIn = this.centerItem;
                this.tempTurnIn = this.centerItem;
            } else {
                this.turnIn = this.firstItem;
                this.tempTurnIn = this.firstItem;
            }
            //校验
            //this.turnOutVerif()
            this.runCheckList()
            this.showDateDialogFlag = false;
        },
        selectTurnInLine(item) {
            // 判断当前选中的钱包,然后做不同的逻辑,如果是中心钱包,只能选着线路,如果选着的线路只能转中心钱包;
            // 如果不是中心钱包
            if (item.lineId != 0) {
                // 如果不是中心钱包
                this.turnOut = this.centerItem;
            } else {
                this.turnOut = this.firstItem;
            }
            // 转出钱包为 中心钱包
            if (this.turnOut.lineId === 0) {
                // 判断转入钱包是否为中心钱包
                if (item.lineId === 0) {
                    window.win.tips.info("转入钱包请选择线路钱包!");
                    return;
                }
            } else {
                // 转出钱包为线路钱包 则只能选择中心钱包;
                // 判断转入钱包是否为中心钱包
                if (item.lineId != 0) {
                    window.win.tips.info("转入钱包请选择中心钱包!");
                    return;
                }
            }
            this.turnIn = item;
            this.tempTurnIn = item;
            this.closeDialog()
            //this.turnInVerif()
            this.runCheckList()
        },
        toggleDialog() {
            this.closeDialog()
            this.showDateDialogFlag = !this.showDateDialogFlag;
        },
        toggleDialog2() {
            this.closeDialog()
            this.showDateDialogFlag2 = !this.showDateDialogFlag2;
        },
        closeDialog() {
            this.showDateDialogFlag2 = false;
            this.showDateDialogFlag = false;
        },
        submitFun() {
            let that = this;
            let param = {
                turnOutLineId: this.turnOut.lineId,
                tochangeIntoLineId: this.turnIn.lineId,
                transferAmount: this.transferAmount
            }
            // 校验
            this.runCheckList()
            // 校验
            if (!this.subFlag) {
                window.win.tips.info(this.errorMsg);
                return;
            }
            // 判断是否是请求中
            if (this.isReqFlag) {
                this.isReqFlag = false;
            } else {
                return;
            }
            this.transferSubmitFun(param).then(function (res) {
                that.isReqFlag = true;
                if (res && res.success) {
                    that.turnOut = {}
                    that.turnIn = {}
                    that.transferAmount = "";
                    that.subFlag = false;
                    that.errorMsg = "";
                    //显示跳转弹框

                    that.showJumpDialog = true;

                }
                that.getAssetsSafeFun()

            })
        },
        //展开更多
        openMore() {
            this.more = !this.more;
        },
        //1 转出线路
        turnOutVerif() {
            let rule = Rule.init().rules.nonempty,
                bool = rule.reg.test(this.turnOut.lineName);
            if (this.turnOut && bool) {
                this.reg.turnOut.isPass = true;
                this.reg.turnOut.msg = "";
            } else {
                this.reg.turnOut.isPass = false;
                this.reg.turnOut.msg = "转出线路" + rule.desc;
                this.errorMsg = "转出线路" + rule.desc;
            }
            this.btnVerif();
        },
        //2 转入线路
        turnInVerif() {
            let rule = Rule.init().rules.nonempty,
                bool = rule.reg.test(this.turnIn.lineName);
            if (this.turnIn && bool) {
                this.reg.turnIn.isPass = true;
                this.reg.turnIn.msg = "";
            } else {
                this.reg.turnIn.isPass = false;
                this.reg.turnIn.msg = "转入线路" + rule.desc;
                this.errorMsg = "转入线路" + rule.desc;
            }
            this.btnVerif();
        },
        //3 转账金额
        transferAmountVerif() {
            this.transferAmount = this.transferAmount.replace(/[^\d]/g, '')
            let rule = Rule.init().rules.money,
                bool = rule.reg.test(this.transferAmount);
            if (bool) {
                this.reg.transferAmount.isPass = true;
                this.reg.transferAmount.msg = "";
            } else {
                this.reg.transferAmount.isPass = false;
                this.reg.transferAmount.msg = rule.desc;
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
            this.transferAmountVerif()
            this.turnInVerif()
            this.turnOutVerif()
        },
        // 全部转入
        trunAll() {
            // 判断有没有转出线路,没有转出线路进行提示;
            if (this.turnOut) {
                let money = this.getTurnOutMoney(this.turnOut.lineId)
                if (money && money > 0) {
                    this.transferAmount = parseInt(money).toString();
                    this.transferAmountVerif();
                }
            } else {
                // 有转出线路,将转出线路的全部金额进行转入
                window.win.tips.info("请选择转出线路!");
            }

        },
        // 获取转出线路金额
        getTurnOutMoney(lineId) {
            let money = "";
            if (this.wallet) {
                // 是否是中心钱包
                if (lineId == 0) {
                    money = this.wallet.balance;
                } else {
                    this.wallet.assetss.forEach(item => {
                        if (lineId == item.lineId) {
                            money = item.balance;
                        }
                    })
                }
            }
            return money;
        },
        // 关闭弹框
        closeJumpDialog() {
            this.showJumpDialog = false;
        },
        // 跳转游戏
        jumpGame() {
            // 判断转入平台是不是中心钱包
            if (this.tempTurnIn.lineId == 0) {

            } else {
                //判断是跳转自己平台还是跳转三方平台
                if (this.tempTurnIn.thirdLobby) {
                    this.enterGame()
                } else {
                    this.goPage('/electronic', {gameLine: this.tempTurnIn.lineId})
                    this.$store.commit('set_curMenu', '/electronic',);
                }
            }
        },
        //进入游戏
        enterGame() {
            let that = this;
            // 保存当前游戏
            this.setCurrtGame(this.tempTurnIn);
            // 判断是不是小金体育,如果是采用ifream嵌入方式打开; 小金体育: gamelineId :12
            if (this.tempTurnIn.lineId == 12) {
                this.enterIfreamGame()
                return;
            }
            let wintab = window.open("", "_blank");
            let obj = {
                gameLineId: this.tempTurnIn.lineId,
                index: 'player'
            }
            // 1. 查询游戏对象 2. 进入游戏
            this.$store.dispatch("gameStore/enterGameAction", obj).then(res => {
                if (res && res.success) {
                    if (res.data.status == '0' || res.data.status == 0) {
                        wintab.location.href = res.data.url;
                        that.showJumpDialog = false;
                    } else {
                        wintab.close();
                    }
                } else {
                    wintab.close();
                }
            });
        },
        goPage(path, param) {
            this.$router.push({path: path, query: param})
        },
        //一键转入
        transferAllSubmit(item) {
            let that = this;
            this.tempTurnIn = item;
            this.transferAllSubmitFun(item.lineId).then(function (res) {
                if (res && res.success) {
                    that.showJumpDialog = true;
                } else {

                }
            })
        },
        // ifream跳转的链接-正式
        enterIfreamGame() {
            let that = this;
            let url = "";
            // 如果域名是二级域名
            if (window.location.hostname.indexOf("www") >= 0) {
                url = window.location.protocol + "//" + window.location.hostname;
            } else {
                url = window.location.protocol + "//www." + window.location.hostname;
            }

            //let wintab = window.open(`${url}/#/sports`, "_blank");
            let wintab = window.open("", "_blank");
            let obj = {
                gameLineId: this.tempTurnIn.lineId,
                index: 'player'
            }
            // 1. 查询游戏对象 2. 进入游戏
            this.$store.dispatch("gameStore/enterGameAction", obj).then(res => {
                if (res && res.success) {
                    that.showJumpDialog = false;
                    if (res.data.status == '0' || res.data.status == 0) {
                        //wintab.location.href = `${url}/#/sports?game=${res.data.url}`;
                        wintab.location.href = res.data.url;
                        //关闭弹框
                        that.$store.commit('gameStore/set_showPickPlay', false);
                    } else {
                        wintab.close();
                        that.$store.commit('gameStore/set_showPickPlay', false);
                    }
                } else {
                    wintab.close();
                    that.$store.commit('gameStore/set_showPickPlay', false);
                }
            });
        },
        // ifream跳转的链接-试玩
        enterIfreamFreeGame() {
            let that = this;
            let url = "";
            // 如果域名是二级域名
            if (window.location.hostname.indexOf("www") >= 0) {
                url = window.location.protocol + "//" + window.location.hostname;
            } else {
                url = window.location.protocol + "//www." + window.location.hostname;
            }
            let wintab = window.open("", "_blank");
            let obj = {
                gameLineId: this.tempTurnIn.lineId,
                index: 'player'
            }
            // 1. 查询游戏对象 2. 进入游戏
            this.$store.dispatch("gameStore/enterGameAction", obj).then(res => {
                if (res && res.success) {
                    if (res.data.status == '0' || res.data.status == 0) {
                        //wintab.location.href = `${url}/#/sports?game=${res.data.freeUrl}`;
                        wintab.location.href = res.data.freeUrl;
                        //关闭弹框
                        that.$store.commit('gameStore/set_showPickPlay', false);
                    } else {
                        wintab.close();
                        that.$store.commit('gameStore/set_showPickPlay', false);
                    }
                } else {
                    wintab.close();
                    that.$store.commit('gameStore/set_showPickPlay', false);
                }
            });
        },
    }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template1/themes/mixin.styl'
@import "~@styl/template1/common/fun.styl"

.draw
    .dialog-flow
        width: 100%;
        height: 100%;
        bg_color(bg44)
        opacity: .1;
        position: fixed;
        top: 0;
        left: 0;
        z-index 2;

    .dialog-con
        .jump-con
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

    .info
        .info-con
            margin 0 auto
            padding 20px 10px 24px 10px
            border-radius: 0px 0px 10px 10px;
            bg_color(bg04)

            .tip
                font-size: 14px;
                font_color(fc05);
                margin-bottom 20px

            .form
                display flex
                flex-direction row
                flex-wrap nowrap
                justify-content space-between

                .form-item
                    flex 1
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

                    &:not(:last-child)
                        margin-right 20px

                    .lable
                        flex none
                        width 82px
                        text-align right
                        font-size: 16px;
                        font_color(fc05);
                        padding-left 10px

                    &.dialog-con
                        position relative

                        .common-dialog
                            z-index: 2;
                            position absolute
                            top 66px
                            left 0px
                            min-height 320px
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

                            .line-list
                                //height 320px
                                //overflow auto
                                width: 622px;

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
                                    padding 20px

                                    li
                                        flex none
                                        align-self center
                                        margin-right 10px
                                        padding 2px 4px
                                        cursor pointer
                                        width: 100px;
                                        height: 60px;
                                        //bg_color(bg15)
                                        border-radius: 5px;
                                        margin-top 10px
                                        border_all(1px, solid, border24)
                                        display: flex;
                                        flex-direction: column;
                                        justify-content: center;
                                        align-items: center;

                                        &.active
                                            bg_color(bg15)

                                        &:hover
                                            bg_color(bg15)

                                        .cn
                                            font-size 14px
                                            font_color(fc024)

                                        &:last-child {
                                            margin-right: auto;
                                        }

                    .all
                        cursor pointer
                        display inline-block
                        position absolute
                        right 20px
                        font_color(fc027)
                        font-size 14px

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

        .layout-con
            margin-bottom 20px

            .com-title
                width 100%
                height: 70px;
                line-height 70px
                padding-left 25px
                font-size: 20px;
                letter-spacing: 0px;
                font_color(fc06);
                bg_color(bg04);
                border-radius: 10px 10px 0px 0px;
                border_com(1px, solid, border08, bottom)
                position relative

                .colls
                    width: 50px;
                    height: 14px;
                    font-size: 14px;
                    font_color(fc07);
                    float right
                    margin-right 30px
                    cursor pointer

            .line
                bg_color(bg04)
                border-radius: 10px;
                margin-top 20px
                position relative

                .line-con
                    padding 2px 10px 20px
                    display flex
                    flex-wrap wrap
                    justify-content flex-wrap
                    align-items center

                    &.open
                        height 120px
                        overflow hidden

                    .item
                        margin-left 15px
                        margin-top 10px
                        width: 23%;
                        height: 100px;
                        border-radius: 10px;
                        border_all(1px, solid, border12)

                        .line-top
                            display flex
                            height 40%
                            padding 10px 18px 2px

                            .line-name
                                flex 1
                                font-size: 18px;
                                font_color(fc07);

                            .line-btn
                                text-align center
                                width: 68px;
                                height: 24px;
                                line-height 24px
                                font_color(fc023)
                                border-radius: 12px;
                                border_all(1px, solid, border13)
                                flex 1
                                cursor pointer

                                &.closed
                                    font_color(fc01)
                                    border_all(1px, solid, border04)
                                    bg_color(bg17)
                                    opacity .6

                        .line-center
                            .game
                                font-size 14px
                                padding-left 20px
                                font_color(fc024)

                        .line-num

                            padding 0px 20px 10px
                            font-size: 24px;
                            font_color(fc06);

                            .money-icon
                                font-size 18px

                .more
                    height: 30px;
                    line-height 30px
                    text-align center
                    font-size: 14px;
                    letter-spacing: 0px;
                    font_color(fc025)
                    position relative
                    cursor pointer

                    .fh
                        margin-left 10px

                        &:before
                            content ''
                            display: inline-block;
                            border_com(1px, solid, border14, top)
                            border_com(1px, solid, border14, right)
                            width: 8px;
                            height: 8px;
                            transform: rotate(135deg);
                            position absolute
                            top 10px

                        &:after
                            content ''
                            display: inline-block;
                            border_com(1px, solid, border14, top)
                            border_com(1px, solid, border14, right)
                            width: 8px;
                            height: 8px;
                            transform: rotate(135deg);
                            position absolute
                            top 6px

                        &.close
                            &:before
                                top 14px
                                transform: rotate(-45deg);

                            &:after
                                top 10px
                                transform: rotate(-45deg);
</style>

