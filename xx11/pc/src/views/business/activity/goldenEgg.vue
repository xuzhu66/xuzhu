<template lang="pug">
    .egg-page
        .egg-gift-con
            .title 奖品列表
            .gift-con
                #gift-flow(:class="currtPx2==0?'start':''")
                    .item(v-for="item in goldenEggDetail.data",v-if="item.amount >0")
                        .gift(:style="`background-image:url(${item.url})`")
                        .text 彩金{{item.amount}}元
                    .item(v-for="item in goldenEggDetail.data",v-if="item.amount >0")
                        .gift(:style="`background-image:url(${item.url})`")
                        .text 彩金{{item.amount}}元




        ul.egg-con.hammer-auto
            li(@click="startFun(1)" :class="currtEgg==1?'active':''")
                .hammer(:class="eggClicking?'down':''")
            li(@click="startFun(2)" :class="currtEgg==2?'active':''")
                .hammer(:class="eggClicking?'down':''")
            li(@click="startFun(3)" :class="currtEgg==3?'active':''")
                .hammer(:class="eggClicking?'down':''")



        .close-icon(@click="closeFun")
        .gift-list
            ul#gift-list-ul
                li(v-for="item in msgList")
                    span {{item.name}}
                    span 在砸金蛋赢大奖中
                    span 抽中{{item.money?item.money:8.8}}彩金
                li(v-for="item in msgList")
                    span {{item.name}}
                    span 在砸金蛋赢大奖中
                    span 抽中{{item.money?item.money:8.8}}彩金

        .msg
            span 您剩余
            span {{goldenEggNum}}次
            span 砸金蛋机会

        .rule(@click="openDiscountDialog")

</template>
<script>

import {randomRange, randomCoding} from '@js'
import {mapActions, mapState} from "vuex";

