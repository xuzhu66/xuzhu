import Vue from 'vue';
import Tips from '@/plugins/template3/tips/tips';
import LoadingBut from '@/plugins/template3/loading/loadingBut';
import MyDialog from '@/plugins/template3/dialog/dialog' // myDialog
import MyLoading from '@/plugins/template3/loading/loading'

Vue.use(Tips);
Vue.use(MyDialog);
Vue.use(MyLoading);
Vue.component('s-load-but', LoadingBut)

// 模板对应的配置
class TemplageLoader {
    //绑定windows公共变量
    mountGlobalVariable() {
        window.win.tips = Tips;
        window.win.myloading = MyLoading;
        window.win.mydialog = MyDialog;
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
        return this;
    }

    // boot
    bootstrap() {
        return new Promise((resolve, reject) => {
            this.mountGlobalVariable().mountGlobalComponents().mountGlobalVueConfig();
            resolve()
        });
    }
}

// init 参数
TemplageLoader.init = function () {
    return new TemplageLoader();
};

export default TemplageLoader;
