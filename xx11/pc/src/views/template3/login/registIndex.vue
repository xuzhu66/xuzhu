<template lang="pug">
    .register
        ul.reg-qmenu(:class="[{'regq-curlin': curTemp=='regacount'}]" v-show="(regType!=3 || curTemp!='regVerif') && regType==3")
            li(v-for="(v, i) in menu" :key="i"  @click="changeTemp(v.temp)") {{ v.name }}
        transition(mode="out-in" name="loginfade")
            component(:is="`s-${curTemp}`" v-if="curTemp")
</template>

<script>
import registerStore from "@/store/comstore/user/registerStore"; // 账号注册状态库
import RegAcount from '@/views/template3/login/registAcount'; // 用户账号注册
import RegPhone from '@/views/template3/login/registPhone'; // 手机号码注册
import RegVerif from '@/views/template3/login/registPhoneCode'; // 验证码注册
export default {
    name: 'Register', // 注册
    components: {
        "s-regacount": RegAcount, // 用户账号注册
        "s-regphone": RegPhone, // 手机号码注册
        "s-regVerif": RegVerif // 验证码注册
    },
    computed: {
        regType: { // 平台注册方式
            get() {
                return this.$store.state.homeStore.regType;
            },
            set(item) {
                return item
            }
        },
        curTemp: { // 当前模板
            get() {
                return this.$store.state.registerStore.curTemp;
            },
            set(item) {
                return item
            }
        }
    },
    data() {
        return {
            // regType: 2,
            menu: [
                {
                    name: '手机号码',
                    id: '002',
                    temp: 'regphone'
                }, {
                    name: '用户账号',
                    id: '001',
                    temp: 'regacount'
                }]
        }
    },
    created() {
        if (!this.$store.state["registerStore"]) { // 账号注册状态库
            registerStore.install(this);
        }
    },
    activated() {
        // this.$setBuriedPoint('J10010');
    },
    mounted() {
        this.pageInit();
        // this.$setBuriedPoint('J10010');
    },
    methods: {
        pageInit() {
            let u = 'regacount'
            switch (this.regType) {
                case 1:
                    u = 'regacount'
                    break;
                case 2:
                    u = 'regphone'
                    break;
                case 3:
                    u = 'regphone'
                    break;
                case 4:
                    u = 'regVerif'
                    break;
            }
            if (this.$route.query.fromUrl != 'agreement') {
                this.changeTemp(u)
            } else {
                if (this.curTemp == '') {
                    this.changeTemp(u)
                }
            }
        },
        changeTemp(t) {
            this.$store.commit("registerStore/set_curTemp", t)
        },
    }
}
</script>
<style lang="stylus" scoped>
@import '~@styl/template3/modules/login.styl'
@import '~@styl/template3/themes/mixin.styl'
.register
    height calc(100% - 150px)
    width 320px
    margin 0px auto

    .reg-qmenu
        display flex
        justify-content flex-start
        margin-bottom 50px
        position relative

        li
            padding 0px 0px
            font_color(fc3)
            font-size 15px
            position relative
            cursor pointer

            &:nth-child(1)
                position relative
                margin-right 44px

                &:after
                    content: "";
                    right -22px
                    top: 3px;
                    border_com(1px, solid, fc3, left)
                    height: 16px;
                    position absolute

        .regq-cur
            font_color(fc4)

        &:before
            content: "";
            left 0px
            bottom: -8px;
            border_com(3px, solid, fc4, bottom)
            height: 1px;
            width 60px
            position absolute
            transition left 0.5s

    .regq-curlin
        font_color(fc4)

        &:before
            left 105px
            transition left 0.5s

    .reg-list
        li
            display flex
            justify-content center
</style>
