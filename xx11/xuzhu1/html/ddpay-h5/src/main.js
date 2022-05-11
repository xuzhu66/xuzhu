import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { Toast } from 'vant'
import './assets/styles/common.scss'
import loading from '@/plugins/loading'
// import '@vant/touch-emulator'

const app = createApp(App)
app.use(loading)// 自定义的加载中loading
app.use(router)
app.use(createPinia())
app.config.globalProperties.$toast = Toast

window.vm = app
app.mount('#app')
