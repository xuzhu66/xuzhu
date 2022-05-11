<template lang="pug">
    .activity-dialog(v-if="showDialog")
        // 红包雨
        redPackRain(v-if="redRainFlag" ref="rain" :lifeTime="redRainAllTimes" @timeoutCallback="timeoutCallback",@on-tip-msg="tipMsgDialog")
        // 红包雨未开始弹框
        redPackGiftDialog(v-if="redRainGiftFlag",@on-close="closeActivity")
        // 大转盘
        turntable(v-if="turntableFlag",@on-close="closeActivity",@on-tip-msg="tipMsgDialog")
        // 水果机
        fruitMachine(v-if="fruitMachineFlag",@on-close="closeActivity" ,@on-tip-msg="tipMsgDialog")
        // 砸金蛋
        goldenEgg(v-if="goldenEggFlag",@on-close="closeActivity" ,@on-tip-msg="tipMsgDialog")
        // 签到
        signin(v-if="signinFlag",@on-close="closeActivity")


        // 中奖提示框
        .msg-dialog(v-if="showGiftPage")
            .msg-flow
                .close(@click="closeMsgDialog")
                // 红包雨
                template(v-if="currtActivityPage == 'redRain'")
                    .msg(v-if="giftObj.status == 1")
                        p 恭喜发财 大吉大利
                        p 获得彩金
                        p
                            span ¥
                            span {{giftObj.amount}}
                    .msg(v-else-if="giftObj.status == 2")
                        p 谢谢惠顾
                        p 请再接再厉!
                    .msg(v-else-if="giftObj.status == 3")
                        p 本次活动已结束
                        p 欢迎下次再来
                    .msg(v-else-if="giftObj.status == 4")
                        p 手太慢了，红包被抢完啦！
                        p 欢迎下次再来
                    .msg(v-else-if="giftObj.status == 5")
                        p 手太慢了，红包被抢完啦
                        p 欢迎下次再来
                    .msg(v-else-if="giftObj.status == 6")
                        p 不在vip等级范围
                        p 请查看活动规则
                    .msg(v-else)
                        p 谢谢惠顾
                        p 请再接再厉!
                    .submit-btn(v-if="giftObj.status<=2",@click="closeMsgDialog") 再来一次

                // 大转盘 砸金蛋 水果机
                template(v-else)
                    .msg(v-if="giftObj.status == 1")
                        template(v-if="giftObj.money>0")
                            p 恭喜您,中奖啦!
                            p 获得彩金
                            p
                                span ¥
                                span {{giftObj.money}}
                        template(v-else)
                            p 谢谢惠顾！
                            p 很遗憾，此次未能中奖
                    .msg(v-else-if="giftObj.status == 2")
                        p 谢谢惠顾！
                        p 很遗憾，此次未能中奖
                    .msg(v-else-if="giftObj.status == 3")
                        p 感谢您的参与！
                        p 本次活动已结束,欢迎下次再来
                    .msg(v-else-if="giftObj.status == 4")
                        //p 感谢您的参与！
                        //p 活动抽奖次数已用尽
                        p 暂无抽奖次数
                        p 参与活动即可获得抽奖机会！
                    .msg(v-else)
                        p 谢谢惠顾！
                        p 很遗憾，此次未能中奖
                    .submit-btn(v-if="giftObj.status<=2 && giftObj.count >0",@click="closeMsgDialog") 再来一次
                    .tip(v-if="giftObj.status <= 2") 您还有{{giftObj.count?giftObj.count:0}}次抽奖机会


</template>

<script>
import activityStore from "@/store/comstore/activity/activityStore";
import store from '@/store/Store';
import {mapActions, mapMutations, mapState} from "vuex";
import comDialog from '@pon/template1/comDialog'
import redPackRain from '@/views/business/activity/rain/redPackRain' // 红包雨
import redPackGiftDialog from '@/views/business/activity/rain/redPackGiftDialog' // 红包雨未开始

import turntable from '@/views/business/activity/turntable' // 大转盘
import fruitMachine from '@/views/business/activity/fruitMachine' // 水果机
import goldenEgg from '@/views/business/activity/goldenEgg' // 砸金蛋
import signin from '@/views/business/activity/signin' // 签到

