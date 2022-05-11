import { ref, unref } from 'vue'

export function useFetch(url) {
  const data = ref('')
  const error = ref('')

  fetch(unref(url))
    .then((r) => r.json())
    .then((r) => (data.value = r))
    .catch((e) => (error.value = e))

  return {
    data,
    error
  }
}
