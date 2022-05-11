<template lang="pug">
    .page-con
        .page-flow
            .close-icon(@click="closeFun")
            .msg-con
                .item
                    p.title  已获得彩金(元):

                // 已签到
                .item(v-if="hasSiged")
                    p {{singinDetail.getMoney + singinDetail.data[singinDetail.sginDays]}}
                    p
                        span * 已连续签到
                        span {{singinDetail.sginDays + 1}}
                        template(v-if="singinDetail.isLastDay")
                            span 天,本次签到已结束
                        template(v-else)
                            span 天,明日签到可领取
                            span {{tomorrowMoney}}
                            span 元

                // 未签到
                .item(v-else)
                    p {{singinDetail.getMoney}}
                    p
                        span * 已连续签到
                        span {{singinDetail.sginDays}}
                        span 天,今日签到可领取
                        span {{todayMoney}}
                        span 元

            .sign-con
                .sign-flow(:class="'currt-page'+ currtPage")
                    .daty-con(:class="hasSiged?'hasSiged':''")
                        .item(v-for="day in 14",:class="[today == day?'today':'',day > today?'tomorrow':'',singinDetail.data.length >= day?'':'empty']")
                            .day(:class="[today == day?'today':'',day > today?'tomorrow':'']") {{ day}}
                            .money {{singinDetail.data[day-1]}}

                    .daty-con(:class="hasSiged?'hasSiged':''")
                        .item(v-for="day in 14",:class="[today == (14 + day)?'today':'',(14 + day) > today?'tomorrow':'',singinDetail.data.length >= (14 + day)?'':'empty']")
                            .day(:class="[today == (14 + day)?'today':'',(14 + day) > today?'tomorrow':'']") {{ 14 + day}}
                            .money {{singinDetail.data[day+13]}}

                    .daty-con(:class="hasSiged?'hasSiged':''")
                        .item(v-for="day in 2",:class="[today == (28 + day)?'today':'',(28 + day) > today?'tomorrow':'',singinDetail.data.length >= (28 + day)?'':'empty']")
                            .day(:class="[today == (28 + day)?'today':'',(28 + day) > today?'tomorrow':'']") {{ 28 + day}}
                            .money {{singinDetail.data[day+27]}}
                        .item(v-for="empty in 12" class="empty")

            .left(v-if="currtPage > 1", @click="leftClick")
            .right(v-if="currtPage < allPage",@click="rightClick")
            .submit-btn(@click="submit",:class="hasSiged?'hidden':''")
            .rule(@click="openDiscountDialog") 活动规则>>

        // 中奖提示框
        .msg-dialog(v-if="showGiftPage")
            .msg-flow(:class="giftObj.status == 2?'success':''")
                .close(@click="closeMsgDialog")
                .msg(v-if="giftObj.status == 1")
                    p 已签到 !
                    p
                    p 记得明日再来领取哦!

                .msg(v-if="giftObj.status == 2")
                    p 恭喜获得彩金
                    p
                        span ¥
                        span {{singinDetail.data[singinDetail.sginDays]}}元
                    p 记得明日再来领取哦!
                .msg(v-if="giftObj.status == 3")
                    p 活动已结束 !
                .msg(v-if="giftObj.status == 6")
                    p 不在vip等级范围 !
                    p
                    p 请查看活动规则

                .msg(v-if="giftObj.status == 7")
                    p 活动未开始,请耐心等待
                .close-btn(@click="closeMsgDialog")

