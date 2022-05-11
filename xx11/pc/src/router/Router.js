import Vue from 'vue';
import Router from 'vue-router';
import {getToken} from '@m/auth';
import store from '../store/Store'

Vue.use(Router);

const router = new Router({
    base: process.env.BASE_URL,
    linkActiveClass: 'active',
    linkExactActiveClass: 'active',
});

// 路由监听
router.beforeEach((to, from, next) => {
    let token = getToken();
    // 判断路由是否是取款,如果是则判断取款前置要求;
    next();
    // if (to.path == '/center/draw') {
    //     if (window.win.store.state.drawStore) {
    //         window.win.store.dispatch("drawStore/checkDrawAction").then(res => {
    //             if (res && res.success) {
    //                 next();
    //             } else {

    //             }
    //         })
    //     } else {
    //         next();
    //     }
    // } else {
    //     next();
    // }
})

export default router;
