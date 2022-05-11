/**
 * Author: Fay(tigertop001@gmail.com)
 * Date: 2020/2/4
 * Last Modified by: Fay
 * Copyright (c) 2020, HuaSheng, Inc.
 * Description: 请求工具
 */
import {Base64} from 'js-base64';
import axios from "axios";
import {removeToken, removeRefresToken, getToken} from "@m/auth";
import website from '@/config/website';
// 创建axios实例
// const isEnv = process.env.NODE_ENV;
// let baseUrl = "";
// if (isEnv != "dev") {
//   // baseUrl = process.env.VUE_APP_API;
//   baseUrl= WGURL.api;
// }
const service = axios.create({
    // xhrFields: {
    //   withCredentials: true
    // },
    // crossDomain: true,
    // baseURL: baseUrl, // api 的 base_url
    // baseURL: process.env.VUE_APP_API, // api 的 base_url
    timeout: 300000 // 请求超时时间
});

service.interceptors.request.use(
    config => {
        config.headers['Accept'] = 'application/json;charset=UTF-8';
        let authr = Base64.encode(`${website.clientId}:${website.clientSecret}`);
        config.headers.Authorization = `Basic ${authr}`;
        config.headers['Identity-Type'] = "player";
        config.headers['saas-version'] = "1.37.0";
        let dom = window.location.host
        // dom = 'laosanchen.com'
        //dom = 'saas.test1.h5f.adre45.com'
        // dom = 'b.gdr5g65.com'
        // dom = 'saas.test1.h5b.adre45.com'
        config.headers['Origin-Domain'] = dom;
        if (window.win.store.getters.token) {
            config.headers['Saas-Auth'] = `bearer ${window.win.store.getters.token}`;
        } else {
            if (getToken()) {
                config.headers['Saas-Auth'] = `bearer ${getToken()}`;
                window.win.store.commit("set_token", getToken());
            }
        }
        return config;
    },
    error => {
        Promise.reject(error);
    }
);

service.interceptors.response.use(
    response => {
        let res = response.data;
        if (res.success == false) {
            let outCodeArr = [10001, 10002, 10003, 10004, 10005, 401, 10006]; // 未登入
            let code = parseInt(res.code)

            // 如果有这些错误码 且 不是在首页和优惠活动的话; ?
            if (outCodeArr.includes(code)) {
                removeToken();
                removeRefresToken();
                window.win.store.commit("set_token", "");
                // 重置页面数据
                window.win.store.dispatch("headerStore/resetPageStateAction")
                window.win.store.commit("set_refresToken", "");
                window.win.store.commit('set_userId', '') // 用户ID

                let msg = res.msg;
                if (code == 10001 || code == 401) {
                    msg = "未登录,请先登录";
                }
                if (code == 10002) {
                    msg = "登录已超时，请您重新登录，谢谢！";
                }

                // 关闭进入游戏弹框
                if (this.$store.state["gameStore"]) {
                    window.win.store.commit('gameStore/set_showPickPlay', false);
                } else {
                    window.win.store.commit('gameStore/set_showPickPlay', false);
                }

                // 关闭取款提示弹框
                window.win.store.commit('drawStore/SET_SHOW_JUMP_DIALOG', false);
                window.win.mydialog.show({con: msg, btnTextLeft: "去登录"}, () => {
                    window.win.router.push('/')
                    window.win.store.commit('set_showLogin', true)
                    window.win.store.commit("loginRegStore/set_curTemp", 'login')
                });

                return res;
            }
        }
        return res;
    },
    error => {
        if (error.response.status == 401) {
            removeToken();
            removeRefresToken();
            window.win.store.commit("set_token", "");
            window.win.store.commit("set_refresToken", "");
            // 关闭进入游戏弹框
            window.win.store.commit('gameStore/set_showPickPlay', false);
            // 关闭取款提示弹框
            window.win.store.commit('drawStore/SET_SHOW_JUMP_DIALOG', false);
            window.win.store.commit('set_userId', '') // 用户ID
            //window.win.store.commit('homeStore/set_processedUsername', '') // 用户ID
        }
        window.win.myloading.hidden();
        return Promise.reject(error);
    }
);
export default service;
