import request from '@m/request'
import qs from 'qs';
import {deletObjKey} from '@m/utils' // 工具类
import {getFingerprintFun } from '@/module/utils'

export function platInfo(param) { // 平台信息查询
    let obj = deletObjKey(param);
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/search/platInfo',
        method: 'post',
        data: deletObjKey(param)
    })
}

export function getLogo(param) { // 获取Logo
    return request({
        baseUrl: '/',
        url: '/api/saas-system/front/tenantPlatLogoManage/get',
        method: 'post',
        data: param
    })
}

export function getBroadcastNotice(param) { // 获取轮播消息查询
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/search/broadcastNotice',
        method: 'post',
        data: param
    })
}

export function homeBanner(param) { // 首页轮播 查询
    return request({
        baseUrl: '/',
        url: '/api/saas-system/front/tenantPlatTypeLobbyPcBannerManage/list',
        method: 'post',
        data: param
    })
}

export function gameBanner(param) { // 游戏分类Banner 查询
    return request({
        baseUrl: '/',
        url: '/api/saas-system/front/tenantPlatTypeLobbyPcImgManage/list',
        method: 'post',
        data: param
    })
}

export function getPlatGame(param) { // 获取游戏平台列表
    return request({
        baseUrl: '/',
        url: '/api/saas-system/front/tenantPlatH5ImgManage/list',
        method: 'post',
        data: param
    })
}

export function gameLogin(param) { // 游戏登入，游戏平台登入
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/third/login',
        method: 'post',
        data: deletObjKey(param)
    })
}

export function getLateGame(param) { // 获取最近列表
    return request({
        baseUrl: '/',
        url: '/api/saas-system/front/tenantPlatH5BannerManage/selectRecently',
        method: 'post',
        data: param
    })
}

export function getHomePerInfo(param) { // 查询会员简易资料
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/get/brief/personalInfo',
        method: 'post',
        data: param
    })
}

export function getCustomerUrl(param) { // 联系客服
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/search/onlineCustomerServiceInfo',
        method: 'post',
        data: param
    })
}

export function getHeaderIntroduce(param) { // 获取头部信息
    return request({
        baseUrl: '/',
        url: '/api/saas-system/front/tenantPlatIntroduceManage/get',
        method: 'post',
        data: param
    })
}

export function getTemp(param) { // 获取模板
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/search/platTemplateInfo',
        method: 'post',
        data: deletObjKey(param)
    })
}

export function getPopNotice(param) { // 弹出框消息查询
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/get/popNotice',
        method: 'post',
        data: param
    })
}

export function getHot(param) { // 查询首页热门
    return request({
        baseUrl: '/',
        url: '/api/saas-system/front/tenantPlatPcImgManage/list',
        method: 'post',
        data: param
    })
}

export function checkPlanState(data) { // 检查游戏线路是否在维护之中
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/gameline/status/check',
        method: 'post',
        data: data
    })
}

export function login(param) { // 玩家登入
    let tid = param.tid;
    param.deviceKey = getFingerprintFun();
    return request({
        baseUrl: '/',
        url: '/api/saas-auth/oauth/token',
        method: 'post',
        headers:{
            "tid":tid
        },
        data: qs.stringify(deletObjKey(param))
    })
}

export function checkAcount(param) { // 检查玩家账号、手机号码是否存在
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/check/accountOrMobile',
        method: 'post',
        data: deletObjKey(param)
    })
}

export function updatePwd(data) { // 保存修改密码
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/update/pwd',
        method: 'post',
        data: data
    })
}

export function playerRegister(param) { // 玩家注册
    let tid = param.tid
    param.deviceKey = getFingerprintFun();
    return request({
        baseUrl: '/',
        url: '/api/saas-player-register/pc/player/reg/player',
        method: 'post',
        headers:{
            "tid":tid
        },
        data: deletObjKey(param)
    })
}

export function verifyCode(param) { // 验证码
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/get/verifyCode',
        method: 'post',
        data: deletObjKey(param)
    })
}

