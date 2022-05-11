
import { computed } from 'vue'

export function useVModel(props, name, emit) {
  return computed({
    get() {
      return props[name]
    },
    set(v) {
      emit(`update:${name}`, v)
    }
  })
}
