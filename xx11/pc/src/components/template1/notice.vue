<template lang="pug">
    .s-notice(v-if="homeNoticeList && homeNoticeList.length > 0")
        .s-nicon
        van-swipe(class="s-nswipe" vertical :loop="true" :autoplay="2000")
            van-swipe-item(v-for="(value, index) in homeNoticeList" :key="index" @click="popNews(value)" v-html="value.title")
            template#indicator
                .custom-indicator
</template>

<script>
import {Swipe, SwipeItem} from 'vant';
import {mapGetters} from 'vuex';
import noticeStore from "@/store/comstore/modules/noticeStore"; // notice状态
export default {
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem
    },
    computed: {
        ...mapGetters(['token']),
        homeNoticeList: { // notice列表
            get() {
                return this.$store.state.noticeStore.homeNoticeList;
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
        }

    },
    data() {
        return {};
    },
    created() {
        if (!this.$store.state["noticeStore"]) {
            noticeStore.install(this);
        }
    },
    mounted() {
        this.bindEvent();
    },
    methods: {
        bindEvent() { // 构造方法
            this.getNoticeList()
        },
        getNoticeList() {
            let param = {};
            this.$store.dispatch("noticeStore/getHomeNotice", param).then(res => {

            });
        },
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

            // this.$myDialog({con: con, btnTextLeft: "再看一下",btnTextRight: "我知道了", leftBut:true, actionLeft:false}, (res) => {
            //   this.setTrueName()
            // });


        },
    }
};
</script>

<style scoped lang="stylus">
.s-notice
    display flex
    justify-content space-between
    padding 5px 12px

    .s-nicon
        width 28px
        height 28px;
        display flex
        align-items center
        background-image: url('~@img/template1/icon/notice.svg')
        background-size 20px 20px
        background-position 0px center
        background-repeat no-repeat

    .s-nswipe
        flex 1 0 auto
        height 28px
        line-height 28px
        color #a1a1b3

        /deep/ .van-swipe__indicators
            display none

        /deep/ .van-swipe-item
            color #999
            font-size 16px
</style>
