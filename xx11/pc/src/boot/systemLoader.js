import Vue from 'vue';
import router from '@/router/Router';
import store from '@/store/Store';
import comLoading from '@/plugins/complugin/loading/comLoading' // comLoading
import templateStore from "@/store/comstore/template/templateStore"; // 获取模板
import '@/icons';

import {link, bgImg, ossImg,setBuriedPointFun} from "@m/utils"

// 公共loadding
Vue.use(comLoading);

import lottie from 'vue-lottie'
Vue.component('lottie',lottie)

// 初始化模板
function initTemplate() {
    return new Promise((resolve, reject) => {
        // 1. 模板仓库
        if (!store.state["templateStore"]) {
            templateStore.install(this);
        }
        // 获取模板 --- 模板参数 终端：1、H5  2、PC 3、android 4、ios
        let tempParam = {
            deviceType: 2
        };
        comLoading.show();
        //2. 获取模板
        //store.dispatch("aliOssAct").then(res => {});
        store.dispatch('templateStore/getTemplate', tempParam).then(async res => {
            res.data.templateNumber = 2;
            let template = "template" + res.data.templateNumber; // 模板id res.data.templateNumber
            let theme = "theme" + res.data.styleNumber; // 风格id

            // 3. 设置主题
            window.document.documentElement.setAttribute('data-theme', theme);
            // 4. 加载路由
            let routerConfig = await import(`@/router/${template}/routerConfig`);
            // 5. 加载模板x配置
            let templateLoader = await import(`@/boot/${template}Loader.js`);
            templateLoader.default.init().bootstrap().then(res => {
            })
            //6. 设置路由
            router.addRoutes(routerConfig.default);
            comLoading.hidden();
            resolve();
        });
    });
}

class SystemLoader {
    //绑定windows公共变量
    mountGlobalVariable() {
        window.win = {};
        window.win.vue = Vue;
        window.win.router = router;
        window.win.store = store;
        return this;
    }

    // app公共组件
    mountGlobalComponents() {
        const componentsMap = {};
        Object.keys(componentsMap).map(item => Vue.component(item, componentsMap[item]));
        return this;
    }

    // vue全局参数
    mountGlobalVueConfig() {
        Vue.config.productionTip = false;
        Vue.prototype.$link = link;
        Vue.prototype.$bgImg = bgImg;
        Vue.prototype.$ossImg = ossImg;
        Vue.prototype.$setBuriedPoint = setBuriedPointFun;
        return this;
    }

    // boot
    bootstrap() {
        return new Promise((resolve, reject) => {
            this.mountGlobalVariable().mountGlobalComponents().mountGlobalVueConfig();
            initTemplate().then(() => {
                resolve({router, store});
            })
        });
    }
}

// init 参数
SystemLoader.init = function () {
    return new SystemLoader();
};

export default SystemLoader;
