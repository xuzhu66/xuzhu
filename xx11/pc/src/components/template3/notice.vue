<template lang="pug">
    .notice-con(v-if="homeNoticeList && homeNoticeList.length > 0")
        .notice-flow.w1200.t1-notice
            .notice-icon
            van-swipe(class="s-nswipe" vertical :loop="true" :autoplay="2000")
                van-swipe-item(v-for="(value, index) in homeNoticeList" :key="index" @click="popNews(value)"  v-html="value.title")
                template#indicator
                    .custom-indicator
            //.notice-jump(@click="$link('/center/message')") 查看更多>
            .notice-jump(@click="jumpPage") 查看更多>

</template>

<script>
import {Swipe, SwipeItem} from 'vant';
import {mapGetters, mapState} from 'vuex';

export default {
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem
    },
    computed: {
        ...mapGetters(['token']),
        ...mapState({
            homeNoticeList: state => state.noticeStore.homeNoticeList
        }),
    },
    data() {
        return {};
    },
    created() {

    },
    mounted() {

    },
    methods: {
        popNews(v) { // 弹出信息
            let t = v.title,
                c = v.content,
                url = "/loginReg"
            if (this.token) {
                url = "/center/message"
            }
            this.$myDialog({
                title: t,
                con: c,
                btnTextLeft: "关闭",
                btnTextRight: "查看全部",
                leftBut: true,
                actionLeft: false
            }, (res) => {
                if (this.token) {
                    url = "/center/message"
                    this.$router.push({path: url})
                } else {
                    this.$store.commit('set_showLogin', true)
                }
            });
        },
        jumpPage() {
            if (this.token) {
                let url = "/center/message"
                this.$store.commit('set_curMenu', '')
                this.$router.push({path: url})
            } else {
                this.$store.commit('set_showLogin', true)
            }
        }
    }
};
</script>

<style lang="stylus" scoped>
@import '~@styl/template3/themes/mixin.styl'
@import "~@styl/template3/common/fun.styl"
.notice-con
    background url("~@img/template3/home/bg/bg_notice.png") center / auto 100% no-repeat
    height 60px

    .notice-flow
        display flex
        justify-content space-between
        padding 5px 12px
        margin-top 0px
        height: 60px
        line-height 60px
        z-index 2
        position relative
        align-items center

        .notice-icon
            width 28px
            height 28px;
            display flex
            align-items center
            background-image: url('~@img/template3/icon/notice.svg')
            background-size 20px 20px
            background-position 0px center
            background-repeat no-repeat

        .s-nswipe
            flex 1 0 auto
            height 28px
            line-height 28px
            font_color(fc4)

            /deep/ .van-swipe__indicators
                display none

            /deep/ .van-swipe-item
                font_color(fc4)
                font-size 16px

        .notice-jump
            flex none
            font-size: 16px;
            font_color(fc4)
            cursor pointer

</style>
