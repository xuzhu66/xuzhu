<template lang="pug">
    div
        // 进入游戏弹框
        .e-pickPlay(v-if="showPickPlay" , :class="closeFlag?'close-animate':''")
            .game-dialog-con
                .game-con
                    .game
                        .item
                            p 当前游戏:
                            p
                                // {{currtGame.gameSeriesName?currtGame.gameSeriesName+'_':''}}
                                span {{currtGame.chName?currtGame.chName:currtGame.name}}
                                span.green(v-if='currtGame.pcfreePlayFlag') 可试玩
                                span.red(v-else) 不可试玩
                        .item(v-if="userId != ''")
                            p 中心钱包金额:
                            p ¥ {{centerWallet | format}}
                        .item(v-if="userId != ''")
                            p 当前游戏钱包余额:
                            p ¥ {{ currtLineWallet | format}}
                        .item-btn(v-if="userId != ''")
                            .common-btn.backall.hidden(@click="turnInAllwalletFun") 一键回收
                            .common-btn.ok(@click="transferAllSubmitFun(currtGame.gameLineId)") 一键转入

                .btn-con
                    .btn-list
                        .item(v-show="currtGame.pcfreePlayFlag")
                            .common-btn.free(@click="enterFreeGameFun") 免费试玩
                            .free-title *免费试玩金额不计入真实账户
                        .item(v-if="userId")
                            .common-btn.enter.ok(v-if="userId != ''" @click="enterGameFun") 前往当前游戏
                        .item(v-if="!userId")
                            .common-btn.login.ok(v-if="userId == ''" @click="jumpLoginPageFun") 前往登录

            p.ep-close(@click="closeGameDialogFun")
                svg-icon(icon-class='close')

        .bg(v-if="showPickPlay || showLogin")

</template>

