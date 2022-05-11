<template lang="pug">
    .comDatepicker
        datepicker(v-model="range",@confirm="confirm",@clear="clear",show-buttons,clearable,:value=defaulValue)
        .recordul
            //ul
                li(v-for="it in list",:class="{'ac':currtStep==it.step}",@click="tab(it.step)") {{it.t}}
                li(v-if="showAllBtn",:class="{'ac':currtStep==3650}",@click="tabAll(3650)") 全部

</template>

<script>
import datepicker from './VueDatepickerLocal'

export default {
    components: {
        datepicker
    },
    filters: {},
    data() {
        return {
            defaulValue:[],
            range: [],
            list: [{
                t: '今天',
                step: 1
            }, {
                t: '昨天',
                step: 2
            }, {
                t: '近3天',
                step: 3
            }, {
                t: '近7天',
                step: 7
            }, {
                t: '近15天',
                step: 15
            }],
            currtStep: 1,
            day: 24 * 60 * 60 * 1000,
            yesterday: 2 * 24 * 60 * 60 * 1000,
            week: 7 * 24 * 60 * 60 * 1000,
            month: 15 * 24 * 60 * 60 * 1000,
        }
    },
    props: {
        showAllBtn: {
            type: Boolean,
            default: false
        },
    },
    created() {

    },
    mounted() {
        // 设置tab
        // this.$root.eventHub.$off("unitTimeClear").$on("unitTimeClear", (res) => {
        //     this.range =  [];
        //     this.emitParent()
        // })
    },
    methods: {
        clear(){
            this.range =  [];
            this.emitParent('');
        },
        confirm(range) {
            this.emitParent(range);
            this.currtStep = 0;
        },

        //事件
        emitParent(flag) {
            this.$emit('putTimeEvent', {startTime: this.range[0], endTime: this.range[1], dataType: flag});
        },
    },
    activated() {

    },
    deactivated() {

    }
}
</script>

<style lang="stylus" scoped>
.comDatepicker
    display inline-block

    .datepicker-range
        display inline-block

    .recordul
        overflow hidden

        li
            float: left;
            padding: 4px 11px;
            font-size: 14px;
            margin: 0 6px;
            color: #666;
            cursor: pointer;
            transition all .3s
            border-bottom 2px solid transparent

            &.ac
                color #d8bd8c
                border-bottom 2px solid #d8bd8c

            &:hover
                color #d8bd8c


    .calendar-date
        color: #999

    .calendar-date-selected
    .calendar-date-selected:hover {
        color: #fff;
    }
</style>
