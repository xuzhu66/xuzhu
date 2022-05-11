import { ref, watch } from 'vue'

export function useTitle(newTitle) {
  const title = ref(newTitle ?? document?.title ?? null)

  watch(
    title,
    (t, o) => {
      if (t != null) {
        document.title = t
      }
    },
    { immediate: true }
  )

  return title
}
