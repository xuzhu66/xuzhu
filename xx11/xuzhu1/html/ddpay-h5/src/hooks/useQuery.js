import { reactive, toRefs } from 'vue'
import router from '@/router'
// import { useClipboard } from '@vueuse/core'
import { Toast } from 'vant'
import { copyText as copyTextVue } from 'vue3-clipboard'

export function pushWithQuery(name, query) {
  // const router = useRouter()
  router.push({
    name: name,
    query: {
      ...query
    }
  })
}

export function replaceWithQuery(name, query) {
  // const router = useRouter()
  router.replace({
    name: name,
    query: {
      ...query
    }
  })
}
export function hasHistory() {
  return window.history.length > 2
}
export function goBack(fromUrl) {
  if (typeof fromUrl === 'string') {
    router.push({ path: fromUrl })
  } else {
    if (hasHistory()) {
      router.back()
    } else {
      router.push({ path: '/' })
    }
  }
}

export function useQuery() {
  const state = reactive({
    otherQuery: {},
    redirect: undefined
  })

  return {
    setQuery: (newValue) => {
      state.otherQuery = newValue
    },
    setRedirect: (newValue) => {
      state.redirect = newValue
    },
    queryState: toRefs(state)
  }
}

export function getOtherQuery(query) {
  return Object.keys(query).reduce((acc, cur) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur]
    }
    return acc
  }, {})
}

export function copyText(textParams) {
  // const { copy } = useClipboard()
  // copy(textParams).then(() => {
  //   Toast('复制成功')
  // })
  // navigator.clipboard.writeText(textParams).then(() => {
  //   Toast('复制成功')
  // })
  copyTextVue(textParams, undefined, (error, event) => {
    if (error) {
      // alert('Can not copy')
      // console.log(error)
    } else {
      Toast('复制成功')
      // alert('Copied')
      // console.log(event)
    }
  })
  // const clipboard = new Clipboard('.wallet')
  // clipboard.on('success', (e) => {
  //   Toast('复制成功')
  //   // 释放内存
  //   clipboard.destroy()
  // })
  // clipboard.on('error', (e) => {
  //   // 不支持复制
  //   console.log('该浏览器不支持自动复制', e)
  //   // 释放内存
  //   clipboard.destroy()
  // })
}

export function downloadFile(id, name) {
  const dataURL = document.getElementById(id).toDataURL()
  const a = document.createElement('a')
  a.download = name || 'download'
  a.href = dataURL
  document.body.append()
  a.click()
  a.remove()
}
