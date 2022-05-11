<template lang="pug">
    .bankCard
        .dialog-flow(v-if="showCommonDialogFlag || showCommonDialogFlag1 || showCommonDialogFlag2",@click="closeDialog")
        .info
            .tip 真实姓名是您的取款银行卡姓名，无法更改，务必填写正确，否则无法顺利取现到账！
            .list-title.ponint(v-if="status==1",@click="jumpTab")
                span 我的银行卡>编辑银行卡
            .info-con(v-if="status==1")
                .form
                    .form-item
                        .lable 真实姓名:
                        input(maxlength=20,placeholder='请输入真实姓名', v-model='realName' ,@keyup="realNameVerif",@keydown="realNameVerif", :readonly="realName?true:false")
                    .form-item
                        .lable 银行卡号:
                        input(maxlength=23,placeholder='请输入银行卡号',v-model='bankCard' ,@keyup="bankCardVerif",@keydown="bankCardVerif",@blur="bankCardOnBlur")

                    .form-item.dialog-con.common-down
                        .lable 开户银行:
                        input(placeholder='开户银行',maxlength=20,@click="toggleDialog2",v-model="bankName",readonly)
                        .icon.down
                        .common-dialog.bank-con(v-if="showCommonDialogFlag2")
                            .bank-list
                                ul
                                    template(v-for="(it,ind) in bankList")
                                        li(@click="selectBank(it)",:class="bankName==it.name?'active':''") {{it.name}}
                    .form-item
                        .lable 手机号码:
                        input(maxlength=11,placeholder='请输入手机号码',v-model='mobile' :readonly="userInfo.mobile?true:false")
                    .form-item
                        .lable 验 证 码:
                        input(maxlength=4,v-model="mobileCode",placeholder='验证码' )
                        sendMsg.send-msg(curDownNameProp="bank" :isPassProp="mobileFlag" :mobileProp="mobile" :codeProp="telType"  @getSmsg="sendMsgSuccess")

                .default-con(@click="checkDefault")
                    span.default(:class="isDefault?'active':''")
                    span 设为默认银行

                .common-btn.submit-btn(@click="updateCard",:class="submitFlag?'ok':'hidden'") 保存

            .info-list(v-if="status==2")
                .list-title
                    span 我的银行卡
                    span 共{{cardList.length}}/{{cardMaxNumber}}张
                .list-con
                    ul
                        li
                            .card-list
                                .card(v-for="item in cardList")
                                    .bank-name  {{item.bankName}}
                                    .card-number {{item.cardNo?spacesForma(item.cardNo):""}}
                                    .default(v-if="item.defaultable")
                                    .action
                                        .item(v-if="item.defaultable")
                                            span.quan(:class="item.defaultable?'active':''")
                                            span(v-if="item.defaultable") 默认
                                            //span(v-else,@click="setDefault(item)") 设为默认
                                        .item(v-if="!item.defaultable",@click="setDefault(item)")
                                            span.quan(:class="item.defaultable?'active':''")
                                            //span(v-if="item.defaultable") 默认
                                            span 设为默认
                                        .item(@click="editCard(item)")
                                            span.icon
                                            span.edit 编辑

                                .add-card(v-if="status==2 && (cardMaxNumber > cardList.length)")
                                    .card(@click="addCard")
                                        span 添加银行卡

        comDialog(:show-footer='false',:show="showDialog",@on-cancel="closeDialog2")
            div(slot="header") 温馨提示
            div.dialog-con(slot="default")
                .user-con
                    .title 请先完成您的实名认证！
                    .title-2 *真实姓名是您的取款银行卡姓名，无法更改，务必填写正确，否则无法顺利取现到账！
                    .form
                        .form-item
                            .lable 真实姓名:
                            input(maxlength=20,placeholder='请输入真实姓名', v-model='realName1',,@keyup="realNameVerif1",@keydown="realNameVerif1" )
                    .common-btn.ok(@click="updateUser",:class="realNameFlag?'ok':''") 确定


            div(slot="footer")
        comTelCode(v-if='showTelDialog',:showTelDialog="showTelDialog",@on-cancel="closeTelDialog",@on-success="telCodeSuccess",:telType="telType")

</template>

