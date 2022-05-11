<template lang="pug">
    .home-page
        // 轮播banner
        Banner(:bannerType="bannerType")
        // 轮播公告
        Notice
        // 热门推荐
        Title(bTit="热门推荐" sTit="汇聚全球顶尖娱乐平台")
        Live
        // 热门游戏
        Title(bTit="热门游戏" sTit="多款游戏高额奖金")
        HotRecommend
        // 热门优惠
        Title(bTit="热门优惠" sTit="各种优惠为您撑腰")
        HotDiscount
        // 关于我们
        Title(bTit="关于我们")
        AboutUs
        // 微信弹框
        WechatDialog(@wechatClose="wechatClose")

</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from 'vuex';
import Banner from '@pon/template3/banner'; // Banner轮播图片
import Notice from '@pon/template3/notice'; // 公告栏
import Title from '@/views/template3/home/component/title'; // 标题
import HotRecommend from '@/views/template3/home/component/hotRecommend'; // 热门推荐
import HotGame from '@/views/template3/home/component/hotGame'; // 热门游戏
import HotDiscount from '@/views/template3/home/component/hotDiscount'; // 热门优惠
import AboutUs from '@/views/template3/home/component/aboutUs'; // 关于我们
import Live from '@/views/template3/home/component/hotLive'; // 真人游戏
import WechatDialog from '@/views/business/home/wechatDialog'
export default {
    name: 'home',
    components: {
        "Banner": Banner, // Banner轮播图片
        "Notice": Notice, // 公告栏
        "Title": Title, // 标题
        "HotRecommend": HotRecommend, // 热门推荐
        "hotGame": HotGame, // 热门游戏
        "HotDiscount": HotDiscount, // 热门优惠
        "AboutUs": AboutUs, // 关于我们
        "Live": Live, // 真人娱乐
        "WechatDialog":WechatDialog, // 微信弹框
    },
    computed: {
        ...mapState({
            userId: state => state.userId, // 会员id
            aboutUs: state => state.homeStore.aboutUs, // 关于我们
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
            bannerType: 0, // 0 首页 1 真人娱乐 2 棋牌游戏 3 电子游戏 4 捕鱼游戏 5 彩票投注 6 电子竞技 7 体育投注 8 优惠活动
        }
    },
    created() {

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
                // this.getWechatChangeFun().then(res=>{
                //     if (res && res.success) {
                //             if(res.data && res.data.followWechatChange){
                //                 // 微信弹框
                //             }else{
                //                 // 公告消息提示
                //                 this.getPopNotice();
                //             }
                //     }else{
                //         // 公告消息提示
                //         this.getPopNotice();
                //     }
                // })
            }
        },
        // 公告消息提示
        async getPopNotice() {
            if (this.isFirst) return
            try {
                let res = await this.$store.dispatch("noticeStore/getPopNotice")
                if (res && res.success) {
                    this.$store.commit('noticeStore/set_popNotice', res.data) // 弹出框消息
                    let n = res.data[0]
                    this.popNews(n.title, n.content)
                    this.$store.commit('noticeStore/set_isFirst', true)
                } else {
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
                actionLeft: false
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
        imgError(item) {
            item.picUrl = require('@img/template3/home/noImg.png');
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
@import '~@styl/template3/themes/mixin.styl'
@import "~@styl/template3/common/fun.styl"
.home-page
    width 100%
    //height calc(100% - 190px)
    position relative
    padding-bottom 60px
    bg_color(bg1)
</style>
