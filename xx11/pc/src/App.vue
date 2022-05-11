<template lang="pug">
    #app(@scroll.passive="getScroll($event)")
        transition
            router-view
</template>

<script>

import {mapMutations, mapState} from 'vuex';
import {getUrlParam, createUUid, getQueryVariable} from '@m/utils' // 工具类

export default {
    name: 'App',
    components: {},
    computed: {
        ...mapState({
            cnzz: state => state.cnzz, // cnzz统计
        }),
    },
    data() {
        return {
            transitionName: 'slide-right',
        };
    },
    watch: {
        cnzz: {
            handler(newValue) {
                if (newValue != '') {
                    this.createCnzzJs()
                }
            },
            immediate: true
        }
    },
    created() {
        this.getUuidFun()
    },
    mounted() {
        this.getParam();
    },
    methods: {
        ...mapMutations({
            // 设置uuid
            setUuidFun(commit, param) {
                return commit('SET_UUID', param);
            }
        }),
        getCNZZjs() {
            let url = this.cnzz
            if (!url) {
                return;
            }
            let cnzz = document.getElementById('cnzz');
            if (cnzz) return
            const s = document.createElement('script');
            s.type = 'text/javascript';
            s.id = 'cnzz';
            s.async = "async";
            s.defer = true;
            s.src = url;
            document.body.appendChild(s);

            window.dataLayer = window.dataLayer || [];
            let arr = url.split('?id=G-');

            function gtag() {
                dataLayer.push(arguments);
            }

            gtag('js', new Date());
            gtag('config', arr[1]);
        },
        // 创建cnzz入口
        createCnzzJs() {
            if(!this.cnzz) return;
            // let cnzz = 'https://sdk.51.la/js-sdk-pro.min.js?id=asdf&ck=Jd6P9B0TazaH52mO&type=51'
            // let cnzz = '["https://sdk.51.la/js-sdk-pro.min.js?id=asdf&ck=Jd6P9B0TazaH52mO&type=51","https://dss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/js/lib/jquery-1-edb203c114.10.2.js"]'
            let cnzz = this.cnzz.replace(/'/g,'"')
            let cnzzList = ''
            let type = 0;// 0 单条记录 1: 多条记录
            if (cnzz.indexOf(']') != -1) {
                cnzzList = cnzz && JSON.parse(cnzz)
                if (Array.isArray(cnzzList) && cnzzList.length) {
                    type = 1
                }
            }
            // 如果是数组
            if (type) {
                cnzzList.forEach(item => {
                    this.cnzzFillter(item)
                })
            } else {
                this.cnzzFillter(cnzz)
            }
        },
        cnzzFillter(url) {
            let type = getQueryVariable(url, 'type')
            let id = 'cnzzId'
            let ck = ''
            // 如果是51 cnzz
            if (type == '51') {
                id = getQueryVariable(url, 'id')
                ck = getQueryVariable(url, 'ck')
                this.createJs(url, id, () => {
                    window.LA && window.LA.init({id: id, ck: ck})
                })
            } else {
                //普通统计
                this.createJs(url, id, ck)
            }
        },
        // 动态创建js
        createJs(url, id, cbFun) {
            console.log(url,id);
            let scriptObj = document.createElement('script');
            scriptObj.type = 'text/javascript';
            scriptObj.id = id ? id : 'cnzzId';
            scriptObj.src = url;
            scriptObj.async = "async";
            scriptObj.defer = true;
            //document.body.appendChild(scriptObj);
            document.getElementsByTagName('head')[0].appendChild(scriptObj);   //塞进页面
            // js 回调
            scriptObj.onload = () => {
                cbFun ? cbFun() : ''
            }
        },
        // 获取51cnzz
        get51CnzzFun() {
            if (this.cnzz) {
                let id = getQueryVariable(this.cnzz, 'id') || 'cnzz'
                let ck = getQueryVariable(this.cnzz, 'ck')
                this.createJs(this.cnzz, id, () => {
                    window.LA && window.LA.init({id: id, ck: ck})
                })
            }
        },
        getParam() { // 获取url参数
            let sourceId = getUrlParam('source');
            if (sourceId && sourceId.indexOf("#")) {
                sourceId = sourceId.split("#")[0]
            }
            if (sourceId) this.$store.commit('SET_SOURCEID', sourceId);
            let rebaId = getUrlParam('code');
            if (rebaId && rebaId.indexOf("#")) {
                rebaId = rebaId.split("#")[0]
            }
            if (window.location.href.indexOf('code') >= 0) {
                if (!rebaId) {
                    rebaId = window.location.href.split("code=")[1]
                }
            }
            if (rebaId) this.$store.commit('SET_REBAID', rebaId);
            let tcode = getUrlParam('tcode');
            if (tcode && tcode.indexOf("#")) {
                tcode = tcode.split("#")[0]
            }
            if (tcode) {
                this.getLogon(tcode)
            }
        },
        getLogon(tcode) {
            this.$store.dispatch("getLogon").then(res => {
                if (!res.data.playerId) {
                    this.login(tcode)
                }
            });
        },
        login(code) { // 登录
            let param = {
                grant_type: "pin_code", // 授权码
                code: code, // // 手机验证码
                scope: "all", // 授权范围
            };
            this.$store.dispatch("login", param).then(res => {
            });
        },
        getScroll(event) {
            this.$store.dispatch('getScroll', event)
        },

        // 页面后台功能开发-- 未完成
        // 1. 获取document.hidden属性 document.hidden: true 隐藏状态 false 激活状态
        _getHiddenProp() {
            let prefixes = ['webkit', 'moz', 'ms', 'o'];
            // 如果hidden 属性是原生支持的，我们就直接返回
            if ('hidden' in document) {
                return 'hidden';
            }
            // 其他的情况就循环现有的浏览器前缀，拼接我们所需要的属性
            for (let i = 0; i < prefixes.length; i++) {
                // 如果当前的拼接的前缀在 document对象中存在 返回即可
                if ((prefixes[i] + 'Hidden') in document) {
                    return prefixes[i] + 'Hidden';
                }
            }
            // 其他的情况 直接返回null
            return null;
        },
        // 2. 获取document.visibilityState属性
        _getVisibilityState() {
            let prefixes = ['webkit', 'moz', 'ms', 'o'];
            if ('visibilityState' in document) {
                return 'visibilityState';
            }
            for (let i = 0; i < prefixes.length; i++) {
                if ((prefixes[i] + 'VisibilityState') in document) {
                    return prefixes[i] + 'VisibilityState';
                }
            }
            return null;
        },
        // 注册hidden事件
        _initHiddenEvent() {
            let that = this;
            let visProp = this._getHiddenProp();
            if (visProp) {
                // 有些浏览器也需要对这个事件加前缀以便识别。
                var evtname = visProp.replace(/[H|h]idden/, '') + 'visibilitychange';
                document.addEventListener(evtname, function () {
                    //console.log(document[this._getVisibilityState()]);
                    // 页面非激活
                    if (document[visProp]) {
                    } else {
                        // 页面激活
                        // 1. 先判断用户是否登录,判断用户id是否存在; 或者用户的token是否存在;
                        if (that.$store.state.userId != '') { // 用户已经登录
                            that.$store.dispatch("getLogon").then(res => {
                                //2. 判断用户登录是否超时;
                                if (!res.data.playerId) {
                                    that._showLogin();
                                }
                            });
                        }
                    }
                }, false);
            }
        },
        _showLogin() {
            this.$store.commit('set_showLogin', true)
            this.$store.commit("loginRegStore/set_curTemp", 'login')
        },
        getUuidFun() {
            let uuid = createUUid();
            this.setUuidFun(uuid);
        }
    }
}
</script>
<style lang="stylus" scoped>
#app {
    margin 0px auto
    height 100%
    width 100%
    position relative
    overflow-x hidden
}
</style>
