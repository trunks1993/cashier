<template>
  <div class="sideBar-container">
    <msg-box :type="'warning'" :content="'您未开启预存款储值！'" @iknown="iknown" v-if="showMsgBox"></msg-box>
    <div class="sideBar-container-mainBox" :class="{hiden: !isSideShow, show: isSideShow}">
      <template v-if="!isSettingBox">
        <div class="sideBar-container-mainBox-header">
          <i class="iconfont icon-zuocelanrenwu"></i>
          <span>{{userInfo.userName}}</span>
          <span>{{userInfo.shopName}}</span>
        </div>
        <div class="sideBar-container-mainBox-menuBox">
          <div class="sideBar-container-mainBox-menuBox-item">
            <img src="../../../assets/images/menuIcons/shouyin.png" @click="to({path: '/'})">
            <div @click="to({path: '/'})">收银</div>
          </div>
          <template v-for="item in routes" v-if="item.children[0].meta">
            <div class="sideBar-container-mainBox-menuBox-item">
              <img :src="item.children[0].meta.imgUrl" @click="to(item.children[0])">
              <div @click="to(item.children[0])">{{item.children[0].meta.menuName}}</div>
            </div>
            <div class="sideBar-container-mainBox-menuBox-item" v-if="item.children[1]">
              <img :src="item.children[1].meta.imgUrl" @click="to(item.children[1])">
              <div @click="to(item.children[1])">{{item.children[1].meta.menuName}}</div>
            </div>
          </template>
        </div>
      </template>
      <template v-else>
        <div class="sideBar-container-mainBox-goBackBox">
          <div class="sideBar-container-mainBox-goBackBox-goBack" @click="isSettingBox = false,  isShowShopDiscounts = false, addStatus = false, inputVal = ''">
            <img src="../../../assets/images/menuIcons/back.png">
          </div>
        </div>
        <div class="sideBar-container-mainBox-switchBox">
          <div class="sideBar-container-mainBox-switchBox-item">
            <div class="sideBar-container-mainBox-switchBox-item-titleBox">
              <img src="../../../assets/images/menuIcons/setjiaojieban.png">
              <span>交接班</span>
            </div>
            <mu-switch class="yswitch" v-model="openCashierShift"></mu-switch>
          </div>
          <div class="sideBar-container-mainBox-switchBox-item">
            <div class="sideBar-container-mainBox-switchBox-item-titleBox">
              <img src="../../../assets/images/menuIcons/setxiaopiao.png">
              <span>打印小票</span>
            </div>
            <mu-switch class="yswitch" v-model="openPrintTicket"></mu-switch>
          </div>
          <div class="sideBar-container-mainBox-switchBox-item">
            <div class="sideBar-container-mainBox-switchBox-item-titleBox">
              <img src="../../../assets/images/menuIcons/setyouhui.png">
              <span>优惠设置</span>
              <span style="font-size: 14px;color: #C7B187;" v-if="openDiscounts && !isShowShopDiscounts" @click="showShopDiscounts">查看</span>
            </div>
            <mu-switch class="yswitch" v-model="openDiscounts"></mu-switch>
          </div>
        </div>
      </template>
    </div>
    <div class="sideBar-container-preferentialBox" v-show="isShowShopDiscounts && openDiscounts">
      <div class="sideBar-container-preferentialBox-closeBox">
        <div class="sideBar-container-preferentialBox-closeBox-close" @click="isShowShopDiscounts = false">
          <img src="../../../assets/images/menuIcons/x.png">
        </div>
      </div>
      <div class="sideBar-container-preferentialBox-mainWrapper">
        <div class="sideBar-container-preferentialBox-mainWrapper-itemBox">
          <div class="sideBar-container-preferentialBox-mainWrapper-itemBox-header">
            <div></div>
            <span>整单折扣</span>
          </div>
          <div class="sideBar-container-preferentialBox-mainWrapper-itemBox-content">
            <div class="sideBar-container-preferentialBox-mainWrapper-itemBox-content-item" style="background: #B10000;" v-for="item in discountsList" v-if="item.Type === 1">
              <img src="../../../assets/images/menuIcons/xx.png" @click="deleteItem(item.Id)">
              <span>{{item.Value | formatNumber(true)}}</span>
              <span>.{{item.Value | formatNumber(false)}}</span>
              <span>折</span>
            </div>
            <div class="sideBar-container-preferentialBox-mainWrapper-itemBox-content-item" v-show="getNumber(discountsList, true)" @click="addDiscount(true)">
              +
            </div>
          </div>
        </div>
        <div class="sideBar-container-preferentialBox-mainWrapper-itemBox" style="margin-top: 70px;">
          <div class="sideBar-container-preferentialBox-mainWrapper-itemBox-header">
            <div></div>
            <span>整单改价</span>
          </div>
          <div class="sideBar-container-preferentialBox-mainWrapper-itemBox-content">
            <div class="sideBar-container-preferentialBox-mainWrapper-itemBox-content-item" style="background: #AB915F" v-for="item in discountsList" v-if="item.Type === 2">
              <img src="../../../assets/images/menuIcons/xx.png" @click="deleteItem(item.Id)">
              <span></span>
              <span>-{{item.Value}}</span>
              <span>元</span>
            </div>
            <div class="sideBar-container-preferentialBox-mainWrapper-itemBox-content-item" v-show="getNumber(discountsList, false)" @click="addDiscount(false)">
              +
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sideBar-container-addBox" v-if="addStatus">
      <div class="sideBar-container-addBox-closeBox">
        <div class="sideBar-container-addBox-closeBox-close" @click="addStatus = false,inputVal = ''">
          <img src="../../../assets/images/menuIcons/x.png">
        </div>
      </div>
      <div class="sideBar-container-addBox-wrapper">
        <div class="sideBar-container-addBox-wrapper-header">
          <div class="sideBar-container-addBox-wrapper-header-wall"></div>
          <span>{{inputType ? '输入整单优惠折扣' : '输入整单优惠金额（元）'}}</span>
        </div>
        <input type="text" :placeholder="inputType?'请输入折扣':'请输入数字1~10000'" :readonly="pcNumber === -1 ? false : true" v-model="inputVal">
        <div style="margin-top: 14px;">
          <template v-if="!inputType">
            <div style="color: #999999; font-size: 12px;">注：最大优惠金额不得超过10000元</div>
          </template>
          <template v-else>
            <div style="color: #999999; font-size: 12px;">注：仅支持输入数字（0.1~9.9）</div>
            <div style="color: #999999; font-size: 12px;">例如九折，请输入数字9</div>
          </template>
        </div>
        <div class="sideBar-container-addBox-wrapper-keyboard">
          <div class="sideBar-container-addBox-wrapper-keyboard-itembox">
            <div @click="inputValue('1')">1</div>
            <div @click="inputValue('2')">2</div>
            <div @click="inputValue('3')">3</div>
            <div @click="inputValue('clear')">清空</div>
          </div>
          <div class="sideBar-container-addBox-wrapper-keyboard-itembox">
            <div @click="inputValue('4')">4</div>
            <div @click="inputValue('5')">5</div>
            <div @click="inputValue('6')">6</div>
            <div @click="inputValue('delete')">删除</div>
          </div>
          <div class="sideBar-container-addBox-wrapper-keyboard-itembox1">
            <div>
              <div class="sideBar-container-addBox-wrapper-keyboard-itembox1-left">
                <div @click="inputValue('7')">7</div>
                <div @click="inputValue('8')">8</div>
                <div @click="inputValue('9')">9</div>
              </div>
              <div class="sideBar-container-addBox-wrapper-keyboard-itembox1-left">
                <div @click="inputValue('00')">00</div>
                <div @click="inputValue('0')">0</div>
                <div @click="inputValue('.')">.</div>
              </div>
            </div>
            <div class="sideBar-container-addBox-wrapper-keyboard-itembox1-submit" @click="submitDiscount">
              <span>确定</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sideBar-container-mark" :style="!isSideShow ? 'display: none' : ''" @click="isSideShow = false">
    </div>
    <div class="showCodeImg" v-show="showCode" @click="showCode=false">
      <div class="codeBox">
        <div class="imgCodeBox">
          <qriously class="imgCode" id="aa" :value="initQCode" :size="215" />
        </div>
        <div style="display:none;">
          <qriously class="imgCode" id="downaloadImg" :value="initQCode" :size="1000" />
        </div>
        <p>请让消费者使用微信扫描该二维码，完成头像上传后即自动完成开卡</p>
        <button @click="downloadQrcode">下载该二维码</button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Bus from '@/utils/bus'
