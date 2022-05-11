<template lang="pug">
    .lr-wrap(:class="closeFlag?'close-animate':''")
        .log-close.lr-close(@click="closeLogin()")
            svg-icon(icon-class='close')
        .lr-logreg(v-if="showLogin")
            //- .lr-l
              //- img(:src="flog")
            .lr-l
                van-swipe(:autoplay="3000" v-if="isReq && regBannerArr.length>0")
                    van-swipe-item(v-for="(value, index) in regBannerArr" :key="index")
                        p.b-wh(:style="`background-image: url(${$ossImg(value.picUrl)})`")
            .lr-r
                .v-lr-tit {{ curtit }}
                transition(mode="out-in" name="loginfade")
                    component(:is="`s-${curTemp}`")
</template>
<script>
import {Swipe, SwipeItem} from 'vant';
import loginRegStore from "@/store/comstore/user/loginRegStore"; // 登录注册
import Login from '@/views/template3/login/loginAcount'; // 登录
import Reg from '@/views/template3/login/registIndex'; // 注册
import ForgetPwd from '@/views/template3/login/forgetPwd'; // 忘记密码
import UpdatePwd from '@/views/template3/login/updatePwd'; // 修改密码
import LoginVerif from '@/views/template3/login/loginPhoneCode';
import {mapState} from "vuex"; // 验证码登录

export default {
    name: 'LoginReg', // 登录注册首页
    components: {
        [Swipe.name]: Swipe,
        [SwipeItem.name]: SwipeItem,
        "s-login": Login, // 登录
        "s-reg": Reg, // 注册
        "s-forgetPwd": ForgetPwd, // 忘记密码
        "s-updatePwd": UpdatePwd, // 修改密码
        "s-loginVerif": LoginVerif // 验证码登录
    },
    computed: {
        ...mapState({
            templateNumber: state => state.templateStore.template, // 模板编号
        }),
        showLogin: { // 登录是否显示
            get() {
                return this.$store.state.showLogin;
            },
            set(item) {
                return item
            }
        },
        regBannerArr: { // 登录注册banner
            get() {
                return this.$store.state.loginRegStore.regBannerArr;
            },
            set(item) {
                return item
            }
        },
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
                let t = this.$store.state.loginRegStore.curTemp;
                if (t == 'login' || t == 'loginVerif') {
                    this.curtit = "欢迎登录"
                }
                if (t == 'reg') {
                    this.curtit = "欢迎注册"
                }
                if (t == 'forgetPwd' || t == 'updatePwd') {
                    this.curtit = "忘记密码"
                }
                if (t == 'agreement') {
                    this.curtit = "用户注册协议"
                }
                return this.$store.state.loginRegStore.curTemp;
            },
            set(item) {
                return item
            }
        }
    },
    data() {
        return {
            isReq: false, // 请求是否完成
            flog: require('@img/template3/home/foot_blogo.png'),
            curtit: "欢迎登录", // 当前标题
            menu: [
                {
                    name: '登录',
                    id: '001',
                    temp: 'login'
                },
                {
                    name: '注册',
                    id: '002',
                    temp: 'reg'
                }
            ],
            closeFlag:false,//关闭状态
        }
    },
    watch: {
        curtit: {
            handler(newValue, oldValue) {
                this.curtit = newValue
            },
            immediate: true
        }
    },
    filters: {
        formatInfo: function (v) {
            let s = v;
            if (!v) {
                s = "未完善"
            }
            return s
        }
    },
    created() {
        if (!this.$store.state["loginRegStore"]) { // 登录注册主状态
            loginRegStore.install(this);
        }
    },
    activated() {
        // this.$setBuriedPoint('J10020');
    },
    mounted() {
        this.pageInit();
        // this.$setBuriedPoint('J10020');
    },
    methods: {
        pageInit() {
            this.$store.commit("loginRegStore/set_curTemp", "login")
            this.getRegBanner() // 获取banner
        },
        getTit() {
            let s;
            this.urlObj = null
            switch (this.curTemp) {
                case 'login':
                case 'loginVerif':
                    s = "欢迎登录";
                    break;
                case 'reg':
                case 'loginVerif':
                    s = "欢迎注册";
                    break;
                case 'forgetPwd':
                case 'updatePwd':
                    s = "忘记密码";
                    break;
                case 'agreement':
                    s = "用户注册协议";
                    break;
                default:
                    break;
            }
            return s
        },
        changeTemp(t) {
            this.$store.commit("loginRegStore/set_curTemp", t)
            this.cur = t
        },
        closeLogin() {
            this.closeFlag = true;
            setTimeout(()=>{
                this.closeFlag = false;
                this.$store.commit('set_showLogin', false)
            },500)
        },
        getRegBanner() {
            this.isReq = false
            let param = {
                deviceType: 2, // 终端类型： 1、H5 2、PC 3、android 4、ios
                templateNo: this.templateNumber, // 模板number
            };
            this.$store.dispatch("loginRegStore/regBanner", param).then((res) => {
                this.isReq = true
            })
        }
    }
}
</script>
<style lang="stylus" scoped>
@import '~@styl/template3/modules/login.styl'
@import '~@styl/template3/themes/mixin.styl'
@import '~@styl/template3/common/fun.styl'
.lr-wrap
    position fixed
    width: 950px
    height: 520px
    border-radius: 10px
    left: 50%;
    top: 50%;
    z-index 11
    bg_color(bg2)
    animate__dialogFadeInDownBig()
    &.close-animate
        animate__dialogFadeOutDownBig()
    .lr-close
        position absolute
        right -35px
        top -35px
        width 40px
        height 40px
        transition: all .5s
        &:hover
            transform rotate(120deg)
        svg
            border_all(2px, solid, border_common)
            font_color(fc6)
            width 28px
            height 28px

.lr-logreg
    display flex
    justify-content space-between
    border-radius: 10px

    .lr-l
        width 365px
        height: 520px

        img
            width 100%
            height 100%

        .b-wh
            height 100%
            width 365px
            background-position center center
            background-repeat no-repeat
            cursor pointer
            border-radius: 10px

    .lr-r
        width 585px
        height: 520px

        .v-lr-tit
            width 320px
            margin 0 auto
            font-size 40px
            font_color(fc3)
            font-weight bold
            padding 30px 0px 10px 0px

    .v-lr-menu
        display flex
        justify-content center
        margin 0
        padding 0

        li
            padding 0px 5px
            list-style-type: none

        .vlim-cur
            font_color(fc3)

/deep/ .van-swipe
    height 100%
    overflow hidden
    border-radius 10px
</style>
