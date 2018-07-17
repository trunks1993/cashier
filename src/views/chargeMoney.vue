<template>
  <div class="main-container">
    <qrface @getMenber="getMenber" :is-face="isFace" :url="memberUrl" :member="member" @showqrCode="showqrCode" @closeFace="closeFace" @toFace="toFace" ref="GetMember" @clearMember="clearMember" />
    <div class="main-container-vipPrintWrapper">
      <div class="main-container-vipPrintWrapper-printBox" :style="member ? '':'padding-top: 160px'">
        <template v-if="!member">
          <div :style="backgroundObj">
            <div class="main-container-vipPrintWrapper-printBox-facePrint" @click="toFace">
              <img src="../assets/images/facevip.png">
              <span>人脸识别会员</span>
            </div>
          </div>
          <div :style="backgroundObj">
            <div class="main-container-vipPrintWrapper-printBox-numberPrint">
              <img src="../assets/images/scanvip.png">
              <input type="text" placeholder="输入/扫码会员" v-model="memberCode" @keydown.enter="GetMemberByCode">
            </div>
          </div>
        </template>
        <template v-else>
          <div :style="backgroundObj">
            <div class="main-container-vipPrintWrapper-printBox-infoHeader">
              <div>
                <span>{{member.member.nick&&member.member.nick!=""?member.member.nick:member.member.userName}}</span>
                <span>{{member.member.cellPhone || ''}}</span>
              </div>
              <i class="iconfont icon-shanchu" @click="clearMember"></i>
            </div>
          </div>
          <div class="main-container-vipPrintWrapper-printBox-infoContent">
            <div class="main-container-vipPrintWrapper-printBox-infoContent-item">
              <span>会员账号</span>
              <span>{{member.member.userName}}</span>
            </div>
            <div class="main-container-vipPrintWrapper-printBox-infoContent-item">
              <span>会员昵称</span>
              <span>{{member.member.nick || '无'}}</span>
            </div>
            <div class="main-container-vipPrintWrapper-printBox-infoContent-item">
              <span>手机号</span>
              <span>{{member.member.cellPhone}}</span>
            </div>
            <div class="main-container-vipPrintWrapper-printBox-infoContent-item">
              <span>所属门店</span>
              <span>{{member.shopName}}</span>
            </div>
            <div class="main-container-vipPrintWrapper-printBox-infoContent-item">
              <span>账户余额</span>
              <span style="color: #D00000">{{member.balance | rmb}}</span>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="main-container-moneySetWrapper" :class="{flex: !member}">
      <template v-if="member">  
        <div class="main-container-moneySetWrapper-tabBox" v-if="payList">
          <div class="main-container-moneySetWrapper-tabBox-item" :class="{isActive: payType === 'wx'}" @click="payType = 'wx'" v-if="payList.supportWechatScan">
            <i class="iconfont icon-weixin"></i>
            <span>微信</span>
          </div>
          <div class="main-container-moneySetWrapper-tabBox-item" :style="payList.supportWechatScan ? 'margin-left: 90px;' : ''" :class="{isActive: payType === 'zfb'}" @click="payType = 'zfb'" v-if="payList.supportAlipayScan">
            <i class="iconfont icon-zhifubao"></i>
            <span>支付宝</span>
          </div>
        </div>
        <div class="main-container-moneySetWrapper-inputBox">
          <span>储值金额（元）</span>
          <input type="text" :disabled="!member" @input="chargeValInput" ref="chargeVal" v-model="chargeVal" @keyup="inputKeyUp">
          <div v-if="!member" style="color: red; margin-top: 8px;">请输入会员信息再充值</div>
        </div>
        <template v-if="member && chargeVal > 0">
          <div class="main-container-moneySetWrapper-contentBox">
            <div class="main-container-moneySetWrapper-contentBox-money">
              <span>到账金额：</span><span v-if="!inputLoading">￥{{chargeVal * 1 + (giftObj.giftAmount || 0)}}</span><span v-else>正在计算...</span>
            </div>
            <div class="main-container-moneySetWrapper-contentBox-detail" v-if="giftObj">
              <div>
                1.赠送{{giftObj.giftAmount}}元储值金额
              </div>
              <div v-if="giftObj.card">
                2.赠送无门槛会员卡（含
                <span v-if="giftObj.card.doesFreeShipping">满{{giftObj.card.freeShippingMoney}}元包邮;</span>
                <span v-if="giftObj.card.doesDiscount">{{giftObj.card.discount}}折;</span>
                <span v-if="giftObj.card.doesPointTimes">{{giftObj.card.pointTimes}}倍积分加速;</span>
                <span v-if="giftObj.card.doesGiveCoupon">{{giftObj.card.couponCount}}张优惠券;</span>
                <span v-if="giftObj.card.doesGivePoint">{{giftObj.card.givenPoints}}积分;</span>
                  ）
              </div>
            </div>
          </div>
          <div class="main-container-moneySetWrapper-bottonBox">
            <div class="main-container-moneySetWrapper-bottonBox-btn" @click="toSub">
              确认收款
            </div>
            <span v-if="giftObj.card">温馨提示：充值完毕，平台会通过公众号下发无门槛卡给会员，请会员及时查收</span>
          </div>
        </template>
      </template>
      <img :src="noChargeAw" v-else>
    </div>
    <div class="payScanMask" @click="qrfocus" v-show="scan">
      <div class="scan">
        <i class="iconfont icon-guanbi" @click="scan = false" style="position: absolute;top: 6px;right: 10px"></i>
        <span>{{payType=="zfb"?"支付宝":"微信"}}扫一扫</span>
        <div :class="{dong:isDong}"></div>
        <input type="text" id="chargeMoneyInput" @focus="addDong(true)" @blur="addDong(false)" v-model="payCode" @keyup.enter="subOrder">
        <p>请用扫码枪扫描顾客付款二维码</p>
      </div>
    </div>
    <div class="loading" v-show="loading">
      <div class="spinner">
        <div class="double-bounce1"></div>
        <div class="double-bounce2"></div>
      </div>
    </div>
  </div>
