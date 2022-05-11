<template lang="pug">
.page-con
  centerHeader(@goBack="goBackPage")
  .common-title 身份认证
  // 0 未开始 1: 未上传 2: 待认证 3: 已认证
  .commont-tip  * 为保证交易可以顺畅进行，请填写个人真实身份信息！
  .status.fail(v-if="userInfo.idVerify == 1") * 身份证件未上传
  .status.success(v-if="userInfo.idVerify == 3") * 认证完成

  .page-flow
    .title-con
      .item-title 基础信息
      .status.success(v-if="userInfo.idVerify == 3") 已验证
    .info-con
      .item
        van-cell-group
          van-field(v-model='realName'  label='用户姓名' placeholder='请填写本人真实姓名' maxlength=20 border=false label-width="60" :readonly="userInfo.idVerify >=1")

      .item
        van-cell-group
          van-field(v-model='idNo'  label='身份证号' placeholder='请填写本人真实有效的身份信息' maxlength=30 border=false label-width="60" :readonly="userInfo.idVerify >=1")

    .photo-status-con(v-if="userInfo.idVerify == 3")
      .id-icon
      .status.success 身份证件照上传 已验证

    // 未上传 未开始状态
    .photo-con(v-if="userInfo.idVerify <= 1")
      .item-title 上传证件
      .commont-tip *上传截图必须要清晰且完整，姓名及身份证号码。
      .commont-tip *上传真实有效的身份证照片，有助于提升交易成交率。
      .item
        .lable 身份证正面
        van-uploader(v-model="fileList1" multiple :max-count="1" :max-size="6 * 1024 * 1024" @oversize="onOversize" :after-read="afterRead1")
        van-divider(:style="{ color: '#F2F2F2', borderColor: '#F2F2F2', padding: '0 8px' }")
      .item
        .lable 身份证反面
        van-uploader(v-model="fileList2" multiple :max-count="1" :max-size="6 * 1024 * 1024" @oversize="onOversize" :after-read="afterRead2")
        van-divider(:style="{ color: '#F2F2F2', borderColor: '#F2F2F2', padding: '0 8px' }")
      .item
        .lable 手持证件
        van-uploader(v-model="fileList3" multiple :max-count="1" :max-size="6 * 1024 * 1024" @oversize="onOversize" :after-read="afterRead3")

    // 待认证
    .photo-con(v-if="userInfo.idVerify == 2")
      .item-title 上传证件
      .commont-tip *上传截图必须要清晰且完整，姓名及身份证号码。
      .commont-tip *上传真实有效的身份证照片，有助于提升交易成交率。
      .item
        .lable 身份证正面
        .shenhezhong
      .item
        .lable 身份证反面
        .shenhezhong
      .item
        .lable 手持证件
        .shenhezhong

  .footer-con(v-if="userInfo.idVerify <= 1")
    .commont-tip 友情提示：如填写的信息不匹配则无法正常进行交易！
    .submit-btn(@click="submitFun" :class="success?'success':'faill'") 提交信息

</template>

