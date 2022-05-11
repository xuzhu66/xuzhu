<template lang="pug">
    .baseInfo
        .dialog-flow(v-if="showDateDialogFlag",@click="closeDialog")
        .info
            .tip *真实姓名是您的取款银行卡姓名，无法更改，务必填写正确，否则无法顺利取现到账！
            .info-con
                .form
                    .form-item.gay
                        .lable.userid 用户ID:
                        input.user-id(maxlength=20,placeholder='用户ID',v-model="userInfo.playerId"  readonly)
                    .form-item(:class="userInfo.username?'gay':'user-icon'")
                        .lable 用户账号:
                        input.user-acout(placeholder='用户账号',maxlength=8,v-model="username",:readonly="userInfo.username?true:false" )
                        .icon.acount
                    .form-item(class="gay")
                        .lable 手机号码:
                        input.user-tel(placeholder='手机号码',maxlength=13, type='tel',v-model="mobile",:readonly="userInfo.mobile?true:false" ,readonly)
                        span.tel.red(v-if="!userInfo.mobile") 未绑定
                        span.tel.yellow(v-if="userInfo.mobile && userInfo.mobileChecked == 0") 未验证
                        span.tel.green(v-if="userInfo.mobile && userInfo.mobileChecked == 1") 已验证
                    .form-item(:class="userInfo.realName?'gay':''")
                        .lable 真实姓名:
                        input.user-acout(placeholder='真实姓名',maxlength=20,v-model="realName",:readonly="userInfo.realName?true:false")
                        .icon.acount
                    //.form-item(:class="userInfo.sex.toString().length ==1?'gay':''")
                        .lable.sex 性&nbsp;&nbsp;别:
                        .sex-list
                            span.man(:class="sex===1?'active':''",@click="checkSex(1)")
                            span(@click="checkSex(1)") 男
                            span.woman(:class="sex===0?'active':''",@click="checkSex(0)")
                            span(@click="checkSex(0)") 女
                    //.form-item.date-item(:class="userInfo.birthday?'gay':''")
                        .lable 出生日期:
                        .date-list(@click="toggleDialog")
                            input.year(value="1998",placeholder='年',v-model='currtYear',readonly)
                            span 年
                            input.mounth(value="08",placeholder='月',v-model='currtMounth',readonly)
                            span 月
                            input.day(value="18",placeholder='日',v-model='currtDay',readonly)
                            span 日
                        .date-dialog(v-if="showDateDialogFlag")
                            .date-title
                                span(@click="checkTab(1)",:class="currtTab == 1?'active':''" ) 年份
                                span(@click="checkTab(2)",:class="currtTab == 2?'active':''" ) 月份
                                span(@click="checkTab(3)",:class="currtTab == 3?'active':''" ) 日期
                            .year-con(v-if="currtTab == 1")
                                .year-btns
                                    .left-btn(@click="preYears") <<
                                    .year-sque {{yearList[0]}}-{{yearList[yearList.length-1]}}
                                    .right-btn(@click="nextYears") >>
                                .year-list
                                    ul
                                        template(v-for="(it,ind) in yearList")
                                            li(@click="selectYear(it)",:class="currtYear==it?'active':''") {{it}}

                            .mounth-list(v-if="currtTab == 2")
                                ul
                                    template(v-for="(it,ind) in mounthList")
                                        li(@click="selectMounth(it)",:class="currtMounth==it?'active':''") {{it}}
                            .day-list(v-if="currtTab == 3")
                                ul
                                    template(v-for="(it,ind) in dayList")
                                        li(@click="selectDay(it)",:class="currtDay==it?'active':''") {{it}}


                .common-btn(@click="submitFun",:class="[{ 'ok': subFlag }]") 保存
</template>

<script>
import thatStore from "@/store/comstore/center/base/baseInfoStore"; // 获取模板
import store from '@/store/Store';
import {mapActions, mapState} from "vuex";
import Rule from "@m/rule"; // 验证
import {spacesForma, numHidf3l4} from '@m/utils'