</template>
<script>
import qrface from '@/views/qrface'
import { getShopStoredValueAndPay, chargeScanPay, chargeSubmit, getChargeGift } from '@/api'
import noChargeAw from '@/assets/images/noChargeAw.png'
export default {
  name: 'chargeMoney',
  components: { "qrface": qrface },
  data() {
    return {
      // new
      noChargeAw,
      backgroundObj: {
        backgroundImage: `url(${require('@/assets/images/headImg1.png')})`,
        width: '100%',
        height: '110px',
        'margin-bottom': '20px',
        padding: '17px 19px 14px 19px'
      },
      isWechat: true,
      inputIsOk: false,
      inputLoading: false,
      giftObj: '',
      // old
      member: null,
      memberCode: '',
      payType: '',
      payList: null,
      chargeVal: 0,
      rule: '0',
      isDong: false,
      payCode: "",
      scan: false,
      orderId: '',
      payClass: '',
      loading: false,
      isFace: false,
      memberUrl: 'chargeMoney'
    }
  },
  created() {
    if (document.getElementById("back-menu")) document.getElementById("back-menu").style.display = "block"
    if (document.getElementById("menu-nav")) document.getElementById("menu-nav").style.display = "none"
    this.GetPayList()
    var self = this
    // document.body.addEventListener("keyup", function(e) {
    //   if (e.keyCode == 32) {
    //     self.subOrder()
    //   }
    //   if (e.keyCode == 27) {
    //     self.scan = false
    //     document.getElementById('chargeMoneyInput').blur()
    //   }
    // })
  },
  methods: {
    inputKeyUp() {
      clearTimeout(this.timeOut)
      this.inputLoading = true
      this.timeOut = setTimeout(()=>{
        getChargeGift(this.chargeVal, this.member.member.id).then(res => {
          if(res) {
            this.giftObj = res.data
          }
          this.inputLoading = false
        })
      }, 2000)
    },
    toFace() {
      this.isFace = true
    },
    closeFace() {
      this.isFace = false
    },
    getMenber(res) {
      this.isFace = false
      this.member = res.data
    },
    clearMember() {
      this.member = null
      this.giftObj = ''
      this.chargeVal = 0
      this.inputLoading = false
    },
    showqrCode() {
      this.$emit("showqrCode")
    },
    GetMemberByCode() {
      this.$refs.GetMember.GetMember(this.memberCode)
      this.memberCode = ""
    },
    getPayLength() {
      var l = 0
      if (this.payList.supportAlipayScan) l++
        if (this.payList.supportWechatScan) l++
          if (l == 1) this.payClass = "ty1"
      if (l == 2) this.payClass = "ty2"
    },
    qrfocus() {
      setTimeout(function() {
        document.getElementById('chargeMoneyInput').focus()
      }, 100)
    },
    toSub() {
      if (this.chargeVal != '' && this.chargeVal > 0) {
        if (this.orderId == "") {
          this.GetChargeOrderId()
        } else {
          this.scan = true
          setTimeout(function() {
            document.getElementById('chargeMoneyInput').focus()
          }, 100)
        }
      }
    },
    GetPayList() {
      var self = this
      getShopStoredValueAndPay().then(function(response) {
        console.log(response)
        if (!response.data.success) {
          self.$toast(response.data.msg)
        } else {
          self.payList = response.data.data
          if (response.data.data.isShopStoredValue) {
            self.rule = response.data.data.shopStoredDiscount
          }
          // self.rule=0
          if (self.payList.supportWechatScan) {
            self.payType = "wx"
          } else {
            self.payType = "zfb"
          }
          self.getPayLength()
        }
      })
    },
    subOrder() {
      this.loading = true
      var self = this
      var ScanPay = {
        BarOrQRCode: this.payCode,
        OrderIds: this.orderId,
        PluginId: this.payType == "zfb" ? 'Himall.Plugin.Payment.Alipay_Scan' : 'Himall.Plugin.Payment.WeiXinPay_Scan'
      }
      chargeScanPay(ScanPay).then(function(response) {
        if (response.data.success) {
          chargeData = {
            member: self.member,
            orderId: self.orderId,
            ChargeAmount: self.chargeVal,
            AdditionAmount: self.giftObj.giftAmount,
            payType: self.payType,
            dateTime: response.data.data.dateTime,
            Balance: response.data.data.balance,
          }
          self.$router.push('/successCharge')
        } else {
          self.scan = false
          self.$toast(response.data.msg)
        }
        self.payCode = ""
        self.loading = false
      }).catch(function() {
        self.$toast('提交异常')
      })

    },
    GetChargeOrderId() {
      var self = this
      if (this.member) {
        var ChargeSubmitModel = {
          Id: this.orderId,
          MemId: this.member.member.id,
          ChargeAmount: this.chargeVal,
          AdditionAmount: (this.chargeVal * (this.rule / 100)).toFixed(2),
          ShopId: shopId,
          ManagerId: managerId
        }
        chargeSubmit(ChargeSubmitModel).then(function(response) {
          if (response.data.success) {
            self.orderId = response.data.data
            self.scan = true
            setTimeout(function() {
              document.getElementById('chargeMoneyInput').focus()
            }, 100)
          } else {
            self.$toast(response.data.msg)
          }
        }).catch(function() {
          self.$toast('提交异常')
        })
      }
    },
    addDong(isd) {
      if (isd) {
        this.isDong = true
      } else {
        this.isDong = false
      }
    },
    math(n1, n2) {
      return Math.round((n1 - n2) * 100) / 100
    },
    mathPlus(n1, n2) {
      return Math.round((n1 + n2) * 100) / 100
    },
    numberOnly(vv) {
      if (vv != '' && vv.substr(0, 1) == '.') {
        vv = ""
      }
      vv = vv.replace(/^0*(0\.|[1-9])/, '$1') //解决 粘贴不生效
      vv = vv.replace(/[^\d.]/g, "") //清除“数字”和“.”以外的字符
      vv = vv.replace(/\.{2,}/g, ".") //只保留第一个. 清除多余的
      vv = vv.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".")
      vv = vv.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') //只能输入两个小数
      if (vv.indexOf(".") < 0 && vv != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        if (vv.substr(0, 1) == '0' && vv.length == 2) {
          vv = vv.substr(1, vv.length)
        }
      }
      return vv
    },
    chargeValInput() {
      this.$refs.chargeVal.value = this.numberOnly(this.$refs.chargeVal.value)
      this.chargeVal = this.numberOnly(this.$refs.chargeVal.value)
    }
  },
  filters: {
    rmb(value) {
      return "￥" + (parseFloat(value).toFixed(2) || 0.00)
    },
    frmb(value) {
      return "-￥" + (parseFloat(value).toFixed(2))
    }
  }
}

