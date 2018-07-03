<template>
  <div class="add-container">
    <div class="add-container-qrBox" v-if="!supplementStatus">
      <div class="add-container-qrBox-header">
        <div>{{phone}}</div>
        <div>还不是会员，快速办理，享<img style="margin: 0 10px;" src="../../assets/images/vipManager/vip.png">等级权益</div>
      </div>
      <img style="margin: auto;display: block;margin-top: 40px;" src="../../assets/images/vipManager/line.png">
      <div style="margin-top: 89px;text-align: center;font-size:18px;">扫码绑定微信开通</div>
      <div class="add-container-qrBox-qrWrappper">
        <img :src="'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + qrCodeImg">
      </div>
      <div class="add-container-qrBox-aClick" @click="toSupplement(false)">
        仅手机号开通 >
      </div>
    </div>
    <div class="add-container-form" v-else>
      <div class="add-container-form-header">
        <img :src="xhome" @click="close">
      </div>
      <div class="add-container-form-content">
        <div class="add-container-form-content-header">
          <div class="add-container-form-content-header-shape"></div>
          <span>补充会员信息</span>
        </div>
        <div class="add-container-form-content-item">
          <span>手机号</span>
          <span>{{supplementData.phone}}</span>
        </div>
        <div class="add-container-form-content-item">
          <span class="realName">姓名</span>
          <el-input v-model="supplementData.realName" clearable size="mini" style="width: 130px"></el-input>
        </div>
        <div class="add-container-form-content-item" v-if="isWechatWay">
          <span>微信名</span>
          <span>{{supplementData.nickname}}</span>
        </div>
        <div class="add-container-form-content-item">
          <span>性别</span>
          <div>
            <el-radio v-model="supplementData.sex" :label="1">男</el-radio>
            <el-radio v-model="supplementData.sex" :label="2">女</el-radio>
          </div>
        </div>
        <div class="add-container-form-content-item">
          <span>生日日期</span>
          <el-date-picker size="mini" style="width: 130px;" v-model="supplementData.birthDay" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
        <div class="add-container-form-content-btn">
          <div @click="cancelSup">取消</div>
          <div @click="submitSup">确认办理</div>
        </div>
      </div>
    </div>
    <div class="add-container-dailog" v-show="hasRegist">
      <div class="add-container-dailog-mainBox">
        <img src="../../assets/images/vipManager/warning.png">
        <div class="add-container-dailog-mainBox-msg">手机号已被注册</div>
        <div class="add-container-dailog-mainBox-btn" @click="hasRegist = false">我知道了</div>
      </div>
    </div>
  </div>
</template>
<script>
import { qrCode, polling, cashierRegister, getUserInfo, cancelRegister } from '@/api'
import xhome from '@/assets/images/vipManager/xhome.png'

export default {
  props: ['phone'],
  data() {
    return {
      xhome,
      qrCodeImg: '',
      interval: '',
      hasRegist: false,
      supplementStatus: false,
      isWechatWay: false,
      supplementData: ''
    }
  },
  created() {
    this.submitDiscount()
  },
  beforeDestroy() {
    window.clearInterval(this.interval)
  },
  methods: {
    submitDiscount() {
      qrCode(this.phone).then(res => {
        const data = res.data
        if (data.success) {
          this.qrCodeImg = data.data.ticket
          this.interval = setInterval(() => {
            const promise = this.polling()
            promise.then(res => {
              if (res == 3 || res == 1) {
                this.toSupplement(true)
              } else if (res == 2) {
                this.$toast('该微信已绑定手机号，请解绑后重试！')
              }
            })
          }, 2000)
        }
      })
    },
    polling() {
      return new Promise((resolve, reject) => {
        polling(this.phone).then(res => {
          const data = res.data
          if (data.success) {
            resolve(data.status)
          } else {
            resolve(0)
          }
        }).catch(error => {
          reject(0)
        })
      })
    },
    close() {
      this.supplementStatus = false
    },
    toSupplement(isWechatWay) {
      window.clearInterval(this.interval)
      this.isWechatWay = isWechatWay
      if (isWechatWay) {
        getUserInfo(this.phone).then(res => {
          const data = res.data
          if (data.success) {
            this.supplementData = data.data
            this.supplementData.isWechatWay = isWechatWay
            this.supplementData.phone = this.phone
          }
        })
      } else {
        this.supplementData = {
          phone: this.phone,
          realName: '',
          birthDay: '',
          sex: 1
        }
      }
      this.supplementStatus = true
    },
    submitSup() {
      cashierRegister(this.supplementData).then(res => {
        const data = res.data
        if (data.success) {
          this.$emit('success', this.supplementData.phone)
        }
      })
    },
    cancelSup() {
      cancelRegister(this.phone).then(res => {
        this.$emit('cancel')
      })
    }
  }
}

