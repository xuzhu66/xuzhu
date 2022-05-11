<template lang="pug">
    div
        div(:class="clasz",:id="clasz",class="qrcode")

</template>

<script>
import QRCode from 'qrcodejs2'

export default {
    components: {},
    props: {
        codeurl: {
            type: String,
            default: ""
        },
        width: {
            type: String,
            default: '120'
        },
        height: {
            type: String,
            default: '120'
        },
        clasz: {
            type: String,
            default: "qrcode"
        },

    },
    data() {
        return {}
    },
    created() {
    },
    mounted() {
        this.qrcode();
    },
    methods: {
        qrcode() {
            let qrcode = new QRCode(this.clasz, {
                width: this.width,
                height: this.height,
                text: this.codeurl,
            })
        }
    },
    activated() {

    },
    deactivated() {

    }
}
</script>

<style lang="stylus" scoped>

</style>
