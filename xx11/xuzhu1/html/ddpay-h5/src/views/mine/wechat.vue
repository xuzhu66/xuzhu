<template lang="pug">
.page-con
  centerHeader(@goBack="goBack")
  .common-title {{type==1?'添加微信':'编辑微信'}}
  //.common-tip *请设置5-12位包含字母数字的交易密码
  .page-flow
    .info-con
      .item
        van-cell-group
          van-field(v-model='realName' :readonly="readOnly" label='' placeholder='请输入真实姓名' maxlength=30 border=false label-width="60")
      .item
        van-cell-group
          van-field(v-model='acctNo' label='' placeholder='请输入微信账号' maxlength=30 border=false label-width="60")
      .item(@click="openPopUpAction")
        van-cell-group
          van-field(v-model='wxNickName' label='' placeholder='请输入微信昵称' maxlength=30 border=false label-width="60")
      .item
        .lable 上传微信收款码
        van-uploader(v-model="fileList" multiple :max-count="1" :max-size="6 * 1024 * 1024" @oversize="onOversize" :after-read="afterRead")
        van-divider(:style="{ color: '#F2F2F2', borderColor: '#F2F2F2', padding: '0 8px' }")

      .submit-btn(@click="submitBankFun" :class="success?'success':'faill'") 添加

</template>

<script>
import { defineComponent, reactive, toRefs, onMounted, watchEffect, getCurrentInstance } from 'vue'
import centerHeader from '@/views/mine/centerHeader'
import { useRoute, useRouter } from 'vue-router'
import comQrcode from '@/components/comQrcode'
import { Toast, CellGroup, Field, Uploader, Divider } from 'vant'
import { useCenterStore } from '@/store/modules/center'
import { storeToRefs } from 'pinia'
import { validateCommonUserName } from '@/utils/validate'
export default defineComponent({
  name: 'Bank',
  components: {
    centerHeader,
    comQrcode,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Uploader.name]: Uploader,
    [Divider.name]: Divider
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const centerStore = useCenterStore()
    const { userInfo, currtTempObj } = storeToRefs(centerStore)
    const submitWechatAction = (param) => centerStore.submitWechatAction(param) // 新增
    const updateWechatAction = (param) => centerStore.updateWechatAction(param) // 修改
    const uploadAction = (param) => centerStore.uploadAction(param) // 图片上传
    const instance = getCurrentInstance()
    const state = reactive({
      currt: '',
      photo3: '',
      fileList: [], // 上传文件列表
      maxSize: 1 * 1024 * 1024, // 多少 M
      realName: '',
      acctNo: '',
      wxNickName: '',
      qrcode: '',
      type: '',
      readOnly: false,
      errorMsg: '',
      success: false,
      requestFlag: true
    })

    const jumpPage = (path) => {
      router.push({
        path: path
      })
    }

    const goBack = () => {
      router.push({ path: '/mine/accountIndex' })
    }

    const onCancelAction = () => {
      state.show = false
    }
    const openPopUpAction = () => {
      state.show = true
    }
    const selectQuery = (item) => {
      state.currt = item
      onCancelAction()
    }
    const onOversize = (file) => {
      Toast('文件大小不能超过6M!')
    }
    const submitBankFun = async() => {
      const valiteFlag = beforeSubmit()

      if (!valiteFlag) return
      debugger
      if (!state.success) return
      if (!state.requestFlag) return
      state.requestFlag = false
      instance.proxy.$loading.show()
      // 新增
      if (state.type === '1') {
        await uploadFun(state.file).then(res => {
          state.qrcode = res.link
        })
        const param = {
          realName: state.realName,
          acctNo: state.acctNo,
          wxNickName: state.wxNickName,
          qrcode: state.qrcode
        }
        submitWechatAction(param).then(res => {
          state.requestFlag = true
          instance.proxy.$loading.hide()
          router.go(-1)
        })
      }
      // 编辑
      if (state.type === '2') {
        if (state.file) {
          await uploadFun(state.file).then(res => {
            state.qrcode = res.link
            instance.proxy.$loading.hide()
          })
        }
        const param = {
          id: currtTempObj.value.id,
          realName: state.realName,
          acctNo: state.acctNo,
          wxNickName: state.wxNickName,
          qrcode: state.qrcode
        }
        updateWechatAction(param).then(res => {
          state.requestFlag = true
          instance.proxy.$loading.hide()
          router.go(-1)
        })
      }
    }
    const afterRead = (file) => {
      state.file = file
    }
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
    // 提交校验
    const beforeSubmit = () => {
      if (!validateCommonUserName(state.realName)) {
        Toast('请输入中英文、数字、字母组成的2-20位真实姓名')
        return false
      }
      return true
    }
    watchEffect(() => {
      state.realName = userInfo.value.realName
      // 本人
      if (userInfo.value.kind === 10) {
        state.readOnly = true
      } else {
        state.readOnly = false
      }
    })
    watchEffect(() => {
      state.success = state.realName && state.wxNickName && state.acctNo && state.fileList.length
    })
    onMounted(() => {
      state.type = route.query.type
      if (state.type === '2') {
        state.realName = currtTempObj.value.realName
        state.acctNo = currtTempObj.value.acctNo
        state.wxNickName = currtTempObj.value.wxNickName
        state.qrcode = currtTempObj.value.qrcode
        state.fileList = [{ url: currtTempObj.value.qrcode }]
      }
    })
    return {
      ...toRefs(state),
      jumpPage,
      goBack,
      openPopUpAction,
      onCancelAction,
      selectQuery,
      onOversize,
      submitBankFun,
      afterRead
    }
  }

})
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/center.scss";

