<template lang="pug">
    .turntable-page
        .button(@click='startFun')

        ul.fruit-con#turntable
            li
                .text 剩余抽奖次数 {{fruitMachineNum}}

            li(v-for="(item,index) in fruitMachineDetail.data",:class="currtGift===index?'active':''")
                .gift-img(:style="`background-image:url(${item.url})`")
                .text(v-if="item.amount >0") 彩金{{item.amount}}元
                .text(v-else) 谢谢惠顾
        .close-icon(@click="closeFun")
        .gift-list
            ul#gift-list-ul
                li(v-for="item in msgList")
                    span {{item.name}}
                    span 在幸运水果机中
                    span 抽中{{item.money?item.money:8.8}}彩金
                li(v-for="item in msgList")
                    span {{item.name}}
                    span 在幸运大转盘中
                    span 抽中{{item.money?item.money:8.8}}彩金

        .activity-detail(@click="openDiscountDialog")

</template>
<script>

import {randomRange, randomCoding} from '@js'
import {mapActions, mapState} from "vuex";

export default {
    name: "fruitMachine",
    data() {
        return {
            animateInterval: null,//时间定时器,存放间隔动画id，用来清除运动
            stepTime: 10,// 间隔动画时间，表示转动快慢
            increment: 5,//角度变化增量
            currtDeg: 0,//当前角度，和css设置对应,初始为0
            stopdeg: 0,//停止时的角度
            baseLinder: 9,//旋转基本圈数
            excessAngle: null,//多余角度
            currtTime: 0,//已经旋转的次数；
            cartoon: false,//是否在动画中
            giftList: {
                "0": [315, ""],
                "1": [0, ""],
                "2": [45, ""],
                "3": [90, ""],
                "4": [135, ""],
                "5": [180, ""],
                "6": [225, ""],
                "7": [270, ""],
            },//区间奖项
            gift: "0",//奖品ID
            btnFlag: true,//是否可以点击
            turntable: '',// 转盘对象
            giftListEl: '',// 中奖对象
            msgList: [],// 消息记录
            currtPx: 1,// 当前位移象数
            orderTime: 0,//剩余抽奖次数
            giftObj:'',// 中奖奖品
            currtGift: '', // 当前选中得礼品
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state['centerStore'].userInfo,
            fruitMachineConfig: state => state['activityStore'].fruitMachineConfig,//水果机配置
            fruitMachineDetail: state => state['activityStore'].fruitMachineDetail,//水果机详情
            fruitMachineNum: state => state['activityStore'].fruitMachineNum,//水果机剩余抽奖次数
        }),
    },
    mounted() {
        // 2：大转盘，3：水果机 ,4：砸金蛋
        this.getActivityInfoAction({type:3}).then(res=>{
            this.giftMsgFun()
        })
        // 获得指针元素
        this.turntable = document.getElementById("turntable");
        // 获取中奖对象
        this.giftListEl = document.getElementById("gift-list-ul");

        this.currtGift = "";
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
        //1. 点击抽奖
        startFun() {
            if (this.btnFlag && this.fruitMachineNum>0) {
                this.btnFlag = false;
                this.getActivityAction({type:3}).then(res=>{
                    if (res && res.success) {
                        // 判断活动是否结束 {"code":200,"success":true,"data":{"id":"","status":3},"msg":"操作成功"}
                        // 1:中奖 2: 未中奖 3:活动结束 4: 次数用尽 5:超过上限金额 6:不在vip活动范围内 7:活动未开始
                        if(res.data.status >= 3){
                            this.$emit('on-tip-msg', {status:res.data.status},"fruitMachine");
                            return;
                        }
                        // 获取id 对应得位置
                        this.fruitMachineDetail.data.forEach((item,index)=>{
                            // 中奖位置
                            if(item.id == res.data.id){
                                // 封装中奖金额
                                res.data.money = item.amount;
                                this.initTurnTable(index);
                            }
                        })
                        this.giftObj = res.data;
                    } else {
                        this.btnFlag = true;
                    }
                })
            }else{
                // 提示语
                if(this.fruitMachineNum == 0){
                    this.$emit('on-tip-msg', {status:4},"fruitMachine");
                }
            }
        },
        // 2. 初始化转盘参数
        initTurnTable(giftId) {
            // 重置当前角度
            this.currtDeg = 0;
            //流水
            this.gift = giftId;
            //获取角度
            this.excessAngle = this.getDeg();
            //转多少角度
            this.stopdeg = this.baseLinder * 360 + this.excessAngle;
            //删除动画
            clearInterval(this.animateInterval);
            // 开启动画
            this.animateInterval = setInterval(this.animateFun, this.stepTime);
        },
        //通过奖项设置额外角度的表现
        getDeg(real) {
            return 360 - (this.giftList[this.gift][0]);
        },
        //大转盘转动函数
        animateFun() {
            //是否是动画中
            this.cartoon = true;
            //当前圈数；
            this.currtTime = parseInt((this.currtDeg / 360).toString().substr(0, 1));
            // 当前步进 和当前圈数挂钩 越来越慢
            this.increment = parseInt((this.baseLinder + 1)) - this.currtTime;
            //角度
            this.currtDeg += this.increment;
            //转动的角度
            if (this.currtDeg > this.stopdeg) {
                // 剩余点击次数
                if(this.fruitMachineNum >0){
                    this.btnFlag = true;
                }
                clearInterval(this.animateInterval);
                // 提示语
                this.$emit('on-tip-msg', this.giftObj,"fruitMachine");
            } else {
                //this.turntable.style.transform = "rotate(" + this.currtDeg + "deg)";
                let currt = 360 - (this.currtDeg - 360 * this.currtTime)
                if (currt >= this.giftList[0][0] && currt < 360) {
                    this.currtGift = 0;
                    //console.log("当前奖品:",this.currtGift);
                }
                if (currt >= this.giftList[1][0] && currt < this.giftList[2][0]) {
                    this.currtGift = 1;
                    // console.log("当前奖品:",this.currtGift);
                }
                if (currt >= this.giftList[2][0] && currt < this.giftList[3][0]) {
                    this.currtGift = 2;
                    // console.log("当前奖品:",this.currtGift);
                }
                if (currt >= this.giftList[3][0] && currt < this.giftList[4][0]) {
                    this.currtGift = 3;
                    // console.log("当前奖品:",this.currtGift);
                }
                if (currt >= this.giftList[4][0] && currt < this.giftList[5][0]) {
                    this.currtGift = 4;
                    // console.log("当前奖品:",this.currtGift);
                }
                if (currt >= this.giftList[5][0] && currt < this.giftList[6][0]) {
                    this.currtGift = 5;
                    // console.log("当前奖品:",this.currtGift);
                }
                if (currt >= this.giftList[6][0] && currt < this.giftList[7][0]) {
                    this.currtGift = 6;
                    // console.log("当前奖品:",this.currtGift);
                }
                if (currt >= this.giftList[7][0] && currt < this.giftList[0][0]) {
                    this.currtGift = 7;
                    // console.log("当前奖品:",this.currtGift);
                }
            }
        },

        // 奖品列表
        giftMsgFun() {
            for (let i = 0; i <= 30; i++) {
                this.msgList.push({
                    name: this.randomRange(6, 9),
                    //money: this.randomCoding()
                    money:this.fruitMachineDetail.data[Math.floor(Math.random() * 7)].amount
                });
            }
            setInterval(this.giftListAnimate, 45)
        },
        // 列表动画
        giftListAnimate() {
            if (this.currtPx >= this.msgList.length * 30) {
                this.currtPx = 0;
            } else {
                this.currtPx = this.currtPx + 1;
            }
            this.giftListEl.style.transform = "translateY(-" + this.currtPx + "px)";
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
            this.articleViweAction(this.fruitMachineDetail.articleId).then(res => {
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
        }

    },
}
</script>
<style lang="stylus" scoped>
@import '~@styl/template1/themes/mixin.styl'
@import "~@styl/template1/common/fun.styl"

@keyframes jump
    0%
        transform: translateY(-12px);
    50%
        transform: translateY(-6px);
    100%
        transform: translateY(-12px);

.turntable-page
    background: url('~@img/comimages/activity/fruitMachine/fruit-bg.png') top 0 left 0 no-repeat
    width 1059px
    height 701px
    top 50%
    left 50%
    transform translate(-50%, -50%)
    position relative

    .fruit-con
        width 420px
        list-style none
        flexcon()
        flex-wrap wrap
        position absolute
        top: 165px;
        left: 480px;
        justify-content space-evenly

        li
            background: url('~@img/comimages/activity/fruitMachine/item.png') center / contain no-repeat;
            width 130px
            height 100px
            margin-bottom 10px

            &.active
                background: url('~@img/comimages/activity/fruitMachine/item-active.png') center / contain no-repeat;
                transform scale(1.03)
            .gift-img
                //background: url('~@img/comimages/activity/fruitMachine/smil.png') center / contain no-repeat;
                background-position center
                background-size contain
                background-repeat no-repeat
                width 44px
                height 44px
                margin 10px auto

            .text
                text-align center
                color #e25000
                font-size 14px

            &:nth-child(1)
                order 5
                color #b80000
                font-size 14px
                text-align center
                line-height 90px
                background #fed3a6
                background-image none
                border-radius 10px
            &:nth-child(2)
                order 1

            &:nth-child(3)
                order 2

            &:nth-child(4)
                order 3

            &:nth-child(5)
                order 6

            &:nth-child(6)
                order 9

            &:nth-child(7)
                order 8

            &:nth-child(8)
                order 7

            &:nth-child(9)
                order 4


    .button
        display block
        width 257px
        height 101px
        background: url('~@img/comimages/activity/fruitMachine/button.png') center / contain no-repeat;
        position: absolute
        top: 520px;
        left: 569px;
        cursor pointer
        hvr-pulse-grow()
    .close-icon
        background: url('~@img/comimages/activity/fruitMachine/close.png') center / contain no-repeat;
        width 34px
        height 34px
        position absolute
        top 50px
        right 30px
        transition all .3s ease-in-out
        cursor pointer

        &:hover
            transform rotate(180deg)

    .gift-list
        width 345px
        height 318px
        position absolute
        top 200px
        left 116px
        overflow hidden

        ul
            list-style none
            padding 0
            margin 0

            li
                flexcon()
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
                        margin 0 2px

                    &:nth-child(3)
                        color #efee45

    .activity-detail
        width 45px
        height 120px
        position absolute
        top 140px
        right  80px
        cursor pointer

</style>
