<template lang="pug">
    .comDatepicker
        datepicker(v-model="range",@confirm="confirm",show-buttons,clearable,disabled)
        .recordul
            ul
                li(v-for="it in list",:class="{'ac':currtStep==it.step}",@click="tab(it.step)") {{it.t}}
                li(v-if="showAllBtn",:class="{'ac':currtStep==3650}",@click="tabAll(3650)") 全部

</template>

<script>
import datepicker from 'vue-datepicker-local'

export default {
    components: {
        datepicker
    },
    filters: {},
    data() {
        return {
            range: [new Date(), new Date()],
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
        this.setDate(1);
    },
    methods: {
        confirm(range) {
            this.emitParent(range);
            this.currtStep = 0;
        },
        tab(step) {
            this.currtStep = step;
            this.setDate(step);
        },
        // 所有按钮点击
        tabAll(step) {
            this.currtStep = step;
            //this.setDate(step);
            this.range = [new Date(new Date().getTime() - 3650 * this.day), new Date()];
            this.$emit('putTimeEvent', {startTime: this.range[0], endTime: this.range[1], isAll: true, dataType: ''});
        },
        setDate(val) {
            let flag = ""; // 时间类型 null 全部 1、今日 2、昨日 3、近3天 4、近7天 5、近10天 6、近15天 7、本月 8、最近60天 9、最近120天
            switch (val) {
                case 1:
                    this.range = [new Date(), new Date()];
                    flag = 1;
                    break;
                case 2:
                    this.range = [new Date(new Date().getTime() - 1 * this.day), new Date(new Date().getTime() - 1 * this.day)];
                    flag = 2;
                    break;
                case 3:
                    this.range = [new Date(new Date().getTime() - 2 * this.day), new Date()];
                    flag = 3;
                    break;
                case 7:
                    this.range = [new Date(new Date().getTime() - 6 * this.day), new Date()];
                    flag = 4;
                    break;
                case 15:
                    this.range = [new Date(new Date().getTime() - 15 * this.day), new Date()];
                    flag = 6;
                    break;
                case 3650:
                    this.range = [new Date(new Date().getTime() - 3650 * this.day), new Date()];
                    flag = '';
                    break;
            }
            this.emitParent(flag);
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
        display none

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
