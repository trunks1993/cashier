<template>
  <div class="supplement-container">
    <div class="supplement-container-header">
      <img src="../../assets/images/vipManager/goback.png" @click="goBack">
      <span>补充会员信息</span>
    </div>
    <div class="mainBox">
      <div class="mainBox-left">
        <div class="mainBox-left-header">
          <div class="mainBox-left-header-shape"></div>
          <span>基本信息</span>
        </div>
        <div class="mainBox-left-item" v-if="supplementData.isWechatWay">
          <span>头像</span>
          <img :src="supplementData.headimgurl">
        </div>
        <div class="mainBox-left-item">
          <span>手机号</span>
          <span>{{supplementData.phone}}</span>
        </div>
        <div class="mainBox-left-item">
          <span class="realName">姓名</span>
          <el-input v-model="supplementData.realName" clearable size="mini" style="width: 130px"></el-input>
        </div>
        <div class="mainBox-left-item" v-if="supplementData.isWechatWay">
          <span>微信名</span>
          <span>{{supplementData.nickname}}</span>
        </div>
        <div class="mainBox-left-item">
          <span>性别</span>
          <div>
            <el-radio v-model="supplementData.sex" :label="1">男</el-radio>
            <el-radio v-model="supplementData.sex" :label="2">女</el-radio>
          </div>
        </div>
        <div class="mainBox-left-item">
          <span>生日日期</span>
          <el-date-picker size="mini" style="width: 130px;" v-model="supplementData.birthDay" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
      </div>
      <div class="mainBox-right">
        <div class="mainBox-right-header">
          <div class="mainBox-right-header-title">
            <div class="mainBox-right-header-title-shape"></div>
            <span>会员卡</span>
          </div>
          <div class="mainBox-right-header-add" @click="openSelDailog">
            <span>+</span>
            <span>添加</span>
          </div>
        </div>
        <div class="mainBox-right-detail">
          （默认已选择等级卡，可选择无门槛卡）
        </div>
        <div class="mainBox-right-selBox">
          <div class="mainBox-right-selBox-item2" :style="backgroundLevel">
            <div>等级卡</div>
            <div>一级卡</div>
          </div>
          <div v-for="item in selCardList" class="mainBox-right-selBox-item" :style="backgroundWmkk">
            <div>{{item.CardName}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomLine">
    </div>
    <div class="sbmBtn" @click="submitSup">
      <div class="sbmBtn-btn">确认</div>
    </div>
    <div class="supplement-container-dailog" v-if="showDailog">
      <div class="supplement-container-dailog-main">
        <div class="card">
          <div class="card-nav">
            <span>请选择</span>
            <img src="../../assets/images/vipManager/xh.png" @click="showDailog = false">
          </div>
          <div class="card-header">
            <span></span>
            <span>等级卡</span>
          </div>
          <div class="card-cardBox">
            <div class="card-cardBox-item1" v-for="(item, index) in cardList.ratingCard" v-if="item.IsJuniorCard">
              <div class="card-cardBox-item1-cardContent" :style="backgroundLevel">
                <div>等级卡</div>
                <div>{{item.CardName}}</div>
                <img src="../../assets/images/vipManager/sel.png" v-if="item.IsJuniorCard">
              </div>
              <div class="card-cardBox-item1-cardDetail">
                <div class="card-cardBox-item1-cardDetail-content" v-if="indexArr1.indexOf(index) >= 0">
                  <div class="card-cardBox-item1-cardDetail-content-item" v-if="item.DoesFreeShipping">
                    <span></span>
                    <span>享受{{item.FreeShippingMoney}}元包邮</span>
                  </div>
                  <div class="card-cardBox-item1-cardDetail-content-item" v-if="item.DoesDiscount">
                    <span></span>
                    <span>会员折扣{{item.Discount}}折</span>
                  </div>
                  <div class="card-cardBox-item1-cardDetail-content-item" v-if="item.DoesPointTimes">
                    <span></span>
                    <span>购物积分{{item.PointTimes}}倍</span>
                  </div>
                  <div class="card-cardBox-item1-cardDetail-content-item" v-if="item.DoesGivePoint">
                    <span></span>
                    <span>随卡获赠积分：{{item.GivenPoints}}分</span>
                  </div>
                  <div class="card-cardBox-item1-cardDetail-content-item" v-if="item.DoesGiveCoupon">
                    <span></span>
                    <span>随卡获赠优惠券：{{item.CouponCount}}张</span>
                  </div>
                </div>
                <div class="card-cardBox-item1-cardDetail-tools" :style="indexArr1.indexOf(index) >= 0 ? 'text-align: right;' : 'text-align: left;'">
                  <div @click="controlDetail1(index)">
                    <img src="../../assets/images/vipManager/humbag.png" v-if="indexArr1.indexOf(index) < 0">
                    <span>{{indexArr1.indexOf(index) < 0 ? '说明' : '收起'}}</span>
                    <img src="../../assets/images/vipManager/errowtop.png" v-if="indexArr1.indexOf(index) >= 0">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-header">
            <span></span>
            <span>无门槛卡</span>
          </div>
          <div class="card-cardBox">
            <div class="card-cardBox-item2" v-for="(item, index) in cardList.noThreshold">
              <div class="card-cardBox-item2-cardContent" @click="selectCard(item)" :style="backgroundWmkk">
                <div>{{item.CardName}}</div>
                <div></div>
                <img src="../../assets/images/vipManager/sel2.png" v-if="selCardListTemp.indexOf(item) >= 0">
              </div>
              <div class="card-cardBox-item2-cardDetail">
                <div class="card-cardBox-item2-cardDetail-content" v-if="indexArr2.indexOf(index) >= 0">
                  <div class="card-cardBox-item2-cardDetail-content-item" v-if="item.DoesFreeShipping">
                    <span></span>
                    <span>享受{{item.FreeShippingMoney}}元包邮</span>
                  </div>
                  <div class="card-cardBox-item2-cardDetail-content-item" v-if="item.DoesDiscount">
                    <span></span>
                    <span>会员折扣{{item.Discount}}折</span>
                  </div>
                  <div class="card-cardBox-item2-cardDetail-content-item" v-if="item.DoesPointTimes">
                    <span></span>
                    <span>购物积分{{item.PointTimes}}倍</span>
                  </div>
                  <div class="card-cardBox-item2-cardDetail-content-item" v-if="item.DoesGivePoint">
                    <span></span>
                    <span>随卡获赠积分：{{item.GivenPoints}}分</span>
                  </div>
                  <div class="card-cardBox-item2-cardDetail-content-item" v-if="item.DoesGiveCoupon">
                    <span></span>
                    <span>随卡获赠优惠券：{{item.CouponCount}}张</span>
                  </div>
                </div>
                <div class="card-cardBox-item2-cardDetail-tools" :style="indexArr2.indexOf(index) >= 0 ? 'text-align: right;' : 'text-align: left;'">
                  <div @click="controlDetail2(index)">
                    <img src="../../assets/images/vipManager/humbag.png" v-if="indexArr2.indexOf(index) < 0">
                    <span>{{indexArr2.indexOf(index) < 0 ? '说明' : '收起'}}</span>
                    <img src="../../assets/images/vipManager/errowtop.png" v-if="indexArr2.indexOf(index) >= 0">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="supplement-container-dailog-btnBox">
          <div class="cancel" @click="cancelSel">取消</div>
          <div class="sure" @click="submitSecl">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getCardList, cashierRegister } from '@/api'
