<template lang="pug">
    .title-con.w1200
        .title-flow
            .title-big(:class="bTit")
            .title-small {{ sTit }}
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
@import '~@styl/template2/themes/mixin.styl'
@import "~@styl/template2/common/fun.styl"

.title-con
    padding-top 80px
    padding-bottom 24px

    .title-flow
        display flex
        justify-content flex-start
        align-items flex-end

        .title-big
            width 175px
            height 39px

            &.tuijian
                background url("~@img/template2/home/bg/hottuijian.png") center / contain no-repeat

            &.discout
                background url("~@img/template2/home/bg/hotdiscout.png") center / contain no-repeat

            &.about
                background url("~@img/template2/home/bg/about.png") center / contain no-repeat

        .title-small
            padding-left 10px
            font-size: 18px
            font_color(fc079)

</style>
