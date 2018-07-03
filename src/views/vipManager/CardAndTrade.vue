<template>
  <div class="cardAndTrade-container">
    <div class="cardAndTrade-container-header">
      <img src="../../assets/images/vipManager/goback.png" @click="goBack">
      <span>{{cardAndTradeInfo.isCard ? '会员卡' : '优惠券'}}{{cardAndTradeInfo.data.length > 0 ? `(${cardAndTradeInfo.data.length})` : ''}}</span>
    </div>

    <div class="card" v-if="cardAndTradeInfo.isCard">
      <template v-if="hasCard(true) > 0">
        <div class="card-header">
          <span></span>
          <span>等级卡</span>
        </div>
        <div class="card-cardBox" v-for="(item, index) in cardAndTradeInfo.data">
          <div class="card-cardBox-item1" v-if="item.CardType === 1">
            <div class="card-cardBox-item1-cardContent" :style="backgroundLevel">
              <div>等级卡</div>
              <div>{{item.CardName}}</div>
            </div>
            <div class="card-cardBox-item1-cardDetail">
              <div class="card-cardBox-item1-cardDetail-content" v-if="indexArr.indexOf(index) >= 0">
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
              <div class="card-cardBox-item1-cardDetail-tools" :style="indexArr.indexOf(index) >= 0 ? 'text-align: right;' : 'text-align: left;'">
                <div @click="controlDetail(index)">
                  <img src="../../assets/images/vipManager/humbag.png" v-if="indexArr.indexOf(index) < 0">
                  <span>{{indexArr.indexOf(index) < 0 ? '说明' : '收起'}}</span>
                  <img src="../../assets/images/vipManager/errowtop.png" v-if="indexArr.indexOf(index) >= 0">
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="hasCard(false) > 0">
        <div class="card-header">
          <span></span>
          <span>无门槛卡</span>
        </div>
        <div class="card-cardBox" v-for="(item, index) in cardAndTradeInfo.data">
          <div class="card-cardBox-item2" v-if="item.CardType === 2">
            <div class="card-cardBox-item2-cardContent" :style="backgroundWmkk">
              <div>{{item.CardName}}</div>
            </div>
            <div class="card-cardBox-item2-cardDetail">
              <div class="card-cardBox-item2-cardDetail-content" v-if="indexArr.indexOf(index) >= 0">
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
              <div class="card-cardBox-item2-cardDetail-tools" :style="indexArr.indexOf(index) >= 0 ? 'text-align: right;' : 'text-align: left;'">
                <div @click="controlDetail(index)">
                  <img src="../../assets/images/vipManager/humbag.png" v-if="indexArr.indexOf(index) < 0">
                  <span>{{indexArr.indexOf(index) < 0 ? '说明' : '收起'}}</span>
                  <img src="../../assets/images/vipManager/errowtop.png" v-if="indexArr.indexOf(index) >= 0">
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <div class="trade" v-else>
      <div class="trade-itemBox" v-for="item in cardAndTradeInfo.data">
        <div class="trade-itemBox-left">
          <div class="trade-itemBox-left-price">
            <span>￥</span>
            <span>{{item.Price}}</span>
          </div>
          <span class="trade-itemBox-left-shopName">{{item.ShopName}}</span>
        </div>
        <div class="trade-itemBox-right">
          <div>{{item.activityName}}</div>
          <div>有效期至{{item.EndTimeText}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['cardAndTradeInfo'],
  data() {
    return {
      indexArr: [],
      backgroundLevel: {
        background: `url(${require('@/assets/images/vipManager/levelcard.png')}) no-repeat`
      },
      backgroundWmkk: {
        background: `url(${require('@/assets/images/vipManager/wumenkan.png')}) no-repeat`
      }
    }
  },
  methods: {
    goBack() {
      this.$emit('goBack', 1)
    },
    hasCard(flag) {
      let a = 0,
        b = 0
      for (let i = 0; i < this.cardAndTradeInfo.data.length; i++) {
        if (this.cardAndTradeInfo.data[i].CardType === 2) b++
          else a++
      }
      return flag ? a : b
    },
    controlDetail(index) {
      const i = this.indexArr.indexOf(index)
      if (i >= 0) {
        this.indexArr.splice(i, 1)
      } else {
        this.indexArr.push(index)
      }
    }
  }
}

</script>
<style lang="scss" scoped>
.cardAndTrade-container {
  height: 100%;
  padding: 30px;
  overflow-y: scroll;
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
}

.card {
  margin-top: 50px;
  padding: 0 10px;
  &-header {
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
      &-cardContent {
        padding: 20px 23px;
        width: 277px;
        height: 146px;
        // background: url(../../assets/images/vipManager/levelcard.png) no-repeat;
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
      &-cardContent {
        padding: 20px 23px;
        width: 277px;
        height: 146px;
        // background: url(../../assets/images/vipManager/wumenkan.png) no-repeat;
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
  }
}

.trade {
  margin-top: 50px;
  &-itemBox {
    display: inline-block;
    align-items: center;
    background: #fff;
    border-radius:12px;
    padding: 22px 18px 22px 25px;
    margin-right: 24px;
    margin-bottom: 24px;
    &-left {
      display: inline-block;
      &-price {
        & span:nth-child(1) {
          font-size: 16px;
          line-height: 16px;
          color: #E00000;
        }
        & span:nth-child(2) {
          font-size: 24px;
          line-height: 24px;
          color: #E00000;
        }
      }
      &-shopName {
        color: #E00000;
        font-size:14px;
        line-height: 14px;
      }
    }
    &-right {
      display: inline-block;
      margin-left: 30px;
      & div:nth-child(1) {
        font-size: 14px;
        line-height: 14px;
        color: #666666;
      }
      & div:nth-child(2) {
        font-size: 12px;
        line-height: 12px;
        color: #666666;
        margin-top: 12px;
      }
    }
  }
}

</style>