export function getLogon(param) { // 判断用户是否登录
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/getlogon',
        method: 'post'
    })
}


export function activityViwe(param) { // 优惠活动详情
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/activityViwe',
        method: 'post',
        data: param
    })
}

export function articleViweApi(data) { // 文章详情
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/articleViwe',
        method: 'post',
        data: data
    })
}

export function preferType() { // 活动类型
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/activityType',
        method: 'post'
    })
}

export function preferList(data) { // 活动列表
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/activitylist',
        method: 'post',
        data: data
    })
}

// export function homeBanner(param) { // 首页轮播 查询
//   return request({
//     baseUrl: '/',
//     url: '/api/saas-system/front/tenantPlatH5BannerManage/list',
//     method: 'post',
//     data: param
//   })
// }
export function toEGameList(param) { // 登入电子大厅
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/search/gameline/egames',
        method: 'post',
        data: deletObjKey(param)
    })
}

export function loveGames(param) { // 收藏游戏
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/op/gameline/loveegames',
        method: 'post',
        data: deletObjKey(param)
    })
}

export function logOut() { // 玩家退出
    return request({
        baseUrl: '/',
        url: '/api/saas-auth/oauth/logout',
        method: 'post',
    })
}

export function getGamelines() { // 查询无第三方大厅线路
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/search/self/gamelines',
        method: 'post',
    })
}

export function withdrawalVerif() { // 取款校验
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet//bank-card',
        method: 'post'
    })
}

export function vipChangeRule(data) { // vip升降规则信息
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/get/vipChangeRule',
        method: 'post',
        data: data
    })
}

export function regBanner(data) { // 注册登入banner
    return request({
        baseUrl: '/',
        url: '/api/saas-system/front/tenantPlatRegistBannerManage/list',
        method: 'post',
        data: data
    })
}


