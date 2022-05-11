<script>
export default {
  name: 'AbUploader'
}
</script>
<script setup>
import { Uploader, Toast } from 'vant'
import { defineProps, defineEmits } from 'vue'
import { useVModel } from '@vueuse/core'

const props = defineProps({
  maxCount: {
    type: Number,
    default: 1
  },
  modelValue: {
    type: Array,
    default: () => {
      return []
    }
  },
  accept: {
    type: String,
    default: '*'
  },
  maxSize: {
    type: [Number, String],
    default: Infinity
  },
  afterRead: {
    type: Function,
    default: () => {
      return {}
    }
  },
  deletable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits()
const modelValue = useVModel(props, 'modelValue', emit)

const changeMethod = (event, val) => {
  modelValue.value = event
}
const onOversize = () => {
  const maxLimit = (props.maxSize / 1024 / 1024).toFixed(2)
  Toast(`上传文件大小不能超过${maxLimit}M`)
}
</script>
<template>
  <Uploader
    :model-value="modelValue"
    multiple
    :max-count="maxCount"
    class="abUploader"
    :max-size="maxSize"
    :after-read="afterRead"
    :deletable="deletable"
    @oversize="onOversize"
    @update:model-value="changeMethod"
  >
    <div class="abUploaderDefineIcon">+上传</div>
  </Uploader>
</template>
<style lang="scss">
.abUploader {
  .van-uploader__upload {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    border: 1px dashed #b8bbc3;
  }
}
.abUploaderDefineIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border: 1px dashed #b8bbc3;
  border-radius: 8px;
}
</style>