<script>
import { defineComponent, reactive, toRefs, onMounted, watchEffect, getCurrentInstance } from 'vue'
import centerHeader from '@/views/mine/centerHeader'
import { useRouter } from 'vue-router'
import { Toast, CellGroup, Field, Uploader, Divider } from 'vant'
import { useCenterStore } from '@/store/modules/center'
import { storeToRefs } from 'pinia'
import { validateCommonUserName, checkCardID } from '@/utils/validate'
export default defineComponent({
  name: 'Userinfo',
  components: {
    centerHeader,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Uploader.name]: Uploader,
    [Divider.name]: Divider
  },

  setup() {
    const router = useRouter()
    const centerStore = useCenterStore()
    const { dictionary, userInfo } = storeToRefs(centerStore)
    const queryIdApproveAction = (param) => centerStore.queryIdApproveAction(param)
    const notIdApproveAction = (param) => centerStore.notIdApproveAction(param) // 未身份认证
    const undoneIdApproveAction = (param) => centerStore.undoneIdApproveAction(param) // 未完成身份认证
    const getUserInfoAction = (param) => centerStore.getUserInfoAction(param) // 查询用户信息
    const uploadAction = (param) => centerStore.uploadAction(param) // 图片上传
    const instance = getCurrentInstance()
    const state = reactive({
      success: false, // 校验标识
      requestFlag: true, // 接口请求标识
      realName: '',
      idNo: '',
      photo1: '',
      photo2: '',
      photo3: '',
      fileList1: [], // 上传文件列表
      fileList2: [], // 上传文件列表
      fileList3: [], // 上传文件列表
      maxSize: 1 * 1024 * 1024, // 多少 M
      file1: '',
      file2: '',
      file3: '',
      fileUrl1: '',
      fileUrl2: '',
      fileUrl3: ''
    })
    // 路由
    const jumpPage = (path) => {
      router.push({
        path: path
      })
    }
    const goBackPage = (path) => {
      router.go(-1)
    }
    // 回退
    const goBack = () => {
      router.push({ path: '/mine/center' })
    }
    const onOversize = (file) => {
      Toast('文件大小不能超过6M!')
    }
    // 获取数据字典对应的key
    const getDictByKey = (item, key) => {
      let str = ''
      const list = dictionary.value[item]
      if (key && list && list.length > 0) {
        list.forEach((dict) => {
          if (dict.key === key.toString()) {
            str = dict.value
          }
        })
      }
      return str
    }
    // 未身份认证
    const notIdApproveFun = (param) => {
      notIdApproveAction(param).then(res => {
        state.requestFlag = true
        instance.proxy.$loading.hide()
        getUserInfoAction().then(res => {})
      })
    }
    // 未完成身份认证
    const undoneIdApproveFun = (param) => {
      undoneIdApproveAction(param).then(res => {
        state.requestFlag = true
        instance.proxy.$loading.hide()
        getUserInfoAction().then(res => {})
      })
    }

    const afterRead1 = (file) => {
      state.file1 = file
    }
    const afterRead2 = (file) => {
      state.file2 = file
    }
    const afterRead3 = (file) => {
      state.file3 = file
    }
    const submitFun = async() => {
      const valiteFlag = beforeSubmit()
      if (!valiteFlag) return
      if (!state.success) return
      if (!state.requestFlag) return
      state.requestFlag = false
      const param = {}
      instance.proxy.$loading.show()
      // 如果有上传照片
      if (state.fileList1.length && state.fileList2.length && state.fileList3.length) {
        await uploadFun(state.file1).then(res => {
          state.fileUrl1 = res.link
          param.idPic1 = state.fileUrl1
        })
        await uploadFun(state.file2).then(res => {
          state.fileUrl2 = res.link
          param.idPic2 = state.fileUrl2
        })
        await uploadFun(state.file3).then(res => {
          state.fileUrl3 = res.link
          param.idPic3 = state.fileUrl3
        })
      }
      // 如果是未设置
      if (userInfo.value.idVerify === 0) {
        param.realName = state.realName
        param.idNo = state.idNo
        notIdApproveFun(param)
      } else {
        undoneIdApproveFun(param)
      }
    }
    // 提交校验
    const beforeSubmit = () => {
      if (!validateCommonUserName(state.realName)) {
        Toast('请输入中英文、数字、字母组成的2-20位真实姓名')
        return false
      }
      if (userInfo.value.idVerify === 0 && !checkCardID(state.idNo)) {
        Toast('请输入正确的身份证号码')
        return false
      }
      if (userInfo.value.idVerify <= 1) {
        if (state.fileList1.length && state.fileList2.length && state.fileList3.length) {
          if (!state.fileList1.length) {
            Toast('请上传身份证正面照片')
            return false
          }
          if (!state.fileList2.length) {
            Toast('请上传身份证反面照片')
            return false
          }
          if (!state.fileList3.length) {
            Toast('请上传手持证件照片')
            return false
          }
        }
      }
      return true
    }
    watchEffect(() => {
      // 如果是未认证
      if (userInfo.value.idVerify === 0) {
        if (state.fileList1.length || state.fileList2.length || state.fileList3.length) {
          state.success = state.realName && state.idNo && state.fileList1.length && state.fileList2.length && state.fileList3.length
        } else {
          state.success = state.realName && state.idNo
        }
      }
      // 照片未上传
      if (userInfo.value.idVerify === 1) {
        state.success = state.fileList1.length && state.fileList2.length && state.fileList3.length
      }
    })
    // 上传图片
    const uploadFun = async(file) => {
      if (file.file.size / 1024 * 1024 >= state.maxSize) {
        const transFile = await compress(file.file)
        const formData = new FormData()
        formData.append('file', transFile)
        return uploadAction(formData)
      } else {
        const formData = new FormData()
        formData.append('file', file.file)
        return uploadAction(formData)
      }
    }
    // 图片压缩
    const compress = async(fileObj) => {
      return new Promise((resolve, reject) => {
        if (typeof (FileReader) === 'undefined') {
          reject('当前浏览器内核不支持base64图片压缩')
        } else {
          try {
            const reader = new FileReader()
            reader.onload = function(e) {
              const image = new Image()
              image.onload = function() {
                const canvas = document.createElement('canvas')
                const context = canvas.getContext('2d')

                const originWidth = this.width
                const originHeight = this.height
                // 最大尺寸限制
                var maxWidth = 1600
                // 目标尺寸
                var targetWidth = originWidth; var targetHeight = originHeight

                if (originWidth > maxWidth || originHeight > maxWidth) {
                  if (originWidth / originHeight > 1) {
                    // 更宽，按照宽度限定尺寸
                    targetWidth = maxWidth
                    targetHeight = Math.round(maxWidth * (originHeight / originWidth))
                  } else {
                    targetHeight = maxWidth
                    targetWidth = Math.round(maxWidth * (originWidth / originHeight))
                  }
                }

                canvas.width = targetWidth
                canvas.height = targetHeight
                context.clearRect(0, 0, targetWidth, targetHeight)
                context.drawImage(this, 0, 0, targetWidth, targetHeight)

                const base64Data = canvas.toDataURL('image/jpeg')
                const file = dataURLtoFile(base64Data)
                resolve(file)
              }
              image.src = e.target.result
            }
            reader.readAsDataURL(fileObj)
          } catch (e) {
            reject('图片压缩失败!')
          }
        }
      })
    }
    // base64转file
    const dataURLtoFile = (dataurl) => {
      // 获取到base64编码
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const suffix = mime.split('/')[1]
      // 将base64编码转为字符串
      const bstr = window.atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n) // 创建初始化为0的，包含length个元素的无符号整型数组
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      const photoName = `${new Date().getTime() + '.' + suffix}`
      const file = new File([u8arr], photoName, {
        type: 'image/' + suffix
      })
      return file
    }
    onMounted(() => {
      queryIdApproveAction().then(res => {
        state.realName = res.realName
        state.idNo = res.idNo
      })
    })
    return {
      ...toRefs(state),
      jumpPage,
      goBack,
      onOversize,
      getDictByKey,
      userInfo,
      notIdApproveFun,
      undoneIdApproveFun,
      uploadFun,
      afterRead1,
      afterRead2,
      afterRead3,
      submitFun,
      goBackPage
    }
  }

})
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/center.scss";

