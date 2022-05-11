<script>
export default {
  name: 'AbDialog'
}
</script>
<script setup>
import { defineProps, defineEmits } from 'vue'
import { Dialog } from 'vant'
import { useVModel } from '@vueuse/core'
import AbButton from './AbButton'

const VanDialog = Dialog.Component
const emit = defineEmits([
  'click',
  'confirm',
  'cancel',
  'open',
  'close',
  'opened',
  'closed',
  'update:show'
])
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  show: {
    type: Boolean,
    default: false
  },
  cancelIsClose: {
    type: Boolean,
    default: true
  },
  cancelBackground: {
    type: String,
    default: 'gray'
  },
  confirmBackground: {
    type: String,
    default: ''
  },
  showCancelButton: {
    type: Boolean,
    default: false
  },
  showConfirmButton: {
    type: Boolean,
    default: false
  },
  confirmButtonText: {
    type: String,
    default: '确定'
  },
  cancelButtonText: {
    type: String,
    default: '取消'
  },
  confirmLoading: {
    type: Boolean,
    default: false
  },
  cancelLoading: {
    type: Boolean,
    default: false
  }
})
const show = useVModel(props, 'show', emit)
const updateShow = (event) => {
  // console.log(event)
  show.value = event
}

// const click = (event) => {
//   emit('click', event)
// }
const confirm = (event) => {
  if (props.confirmLoading) return
  emit('confirm', event)
}
const cancel = (event) => {
  if (props.cancelIsClose) {
    updateShow(false)
  }
  emit('cancel', event)
}
const open = (event) => {
  emit('open', event)
}
const close = (event) => {
  emit('close', event)
}
const opened = (event) => {
  emit('opened', event)
}
const closed = (event) => {
  emit('closed', event)
}
// const buttonColor = useCssVar('--ab-button-main-color')
</script>
<template>
  <VanDialog
    :show="show"
    :show-confirm-button="false"
    close-on-popstate
    teleport="body"
    @update:show="updateShow"
    @confirm="confirm"
    @cancel="cancel"
    @open="open"
    @close="close"
    @opened="opened"
    @closed="closed"
  >
    <slot name="title">
      <div v-if="title" class="abDialogTitleBox">
        <div class="abDialogTitle">{{ title }}</div>
        <div class="van-hairline--bottom"></div>
      </div>
    </slot>

    <div class="abDialogContent">
      <slot name="default">
        {{ message }}
      </slot>
    </div>
    <slot name="footer">
      <div class="abDialogFooter flex-center-between">
        <AbButton
          v-if="showCancelButton"
          :label="cancelButtonText"
          class="abFooterBtn"
          :loading="cancelLoading"
          :disabled="cancelLoading || confirmLoading"
          :background-type="cancelBackground"
          @click="cancel"
        >
          <template #other>
            <slot name="otherCancel"></slot>
          </template>
        </AbButton>
        <AbButton
          v-if="showConfirmButton"
          class="abFooterBtn"
          :label="confirmButtonText"
          :loading="confirmLoading"
          :disabled="cancelLoading || confirmLoading"
          :background-type="confirmBackground"
          loading-type="spinner"
          @click="confirm"
        >
          <template #other>
            <slot name="otherConfirm"></slot>
          </template>
        </AbButton>
      </div>
    </slot>
  </VanDialog>
</template>
<style lang="scss">
.van-dialog {
  top: 50%;
}
.abDialogTitleBox {
  padding: 17px 10px 0;
}
.abDialogTitle {
  margin-bottom: 8px;
  text-align: center;
  font-weight: 600;
  font-size: 15px;
}
.abDialogContent {
  padding: 10px 0;
}
.abDialogFooter {
  padding: 5px 15px 15px;
  .abFooterBtn {
    margin-left: 16px;
    &:first-child {
      margin-left: 0;
    }
  }
}
</style>