</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
    name: "signin",
    components: {},
    data() {
        return {
            //today: 1,
            allDays: 30,//连续天数
            currtPage: 1,// 当前页
            //allPage: 3,//所有页面

            showGiftPage: false,// 显示提示信息
            giftObj: '',// 中奖礼品对象
        }
    },
    computed: {
        ...mapState({
            userId: state => state.userId, // 会员id
            singinConfig: state => state['activityStore'].singinConfig,//签到配置对象
            singinDetail: state => state['activityStore'].singinDetail,//签到详情
            hasSiged: state => state['activityStore'].hasSiged,//今日签到状态

        }),
        // 明日佣金
        tomorrowMoney(){
            // 如果时最后一天
            if(this.singinDetail.sginDays == this.singinDetail.data.length){
                return this.singinDetail.data[0];
            }else{
                return this.singinDetail.data[this.singinDetail.sginDays + 1]
            }
        },
        // 今日佣金
        todayMoney(){
            return this.singinDetail.data[this.singinDetail.sginDays]
        },

        // 今日
        today(){
            if(this.singinDetail.sginDays == this.singinDetail.data.length){
                return 0
            }else{
                return this.singinDetail.sginDays + 1;
            }
        },
        // 是否是最后一天
        isLastDay(){
            if(this.singinDetail.sginDays == this.singinDetail.data.length){
                return true;
            }else{
                return false;
            }
        },
        // 所有页数
        allPage(){
            if(this.singinDetail.data){
                return Math.ceil(this.singinDetail.data.length/14)
            }else{
                return 0;
            }
        },

    },
    watch: {},
    mounted() {

        //this.allDays = this.singinDetail.data.length;
        //this.allPage = Math.ceil(this.singinDetail.data.length/14)
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
            // 关闭活动
            closeActivityAction(dispatch, param) {
                return dispatch(`activityStore/closeActivityAction`, param);
            },
            // 开启活动
            openActivityAction(dispatch, param) {
                return dispatch(`activityStore/openActivityAction`, param);
            },
            // 签到
            setSinginAction(dispatch, param) {
                return dispatch(`activityStore/setSinginAction`, param);
            },

        }),
        // 路由跳转
        jumpPage(page) {
            this.$router.push({path: page});
        },

        // 获取本月天数
        getCountDays() {
            var curDate = new Date();
            // 获取当前月份
            var curMonth = curDate.getMonth();
            // 实际月份比curMonth大1，下面将月份设置为下一个月
            curDate.setMonth(curMonth + 1);
            // 将日期设置为0，表示自动计算为上个月（这里指的是当前月份）的最后一天
            curDate.setDate(0);
            // 返回当前月份的天数
            return curDate.getDate();
        },

        // 关闭事件
        closeFun() {
            this.$emit("on-close");
        },
        leftClick() {
            this.currtPage -= 1;
        },
        rightClick() {
            this.currtPage += 1;
        },
        submit(){
            if(!this.hasSiged){
                this.setSinginAction().then(res=>{
                    if (res && res.success) {
                        this.giftObj = res.data;
                        this.showGiftPage = true;
                    }
                })
            }else{
                // 已经领取
                this.giftObj.status = 1;
                this.showGiftPage = true;

            }
        },
        // 关闭提示弹框
        closeMsgDialog() {
            this.showGiftPage = false;
            if(this.giftObj.status == 2){

            }
        },
        // 打开活动弹框--活动详情
        openDiscountDialog() {
            window.win.myloading.show();
            this.articleViweAction(this.singinConfig.articleId).then(res => {
                window.win.myloading.hidden();
                if (res && res.success) {
                    this.$myDialog({title: '活动详情', con: res.data.content, diatxtClass: true}, (res) => {
                    });
                }
            })
        },
    }
}
</script>

<style lang="stylus" scoped>
@import '~@styl/template1/themes/mixin.styl'
@import "~@styl/template1/common/fun.styl"

