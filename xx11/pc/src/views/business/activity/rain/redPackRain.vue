<template lang="pug">
    .rain-wrapper
        .rainBox(ref='rainBox')
            rain-point(v-for='(item, idx) in rainsList' :key='`rain-point-${idx}`' :ref='`rain-point-${idx}`' @rainPoinclick='rainPoinclick')
        .close(@click="close")
        .time-con 倒计时:{{secondToDate(redRainDownTimes)}}
</template>

<script>

import rainPoint from './rainPoint.vue'
import countdown from './countdown'
import {mapActions, mapState} from "vuex";

export default {
    name: 'redPackRain',
    components: {
        rainPoint
    },
    props: {
        // 雨点创建速度
        createSpeed: {
            type: Number,
            default: 100
        },
        // 雨点过渡时长
        transitionTime: {
            type: Number,
            default: 3
        },
        // 雨点生命时长(秒)
        lifeTime: {
            type: Number,
            default: 10
        }
    },
    data() {
        return {
            currtNum: 1,// 随机中奖得次数
            clickNum: 0, // 点击统计
            rainsList: [], // 组件列表
            currtRainId: 0, // 当前组件下标
            createTimer: null, // 创建雨点计时器
            rainCanClick: true, // 雨点是否可点击
            giftPreObj: '',// 上一次中奖记录
        }
    },
    computed: {
        ...mapState({
            redRainDownTimes: state => state['activityStore'].redRainDownTimes,//红包雨倒计时
            redRainAllTimes: state => state['activityStore'].redRainAllTimes,//红包雨持续时间
            redPackConfig: state => state['activityStore'].redPackConfig,//红包配置对象
        }),
    },
    mounted() {
        this.giftPreObj = "";
        // window.start = this.start;
        // window.stop = this.stop;
        // window.clear = this.clear;
        this.start()
        this.clickNum = 0;
        this.currtRainId = 0;

    },
    methods: {
        ...mapActions({
            // 关闭活动
            closeActivityAction(dispatch, param) {
                return dispatch(`activityStore/closeActivityAction`, param);
            },
            // 开启活动
            openActivityAction(dispatch, param) {
                return dispatch(`activityStore/openActivityAction`, param);
            },
            // 活动--红包雨--抽奖
            getRedPackGiftAction(dispatch, param) {
                return dispatch(`activityStore/getRedPackGiftAction`, param);
            },

        }),
        // 1. 执行
        start() {
            this.clear()
            // 开启雨点点击
            this.rainCanClick = true
            // 重置点击数
            this.clickNum = 0
            // 清除动画定时器
            countdown.clearAssignTimer('rain')
            // 动画定时器
            countdown.creatTimer({
                remainTime: parseInt(this.lifeTime) * 1000,
                label: 'rain',
                timeoutFn: () => {
                    this.clear()
                    this.timeoutCallback()
                }
            })
            // 创建节点
            this.createTimer = setInterval(async () => {
                await this.create(this.currtRainId)
                this.currtRainId += 1
            }, this.createSpeed)
        },

        // 2. 创建雨点
        async create(rainId) {
            // 生成Dom
            this.rainsList.push(`rain-point-${rainId}`)

            // 生成坐标
            let rects = await this.grid()

            // 渲染完成后执行
            await this.$nextTick(async function () {
                // Dom节点
                let el = "";
                if(this.$refs[`rain-point-${rainId}`] && this.$refs[`rain-point-${rainId}`][0]){
                    el = this.$refs[`rain-point-${rainId}`][0];
                }
                if (!el) {
                    return;
                }

                // 初始化样式
                let initStyleText = {'transform': `translate(${rects.startX}px, ${rects.startY}px)`}
                // 最终样式
                let actionStyleText = {
                    'transition': `transform ${this.transitionTime}s cubic-bezier(${this.newCubicBezier()})`,
                    'transform': `translate(${rects.endX}px, ${rects.endY}px)`
                }

                // 设置初始坐标
                await el.setStyle(initStyleText)
                // 设置结束坐标
                await setTimeout(() => {
                    el.setStyle(actionStyleText)
                }, 50)
                // 动画结束
                el.$el.addEventListener('transitionend', el.destory, false)
            })
        },
        // 停止
        stop() {
            this.rainCanClick = false
            clearInterval(this.createTimer)
        },

        // 清空
        clear() {
            this.stop()
            countdown.clearAssignTimer('rain')
            this.rainsList = []
            this.currtRainId = 0
        },

        // 结束后回调
        timeoutCallback() {
            this.$emit('timeoutCallback', this.clickNum)
        },

        // 点击雨点
        rainPoinclick() {
            if (!this.rainCanClick) return
            // 判断上一次的状态 如果是3活动结束 退出红包雨活动; 如果是4 5 6 缓存对应的错误,下次点击直接提示错误信息
            if(this.giftPreObj && this.giftPreObj.status > 3){
                this.$emit('on-tip-msg', this.giftPreObj, "redRain");
                return;
            }
            this.clickNum += 1;
            console.log(this.clickNum, this.currtNum);
            // 随机机会
            if (this.clickNum == this.currtNum) {
                this.rainCanClick = false
                this.clickNum = 0;
                this.randomNum();
                this.getRedPackGiftAction().then(res => {
                    this.rainCanClick = true;
                    if (res && res.success) {
                        this.giftPreObj = res.data;
                        // 如果是3 活动结束 退出红包雨活动
                        if (res.data && res.data.status == 3) {
                            this.$emit('on-tip-msg', res.data, "redRain");
                            setTimeout(()=>{
                                this.close();
                            },1500)
                        } else if (res.data && res.data.status > 3) { // 如果是4 5 6 缓存对应的错误,下次点击直接提示错误信息
                            this.$emit('on-tip-msg', this.giftPreObj, "redRain");
                        } else {
                            this.$emit('on-tip-msg', res.data, "redRain");
                        }
                    }
                })
            } else {
                this.$emit('on-tip-msg', {status: 2}, "redRain");
            }

        },

        // 生成随机起始与落点坐标
        grid() {
            let [startX, startY, endX, endY] = [0, 0, 0, 0]
            // 拥有left, top, right, bottom, x, y, width, 和 height这几个以像素为单位的只读属性
            let rects = document.documentElement.getBoundingClientRect()
            startX = Math.random() * (rects.width - 20)
            startY = -20
            endX = Math.random() * (rects.width - 20)
            endY = rects.height

            return {
                startX,
                startY,
                endX,
                endY
            }
        },

        // 随机速度曲线值
        newCubicBezier() {
            let arr = ['0,.49,1,.3', '.04,.2,.93,.49', '.99,.36,.54,.46'] // 快 中 慢
            let idx = parseInt(Math.random() * 3)
            return arr[idx]
        },
        //秒转化成 时分秒
        secondToDate(result) {

            let h = Math.floor(result / 3600).toString();
            let m = Math.floor((result / 60 % 60)).toString();
            let s = Math.floor((result % 60)).toString();
            if (h.length == 1) {
                h = "0" + h
            }
            if (m.length == 1) {
                m = "0" + m
            }
            if (s.length == 1) {
                s = "0" + s
            }
            let str = h + ":" + m + ":" + s;

            if (h > 24) {
                str = Math.floor(h / 24).toString() + "天";
            }
            return str;
        },
        close() {
            this.clear();
            this.closeActivityAction();
            this.timeoutCallback();
        },
        // 随机一次机会
        randomNum() {
            this.clickNum = 0;
            this.currtNum = Math.floor(Math.random() * 5 + 1);
        },


    }
}
</script>

<style lang="stylus">
.rain-wrapper
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;

    .rainBox
        width: 100%;

    .close
        background: url('~@img/comimages/activity/rain/close.png') center / contain no-repeat;
        width 34px
        height 34px
        position absolute
        top 60px
        right 60px
        transition all .3s ease-in-out
        cursor pointer

        &:hover
            transform rotate(180deg)

    .time-con
        position absolute
        left 50%
        transform translateX(-50%)
        font-size 24px
        letter-spacing 2px
        color #ffeac5
        text-align center
        bottom 20px
</style>
