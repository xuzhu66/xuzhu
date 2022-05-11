import { ref, watch } from 'vue'
import { isArray } from '@/utils/validate'

export function selectFilterName(keyVal, arrVal, option) {
  // console.log(key)
  // console.log(arr)
  // arr = unref(arr)
  // console.log(keyVal)
  // console.log(arrVal)
  const key = ref(keyVal)
  const arr = ref(arrVal)
  const name = ref('')
  if ((key.value ?? '') === '') return name
  if (!isArray(arr.value)) return name
  let obj
  const keyProp = option?.key || 'key'
  const valueProp = option?.value || 'value'
  const runRs = () => {
    for (let i = 0; i < arr.value.length; i++) {
      // console.log(arr.value[i])
      if (arr.value[i][keyProp] == key.value) {
        name.value = arr.value[i][valueProp]
        obj = arr.value[i]
        // console.log(name.value)
      }
    }
    if (option?.type == 'obj') {
      return obj
    }
  }
  runRs()

  watch(
    key,
    (t) => {
      if (t) {
        runRs()
      }
    },
    { immediate: true }
  )
  watch(
    arr,
    (t) => {
      if (t) {
        runRs()
      }
    },
    { immediate: true }
  )
  // console.log(name)
  return name
}