export default {
    name: "goldenEgg",
    data() {
        return {
            currtGift: '', // 当前选中得礼品
            msgList: [],// 消息记录
            orderTime: 0,//剩余抽奖次数
            currtPx: 1,// 当前位移象数
            currtPx2: 0,// 当前位移象数
            btnFlag: true,//是否可以点击
            eggClicking:false,// 砸蛋动画
            currtEgg:'',//砸得蛋
            showPrizeModel:false,// 显示中奖弹框
            giftListEl:'',//
            giftFlowEl:'',//

        }
    },
    computed: {
        ...mapState({
            userInfo: state => state['centerStore'].userInfo,
            goldenEggConfig: state => state['activityStore'].goldenEggConfig,//砸金蛋配置
            goldenEggDetail: state => state['activityStore'].goldenEggDetail,//砸金蛋详情
            goldenEggNum: state => state['activityStore'].goldenEggNum,//砸金蛋剩余抽奖次数
        }),
    },
    mounted() {
        // 2：大转盘，3：水果机 ,4：砸金蛋
        this.getActivityInfoAction({type:4}).then(res=>{
            this.giftMsgFun()
        })
        // 获取中奖对象
        this.giftListEl = document.getElementById("gift-list-ul");
        this.giftFlowEl = document.getElementById("gift-flow");
        // 开始礼品列表得轮播
        setInterval(this.giftFlowAnimate, 1500)

    },
    methods: {
        ...mapActions({
            // 活动详情-- id:活动类型id
            discountDetailFun(dispatch, id) {
                return dispatch("homeStore/discountDetailAction", {id: id});
            },
            // 文章详情-- id:文章id
            articleViweAction(dispatch, id) {
                return dispatch("homeStore/articleViweAction", {id: id});
            },
            // 活动详情-- 大转盘/水果机/砸金蛋
            getActivityInfoAction(dispatch, data) {
                return dispatch("activityStore/getActivityInfoAction", data);
            },
            // 活动抽奖-- 大转盘/水果机/砸金蛋  2：大转盘，3：水果机 ,4：砸金蛋
            getActivityAction(dispatch, data) {
                return dispatch("activityStore/getActivityAction", data);
            },

        }),
        randomCoding: randomCoding,
        // 开蛋
        kickEgg(num){
            // 砸蛋动画
            this.eggClicking = true;
            setTimeout(() => {
                this.currtEgg = num;
                this.eggClicking = false;
            }, 500);
            // 打开中奖弹窗
            setTimeout(() => {
                this.showPrizeModel = true;
                // 提示语
                this.$emit('on-tip-msg', this.giftObj,"goldenEgg");
            }, 900);
            // 复原鸡蛋
            setTimeout(() => {
                this.currtEgg = "";
            }, 1500);

        },
        //1. 点击抽奖
        startFun(num) {
            if (this.btnFlag && this.goldenEggNum>0) {
                this.btnFlag = false;
                this.getActivityAction({type:4}).then(res=>{
                    if (res && res.success) {
                        this.btnFlag = true;
                        // 判断活动是否结束 {"code":200,"success":true,"data":{"id":"","status":3},"msg":"操作成功"}
                        // 1:中奖 2: 未中奖 3:活动结束 4: 次数用尽 5:超过上限金额 6:不在vip活动范围内 7:活动未开始
                        if(res.data.status >= 3){
                            this.$emit('on-tip-msg', {status:res.data.status},"goldenEgg");
                            return;
                        }
                        // 获取id 对应得位置
                        this.goldenEggDetail.data.forEach((item,index)=>{
                            // 中奖位置
                            if(item.id == res.data.id){
                                // 封装中奖金额
                                res.data.money = item.amount;
                            }
                        })
                        this.giftObj = res.data;
                        // 剩余点击次数
                        if(this.goldenEggNum >0){
                            setTimeout(()=>{
                                this.btnFlag = true;
                            },2000)
                        }
                        this.kickEgg(num);
                    } else {
                        this.btnFlag = true;
                    }
                })
            }else{
                // 提示语
                if(this.goldenEggNum == 0){
                    this.$emit('on-tip-msg', {status:4},"goldenEgg");
                }
            }
        },
        // 奖品列表
        giftMsgFun() {
            for (let i = 0; i <= 30; i++) {
                this.msgList.push({
                    name: this.randomRange(6, 9),
                    // money: this.randomCoding()
                    money:this.goldenEggDetail.data[Math.floor(Math.random() * 7)].amount
                });
            }
            setInterval(this.giftListAnimate, 45)
        },
        // 列表动画
        giftListAnimate() {
            if (this.currtPx >= this.msgList.length * 320) {
                this.currtPx = 0;
            } else {
                this.currtPx = this.currtPx + 1;
            }
            this.giftListEl.style.transform = "translateX(-" + this.currtPx + "px)";
        },
        // 列表动画
        giftFlowAnimate() {
            if (this.currtPx2 >= 8 * 80) {
                this.currtPx2 = 0;
            } else {
                this.currtPx2 = this.currtPx2 + 80;
            }
            this.giftFlowEl.style.transform = "translateX(-" + this.currtPx2 + "px)";
        },
        randomRange(min, max) {
            var returnStr = "",
                range = (max ? Math.round(Math.random() * (max - min)) + min : min),
                arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
            for (var i = 0; i < range; i++) {
                var index = Math.round(Math.random() * (arr.length - 1));
                returnStr += arr[index];
            }
            return returnStr.substr(0, 2) + "****" + returnStr.substr(-2);
        },
        // 打开活动弹框--活动详情
        openDiscountDialog(id) {
            window.win.myloading.show();
            this.articleViweAction(this.goldenEggDetail.articleId).then(res => {
                window.win.myloading.hidden();
                if (res && res.success) {
                    this.$myDialog({title: '活动详情', con: res.data.content, diatxtClass: true}, (res) => {
                    });
                }
            })
        },
        // 关闭事件
        closeFun() {
            this.$emit("on-close");
        },


    },
}
</script>
<style lang="stylus" scoped>
@import '~@styl/template1/themes/mixin.styl'
@import "~@styl/template1/common/fun.styl"
@keyframes rainbow {
    0% {
        transform: rotate(35deg) translate(3px,-10px)
    }
    100% {
        transform:  rotate(-5deg) translate(-12px, 12px)
    }
}
@keyframes rainbowdown {
    0% {
        transform: rotate(35deg) translate(9px,-30px)
    }
    100% {
        transform:  rotate(-18deg) translate(-60px, 60px)
    }
}
.egg-page
    background: url('~@img/comimages/activity/goldenEgg/egg-bg.png') top 0 left 0 no-repeat
    width 1089px
    height 945px
    top 50%
    left 50%
    transform translate(-50%, -50%)
    position relative

    .egg-con
        list-style none
        padding 0
        margin 0
        position relative
        li
            background: url('~@img/comimages/activity/goldenEgg/egg.png') center / contain no-repeat;
            width 98px
            height 121px
            position absolute
            top: 490px;
            cursor pointer
            &.active
                background: url('~@img/comimages/activity/goldenEgg/egg-success.png') center / contain no-repeat;
                top 510px
                &:hover
                    .hammer
                        display: none;
            &:nth-child(1)
                left: 361px;

            &:nth-child(2)
                left: 495px;

            &:nth-child(3)
                left: 630px;

            .hammer
                background: url('~@img/comimages/activity/goldenEgg/button.png') center / contain no-repeat;
                width 58px
                height 58px
                display: none;
                position: absolute;
                animation: .6s rainbow linear infinite;
                animation-direction: alternate;
                top -36px
                right -35px
                &.down
                    animation: .5s rainbowdown forwards;
            &:hover
                .hammer
                    display: block;

    .close-icon
        background: url('~@img/comimages/activity/goldenEgg/close.png') center / contain no-repeat;
        width 34px
        height 34px
        position absolute
        top: 200px;
        right: 60px;
        transition all .3s ease-in-out
        cursor pointer

        &:hover
            transform rotate(180deg)

    .rule
        background: url('~@img/comimages/activity/goldenEgg/rule.png') center / contain no-repeat;
        width 116px
        height 75px
        position absolute
        top: 327px;
        right: 192px;
        transition all .3s ease
        cursor pointer

        &:hover
            background: url('~@img/comimages/activity/goldenEgg/rule-active.png') center / contain no-repeat;

    .msg
        position absolute
        bottom 230px
        left 50%
        transform translateX(-50%)
        font-size 14px
        letter-spacing 2px
        color #f3ed5c

        span:nth-child(2)
            color #b70000
    .egg-gift-con
        position absolute
        width 370px
        height 90px
        top 340px
        left 360px
        .title
            font-size 14px
            color #fbdb8d
            writing-mode vertical-lr
            position relative
            margin-top 14px
            &:before
                before()
                width 2px
                background-color #fbdb8d
                border-radius 2px
                top 0px
                left 100%
        .gift-con
            position absolute
            top 10px
            left 30px
            width 320px
            overflow hidden
            #gift-flow
                flexcon()
                justify-content flex-start
                transition all .3s ease-in-out
                &.start
                    transition none
                .item
                    flex none
                    width 80px
                    height 80px
                    .gift
                        //background: url('~@img/comimages/activity/goldenEgg/smil.png') center / contain no-repeat;
                        background-position center
                        background-size contain
                        background-repeat no-repeat
                        width 44px
                        height 44px
                        margin 0 auto

                    .text
                        text-align center
                        color #fffcd3
                        font-size 12px
                        margin-top 4px

    .gift-list
        width: 320px;
        height: 34px;
        position: absolute;
        top: 286px;
        left: 381px;
        overflow: hidden;

        ul
            list-style none
            padding 0
            margin 0
            flexcon()
            flex-direction row
            flex-wrap nowrap
            justify-content center
            align-items center
            //transform: translateX(-10290px);
            //transition all 100s linear

            li
                flex none
                flexcon()
                width: 320px;
                height 30px
                line-height 30px
                text-align center

                span
                    flex none
                    font-size 12px

                    &:nth-child(1)
                        color #ffffff

                    &:nth-child(2)
                        color #fff5cb
                        margin 0 12px

                    &:nth-child(3)
                        color #efee45

</style>