export default {
  props: ['supplementData'],
  data() {
    return {
      cardList: '',
      selCardList: [],
      indexArr1: [],
      indexArr2: [],
      selCardListTemp: [],
      showDailog: false,
      backgroundLevel: {
        background: `url(${require('@/assets/images/vipManager/levelcard.png')}) no-repeat`
      },
      backgroundWmkk: {
        background: `url(${require('@/assets/images/vipManager/wumenkan.png')}) no-repeat`
      }
    }
  },
  created() {
    this.getCardList()
  },
  methods: {
    getCardList() {
      getCardList().then(res => {
        const data = res.data
        if (data.success) {
          this.cardList = data.data
        }
      })
    },
    goBack() {
      this.$emit('goBack', 3)
    },
    controlDetail1(index) {
      const i = this.indexArr1.indexOf(index)
      if (i >= 0) {
        this.indexArr1.splice(i, 1)
      } else {
        this.indexArr1.push(index)
      }
    },
    controlDetail2(index) {
      const i = this.indexArr2.indexOf(index)
      if (i >= 0) {
        this.indexArr2.splice(i, 1)
      } else {
        this.indexArr2.push(index)
      }
    },
    selectCard(card) {
      if (this.selCardListTemp.indexOf(card) >= 0) this.selCardListTemp.splice(this.selCardListTemp.indexOf(card), 1)
      else this.selCardListTemp.push(card)
    },
    submitSecl() {
      this.selCardList = this.selCardListTemp
      this.showDailog = false
    },
    cancelSel() {
      this.showDailog = false
    },
    openSelDailog() {
      this.selCardListTemp = this.selCardList
      this.showDailog = true
    },
    submitSup() {
      cashierRegister({
        phone: this.supplementData.phone,
        sex: this.supplementData.sex,
        nikename: this.supplementData.nikename,
        realname: this.supplementData.realName,
        birthday: this.supplementData.birthDay,
        cardIds: this.selCardList.map(item => {
          return item.Id
        })
      }).then(res => {
        const data = res.data
        if (data.success) {
          this.$emit('success')
        }
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
.supplement-container {
  height: 100%;
  padding: 30px;
  overflow-y: scroll;
  position: relative;
  &::-webkit-scrollbar {
    display: none;
  }
  &-header {
    position: relative;
    width: 100%;
    height: 35px;
    text-align: center;
    img {
      position: absolute;
      left: 0;
    }
    span {
      line-height: 35px;
      font-size: 18px;
      font-weight: bolder;
      color: #333333;
    }
  }
  &-dailog {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.3);
    &-main {
      position: absolute;
      top: 20px;
      bottom: 20px;
      left: 9px;
      right: 9px;
      background: #fff;
      border-radius: 4px;
      overflow-y: scroll;
    }
    &-btnBox {
      // height: 60px;
      padding: 12px 20px;
      width: 100%;
      border-top: 1px solid rgba(0, 0, 0, 0.3);
      text-align: right;
      .cancel {
        width: 114px;
        height: 40px;
        background: #fff;
        border-radius: 4px;
        border: 1px solid #C7B287;
        color: #c7b287;
        font-size: 16px;
        line-height: 40px;
        text-align: center;
        display: inline-block;
      }
      .sure {
        width: 114px;
        height: 40px;
        background: #333333;
        border-radius: 4px;
        border: 1px solid #C7B287;
        color: #c7b287;
        font-size: 16px;
        line-height: 40px;
        text-align: center;
        display: inline-block;
      }
    }
  }
}

.card {
  padding: 0 10px;
  &-nav {
    position: relative;
    text-align: center;
    padding-top: 20px;
    font-size: 16px;
    color: #333333;
    font-weight: bolder;
    img {
      position: absolute;
      right: 15px;
      top: 25px;
    }
  }
  &-header {
    margin-top: 35px;
    & span:nth-child(1) {
      width: 8px;
      height: 8px;
      border-radius: 4px;
      background: rgba(199, 177, 135, 1);
      display: inline-block;
    }
    & span:nth-child(2) {
      font-size: 14px;
      color: #333333;
      margin-left: 9px;
    }
  }
  &-cardBox {
    margin-top: 20px;
    &-item1 {
      display: inline-block;
      vertical-align: top;
      &-cardContent {
        position: relative;
        padding: 20px 23px;
        width: 272px;
        height: 146px;
        // background: url(../../assets/images/vipManager/levelcard.png) no-repeat;
        img {
          position: absolute;
          right: 10px;
          top: 6px;
        }
        & div:nth-child(1) {
          color: #fff;
          font-size: 20px;
          line-height: 20px;
        }
        & div:nth-child(2) {
          color: #fff;
          font-size: 18px;
          line-height: 18px;
          margin-top: 12px;
        }
      }
      &-cardDetail {
        padding: 0 15px 48px 15px;
        margin-top: 10px;
        &-content {
          &-item {
            & span:nth-child(1) {
              width: 6px;
              height: 6px;
              border-radius: 3px;
              background: rgba(0, 0, 0, 0.1);
              display: inline-block;
              vertical-align: middle;
            }
            & span:nth-child(2) {
              font-size: 12px;
              color: #666666;
            }
          }
        }
        &-tools {
          div {
            display: inline-block;
            font-size: 12px;
            color: #666666;
          }
        }
      }
    }
    &-item2 {
      display: inline-block;
      vertical-align: top;
      &-cardContent {
        position: relative;
        padding: 20px 23px;
        width: 272px;
        height: 146px;
        // background: url(../../assets/images/vipManager/wumenkan.png) no-repeat;
        & div:nth-child(1) {
          color: #fff;
          font-size: 20px;
          line-height: 20px;
        }
        & div:nth-child(2) {
          width: 24px;
          height: 24px;
          border-radius: 100%;
          border: 1px solid rgba(255, 255, 255, 0.5);
          position: absolute;
          top: 1px;
          right: 1px;
        }
        img {
          width: 24px;
          height: 24px;
          border-radius: 100%;
          border: 1px solid rgba(255, 255, 255, 0.5);
          position: absolute;
          top: 1px;
          right: 1px;
        }
      }
      &-cardDetail {
        padding: 0 15px 48px 15px;
        margin-top: 10px;
        &-content {
          &-item {
            & span:nth-child(1) {
              width: 6px;
              height: 6px;
              border-radius: 3px;
              background: rgba(0, 0, 0, 0.1);
              display: inline-block;
              vertical-align: middle;
            }
            & span:nth-child(2) {
              font-size: 12px;
              color: #666666;
            }
          }
        }
        &-tools {
          div {
            display: inline-block;
            font-size: 12px;
            color: #666666;
          }
        }
      }
    }
  }
}

.mainBox {
  display: flex;
  justify-content: space-between;
  margin-top: 100px;
  padding: 0 100px;
  &-left {
    width: 270px;
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
  }
  &-right {
    width: 284px;
    &-selBox {
      height: 393px;
      margin-top: 27px;
      overflow-y: scroll;
      padding-left: 10px;
      &-item {
        background: url(../../assets/images/vipManager/wumenkan.png) no-repeat;
        padding: 20px 23px;
        width: 272px;
        height: 145px;
        margin-bottom: 20px;
        & div:nth-child(1) {
          color: #fff;
          font-size: 20px;
          line-height: 20px;
        }
      }
      &-item2 {
        background: url(../../assets/images/vipManager/levelcard.png) no-repeat;
        padding: 20px 23px;
        width: 272px;
        height: 145px;
        margin-bottom: 20px;
        & div:nth-child(1) {
          color: #fff;
          font-size: 20px;
          line-height: 20px;
        }
        & div:nth-child(2) {
          color: #fff;
          font-size: 18px;
          line-height: 18px;
          margin-top: 12px;
        }
      }
    }
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      &-title {
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
      &-add {
        span {
          color: #c7b187;
          font-size: 14px;
        }
      }
    }
    &-detail {
      color: #999999;
      font-size: 12px;
      line-height: 12px;
      margin-top: 8px;
    }
  }
}

.bottomLine {
  margin-top: 25px;
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  width: 95%;
  margin: auto;
  margin-top: 25px;
}

.sbmBtn {
  margin: auto;
  margin-top: 27px;
  text-align: right;
  width: 95%;
  &-btn {
    display: inline-block;
    width: 135px;
    height: 48px;
    background: rgba(199, 178, 135, 1);
    border-radius: 4px;
    color: #fff;
    line-height: 48px;
    text-align: center;
    font-size: 16px;
  }
}

</style>
