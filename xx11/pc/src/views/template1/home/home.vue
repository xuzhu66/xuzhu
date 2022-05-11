<template lang="pug">
    .page-con
        Banner.t1-banner(:seatType="seatType")
        Notice.w1200.t1-notice
        Title(bTit="热门推荐" sTit="汇聚全球顶级娱乐平台")
        HotRecom
        Title(bTit="热门游戏" sTit="多款游戏高额奖金")
        HotGame
        Title(bTit="热门优惠" sTit="各种优惠为您撑腰")
        HotPre
        .page-bg
        // 微信弹框
        WechatDialog(@wechatClose="wechatClose")
</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';
import noticeStore from "@/store/comstore/modules/noticeStore"; // notice状态
import Banner from '@pon/template1/banner'; // Banner轮播图片
import Notice from '@pon/template1/notice'; // 公告栏
import Title from '@/views/template1/home/component/title'; // 标题
import HotRecom from '@/views/template1/home/component/hotRecom'; // 热门推荐
import HotGame from '@/views/template1/home/component/hotGame'; // 热门游戏
import HotPre from '@/views/template1/home/component/hotPre'; // 热门优惠
import WechatDialog from '@/views/business/home/wechatDialog'
export default {
    name: 'home',
    components: {
        "Banner": Banner, // Banner轮播图片
        "Notice": Notice, // 公告栏
        "Title": Title, // 标题
        "HotRecom": HotRecom, // 热门推荐
        "HotGame": HotGame, // 热门游戏
        "HotPre": HotPre, // 热门优惠
        "WechatDialog":WechatDialog, // 微信弹框
    },
    computed: {
        ...mapState({
            userId: state => state.userId, // 会员id
            singinConfig: state => state['activityStore'].singinConfig,//签到配置对象
            singinDetail: state => state['activityStore'].singinDetail,//签到详情对象
            hasAutoShowSingin: state => state['activityStore'].hasAutoShowSingin,//是否自动显示过签到弹框

        }),
        ...mapGetters(['token']),
        popNotice: { // 弹出公告
            get() {
                return this.$store.state.noticeStore.popNotice;
            },
            set(item) {
                return item
            }
        },
        isFirst: { // 是否第一次弹出
            get() {
                return this.$store.state.noticeStore.isFirst;
            },
            set(item) {
                return item
            }
        },
        tenatPlatId: { // 平台ID
            get() {
                return this.$store.state.homeStore.tenatPlatId;
            },
            set(item) {
                return item
            }
        },
        showLogin: { // 登录是否显示
            get() {
                return this.$store.state.showLogin;
            },
            set(item) {
                return item
            }
        },
    },
    data() {
        return {
            seatType: 0
        }
    },
    created() {
        if (!this.$store.state["noticeStore"]) {
            noticeStore.install(this);
        }
    },
    activated() {
        this.$setBuriedPoint('J10030');
    },
    watch: {
        userId(val, oldval) {
            if (val) {
                this.pageInit()
            }
        },
    },
    mounted() {
        this.pageInit()
    },
    methods: {
        ...mapMutations({
            // 是否自动显示过签到弹框
            setHasAutoShowSinginMutation(commit, data) {
                return commit('activityStore/SET_HASAUTO_SHOW_SINGIN', data)
            },

        }),
        ...mapActions({
            // 微信变更
            getWechatChangeFun(dispatch, param){
                return dispatch('headerStore/getWechatChangeAction',param);
            },
            // 开启活动
            openActivityAction(dispatch, param) {
                return dispatch(`activityStore/openActivityAction`, param);
            },
        }),
        pageInit() {
            // 已经登录
            if (this.userId) {
                // 公告消息提示
                this.getPopNotice();
            }
        },
        async getPopNotice() {
            if (this.isFirst) return
            try {
                let param = {};
                let res = await this.$store.dispatch("noticeStore/getPopNotice", param)
                if (res && res.success) {
                    this.$store.commit('noticeStore/set_popNotice', res.data) // 弹出框消息
                    let n = res.data[0]
                    this.popNews(n.title, n.content)
                    this.$store.commit('noticeStore/set_isFirst', true)
                } else {
                    // 显示签到
                    this.openSingleActivity();
                }
                return res
            } catch (err) {
                return err;
            }
        },
        popNews(t, c) { // 弹出信息
            this.$myDialog({
                title: t,
                con: c,
                btnTextLeft: "关闭",
                btnTextRight: "查看全部",
                leftBut: true,
                actionLeft: false,
                page:'news',//页面类型
            }, (res) => {
                if (this.token) {
                    let url = "/center/message"
                    this.$router.push({path: url})
                } else {
                    this.$store.commit('set_showLogin', true)
                }
            },()=>{
                this.openSingleActivity()
            });
        },
        wechatClose(){
            this.getPopNotice();
        },
        // 打开签到活动
        openSingleActivity(){
            // 有没有开启 有没有登录 有没有签到 是不是第一次显示
            if(this.userId && this.singinDetail && this.singinConfig && !this.singinConfig.isSgin && !this.hasAutoShowSingin){
                this.setHasAutoShowSinginMutation(true);
                this.openActivityAction("signin")
            }
        }
    }
}
</script>
<style lang="stylus" scoped>
@import '~@styl/template1/themes/mixin.styl'
.page-con
    width 100%
    height calc(100% - 190px)
    background-image url('~@img/template1/home/bannerBG.jpg')
    background-position center top
    background-repeat no-repeat
    position relative
    padding-bottom 60px

    .page-bg
        position absolute
        top 1160px
        bg_img_linear(linear01)
        width 100%
        height calc(100% - 1160px)
        z-index -1

    .t1-banner
        width 100%
        height 520px
        margin 0px auto
        border-radius 10px
        z-index 1
        position relative

    .t1-notice
        margin-top 0px
        height: 60px
        line-height 60px
        bg_color(bg04)
        box_shadow(shadow05)
        border-radius: 30px
        z-index 2
        position relative
        align-items center
        padding 0px 25px


.e-pickPlay
    width 300px
    height 205px
    bg_color(bg001)
    border-radius 6px
    padding 20px 0px
    position fixed
    left 50%
    top 50%
    transform: translate(-50%, -60%)
    z-index 11
    display flex
    align-items center
    justify-content center
    flex-wrap wrap

    .e-but
        width 210px
        height 44px
        bg_color(bg02)
        border-radius 22px
        text-align center
        line-height 44px
        font_color(fc045)
        font-size: 15px
        cursor pointer

    .e-bcur
        bg_color(bg03)
        font_color(fc12)

        span
            display block

    .ep-free
        text-align center

    p
        font-size 12px
        font_color(fc02)
        padding-top 10px

    .ep-close
        width: 40px
        height: 40px
        position absolute
        bottom -50px
        cursor pointer

        svg
            border-radius 50%
            border_all(2px, solid, border01)
            font_color(fc01)
            padding 8px
            width 40px
            height 40px
</style>
