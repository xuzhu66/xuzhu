import Vue from 'vue'
import App from './App.vue'
import 'lib-flexible/flexible'
import SystemLoader from '@/boot/systemLoader';

Vue.config.productionTip = false
import {  Message } from "element-ui";
Vue.prototype.$message = Message;

// 系统配置加载
SystemLoader.init().bootstrap().then(({router, store}) => {
    // 初始化vue实例
    window.vm = new Vue({
        router,
        store,
        data: {
            eventHub: new Vue()
        },
        render: h => h(App),
    }).$mount('#app')

});
