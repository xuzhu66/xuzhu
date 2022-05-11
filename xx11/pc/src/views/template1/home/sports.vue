<template lang="pug">
    .sport
        .iframe
            iframe(:src="iframeUrl",frameborder="0")

</template>

<script>
import gameStore from "@/store/comstore/game/gameStore"; // 登入游戏状态
import headerStore from "@/store/comstore/home/headerStore"; // 头部banner状态
export default {
    name: 'sports', // 玩家
    components: {},
    computed: {
        // userId: { // 用户ID
        //     get() {
        //         return this.$store.state.userId;
        //     },
        //     set(item) {
        //         return item
        //     }
        // },
        // playBList: { // 平台列表
        //     get() {
        //         return this.$store.state.homeStore.playBList;
        //     },
        //     set(item) {
        //         return item
        //     }
        // },
        // curPlayObj: { // 当前选中banner
        //     get() {
        //         return this.$store.state.homeStore.curPlayObj;
        //     },
        //     set(item) {
        //         return item
        //     }
        // },
        // isReq: { // 请求是否完成
        //     get() {
        //         return this.$store.state.gameStore.isReq;
        //     },
        //     set(item) {
        //         return item
        //     }
        // },
        // freeUrl: { // 免费试玩
        //     get() {
        //         return this.$store.state.gameStore.freeUrl;
        //     },
        //     set(item) {
        //         return item
        //     }
        // },
    },
    props: {},
    data() {
        return {
            currtItem: "",  //当前选中的项目
            iframeUrl: "",  // 游戏链接
            gameLineId: "", //游戏线路
        }
    },
    created() {
        window.win.myloading.show()

    },
    watch: {
        $route(to, from) {
            this.initPage()
        }
    },
    mounted() {
        this.initPage()
    },
    methods: {
        // enterFreeGame() {
        //     let that = this;
        //     let obj = {
        //         value: {
        //             gameLineId:this.gameLineId
        //         },
        //         index: 'player'
        //     }
        //     // 1. 查询游戏对象 2. 进入游戏
        //     this.$store.dispatch("gameStore/enterGameAction", obj).then(res => {
        //         window.win.myloading.hidden()
        //         if(res && res.success) {
        //             if(res.data.status=='0' || res.data.status==0) {
        //                 that.iframeUrl = res.data.freeUrl;
        //             }else{
        //                 window.win.tips.warning("获取游戏链接失败,请联系客服!");
        //             }
        //         }else{
        //             let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
        //             window.win.tips.warning(msg);
        //         }
        //     });
        // },
        //进入游戏
        // enterGame() {
        //     let that = this;
        //     let obj = {
        //         value: {
        //             gameLineId:this.gameLineId
        //         },
        //         index: 'player'
        //     }
        //     window.win.myloading.show()
        //     // 1. 查询游戏对象 2. 进入游戏
        //     this.$store.dispatch("gameStore/enterGameAction", obj).then(res => {
        //         window.win.myloading.hidden()
        //         if(res && res.success) {
        //             if(res.data.status=='0' || res.data.status==0) {
        //                 that.iframeUrl = res.data.url;
        //             }else{
        //                 window.win.tips.warning("获取游戏链接失败,请联系客服!");
        //             }
        //         }else{
        //             let msg = res.msg ? res.msg : "网络异常,请稍后重试!";
        //             window.win.tips.warning(msg);
        //         }
        //     });
        // },
        // goReg() {
        //     this.$store.dispatch("gameStore/jumpLoginPageAction")
        // },
        // getGame(value){
        //     let o = {
        //         value: value
        //     }
        //     this.$store.dispatch("gameStore/enterBannerAction", o).then(res => {
        //     });
        // },
        initPage() {
            let source = this.getUrlParam();
            if (source && source.game) {
                window.win.myloading.hidden()
                this.iframeUrl = source.game;
            }
        },
        getUrlParam() {
            let obj = {};
            let urlStr = window.location.href;
            if (urlStr.indexOf("?") != -1) {
                urlStr = urlStr.substr(urlStr.indexOf("?") + 1);
                let strs = urlStr.split("&");
                for (let i = 0; i < strs.length; i++) {
                    let tempArr = strs[i].split("=");
                    let processedStr = window.decodeURIComponent(tempArr[1]).replace(/(\d{4})\/(\d{2})\/(\d{2})\s+(\d{2})-(\d{2})-(\d{2})/g, "$1-$2-$3 $4:$5:$6");
                    obj[tempArr[0]] = processedStr;
                }
            }
            return obj;
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '~@styl/template1/themes/mixin.styl'
.sport
    .iframe
        position: fixed;
        top: 0px
        left: 0;
        right: 0;
        bottom: 0;
        overflow-y auto
        -webkit-overflow-scrolling: touch

        iframe
            width 100%
            height 100%
            border: 0;
            padding-bottom: 0;
            vertical-align: bottom;

</style>