</script>
<style lang="scss" scoped>
.flex {
  display: flex;
  align-items: center;
  justify-content: center;
}

.isActive {
  border-bottom: 3px solid #C7B287;
}

.main-container {
  display: flex;
  // margin-top: 54px;
  &-vipPrintWrapper {
    height: 100%;
    width: 36%;
    background: rgba(241, 241, 241, 1);
    padding: 20px 0 20px 20px;
    &-printBox {
      width: 100%;
      height: 100%;
      background: #fff;
      &-facePrint {
        @extend .flex;
        width: 100%;
        height: 100%;
        background: rgba(247, 247, 247, 1);
        span {
          margin-left: 8px;
          font-size: 16px;
          color: rgba(51, 51, 51, 1);
        }
      }
      &-infoHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 23px;
        width: 100%;
        height: 100%;
        background: rgba(247, 247, 247, 1);
        i {
          line-height: 22px;
          font-size: 22px;
        }
        & span:nth-child(1) {
          font-size: 18px;
          color: rgba(199, 178, 135, 1);
        }
        & span:nth-child(2) {
          font-size: 16px;
          color: rgba(102, 102, 102, 1);
          margin-left: 26px;
        }
      }
      &-infoContent {
        padding: 20px 42px;
        &-item {
          font-size: 14px;
          color: rgba(102, 102, 102, 1);
          display: flex;
          justify-content: space-between;
          margin-bottom: 45px;
        }
      }
      &-numberPrint {
        @extend .flex;
        width: 100%;
        height: 100%;
        background: rgba(247, 247, 247, 1);
        input {
          background: none;
          margin-left: 14px;
          width: 117px;
          font-size: 16px;
          color: rgba(51, 51, 51, 1);
          text-align: center;
        }
      }
    }
  }
  &-moneySetWrapper {
    height: 100%;
    width: 64%;
    background: rgba(241, 241, 241, 1);
    padding: 60px;
    &-tabBox {
      @extend .flex;
      width: 100%;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      &-item {
        display: flex;
        justify-content: center;
        height: 50px;
        i {
          font-size: 24px;
          line-height: 24px;
        }
        span {
          margin-left: 10px;
        }
      }
    }
    &-inputBox {
      width: 220px;
      margin: auto;
      margin-top: 90px;
      text-align: center;
      span {
        font-size: 14px;
        color: rgba(102, 102, 102, 1);
      }
      input {
        width: 100%;
        background: rgba(241, 241, 241, 1);
        border: 1px solid #C7B287;
        border-radius: 4px;
        height: 40px;
        text-align: center;
        margin-top: 14px;
        font-size: 18px;
      }
    }
    &-contentBox {
      width: 400px;
      height: 100px;
      margin: auto;
      margin-top: 50px;
      &-money {
        & span:nth-child(1) {
          font-size: 15px;
          color: rgba(51, 51, 51, 1);
        }
        & span:nth-child(2) {
          font-size: 15px;
          color: rgba(211, 0, 0, 1);
        }
      }
      &-detail {
        border-left: 1px solid #C7B287;
        width: 100%;
        margin-top: 23px;
        line-height: 16px;
        padding-left: 16px;
        div {
          margin-bottom: 16px;
          font-size: 13px;
          color: rgba(102, 102, 102, 1);
        }
      }
    }
    &-bottonBox {
      width: 400px;
      margin: auto;
      margin-top: 65px;
      &-btn {
        width: 220px;
        height: 39px;
        background: rgba(199, 178, 135, 1);
        border-radius: 4px;
        color: #fff;
        line-height: 39px;
        text-align: center;
        margin: auto;
      }
      span {
        font-size: 12px;
        color: rgba(153, 153, 153, 1);
        margin-top: 27px;
        display: block;
      }
    }
  }
}

</style>
