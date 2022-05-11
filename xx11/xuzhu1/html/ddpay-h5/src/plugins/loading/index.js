// loading.js
import { createVNode, render } from 'vue'
import LoadingComponent from './loading.vue'
let $data

export default {
  install: (app) => {
    if (!$data) {
      // LoadingComponent 为自己写的组件
      $data = createVNode(LoadingComponent, {}, {
        default: () => createVNode()
      })
      $data.appContext = app._context // 这句很关键，关联起了数据
      render($data, document.body)
    }
    $data.component.ctx.setShow = false

    const loading = {
      show() {
        $data.component.ctx.show()
      },
      hide() {
        $data.component.ctx.hide()
      }
    }

    if (!app.$loading) {
      app.$loading = loading
    }

    app.config.globalProperties.$loading = app.$loading
  }
}
