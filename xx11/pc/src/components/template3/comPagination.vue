<template lang="pug">
    .comPagination
        ul.mo-paging
            <!-- prev -->
            li(:class="['paging-item', 'paging-item--prev', {'paging-item--disabled' : index === 1}]", @click='prev') 上一页
            <!-- first -->
            li(:class="['paging-item', 'paging-item--first', {'paging-item--disabled' : index === 1}]", @click='first') 首页
            li(:class="['paging-item', 'paging-item--more']", v-if='showPrevMore') ...
            li(:class="['paging-item', {'paging-item--current' : index === pager}]", v-for='pager in pagers', @click='go(pager)') {{ pager }}
            li(:class="['paging-item', 'paging-item--more']", v-if='showNextMore') ...
            <!-- last -->
            li(:class="['paging-item', 'paging-item--last', {'paging-item--disabled' : index === pages}]", @click='last') 末页
            <!-- next -->
            li(:class="['paging-item', 'paging-item--next', {'paging-item--disabled' : index === pages}]", @click='next') 下一页

</template>

<script>
export default {
    name: 'MoPaging',
    props: {
        //页面中的可见页码，其他的以...替代, 必须是奇数
        perPages: {
            type: Number,
            default: 7 //必须是奇数
        },
        //当前页码
        pageIndex: {
            type: Number,
            default: 1
        },
        //每页显示条数
        pageSize: {
            type: Number,
            default: 10
        },
        //总记录数
        total: {
            type: Number,
            default: 1
        }
    },
    methods: {
        prev() {
            if (this.index > 1) {
                this.go(this.index - 1)
            }
        },
        next() {
            if (this.index < this.pages) {
                this.go(this.index + 1)
            }
        },
        first() {
            if (this.index !== 1) {
                this.go(1)
            }
        },
        last() {
            if (this.index != this.pages) {
                this.go(this.pages)
            }
        },
        go(page) {
            if (this.index !== page) {
                this.index = page
                //父组件通过change方法来接受当前的页码
                this.$emit('change', this.index)
            }
        }
    },
    computed: {
        //计算总页码
        pages() {
            return Math.ceil(this.size / this.limit)
        },
        //计算页码，当count等变化时自动计算
        pagers() {
            const array = []
            const perPages = this.perPages
            const pageCount = this.pages
            let current = this.index
            const _offset = (perPages - 1) / 2
            const offset = {
                start: current - _offset,
                end: current + _offset
            }
            //-1, 3
            if (offset.start < 1) {
                offset.end = offset.end + (1 - offset.start)
                offset.start = 1
            }
            if (offset.end > pageCount) {
                offset.start = offset.start - (offset.end - pageCount)
                offset.end = pageCount
            }
            if (offset.start < 1) offset.start = 1
            this.showPrevMore = (offset.start > 1)
            this.showNextMore = (offset.end < pageCount)
            for (let i = offset.start; i <= offset.end; i++) {
                array.push(i)
            }
            return array
        }
    },
    data() {
        return {
            index: this.pageIndex, //当前页码
            limit: this.pageSize, //每页显示条数
            size: this.total || 1, //总记录数
            showPrevMore: false,
            showNextMore: false
        }
    },
    watch: {
        pageIndex(val) {
            this.index = val || 1
        },
        pageSize(val) {
            this.limit = val || 10
        },
        total(val) {
            this.size = val || 1
        }
    }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/template3/themes/mixin.styl'
@import "~@styl/template3/common/fun.styl"
.comPagination
    text-align center
    margin 0px auto
    border-radius 0px 0px 10px 10px
    position relative
    bg_color(bg2)

    .mo-paging
        display: inline-block;
        padding: 0;
        margin: 24px 0;
        font-size: 0;
        list-style: none;
        user-select: none;

        .paging-item
            display: inline;
            font-size: 14px;
            position: relative;
            padding: 8px 14px;
            line-height: 1.42857143;
            text-decoration: none;
            border_all(1px, solid, border_hui2)
            bg_color(border_hui2)
            font_color(fc3)
            cursor: pointer;
            margin-left 6px
            border-radius 5px

            &:first-child
                margin-left: 0;

            &:hover
                bg_color(bg3)
                font_color(fc6)

            &.paging-item--disabled,
            &.paging-item--more
                border_all(1px, solid, border_common)
                bg_color(bg1)
                font_color(fc3)

            //禁用

            &.paging-item--disabled
                cursor: not-allowed;
                opacity: .75;

            &.paging-item--more,
            &.paging-item--current
                cursor: default;

            //选中

            &.paging-item--current
                border_all(1px, solid, border_yellow)
                bg_color(border_yellow)
                font_color(fc6)
                position: relative;
                z-index: 1;
</style>
