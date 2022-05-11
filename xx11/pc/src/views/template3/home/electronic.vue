<template lang="pug">
    .electronic-page
        Banner(:bannerType="bannerType")
        Notice
        .heg-banner
            .w1200.heg-ebw
                p.e-bonus
                    span.eb-n1 {{ebn1}}
                    span.eb-n2 {{ebn2}}
                    span.eb-n3 {{ebn3}}
                    span.eb-n4 {{ebn4}}
                    span.eb-n5 {{ebn5}}
                    span.eb-n6 {{ebn6}}
                    span.eb-n7 {{ebn7}}
                    span.eb-n8 {{ebn8}}
                    span.eb-n9 {{ebn9}}
                    span.eb-n10 {{ebn10}}
                //v-countup(:start-value="coupz1" :end-value="coupz2")
        .electronic-con
            .electronic-flow.w1200
                //- 查询模块
                .search-con(:class="[{'heg-sp': isPGameSearch}]")
                    // tab 标题
                    .tabname-con
                        ul
                            li(v-for="(v,i) in menu" :key="i" :class="[{'curMenu': curMenu == v.key}]" @click="changeDateType(v)") {{ v.name }}
                        //- 查询框
                        .search-obj
                            .input-obj
                                input(type='text' :maxlength="10" v-model="keyWord" placeholder="输入关键字" @focus="focusStatus")
                            .search-btn(@click="toSearch()")
                                svg-icon(icon-class='search')
                    // 线路名称
                    .line-con
                        .electronic-title 线路名称：
                        ul
                            li(v-for="(v,i ) in lineMenu" :key="i" :class="[{'current': lineCur == 'all'}]" @click="changeLineType(v)") {{ v.name }}
                            li(v-if="gameLineArr && gameLineArr.length>0" v-for="(v,i) in gameLineArr" :key="i+1" :class="lineCur == v.gameLineId?'current':''" @click="changeLineType(v)") {{ v.name }}
                    // 游戏类型
                    .line-con
                        p.electronic-title 游戏类型：
                        ul
                            li(v-for="(v,i) in typeMenu" :key="i" :class="[{'current': typeCur == v.key}]" @click="changeType(v)") {{ v.name }}

                van-list(loading-text="正在加载中" v-show="tableList.length>0" :offset="0" v-model="tableLoading" :finished="tableFinished" finished-text="没有更多了" :immediate-check="false" @load="getTableList")
                    ul.electronic-list
                        li(v-for="(v,i ) in tableList", :key="i", class="electronic-item")
                            //- 图片
                            .electronic-img
                                img(:src="$ossImg(v.pcImgUrl)" @error="imgError(v)")
                            //- 底部
                            .electronic-bottom
                                span.electronic-name(v-html="v.name")
                                span.electronic-icon(v-show="userId != ''" :class="[{'cur-coll':v.loveFlag}]" @click="setLoveGame(v)")
                                    svg-icon(icon-class='collect')
                            //- 浮动框
                            .electronic-pop
                                .electronic-pop-obj
                                    button.free(v-show="v.pcSupport==1 && userId != ''", @click="showGameDialog(v)") 立即试玩
                                    button(v-if="userId != ''" ,@click="showGameDialog(v)") 进入游戏
                                    button(v-if="userId == ''" @click="showGameDialog(v)") 进入游戏

                .nodata(v-if="tableList && tableList.length == 0")
</template>
<script>
//import Vue from 'vue'
import {mapActions, mapMutations, mapState} from "vuex";
import Banner from '@pon/template3/banner'; // Banner轮播图片
import Notice from '@pon/template3/notice'; // 公告栏
import homeGameStore from "@/store/comstore/home/homeGameStore"; // game状态
import {List} from 'vant';
//import VueCountUp from 'vue-countupjs'
//Vue.use(VueCountUp)