export default {
    name: "baseInfo",
    data() {
        return {
            isReqFlag: true, // 请求是否结束
            actionType: "",// 1 : add 2: edit
            showDateDialogFlag: false,
            yearPage: 1,
            yearPageSize: 30,
            start: '',
            end: 2020,
            yearList: [],
            // 年月日tab
            currtTab: '1',
            mounthList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            dayList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],

            username: "",
            realName: "",
            mobile: "",
            currtYear: '',
            currtMounth: '',
            currtDay: '',
            sex: '', // 0:女 1:男

            // 校验规则
            reg: { // 验证
                username: {
                    msg: "",
                    isPass: false
                },
                // mobile: {
                //     msg: "",
                //     isPass: false
                // },
                realName: {
                    msg: "",
                    isPass: false
                },
                // sex: {
                //     msg: "",
                //     isPass: false
                // },
                // currtYear: {
                //     msg: "",
                //     isPass: false
                // },
                // currtMounth: {
                //     msg: "",
                //     isPass: false
                // },
                // currtDay: {
                //     msg: "",
                //     isPass: false
                // },
            },
            //校验错误提示信息
            errorMsg: "",
            subFlag: false, // 是否校验通过
            userInfo: {
                sex: ""
            },
        }
    },
    computed: {
        ...mapState({
            commonData: state => state['centerStore'].commonData,
            // userInfo: state => state['centerStore'].userInfo,
        }),

    },
    watch:{
        username(){
            this.usernameVerif()
        },
        mobile(val, old) {
            if(old){
                this.telVerif()
            }
        },
        realName(val, old) {
            this.realNameVerif()
        },
    },
    created() {
        // 动态store
        if (!store.state["baseInfoStore"]) {
            thatStore.install(this);
        }
    },
    mounted() {
        this.initYearList()
        this.initPage()

    },
    methods: {
        ...mapActions({
            // 更新用户信息
            updateUserInfoFun(dispatch, param) {
                return dispatch(`centerStore/updateUserInfoAction`, param);
            },
            // 查询用户信息
            getUserInfoFun(dispatch, param) {
                return dispatch(`centerStore/getUserInfoAction`, param);
            },
        }),
        spacesForma: spacesForma,
        numHidf3l4: numHidf3l4,
        initYearList() {
            this.yearList = [];
            this.start = this.end - this.yearPageSize * this.yearPage + 1;
            for (var i = this.start; i <= this.start + 29; i++) {
                this.yearList.push(i)
            }
        },
        preYears() {
            if (this.yearPage <= 2) {
                this.yearPage = this.yearPage + 1;
                this.initYearList();
            }
        },
        nextYears() {
            if (this.yearPage != 1) {
                this.yearPage = this.yearPage - 1;
                this.initYearList();
            }
        },
        resetYearModule() {
            this.currtYear = '';
            this.yearPage = 1;
            this.yearPageSize = 30;
            this.start = '';
            this.end = 2020;
            this.yearList = [];
        },

        checkTab(tab) {
            this.currtTab = tab;
        },
        selectYear(year) {
            this.currtYear = year;
            this.checkTab(2)
            this.currtYearVerif()
        },
        selectMounth(mounth) {
            this.currtMounth = mounth;
            this.checkTab(3)
            this.currtMounthVerif()
        },
        selectDay(day) {
            this.currtDay = day;
            this.closeDialog()
            this.currtDayVerif()
        },
        toggleDialog() {
            if (!this.userInfo.birthday) {
                this.showDateDialogFlag = !this.showDateDialogFlag;
            }
        },
        closeDialog() {
            this.showDateDialogFlag = false;
        },
        checkSex(it) {
            // 有性别
            if (this.userInfo.sex.toString().length == 1) {

            } else {
                this.sex = it;
                this.sexVerif()
            }
        },
        getUserInfoForm() {
            let obj = {
                id: this.userInfo.playerId,
                username: this.username,
                realName: this.realName.replace(/\s*/g,""),
                mobile: this.userInfo.mobile,
                sex: this.sex, // 0:女 1:男
            }
            if (obj.mobile) {
                obj.mobile = obj.mobile.replace(/\s/g, "")
            }
            if (this.currtMounth.toString().length == 1) {
                this.currtMounth = "0" + this.currtMounth.toString();
            }
            if (this.currtDay.toString().length == 1) {
                this.currtDay = "0" + this.currtDay.toString();
            }

            if (this.currtYear && this.currtMounth && this.currtDay) {
                obj.birthday = this.currtYear + "-" + this.currtMounth + "-" + this.currtDay;
            }
            return obj;
        },
        submitFun() {
            let param = this.getUserInfoForm()
            let that = this;
            // 校验
            this.runCheckList()
            if (!this.subFlag) {
                window.win.tips.info(this.errorMsg);
                return;
            }
            if (this.isReqFlag) {
                this.isReqFlag = false;
                this.updateUserInfoFun(param).then(function () {
                    that.isReqFlag = true;
                    that.initPage()
                });
            }
        },
        initPage() {
            let that = this;
            this.getUserInfoFun().then(function (res) {
                if (res && res.success) {
                    let data = res.data;
                    that.userInfo = res.data;
                    that.username = data.username;
                    that.realName = data.realName,
                        that.mobile = data.mobile ? that.numHidf3l4(data.mobile) : "";
                    that.sex = data.sex;
                    let birthday = data.birthday ? data.birthday.split("-") : [];
                    that.currtYear = data.birthday ? birthday[0] : "";
                    that.currtMounth = data.birthday ? birthday[1] : "";
                    that.currtDay = data.birthday ? birthday[2] : ""
                }
                that.runCheckList()
            })
        },

        // 用户账号
        usernameVerif() {
            // if(!this.username){
            //     this.reg.username.isPass = true;
            //     this.reg.username.msg = "";
            //     return ;
            // }
            // 判断是否有值  , 有的话可能是别的平台导入的数据, 则不校验;
            if (this.userInfo.username) {
                this.reg.username.isPass = true;
                this.reg.username.msg = "";
                this.btnVerif();
                return;
            }
            let rule = Rule.init().rules.regUserName,
                bool = rule.reg.test(this.username);
            if (this.username && bool) {
                this.reg.username.isPass = true;
                this.reg.username.msg = "";
            } else {
                this.reg.username.isPass = false;
                this.reg.username.msg = "用户账号" + rule.desc;
                this.errorMsg = "用户账号" + rule.desc;
            }
            this.btnVerif();
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
        // 真实姓名校验
        realNameVerif() {
            // if(!this.realName){
            //     this.reg.realName.isPass = true;
            //     this.reg.realName.msg = "";
            //     return ;
            // }
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
        // 性别
        sexVerif() {
            // if(this.sex == ""){
            //     this.reg.sex.isPass = true;
            //     this.reg.sex.msg = "";
            //     return;
            // }
            let rule = Rule.init().rules.nonempty,
                bool = rule.reg.test(this.sex);
            if ((this.sex == 0 || this.sex == 1) && bool) {
                this.reg.sex.isPass = true;
                this.reg.sex.msg = "";
            } else {
                this.reg.sex.isPass = false;
                this.reg.sex.msg = "性别" + rule.desc;
                this.errorMsg = "性别" + rule.desc;
            }
            this.btnVerif();
        },
        // 年
        currtYearVerif() {
            // if(!this.currtDay && !this.currtMounth && !this.currtYear){
            //     this.reg.currtYear.isPass = true;
            //     this.reg.currtYear.msg = "";
            //     return;
            // }
            let rule = Rule.init().rules.nonempty,
                bool = rule.reg.test(this.currtYear);
            if (bool) {
                this.reg.currtYear.isPass = true;
                this.reg.currtYear.msg = "";
            } else {
                this.reg.currtYear.isPass = false;
                this.reg.currtDay.msg = "请选择出生日期";
                this.errorMsg = "请选择出生日期";
            }
            this.btnVerif();
        },
        // 月
        currtMounthVerif() {
            // if(!this.currtDay && !this.currtMounth && !this.currtYear){
            //     this.reg.currtMounth.isPass = true;
            //     this.reg.currtMounth.msg = "";
            //     return;
            // }
            let rule = Rule.init().rules.nonempty,
                bool = rule.reg.test(this.currtMounth);
            if (bool) {
                this.reg.currtMounth.isPass = true;
                this.reg.currtMounth.msg = "";
            } else {
                this.reg.currtMounth.isPass = false;
                this.reg.currtDay.msg = "请选择出生日期";
                this.errorMsg = "请选择出生日期";
            }
            this.btnVerif();
        },
        // 日
        currtDayVerif() {
            // if(!this.currtDay && !this.currtMounth && !this.currtYear){
            //     this.reg.currtDay.isPass = true;
            //     this.reg.currtDay.msg = "";
            //     return;
            // }else{
            //     this.reg.currtDay.isPass = false;
            //     this.reg.currtDay.msg = "请选择出生日期";
            //     this.errorMsg = "请选择出生日期";
            // }
            let rule = Rule.init().rules.nonempty,
                bool = rule.reg.test(this.currtDay);
            if (bool) {
                this.reg.currtDay.isPass = true;
                this.reg.currtDay.msg = "";
            } else {
                this.reg.currtDay.isPass = false;
                this.reg.currtDay.msg = "请选择出生日期";
                this.errorMsg = "请选择出生日期";
            }
            this.btnVerif();
        },
        // 执行校验 -- 倒序
        runCheckList() {
            //this.currtDayVerif();
            //this.currtMounthVerif();
            //this.currtYearVerif();
            //this.sexVerif()
            this.realNameVerif();
            //this.telVerif();
            this.usernameVerif()
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
                // 判断是否都有值,都有值不可编辑;
                if (this.userInfo.username && this.userInfo.realName && (this.userInfo.sex == 0 || this.userInfo.sex == 1) && this.userInfo.birthday) {
                    this.subFlag = false;
                }
            } else {
                this.subFlag = false;
            }

        },
    }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template1/themes/mixin.styl'
@import "~@styl/template1/common/fun.styl"

.baseInfo
    bg_color(bg04)
    border-radius: 0px 0px 10px 10px;
    min-height 890px

    .dialog-flow
        width: 100%;
        height: 100%;
        bg_color(bg51)
        opacity: .1;
        position: absolute;
        top: 0;
        left: 0;
        z-index 2;

    .info
        padding 20px

        .tip
            font-size: 14px;
            font_color(fc05);
            margin-botton 20px

        .info-con
            width 520px
            margin 0 auto
            padding 100px 10px

            .form
                .form-item
                    width: 500px;
                    height: 68px;
                    line-height 68px
                    border-radius: 5px;
                    border_all(1px, solid, border02);
                    margin-bottom 20px
                    display flex
                    flex-direction row
                    flex-wrap nowrap

                    &.gay
                        bg_color(bg08)

                        input
                            bg_color(bg08)

                    .tel
                        display inline-block
                        width 100px
                        font-size 14px

                        &.red
                            font_color(fc09)

                        &.yellow
                            font_color(fc010)

                        &.green
                            font_color(fc011)

                    input
                        font-size 16px

                    .lable
                        flex none
                        width 90px
                        text-align right
                        font-size: 16px;
                        letter-spacing: 2px;
                        font_color(fc05);

                        &.userid
                            letter-spacing: 5px;

                        &.sex
                            letter-spacing: 8px;

                    .sex-list
                        padding-left 20px
                        display: flex;
                        flex-direction: row;
                        flex-wrap: nowrap;
                        justify-content: center;
                        align-items center

                        span
                            margin-right 20px

                            &.man, &.woman
                                width 24px
                                height 24px
                                display inline-block
                                border_all(1px, solid, border04)
                                border-radius 50%
                                font-size: 16px;
                                font_color(fc05);

                                &.active
                                    bg_color(bg09);
                                    border none
                                    position relative

                                    &:before
                                        content: '√';
                                        font_color(fc01)
                                        display: block;
                                        font-size: 20px;
                                        position: absolute;
                                        top: 50%;
                                        left: 50%;
                                        transform: translate(-50%, -50%);
                                        font-weight: 600;


                    .date-list
                        display: flex;
                        flex-direction: row;
                        flex-wrap: nowrap;
                        justify-content: center;
                        align-items center
                        font-size 16px
                        font_color(fc05);
                        padding-left 20px

                        input, span
                            flex none
                            width 60px
                            height 100%


                    &.date-item
                        flex none
                        position relative

                        .dialog-flow
                            position fixed
                            width 100%
                            height 100%
                            bg_color(bg44)
                            z-index 2;

                        .date-dialog
                            position absolute
                            top 66px
                            left 0px
                            height 320px
                            width 500px
                            bg_color(bg04);
                            border_all(1px, solid, border03)
                            border-radius: 0px 0px 10px 10px;
                            z-index 3

                            .date-title
                                span
                                    display inline-block
                                    width: 166px;
                                    height: 60px;
                                    line-height 60px
                                    text-align center
                                    bg_color(bg05);
                                    font-size: 18px;
                                    font_color(fc06);
                                    border_com(1px, solid, border01, right)
                                    cursor pointer

                                    &.active
                                        bg_color(bg04);

                            .year-con
                                .year-btns
                                    height 36px
                                    display flex
                                    flex-wrap nowrap
                                    flex-direction row
                                    justify-content space-between
                                    align-items center
                                    font-size: 16px;
                                    font_color(fc06);
                                    cursor pointer

                                    div
                                        flex 1
                                        text-align center

                                .year-list
                                    ul
                                        resetul()
                                        display flex
                                        flex-direction row
                                        flex-wrap wrap
                                        justify-content flex-start

                                        li
                                            flex none
                                            width 80px
                                            height 36px
                                            text-align center
                                            margin-right 2px
                                            margin-bottom 2px
                                            font-size: 16px;
                                            line-height: 36px;
                                            font_color(fc06);
                                            cursor pointer

                                            &.active
                                                bg_color(bg05);
                                            border-radius: 5px;

                                            &:hover
                                                bg_color(bg05);
                                                border-radius: 5px;

                            .mounth-list, .day-list
                                ul
                                    resetul()
                                    display flex
                                    flex-direction row
                                    flex-wrap wrap
                                    justify-content flex-start

                                    li
                                        flex none
                                        width 80px
                                        height 36px
                                        text-align center
                                        margin-right 2px
                                        margin-bottom 2px
                                        font-size: 16px;
                                        line-height: 36px;
                                        font_color(fc06);
                                        cursor pointer

                                        &.active
                                            bg_color(bg05);
                                            border-radius: 5px;

                                        &:hover
                                            bg_color(bg05);
                                            border-radius: 5px;

                .user-icon
                    position relative

                    &:after
                        content: "";
                        display: block;
                        background url("~@img/template1/center/edit.png") center no-repeat
                        width 20px
                        height 21px
                        position absolute
                        top 50%
                        transform translateY(-50%)
                        right 18px

                .tel-icon
                    position relative

                    &:after
                        content: "";
                        display: block;
                        background url("~@img/template1/center/tel.png") center no-repeat
                        width 17px
                        height 24px
                        position absolute
                        top 50%
                        transform translateY(-50%)
                        right 18px

                    &.checked:after
                        background url("~@img/template1/center/renz.png") center no-repeat

            .submit-btn
                width: 290px;
                line-height 60px
                text-align center
                font-size: 18px;
                font_color(fc08);
                bg_img_linear(linear04, linear03)
                background-blend-mode: normal, normal;
                border-radius: 10px;
                margin 0 auto
</style>
