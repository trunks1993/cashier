<template>
  <div class="add-container">
    <MsgBox :type="msgBoxType" :content="msgBoxContent" @iknown="iknown" v-if="showMsgBox"></MsgBox>
    <img src="../../assets/images/vipManager/xhome.png" @click="close" style="position: absolute; right: 20px; top: 20px;">
    <div class="add-container-addBox" v-if="!showQrScanPage">
      <div class="add-container-addBox-wrapper">
        <div class="add-container-addBox-wrapper-header">
          <div class="add-container-addBox-wrapper-header-wall"></div>
          <span>请输入办理会员的手机号</span>
        </div>
        <input type="number" placeholder="输入手机号" :readonly="pcNumber === -1 ? false : true" v-model="inputVal">
        <!-- <div style="margin-top: 14px;">
          <div style="color: #999999; font-size: 12px;">注：最大优惠金额不得超过10000元</div>
        </div> -->
        <div class="add-container-addBox-wrapper-keyboard">
          <div class="add-container-addBox-wrapper-keyboard-itembox">
            <div @click="inputValue('1')">1</div>
            <div @click="inputValue('2')">2</div>
            <div @click="inputValue('3')">3</div>
            <div @click="inputValue('clear')">清空</div>
          </div>
          <div class="add-container-addBox-wrapper-keyboard-itembox">
            <div @click="inputValue('4')">4</div>
            <div @click="inputValue('5')">5</div>
            <div @click="inputValue('6')">6</div>
            <div @click="inputValue('delete')">删除</div>
          </div>
          <div class="add-container-addBox-wrapper-keyboard-itembox1">
            <div>
              <div class="add-container-addBox-wrapper-keyboard-itembox1-left">
                <div @click="inputValue('7')">7</div>
                <div @click="inputValue('8')">8</div>
                <div @click="inputValue('9')">9</div>
              </div>
              <div class="add-container-addBox-wrapper-keyboard-itembox1-left">
                <div style="width: 147px;" @click="inputValue('00')">00</div>
                <div @click="inputValue('0')">0</div>
              </div>
            </div>
            <div class="add-container-addBox-wrapper-keyboard-itembox1-submit" @click="submitDiscount">
              <span>确定</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
    <div class="add-container-qrBox" v-else>
      <div class="add-container-qrBox-header">
        <div>{{inputVal}}</div>
        <div>还不是会员，快速办理，享<span style="color: #C7B187;">{{cardName}}</span>权益</div>
      </div>
      <img style="margin: auto;display: block;margin-top: 40px;" src="../../assets/images/vipManager/line.png">
      <div class="add-container-qrBox-qrTitle">扫码绑定微信开通</div>
      <div class="add-container-qrBox-qrWrappper">
        <img :src="'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + qrCodeImg">
      </div>
      <div class="add-container-qrBox-aClick" @click="toSupplement(false)">
        仅手机号开通 >
      </div>
    </div>
  </div>
</template>
<script>
import { checkMemberPhone, qrCode, polling } from '@/api'
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'routes',
      'userInfo',
      'pcNumber'
    ])
  },
  data() {
    return {
      inputVal: '',
      showQrScanPage: false,
      qrCodeImg: '',
      interval: '',
      showMsgBox: false,
      msgBoxContent: '',
      msgBoxType: 'warning',
      cardName: ''
    }
  },
  methods: {
    inputValue(val) {
      if (val === 'clear') {
        this.inputVal = ''
      } else if (val === 'delete') {
        this.inputVal = this.inputVal.substring(0, this.inputVal.length - 1)
      } else {
        const temp = this.inputVal + val
        if (this.inputVal.length >= 11 || (val === '00' && temp.length > 11)) {
          this.$toast('手机号长度不能超过11位数')
          return
        }
        this.inputVal += val
      }
    },
    submitDiscount() {
      if (/^1[34578]\d{9}$/.test(this.inputVal)) {
        checkMemberPhone(this.inputVal).then(res => {
          const data = res.data
          if (data.success) {
            this.cardName = data.cardName
            this.showQrScanPage = true
            qrCode(this.inputVal).then(res => {
              const data = res.data
              if (data.success) {
                this.qrCodeImg = data.data.ticket
                this.interval = setInterval(() => {
                  const promise = this.polling()
                  promise.then(res => {
                    if (res == 3 || res == 1) {
                      this.toSupplement(true)
                    } else if (res == 2) {
                      this.showMsgBox = true
                      this.msgBoxContent = '该微信已绑定手机号，请解绑后重试！'
                    }
                  })
                }, 2000)
              }
            })
          } else {
            this.showMsgBox = true
            this.msgBoxContent = data.msg
          }
        })
      } else {
        this.$toast('请输入正确手机号')
      }
    },
    iknown() {
      if (this.interval) {
        window.clearInterval(this.interval)
        this.submitDiscount()
      }
      this.showMsgBox = false
    },
    polling() {
      return new Promise((resolve, reject) => {
        polling(this.inputVal).then(res => {
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
      this.$emit('closeAdd')
    },
    toSupplement(isWechatWay) {
      window.clearInterval(this.interval)
      this.$emit('supplementEditor', this.inputVal, isWechatWay)
    }
  }
}

</script>
<style lang="scss" scoped>
.add-container {
  height: 100%;
  position: relative;
  &-addBox {
    position: relative;
    top: 90px;
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
        width: 315px;
        height: 48px;
        border: 1px solid rgba(199, 178, 135, 0.7);
        padding: 0 20px;
        font-size: 16px;
        border-radius: 4px;
        margin-top: 20px;
        background: #f2f2f2;
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none !important;
          margin: 0;
        }
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
    &-qrTitle {
      margin-top: 89px;
      text-align: center;
      font-size: 18px;
      @media screen and(max-width: 1440px) {
        margin-top: 40px;
      }
    }
    &-header {
      width: 405px;
      margin: auto;
      text-align: center;
      padding-top: 50px;
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
      @media screen and(max-width: 1440px) {
        margin-top: 50px;
      }
    }
  }
  // &-dailog {
  //   position: absolute;
  //   top: 0;
  //   bottom: 0;
  //   right: 0;
  //   left: 0;
  //   background: rgba(0, 0, 0, 0.3);
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;
  //   &-mainBox {
  //     width: 363px;
  //     height: 187px;
  //     background: #fff;
  //     display: flex;
  //     align-items: center;
  //     justify-content: center;
  //     flex-direction: column;
  //     &-msg {
  //       margin-top: 18px;
  //       line-height: 16px;
  //     }
  //     &-btn {
  //       margin-top: 58px;
  //       color: #C7B187;
  //       border-bottom: 1px solid #C7B187;
  //     }
  //   }
  // }
}

</style>
