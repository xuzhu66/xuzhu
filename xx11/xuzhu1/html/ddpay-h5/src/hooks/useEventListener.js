
import { onUnmounted } from 'vue'

export function useEventListener(target, name, fn) {
  target.addEventListener(name, fn)

  onUnmounted(() => {
    target.removeEventListener(name, fn)
  })
}