.down-icon{
  background: url("~@/assets/images/center/down.png") center/contain no-repeat;
  width: 12px;
  height: 12px;
  display: inline-block;
  position: absolute;
  right: 20px;
  top: 10px;
}

.clipboard-con{
  display: none;
}

.van-hairline--top-bottom:after, .van-hairline-unset--top-bottom:after{
  border-top: none;
}

// 页面样式
.page-con {
  height: 100vh;
  padding-top: 50px;
  //background: linear-gradient(167.96deg, #50B1A9 0%, #0E52D7 100%);
  .goback{
    position: relative;
    height: 45px;
    .left-icon{
      background: url("~@/assets/images/center/rightjt.png") center/contain no-repeat;
      width: 9px;
      height: 16px;
      transform: rotate(180deg) ;
      margin-right: 10px;
      position: absolute;
      left: 10px;
      top: 22px;
    }
  }
  .common-title{
    color: #333333;
    font-size: 20px;
    font-weight: 600;
    text-align: left;
    padding-left: 10px;
    margin-bottom: 20px;
    padding-top: 20px;
  }
  .common-tip{
    font-weight: 500;
    font-size: 12px;
    line-height: 21px;
    color: #A1A0A0;
    padding-left: 10px;
    margin-top: -10px;
    margin-bottom: 10px;
    text-align: left;
  }
  .page-flow {
    background:#FFFFFF;
    width: 345px;
    margin: 36px auto;
    padding-bottom: 10px;
    border-radius: 16px;
    padding-top: 20px;
    .info-con {
      .item {
        margin-bottom: 10px;
        position: relative;
        .lable{
          text-align: left;
          padding-left: 18px;
          padding-bottom: 10px;
          font-weight: 500;
          font-size: 14px;
          line-height: 21px;
          color: #333333;
        }
        .btn{
          font-size: 12px;
          line-height: 21px;
          text-decoration-line: underline;
          color: #486BF6;
          position: absolute;
          bottom: 10px;
          right: 10px;
        }
        .time{
          position: absolute;
          bottom: 10px;
          right: 10px;
        }

        .eye{
          width: 18px;
          height: 16px;
          position: absolute;
          bottom: 10px;
          right: 10px;
          &.open{
            background: url("~@/assets/images/center/eyeo.png") center/contain no-repeat;
          }
          &.close{
            background: url("~@/assets/images/center/eyec.png") center/contain no-repeat;
          }
        }
      }
      .submit-btn{
        width: 280px;
        height: 45px;
        line-height: 45px;
        background: #486BF6;
        border-radius: 8px;
        color: #FFFFFF;
        text-align: center;
        margin: 30px auto 10px;
        &.success{
          background-color: #486BF6;
        }
        &.faill{
          background-color: #C4C4C4;
        }
      }
    }
  }
}
// 弹出框样式
.count-list{
  position: relative;
  border: 1px solid skyblue;
  .nav-con{
    position: fixed;
    bottom: 400px;
    width: 100%;
    border-radius: 8px 8px 0 0;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    z-index: 2;
    background-color: #FFFFFF;
    .close{
      flex: none;
      width: 50px;
    }
    .title{
      flex: 1;
    }
    .btn{
      flex: none;
      width: 80px;
      color: #486BF6;
    }
  }
  .pop-con{
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #FFFFFF;
    padding: 20px;
    li{
      flex: none;
      @include flex-fun;
      justify-content: flex-start;
      width: 343px;
      height: 45px;
      padding-left: 10px;
      margin-bottom: 10px;
      position: relative;
      &.active{
        background: #F6F7FD;
        border-radius: 8px;
        &:after{
          content: '';
          width: 16px;
          height: 16px;
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
          z-index: 1;
          border-radius: 50%;
          background: url("~@/assets/images/center/select.png") center/contain no-repeat;
        }
      }
    }
  }
}

</style>
