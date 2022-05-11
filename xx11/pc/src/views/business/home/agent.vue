<template lang="pug">
    .page-con
        .page-flow
            img(v-for='item in imgList',:src="$ossImg(item)")

</template>

<script>
import {mapActions} from "vuex";

export default {
    name: "agent",
    components: {},
    data() {
        return {
            imgList:''
        }
    },
    watch: {},
    mounted() {
        this.getAgentImgListAction().then(res=>{
            if (res && res.success) {
                this.imgList = res.data.picUrls;
            }
        })
    },
    methods: {
        ...mapActions({
            // 获取代理图片
            getAgentImgListAction(dispatch, param) {
                return dispatch(`getAgentImgListAction`, param);
            },
        }),
        // 路由跳转
        jumpPage(page) {
            this.$router.push({path: page});
        },
    }
}
</script>

<style lang="stylus" scoped>
.page-con
    .page-flow
        position relative
        display flex
        flex-direction column
        flex-wrap nowrap
        justify-content center
        align-items center
        .img
            width 100%

</style>
