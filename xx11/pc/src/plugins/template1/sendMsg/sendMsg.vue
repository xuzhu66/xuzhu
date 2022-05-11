<template lang="pug">
    button.btn.pw-v-but(@click='sendTelCodeFun()' :class='judgeButClass()')
        span {{ sendMsg }}{{ showTimeFlag() ? curDownDate : '' }}
        ef-loadbut.lb-load(v-show='!isReq' :isRepProp='isReq')

</template>
<script>
import {mapGetters, mapState} from 'vuex';
import TencentCode from '@m/tencentCode';
import TimerManager from '@m/timerManager'; // 计时任务管理器
import SendMsgStore from '@/store/comstore/modules/sendMsgStore';
import LoadingBut from "@/plugins/template1/loading/loadingBut"; // 加载中
const sendMsgStore = 'sendMsgStore';
export default {
    name: 'countDown', // 倒计时
    components: {
        "ef-loadbut": LoadingBut
    },
    computed: {
        ...mapState({
            sourceid: state => state.sourceid,
            enableImgCode: state => state.enableImgCode,
            picCodeCheck: state => state.sendMsgStore.picCodeCheck, // 0表示不需要图形验证码，1表示需要图形验证码,2 发送短信成功
            smsappid: state => state.homeStore.smsappid, // 拖拽验证码ID
        }),
    },
    props: {
        curDownProp: { // 父级传来的倒计时剩余时间
            type: Number,
            default: 59
        },
        curDownNameProp: { // 父级传来的倒计时名称
            type: String,
            required: true,
            default: 'sendMsg'
        },
        isPassProp: { // 是否验证通过 是否可发送验证码 ??
            type: Boolean,
            required: true,
            default: false
        },
        usernameProp: { // 用户名???
            type: String
        },
        mobileProp: { // 手机号码
            type: String,
            required: true
        },
        codeProp: { // 0 什么意思?
            type: [Number, String],
            default: 0
        }
    },
    data() {
        return {
            curDownDate: this.curDownProp, // 倒计时剩余时间
            curDownName: this.curDownNameProp, // 倒计时名称
            sendMsg: '发送验证码',
            sendCodeFlag: this.isPassProp, // 是否可发送验证码
            isReq: false, // 请求是否完成
            subscribeName: '', // 监听action名称???
            sendSmsNum: 0,// 发送短信验证码的次数;
        }
    },
    watch: {
        curDownProp: {
            handler(newValue) {
                this.curDownDate = newValue
            },
            immediate: true
        },
        isPassProp: {
            handler(newValue) {
                let iscd = this.showTimeFlag()
                if (newValue && !iscd) {
                    this.sendCodeFlag = true
                } else {
                    this.sendCodeFlag = false
                }
            },
            immediate: true
        }
    },
    created() {
        if (!this.$store.state[sendMsgStore]) {
            SendMsgStore.install(this)
        }
    },
    mounted() {
        this.bindEvent()
    },
    methods: {
        bindEvent() {
            this.$nextTick(() => {
                TencentCode.init().initTcCodeJs();
            });
            this.isReq = true
            //this.watchActionFun(); // 无防水墻验证码
        },
        // 监听所有的Action
        /*watchActionFun() {
            this.subscribeName = this.$store.subscribeAction(action => {
                this.isReq = true
                TimerManager.init().stopSetTimeout(this.curDownName); // 计时器销毁
                if (action.type === `${sendMsgStore}/getVCFirst`) { // 无防水墻验证码
                    if (action.payload) {
                        this.sendMsg = '已发送'
                        this.sendCodeFlag = false
                        this.$emit('getSmsg', true)
                    } else {
                        this.sendMsg = '发送失败'
                        this.sendCodeFlag = false
                    }
                }
                if (action.type === `${sendMsgStore}/getVCSecond`) { // 有防水墻验证码
                    if (action.payload) {
                        this.sendMsg = '已发送';
                        this.sendCodeFlag = false;
                        this.$emit('getSmsg', true)
                    } else {
                        this.sendMsg = '发送失败';
                        this.sendCodeFlag = false;
                    }
                }
                if (this.sendSmsNum > 0) {
                    TimerManager.init()
                        .addSetTimeout(this.curDownName, this.startDate)
                        .startSetTimout(this.curDownName);
                }

            });
        },*/
        judgeButClass() {
            let c = '',
                iscd = this.showTimeFlag()
            if (this.sendCodeFlag && !iscd) {
                c = 'pb-cur';
            }
            return c
        },
        // 显示时间标识
        showTimeFlag() {
            let arr = ['已发送', '发送失败'];
            return arr.includes(this.sendMsg);
        },
        // 启用验证码
        initImgCodeFun() {
            const appId = this.smsappid; // 防水墙APP_ID
            let capuche = new TencentCaptcha(appId,
                (r) => {
                    let parm = {
                        ticket: r.ticket,
                        randstr: r.randstr
                    }
                    this.sendTelCodeFun(parm)
                }
            );
            capuche.show();
        },
        // 发送短信验证码入口
        /*beforeSendCodeFun() {
            // 是否可以发送 或者 请求中
            if (!this.sendCodeFlag || !this.isReq) {
                return
            }
            this.isReq = false;
            // 是否启用验证码
            if (this.enableImgCode) {
                this.initImgCodeFun()
            } else {
                this.sendTelCodeFun()
            }
        },*/
        // 发送短信验证码
        sendTelCodeFun(p) {
            // 是否可以发送 或者 请求中
            if (!this.sendCodeFlag || !this.isReq) {
                return
            }
            this.isReq = false;
            this.sendSmsNum = 1;
            let o = {
                mobile: this.mobileProp,
                username: this.usernameProp,
                opFlag: this.codeProp,
                channelId: this.sourceid // 渠道id
            }
            Object.assign(o, p)
            if (p) {
                if (!p.randstr || p.randstr == '') {
                    this.isReq = true
                    return
                }
            }
            this.sendMsg = '发送中';
            TencentCode.init().sendTelephoneCode(o).then((res) => {
                this.isReq = true;
                TimerManager.init().stopSetTimeout(this.curDownName); // 计时器销毁
                if (res.success) {
                    // 0表示不需要图形验证码，成功; 1表示需要图形验证码,2 需要图形验证码,发送短信成功
                    if (res.data && res.data.picCodeCheck == 0) {
                        // 发送成功
                        this.sendMsg = '已发送';
                        this.sendCodeFlag = false;
                        this.$emit('getSmsg', true)
                    } else if (res.data && res.data.picCodeCheck == 1) {
                        this.initImgCodeFun()
                    } else if (res.data && res.data.picCodeCheck == 2) {
                        // 发送成功
                        this.sendMsg = '已发送';
                        this.sendCodeFlag = false;
                        this.$emit('getSmsg', true)
                    }
                } else {
                    if (res.code == 400 && res.msg.indexOf('手机号不存在')) {
                        this.sendMsg = '发送验证码'
                        return
                    }
                    if (res.code != 200) {
                        this.sendMsg = '发送失败';
                        this.sendCodeFlag = false;
                        TimerManager.init()
                            .addSetTimeout(this.curDownName, this.startDate)
                            .startSetTimout(this.curDownName);
                    }
                    if (res.code == 200) {
                        this.sendMsg = '发送验证码';
                    }
                }
                // 清空计时器
                if (this.sendSmsNum > 0) {
                    TimerManager.init()
                        .addSetTimeout(this.curDownName, this.startDate)
                        .startSetTimout(this.curDownName);
                }
            })
        },
        startDate() { // 开始倒计时
            if (this.curDownDate <= 1) {
                this.sendCodeFlag = true;
                this.isReq = true;
                this.sendMsg = '发送验证码';
                this.curDownDate = this.curDownProp;
                TimerManager.init().stopSetTimeout(this.curDownName); // 计时器销毁
                this.curDownDate = this.curDownProp;
            } else {
                this.curDownDate--;
            }
        }
    },
    beforeDestroy() {
        TimerManager.init().stopSetTimeout(this.curDownName); // 计时器销毁
        if (this.subscribeName) this.subscribeName();
    }
};
</script>

<style lang="stylus" scoped>
.pw-v-but
    width: 94px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    color: #c2c2cc;
    background: #e6e6f2;
    border: none;
    border-radius: 10px;
    box-sizing: border-box;
    position: relative;
    cursor: not-allowed;
    outline none

.lb-load
    position: absolute;
    top: 9px;
    right: 7px;

.pb-cur
    background-color: #bb9759;
    color: #ffffff;
    border: none;
    box-sizing: border-box;
    cursor: pointer;
</style>
