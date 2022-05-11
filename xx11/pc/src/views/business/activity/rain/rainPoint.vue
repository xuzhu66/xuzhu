<template lang="pug">
    .rain-point(v-if='isShow' @click='rainPoinclick' :class='{action: isClick}' :style='styleText')

</template>

<script>
export default {
    name: 'rainPoint',
    data() {
        return {
            styleText: {},
            isShow: true,
            isClick: false
        }
    },
    methods: {
        // 点击事件
        rainPoinclick() {
            if (this.isClick) return
            this.isClick = true
            this.$emit('rainPoinclick')
        },

        // 设置坐标
        setStyle(params) {
            this.styleText = params
        },
        // 销毁雨点
        destory() {
            this.isShow = false
        }
    }
}
</script>

<style lang="stylus" scoped>
.rain-point
    position: absolute;
    background: url('~@img/comimages/activity/rain/hongbao.png') center/contain  no-repeat;
    width 63px
    height 88px
    cursor pointer
    z-index 6
    &.action
        background: none;

</style>