import { getShopDiscounts, deleteDiscounts, submitDiscount, getShopStoredSet } from '@/api'
export default {
  computed: {
    ...mapGetters([
      'routes',
      'userInfo',
      'pcNumber'
    ]),
    openCashierShift: {
      get() {
        return this.$store.getters.userInfo.openCashierShift
      },
      set(val) {
        this.$store.dispatch('SetCashierShift', { OpenCashierShift: val, OpenPrintTicket: this.openPrintTicket, CashierDiscounts: this.openDiscounts })
      }
    },
    openPrintTicket: {
      get() {
        return this.$store.getters.userInfo.openPrintTicket
      },
      set(val) {
        this.$store.dispatch('SetCashierShift', { OpenCashierShift: this.openCashierShift, OpenPrintTicket: val, CashierDiscounts: this.openDiscounts })
      }
    },
    openDiscounts: {
      get() {
        return this.$store.getters.userInfo.openDiscounts
      },
      set(val) {
        this.$store.dispatch('SetCashierShift', { OpenCashierShift: this.openCashierShift, OpenPrintTicket: this.openPrintTicket, CashierDiscounts: val })
      }
    }
  },
  data() {
    return {
      isSideShow: false,
      isSettingBox: false,
      isShowShopDiscounts: false,
      addStatus: false,
      inputType: false,
      discountsList: [],
      inputVal: '',
      showMsgBox: false,
      showCode: false,
      initQCode: ""
    }
  },
  created() {
    this.getLocalUrl();
    Bus.$on('showSide', res => {
      this.isSideShow = res
    })
  },
  methods: {
    to(route) {
      if (route.meta && route.meta.id === 13011) {
        this.isSettingBox = true
        return
      }
      if (route.meta && route.meta.id === 13014) {
        this.showCode = true;
        return
      }
      if (route.meta && route.meta.id === 13003) {
        getShopStoredSet().then(res => {
          const data = res.data
          if (!data.isShopStoredValue) {
            this.showMsgBox = true
          } else {
            this.$router.push(route.name === '交接班' ? { path: route.path, query: { id: 'me' } } : route.path)
            this.isSideShow = false
          }
        })
      } else {
        this.$router.push(route.name === '交接班' ? { path: route.path, query: { id: 'me' } } : route.path)
        this.isSideShow = false
      }
    },
    downloadQrcode: function() {
      var canvas = document.getElementById("downaloadImg").querySelector("canvas")
      var ctx = canvas.getContext("2d")
      var imgData = canvas.toDataURL("png")
      var _fixType = function(type) {
        type = type.toLowerCase().replace(/jpg/i, 'jpeg')
        var r = type.match(/png|jpeg|bmp|gif/)[0];
        return 'image/' + r
      };

      // 加工image data，替换mime type
      imgData = imgData.replace(_fixType("png"), 'image/octet-stream');

      var saveFile = function(data, filename) {
        var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
        save_link.href = data;
        save_link.download = filename;

        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        save_link.dispatchEvent(event);
      };

      // 下载后的问题名
      var filename = 'faceqrcode' + (new Date()).getTime() + '.png';
      // download
      saveFile(imgData, filename);

    },
    getLocalUrl: function() {
      this.initQCode = window.location.href.split('//')[0] + '//' + window.location.href.split('//')[1].split('/')[0] + "/m-weixin/memberface";
    },
    iknown() {
      this.showMsgBox = false
    },
    showShopDiscounts() {
      this.isShowShopDiscounts = true
      getShopDiscounts().then(res => {
        const data = res.data
        if (data.success) {
          this.discountsList = data.data
        }
      })
    },
    deleteItem(Id) {
      deleteDiscounts(Id).then(res => {
        console.log(res)
        const data = res.data
        if (data.success) {
          this.showShopDiscounts()
        }
      })
    },
    getNumber(arr, isZk) {
      let num1 = 0,
        num2 = 0
      arr.forEach(item => {
        if (item.Type === 1) num1++
          else if (item.Type === 2) num2++
      })
      return isZk ? num1 < 5 : num2 < 5
    },
    addDiscount(isType1) {
      this.addStatus = true
      this.inputType = isType1
      if (isType1) {

      }
    },
    inputValue(val) {
      if (val === 'clear') {
        this.inputVal = ''
      } else if (val === 'delete') {
        this.inputVal = this.inputVal.substring(0, this.inputVal.length - 1)
      } else {
        // if (!this.inputVal && (val === '00' || val === '.')) { // 不能00开头
        //   this.$toast('输入格式有误')
        //   return
        // }
        // if (this.inputVal[0] === '0' && this.inputVal.length === 1 && val === '0') {
        //   this.$toast('输入格式有误')
        //   return
        // }
        // if (this.inputVal.indexOf('.') >= 0 && val === '.') {
        //   this.$toast('输入格式有误')
        //   return
        // }
        // if (this.inputVal.indexOf('.') >= 0 && this.inputVal.split(".")[1].length >= 2) {
        //   this.$toast('输入格式有误')
        //   return
        // }
        // const temp = this.inputVal + val
        // if (this.inputType ? (temp * 1 > 9.9 || temp.length > 3) : temp * 1 > 10000) {
        //   this.$toast('输入格式有误')
        //   return
        // }
        this.inputVal += val
      }
    },
    submitDiscount() {
      if (!this.inputVal) {
        this.$toast('输入不能为空')
        return
      }
      if (this.inputVal[this.inputVal.length - 1] === '.' || this.inputVal * 1 === 0) {
        this.$toast('输入格式有误')
        return
      }
      const re = this.inputType ? /^(?=0\.[1-9]|[1-9]\.\d).{3}$|^([1-9])$/ : /^[1-9]{0,4}?(\.[0-9]{1,2})?$|^10000$/
      if (re.test(this.inputVal) || (!this.inputType && this.inputVal * 1 === 10000)) {
        let num = this.inputVal / 10
        if (this.inputType) {
          num = num.toFixed(2)
        }
        submitDiscount({
          type: this.inputType ? 1 : 2,
          value: this.inputType ? num : this.inputVal
        }).then(res => {
          const data = res.data
          if (data.success) {
            this.$toast('添加成功')
            this.addStatus = false
            this.inputVal = ''
            this.showShopDiscounts()
          } else {
            this.$toast(data.msg)
          }
        })
      } else {
        this.$toast('输入格式有误')
      }
    }
  },
  filters: {
    formatNumber(value, isLeftNum) {
      if (isLeftNum) return value.toString().slice(2, 3)
      else return value.toString().slice(3, 4) || 0
    }
  }
}

