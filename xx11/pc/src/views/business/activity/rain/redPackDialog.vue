<template lang="pug">
    .rain-dialog
        .dialog-flow(v-if="showDialog",@click="closeDialog")
        comDialog(:show-footer='false',:show="showDialog",@on-cancel="closeDialog")
            div(slot="header")
            div.dialog-con(slot="default")



            div(slot="footer")

</template>

<script>
import thatStore from "@/store/comstore/assets/drawStore"; // 获取模板
import store from '@/store/Store';
import {mapActions, mapMutations, mapState} from "vuex";
import comDialog from '@pon/template1/comDialog'
export default {
    name: "draw",
    components: {
        comDialog,
    },
    data() {
        return {
            showDialog: true, // 提款密码dialog
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state['centerStore'].userInfo,
        }),

    },

    created() {
        // 动态store
        if (!store.state["drawStore"]) {
            thatStore.install(this);
        }
    },
    mounted() {
    },
    methods: {
        // ...mapMutations({
        //     setDialogStatus(commit, param) {
        //         return commit('drawStore/SET_SHOW_JUMP_DIALOG', param);
        //     }
        // }),
        ...mapActions({
            // updateUserInfoFun(dispatch, param) {
            //     return dispatch(`centerStore/updateUserInfoAction`, param);
            // },
            //
        }),

        // 关闭弹框
        closeDialog() {
            this.showDialog = false;
        },

        goPage(path, param) {
            this.$router.push({path: path, query: param})
        },

    }

}
</script>


<style lang="stylus" scoped>
@import '~@/assets/styles/template1/themes/mixin.styl'
@import "~@styl/template1/common/fun.styl"

.rain-dialog
    bg_color(bg04)
    border-radius: 0px 0px 10px 10px;

    .dialog-flow
        width: 100%;
        height: 100%;
        bg_color(bg44)
        opacity: .1;
        position: fixed;
        top: 0;
        left: 0;
        z-index 2;

    .dialog-con
        .user-con
            min-height 200px
            min-width 500px


</style>
