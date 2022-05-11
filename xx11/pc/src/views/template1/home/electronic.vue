<template lang="pug">
    .h-egame
        .he-t
            .hp-w1400.nogame_wrap(v-show="bannerList.length == 0 && tableList.length == 0 && isReq")
                .nogame_w
                    .nogame
                    .nogame-font 暂无数据
        .he-b(v-show="bannerList.length>0")
            .heg-banner
                s-banner.h520(:seatType="seatType")
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
            //- .heg-banner(v-for="(value, index) in eGamebannerList" :key="index" v-show="lineCur==value.gameLineId")
            //-   .b-wh(@click="getGame(value,index)" :style="`background-image: url(${value.picUrl})`")
            //-     .w1200
            //-       p.e-bonus
            //-         span.eb-n1 {{ebn1}}
            //-         span.eb-n2 {{ebn2}}
            //-         span.eb-n3 {{ebn3}}
            //-         span.eb-n4 {{ebn4}}
            //-         span.eb-n5 {{ebn5}}
            //-         span.eb-n6 {{ebn6}}
            //-         span.eb-n7 {{ebn7}}
            //-         span.eb-n8 {{ebn8}}
            //-         span.eb-n9 {{ebn9}}
            //-         span.eb-n10 {{ebn10}}
            .heg-gwrap.w1200
                // (:class="[{'heg-sp': isPGameSearch}]")
                .heg-scwrap
                    .hge-clssearc
                        ul.hgm-qmenu
                            li(v-for="v,i in menu" :key="i" :class="[{'curMenu': curMenu == v.key}]" @click="changeDateType(v)") {{ v.name }}
                        .heg-searwrap
                            .hge-search
                                p.hge-inp
                                    input.hge-sinp(type='text' :maxlength="10" v-model="keyWord" placeholder="输入关键字" @focus="focusStatus")
                                p.hge-sicon(@click="toSearch()")
                                    svg-icon(icon-class='search')
                    .hge-clin
                        p.hgecl-tit 线路名称：
                        ul.hgecl-lis
                            li(v-for="v,i in lineMenu" :key="i" :class="[{'hgel-cur': lineCur == 'all'}]" @click="changeLineType(v)") {{ v.name }}
                            li(v-if="gameLineArr && gameLineArr.length>0" v-for="v,i in gameLineArr" :key="i+1" :class="[{'hgel-cur': lineCur == v.gameLineId}]" @click="changeLineType(v)") {{ v.name }}
                    .hge-clin
                        p.hgecl-tit 游戏类型：
                        ul.hgecl-lis
                            li(v-for="v,i in typeMenu" :key="i" :class="[{'hgel-cur': typeCur == v.key}]" @click="changeType(v)") {{ v.name }}
                .hp-w1200.nogame_wrap(v-if="tableList.length == 0")
                    .nogame_w
                        .nogame
                        .nogame-font 暂无数据

                //.hp-w1400.nogame_wrap(v-show="!isReq")
                    .nogame_w
                        .nogame-font 数据加载中...
                van-list(loading-text="正在加载中" v-show="tableList.length>0" :offset="0" v-model="tableLoading" :finished="tableFinished" finished-text="没有更多了" :immediate-check="false" @load="getTableList")
                    ul.vg-lst

                        li(v-for="v,i in tableList", :key="i", class="hgel-gcur")
                            p.vgl-img
                                img(:src="v.pcImgUrl" @error="imgError(v)")

                            p.vgl-f
                                span.vglf-n(v-html="v.name")
                                span.vglf-i(v-show="userId != ''" :class="[{'cur-coll':v.loveFlag}]" @click="setLoveGame(v)")
                                    svg-icon(icon-class='collect')

                            .vgl-fpop
                                .vglf-bw
                                    button.free(v-show="v.pcSupport==1 && userId != ''", @click="showGameDialog(v)") 立即试玩
                                    button(v-if="userId != ''" ,@click="showGameDialog(v)") 进入游戏
                                    button(v-if="userId == ''" @click="showGameDialog(v)") 进入游戏