<script>
import {mapActions, mapState} from "vuex";
import {formatAmount, thousandBitForma, formatDate, numHidf3l4} from '@m/utils' // 工具类
export default {
    name: "Game.view",
    data() {
        return {
            gameLineMoney: '',//线路金额
            closeFlag:false,//关闭状态
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state['centerStore'].userInfo,
            wallet: state => state['centerStore'].wallet,
            currtGame: state => state['gameStore'].currtGame,
            centerWallet: state => state.centerWallet,// 中心钱包
            currtLineWallet: state => state.currtLineWallet,// 当前线路钱包
        }),
        isShowLoad: { // 加载弹窗是否显示
            get() {
                return this.$store.state.isShowLoad;
            },
            set(item) {
                return item
            }
        },
        userId: { // 用户ID
            get() {
                return this.$store.state.userId;
            },
            set(item) {
                return item
            }
        },
        showLogin: { // 登入是否显示
            get() {
                return this.$store.state.showLogin;
            },
            set(item) {
                return item
            }
        },
        showPickPlay: { // 是否显示弹出框
            get() {
                return this.$store.state.gameStore.showPickPlay;
            },
            set(item) {
                return item
            }
        },
        curList: { // 是否显示弹出框
            get() {
                return this.$store.state.gameStore.curList;
            },
            set(item) {
                return item
            }
        }
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
    mounted() {

    },
    beforeUpdate() {
        if (this.userId != '' && this.showPickPlay) {
            // 中心钱包
            this.getHomePerInfoAction();
            // 线路钱包
            this.getLineBalanceAction(this.currtGame.gameLineId);
        }
    },
    updated() {
        if (this.currtGame && this.userId != '' && this.wallet.assetss) {
            this.getMoneyByGameLine(this.currtGame.gameLineId)
        }
    },
    methods: {
        ...mapActions({
            // 一键回收
            turnInAllwalletFun(dispatch, param) {
                return dispatch(`centerStore/turnInAllwalletAction`, param);
            },
            // 一键转入
            transferAllSubmitFun(dispatch, id) {
                return dispatch(`centerStore/transferAllSubmitAction`, {tochangeIntoLineId: id});
            },
            //获取用户简易信息-中心钱包
            getHomePerInfoAction(dispatch, id) {
                return dispatch(`getHomePerInfo`);
            },
            // 线路钱包
            getLineBalanceAction(dispatch, id) {
                return dispatch(`getLineBalanceAction`, {lineId: id});
            },
            // 关闭游戏弹框
            closeGameDialogFun(dispatch) {
                this.closeFlag = true;
                setTimeout(()=>{
                    this.closeFlag = false;
                    return dispatch('gameStore/closeGameDialogAction');
                },500)
            },
            // 跳转登录页面
            jumpLoginPageFun(dispatch) {
                return dispatch('gameStore/jumpLoginPageAction');
            },

        }),

        //根据游戏线路获取线路金额
        getMoneyByGameLine(lineId) {
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
            this.gameLineMoney = money;
            return money;
        },
        enterFreeGameFun() {
            let that = this;
            let wintab = window.open("", "_blank");
            // 1. 查询游戏对象 2. 进入游戏
            this.$store.dispatch("gameStore/enterGameAction", this.currtGame).then(res => {
                if (res && res.success) {
                    if (res.data.status == '0' || res.data.status == 0) {
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
        //进入游戏
        enterGameFun() {
            let that = this;
            // 判断是不是小金体育,如果是采用ifream嵌入方式打开; 小金体育: gamelineId :12
            if (this.currtGame.gameLineId == 12) {
                this.enterIfreamGame()
                return;
            }
            let wintab = window.open("", "_blank");
            // 1. 查询游戏对象 2. 进入游戏
            this.$store.dispatch("gameStore/enterGameAction", this.currtGame).then(res => {
                if (res && res.success) {
                    if (res.data.status == '0' || res.data.status == 0) {
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

            // let wintab = window.open(`${url}/#/sports`, "_blank");
            let wintab = window.open("", "_blank");
            // 1. 查询游戏对象 2. 进入游戏
            this.$store.dispatch("gameStore/enterGameAction", this.currtGame).then(res => {
                if (res && res.success) {
                    if (res.data.status == '0' || res.data.status == 0) {
                        // wintab.location.href = `${url}/#/sports?game=${res.data.url}`;
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
            // let wintab = window.open(`${url}/#/sports`, "_blank");
            let wintab = window.open("", "_blank");
            // 1. 查询游戏对象 2. 进入游戏
            this.$store.dispatch("gameStore/enterGameAction", this.currtGame).then(res => {
                if (res && res.success) {
                    if (res.data.status == '0' || res.data.status == 0) {
                        // wintab.location.href = `${url}/#/sports?game=${res.data.freeUrl}`;
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

    },
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template2/themes/mixin.styl'
@import "~@styl/template2/common/fun.styl"
.e-pickPlay
    width 750px
    //height 350px
    //min-height 350px
    background-color transparent
    border-radius 10px
    position fixed
    left 50%
    top 50%
    transform: translate(-50%, -60%)
    z-index 11
    animate__dialogFadeInDownBig()
    &.close-animate
        animate__dialogFadeOutDownBig()

    .game-dialog-con
        min-height 350px
        width 100%
        height 100%
        position relative

        .game-con
            width 660px
            margin 0 auto
            bg_color(bg55)
            border-radius 10px
            min-height 210px
            position absolute
            left 50%
            transform translateX(-50%)
            bottom 190px
            padding 20px 100px 60px
            background-image url("~@img/template2/home/game-bg.png")

            .game
                .item
                    display flex
                    flex-direction row

                    p
                        flex 1
                        font-size 18px
                        line-height 40px

                        .green
                            font_color(fc01)
                            font-size 14px
                            bg_color(bg33)
                            padding 2px 4px
                            border-radius 2px
                            margin-left 10px
                            font-weight normal
                            letter-spacing 2px

                        .red
                            font_color(fc01)
                            font-size 14px
                            bg_color(bg34)
                            padding 2px 4px
                            border-radius 2px
                            margin-left 10px
                            font-weight normal
                            letter-spacing 2px

                        &:first-child
                            font_color(fc089)
                            text-align left

                        &:last-child
                            font_color(fc090)
                            font-weight 600
                            text-align right

                .item-btn
                    display flex
                    flex-direction row
                    justify-content space-between
                    margin-top 20px

                    .common-btn
                        width 216px
                        height 60px
                        line-height: 60px;


        .btn-con
            border-radius 10px
            position absolute
            bottom 0px
            width 100%
            height 270px
            background url("~@img/template2/home/game-bottom.png") center / contain no-repeat
            padding-top 50px

            .btn-list
                padding 18px 20px 24px
                width 700px
                min-height 200px
                margin 0 auto
                border-bottom-left-radius 10px
                border-bottom-right-radius 10px
                display flex
                flex-direction column
                justify-content center
                align-items center

                .free-title
                    font_color(fc091)
                    font-size 14px
                    margin-bottom 20px

                .common-btn
                    width 450px
                    height 60px
                    line-height 60px

                    &.free
                        font_color(fc092)
                        width 450px
                        height 60px
                        border 1px solid #ecb350

    .ep-close
        width: 40px
        height: 40px
        position absolute
        bottom -60px
        cursor pointer
        left 50%
        transform translateX(-50%)
        transition all .3s ease-in-out
        &:hover
            transform translateX(-50%) rotate(180deg)

        svg
            border-radius 50%
            border_all(2px, solid, border01)
            font_color(fc01)
            padding 8px
            width 40px
            height 40px
</style>