</script>
<style lang="scss" scoped>
.sideBar-container-mark {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
}

.hiden {
  -webkit-transform: translateX(-498px);
  -webkit-transition: all .2s;
}

.show {
  -webkit-transform: translate(0px);
  -webkit-transition: all .2s;
}

.sideBar-container-mainBox {
  width: 498px;
  height: 100%;
  background: #fff;
  position: fixed;
  top: 0;
  z-index: 1000;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  &-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 60px;
    i {
      font-size: 78px;
      line-height: 78px;
    }
    & span:nth-child(2) {
      margin-top: 20px;
      display: block;
      font-size: 16px;
      color: rgba(51, 51, 51, 1);
      font-weight: bold;
    }
    & span:nth-child(3) {
      margin-top: 15px;
      display: block;
      font-size: 16px;
      color: rgba(51, 51, 51, 1);
    }
  }
  &-goBackBox {
    padding: 24px 0 50px 29px;
    &-goBack {
      width: 35px;
      height: 35px;
      border-radius: 100%;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  &-switchBox-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 58px;
    padding-left: 28px;
    padding-right: 46px;
    &-titleBox {
      display: flex;
      align-items: center;
      span {
        font-size: 16px;
        color: rgba(51, 51, 51, 1);
        margin-left: 16px;
        font-weight: bold;
      }
    }
  }
  &-menuBox {
    padding-top: 100px;
    &-item {
      display: inline-block;
      width: calc((100% - 15px) / 3);
      text-align: center;
      padding-bottom: 62px;
      div {
        margin-top: 12px;
        font-size: 15px;
        color: rgba(153, 153, 153, 1);
      }
    }
  }
}