export default {
    name: "activityDialog",
    components: {
        comDialog,
        redPackRain,
        turntable,
        fruitMachine,
        goldenEgg,
        signin,
        redPackGiftDialog
    },
    data() {
        return {
            showGiftPage: false,// 显示提示信息
            giftObj: '',// 中奖礼品对象
            currtActivityPage: '',//当前活动
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state['centerStore'].userInfo,
            showDialog: state => state['activityStore'].showDialog,//显示活动弹框
            redRainFlag: state => state['activityStore'].redRainFlag,//红包雨活动
            redRainGiftFlag: state => state['activityStore'].redRainGiftFlag,//红包雨活动--未中奖
            turntableFlag: state => state['activityStore'].turntableFlag,//大转盘
            fruitMachineFlag: state => state['activityStore'].fruitMachineFlag,//水果机
            goldenEggFlag: state => state['activityStore'].goldenEggFlag,//砸金蛋
            signinFlag: state => state['activityStore'].signinFlag,//签到
            redRainAllTimes: state => state['activityStore'].redRainAllTimes,//红包雨持续时间
            showGift: state => state['activityStore'].showGift,//中奖提示框

        }),
    },

    created() {
        // 动态store
        if (!store.state["activityStore"]) {
            activityStore.install(this);
        }
    },
    mounted() {
        this.initPage()
    },
    beforeDestroy() {

    },
    methods: {
        ...mapMutations({
            setDialogStatus(commit, param) {
                return commit('activityStore/SET_SHOW_DIALOG', param);
            }
        }),
        ...mapActions({
            // 关闭活动
            closeActivityAction(dispatch, param) {
                return dispatch(`activityStore/closeActivityAction`, param);
            },
            // 开启活动
            openActivityAction(dispatch, param) {
                return dispatch(`activityStore/openActivityAction`, param);
            },
        }),
        initPage() {
            this.showGiftPage = false;// 显示提示信息
            this.giftObj = '';// 中奖礼品对象
            this.currtActivityPage = '';//当前活动
        },
        // 关闭弹框
        closeDialog() {
            //this.showDialog = false;
        },

        goPage(path, param) {
            this.$router.push({path: path, query: param})
        },
        // 开启红包雨
        openRedRain() {
            this.$refs.rain.start()
        },
        // 关闭红包雨
        closeRedRain() {
            this.$refs.rain.clear()
            this.setDialogStatus(false);
        },
        // 时间结束
        timeoutCallback() {
            this.closeRedRain();
            this.resetData();
        },
        // 关闭活动
        closeActivity() {
            this.closeActivityAction();
            this.resetData();
        },
        // 提示弹框
        tipMsgDialog(data, currt) {
            this.giftObj = data;
            this.showGiftPage = true;
            this.currtActivityPage = currt;
        },
        // 关闭提示弹框
        closeMsgDialog() {
            this.showGiftPage = false;

            // 关闭红包雨
            if (this.currtActivityPage == "redRain" && this.giftObj.status == 3) {
                this.closeRedRain();
                this.closeActivityAction();
            }
        },
        resetData() {
            this.showGiftPage = false;// 显示提示信息
            this.giftObj = '';// 中奖礼品对象
            this.currtActivityPage = '';//当前活动
        }


    }

}
</script>


<style lang="stylus" scoped>
@import '~@/assets/styles/template1/themes/mixin.styl'
@import "~@styl/template1/common/fun.styl"

.activity-dialog
    width: 100%;
    height: 100%;
    background-color rgba(0, 0, 0, .5)
    position: fixed;
    top: 0;
    left: 0;
    z-index 5;

    .dialog-con
        .user-con
            min-height 200px
            min-width 500px

    .msg-dialog
        width: 100%;
        height: 100%;
        background-color rgba(0, 0, 0, .5)
        position: fixed;
        top: 0;
        left: 0;
        z-index 6;

        .msg-flow
            position absolute
            background: url('~@img/comimages/activity/common/pack-bg.png') center / contain no-repeat;
            width 300px
            height 400px
            left 50%
            top 50%
            transform translate(-50%, -50%)
            transition all .2s ease-in-out
            fadeIn()

            .close
                background: url('~@img/comimages/activity/common/close.png') center / contain no-repeat;
                width 26px
                height 26px
                position absolute
                top 0px
                right -30px
                transition all .3s ease-in-out
                cursor pointer

                &:hover
                    transform rotate(180deg)

            .msg
                color #fff
                font-size 18px
                text-align center
                position relative

                p
                    width 100%
                    position absolute
                    left 50%
                    transform translateX(-50%)

                    &:nth-child(1)
                        top 120px

                    &:nth-child(2)
                        top 180px
                        color #fbefc5

                    &:nth-child(3)
                        top 210px
                        color #fbefc5

                        span:nth-child(2)
                            font-size 36px

            .submit-btn
                background: url('~@img/comimages/activity/common/btn.png') center / contain no-repeat;
                width 170px
                height 45px
                line-height 45px
                text-align center
                position absolute
                left 50%
                bottom 80px
                transform translateX(-50%)
                color #4f3900
                font-size 14px
                font-weight 500
                letter-spacing 2px
                cursor pointer

            .tip
                position absolute
                bottom 56px
                text-align center
                width 100%
                color #fbefc5


</style>