const pageListModule = 'homeGameStore';
export default {
    name: 'electronic', // 玩家
    components: {
        [List.name]: List,
        Banner: Banner, // Banner轮播图片
        Notice: Notice,
    },
    computed: {
        ...mapState({
            gameLineId(state) {
                return state[pageListModule].gameLineId;
            },
            name(state) {
                return state[pageListModule].name;
            },
            loveFlag(state) {
                return state[pageListModule].loveFlag;
            },
            tableList(state) { // list数据
                return state[pageListModule].tableResult.tableList;
            },
            tableFinished(state) { // list 全部加载完
                return state[pageListModule].tableResult.tableFinished;
            },
            requestFinished(state) { // 请求完毕
                return state[pageListModule].tableResult.requestFinished;
            }
        }),
        isReq: { // 请求是否完成
            get() {
                return this.$store.state.gameStore.isReq;
            },
            set(item) {
                return item
            }
        },
        gameLineArr: { // 线路
            get() {
                return this.$store.state.homeGameStore.gameLineArr;
            },
            set(item) {
                return item
            }
        },
        isPGameSearch: { // 游戏搜索
            get() {
                return this.$store.state.isPGameSearch;
            },
            set(item) {
                return item
            }
        },
        searchArr: { // 搜索列表
            get() {
                return this.$store.state.homeGameStore.searchArr;
            },
            set(item) {
                return item
            }
        },
        tableLoading: {
            get() {
                return this.$store.state[pageListModule].tableResult.tableLoading;
            },
            set(val) {
                this.$store.commit(
                    `${pageListModule}/tableResult/TABLE_LOADING`,
                    val
                );
            }
        },
        curEgameList: { // 当前游戏列表
            get() {
                return this.$store.state.homeGameStore.curEgameList;
            },
            set(item) {
                return item
            }
        },
        userId: { // 用户ID
            get() {
                return this.$store.state.userId;
            },
            set(item) {
                return item
            }
        },
        eGamebannerList: { // banner列表
            get() {
                return this.$store.state.bannerStore.eGamebannerList;
            },
            set(item) {
                return item
            }
        },
        nebn1: { // 奖金
            get() {
                return this.$store.state.gameStore.nebn1;
            },
            set(item) {
                return item
            }
        },
        nebn2: { // 奖金
            get() {
                return this.$store.state.gameStore.nebn2;
            },
            set(item) {
                return item
            }
        },
        nebn3: { // 奖金
            get() {
                return this.$store.state.gameStore.nebn3;
            },
            set(item) {
                return item
            }
        },
        nebn4: { // 奖金
            get() {
                return this.$store.state.gameStore.nebn4;
            },
            set(item) {
                return item
            }
        },
        nebn5: { // 奖金
            get() {
                return this.$store.state.gameStore.nebn5;
            },
            set(item) {
                return item
            }
        },
    },
    props: {},
    data() {
        return {
            bannerType: 3, // 0 首页 1 真人娱乐 2 棋牌游戏 3 电子游戏 4 捕鱼游戏 5 彩票投注 6 电子竞技 7 体育投注 8 优惠活动
            gcur: '',
            showFreeBut: false, // 是否显示试玩按扭
            freeUrl: '', // 试玩连接
            url: '', // 游戏连接
            curMenu: 'all',
            lineCur: 'all',
            typeCur: 'all',
            keyWord: "", // 搜索的关键字
            ebn1: 0,
            ebn2: 0,
            ebn3: 0,
            ebn4: 0,
            ebn5: 0,
            ebn6: 0,
            ebn7: 0,
            ebn8: 0,
            ebn9: 0,
            ebn10: 0,
            setebTime: null,
            menu: [{
                key: "all",
                name: "全部游戏"
            }, {
                key: "recommend",
                name: "热门游戏"
            }, {
                key: "loveFlag",
                name: "我的收藏"
            }],
            lineMenu: [{
                gameLineId: "all",
                name: "全部"
            }],
            typeMenu: [{
                key: "all",
                name: "全部"
            }, {
                key: 4,
                name: "老虎机"
            }, {
                key: 5,
                name: "桌面游戏"
            }],
            currtItem: "",//当前选中的项目
            coupz1: 510000000.32 + (new Date().getDay() * 1e6) + (new Date().getHours() * 1e5),
            coupz2: 510000000.32 + (new Date().getDay() * 1e6) + (new Date().getHours() * 1e5) + Math.random() * 10000,
        }
    },
    created() {
        if (!this.$store.state["homeGameStore"]) { // game状态
            homeGameStore.install(this);
        }
    },
    watch: {},
    mounted() {
        // vm.$router.push({path: '/electronic', query: {gameLine:'2'}})
    },
    activated() {
        this.pageInit()
    },
    deactivated() {

    },
    methods: {
        ...mapMutations({
            // 设置当前游戏对象
            setCurrtGame(commit, param) {
                return commit('gameStore/set_currtGame', param);
            }
        }),
        async pageInit() { // 构造方法
            this.getGamelines()
            this.resetSearchParam();// 重置搜索条件
            this.resetSearchResult();// 重置搜索结果
            let gline = this.$route.query.gameLine // 获取游戏类型
            this.lineCur = gline ? gline : 'all';
            await this.setGameLineId(gline)
            this.getTableList();
            this.setBouns(); // 获取奖金
        },
        imgError(item) {
            item.pcImgUrl = require('@img/comimages/compon/nopic.png');
        },
        ...mapMutations({
            setGameLineId(commit, payload) {
                return commit(`${pageListModule}/CHANGE_GAMELINEID`, payload);
            },
            setGameTypeId(commit, payload) {
                return commit(`${pageListModule}/CHANGE_GAMETYPEID`, payload);
            },
            setName(commit, payload) {
                return commit(`${pageListModule}/CHANGE_NAME`, payload);
            },
            setLoveFlag(commit, payload) {
                return commit(`${pageListModule}/CHANGE_LOVEFLAG`, payload);
            },
            setRecommend(commit, payload) {
                return commit(`${pageListModule}/CHANGE_RECOMMEND`, payload);
            },
            setTableList(commit, payload) {
                return commit(`${pageListModule}/tableResult/SET_TABLE_LIST`, payload);
            },
            resetSearchParam(commit, payload) {
                return commit(`${pageListModule}/RESET_SEARCH_PARAM`, payload);
            },
            resetSearchResult(commit, payload) {
                return commit(
                    `${pageListModule}/tableResult/RESET_SEARCH_RESULT`,
                    payload
                );
            }
        }),
        ...mapActions({
            getTableList(dispatch, payload) {
                return dispatch(pageListModule + '/getTableList', payload);
            }
        }),
        toSearch(v) { // 搜索
            this.sName = v;
            let a = this.searchArr;
            if (a.length >= 30) a.pop()
            let checkStr = a.indexOf(v)
            if (v && checkStr < 0) {
                a.unshift(v)
                this.$store.commit('homeGameStore/set_searchArr', a) // 当前电子游戏
            }
            this.goToSearch() // 推荐游戏游戏
            // this.getEGameList(v)
        },
        setLoveGame(v) {
            let param = {
                gameId: v.id, // 游戏线路id
                opFlag: !v.loveFlag, // 游戏名称，支持模糊查询
            };
            this.$store.dispatch("homeGameStore/loveGames", param).then(res => {
                let ceList = this.tableList.filter((value, index, arr) => {
                    if (value.id == v.id) {
                        value.loveFlag = !value.loveFlag
                    }
                    return value
                })
                // this.$store.commit('homeGameStore/set_searchGameList',ceList)
                this.setTableList(ceList)
            });
        },
        setBouns() { // 获取奖金
            this.ebn1 = this.nebn1 != '' ? this.nebn1 : Math.floor(Math.random() * (1 - 1)) + 1;
            this.ebn2 = this.nebn2 != '' ? this.nebn2 : Math.floor(Math.random() * (9 - 1)) + 1;
            this.ebn3 = this.nebn3 != '' ? this.nebn3 : Math.floor(Math.random() * (9 - 1)) + 1;
            this.ebn4 = this.nebn4 != '' ? this.nebn4 : Math.floor(Math.random() * (9 - 1)) + 1;
            this.ebn5 = this.nebn5 != '' ? this.nebn5 : Math.floor(Math.random() * (9 - 1)) + 1;
            this.ebn6 = Math.floor(Math.random() * (9 - 1)) + 1;
            this.ebn7 = Math.floor(Math.random() * (9 - 1)) + 1;
            this.ebn8 = Math.floor(Math.random() * (9 - 1)) + 1;
            this.ebn9 = Math.floor(Math.random() * (9 - 1)) + 1;
            this.ebn10 = Math.floor(Math.random() * (9 - 1)) + 1;

            this.redNum()
        },
        redNum() {
            this.setebTime = setInterval(() => {
                this.ebn10++
                if (this.ebn10 > 9) {
                    this.ebn9 = this.ebn9 + 1
                    this.ebn10 = 0
                }
                if (this.ebn9 > 9) {
                    this.ebn8 = this.ebn8 + 1
                    this.ebn9 = 0
                }
                if (this.ebn8 > 9) {
                    this.ebn7 = this.ebn7 + 1
                    this.ebn8 = 0
                }
                if (this.ebn7 > 9) {
                    this.ebn6 = this.ebn6 + 1
                    this.ebn7 = 0
                }
                if (this.ebn6 > 9) {
                    this.ebn5 = this.ebn5 + 1
                    this.ebn6 = 0
                }
                if (this.ebn5 > 9) {
                    this.ebn4 = this.ebn4 + 1
                    this.ebn5 = 0
                }
                if (this.ebn4 > 9) {
                    this.ebn3 = this.ebn3 + 1
                    this.ebn4 = 0
                }
                if (this.ebn3 > 9) {
                    this.ebn2 = this.ebn2 + 1
                    this.ebn3 = 0
                }
                if (this.ebn2 > 9) {
                    this.ebn1 = this.ebn1 + 1
                    this.ebn2 = 0
                }
                if (this.ebn1 > 9) {
                    this.setBouns()
                }
            }, Math.floor(Math.random() * (100 - 0.05)) + 1)
        },

        // item 当前游戏对象 gameType: free 试玩游戏, enter 正式游戏
        thirdLobbyLogin(item, gameType) {
            if (this.userId == '') {
                this.toLogin()
                return
            }
            let that = this;
            let wintab = window.open("", "_blank");
            this.gcur = item.id
            this.isReq = false
            let param = {
                gameLineId: item.gameLineId, // 线路id
                gameId: item.id, // 游戏id
                freePlayFlag: item.pcSupport, // true表示支持试玩，false表示不支持试玩
                deviceType: 2 // 终端：1、H5 2、PC 3、android 4、ios
            };
            this.$store.dispatch("gameStore/enterGameAction", param).then(res => { // 登入三方平台
                if (res && res.success) {
                    this.isReq = true
                    if (res.data.status == '0' || res.data.status == 0) {
                        if (res.data.freeUrl) {
                            this.showFreeBut = true
                        } else {
                            this.showFreeBut = false
                        }
                        this.freeUrl = res.data.freeUrl
                        this.url = res.data.url
                        if (gameType == 'free') {
                            if (res.data.freeUrl) {
                                wintab.location.href = res.data.freeUrl;
                            } else {
                                wintab.close();
                                window.win.tips.info("获取游戏地址失败,请联系客服!")
                            }
                        } else {
                            wintab.location.href = res.data.url;
                        }
                    } else {
                        wintab.close();
                        this.$myDialog({title: '维护公告', con: res.data.msg, btnTextLeft: "我知道了"}, (res) => {

                        });
                    }
                } else {
                    wintab.close();
                    window.win.tips.warning(res.msg);
                }
            });
        },
        oWin(v) {
            if (v) {
                window.open(v, "_blank")
            }
        },
        getGame(value, index) {
            this.$store.dispatch("gameStore/enterBannerAction", value).then(res => {
            });
        },

        setSearchPram() {
            if (this.curMenu == 'recommend') {
                this.setRecommend(true)
                this.setLoveFlag("")
            }
            if (this.curMenu == 'loveFlag') {
                this.setRecommend("")
                this.setLoveFlag(true)
            }
            if (this.curMenu == 'all') {
                this.setRecommend('')
                this.setLoveFlag('')
            }


            if (this.lineCur == 'all') {
                this.setGameLineId('')
            } else {
                this.setGameLineId(this.lineCur)
            }
            if (this.typeCur == 'all') {
                this.setGameTypeId('')
            } else {
                this.setGameTypeId(this.typeCur)
            }
            this.setName(this.keyWord)
            this.keyWord = ''
        },
        goToSearch() {
            this.resetSearchParam();// 重置搜索条件
            this.resetSearchResult();// 重置搜索结果
            this.setSearchPram();
            this.getTableList();
            if (this.isPGameSearch) {
                this.restSeT();
            }
        },
        restSeT() {
            let l = document.getElementById('app').scrollTop;
            let s = l / 600 * 50;  //路程/时间=s *25每隔25ms秒 动的路程
            let st = setInterval(function () {
                l -= s;
                if (l <= 130) {
                    l = 130; //当l<=0时，设置l=0
                    clearInterval(st);
                }
                document.getElementById('app').scrollTop = l;
            }, 25)
        },
        // 切换标签菜单
        changeDateType(item) {
            this.curMenu = item.key
            this.goToSearch();
        },
        changeLineType(item) {
            this.lineCur = item.gameLineId
            this.goToSearch();

        },
        changeType(item) {
            this.typeCur = item.key
            this.goToSearch();
        },
        focusStatus() {
            this.keyWord = ""
        },
        toLogin() {
            this.$store.commit('set_showLogin', true)
            this.$store.commit("loginRegStore/set_curTemp", 'login')
        },
        getGamelines() {
            this.$store.dispatch("homeGameStore/getGamelines").then(res => {
                // this.$store.commit('homeStore/set_hotGame', res.data) // 热门游戏
            });
        },
        //游戏弹框
        showGameDialog(item) {
            //设置游戏对象
            this.setCurrtGame(item);
            //打开弹框
            this.$store.commit('gameStore/set_showPickPlay', true);
        },
    },
    beforeDestroy() {
        this.$store.commit("gameStore/set_nebn1", this.ebn1);
        this.$store.commit("gameStore/set_nebn2", this.ebn2)
        this.$store.commit("gameStore/set_nebn3", this.ebn3)
        this.$store.commit("gameStore/set_nebn4", this.ebn4)
        this.$store.commit("gameStore/set_nebn5", this.ebn5)
        this.setebTime = null
    },

}
</script>
<style lang="stylus" scoped>
@import '~@/assets/styles/template3/themes/mixin.styl'
@import "~@styl/template3/common/fun.styl"

