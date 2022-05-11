<template lang="pug">
    .activity-window-con

        // 红包雨
        .red-rain(v-if="showRainWindow")
            .close-icon-btn(@click="closeRain")
                svg-icon(icon-class='close')
            .open(@click="openRain")
            .submit
                span(v-if="redPackConfig.isOpen") 距离结束:
                span(v-else) 距离开始:
                span {{secondToDate(redRainDownTimes)}}

        // 签到
        .sigin-con(v-if="showSinginWindow")
            .close-icon-btn(@click="closeSingin")
                svg-icon(icon-class='close')
            .open(@click="openSingin")
            .submit(@click="openSingin")

</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";

export default {
    name: "",
    components: {},
    data() {
        return {
            interval:null,// 时间控制器
        }
    },
    computed: {
        ...mapState({
            userId: state => state.userId, // 会员id
            showRainWindow: state => state['activityStore'].showRainWindow,
            showSinginWindow: state => state['activityStore'].showSinginWindow,
            redRainDownTimes: state => state['activityStore'].redRainDownTimes,//红包雨倒计时
            redRainAllTimes: state => state['activityStore'].redRainAllTimes,//红包雨持续时间
            redPackConfig: state => state['activityStore'].redPackConfig,//红包配置对象
            singinConfig: state => state['activityStore'].singinConfig,//签到配置对象


        }),
    },
    watch: {
        "$store.state.userId": {
            handler(newValue, oldValue) {
                // 监听用户id,查询当前子栏目的数据;
                if (newValue && newValue != '') {
                    this.getSinginInfoAction()
                }
            },
            immediate: true
        }
    },
    mounted() {
        this.getRedRainInterval();
        this.getSinginConfigAction();
    },
    methods: {
        ...mapMutations({
            // 显示红包雨
            setShowRainWindowMutation(commit, data) {
                return commit('activityStore/SET_SHOW_RAIN_WINDOW', data)
            },
            // 显示签到
            setShowSinginWindowMutation(commit, data) {
                return commit('activityStore/SET_SHOW_SINGIN_WINDOW', data)
            },

        }),
        ...mapActions({
            // 活动--红包雨--获取配置
            getRedPackConfigAction(dispatch, param) {
                return dispatch(`activityStore/getRedPackConfigAction`, param);
            },
            // 活动--签到--获取配置
            getSinginConfigAction(dispatch, param) {
                return dispatch(`activityStore/getSinginConfigAction`, param);
            },
            // 活动--签到--详情
            getSinginInfoAction(dispatch, param) {
                return dispatch(`activityStore/getSinginInfoAction`, param);
            },

            // 开启活动
            openActivityAction(dispatch, param) {
                return dispatch(`activityStore/openActivityAction`, param);
            },

        }),
        // 跳转
        jumpPage(page) {
            this.$router.push({path: page});
        },
        // 红包雨关闭按钮
        closeRain() {
            this.setShowRainWindowMutation(false);
        },
        // 签到关闭按钮
        closeSingin() {
            this.setShowSinginWindowMutation(false);
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
        getRedRainInterval(){
            this.getRedPackConfigAction()
            clearInterval(this.interval);
            this.interval = setInterval(()=>{
                this.getRedPackConfigAction();
            },1000*60*50)
        },
        openRain(){
            // 如果登录
            if(this.userId){
                // 如果是手动开始 this.redPackConfig.joinType == 1
                if(this.redPackConfig.isOpen){
                    this.openActivityAction("redRain")
                }else{
                    // 打开未开奖页面
                    this.openActivityAction("redRainGift")
                }
            }else{
                this.showLogin();
            }
        },
        // 打开签到窗口
        openSingin(){
            // 如果登录
            if(this.userId){
                this.openActivityAction("signin")
            }else{
                this.showLogin();
            }

        },

        //  显示登录
        showLogin() {
            this.$store.commit('set_showLogin', true)
            this.$store.commit("loginRegStore/set_curTemp", 'login')
        },

    }
}
</script>

<style lang="stylus" scoped>
@import '~@styl/template1/themes/mixin.styl'
@import "~@styl/template1/common/fun.styl"
.activity-window-con
    .red-rain
        position fixed
        bottom 260px
        z-index 3
        left 0px
        background url('~@img/comimages/activity/home/redpack.png') center / 70% no-repeat
        width 188px
        height 203px

        .close-icon-btn
            position absolute
            top 10px
            right 20px
            transition all .3s linear
            cursor pointer
            font-size 13px
            width 24px
            height 24px
            border 1px solid #f85454
            border-radius 50%
            flexcon()
            justify-content center
            align-items center
            svg
                fill #f85454
            &:hover
                transform rotate(180deg)
        .open
            width 60px
            height 70px
            position absolute
            top 60px
            left 50%
            transform translateX(-50%)
            cursor pointer
        .submit
            width 60%
            height 30px
            position absolute
            bottom 30px
            left 50%
            transform translateX(-50%)
            flexcon()
            justify-content center
            cursor pointer
            color #ec3b00
            font-weight 500
            span
                flex none
                &:nth-child(2)
                    padding-left 2px

    .sigin-con
        cursor pointer
        position fixed
        bottom 60px
        z-index 3
        left 0px
        background url('~@img/comimages/activity/home/sigin.png') center / 70% no-repeat
        width 188px
        height 203px

        .close-icon-btn
            position absolute
            top 10px
            right 20px
            transition all .3s linear
            cursor pointer
            font-size 13px
            width 24px
            height 24px
            border 1px solid #f85454
            border-radius 50%
            flexcon()
            justify-content center
            align-items center
            svg
                fill #f85454
            &:hover
                transform rotate(180deg)
        .open
            width 60px
            height 70px
            position absolute
            top 60px
            left 50%
            transform translateX(-50%)
            cursor pointer
        .submit
            width 60%
            height 30px
            position absolute
            bottom 40px
            left 50%
            transform translateX(-50%)
            cursor pointer

</style>
