import request from '@m/request'
import {deletObjKey} from '@js' // 工具类

// 获取首页banner -- 公共
export function getBannerList(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-system/template2/front/tenantPlatTypeLobbyPcBannerManage/list',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 获取 类型大厅线路 seatType: 0 首页 1 真人娱乐 2 棋牌游戏 3 电子游戏 4 捕鱼游戏 5 彩票投注 6 电子竞技 7 体育投注 8 优惠活动
export function getGameList(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-system/template2/front/tenantPlatTypeLobbyLineManage/list',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 获取首页热门推荐  type 类型： 1、首页热门推荐 2、首页热门游戏 3、首页热门优惠 4、洗码代理banner
export function getHotList(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-system/template2/front/tenantPlatPcImgManage/list',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 关于我们
export function getAboutUs(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-system/template2/front/tenantPlatAboutUsManage/list',
        method: 'post',
        data: deletObjKey(param)
    })
}