.electronic-page
    position relative
    min-height: 900px
    bg_color(bg1)

    .nodata
        height 600px

    .heg-banner
        width 100%
        height 520px
        position absolute
        top: -520px;
        z-index: 3;

        .e-bonus
            width 866px
            height 122px
            background-image: url('~@img/template3/home/bonus.png')
            background-size 866px 122px
            background-position 0px center
            background-repeat no-repeat
            position absolute
            bottom 44px
            z-index 3
            span
                width 69px
                height 93px
                font-size 70px
                font_color(fc2)
                font-weight bold
                text-align center
                display inline-block
                margin-left: 10px
                margin-top: 4px
                border-radius 12px

            .eb-n3
                margin-left: 36px

            .eb-n6
                margin-left: 34px

            .eb-n9
                margin-left: 34px

    .electronic-con
        padding-top 30px

        .electronic-flow
            border-radius 10px
            min-height 300px
            margin-bottom 50px
            position relative
            bg_color(bg2)

            .search-con
                padding 10px
                margin-bottom 10px
                bgline()

                .tabname-con
                    display flex
                    justify-content space-between
                    padding 0px 10px
                    height 70px
                    align-items center
                    margin-bottom 20px
                    border_com(1px, solid, border_common, bottom)

                    ul
                        display flex
                        justify-content flex-start

                        li
                            width 70px
                            text-align center
                            font-size 16px
                            font_color(fc3)
                            padding-top 10px
                            margin 0px 25px 0px 10px
                            line-height 56px
                            cursor pointer

                        .curMenu
                            font_color(fc4)
                            border_com(2px, solid, fc4, bottom)

                    .search-obj
                        width 360px
                        font_color(fc2)
                        height: 40px;
                        bg_color(bg1)
                        border-radius: 20px;
                        padding-left 20px
                        flexcon()

                        .input-obj
                            width 80%

                            input
                                font-size: 14px
                                background-color transparent
                                height 40px
                                font_color(fc2);

                                &::placeholder
                                    font_color(fc5)

                        .search-btn
                            cursor pointer
                            flex 1 1 auto
                            height 50px
                            display flex
                            justify-content center
                            align-items center

                            svg
                                width 20px
                                height 20px

                .line-con
                    display flex
                    justify-content flex-start
                    padding 10px 25px 0px

                    .electronic-title
                        font-size: 14px
                        font_color(fc3)
                        padding-right 10px
                        line-height 36px
                        flex none
                    ul
                        display flex
                        justify-content flex-start
                        flex-wrap wrap
                        li
                            width 90px
                            line-height 36px
                            text-align center
                            cursor pointer
                            font-size 14px
                            font_color(fc3)

                            &:hover
                                font_color(fc4)

                        .current
                            font_color(fc4)

            .electronic-list
                width 100%
                display flex
                justify-content flex-start
                flex-wrap wrap

                .electronic-item
                    width 217px
                    height 263px
                    border-radius 5px
                    overflow hidden
                    margin-left 19px
                    margin-top 12px
                    position relative
                    transition ease-in-out .5s
                    bg_color(fc2)

                    .electronic-img
                        width 217px
                        height 217px
                        border-radius 5px 5px 0px 0px
                        bg_color(fc2)
                        display flex
                        align-items: center
                        position: relative;

                        &::before
                            content: "";
                            height: 217px;
                            width: 217px;
                            position: absolute;
                            left: 0;
                            top: 0;
                            background: url("~@img/comimages/compon/loadding.gif") no-repeat center;
                            z-index 1

                        img
                            width 100%
                            height 100%
                            position: absolute;
                            left: 0;
                            top: 0;
                            z-index 2

                    .electronic-bottom
                        display flex
                        justify-content space-between
                        line-height 49px
                        padding 0px 8px
                        bg_color(fc5)
                        width 217px
                        border-radius 0px 0px 5px 5px

                        .electronic-name
                            font-size: 14px
                            width 100%
                            height 49px
                            overflow hidden
                            font_color(fc3)

                        .electronic-icon
                            display flex
                            align-items center
                            justify-content flex-end
                            cursor pointer

                            svg
                                width 22px
                                height 22px
                                font_color(fc3)

                        .cur-coll
                            cursor pointer

                            svg
                                font_color(red_c)

                    .electronic-pop
                        position absolute
                        left 0px
                        top 0px
                        //bg_color(bg38)
                        width 100%
                        height 217px
                        opacity 0
                        visibility hidden
                        justify-content center
                        align-items center
                        flex-wrap wrap
                        z-index 3
                        transition all .5s ease
                        .electronic-pop-obj
                            display flex
                            flex-direction column
                            justify-content center
                            align-items center
                            flex-wrap wrap
                            width 100%
                            height 100%

                            button
                                flex none
                                width: 150px
                                height: 42px
                                bg_img_linear(linear_common)
                                border-radius: 5px;
                                border none
                                font-size: 14px
                                font_color(fc01)
                                cursor pointer
                                margin-bottom 20px
                                transition all .5s ease
                                &:hover
                                    bg_img_linear(linear_common2)
                                    hvr-float()
                            button.free
                                font_color(fc6)
                                bg_img_linear(linear_common)
                                &:hover
                                    bg_img_linear(linear_common2)
                    &:hover
                        .electronic-pop
                            display flex
                            visibility visible
                            opacity 1

</style>
