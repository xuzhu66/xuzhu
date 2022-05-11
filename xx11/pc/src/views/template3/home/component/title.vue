<template lang="pug">
    .title-con.w1200
        .title-flow
            .title-big(:class="bTit") {{bTit}}
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
            type: String,
            default: ""
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
@import '~@styl/template3/themes/mixin.styl'
@import "~@styl/template3/common/fun.styl"

.title-con
    padding-top 60px
    padding-bottom 24px

    .title-flow
        display flex
        justify-content flex-start
        align-items flex-end

        .title-big
            font-size: 36px
            font-weight 600
            font_color(fc2)

        .title-small
            padding-left 10px
            font-size: 18px
            font_color(fc3)
            padding-bottom 4px
</style>