// 头部样式覆盖
.van-hairline--top-bottom:after, .van-hairline-unset--top-bottom:after{
  border-top: none;
}

// 页面样式
.page-con {
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  padding-top:50px;
  padding-bottom: 120px;
  background-color: #f5f7fc;
  text-align: initial;
  font-size: 12px;
  position: relative;
  .common-title{
    font-size:20px;
    font-weight: 600;
    color: #333333;
    margin: 18px;
  }
  .commont-tip{
    font-weight: 500;
    font-size: 12px;
    line-height: 21px;
    color: #A1A0A0;
    padding-left: 10px;
  }
  .item-title{
    font-weight: 600;
    font-size: 14px;
    line-height: 19px;
    color: #333333;
    padding: 10px;
  }
  .status{
    font-weight: 500;
    font-size: 12px;
    line-height: 21px;
    color: #A1A0A0;
    padding-left: 10px;
    &.success{
      color: $font6;
    }
    &.fail{
      color: $font8;
    }
  }
  .photo-status-con{
    @include flex-fun;
    justify-content: flex-start;
    padding-left: 10px;
    .id-icon{
      background: url("~@/assets/images/center/id.png") center / contain no-repeat;
      width: 21px;
      height: 15px;
    }
  }
  .title-con{
    @include flex-fun;
    justify-content: flex-start;
    .item-title{
      flex: 1;
    }
    .status{
      flex: none;
      padding-right: 20px;
    }
  }
  .page-flow {
    width: 343px;
    background: #FFFFFF;
    border-radius: 8px;
    margin: 10px auto 30px;
    padding-bottom: 30px;
    .info-con {
      .item {
        margin-bottom: 10px;
      }
      .van-divider {
        flex: none;
        width: 100%;
        margin: 0px;
      }
    }

  }
  .photo-con{
    width: 100%;
    overflow: hidden;
    .item {
      margin-bottom: 10px;
      @include flex-fun;
      flex-direction: column;
      .lable{
        font-weight: 500;
        font-size: 14px;
        line-height: 21px;
        color: #A1A0A0;
        padding: 10px;
        text-align: left;
        width: 100%;
        padding-left: 30px;
      }
      .van-divider{
        width: 90%;
      }
      .shenhezhong{
        background: url("~@/assets/images/center/shz.png") center / contain no-repeat;
        width: 300px;
        height: 160px;
      }
    }
  }
  .footer-con{
    position: fixed;
    width: 100%;
    height: 120px;
    left: 0px;
    bottom: 0px;
    background: #FFFFFF;
    .commont-tip{
      text-align: center;
      margin-top: 10px;
    }
    .submit-btn{
      width: 323px;
      height: 45px;
      line-height: 45px;
      background: #486BF6;
      border-radius: 8px;
      color: #FFFFFF;
      text-align: center;
      margin: 20px auto;
      &.success{
        background-color: #486BF6;
      }
      &.faill{
        background-color: #C4C4C4;
      }
    }
  }
}

</style>
