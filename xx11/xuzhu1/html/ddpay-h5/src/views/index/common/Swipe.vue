<script>
import { Swipe, SwipeItem, Image, Loading } from 'vant'

export default {
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Image.name]: Image,
    [Loading.name]: Loading
  },
  props: {
    images: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const onClickImage = (link) => {
      window.open(link)
    }
    return {
      onClickImage
    }
  }
}
</script>
<template lang="pug">
.swipe
  van-image(v-if="loading" src='' style="width: 100%;height: 90px;")
  van-swipe(v-if="!loading" :autoplay='3000' indicator-color='white')
    van-swipe-item(v-for='(item, index) in images' :key='index' @click='onClickImage(item.link)')
      van-image(:src='item.imgUrl')
        template(v-slot:loading)
          van-loading(type="spinner" size="20")
</template>

<style lang="scss">
.swipe {
  margin-top: 10px;
  margin-bottom: 10px;
  .van-swipe {
    border-radius: 16px;
  }
  .van-swipe-item {
    height: 98px;
    line-height: 98px;
  }
}
</style>