// 个人中心 -- 查询会员资料
export function getUserInfo(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/get/personalInfo',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心-- 个人资料 -- 省市查询（公共）
export function getProvicesOrCities(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/search/provicesOrCities',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心-- 个人资料 -- 银行卡管理 -- 银行列表查询
export function getBankInfo(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/search/bankInfo',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心-- 个人资料 -- 银行卡管理 -- 设置银行卡(新增银行卡）
export function addBank(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/add/bankCard',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心-- 个人资料 -- 银行卡管理 -- 设置银行卡(修改银行卡）
export function updateBank(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/update/bankCard',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心-- 个人资料 -- 银行卡管理 -- 查询银行卡信息
export function getBankDetail(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/search/personalBankCards',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心-- 个人资料 -- 银行卡管理 -- 查询会员银行卡限制数量
export function getBankLimitNumber(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/get/bankcards/limitcounts',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心-- 个人资料 -- 密码管理-- 保存登录密码
export function setLoginPwd(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/save/loginPwd',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心-- 个人资料 -- 密码管理-- 检查提款密码是否已设置
export function checkDrawPwd(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/check/withdrawpwd',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心-- 个人资料 -- 密码管理-- 保存取款密码
export function setDrawPwd(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/save/withdrawPwd',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心-- 个人资料 --  基本资料-- 查询个人资料
export function getPersonalInfo(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/get/personalInfo',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心-- 个人资料 --  基本资料-- 完善个人资料
export function setPersonInfo(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/save/personInfo',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心--个人资料--手机管理-- 完善手机号码
export function updateMobile(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/save/personMobile',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心--个人资料--手机管理-- 短信验证码
export function getMobileVerifyCode(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/get/verifyCode',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心--个人资料--收货地址-- 查询收货地址
export function getDeliveryAddresses(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/search/deliveryAddresses',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心--个人资料--收货地址-- 查询会员收货地址限制数量
export function getAddressesLimitNumber(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/get/deiveryaddress/limitcounts',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心--个人资料--收货地址--修改收货地址
export function updateAddresses(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/update/deliveryAddresses',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心--个人资料--收货地址--新增收货地址
export function addAddresses(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/add/deliveryAddresses',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心--个人资料--个人资金明细查询
export function getPersonalAmountDetail(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/search/personalAmountDetail',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心--钱包-- 一键回收
export function turnInAllwallet(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/turn-out',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心--存款-- 存款类型
export function getDepositTypeApi(param) {
    return request({
        baseUrl: '/',
        url: '/api//saas-player/pc/wallet/pay/bigtype',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心--存款--付款方式
export function getDepositListApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/pay/method',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心--存款--立即存款
export function depositSubmit(param) {
    // device(终端类型):1、H5 2、PC 3、android 4、ios
    param.device = 2;
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/deposit',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心--提款--单笔最高限额
export function withdrawRuler(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/withdrawRulerNew',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心--提款--提款校验
export function drawValidate(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/bank-card',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心--提款--确认提款
export function drawSubmit(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/drawing',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心--提款--查询银行卡信息
export function getBankCards(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/search/personalBankCards',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心--转账--转账
export function transferSubmit(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/transfer',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心--转账--一键转入
export function transferAllSubmit(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/to-change',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心--转账-- 线路
export function getLineList(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/line-list',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心--交易记录-- 交易记录
export function getTransactionsList(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/transactions',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心--交易记录-- 交易记录详情
export function getTransactionsDetail(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/transactions-viwe',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心--交易记录-- 银行卡转账详情
export function getBankTransferDetail(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/bankTransfer',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心--交易记录-- 银行卡订单取消订单
export function cancelDeposit(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/cancelDeposit',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心--交易记录--  资产总览
export function getAssets(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/assets',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心--投注记录--  注单线路
export function getBettingLine(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/line-betting',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心--投注记录-- 投注记录
export function getBettingList(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/betting-page',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心--投注记录-- 投注记录总计
export function getBettingAmount(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/betting-amount',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心--投注记录-- 洗码记录
export function getWashingList(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/code-washing-page',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心-- 优惠记录--  优惠记录
export function getActivityList(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/activity-page',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心-- 优惠记录--  奖品总价值
export function getActivityAmount(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/activity-amount',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心-- 高级代理人--  代理统计
export function getgentStatistics(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/agentStatistics',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心-- 高级代理人--  申请代理
export function agentApply(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/agentApply',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心-- 高级代理人--  申请代理banner图片查询
export function getAgentBanner(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-system/front/tenantPlatPcImgManage/list',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心-- 高级代理人--  代理计算
export function agentCalculation(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/agentCalculation',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心-- 高级代理人--  下线会员 -- 不删除参数;
export function suborMember(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/suborMember',
        method: 'post',
        data: param
    })
}

// 个人中心-- 高级代理人-- 运营分析
export function operationAnalysis(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/operationAnalysis',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心-- 高级代理人-- 累计返水总金额
export function suborMemberAmount(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/suborMemberAmount',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心-- 高级代理人-- 共计
export function operationAnalysisAmount(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/operationAnalysisAmount',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心-- 消息中心-- 消息中心列表查询
export function getMsgList(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/search/tenantPlatNoticeList',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心-- app下载
export function getAppDownLoad(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-system/front/appDowload/getAppDownload',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心 -- 查询vip升降级信息
export function getVipChangeRule(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/get/vipChangeRule',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人信息-简易资料-中心钱包
export function getEasyUserInfo(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/get/brief/personalInfo',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 获取线路余额
export function getLineBalance(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/line/balance',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 查询银行卡归属地
export function checkBankCardApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/obtain/bankCard',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 存款页面查询活动列表
export function getDescountListInDepositPageApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/front/activity/firstDeposit/list',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 获取平台角标
export function getPageIconApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/front/platHeader/get',
        method: 'post',
        data: deletObjKey(param)
    })
}


// 获取虚拟币协议
export function getProtocolListApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/findProtocolByCurrency',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 虚拟币保存
export function virtualSubmitApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/virDeposit',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 虚拟币订单详情
export function getVirtualDetailApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/virDepositDetail',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 欢迎页面
export function getWelcomeDetailApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-system/front/platRegistWelcomeConfigManage/list',
        method: 'post',
        data: deletObjKey(param)
    })
}
// 交易记录总计
export function getTransactionsAmountApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/transactionsAmount',
        method: 'post',
        data: deletObjKey(param)
    })
}
// 发送验证码
export function sendTelephoneCodeApi(param) { // 验证码
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/get/verifyCode',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 提款完善资料
export function withdrawalInfo(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/get/check/savewithdrawal/info',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 虚拟币币种及其下面协议查询
export function findUsdtProto() {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/virbank/vircurrency/protoco/find',
        method: 'post'
    })
}

// 查询虚拟币帐户
export function getvirAcountList() {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/virbank/getvirbank/list',
        method: 'post'
    })
}


// 新增虚拟币帐户
export function addvirAcount(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/virbank/addvirbank',
        method: 'post',
        data: deletObjKey(param)
    })
}

//修改虚拟币帐户
export function updateVirAcount(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/virbank/updatevirbank',
        method: 'post',
        data: deletObjKey(param)
    })
}

// 个人中心-- 个人资料 -- 虚拟卡管理 -- 查询虚拟卡限制数量
export function getUsdtLimitNumber(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/virbank/limitcounts',
        method: 'post',
        data: deletObjKey(param)
    })
}


// 个人中心-- 取款--人民币或虚拟币取款
export function getDrawingBtnsShow() {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/drawingBtnsShow',
        method: 'post'
    })
}

// 个人中心-- 取款--查询虚拟币列表
export function getVirBankList(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/virbank/getvirbank/conditioned/list',
        method: 'post',
        data: param
    })
}


// 个人中心-- 取款--查询虚拟币汇率
export function getVirRate(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/virbank/vircurrency/rate/find',
        method: 'post',
        data: param
    })
}

// 个人中心-- 取款--虚拟币取款
export function virWithdrawal(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/virdrawing',
        method: 'post',
        data: param
    })
}

// 首页头部--菜单列表
export function gameMenuListApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-system/front/platTemplateHomeMenu/list',
        method: 'post',
        data: param
    })
}

// 首页头部--获取微信变更
export function getWechatChangeApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/find/followinfo/wx',
        method: 'post',
        data: param
    })
}


// 首页头部--合营代理申请
export function cooperateAgentApplyApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/player/cooperateAgentApply',
        method: 'post',
        data: param
    })
}

// 首页头部--oss
export function aliOss(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/config/oss',
        method: 'post',
        data: param
    })
}

// 获取合营代理图片列表
export function getAgentImgList(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-system/front/platteamagentguide/list',
        method: 'post',
        data: param
    })
}

// 个人中心-VIP中心-查询(等级存款流水)
export function getVipPersonlInfo(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/player/get/getVipPersonlInfo',
        method: 'post',
        data: param
    })
}

// 个人中心-VIP中心-查询(VIP升级规则及奖励)
export function getVipRuleAndAwardInfo(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/player/get/getVipRuleAndAwardInfo',
        method: 'post',
        data: param
    })
}
// 个人中心-VIP中心-查询(VIP规则)
export function getVipRule(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/player/get/getVipRule',
        method: 'post',
        data: param
    })
}
// 个人中心-VIP中心-查询(VIP奖励)
export function getVipAward(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/player/get/getVipAward',
        method: 'post',
        data: param
    })
}
// 个人中心-VIP中心-查询(VIP返水)
export function getVipRebate(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/player/get/getVipRebate',
        method: 'post',
        data: param
    })
}


// 个人中心-VIP中心-查询列表 领奖中心
export function vipOrderList(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/vipOrderList',
        method: 'post',
        data: param
    })
}
// 个人中心-VIP中心-领奖中心-一键领取领取vip订单接口
export function vipOrder(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/oneClick/vipOrder',
        method: 'post',
        data: param
    })
}
// 个人中心-VIP中心-领奖中心-单个领取vip订单接口
export function vipOrderSingle(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/get/vipOrder',
        method: 'post',
        data: param
    })
}

