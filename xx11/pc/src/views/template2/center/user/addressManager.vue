<template lang="pug">
    .addressManager
        .dialog-flow(v-if="showCommonDialogFlag || showCommonDialogFlag1 || showCommonDialogFlag2",@click="closeDialog")
        .info
            .list-title.ponint(v-if="status==1")
                span 我的收货地址
            .list-title.ponint(v-if="status==2",@click="jumpTab")
                span 我的收货地址>编辑收货地址

            .info-con(v-if="status==2")
                .form
                    .form-item
                        .lable 收货人:
                        input(maxlength=20,placeholder='请输入真实姓名', v-model='name' ,@keyup="realNameVerif",@keydown="realNameVerif" )
                    .form-item
                        .lable 手机号码:
                        input(maxlength=13,placeholder='请输入手机号码', v-model='mobile'  ,@keyup="handleInputNum11",@keydown="handleInputNum11"  )

                    .form-item.dialog-con
                        .lable 详细地址:
                        input.form-item-width40p(placeholder='省区/自治州',maxlength=20,v-model='pvorvince.name',@click="toggleDialog(1)",readonly)
                        .icon.down.common-down
                        input.form-item-width40p(placeholder='城市/地区',maxlength=20,@click="toggleDialog(2)",v-model='city.name',readonly)
                        .icon.down.common-down
                        .common-dialog(v-if="showCommonDialogFlag")
                            .dialog-title
                                span(@click="checkTab(1)",:class="currtTab == 1?'active':''" ) 省区
                                span(@click="checkTab(2)",:class="currtTab == 2?'active':''" ) 市区

                            .pvorvince-list(v-if="currtTab == 1")
                                ul
                                    template(v-for="(it,ind) in pvorvinceList")
                                        li
                                            .col {{it.name}}
                                            .col
                                                span(v-for="item in it.list",:class="pvorvince.code==item.code?'active':''",@click="selectPvorvince(item)") {{item.name}}

                            .city-list(v-if="currtTab == 2")
                                ul
                                    template(v-for="(it,ind) in cityList")
                                        li(@click="selectCity(it)",:class="city.id==it.id?'active':''") {{it.name}}

                    .form-item
                        textarea.form-item-width500(maxlength=100,placeholder='请输入详细收货地址：如“**街道”',rows="30" ,cols="200",v-model="address", ,@keyup="addressVerif",@keydown="addressVerif" )

                .default-con(@click="checkDefault")
                    span.default(:class="isDefault?'active':''")
                    span 设为默认收货地址
                .common-btn.big(@click="submitFun",:class="subFlag?'ok':'hidden'") 保存

            .info-list(v-if="status==1")
                ul
                    li(v-for="item in addressList")
                        .it
                            span 收件人：
                            span {{item.name}}
                        .it
                            span 联系方式：：
                            span {{numHidf3l4(item.mobile)}}
                        .it
                            span 地址：
                            span {{item.province}} {{item.city}} {{item.address}}
                        .it.h40
                            .action
                                .item(v-if="item.defaultable")
                                    span.quan(:class="item.defaultable?'active':''")
                                    span(v-if="item.defaultable") 默认
                                    //span(v-if="!item.defaultable",@click="setDefault(item)") 设为默认
                                .item(v-if="!item.defaultable",@click="setDefault(item)")
                                    span.quan(:class="item.defaultable?'active':''")
                                    //span(v-if="item.defaultable") 默认
                                    span(v-if="!item.defaultable") 设为默认
                                .item(@click="editAdress(item)")
                                    span.icon
                                    span.edit 编辑

            .add-address(v-if="status==1 && maxNumber>addressList.length")
                .address(@click="addAddress")
                    span +新增收货地址
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import thatStore from "@/store/comstore/center/base/addressManagerStore"; // 获取模板
import store from '@/store/Store';
import Rule from "@m/rule"; // 验证
import comDialog from '@pon/template2/comDialog'
import {numHidf3l4, resNum, spacesForma} from '@m/utils' // 工具类
export default {
    name: "addressManager",
    components: {
        comDialog,
    },
    data() {
        return {
            isReqFlag: true, // 请求是否结束
            //status:'1',//当前状态 1, list 2. form add
            showCommonDialogFlag: false,
            showCommonDialogFlag1: false,
            showCommonDialogFlag2: false,
            currtTab: '1',
            bank: '',
            name: '', // 收货人姓名
            address: '',//详细地址
            realName: '', //真实姓名
            pvorvince: '', //省
            city: '',//市
            mobile: '',//手机号码
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
                name: {
                    msg: "",
                    isPass: false
                },
                mobile: {
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
                address: {
                    msg: "",
                    isPass: false
                },
            },
            //校验错误提示信息
            errorMsg: "",
            subFlag: false, // 是否校验通过
            showDialog: false,
            currtItem: '',
            actionType: "",// add  edit
            isFirst: false, // 是否是第一次
        }
    },
    computed: {
        ...mapState({
            commonData: state => state['centerStore'].commonData,
            userInfo: state => state['centerStore'].userInfo,
            cityList: state => state['addressManagerStore'].cityList,
            maxNumber: state => state['addressManagerStore'].maxNumber,
            addressList: state => state['addressManagerStore'].addressList,
            // status: state => state['addressManagerStore'].status,
        }),
        status: {
            // 默认选中的tab
            get() {
                return this.$store.state['addressManagerStore'].status;
            },
            set(val) {
                this.setStatus(val);
            }
        },
    },
    watch: {
        name: function (val) {
            this.runCheckList()
        },
        mobile: function (val) {
            this.runCheckList()
        },
        address: function (val) {
            this.runCheckList()
        },

    },
    created() {
        // 动态store
        if (!store.state["addressManagerStore"]) {
            thatStore.install(this);
        }
        this.getAddressesLimitNumberFun();
        this.getDeliveryAddressesFun()
    },
    methods: {
        ...mapMutations({
            setStatus(commit, param) {
                return commit('addressManagerStore/SET_STATUS', param);
            }
        }),
        ...mapActions({
            getProvicesOrCitiesFun(dispatch, param) {
                return dispatch(`addressManagerStore/getProvicesOrCitiesAction`, param);
            },
            updateUserInfoFun(dispatch, param) {
                return dispatch(`centerStore/updateUserInfoAction`, param);
            },
            getAddressesLimitNumberFun(dispatch, param) {
                return dispatch(`addressManagerStore/getAddressesLimitNumberAction`, param);
            },
            getDeliveryAddressesFun(dispatch, param) {
                return dispatch(`addressManagerStore/getDeliveryAddressesAction`, param);
            },
            addAddressesFun(dispatch, param) {
                return dispatch(`addressManagerStore/addAddressesAction`, param);
            },
            updateAddressesFun(dispatch, param) {
                return dispatch(`addressManagerStore/updateAddressesAction`, param);
            },
        }),
        spacesForma: spacesForma,
        numHidf3l4: numHidf3l4,
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
            this.closeDialog();
            this.cityVerif()
        },
        selectBank(item) {
            this.bank = item;
        },
        toggleDialog(flag) {
            this.closeDialog();
            this.checkTab(1)
            this.showCommonDialogFlag = !this.showCommonDialogFlag;

        },
        toggleDialog1() {
            this.closeDialog();
            this.showCommonDialogFlag1 = !this.showCommonDialogFlag1;
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
            console.log('a033')
            if (!this.isFirst) {
                console.log('a01')
                this.isDefault = !this.isDefault;
            }
            console.log('a02')
        },
        submitFun() {
            //this.status = 1;
            let that = this;
            let obj = {
                address: this.address,//收货地址
                name: this.name, // 收货人姓名
                mobile: this.mobile, //收货人手机
                //province :this.pvorvince.name,//省名称
                //city :this.city.name,//市名称
                defaultable: this.isDefault,//是否市默认银行卡，true表示是，false表示不是
                cityId: this.city.id,// 市id
                provinceId: this.pvorvince.code,//省id
            }
            // 校验
            this.runCheckList()
            if (!this.subFlag) {
                window.win.tips.info(this.errorMsg);
                return;
            }
            if (obj.mobile) {
                obj.mobile = obj.mobile.replace(/\s/g, "")
            }
            if (this.actionType == "add") {
                if (this.isReqFlag) {
                    this.isReqFlag = false;
                    this.addAddressesFun(obj).then(function () {
                        that.isReqFlag = true;
                    });
                }
            } else {
                obj.id = this.currtItem.id;
                if (this.isReqFlag) {
                    this.isReqFlag = false;
                    this.updateAddressesFun(obj).then(function () {
                        that.isReqFlag = true;
                    });
                }
            }
        },
        addAddress() {
            this.actionType = "add";
            // 重置界面数据
            this.resetPageData();
            this.setStatus(2)
            //判断是不是第一次绑定地址?
            if (!this.userInfo.addressSetStatus) {
                this.isDefault = true;
                this.isFirst = true;
            } else {
                this.isDefault = false;
                this.isFirst = false;
            }
        },
        setDefault(item) {
            let that = this;
            if (this.isReqFlag) {
                this.isReqFlag = false;
                item.defaultable = true;
                this.updateAddressesFun(item).then(function (res) {
                    that.isReqFlag = true;
                    if(res && res.success) {
                        item.defaultable = true;
                        window.win.tips.toast("设置成功!");
                    }
                });
            }
        },
        editAdress(item) {
            this.actionType = "edit";
            this.currtItem = item;
            this.name = item.name;
            this.mobile = item.mobile;
            this.isDefault = item.defaultable;
            this.address = item.address;
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
            //校验
            this.runCheckList()
            this.setStatus(2)
            // 根据选中的省份 - 调用查询市区接口
            // 查询对应的市
            // this.getProvicesOrCitiesFun({parentId: item.provinceId, command: 2})
        },
        // 收货人
        realNameVerif() {
            this.name = this.name.replace(/\s+/g, "");
            let rule = Rule.init().rules.adName,
                bool = rule.reg.test(this.name);
            if (bool) {
                this.reg.name.isPass = true;
                this.reg.name.msg = "";
            } else {
                this.reg.name.isPass = false;
                this.reg.name.msg = "收货人" + rule.desc;
                this.errorMsg = "收货人" + rule.desc;
            }
            this.btnVerif();
        },
        // 校验入口
        handleInputNum11(e) { // 通过正则过滤小数点后两位
            if (e) {
                let n = 13
                resNum(e, n)
                this.mobile = resNum(e, n)
            }
            this.telVerif();
        },
        // 手机号码
        telVerif() {
            let tel = this.mobile ? this.mobile.replace(/\s/g, "") : '';
            if (!tel) {
                this.mobile = "";
            } else {
                this.mobile = this.spacesForma(tel);
            }
            // 校验 转换
            if (!tel) {
                this.reg.mobile.isPass = true;
                this.reg.mobile.msg = "";
                return;
            }

            let rule = Rule.init().rules.tel,
                bool = rule.reg.test(tel);
            if (bool) {
                this.reg.mobile.isPass = true;
                this.reg.mobile.msg = "";
            } else {
                this.reg.mobile.isPass = false;
                this.reg.mobile.msg = rule.desc;
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
        //详细收货地址
        addressVerif() {
            let rule = Rule.init().rules.nonempty,
                bool = rule.reg.test(this.address);
            if (bool) {
                this.reg.address.isPass = true;
                this.reg.address.msg = "";
            } else {
                this.reg.address.isPass = false;
                this.reg.address.msg = "详细收货地址" + rule.desc;
                this.errorMsg = "详细收货地址" + rule.desc;
            }
            this.btnVerif();
        },
        // 执行校验 -- 倒序
        runCheckList() {
            this.addressVerif();
            this.cityVerif();
            this.pvorvinceVerif();
            this.handleInputNum11()
            this.realNameVerif();
            this.btnVerif();
        },
        // 按钮校验  判断是否校验通过
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
        jumpTab() {
            this.status = 1;
        },
        resetPageData() {
            this.name = '';
            this.bank = '';
            this.mobile = '';
            this.address = '';
            this.pvorvince = '';
            this.city = '';
            this.isDefault = false;
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template2/themes/mixin.styl'
@import "~@styl/template2/common/fun.styl"

.addressManager
    bg_color(bg59)
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
                font_color(fc089);

            &:nth-child(2)
                margin-left 10px
                font-size: 14px;
                font_color(fc089);

    .info
        padding 20px

        .tip
            font-size: 14px;
            font_color(fc091);
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
                    border_all(1px, solid, border51);
                    margin-bottom 20px
                    display flex
                    flex-direction row
                    flex-wrap nowrap
                    .form-item-width500
                        width: 500px;
                    .form-item-width40p
                        width: 40%;
                    input
                        font-size 16px
                        background-color transparent
                        font_color(fc089);

                        &::placeholder
                            font_color(fc097);

                    textarea
                        line-height: 16px;
                        font-size: 13px;
                        padding: 10px;
                        background-color transparent
                        border_all(1px, solid, border51);
                        font_color(fc089);

                        &::placeholder
                            font_color(fc097);

                    .lable
                        flex none
                        width 90px
                        text-align right
                        font-size: 16px;
                        letter-spacing: 2px;
                        font_color(fc091);

                    &.dialog-con
                        flex none
                        position relative

                        .common-dialog
                            z-index: 3;
                            position absolute
                            top 66px
                            left 0px
                            width 500px
                            bg_color(bg65);
                            //border_all(1px, solid, border03)
                            border-radius: 0px 0px 10px 10px;

                            .dialog-title
                                span
                                    display inline-block
                                    width: 50%;
                                    height: 60px;
                                    line-height 60px
                                    text-align center
                                    bg_color(bg68);
                                    font-size: 18px;
                                    font_color(fc089);
                                    //border_com(1px, solid, border01, right)

                                    &.active
                                        bg_color(bg60);
                                        font_color(fc088);

                            .pvorvince-list
                                padding-bottom 20px

                                ul
                                    resetul()

                                    li
                                        width 100%
                                        text-align center
                                        font-size: 16px;
                                        font_color(fc089);
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
                                                    bg_color(bg60);
                                                    font_color(fc088);
                                                    border-radius: 5px;

                            .city-list
                                padding-bottom 20px

                                ul
                                    resetul()
                                    width 100%
                                    text-align center
                                    font-size: 16px;
                                    font_color(fc089);
                                    display flex
                                    flex-direction row
                                    flex-wrap wrap
                                    line-height 30px
                                    justify-content space-between
                                    align-items center
                                    padding 10px
                                    overflow auto

                                    li
                                        flex none
                                        align-self center
                                        margin-right 10px
                                        cursor pointer
                                        padding-right: 10px;
                                        padding-left: 10px;
                                        margin-bottom: 10px;

                                        &.active, &:hover
                                            bg_color(bg60);
                                            font_color(fc088);
                                            border-radius: 5px;

        .default-con
            display flex
            align-items center
            margin-bottom 20px

            span
                flex none
                font-size: 16px;
                font_color(fc089);

            .default
                margin-right 10px
                display inline-block
                width 15px
                height 15px
                border_all(1px, solid, border51)
                position relative
                cursor pointer

                &.active
                    bg_color(bg06);

        .submit-btn
            width: 290px;
            line-height 60px

        .info-list
            ul
                resetul()

                li
                    position relative
                    padding 10px 20px
                    width: 892px;
                    min-height 140px
                    height: auto;
                    border_all(1px, solid, border05);
                    font-size: 16px;
                    font_color(fc05);
                    border-radius: 10px;
                    margin-top 10px

                    .it
                        line-height 30px

                        .action
                            height 36px
                            width: 308px;
                            position absolute
                            padding 0 20px 0 24px
                            display flex
                            flex-direction row
                            flex-wrap nowrap
                            justify-content center
                            align-items center
                            right: 0;

                            .item
                                font-size: 13px;
                                font-stretch: normal;
                                letter-spacing: 0px;
                                font_color(fc05);
                                flex 1
                                display flex
                                align-items center
                                flex-direction row
                                cursor pointer

                                span
                                    margin-right 10px

                                    &.quan
                                        display inline-block
                                        width: 18px;
                                        height: 18px;
                                        border_all(2px, solid, border06)
                                        border-radius 50%

                                        &.active
                                            border none
                                            bg_color(bg06);

                                    &.icon
                                        background url("~@img/template2/center/edit.png") center / contain no-repeat
                                        width 18px
                                        height 18px

                                &:nth-child(2)
                                    display flex
                                    flex-direction row
                                    justify-content flex-end


        .add-address
            margin-top 20px

            .address
                line-height 150px
                text-align center
                border-radius: 10px;
                opacity: 0.5;
                font-size: 16px;
                font-weight: bold;
                font-stretch: normal;
                letter-spacing: 0px;
                font_color(fc05);
                position relative
                width: 892px;
                height: 140px;
                border_all(1px, solid, border05);

.dialog-con
    input
        cursor pointer

.ponint
    cursor pointer
.h40
    height 40px
</style>
