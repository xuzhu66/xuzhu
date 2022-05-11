<template lang="pug">
    .v-precd
        .t1-banner
            van-swipe.t1-bh(:autoplay="3000" :show-indicators="false" v-if="preBannerList.length>0 ")
                van-swipe-item(v-for="(value, index) in preBannerList" :key="index")
                    p.b-wh(@click="getGame(value,index)" :style="`background-image: url(${$ossImg(value.picUrl)})`")
        .hp-w1400.nogame_wrap(v-if="preTypeList.length == 0")
            .nogame_w
                .nogame
                .nogame-font 暂无数据
        .w1200(v-if="preTypeList.length>0")
            .vp-pwrap
                // (:style="[{'top':getSclass()}]")
                ul.vp-pl
                    li(v-for="(item,index) in preTypeList" :key="index" :class="[{'curMenu': curMenu == item.id}]" @click="getCurMenu(item)") {{ item.name }}
                ul.vp-pr
                    li(v-for="(item,index) in preList" :key="index" :class="`p-state${getClass(item.statusName)}`" @click="getActivityViwe(item)")
                        img(:src="$ossImg(item.picUrl)")
                        span.vppr-stat
        .h-mbg
</template>

<script>
import bannerStore from "@/store/template1/bannerStore"; // banner状态
import homeStore from "@/store/template1/homeStore"; // 首页头部信息状态
import gameStore from "@/store/comstore/game/gameStore"; // 登入游戏状态
import Banner from '@pon/template1/banner'; // Banner轮播图片
import {Swipe, SwipeItem} from 'vant';
import {mapState} from "vuex";

export default {
    name: 'discount',
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem
    },
    computed: {
        ...mapState({
            isReq: state => state.gameStore.isReq, //
            preBannerList: state => state.bannerStore.preBannerList, // 优惠活动列表
            preTypeList: state => state.homeStore.preTypeList, // 活动类型
            preList: state => state.homeStore.preList, // 活动列表

        })
    },
    data() {
        return {
            curMenu: ''
        }
    },
    created() {
        if (!this.$store.state["bannerStore"]) {
            bannerStore.install(this);
        }
        if (!this.$store.state["homeStore"]) { // 登录状态库
            homeStore.install(this);
        }
        if (!this.$store.state["gameStore"]) {
            gameStore.install(this);
        }
    },
    activated() {
        this.$setBuriedPoint('J10040');
    },
    watch: {},
    mounted() {
        this.pageInit()
    },
    methods: {
        pageInit() { // 构造方法
            this.getBannerList()
            this.getPreType()
        },
        getClass(v) {
            let s = ''
            switch (v) {
                case '未开始':
                    s = '1';
                    break;
                case '进行中':
                    s = '2';
                    break;
                case '已完成':
                    s = '3';
                    break;
                case '已结束':
                    s = '4';
                    break;
                default:
                    break;
            }
            return s;
        },
        async getPreType(v) { // 获取活动类型
            await this.$store.dispatch("homeStore/preferType")
            if (this.preTypeList.length > 0) {
                this.curMenu = this.preTypeList[0].id
                this.getPreList()
            }
        },
        getPreList() { // 获取活动列表
            //this.$store.commit("gameStore/set_isReq", false)
            let id = this.$route.query.id, // 获取文章ID
                param = {
                    id: this.curMenu
                };
            this.$store.dispatch("homeStore/preferList", param).then(res => {
                //this.$store.commit("gameStore/set_isReq", true)
            });
        },
        getCurMenu(v) { // 点击菜单
            this.curMenu = v.id
            //this.$store.dispatch('returnTop')
            this.getPreList();
        },
        getBannerList() {
            let param = {
                seatType: 8, // 1、首页热门推荐 2、首页热门游戏 3、首页热门优惠 4、洗码代理banner
            };
            this.$store.dispatch("bannerStore/homeBanner", param).then(res => {
            });
        },
        getActivityViwe(v) { // 获取详情
            let act = 'activityViwe',
                param = {
                    id: v.id // 展示位类型
                }
            this.$myDialog({title: '活动详情', con: '加载中...'}, (res) => {
            });
            this.$store.dispatch(`homeStore/${act}`, param).then(res => {
                if (res && res.success) {
                    this.$myDialog({title: '活动详情', con: res.data.content, diatxtClass: true}, (res) => {

                    });
                }
            });
        },
        getGame(value, index) {
            this.$store.dispatch("gameStore/enterBannerAction", value).then(res => {});
        }
    }
}
</script>
<style lang="stylus" scoped>
@import '~@styl/template1/themes/mixin.styl'
@import '~@styl/template1/common/fun.styl'
.v-precd
    background-image url('~@img/template1/home/bannerBG01.jpg')center/center repeat
    background-position center
    background-repeat repeat
    width 100%
    position relative
    min-height: 1200px
    //bg_img_linear(linear01)
    .hp-w1400
        width 1200px
        margin 0px auto
        display flex
        height 883px
        align-items center

    .t1-banner
        width 100%
        height 520px
        margin 0px auto
        border-radius 10px
        z-index 1
        position relative

        .t1-bh
            height 520px

    .vp-pwrap
        margin-top 24px
        margin-bottom 50px
        position relative

        .vp-pl
            width: 220px
            bg_color(bg04)
            box_shadow(shadow03)
            border-radius: 10px
            overflow-y auto
            position absolute
            top 0px
            z-index 2
            box_shadow(shadow04)

            .curMenu
                bg_img_linear(linear07, linear13)
                background-blend-mode: normal, normal
                border-radius: 1px
                font_color(fc01)

            li
                height: 70px
                line-height 70px
                font_color(fc017)
                font-size: 20px
                text-align center
                cursor pointer
                transition all .3s ease
                &:hover
                    @extend .curMenu

        .vp-pr
            width 960px
            float right
            min-height 500px
            margin-bottom 30px

            li
                width 100%
                height 260px
                box_shadow(shadow03);
                border-radius: 10px
                position relative
                cursor pointer
                margin-bottom 20px
                transition all 0.3s ease-in-out
                //&:hover
                    //hvr-grow()
                &:hover
                    transform scale(1.02)
                    box_shadow(shadow01)
                img
                    width 100%
                    height 100%
                    border-radius: 10px
                    z-index 0

                .vppr-stat
                    position absolute
                    width 231px
                    height 67px
                    background-size 100% 100%
                    background-position 0px center
                    background-repeat no-repeat
                    top 0px
                    right 0px
                    z-index 1
                    display block
                    border-radius: 0px 10px 0px 0px

            .p-state1
                .vppr-stat
                    background-image url("~@img/template1/preferent/pstate0.png")

            .p-state2
                .vppr-stat
                    background-image url("~@img/template1/preferent/pstate1.png")

            .p-state3
                .vppr-stat
                    background-image url("~@img/template1/preferent/pstate2.png")

            .p-state4
                .vppr-stat
                    background-image url("~@img/template1/preferent/pstate3.png")

    //.h-mbg
    //    position absolute
    //    top 60px
    //    bg_img_linear(linear01)
    //    width 100%
    //    height calc(100% - 60px)
    //    z-index -1

.b-wh
    height 100%
    background-position center center
    background-repeat no-repeat
    cursor pointer

.nogame_wrap
    display: flex
    width 100%
    height 100%
    justify-content: center
    align-items: center
    flex-wrap wrap

    .nogame
        background url("~@img/template1/home/nogame.png") center no-repeat
        display: block;
        width: 334px;
        height: 246px;
        margin: 0px auto 0;

    .nogame-font
        width 100%
        text-align center
        font_color(fc054)
        font-size 16px
</style>
