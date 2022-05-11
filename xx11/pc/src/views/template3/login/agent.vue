<template lang="pug">
    .reg-agent
        van-checkbox(v-model="checked" shape="square" @change="getAgentCheck") 注册即代表同意并遵守
        span.reg-ag-link(@click="openUrl('/agreement')") 《用户服务协议》
</template>
<script>
import {Checkbox} from 'vant';

export default {
    name: 'Loging', // 登录
    components: {
        [Checkbox.name]: Checkbox // 单选
    },
    data() {
        return {
            checked: true// 是否选中
        }
    },
    computed: {
        showAgent: { // 用户服务协议是否显示
            get() {
                return this.$store.state.loginRegStore.showAgent;
            },
            set(item) {
                return item
            }
        }
    },
    methods: {
        goUrl(t) { // 跳转
            this.$router.push(t)
        },
        getAgentCheck(v) { // 用户协义是否选中
            this.$emit('getAgentChecked', v)
        },
        openUrl() {
            let temp = 'userAgreement'
            this.$myDialog({title: "用户协议", curTemp: temp}, (res) => {
            });
        }
    }
}
</script>
<style lang="stylus" scoped>
@import '~@styl/template3/themes/mixin.styl'
.reg-agent
    display flex
    justify-content center
    font_color(fc38)
    margin-top 10px

    /deep/ .van-checkbox__label
        font_color(fc39)

    /deep/ .van-checkbox__icon--checked
        .van-icon
            font_color(fc01)
            bg_color(bg41)
            border-color: #737780;

    /deep/ .van-checkbox__icon
        font-size: 15px

    /deep/ .van-checkbox__label
        line-height: 15px

    .reg-ag-link
        font_color(fc3)
        line-height 15px
        cursor pointer
</style>