.sideBar-container-preferentialBox {
  position: fixed;
  background: #fff;
  top: 0;
  right: 0;
  left: 498px;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  bottom: 0;
  z-index: 1000;
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
  &-mainWrapper {
    padding-left: 73px;
    &-itemBox {
      &-header {
        display: flex;
        align-items: center;
        & div:nth-child(1) {
          width: 8px;
          height: 16px;
          background: rgba(199, 177, 135, 1);
          border-radius: 4px;
        }
        span {
          margin-left: 12px;
          font-size: 16px;
          color: rgba(51, 51, 51, 1);
          font-weight: bold;
        }
      }
      &-content {
        margin-top: 32px;
        &-item {
          text-align: center;
          position: relative;
          vertical-align: bottom;
          width: calc((100vw - 833px) / 5);
          height: calc(((100vw - 833px) / 5) * 0.8);
          @media screen and(max-width: 1440px) {
            width: calc((100vw - 833px + 140px) / 5);
            height: calc(((100vw - 833px + 140px) / 5) * 0.8);
          }
          background: rgba(0, 0, 0, 0.1);
          display: inline-block;
          img {
            position: absolute;
            right: -20px;
            top: -20px;
          }
          & span:nth-child(2) {
            font-size: 100px;
            color: #fff;
            line-height: calc(((100vw - 833px) / 5) * 0.8);
            position: relative;
            top: -8px;
            @media screen and(max-width: 1440px) {
              line-height: calc(((100vw - 833px + 140px) / 5) * 0.8);
              font-size: 60px;
            }
            font-weight: bold;
          }
          & span:nth-child(3) {
            font-size: 66px;
            line-height: calc(((100vw - 833px) / 5) * 0.8);
            position: relative;
            top: -8px;
            @media screen and(max-width: 1440px) {
              line-height: calc(((100vw - 833px + 140px) / 5) * 0.8);
              font-size: 30px;
            }
            color: #fff;
            font-weight: bold;
          }
          & span:nth-child(4) {
            font-size: 16px;
            line-height: calc(((100vw - 833px) / 5) * 0.8);
            position: relative;
            top: -8px;
            @media screen and(max-width: 1440px) {
              line-height: calc(((100vw - 833px + 140px) / 5) * 0.8);
            }
            color: #fff;
          }
        }
        &-item:nth-of-type(n+2) {
          @media screen and(max-width: 1440px) {
            margin-left: 20px;
          }
          margin-left: 50px;
        }
        &-item:last-child {
          font-size: 115px;
          text-align: center;
          color: #fff;
          line-height: calc(((100vw - 833px) / 5) * 0.8);
          @media screen and(max-width: 1440px) {
            line-height: calc(((100vw - 833px + 140px) / 5) * 0.8);
          }
        }
      }
    }
  }
}