<script>
import thatStore from "@/store/comstore/center/base/bankCardStore"; // 获取模板
import store from '@/store/Store';
import {mapActions, mapMutations, mapState} from "vuex";
import Rule from "@m/rule"; // 验证
import comDialog from '@pon/template3/comDialog';
import {spacesForma} from '@m/utils'
import comTelCode from "@pon/template3/comTelCode";
import sendMsg from "@/plugins/template3/sendMsg/sendMsg"; // 发送验证码
export default {
    name: "bankCard",
    components: {
        comDialog,
        comTelCode,
        sendMsg,
    },
    data() {
        return {
            isReqFlag: true, // 请求是否结束
            //status:'2',//当前状态 1, add 2. list
            showCommonDialogFlag: false,
            showCommonDialogFlag1: false,
            showCommonDialogFlag2: false,
            currtTab: '1',
            realName: '', //真实姓名
            realName1: '', //真实姓名-- 弹框
            bankName: '',// 开户银行name
            currtBank: '',//开户银行
            bankCard: '', //银行卡号
            pvorvince: '', //开户省
            city: '',//开户市
            bankFeather: '',// 开户支行
            pvorvinceList: [
                {
                    name: 'A-G',
                    list: [
                        {"name": "北京", "code": "110000"},
                        {"name": "安徽", "code": "340000"},
                        {"name": "澳门", "code": "820000"},
                        {"name": "重庆", "code": "500000"},
                        {"name": "福建", "code": "350000"},
                        {"name": "甘肃", "code": "620000"},
                        {"name": "广东", "code": "440000"},
                        {"name": "广西", "code": "450000"},
                        {"name": "贵州", "code": "520000"},
                        {"name": "钓鱼岛", "code": "900000"}
                    ]
                },
                {
                    name: 'H-K',
                    list: [
                        {"name": "海南", "code": "460000"},
                        {"name": "河北", "code": "130000"},
                        {"name": "河南", "code": "410000"},
                        {"name": "黑龙江", "code": "230000"},
                        {"name": "湖北", "code": "420000"},
                        {"name": "湖南", "code": "430000"},
                        {"name": "吉林", "code": "220000"},
                        {"name": "江苏", "code": "320000"},
                        {"name": "江西", "code": "360000"}
                    ]
                },
                {
                    name: 'L-S',
                    list: [
                        {"name": "辽宁", "code": "210000"},
                        {"name": "内蒙古", "code": "150000"},
                        {"name": "宁夏", "code": "640000"},
                        {"name": "青海", "code": "630000"},
                        {"name": "山东", "code": "370000"},
                        {"name": "山西", "code": "140000"},
                        {"name": "陕西", "code": "610000"},
                        {"name": "上海", "code": "310000"},
                        {"name": "四川", "code": "510000"}
                    ]
                },
                {
                    name: 'T-Z',
                    list: [
                        {"name": "天津", "code": "120000"},
                        {"name": "西藏", "code": "540000"},
                        {"name": "新疆", "code": "650000"},
                        {"name": "云南", "code": "530000"},
                        {"name": "浙江", "code": "330000"},
                        {"name": "香港", "code": "810000"},
                        {"name": "台湾", "code": "710000"}
                    ]
                }
            ],
            isDefault: false,
            // 校验规则
            reg: { // 验证
                realName: {
                    msg: "",
                    isPass: false
                },
                bankName: {
                    msg: "",
                    isPass: false
                },
                bankCard: {
                    msg: "",
                    isPass: false
                },
                pvorvince: {
                    msg: "",
                    isPass: false
                },
                city: {
                    msg: "",
                    isPass: false
                },
                bankFeather: {
                    msg: "",
                    isPass: false
                },
            },
            //校验错误提示信息
            errorMsg: "",
            subFlag: false, // 是否校验通过
            realNameFlag: false,// 弹框--真实姓名校验
            showDialog: false,
            actionType: "", // add edit
            currtItme: '',//当前选中的银行卡
            isFirstCard: false, // 是否是第一次添加卡

            // 手机验证码弹框
            showTelDialog: false,
            telType: '13',
            telCodeObj: {},
            bankCardFlag: false,
            mobile: '',// 手机号码
            mobileFlag: false,
            mobileCode: '', // 短信验证码
            mobileCodeFlag: false,
            sendFlag: false, //发送短信验证码状态
        }
    },
    computed: {
        ...mapState({
            commonData: state => state['centerStore'].commonData,
            userInfo: state => state['centerStore'].userInfo,
            bankList: state => state['bankCardStore'].bankList,
            cardList: state => state['bankCardStore'].cardList,
            cardMaxNumber: state => state['bankCardStore'].cardMaxNumber,
            cityList: state => state['bankCardStore'].cityList,

        }),
        status: {
            // 默认选中的tab
            get() {
                return this.$store.state['bankCardStore'].status;
            },
            set(val) {
                this.setStatus(val);
            }
        },
        bankNameFlag: function () {
            let flag = false;
            if (this.bankName) {
                flag = true;
            }
            return flag
        },
        userNameFlag: function () {
            let flag = false;
            if (this.realName) {
                flag = true;
            }
            return flag
        },
        submitFlag: function () {
            let flag = this.userNameFlag && this.bankCardFlag && this.mobileCodeFlag && this.mobileFlag && this.bankNameFlag
            return flag
        }
    },
    watch: {
        bankFeather: function (val) {
            this.runCheckList()
        },
        bankCard: function (val) {
            this.runCheckList()
            this.bankCardFlag = /^(\d{16,19})$/.test(this.bankCard.replace(/\s/g, ""))
        },
        mobile: function (val) {
            if (this.userInfo.mobile) {
                this.mobileFlag = true;
            } else {
                this.mobileFlag = /^([1]{1})\d{10}$/.test(this.mobile.replace(/\s/g, ""))
            }
        },
        mobileCode: function (val) {
            if (val && val.length == 4) {
                this.mobileCodeFlag = true;
            } else {
                this.mobileCodeFlag = false
            }
        }
    },
    created() {
        // 动态store
        if (!store.state["bankCardStore"]) {
            thatStore.install(this);
        }
        this.getBankListFun()
        this.getCardListFun()
        this.getCardMaxNumberFun()
    },
    mounted() {
        this.status = 2;
        this.realName = this.userInfo.realName;
        window.bank = this;
        this.mobile = this.userInfo.mobile

    },
    methods: {
        ...mapMutations({
            setStatus(commit, param) {
                return commit('bankCardStore/SET_STATUS', param);
            }
        }),
        ...mapActions({
            getBankListFun(dispatch, param) {
                return dispatch(`bankCardStore/getBankListAction`, param);
            },
            getCardListFun(dispatch, param) {
                return dispatch(`bankCardStore/getCardListAction`, param);
            },
            getCardMaxNumberFun(dispatch, param) {
                return dispatch(`bankCardStore/getCardMaxNumberAction`, param);
            },
            getProvicesOrCitiesFun(dispatch, param) {
                return dispatch(`bankCardStore/getProvicesOrCitiesAction`, param);
            },
            addCardFun(dispatch, param) {
                return dispatch(`bankCardStore/addCardAction`, param);
            },
            updateCardFun(dispatch, param) {
                return dispatch(`bankCardStore/updateCardAction`, param);
            },
            // 检查银行卡归属定
            checkCardFun(dispatch, param) {
                return dispatch(`bankCardStore/checkCardAction`, param);
            },

            updateUserInfoFun(dispatch, param) {
                return dispatch(`centerStore/updateUserInfoAction`, param);
            },
            // 查询用户信息
            getUserInfoFun(dispatch, param) {
                return dispatch(`centerStore/getUserInfoAction`, param);
            },
        }),
        spacesForma: spacesForma,
        checkTab(tab) {
            this.currtTab = tab;
        },
        selectPvorvince(item) {
            this.pvorvince = item;
            this.city = {}
            this.checkTab(2)
            this.pvorvinceVerif()
            // 查询对应的市
            // this.getProvicesOrCitiesFun({parentId: item.code, command: 2})
        },
        selectCity(item) {
            this.city = item;
            this.closeDialog()
            this.cityVerif()
        },
        selectBank(item) {
            this.bankName = item.name;
            this.currtBank = item;
            this.showCommonDialogFlag2 = false;
            this.bankNameVerif()
        },
        toggleDialog() {
            this.closeDialog();
            this.showCommonDialogFlag = !this.showCommonDialogFlag;
            this.checkTab(1)
        },
        toggleDialog1() {
            this.closeDialog();
            this.showCommonDialogFlag1 = !this.showCommonDialogFlag1;
            this.checkTab(1)
        },
        toggleDialog2() {
            this.closeDialog();
            this.showCommonDialogFlag2 = !this.showCommonDialogFlag2;

        },
        closeDialog() {
            this.showCommonDialogFlag = false;
            this.showCommonDialogFlag1 = false;
            this.showCommonDialogFlag2 = false;
        },
        checkDefault() {
            if (!this.isFirstCard) {
                this.isDefault = !this.isDefault;
            }
        },
        //添加银行卡
        addCard() {
            this.actionType = "add";
            this.telType = '23'
            // 重置页面数据
            this.resetPageData();
            // 判断用户是否实名认证
            if (this.userInfo.realName) {
                this.setStatus(1)
                // 判断是否是第一次添加
                if (!this.userInfo.bankSetStatus) {
                    this.isDefault = true;
                    this.isFirstCard = true;
                } else {
                    this.isFirstCard = false;
                }
            } else {
                this.showDialog = true;
            }
            // this.$store.dispatch('centerStore/getUserInfoAction').then((res)=>{
            //     if(res && res.success) {
            //     }
            // })
        },
        // 真实姓名校验
        realNameVerif() {
            let rule = Rule.init().rules.realName,
                bool = rule.reg.test(this.realName);
            if (bool) {
                this.reg.realName.isPass = true;
                this.reg.realName.msg = "";
            } else {
                this.reg.realName.isPass = false;
                this.reg.realName.msg = "真实姓名" + rule.desc;
                this.errorMsg = "真实姓名" + rule.desc;
            }
            this.btnVerif();
        },
        // 真实姓名校验
        realNameVerif1() {
            let rule = Rule.init().rules.realName,
                bool = rule.reg.test(this.realName1);
            if (bool) {
                this.reg.realName.isPass = true;
                this.reg.realName.msg = "";
                this.realNameFlag = true;
            } else {
                this.realNameFlag = false;
                this.reg.realName.isPass = false;
                this.reg.realName.msg = "真实姓名" + rule.desc;
                this.errorMsg = "真实姓名" + rule.desc;
            }

        },
        // 银行卡校验
        bankCardVerif() {
            let card = this.bankCard.replace(/\s/g, "");
            if (!card) {
                this.bankCard = "";
            } else {
                this.bankCard = this.spacesForma(card);
            }
            let rule = Rule.init().rules.bankCard,
                bool = rule.reg.test(card);

            if (bool) {
                this.reg.bankCard.isPass = true;
                this.reg.bankCard.msg = "";
            } else {
                this.reg.bankCard.isPass = false;
                this.reg.bankCard.msg = rule.desc;
                this.errorMsg = rule.desc;
            }
            this.btnVerif();
        },
        // 省份校验
        pvorvinceVerif() {
            let rule = Rule.init().rules.cn,
                bool = rule.reg.test(this.pvorvince.name);
            if (bool) {
                this.reg.pvorvince.isPass = true;
                this.reg.pvorvince.msg = "";
            } else {
                this.reg.pvorvince.isPass = false;
                this.reg.pvorvince.msg = "省份" + rule.desc;
                this.errorMsg = "省份" + rule.desc;
            }
            this.btnVerif();
        },
        //城市校验
        cityVerif() {
            let rule = Rule.init().rules.cn,
                bool = rule.reg.test(this.city.name);
            if (bool) {
                this.reg.city.isPass = true;
                this.reg.city.msg = "";
            } else {
                this.reg.city.isPass = false;
                this.reg.city.msg = "城市" + rule.desc;
                this.errorMsg = "城市" + rule.desc;
            }
            this.btnVerif();
        },
        // 银行校验
        bankNameVerif() {
            let rule = Rule.init().rules.cn,
                bool = rule.reg.test(this.bankName);
            if (bool) {
                this.reg.bankName.isPass = true;
                this.reg.bankName.msg = "";
            } else {
                this.reg.bankName.isPass = false;
                this.reg.bankName.msg = "开户银行" + rule.desc;
                this.errorMsg = "开户银行" + rule.desc;
            }
            this.btnVerif();
        },
        // 银行支行校验
        bankFeatherVerif() {
            let rule = Rule.init().rules.cn,
                bool = rule.reg.test(this.bankFeather);
            if (bool) {
                this.reg.bankFeather.isPass = true;
                this.reg.bankFeather.msg = "";
            } else {
                this.reg.bankFeather.isPass = false;
                this.reg.bankFeather.msg = "银行支行" + rule.desc;
                this.errorMsg = "银行支行" + rule.desc;
            }
            this.btnVerif();
        },

        // 按钮校验
        btnVerif() {
            let goBut = [];
            // 先全部校验一次
            Object.keys(this.reg).forEach((key, val) => {
                if (this.reg[key].isPass) {
                    goBut.push(this.reg[key].isPass);
                }
            });
            // 所有的校验通过
            if (goBut.length == Object.keys(this.reg).length) {
                this.subFlag = true;
                this.errorMsg = "";
            } else {
                this.subFlag = false;
            }

        },
        // 执行校验 -- 倒序
        runCheckList() {
            this.bankFeatherVerif();
            this.bankNameVerif();
            this.cityVerif();
            this.pvorvinceVerif();
            this.bankCardVerif()
            this.realNameVerif();
            this.btnVerif();
        },
        // 获取银行卡信息
        updateCard(state, confirm) {
            this.checkForm()
            // 校验
            if (!this.submitFlag) {
                return;
            }
            let obj = {
                cardNo: this.bankCard.replace(/\s/g, ""),//银行卡号
                bankName: this.currtBank.name,//银行名称
                bankId: this.currtBank.id,//银行id
                province: this.pvorvince.name,//省名称
                city: this.city.name,//市名称
                address: this.bankFeather,//支行名称
                accountName: this.userInfo.realName,//开户名
                defaultable: this.isDefault,//是否市默认银行卡，true表示是，false表示不是
                cityId: this.city.id,// 市id
                provinceId: this.pvorvince.code,//省id
                mobileVerifyCode: this.mobileCode,
                mobile: this.mobile,
            }
            // 校验
            //this.runCheckList()
            // if (!this.subFlag) {
            //     window.win.tips.info(this.errorMsg);
            //     return;
            // }
            // if (confirm !== true) {
            //     if (this.actionType == "add") {
            //         this.telType = '23'
            //     } else {
            //         this.telType = '24'
            //     }
            //     this.openTelDialog()
            //     return;
            // }
            // 判断流程
            if (this.actionType == 'add') {
                // 防重复提交
                if (this.isReqFlag) {
                    this.isReqFlag = false;
                    this.addCardFun(obj).then(() => {
                        this.isReqFlag = true;
                        this.returnTop()
                        this.getUserInfoFun()
                    });
                }
            } else {
                obj.id = this.currtItme.id;
                if (this.isReqFlag) {
                    this.isReqFlag = false;
                    this.updateCardFun(obj).then(() => {
                        this.isReqFlag = true;
                        this.returnTop()
                        this.getUserInfoFun()
                    });
                }
            }
        },
        //关闭弹框
        closeDialog2() {
            this.showDialog = false;
        },
        // 更新用户姓名
        updateUser() {
            let param = {
                id: this.userInfo.id,
                realName: this.realName1,
            }
            this.realNameVerif1()
            if (!this.realNameFlag) {
                window.win.tips.info('请输入正确的真实姓名');
                return;
            }
            let that = this;
            if (this.isReqFlag) {
                this.isReqFlag = false;
                this.updateUserInfoFun(param).then(() => {
                    this.isReqFlag = true;
                    this.closeDialog2()
                    // 等待界面渲染完毕;
                    this.$set(this.userInfo, 'realName', this.realName1)
                    setTimeout(() => {
                        this.addCard()
                    }, 500)

                });
            }
        },
        //设置默认
        setDefault(item) {
            item.defaultable = true;
            let that = this;
            if (this.isReqFlag) {
                this.isReqFlag = false;
                let param = {
                    ...item,
                    updateDefault: true
                }
                this.updateCardFun(param).then(() => {
                    that.isReqFlag = true;
                    this.getCardListFun()
                });
            }
        },
        // 修改银行卡
        editCard(item) {
            let that = this;
            this.resetPageData()
            this.realName = this.userInfo.realName;
            this.currtItme = item;
            this.actionType = "edit";
            this.telType = '24'
            this.bankCard = item.cardNo;//银行卡号
            this.bankName = item.bankName;
            this.currtBank = "";//清空bank
            this.currtBank = {
                name: item.bankName,
                id: item.bankId
            }
            this.bankFeather = item.address;
            this.isDefault = item.defaultable;
            // 设置选中的省份
            this.pvorvince = {
                id: item.provinceId,
                name: item.province,
                code: item.provinceId
            }
            this.city = {
                id: item.cityId,
                name: item.city,
                code: item.cityId
            }
            this.setStatus(1)

            // 查询省市区
            // this.getProvicesOrCitiesFun({parentId: item.provinceId, command: 2}).then(function () {
            //     // 校验
            //     that.runCheckList()
            // })


        },
        resetPageData() {
            this.realName = this.userInfo.realName;
            this.bankName = '';// 开户银行name
            this.currtBank = '';//开户银行
            this.bankCard = ''; //银行卡号
            this.pvorvince = ''; //开户省
            this.city = '';//开户市
            this.bankFeather = '';// 开户支行
        },
        jumpTab() {
            this.currtBank = "";//清空bank
            this.setStatus(2)
        },
        returnTop() {
            // let l = document.documentElement.scrollTop;
            let l = document.getElementById('app').scrollTop;
            let s = l / 600 * 50;  //路程/时间=s *25每隔25ms秒 动的路程
            let st = setInterval(function () {
                l -= s;
                if (l <= 0) {
                    l = 0; //当l<=0时，设置l=0
                    clearInterval(st);
                }
                document.getElementById('app').scrollTop = l;
            }, 25)
        },
        // 失去焦点的时候,查询银行卡归属地&银行;
        bankCardOnBlur() {
            // 当银行卡的位数大于16位的时候 进行查询;
            let card = this.bankCard.replace(/\s+/g, "");
            if (card && card.length >= 16) {
                // 查询接口
                this.checkCardFun({cardNo: card}).then(res => {
                    // 赋值 provinceCode  cityCode
                    this.pvorvince = {"name": res.data.province, "code": res.data.provinceId};
                    this.city = {"name": res.data.city, "id": res.data.cityId};
                    this.getBankById(res.data.bankId);
                    // 校验
                    this.pvorvinceVerif()
                    this.cityVerif()
                    this.bankNameVerif()
                })
            }
        },
        // 获取银行卡
        getBankById(id) {
            let currt = "";
            this.bankList.forEach(item => {
                if (item.id == id) {
                    currt = item;
                    return;
                }
            })
            if (currt) {
                this.selectBank(currt);
            }
        },
        // 打开短信验证弹框
        openTelDialog() {
            this.showTelDialog = true;
        },
        // 关闭短信验证弹框
        closeTelDialog() {
            this.showTelDialog = false;
        },
        // 短信验证码成功回调
        telCodeSuccess(data) {
            this.telCodeObj = data;
            this.closeTelDialog();
            // 调用接口
            this.updateCard(1, true)
        },
        // 发送短信成功
        sendMsgSuccess() {
            this.sendFlag = true
        },
        // 校验表单
        checkForm() {
            if (!this.userNameFlag) {
                this.$tips.info('请输入正确的真实姓名')
                return false;
            }
            if (!this.bankCardFlag) {
                this.$tips.info('请输入正确的银行卡号')
                return false;
            }
            if (!this.bankNameFlag) {
                this.$tips.info('请选择开户银行！')
                return false;
            }
            if (!this.mobileFlag) {
                this.$tips.info('请输入正确的手机号码')
                return false;
            }
            if (!this.mobileCodeFlag) {
                this.$tips.info('请输入正确的验证码')
                return false;
            }

        }
    }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template3/themes/mixin.styl'
@import "~@styl/template3/common/fun.styl"

.bankCard
    bg_color(bg2)
    border-radius: 0px 0px 10px 10px;
    min-height 890px

    .dialog-flow
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .5);
        opacity: .1;
        position: absolute;
        top: 0;
        left: 0;
        z-index 2;

    .list-title
        margin 20px 0

        span
            &:nth-child(1)
                height: 18px;
                font-size: 18px;
                font_color(fc3);

            &:nth-child(2)
                margin-left 10px
                font-size: 14px;
                font_color(fc3);

    .info
        padding 20px

        .tip
            font-size: 14px;
            font_color(fc3);
            margin-botton 20px

        .info-con
            width 520px
            margin 0 auto
            padding 60px 10px

            .form
                .form-item
                    width: 500px;
                    height: 68px;
                    line-height 68px
                    border-radius: 5px;
                    border_all(1px, solid, border_common);
                    margin-bottom 20px
                    display flex
                    flex-direction row
                    flex-wrap nowrap
                    position relative

                    input
                        font-size 16px
                        background-color transparent
                        font_color(fc2);

                        &::placeholder
                            font_color(fc5);

                    .lable
                        flex none
                        width 90px
                        text-align right
                        font-size: 16px;
                        letter-spacing: 2px;
                        font_color(fc3);

                    &.dialog-con
                        flex none
                        position relative

                        .common-dialog
                            z-index: 3;
                            position absolute
                            top 66px
                            left 0px
                            width 500px
                            bg_color(bg1);
                            //border_all(1px, solid, border03)
                            border-radius: 0px 0px 10px 10px;
                            //.bank-con

                            .address-con
                                height 320px

                            .dialog-title
                                span
                                    display inline-block
                                    width: 50%;
                                    height: 60px;
                                    line-height 60px
                                    text-align center
                                    bg_color(bg2);
                                    font-size: 18px;
                                    font_color(fc3);
                                    //border_com(1px, solid, border01, right)

                                    &.active
                                        bg_color(bg3);
                                        font_color(fc3);

                            .pvorvince-list
                                padding-bottom 20px

                                ul
                                    resetul()

                                    li
                                        width 100%
                                        text-align center
                                        font-size: 16px;
                                        font_color(fc3);
                                        display flex
                                        flex-direction row
                                        flex-wrap nowrap
                                        line-height 30px
                                        cursor pointer

                                        .col
                                            &:nth-child(1)
                                                flex none
                                                width 60px

                                            &:nth-child(2)
                                                display flex
                                                flex-direction row
                                                flex-wrap wrap

                                            span
                                                border-radius: 5px;
                                                cursor pointer
                                                padding: 2px 12px;
                                                margin-bottom: 10px;
                                                margin-right 10px

                                                &.active, &:hover
                                                    bg_color(bg3);
                                                    font_color(fc3);
                                                    border-radius: 5px;

                            .city-list
                                padding-bottom 20px

                                ul
                                    resetul()
                                    width 100%
                                    text-align center
                                    font-size: 16px;
                                    font_color(fc3);
                                    display flex
                                    flex-direction row
                                    flex-wrap wrap
                                    line-height 30px
                                    justify-content space-between
                                    align-items center
                                    padding 10px

                                    li
                                        flex none
                                        align-self center
                                        margin-right 10px
                                        cursor pointer
                                        padding-right: 10px;
                                        padding-left: 10px;
                                        margin-bottom: 10px;

                                        &.active, &:hover
                                            bg_color(bg3);
                                            font_color(fc4);
                                            border-radius: 5px;

                            .bank-list
                                //height 320px
                                overflow auto

                                ul
                                    resetul()
                                    width 100%
                                    text-align center
                                    font-size: 16px;
                                    bg_color(bg2);
                                    font_color(fc3);
                                    display flex
                                    flex-direction row
                                    flex-wrap wrap
                                    line-height 30px
                                    justify-content space-between
                                    align-items center
                                    padding 10px

                                    li
                                        flex none
                                        align-self center
                                        margin-right 10px
                                        padding 2px 4px
                                        cursor pointer
                                        margin-bottom: 10px;

                                        &:last-child
                                            margin-right auto

                                        &.active, &:hover
                                            bg_color(bg3);
                                            font_color(fc4);
                                            border-radius: 5px;


                    .send-msg
                        position absolute
                        right 10px
                        top 50%
                        transform translateY(-50%)

            .default-con
                display flex
                align-items center
                margin-bottom 20px

                span
                    flex none
                    font-size: 16px;
                    font_color(fc3);

                .default
                    margin-right 10px
                    display inline-block
                    width 15px
                    height 15px
                    border_all(1px, solid, border_common)
                    position relative
                    cursor pointer

                    &.active
                        bg_color(bg3);

            .submit-btn
                width: 290px;
                line-height 60px

        .info-list
            .list-con
                ul
                    resetul()
                    display flex
                    flex-direction row
                    flex-wrap wrap
                    justify-content flex-start
                    align-items center

                    li
                        .card-list
                            display flex
                            flex-direction row
                            flex-wrap wrap
                            justify-content flex-start

                            .card
                                background url("~@img/template3/center/yinhangk.png") center / contain no-repeat
                                width: 308px;
                                height: 192px;
                                position relative
                                margin-bottom 36px

                                .bank-name
                                    font-size: 16px;
                                    font-weight: bold;
                                    font-stretch: normal;
                                    line-height: 40px;
                                    letter-spacing: 0px;
                                    font_color(fc6);
                                    position relative
                                    left: 81px;
                                    top: 24px;

                                .card-number
                                    font-size: 18px;
                                    font-weight: bold;
                                    font-stretch: normal;
                                    line-height: 40px;
                                    letter-spacing: 0px;
                                    font_color(fc6);
                                    left: 36px;
                                    top: 40px;
                                    position relative

                                .default
                                    background url("~@img/template3/center/moren.png") center / contain no-repeat
                                    width 75px
                                    height 75px
                                    position absolute
                                    top: 2px;
                                    right: 9px;

                                .action
                                    height 36px
                                    width: 308px;
                                    position absolute
                                    bottom -10px
                                    padding 0 20px 0 24px
                                    display flex
                                    flex-direction row
                                    flex-wrap nowrap
                                    justify-content center
                                    align-items center

                                    .item
                                        cursor pointer
                                        font-size: 13px;
                                        font-stretch: normal;
                                        letter-spacing: 0px;
                                        font_color(fc3);
                                        flex 1
                                        display flex
                                        align-items center
                                        flex-direction row

                                        span
                                            margin-right 10px

                                            &.quan
                                                display inline-block
                                                width: 18px;
                                                height: 18px;
                                                border_all(2px, solid, border_hui1)
                                                border-radius 50%

                                                &.active
                                                    border none
                                                    bg_color(green_c);

                                            &.icon
                                                background url("~@img/template3/center/edit.png") center / contain no-repeat
                                                width 18px
                                                height 18px

                                        &:nth-child(2)
                                            display flex
                                            flex-direction row
                                            justify-content flex-end


                            .add-card
                                .card
                                    background-image none
                                    width: 267px;
                                    height: 150px;
                                    line-height 150px
                                    text-align center
                                    border-radius: 10px;
                                    border_all(1px, solid, border_hui2);
                                    box_shadow(shadow_common)
                                    opacity: 0.5;
                                    font-size: 16px;
                                    font-weight: bold;
                                    font-stretch: normal;
                                    letter-spacing: 0px;
                                    font_color(fc3);
                                    position relative
                                    margin-left 20px
                                    margin-bottom: 60px;

        .add-card
            .card
                width: 267px;
                height: 150px;
                line-height 150px
                text-align center
                border-radius: 10px;
                border_all(1px, solid, border_common);
                opacity: 0.5;
                font-size: 16px;
                font-weight: bold;
                font-stretch: normal;
                letter-spacing: 0px;
                font_color(fc3);
                position relative
                margin-left 20px
                margin-bottom: 60px;

                &:before
                    content ""
                    display block
                    width 13px
                    height 2px
                    bg_color(fc3)
                    position absolute
                    top 50%
                    transform translateY(-50%)
                    left 74px

                &:after
                    content ""
                    display block
                    width 2px
                    height 13px
                    bg_color(fc3)
                    position absolute
                    top 50%
                    transform translateY(-50%)
                    left 79px

    .dialog-con
        .user-con
            min-height 200px
            min-width 500px

            .title
                font-size: 16px;
                font_color(fc2);

            .title-2
                font-size: 14px;
                font_color(fc3);
                margin 10px 0px 20px

            .form
                .form-item
                    height: 68px;
                    line-height 68px
                    border-radius: 5px;
                    border_all(1px, solid, border_common);
                    margin-bottom 20px
                    display flex
                    flex-direction row
                    flex-wrap nowrap

                    input
                        font-size 16px
                        background-color transparent
                        font_color(fc2);

                        &::placeholder
                            font_color(fc5);

                    .lable
                        flex none
                        width 90px
                        text-align right
                        font-size: 16px;
                        letter-spacing: 2px;
                        font_color(fc3);

            .submit-btn
                width: 290px;
                height: 60px;


.common-down
    input
        cursor pointer

.ponint
    cursor pointer
</style>
