<template lang="pug">
    div
        lottie(:options='pinjumpOptions' :height='he' :width='wi' @animCreated='handleAnimation')
        //lottie(:options='pinjumpOptions' :height='400' :width='400' @animCreated='handleAnimation')
        //lottie(:options='pinjumpOptions' :height='400' :width='400' @animCreated='handleAnimation')
        //div
        //    p Speed: x{{animationSpeed}}
        //    input(type='range' value='1' min='0' max='3' step='0.5' v-on:change='onSpeedChange' v-model='animationSpeed')
        button(v-on:click='stop') stop
        button(v-on:click='pause') pause
        button(v-on:click='play') play
</template>
<script>

import * as testAnimationData from './test.json';
import * as pinjumpAnimationData from './pinjump.json';
import lottie1 from "@/plugins/complugin/lottie/lottie";
export default {
    name: 'app',
    components:{
        lottie1
    },
    data() {
        return {
            testOptions: {animationData: testAnimationData.default},
            pinjumpOptions: {animationData: pinjumpAnimationData.default},
            animationSpeed: 1,
            wi:450,
            he:450,
        }
    },
    methods: {
        handleAnimation: function (anim) {
            this.anim = anim;
        },

        stop: function () {
            this.anim.stop();
        },

        play: function () {
            this.anim.play();
        },

        pause: function () {
            this.anim.pause();
        },

        onSpeedChange: function () {
            this.anim.setSpeed(this.animationSpeed);
        }
    }
}
</script>

