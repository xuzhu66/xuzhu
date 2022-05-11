<template lang="pug">
    transition(name="fade")
        .tips#tips
            template(v-if='type == "toast"')
                .toast
                    .icon-ok
                    .toast-msg {{text}}
            template(v-else)
                .tpf(:class="type" v-show="show") {{text}}
</template>

<script type="text/ecmascript-6">
export default {
    name: 'tips',
    props: {
        type: {
            type: String,
            default: 'info',
            validator: val => ['info', 'success', 'warning', 'error', 'toast'].includes(val)
        },
        text: {
            type: String,
            default: ''
        },
        show: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        getIcon(t) {
            if (t == 'error') {
                return 'close'
            } else {
                return t
            }
        }
    }
}
</script>
<style scoped lang="stylus">
.fade-enter-active, .fade-leave-active
    transition: opacity 0.5s

.fade-enter, .fade-leave-to
    opacity: 0

.tips
    width 100%
    height 100vh
    background-color rgba(0, 0, 0, 0, 0)
    z-index 100000
    position fixed
    //top 45%
    bottom 0
    display flex
    justify-content center
    align-items center

    .toast
        color: #ffffff
        background: rgba(0, 0, 0, 0.6)
        font-size: 16px
        border-radius: 10px
        z-index: 100000
        box-shadow: 0 0 10px rgba(0, 0, 0, .3)
        padding 6px 15px
        display flex
        flex-direction column
        justify-content center
        align-items center
        min-height 90px
        min-width 90px

        .icon-ok
            background url("~@img/comimages/compon/success.svg") center / contain no-repeat
            width 36px
            height 36px

        .toast-msg
            margin-top 5px

.tpf
    color: #ffffff
    background: rgba(0, 0, 0, 0.6)
    font-size: 16px
    border-radius: 4px
    z-index: 100000
    box-shadow: 0 0 10px rgba(0, 0, 0, .3)
    min-width: 300px
    max-width 450px
    height: 55px
    -webkit-overflow-scrolling: touch
    display: flex
    justify-content: center
    align-items: center
    flex-wrap: wrap
    padding 5px 15px

//z-index 2
// .tbg
//   position fixed
//   z-index 1
//   background-color #ffff00
//   width 100%
//   height 100%
</style>
