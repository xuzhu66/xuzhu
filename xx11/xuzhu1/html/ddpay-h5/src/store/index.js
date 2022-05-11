/**
 * @description 导入所有 vuex 模块，自动加入namespaced:true，用于解决vuex命名冲突，请勿修改。
 */
import { createPinia } from 'pinia'

const pinia = createPinia()

export function setupStore(app) {
  app.use(pinia)
}

export default pinia
