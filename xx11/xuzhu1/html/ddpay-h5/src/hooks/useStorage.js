
import { useStorage } from '@vueuse/core'

export function useStorageModule(key, value) {
  return useStorage(key, value)
}
