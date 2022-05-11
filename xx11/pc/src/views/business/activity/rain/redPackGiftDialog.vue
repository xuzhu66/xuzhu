<template lang="pug">
    .page-con
        .bottom-bg
        .gift-con
            .time-con {{secondToDate(redRainDownTimes)}}
            .gift-list
                ul#gift-list-ul
                    li(v-for="item in msgList")
                        span {{item.name}}
                        span 在红包雨中
                        span 抽中{{item.money?item.money:8}}彩金
                    li(v-for="item in msgList")
                        span {{item.name}}
                        span 在红包雨中
                        span 抽中{{item.money?item.money:8}}彩金

            .close(@click="closeActivityAction")
            .open(@click="openRain")
            .activity-detail(@click="openDiscountDialog")

</template>

<script>
import {randomRange, randomCoding} from '@js'
import {mapActions, mapMutations, mapState} from "vuex";
export default {
    name: "",
    components: {},
    data() {
        return {
            msgList: [],// 消息记录
            giftListEl: '',// 中奖对象
            currtPx: 1,// 当前位移象数
        }
    },
    computed: {
        ...mapState({
            redRainDownTimes: state => state['activityStore'].redRainDownTimes,//红包雨倒计时
            redRainAllTimes: state => state['activityStore'].redRainAllTimes,//红包雨持续时间
            redPackConfig: state => state['activityStore'].redPackConfig,//红包配置对象
        }),
    },
    watch: {
        redRainDownTimes:{
            handler(newValue, oldValue) {
                // 监听用户id,查询当前子栏目的数据;
                if (newValue && newValue != '') {
                    // 如果活动开启了之后 自动开启活动
                    if(this.redPackConfig.isOpen){
                        this.openRain();
                    }
                }
            },
            immediate: true
        }
    },
    mounted() {
        // 获取中奖对象
        this.giftListEl = document.getElementById("gift-list-ul");
        this.giftMsgFun();
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
        }),
        randomCoding: randomCoding,
        // 路由跳转
        jumpPage(page) {
            this.$router.push({path: page});
        },
        // 奖品列表
        giftMsgFun() {
            for (let i = 0; i <= 30; i++) {
                this.msgList.push({
                    name: this.randomRange(6, 9),
                    // money: this.randomCoding()
                    money:this.redPackConfig.data[Math.floor(Math.random() * 7)]
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
        //秒转化成 时分秒
        secondToDate(result) {

            let h = Math.floor(result / 3600).toString();
            let m = Math.floor((result / 60 % 60)).toString();
            let s = Math.floor((result % 60)).toString();
            if(h.length == 1){
                h = "0" + h
            }
            if(m.length == 1){
                m = "0" + m
            }
            if(s.length == 1){
                s = "0" + s
            }
            let str = h + ":" + m + ":" + s;

            if(h > 24){
                str = Math.floor(h/24).toString() + "天";
            }
            return str;
        },
        openRain(){
            // 如果是手动开始
            if(this.redPackConfig.isOpen){
                // 关闭弹框
                this.closeActivityAction();
                // 打开红包雨弹框
                this.openActivityAction("redRain")
            }
        },
        // 打开活动弹框--活动详情
        openDiscountDialog(id) {
            window.win.myloading.show();
            this.articleViweAction(this.redPackConfig.articleId).then(res => {
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
    .bottom-bg
        background: url('~@img/comimages/activity/rain/feather.png') bottom center / contain no-repeat;
        width 100%
        height 481px
        position absolute
        bottom -30px
    .gift-con
        background: url('~@img/comimages/activity/rain/bg.png') center / contain no-repeat;
        width 482px
        height 699px
        left 50%
        top 50%
        transform translate(-50%,-50%)
        position absolute
        .time-con
            position absolute
            width 200px
            top 150px
            left 50%
            transform translateX(-50%)
            font-size 36px
            letter-spacing 6px
            color #ffeac5
            text-align center
            font-weight 600
        .gift-list
            width 388px
            height 118px
            position absolute
            top 506px
            left 50px
            overflow hidden

            ul
                list-style none
                padding 0
                margin 0

                li
                    flexcon()
                    justify-content space-evenly
                    height 30px
                    line-height 30px
                    text-align center
                    span
                        flex 1
                        font-size 12px

                        &:nth-child(1)
                            color #d07e00

                        &:nth-child(2)
                            color #bd120c
                            margin 0 2px

                        &:nth-child(3)
                            color #4d0300

    .close
            background: url('~@img/comimages/activity/rain/close.png') center / contain no-repeat;
            width 34px
            height 34px
            position absolute
            top 0px
            right 0px
            transition all .3s ease-in-out
            cursor pointer

            &:hover
                transform rotate(180deg)

    .open
        width 110px
        height 110px
        position absolute
        top 240px
        left 50%
        transform translateX(-50%)
        border-radius 50%
        cursor pointer

    .activity-detail
        width 160px
        height 50px
        position absolute
        bottom 0px
        left 50%
        transform translateX(-50%)
        cursor pointer
</style>