// 个人中心-VIP中心-领奖中心-提示数量
export function vipNumber(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/tips/number',
        method: 'post',
        data: param
    })
}


// 活动--红包雨--获取配置
export function getRedPackConfigApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/marketing/redEnvelopes/configure',
        method: 'post',
        data: param
    })
}

// 活动--红包雨--抽奖
export function getRedPackGiftApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/marketing/redEnvelopes/in',
        method: 'post',
        data: param
    })
}


// 活动--签到--配置
export function getSinginConfigApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/marketing/sgin/enable',
        method: 'post',
        data: param
    })
}
// 活动--签到--详情
export function getSinginInfoApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/marketing/sgin/info',
        method: 'post',
        data: param
    })
}
// 活动--签到
export function setSinginApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/marketing/sgin/in',
        method: 'post',
        data: param
    })
}

// 活动配置-- 大转盘/水果机/砸金蛋
export function getActivityConfigApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/marketing/luckDraw/enable',
        method: 'post',
        data: param
    })
}
// 活动详情-- 大转盘/水果机/砸金蛋
export function getActivityInfoApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/marketing/luckDraw/info',
        method: 'post',
        data: param
    })
}

// 活动抽奖-- 大转盘/水果机/砸金蛋
export function getActivityApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/marketing/luckDraw/in',
        method: 'post',
        data: param
    })
}

