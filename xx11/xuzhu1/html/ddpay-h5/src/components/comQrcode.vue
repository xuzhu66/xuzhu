<template lang="pug">
div(:class="clasz",:id="clasz",class="qrcode")
</template>

<script>
import QRCode from 'qrcodejs2'

export default {
  name: 'Qrcode',
  props: {
    codeurl: {
      type: String,
      default: ''
    },
    clasz: {
      type: String,
      default: 'qrcode'
    }
  },
  mounted() {
    this.qrcode()
  },
  methods: {
    qrcode() {
      new QRCode(this.clasz, {
        width: 180,
        height: 180,
        text: this.codeurl
      })
    }
  }
}
</script>

<style scoped>

</style>
