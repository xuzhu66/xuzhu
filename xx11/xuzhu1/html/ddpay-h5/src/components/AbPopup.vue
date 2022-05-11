<script>
export default {
  name: 'AbPopup'
}
</script>
<script setup>
import { defineProps, defineEmits } from 'vue'
import { Popup, Loading } from 'vant'
import { useVModel } from '@vueuse/core'
import AbButton from './AbButton'

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
  cancelWidth: {
    type: String,
    default: ''
  },
  confirmWidth: {
    type: String,
    default: ''
  },
  cancelStyleType: {
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
  position: {
    type: String,
    default: 'bottom'
  },
  closeable: {
    type: Boolean,
    default: false
  },
  closeIconPosition: {
    type: String,
    default: 'top-right'
  },
  confirmPosition: {
    type: String,
    // default: 'bottom-right'
    default: ''
  },
  showTitleBottomLine: {
    type: Boolean,
    default: false
  },
  confirmLoading: {
    type: Boolean,
    default: false
  },
  buttonLayout: {
    type: String,
    default: 'between'
  }
})
const show = useVModel(props, 'show', emit)
const updateShow = (event) => {
  console.log(event)
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
// const confirmPositionClass = ref('')
const setConfirmPosition = () => {
  if (props.confirmPosition === 'topRight') {
    return 'abConfirmPositionTopRight'
  } else if (props.confirmPosition === 'topLeft') {
    return 'abConfirmPositionTopLeft'
  } else {
    return false
  }
}
// const buttonColor = useCssVar('--ab-button-main-color')
</script>
<template>
  <Popup
    :show="show"
    :position="position"
    :closeable="closeable"
    :close-icon-position="closeIconPosition"
    round
    close-on-popstate
    safe-area-inset-bottom
    teleport="body"
    @update:show="updateShow"
    @click-overlay="close"
    @click-close-icon="close"
    @open="open"
    @close="close"
    @opened="opened"
    @closed="closed"
  >
    <div class="abPopupBody">
      <div class="abPopupTitleBox">
        <slot name="title">
          <div class="abPopupBox">
            <div class="abPopupTitle">{{ title }}</div>
            <div v-if="showTitleBottomLine" class="van-hairline--bottom"></div>
          </div>
        </slot>
      </div>

      <div class="abPopupContent">
        <slot name="default">
          {{ message }}
        </slot>
      </div>
      <slot name="footer">
        <div
          v-if="showCancelButton || showConfirmButton"
          class="abPopupFooter"
          :class="buttonLayout"
        >
          <slot name="cancel">
            <AbButton
              v-if="showCancelButton"
              :label="cancelButtonText"
              class="abFooterBtn"
              :background-type="cancelBackground"
              :width="cancelWidth"
              @click="cancel"
            >
              <template #other>
                <slot name="otherCancel"></slot>
              </template>
            </AbButton>
          </slot>
          <AbButton
            v-if="showConfirmButton && !setConfirmPosition()"
            class="abFooterBtn"
            :label="confirmButtonText"
            :loading="confirmLoading"
            :background-type="confirmBackground"
            :width="confirmWidth"
            loading-type="spinner"
            @click="confirm"
          >
            <template #other>
              <slot name="otherConfirm"></slot>
            </template>
          </AbButton>
        </div>
      </slot>
      <div
        v-if="showConfirmButton && setConfirmPosition()"
        :class="setConfirmPosition()"
        class="abPositionConfirmButton"
        @click="confirm"
      >
        <Loading v-if="confirmLoading" size="14px" type="spinner"></Loading>
        <span>{{ confirmButtonText }}</span>
      </div>
    </div>
  </Popup>
</template>
<style lang="scss">
.abPopupTitleBox {
  padding-top: 16px;
}
.abPopupBody {
  display: flex;
  flex-direction: column;
}
//.abPopupBox {
//  padding: 17px 10px 0;
//}
.abPopupTitle {
  margin-bottom: 8px;
  text-align: center;
  font-weight: 600;
  font-size: 15px;
}
.abPopupContent {
  padding: 10px 0;
  flex: 1;
  overflow-y: auto;
  //max-height: 60vh;
  -webkit-overflow-scrolling: touch;
}
.abPopupFooter {
  padding: 5px 15px 15px;
  display: flex;
  align-items: center;
  .abFooterBtn {
    margin-left: 16px;
    &:first-child {
      margin-left: 0;
    }
  }
  &.between {
    justify-content: space-between;
  }
  &.center {
    justify-content: center;
  }
}
.abConfirmPositionTopRight {
  top: 16px;
  right: 16px;
}
.abConfirmPositionTopLeft {
  top: 16px;
  left: 16px;
}
.abPositionConfirmButton {
  position: absolute;
  display: flex;
  align-items: center;
  line-height: 22px;
  color: var(--ab-button-main-color);
  font-size: 12px;
  z-index: var(--van-popup-close-icon-z-index);
}
</style>