.sideBar-container-addBox {
  position: fixed;
  background: #fff;
  top: 0;
  right: 0;
  left: 498px;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  bottom: 0;
  z-index: 1010;
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
      &::-webkit-outer-spin-button,
      &::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        margin: 0;
      }
    }
    &-keyboard {
      // display: flex;
      // align-items: center;
      margin-top: 90px;
      &-itembox {
        display: flex;
        margin-top: 3px;
        & div:not(:last-child) {
          width: 72px;
          height: 67px;
          background: rgba(240, 243, 246, 0.8);
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
          background: rgba(240, 243, 246, 0.8);
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
            background: rgba(240, 243, 246, 0.8);
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

.showCodeImg {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 99999;
}

.showCodeImg .codeBox {
  width: 720px;
  background: rgba(0, 0, 0, 0.65);
  text-align: center;
  text-align: center;
  padding: 30px;
  border-radius: 10px;
  position: absolute;
  top: 50%;
  margin: auto;
  margin-top: -218px;
  left: 0;
  right: 0;
}

.showCodeImg .codeBox .imgCodeBox {
  padding: 7px;
  border-radius: 10px;
  display: inline-block;
  background: #fff;
}

.showCodeImg * {
  vertical-align: middle;
}

.showCodeImg .codeBox p {
  font-size: 20px;
  color: #fff;
  margin-top: 25px;
}

.showCodeImg .codeBox button {
  width: 190px;
  height: 54px;
  border-radius: 25px;
  font-size: 20px;
  color: #fff;
  background: none;
  border: 2px solid #c7b187;
  margin-top: 18px;
}

</style>
