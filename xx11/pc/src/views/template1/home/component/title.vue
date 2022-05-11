<template lang="pug">
    .h-tit.w1200.flex-jb
        .ht-l.ht-linbg
        .ht-m
            p.ht-tft {{ bTit }}
            p.ht-tfb {{ sTit }}
        .ht-r.ht-linbg
</template>

<script>
export default {
    name: 'Temp1',
    components: {},
    props: {
        bTit: { // 大标题
            type: String
        },
        sTit: { // 小标题
            type: String
        },
    },
    data() {
        return {}
    },
    computed: {},
    created() {

    },
    watch: {},
    mounted() {
        this.pageInit()
    },
    methods: {
        pageInit() {
        },

    }
}
</script>
<style lang="stylus" scoped>
@import '~@styl/template1/themes/mixin.styl'
.h-tit
    margin-top 80px
    margin-bottom 10px

    .ht-linbg
        background-image url('~@img/template1/home/menulin.png')
        background-repeat no-repeat
        background-position left center
        background-size contain

    .ht-l
        width 438px
        height 46px

    .ht-m
        flex 1 1 auto

        .ht-tft
            text-align center
            font-size: 32px
            font_color(fc06)
            font-weight bold
            margin-bottom 10px

        .ht-tfb
            text-align center
            font-size: 18px
            font_color(fc06)

    .ht-r
        width 438px
        height 46px
        transform: rotateY(180deg);

/* 水平镜像翻转 */
</style>
