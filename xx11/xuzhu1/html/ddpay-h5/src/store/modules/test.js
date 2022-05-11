import { defineStore } from 'pinia'

// 对外部暴露一个 use 方法，该方法会导出我们定义的 state
const useTestStore = defineStore({
  // 每个store的id必须唯一
  id: 'test',
  // state表示数据源
  state: () => ({
    test: 'test'
  }),
  // getters类似于computed,可对state的值进行二次计算
  getters: {
  },
  // actions用来修改state
  actions: {
  }
})

export default useTestStore
