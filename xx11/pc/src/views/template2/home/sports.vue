<template lang="pug">
    .sport
        .iframe
            iframe(:src="iframeUrl",frameborder="0")

</template>

<script>
// 小金体育要求这样的格式: https + www + iframe + 加白
export default {
    name: 'sports', // 玩家
    components: {},
    computed: {},
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
@import '~@styl/template2/themes/mixin.styl'
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