.page-con
    width 100%
    height 100%
    .page-flow
        position relative
        background: url('~@img/comimages/activity/signin/sign-bg.png') center / contain no-repeat;
        width 750px
        height 760px
        top 45%
        left 50%
        transform translate(-50%, -50%)
        position relative

        .close-icon
            background: url('~@img/comimages/activity/signin/close.png') center / contain no-repeat;
            width 34px
            height 34px
            position absolute
            top 108px
            right 20px
            transition all .3s ease-in-out
            cursor pointer

            &:hover
                transform rotate(180deg)


        .msg-con
            background: url('~@img/comimages/activity/signin/sign-title-bg.png') center / contain no-repeat;
            width 600px
            height 110px
            top 240px
            left 94px
            position absolute

            .item
                padding-top 4px
                width 600px
                font-size 14px

                .title
                    color #851d11
                    font-size 14px
                    margin-top 18px
                    margin-left 20px

                &:nth-child(2)
                    flexcon()

                    p
                        &:nth-child(1)
                            flex none
                            margin-left 20px
                            color #d8452c
                            font-size 38px
                            font-weight 600

                        &:nth-child(2)
                            flex 1
                            flexcon()
                            justify-content flex-end
                            color #666
                            margin-right 30px

                            span:nth-child(2)
                                color #d8452c
                                font-weight 600
                                font-size 16px
                                padding 0 2px
                            span:nth-child(4)
                                color #d8452c
                                font-weight 600
                                font-size 16px
                                padding 0 2px



        .right
            position absolute
            background: url('~@img/comimages/activity/signin/right.png') center / contain no-repeat;
            width 54px
            height 76px
            right 10px
            top 490px
            cursor pointer


        .left
            position absolute
            background: url('~@img/comimages/activity/signin/right.png') center / contain no-repeat;
            width 54px
            height 76px
            left 45px
            top 484px
            transform rotate(180deg)
            cursor pointer


        .sign-con
            width 635px
            height 300px
            position absolute
            top 360px
            left 75px
            overflow hidden
            .sign-flow
                width 635px
                height 300px
                flexcon()
                flex-direction row
                flex-wrap nowrap
                justify-content flex-start
                transition all .6s ease-in-out
                &.currt-page2
                    transform translateX(-635px)
                &.currt-page3
                    transform translateX(-1270px)

                .daty-con
                    flex none
                    width 635px
                    height 300px
                    flexcon()
                    flex-wrap wrap
                    justify-content space-evenly
                    position relative
                    &:before
                        before()
                        height 10px
                        background #fbf2ef
                        width 96%
                        top 10px
                        border-radius 10px
                        left 50%
                        transform translateX(-50%)

                    &:after
                        before()
                        height 10px
                        background #fbf2ef
                        width 95%
                        top 160px
                        border-radius 10px
                        left 50%
                        transform translateX(-50%)
                    &:nth-child(3):after
                        display none
                    &.hasSiged
                        .item
                            &.today
                                background: url('~@img/comimages/activity/signin/yestoday.png') center / contain no-repeat;
                                .money
                                    color #f9d6d3
                    .item
                        flex none
                        width 80px
                        height 100px
                        background: url('~@img/comimages/activity/signin/yestoday.png') center / contain no-repeat;
                        margin-top 20px
                        position relative
                        &.empty
                            visibility hidden
                        &.tomorrow
                            background: url('~@img/comimages/activity/signin/tomorow.png') center / contain no-repeat;
                            .money
                                color #e95549
                        &.today
                            background: url('~@img/comimages/activity/signin/today-ok.png') center / contain no-repeat;
                            .money
                                color #e95549
                        &.hasSiged
                            background: url('~@img/comimages/activity/signin/yestoday.png') center / contain no-repeat;
                            .money
                                color #e95549
                        .day
                            position absolute
                            width 26px
                            height 26px
                            border-radius 50%
                            text-align center
                            line-height 26px
                            background-color #f2f2f2
                            color #cccccc
                            left 50%
                            transform translateX(-50%)
                            top -34px
                            z-index 2

                            &.tomorrow
                                background-color #ffffff
                                color #4d4d4d

                            &.today
                                background: url('~@img/comimages/activity/signin/today.png') center / contain no-repeat;
                                width 43px
                                height 24px
                                color transparent
                        .money
                            text-align center
                            font-size 24px
                            color #f9d6d3
                            margin-top 15px


        .submit-btn
            background: url('~@img/comimages/activity/signin/submit.png') center / contain no-repeat;
            width 160px
            height 59px
            position absolute
            bottom 45px
            left 43%
            cursor pointer
            hvr-pulse-grow()
            &.hidden
                filter: grayscale(1);

        .rule
            position absolute
            bottom 20px
            left 55%
            transform translateX(-50%)
            cursor pointer
            font-size 14px
            letter-spacing 1px
            color #2e80cc

    .msg-dialog
        width: 100%;
        height: 100%;
        background-color rgba(0, 0, 0,.7)
        position: fixed;
        top: 0;
        left: 0;
        z-index 6;

        .msg-flow
            position absolute
            background: url('~@img/comimages/activity/signin/msg-bg.png') center / contain no-repeat;
            width 572px
            height 609px
            left 50%
            top 50%
            transform translate(-50%, -50%)
            transition all .2s ease-in-out
            fadeIn()
            &.success
                background: url('~@img/comimages/activity/signin/success.png') center / contain no-repeat;
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
                color #94281b
                font-size 24px
                text-align center
                position relative

                p
                    width 100%
                    position absolute
                    left 50%
                    transform translateX(-50%)

                    &:nth-child(1)
                        top 180px

                    &:nth-child(2)
                        top 240px
                        color #d8452c
                        font-weight 600
                        font-size 36px
                    &:nth-child(3)
                        top 320px
                        color #4d4d4d

            .close-btn
                width 240px
                height 90px
                position absolute
                bottom 55px
                left 50%
                transform translateX(-50%)
                cursor pointer

</style>
