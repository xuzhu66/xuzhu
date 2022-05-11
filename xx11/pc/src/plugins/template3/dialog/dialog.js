import Dialog from './dialogView'
import storeObject from '@/store/Store'

const MYDIALOG = {
    install(Vue) {
        // vue
        if (document.getElementsByClassName('.dialog-effect-wrap').length) return
        if (typeof window !== 'undefined' && window.Vue) {
            Vue = window.Vue
        }
        // 全局组件
        Vue.component('MyDialog', Dialog);

        // 方法
        function msg(type, text, callBack,closeFun) {
            let msg, title, conClass, btnTextLeft, btnTextRight, showTopClose, leftBut, rightBut, urlLeft, urlRight,actionRight, actionLeft, curTemp, diatxtClass,page;
            // 1 组装参数
            if (typeof text === 'string') {
                msg = text
            } else if (text instanceof Object) {
                msg = text.con || ''
                if (text.title) {
                    title = text.title
                }
                if (text.conClass) {
                    conClass = text.conClass
                }
                if (text.btnTextLeft) {
                    btnTextLeft = text.btnTextLeft
                }
                if (text.btnTextRight) {
                    btnTextRight = text.btnTextRight
                }
                if (text.showTopClose) {
                    showTopClose = text.showTopClose
                }
                if (text.urlLeft) {
                    urlLeft = text.urlLeft
                }
                if (text.urlRight) {
                    urlRight = text.urlRight
                }
                if (text.curTemp) {
                    curTemp = text.curTemp
                }
                leftBut = text.leftBut
                rightBut = text.rightBut

                actionRight = text.actionRight
                actionLeft = text.actionLeft
                diatxtClass = text.diatxtClass
            }

            //2 创建vue对象
            let VueDialog = Vue.extend({
                render(h) {
                    let props = {
                        text: msg, // 内容
                        title: title, // 标题
                        btnTextLeft: btnTextLeft, // 左边按扭文字
                        btnTextRight: btnTextRight, // 右边按扭文字
                        conClass: conClass, // 内容样式
                        showTopClose: showTopClose, // 是否显示标题处关闭图标
                        leftBut: leftBut, // 左边按扭是否白底
                        rightBut: rightBut, // 右边按扭是否白底
                        urlLeft: urlLeft, // 左边连接
                        urlRight: urlRight, // 右边连接
                        actionRight: actionRight,
                        actionLeft: actionLeft,
                        diatxtClass: diatxtClass,
                        curTemp: curTemp, // 当前组件模板
                        cb: callBack,
                        closeFun:closeFun,// 关闭回调
                    }
                    return h('MyDialog', {props})
                },
                data() {
                    return {
                        show: false
                    }
                }
            })
            let newDialog = new VueDialog({store: storeObject});
            let vm = newDialog.$mount();
            let el = vm.$el;

            // 3. 方法
            if (type == "show") {
                let dialogTpl = document.getElementById("dialogEffect");
                if (dialogTpl) {
                    document.body.removeChild(dialogTpl);
                }
                document.body.appendChild(el) // 把生成的提示的dom插入body中
                vm.show = true;
            }
            // 3. 删除方法
            if (type == "hidden") {
                callBack && (typeof callBack === 'function') && callBack();
                closeFun && (typeof closeFun === 'function') && closeFun();
                newDialog.$destroy();
                vm = null; // 设置为null，好让js垃圾回收算法回收，释放内存
                document.getElementById("dialogBox").setAttribute("class", "dialog-box dialog-closebox");
                document.getElementById("bg").setAttribute("class", "bg dialog-fadeOut");
                setTimeout(() => {
                    let dialogTpl = document.getElementById("dialogEffect");
                    if (dialogTpl) {
                        return document.body.removeChild(dialogTpl)
                    }
                }, 500)
            }
        }

        // 接口
        Vue.prototype.$myDialog = (text, callBack,closeFun) => {
            msg('show', text, callBack,closeFun);
        }
        Vue.prototype.$myDialog.hidden = (callBack,closeFun) => {
            msg('hidden', {}, callBack,closeFun)
        }

        // 属性
        this.show = function (text, callBack,closeFun) {
            msg('show', text, callBack,closeFun);
        }
        this.hidden = function (callBack,closeFun) {
            msg('hidden', {}, callBack,closeFun)
        }
    }
}
export default MYDIALOG