</script>
<style lang="scss" scoped>
.realName {
  position: relative;
  &:before {
    content: '*';
    color: red;
    position: absolute;
    left: -10px;
  }
}

.add-container {
  height: 100%;
  width: 64%;
  position: relative;
  &-addBox {
    &-closeBox {
      padding: 24px 29px 85px 0;
      position: relative;
      &-close {
        width: 35px;
        height: 35px;
        border-radius: 100%;
        background: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        right: 29px;
      }
    }
    &-wrapper {
      width: 330px;
      margin: auto;
      &-header {
        display: flex;
        align-items: center;
        span {
          font-weight: bold;
          font-size: 16px;
          margin-left: 12px;
        }
        &-wall {
          width: 8px;
          height: 16px;
          background: rgba(199, 177, 135, 1);
          border-radius: 4px;
        }
      }
      input {
        width: 244px;
        height: 48px;
        border: 1px solid rgba(199, 178, 135, 0.7);
        padding: 0 20px;
        font-size: 16px;
        border-radius: 4px;
        margin-top: 20px;
      }
      &-keyboard {
        margin-top: 50px;
        &-itembox {
          display: flex;
          margin-top: 3px;
          & div:not(:last-child) {
            width: 72px;
            height: 67px;
            background: #fff;
            border-radius: 4px;
            margin-right: 3px;
            color: #C7B187;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
          }
          & div:last-child {
            width: 90px;
            height: 67px;
            background: #fff;
            border-radius: 4px;
            margin-right: 3px;
            color: #C7B187;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
          }
        }
        &-itembox1 {
          display: flex;
          margin-top: 3px;
          &-left {
            display: flex;
            margin-bottom: 3px;
            div {
              width: 72px;
              height: 67px;
              background: #fff;
              border-radius: 4px;
              margin-right: 3px;
              color: #C7B187;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 32px;
            }
          }
          &-submit {
            width: 90px;
            height: 136px;
            background: rgba(199, 177, 135, 1);
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            span {
              font-size: 24px;
              color: #fff;
              width: 25px;
              display: block;
            }
          }
        }
      }
    }
  }
  &-qrBox {
    &-header {
      width: 346px;
      margin: auto;
      text-align: center;
      margin-top: 50px;
      & div:nth-child(1) {
        color: #C7B187;
        font-size: 18px;
      }
      & div:nth-child(2) {
        color: #333333;
        font-size: 18px;
      }
    }
    &-qrWrappper {
      width: 245px;
      height: 245px;
      margin: auto;
      border: 1px solid #C7B187;
      padding: 5px;
      margin-top: 23px;
      img {
        width: 100%;
      }
    }
    &-aClick {
      font-size: 16px;
      color: #C7B187;
      text-align: center;
      margin-top: 100px;
    }
  }
  &-dailog {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    &-mainBox {
      width: 363px;
      height: 187px;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      &-msg {
        margin-top: 18px;
        line-height: 16px;
      }
      &-btn {
        margin-top: 58px;
        color: #C7B187;
        border-bottom: 1px solid #C7B187;
      }
    }
  }
  &-form {
    padding: 20px;
    height: 100%;
    &-header {
      position: relative;
      height: 35px;
      line-height: 35px;
      img {
        position: absolute;
        right: 0;
      }
    }
    &-content {
      width: 290px;
      height: 500px;
      margin: auto;
      margin-top: 80px;
      &-header {
        display: flex;
        align-items: center;
        span {
          margin-left: 6px;
          color: #333333;
          font-weight: bolder;
          font-size: 14px;
        }
        &-shape {
          width: 6px;
          height: 13px;
          background: rgba(199, 177, 135, 1);
          border-radius: 3px;
        }
      }
      &-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 39px;
        padding-left: 10px;
      }
      &-btn {
        margin-top: 90px;
        display: flex;
        justify-content: space-between;
        & div:nth-child(1) {
          width: 82px;
          height: 39px;
          border: 1px solid rgba(199, 178, 135, 1);
          border-radius: 4px;
          color: rgba(199, 178, 135, 1);
          text-align: center;
          line-height: 39px;
          font-size: 16px;
        }
        & div:nth-child(2) {
          width: 186px;
          height: 39px;
          background: rgba(199, 178, 135, 1);
          border-radius: 4px;
          color: #fff;
          text-align: center;
          line-height: 39px;
          font-size: 16px;
        }
      }
    }
  }
}

</style>