</template>
<script>
import {mapState, mapActions, mapMutations} from "vuex";
import Banner from '@pon/template1/banner'; // Banner轮播图片
import gameStore from "@/store/comstore/game/gameStore"; // 登入游戏状态
import bannerStore from "@/store/template1/bannerStore"; // banner状态
import homeGameStore from "@/store/comstore/home/homeGameStore"; // game状态
import {List} from 'vant';

const pageListModule = 'homeGameStore';
export default {
    name: 'electronic', // 玩家
    components: {
        [List.name]: List,
        "s-banner": Banner, // Banner轮播图片
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
        bannerList: { // banner列表
            get() {
                return this.$store.state.bannerStore.bannerList;
            },
            set(item) {
                return item
            }
        },
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
        // nebn6: { // 奖金
        //   get() {
        //     return this.$store.state.gameStore.nebn6;
        //   },
        //   set(item) {
        //     return item
        //   }
        // },
        // nebn7: { // 奖金
        //   get() {
        //     return this.$store.state.gameStore.nebn7;
        //   },
        //   set(item) {
        //     return item
        //   }
        // },
        // nebn8: { // 奖金
        //   get() {
        //     return this.$store.state.gameStore.nebn8;
        //   },
        //   set(item) {
        //     return item
        //   }
        // },
        // nebn9: { // 奖金
        //   get() {
        //     return this.$store.state.gameStore.nebn9;
        //   },
        //   set(item) {
        //     return item
        //   }
        // },
        // nebn10: { // 奖金
        //   get() {
        //     return this.$store.state.gameStore.nebn10;
        //   },
        //   set(item) {
        //     return item
        //   }
        // }
    },
    props: {},
    data() {
        return {
            seatType: 3,
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
        }
    },
    created() {
        if (!this.$store.state["bannerStore"]) {
            bannerStore.install(this);
        }
        if (!this.$store.state["gameStore"]) {
            gameStore.install(this);
        }
        if (!this.$store.state["homeGameStore"]) { // game状态
            homeGameStore.install(this);
        }
    },
    watch: {},
    mounted() {
    },
    activated(){
        this.pageInit()
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
            this.getBannerList()
            this.resetSearchParam();// 重置搜索条件
            this.resetSearchResult();// 重置搜索结果
            let gline = this.$route.query.gameLine // 获取游戏类型
            this.lineCur = gline ? gline : 'all'
            await this.setGameLineId(gline)
            this.getTableList();
            this.setBouns(); // 获取奖金
        },
        imgError(item) {
            item.pcImgUrl = require('@img/comimages/compon/nopic.png');
        },
        // getSearch(v) {
        //   if(v) {
        //     this.sName = v
        //   }
        //   let linId = this.$route.query.gameLineId;
        //   this.resetSearchParam();// 重置搜索条件
        //   this.resetSearchResult();// 重置搜索结果
        //   this.setGameLineId(linId)
        //   this.setName(this.sName)
        //   this.getTableList();
        // },
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
        getBannerList() {
            let param = {
                seatType: 3, // 1、首页轮播banner 2、首页热门图片管理 3、洗码代理banner
            };
            this.$store.dispatch("bannerStore/homeBanner", param).then(res => {
            });
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

        // getGame(value,index) {
        //   let o = {
        //     value: value,
        //     index: index
        //   }
        //   this.$store.dispatch("gameStore/enterBannerAction", o).then(res => {

        //   });
        // },
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
@import '~@styl/template1/themes/mixin.styl'
@import '~@styl/template1/common/fun.styl'
.h-egame
    width 100%
    height calc(100% - 190px)
    background url('~@img/template1/home/bannerBG01.jpg') center repeat
    position relative
    min-height: 1150px

    .heg-banner
        width 100%
        height 520px
        position relative

        .h520
            height 520px

        // .b-wh
        //   height 100%
        //   background-position center center
        //   background-repeat no-repeat
        //   cursor pointer
        //   position relative

        .e-bonus
            width 866px
            height 122px
            background-image: url('~@img/template1/home/bonus.png')
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
                font_color(fc017)
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

    .heg-gwrap
        bg_color(bg04)
        border-radius 10px
        min-height 300px
        margin-bottom 50px
        position relative

        .heg-scwrap
            z-index 3
            bg_color(bg04)
            width 1200px

        .heg-sp
            position fixed
            top 130px
            left 50%
            transform: translateX(-50%)
            border-radius 0px 0px 10px 10px
            box_shadow(shadow02)
            z-index 4
        .hge-clssearc
            display flex
            justify-content space-between
            padding 0px 10px
            border_com(1px, solid, border32, bottom)
            height 70px
            align-items center
            margin-bottom 20px

            .hgm-qmenu
                display flex
                justify-content flex-start
                bg_color(bg04)

                li
                    width 70px
                    text-align center
                    font-size 16px
                    font_color(fc017)
                    padding-top 10px
                    margin 0px 25px 0px 10px
                    line-height 56px
                    cursor pointer

                .curMenu
                    font_color(fc013)
                    border_com(2px, solid, border28, bottom)

            .hge-search
                width 360px
                bg_color(bg36)
                border-radius 25px
                display flex
                justify-content space-between
                height 50px

                .hge-sinp
                    background-color transparent
                    height 50px

                .hge-inp
                    width 76%

                    input
                        padding-right 0px
                        font-size: 14px

                .hge-sicon
                    flex 1 1 auto
                    height 50px
                    display flex
                    justify-content center
                    align-items center

                    svg
                        width 20px
                        height 20px

    .hge-clin
        display flex
        justify-content flex-start
        padding 10px 25px 0px

        .hgecl-tit
            font-size: 14px
            font_color(fc013)
            padding-right 10px
            line-height 36px
            flex none
        .hgecl-lis
            display flex
            justify-content flex-start
            flex-wrap wrap
            li
                width 90px
                line-height 36px
                text-align center
                cursor pointer
                font-size 14px

            .hgel-cur
                bg_img_linear(linear07, linear08)
                border-radius: 10px
                font_color(fc01)


    .vg-lst
        width 100%
        display flex
        justify-content flex-start
        flex-wrap wrap
        padding-bottom 80px

        li
            width 217px
            height 263px
            border-radius 5px
            overflow hidden
            margin-left 19px
            margin-top 12px
            position relative

            .vgl-img
                width 217px
                height 217px
                border-radius 5px 5px 0px 0px
                bg_color(bg04)
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

            .vgl-f
                display flex
                justify-content space-between
                line-height 49px
                padding 0px 8px
                bg_color(bg37)
                width 217px
                border-radius 0px 0px 5px 5px

                .vglf-n
                    font-size: 14px
                    font_color(fc01)
                    width 100%
                    height 49px
                    overflow hidden

                .vglf-i
                    display flex
                    align-items center
                    justify-content flex-end

                    svg
                        width 22px
                        height 22px
                        font_color(fc056)

                .cur-coll
                    cursor pointer

                    svg
                        font_color(fc057)

            .vgl-fpop
                position absolute
                left 0px
                top 0px
                bg_color(bg38)
                width 100%
                height 217px
                opacity 0
                visibility hidden
                justify-content center
                align-items center
                flex-wrap wrap
                z-index 3
                transition all .5s ease
                .vglf-bw
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
                        bg_img_linear(linear09, linear10)
                        border-radius: 5px;
                        border none
                        font-size: 14px
                        font_color(fc01)
                        cursor pointer
                        margin-bottom 20px
                        transition all .5s ease
                        &:hover
                            bg_img_linear(linear10, linear09)
                            hvr-float()
                    button.free
                        font_color(fc017)
                        bg_img_linear(linear11, linear12)
                        &:hover
                            bg_img_linear(linear12, linear11)

        .hgel-gcur
            transition all 1s

            &:hover
                .vgl-fpop
                    display flex
                    visibility visible
                    opacity 1
.main-midgam
    height 800px
    overflow auto
    bg_color(bg39)

.nogame_wrap
    display: flex
    width 100%
    height 100%
    min-height 550px
    justify-content: center
    align-items: center
    flex-wrap wrap

    .nogame
        background url("~@img/template1/home/nogame.png") center no-repeat
        display: block;
        width: 334px;
        height: 246px;
        margin: 0px auto 0;

    .nogame-font
        width 100%
        text-align center
        font_color(fc054)
        font-size 16px
</style>
