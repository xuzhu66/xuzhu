import { defineStore } from 'pinia'
import {
  dictionariesApi,
  getDictionaryApi,
  paymentClassListApi,
  paymentListApi
} from '@/api/center'

// 对外部暴露一个 use 方法，该方法会导出我们定义的 state
export const useSelectStore = defineStore('select', {
  // 每个store的id必须唯一
  id: 'select',
  // state表示数据源
  state: () => ({
    ddbTransType: [
      {
        value: '购买',
        key: '10'
      },
      {
        value: '出售',
        key: '11'
      },
      {
        value: '返佣',
        key: '33'
      },
      {
        value: '兑换',
        key: '41'
      }
    ],
    dictionary: {}, // 数据字典
    auditStatus: [
      {
        value: '审核中',
        key: 10
      },
      {
        value: '充值成功',
        key: 100
      },
      {
        value: '充值失败',
        key: -100
      }
    ],
    tradeStatusArr: [
      {
        key: '20',
        value: '待确认'
      },
      {
        key: '30',
        value: '待支付'
      },
      {
        key: '40',
        value: '已支付'
      },
      {
        key: '50',
        value: '申诉中'
      },
      {
        key: '60',
        value: '已放行'
      },
      {
        key: '100',
        value: '已完成'
      },
      {
        key: -100,
        value: '已取消'
      }
    ],
    sellStatusArr: [
      {
        key: '10',
        value: '匹配中'
      },
      {
        key: '90',
        value: '已下架'
      },
      {
        key: '91',
        value: '已售罄'
      }
    ],

    paymentClassList: [], // 支付方式列表
    paymentClassListLoading: false,
    paymentList: {
      unionPayList: [],
      weChatList: [],
      aliPayList: []
    }, // 收款列表
    paymentListLoading: false,
    selectPaywayObj: {}
  }),
  getters: {
    paymentClassListAble: (state) => {
      const list = state.paymentClassList
      const backList = []
      for (let i = 0; i < list.length; i++) {
        if (list[i].enable) {
          backList.push(list[i])
        }
      }
      return backList
    }
  },
  // actions用来修改state
  actions: {
    // 查询字典-单个字典
    async getDictionaryAction(param) {
      const { data: data, success: success } = await getDictionaryApi({
        code: param
      })
      if (success) {
        // 升序排序
        data.sort(function (a, b) {
          return a.sort - b.sort
        })
        this.dictionary[param] = data
      }
      return data
    },
    // 公共字典(数组)-多个字典
    async dictionariesAction(param) {
      const { data: data, success: success } = await dictionariesApi(param)
      if (success) {
        data.forEach((item) => {
          item.dict.sort(function (a, b) {
            return a.sort - b.sort
          })
          this.dictionary[item.code] = item.dict
        })
      }
      return data
    },

    async fetchPaymentClassList(payload) {
      this.paymentClassListLoading = this.paymentClassList.length === 0
      try {
        const res = await paymentClassListApi(payload)
        if (res.success) {
          this.paymentClassList = res.data
        }
        // console.log(res)
      } finally {
        this.paymentClassListLoading = false
      }
    },
    async fetchPaymentList(payload) {
      this.paymentListLoading = true
      let res
      try {
        res = await paymentListApi(payload)
        if (res.success) {
          // this.paymentList = res.data
          let arr = []
          if (res.data) {
            const data = res.data
            if (data.unionPayList) {
              arr = arr.concat(data.unionPayList)
            }
            if (data.weChatList) {
              arr = arr.concat(data.weChatList)
            }
            if (data.aliPayList) {
              arr = arr.concat(data.aliPayList)
            }
          }
          // console.log(arr)
          const list = arr.map((item) => {
            if (item.enable == 1) {
              return item
            }
          })
          this.paymentList = list
        }
        // console.log(res)
      } catch (e) {
        res = e
        this.paymentList = []
      } finally {
        this.paymentListLoading = false
        this.selectPaywayObj = {}
      }
      return res
    }
  }
})