// 设置数据埋点
export function setBuriedPointApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/playerPointRecord/save',
        method: 'post',
        data: param
    })
}

// 获取取款配置
export function getChargeConfigApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/player/withdrawalAllocation',
        method: 'post',
        data: param
    })
}

//  推广基本信息查询
export function selectPromotionBasicInfoApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/front/unlimitedAgents/selectPromotionBasicInfo',
        method: 'post',
        data: param
    })
}
//   领取佣金信息
export function selectReceiveCommissionInfoApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/front/unlimitedAgents/selectReceiveCommissionInfo',
        method: 'post',
        data: param
    })
}

//   领取佣金
export function receiveCommissionApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/front/unlimitedAgents/receiveCommission',
        method: 'post',
        data: param
    })
}
//   直属管理查询
export function directManagementApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/front/unlimitedAgents/directManagement',
        method: 'post',
        data: param
    })
}
//   业绩来源查询
export function selectPerformanceSourceApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/front/unlimitedAgents/selectPerformanceSource',
        method: 'post',
        data: param
    })
}
//   业绩查询
export function selectPerformanceApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/front/unlimitedAgents/selectPerformance',
        method: 'post',
        data: param
    })
}
//   推广教程查询
export function selectPromoteTutorialsApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-system/front/unlimitedAgents/selectPromoteTutorials',
        method: 'post',
        data: param
    })
}
//   返佣金额表查询
export function selectRebateAmountApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/front/unlimitedAgents/selectRebateAmount',
        method: 'post',
        data: param
    })
}
//   直属管理表头统计
export function directHeadApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/front/unlimitedAgents/directHead',
        method: 'post',
        data: param
    })
}

//   取款中的订单列表
export function getDrawOrderListApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/front/unlimitedAgents/directHead',
        method: 'post',
        data: param
    })
}

//   查询最近3条提款进度及子弹详情
export function getWithdrawProgressApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/getWithdrawProgress',
        method: 'post',
        data: param
    })
}

//   查询进行中的订单
export function getOrderMsgApi(param) {
    return request({
        baseUrl: '/',
        url: '/api/saas-player/pc/wallet/getOrderMsg',
        method: 'post',
        data: param
    })
}

export function getddpAddresssApi() { // 获取DDP下载连接-justin
    return request({
      baseUrl: '/',
      url: '/api/saas-player/pc/wallet/get/ddp/address',
      // url: '/mock/618233a041b6e6074b3076cb/diedai27/saas-player/player/withdrawalAllocation',
      method: 'post'
    })
  }