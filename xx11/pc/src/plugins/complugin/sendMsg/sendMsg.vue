<template lang="pug">
    button.btn.pw-v-but(@click='getVCode' :class='judgeButClass()')
        span {{ sendMsg }}{{ showCountDown() ? curDownDate : '' }}
        ef-loadbut.lb-load(v-show='!isReq' :isRepProp='isReq')
</template>
<script>
import {mapGetters, mapState} from 'vuex';
import TencentCode from '@m/tencentCode';
import TimerManager from '@m/timerManager'; // 计时任务管理器
import SendMsgStore from '@/store/comstore/modules/sendMsgStore';
import LoadingBut from "@/plugins/complugin/loading/loadingBut"; // 加载中
const sendMsgStore = 'sendMsgStore';
export default {
    name: 'countDown', // 倒计时
    components: {
        "ef-loadbut": LoadingBut
    },
    computed: {
        ...mapGetters(['sourceid']),
        ...mapState({
            smsappid: state => state.homeStore.smsappid, // 拖拽验证码ID
        }),
        enableImgCode: { // 是否调用图形验证码
            get() {
                return this.$store.state.enableImgCode;
            },
            set(item) {
                return item
            }
        },
        vcFirst: { // 无防水墻验证码
            get() {
                return this.$store.state.sendMsgStore.vcFirst;
            },
            set(item) {
                return item
            }
        },
        vcSecond: { // 有防水墻验证码
            get() {
                return this.$store.state.sendMsgStore.vcSecond;
            },
            set(item) {
                return item
            }
        }
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
        isPassProp: { // 是否验证通过
            type: Boolean,
            required: true,
            default: false
        },
        usernameProp: {
            type: String
        },
        mobileProp: {
            type: String,
            required: true
        },
        codeProp: {
            type: [Number, String],
            default: 0
        }
    },
    data() {
        return {
            curDownDate: this.curDownProp, // 倒计时剩余时间
            curDownName: this.curDownNameProp, // 倒计时名称
            sendMsg: '发送验证码',
            isSendCode: this.isPassProp, // 是否可发送验证码
            isReq: false, // 请求是否完成
            subscribeName: '',
            firstSMS: 0
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
                let iscd = this.showCountDown()
                if (newValue && !iscd) {
                    this.isSendCode = true
                } else {
                    this.isSendCode = false
                }
            },
            immediate: true
        }
    },
    created() {
        if (!this.$store.state[sendMsgStore]) {
            SendMsgStore.install(this)
        }
        this.subscribeName = this.$store.subscribeAction(action => {
            if (action.type === `dialogStore/getloginDialog`) {
                this.isSendCode = false;
                this.isReq = true;
                this.sendMsg = '发送验证码';
                this.curDownDate = this.curDownProp;
                TimerManager.init().stopSetTimeout(this.curDownName); // 计时器销毁
                this.curDownDate = this.curDownProp;
            }
            if (action.type === `sendMsgStore/resetParam`) {
                this.isReq = true
                this.firstSMS = 0
                this.sendMsg = '发送验证码'
            }
        });
    },
    mounted() {
        this.bindEvent()
    },
    methods: {
        bindEvent() {
            this.$nextTick(() => {
                if (this.enableImgCode) {
                    TencentCode.init().initTcCodeJs();
                }
            });
            this.isReq = true
            this.watchVCState(); // 无防水墻验证码
        },
        watchVCState() {
            this.subscribeName = this.$store.subscribeAction(action => {
                this.isReq = true
                TimerManager.init().stopSetTimeout(this.curDownName); // 计时器销毁
                if (action.type === `${sendMsgStore}/getVCFirst`) { // 无防水墻验证码
                    if (action.payload) {
                        this.sendMsg = '已发送'
                        this.isSendCode = false
                        this.$emit('getSmsg', true)
                    } else {
                        this.sendMsg = '发送失败'
                        this.isSendCode = false
                    }
                }
                if (action.type === `${sendMsgStore}/getVCSecond`) { // 有防水墻验证码
                    if (action.payload) {
                        this.sendMsg = '已发送';
                        this.isSendCode = false;
                        this.$emit('getSmsg', true)
                    } else {
                        this.sendMsg = '发送失败';
                        this.isSendCode = false;
                    }
                }
                if (this.firstSMS > 0) {
                    TimerManager.init()
                        .addSetTimeout(this.curDownName, this.startDate)
                        .startSetTimout(this.curDownName);
                }

            });
        },
        judgeButClass() {
            let c = '',
                iscd = this.showCountDown()
            if (this.isSendCode && !iscd) {
                c = 'pb-cur';
            }
            return c
        },
        showCountDown() {
            let arr = ['已发送', '发送失败'];
            return arr.includes(this.sendMsg);
        },
        getPicVcode() {
            const appId = this.smsappid; // 防水墙APP_ID
            var capuche1 = new TencentCaptcha(appId,
                (r) => {
                    let parm = {
                        ticket: r.ticket,
                        randstr: r.randstr
                    }
                    this.vCode(parm)
                }
            );
            capuche1.show();
        },
        getVCode() { // 获取验证码
            if (!this.isSendCode || !this.isReq) {
                return
            }
            this.isReq = false;
            if (this.enableImgCode) {
                this.getPicVcode()
            } else {
                this.vCode()
            }
        },
        vCode(p) { // 获取验证码
            this.firstSMS = 1;
            let o = {
                // mobile:this.mobileProp,
                // username:this.usernameProp,
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
                if (!res.success) {
                    if (res.code == 400 && res.msg.indexOf('手机号不存在')) {
                        this.sendMsg = '发送验证码'
                        return
                    }
                    if (res.code != 200) {
                        this.sendMsg = '发送失败';
                        this.isSendCode = false;
                        TimerManager.init()
                            .addSetTimeout(this.curDownName, this.startDate)
                            .startSetTimout(this.curDownName);
                    }
                    if (res.code == 200) {
                        this.sendMsg = '发送验证码';
                    }
                }
            })
        },
        startDate() { // 开始倒计时
            if (this.curDownDate <= 1) {
                this.isSendCode = true;
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
    color: #999999;
    background-color: #434554;
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
