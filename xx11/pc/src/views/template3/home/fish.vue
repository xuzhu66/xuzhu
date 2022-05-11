<template lang="pug">
    .fish_page
        video(autoplay="" muted="muted" loop="" id="video")
            source(:src="videoSrc" type="video/mp4")
        .imgs(v-if="games", :len='games.length')
            .img(v-for='(it,ind) in games',:style="`background-image:url(${$ossImg(it.picUrl)})`",@click="enterBannerFun(it)")

</template>

<script>
import fish from '@img/template3/home/bg/fish.mp4'
import {mapActions} from "vuex";

export default {
    name: 'fish', // 玩家
    components: {},
    data() {
        return {
            games: '',
            videoSrc: fish,
            bannerType: 4, // 0 首页 1 真人娱乐 2 棋牌游戏 3 电子游戏 4 捕鱼游戏 5 彩票投注 6 电子竞技 7 体育投注 8 优惠活动
        }
    },
    created() {
        // 获取游戏列表
        this.getGameListFun({seatType: 4}).then(res => {
            if (res && res.success) {
                this.games = res.data;
            }
        })
    },
    mounted() {
        //this.getFish();
    },
    methods: {
        ...mapActions({
            // 获取游戏列表
            getGameListFun(dispatch, param) {
                return dispatch('homeStore/getGameListAction', param)
            },
            enterBannerFun(dispatch, data) {
                return dispatch('gameStore/enterBannerAction', data);
            }
        }),
    },
    activated() {
        var video = document.getElementById('video');
        if (video && video.paused) {//如果暂停就播放
            video.play();
        }
    },
    deactivated() {

    }
}
</script>

<style lang="stylus" scoped>
.fish_page
    height 950px
    background #1b60af
    position relative
    overflow hidden
    text-align center

    video
        height 100%
        width 1920px

    .imgs
        position absolute
        top 45%
        left 50%
        transform translate3d(-50%, -50%, 0)

        &[len="1"]
        &[len="2"]
            white-space nowrap

            .img
                width 420px
                height 420px
                margin 0 100px

        &[len="4"]
            width 820px

            .img
                margin 0 20px

        &[len="3"]
        &[len="5"]
        &[len="6"]
            width 1110px

        &[len="7"]
        &[len="8"]
            width 1200px

    .img
        width 370px
        height 370px
        display inline-block
        background-size contain
        cursor: pointer;
        // margin 30px
        animation: floatm 3.5s ease-in-out infinite alternate

        &:nth-child(2n)
            animation: floatx 3s ease-in-out infinite alternate

        &:nth-child(3n-1)
            animation: floatm 4s ease-in infinite alternate

        &:nth-child(5n-2)
            animation: floatx 3.8s ease-out infinite alternate

        &:nth-child(5)
            animation: floatm 4.3s ease-out infinite alternate

        &:hover
            animation: 1s linear 0s 1 normal both running animation-jump


@keyframes floatx {
    0% {
        transform: translate3d(10px, -10px, 0)
    }
    50% {
        transform: translate3d(0, 28px, 0)
    }
    100% {
        transform: translate3d(-10px, -10px, 0)
    }
}

@keyframes floatm {
    0% {
        transform: translate3d(-5px, -10px, 0)
    }
    50% {
        transform: translate3d(5px, 25px, 0)
    }
    100% {
        transform: translate3d(-5px, -10px, 0)
    }
}

@keyframes animation-jump {
    0% {
        transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }
    3.33% {
        transform: matrix3d(1.049, 0, 0, 0, 0, 1.049, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }
    6.67% {
        transform: matrix3d(.926, 0, 0, 0, 0, .926, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }
    10% {
        transform: matrix3d(.759, 0, 0, 0, 0, .759, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }
    13.33% {
        transform: matrix3d(.706, 0, 0, 0, 0, .706, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }
    16.67% {
        transform: matrix3d(.8, 0, 0, 0, 0, .8, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }
    20% {
        transform: matrix3d(.962, 0, 0, 0, 0, .962, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }
    23.33% {
        transform: matrix3d(1.093, 0, 0, 0, 0, 1.093, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }
    26.67% {
        transform: matrix3d(1.146, 0, 0, 0, 0, 1.146, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }
    30% {
        transform: matrix3d(1.127, 0, 0, 0, 0, 1.127, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }
    33.33% {
        transform: matrix3d(1.069, 0, 0, 0, 0, 1.069, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }
    36.67% {
        transform: matrix3d(1.008, 0, 0, 0, 0, 1.008, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }
    40% {
        transform: matrix3d(.966, 0, 0, 0, 0, .966, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }
    43.33% {
        transform: matrix3d(.951, 0, 0, 0, 0, .951, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }
    46.67% {
        transform: matrix3d(.958, 0, 0, 0, 0, .958, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }
    50% {
        transform: matrix3d(.976, 0, 0, 0, 0, .976, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }
    53.33% {
        transform: matrix3d(.996, 0, 0, 0, 0, .996, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }
    56.67% {
        transform: matrix3d(1.008, 0, 0, 0, 0, 1.008, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }
    60% {
        transform: matrix3d(1.013, 0, 0, 0, 0, 1.013, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }
    63.33% {
        transform: matrix3d(1.011, 0, 0, 0, 0, 1.011, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }
    66.67% {
        transform: matrix3d(1.006, 0, 0, 0, 0, 1.006, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }
    70% {
        transform: matrix3d(1.001, 0, 0, 0, 0, 1.001, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }
    73.33% {
        transform: matrix3d(.998, 0, 0, 0, 0, .998, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }
    76.67% {
        transform: matrix3d(.997, 0, 0, 0, 0, .997, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }
    80% {
        transform: matrix3d(.998, 0, 0, 0, 0, .998, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }
    83.33% {
        transform: matrix3d(.999, 0, 0, 0, 0, .999, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }
    86.67% {
        transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }
    90% {
        transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }
    93.33% {
        transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }
    96.67% {
        transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }
    100% {
        transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    }
}
</style>
