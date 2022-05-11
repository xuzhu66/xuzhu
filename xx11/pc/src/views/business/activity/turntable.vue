<template lang="pug">
    .turntable-page
        #turntable
            ul
                li(v-for="item in turntableDetail.data")
                    .money(v-if="item.amount >0") 彩金{{item.amount}}元
                    .money(v-else) 谢谢惠顾
                    .gift(:style="`background-image:url(${item.url})`")

        .button(@click='startFun')
        .bottom-img
            .text
                span 您还有
                span {{turntableNum}}次
                span 抽奖机会
        .close-icon(@click="closeFun")
        .gift-list
            ul#gift-list-ul
                li(v-for="item in msgList")
                    span {{item.name}}
                    span 在幸运大转盘中
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
    name: "turntable",
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
                "0": [0, 44, "谢谢惠顾"],//谢谢惠顾
                "1": [45, 89, "1号"],//1号
                "2": [90, 134, "2号"],//2号
                "3": [135, 179, "3号"],//3号
                "4": [180, 224, "4号"],//4号
                "5": [225, 269, "5号"],//5号
                "6": [270, 314, "6号"],//6号
                "7": [315, 359, "7号"],//7号
                "8": [360, 0, "8号"],//8号
            },//区间奖项
            gift: "0",//奖品ID
            btnFlag: true,//是否可以点击
            turntable: '',// 转盘对象
            giftListEl: '',// 中奖对象
            msgList: [],// 消息记录
            currtPx: 1,// 当前位移象数
            orderTime: 0,//剩余抽奖次数
            giftObj:'',// 中奖奖品
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state['centerStore'].userInfo,
            turntableConfig: state => state['activityStore'].turntableConfig,//大转盘配置
            turntableDetail: state => state['activityStore'].turntableDetail,//大转盘详情
            turntableNum: state => state['activityStore'].turntableNum,//大转盘剩余抽奖次数
        }),
    },
    mounted() {
        // 2：大转盘，3：水果机 ,4：砸金蛋
        this.getActivityInfoAction({type:2}).then(res=>{
            this.giftMsgFun();
        })
        // 获得指针元素
        this.turntable = document.getElementById("turntable");
        // 获取中奖对象
        this.giftListEl = document.getElementById("gift-list-ul");

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
            if (this.btnFlag && this.turntableNum>0) {
                this.btnFlag = false;
                this.getActivityAction({type:2}).then(res=>{
                    if (res && res.success) {
                        // 判断活动是否结束 {"code":200,"success":true,"data":{"id":"","status":3},"msg":"操作成功"}
                        // 1:中奖 2: 未中奖 3:活动结束 4: 次数用尽 5:超过上限金额 6:不在vip活动范围内 7:活动未开始
                        if(res.data.status >= 3){
                            this.$emit('on-tip-msg', {status:res.data.status},"turntable");
                            return;
                        }
                        // 获取id 对应得位置
                        this.turntableDetail.data.forEach((item,index)=>{
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
                if(this.turntableNum == 0){
                    this.$emit('on-tip-msg', {status:4},"turntable");
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
                if(this.turntableNum >0){
                    this.btnFlag = true;
                }
                clearInterval(this.animateInterval);
                // 提示语
                this.$emit('on-tip-msg', this.giftObj,"turntable");
            } else {
                this.turntable.style.transform = "rotate(" + this.currtDeg + "deg)";
            }
        },

        // 奖品列表
        giftMsgFun() {
            for (let i = 0; i <= 30; i++) {
                this.msgList.push({
                    name: this.randomRange(6, 9),
                    //money: this.randomCoding()
                    money:this.turntableDetail.data[Math.floor(Math.random() * 7)].amount
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
            this.articleViweAction(this.turntableDetail.articleId).then(res => {
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
.turntable-page
    background: url('~@img/comimages/activity/turntable/turn-bg.png') top 0 left 0 no-repeat
    width 1100px
    height 702px
    top 50%
    left 45%
    transform translate(-50%, -50%)
    position relative

    #turntable
        background: url('~@img/comimages/activity/turntable/turntable.png') center / contain no-repeat;
        background-size: cover;
        position: relative;
        top: 80px;
        left 300px
        margin: auto;
        width 500px
        height 500px

        ul
            list-style none
            padding 0
            margin 0

            .gift
                //background: url('~@img/comimages/activity/turntable/smil.png') center / contain no-repeat;
                background-position center
                background-size contain
                background-repeat no-repeat
                width 44px
                height 44px
                margin 10px auto

            li
                width 120px
                height 100px
                position absolute
                text-align center
                padding-top 10px
                color #ff2252
                font-size 14px
                &:nth-child(1)
                    top 50px
                    left 50%
                    transform translateX(-50%)

                &:nth-child(2)
                    top: 94px;
                    left: 291px;
                    transform: rotate(45deg);

                &:nth-child(3)
                    top: 198px;
                    left: 333px;
                    transform: rotate(90deg);

                &:nth-child(4)
                    top: 300px;
                    left: 290px;
                    transform: rotate(135deg);

                &:nth-child(5)
                    top: 342px;
                    left: 194px;
                    transform: rotate(180deg)

                &:nth-child(6)
                    top: 300px;
                    left: 88px;
                    transform: rotate(225deg)

                &:nth-child(7)
                    top: 198px;
                    left: 45px;
                    transform: rotate(270deg)

                &:nth-child(8)
                    top: 99px;
                    left: 86px;
                    transform: rotate(315deg)


    .button
        width 210px
        height 210px
        background: url('~@img/comimages/activity/turntable/button.png') center / contain no-repeat;
        position: absolute
        top: 309px;
        left 850px
        transform translate(-50%, -50%)
        cursor pointer

    .bottom-img
        background: url('~@img/comimages/activity/turntable/bottom.png') center / contain no-repeat;
        width 503px
        height 185px
        bottom 0px
        position absolute
        right 0px
        z-index -1

        .text
            position absolute
            bottom 12px
            text-align center
            width 100%
            color #facd99
            font-size 14px

            span:nth-child(2)
                color #fff

    .close-icon
        background: url('~@img/comimages/activity/turntable/close.png') center / contain no-repeat;
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
        height 349px
        position absolute
        top 230px
        left 245px
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
                    flex 1
                    font-size 14px

                    &:nth-child(1)
                        color #a944da

                    &:nth-child(2)
                        color #6b5dd2
                        margin 0 2px
                        flex 1.2

                    &:nth-child(3)
                        color #e77110
                        flex 1.5


    .activity-detail
        width 45px
        height 120px
        position absolute
        top 180px
        left 160px
        cursor pointer
</style>
