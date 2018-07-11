<template>
  <div class="vipInfo">
    <div class="vipInfo-header">
      <span>{{showType === 0?'':showType===1?'会员卡':'优惠券'}}</span>
      <img :src="xhome" @click="close">
    </div>
    <div class="vipInfo-user" v-if="showType === 0">
      <div class="vipInfo-user-name">{{vipInfo.cashierUserMember.userName}}</div>
      <div class="vipInfo-user-bottom">
        <div class="vipInfo-user-bottom-left">
          <div class="vipInfo-user-bottom-left-tab">{{vipInfo.cashierUserMember.gradeName}}</div>
          <div class="vipInfo-user-bottom-left-phone">{{vipInfo.cashierUserMember.cellPhone}}</div>
        </div>
        <div class="vipInfo-user-bottom-line"></div>
        <div class="vipInfo-user-bottom-right">
          <div class="vipInfo-user-bottom-right-capital">
            <span>可用预存款：</span>
            <span>￥{{vipInfo.capital}}</span>
          </div>
          <div class="vipInfo-user-bottom-right-integral">
            <span>可用积分：</span>
            <span>{{vipInfo.integral}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="card-header" v-if="vipInfo.memCard.length && (showType === 0 || showType === 1)">
      <span></span>
      <span>会员卡({{vipInfo.memCard.length }})</span>
    </div>
    <div class="card-cardBox" v-if="showType === 0 || showType === 1">
      <div class="card-cardBox-item1" v-for="(item, index) in vipInfo.memCard" v-if="item.cardType === 1">
        <div class="card-cardBox-item1-cardContent" :style="backgroundLevel" @click="selectCard(item)">
          <div>等级卡</div>
          <div>{{item.cardName}}</div>
          <div class="card-cardBox-item1-cardContent-circle"></div>
          <img src="../../assets/images/vipManager/sel2.png" v-if="item.id === selCard.id">
        </div>
        <div class="card-cardBox-item1-cardDetail">
          <div class="card-cardBox-item1-cardDetail-content" v-if="indexArr1.indexOf(index) >= 0">
            <div class="card-cardBox-item1-cardDetail-content-item" v-if="item.DoesFreeShipping">
              <span></span>
              <span>享受{{item.freeShippingMoney}}元包邮</span>
            </div>
            <div class="card-cardBox-item1-cardDetail-content-item" v-if="item.doesFreeShipping">
              <span></span>
              <span>会员折扣{{item.discount}}折</span>
            </div>
            <div class="card-cardBox-item1-cardDetail-content-item" v-if="item.doesPointTimes">
              <span></span>
              <span>购物积分{{item.pointTimes}}倍</span>
            </div>
            <div class="card-cardBox-item1-cardDetail-content-item" v-if="item.doesGivePoint">
              <span></span>
              <span>随卡获赠积分：{{item.givenPoints}}分</span>
            </div>
            <div class="card-cardBox-item1-cardDetail-content-item" v-if="item.doesGiveCoupon">
              <span></span>
              <span>随卡获赠优惠券：{{item.couponCount}}张</span>
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
      <div class="card-cardBox-item2" v-for="(item, index) in vipInfo.memCard" v-if="item.cardType === 2">
        <div class="card-cardBox-item2-cardContent" :style="backgroundWmkk" @click="selectCard(item)">
          <div>{{item.cardName}}</div>
          <div class="card-cardBox-item2-cardContent-circle"></div>
          <img src="../../assets/images/vipManager/sel2.png" v-if="item.id === selCard.id">
        </div>
        <div class="card-cardBox-item2-cardDetail">
          <div class="card-cardBox-item2-cardDetail-content" v-if="indexArr1.indexOf(index) >= 0">
            <div class="card-cardBox-item2-cardDetail-content-item" v-if="item.DoesFreeShipping">
              <span></span>
              <span>享受{{item.freeShippingMoney}}元包邮</span>
            </div>
            <div class="card-cardBox-item2-cardDetail-content-item" v-if="item.doesFreeShipping">
              <span></span>
              <span>会员折扣{{item.discount}}折</span>
            </div>
            <div class="card-cardBox-item2-cardDetail-content-item" v-if="item.doesPointTimes">
              <span></span>
              <span>购物积分{{item.pointTimes}}倍</span>
            </div>
            <div class="card-cardBox-item2-cardDetail-content-item" v-if="item.doesGivePoint">
              <span></span>
              <span>随卡获赠积分：{{item.givenPoints}}分</span>
            </div>
            <div class="card-cardBox-item2-cardDetail-content-item" v-if="item.doesGiveCoupon">
              <span></span>
              <span>随卡获赠优惠券：{{item.couponCount}}张</span>
            </div>
          </div>
          <div class="card-cardBox-item2-cardDetail-tools" :style="indexArr1.indexOf(index) >= 0 ? 'text-align: right;' : 'text-align: left;'">
            <div @click="controlDetail1(index)">
              <img src="../../assets/images/vipManager/humbag.png" v-if="indexArr1.indexOf(index) < 0">
              <span>{{indexArr1.indexOf(index) < 0 ? '说明' : '收起'}}</span>
              <img src="../../assets/images/vipManager/errowtop.png" v-if="indexArr1.indexOf(index) >= 0">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-header" v-if="vipInfo.coupons.length && (showType === 0 || showType === 2)">
      <span></span>
      <span>优惠券({{vipInfo.coupons.length }})</span>
    </div>
    <div class="trade" v-if="showType === 0 || showType === 2">
      <template v-if="vipInfo.coupons.length > 0">
        <div class="trade-itemBox" v-for="item in vipInfo.coupons" @click="selectCoupon(item)">
          <img src="../../assets/images/vipManager/sel3.png" v-if="item.activityId === selCoupon.activityId">
          <div class="trade-itemBox-left">
            <div class="trade-itemBox-left-price">
              <span>￥</span>
              <span>{{item.price}}</span>
            </div>
            <span class="trade-itemBox-left-shopName">{{item.shopName}}</span>
          </div>
          <div class="trade-itemBox-right">
            <div>(共{{item.count}}张)</div>
            <div>{{item.activityName}}</div>
            <div>有效期至{{item.endTimeText}}</div>
          </div>
        </div>
      </template>
      <div v-if="showType === 2 && vipInfo.coupons.length === 0" style="text-align: center;">
        <div>
          <img :src="noTick">
        </div>
        <img :src="zwyh" style="margin-top: 40px;">
      </div>
    </div>
  </div>
</template>
<script>
import xhome from '@/assets/images/vipManager/xhome.png'
import noTick from '@/assets/images/vipManager/noTick.png'
import zwyh from '@/assets/images/vipManager/zwyh.png'

import Bus from '@/utils/bus'
import { mapGetters } from 'vuex'

export default {
  props: ['showType'],
  data() {
    return {
      // 图片
      xhome,
      noTick,
      zwyh,
      backgroundLevel: {
        background: `url(${require('@/assets/images/vipManager/levelcard.png')}) no-repeat`
      },
      backgroundWmkk: {
        background: `url(${require('@/assets/images/vipManager/wumenkan.png')}) no-repeat`
      },
      indexArr1: []
    }
  },
  computed: {
    ...mapGetters([
      'vipInfo',
      'selCard',
      'selCoupon'
    ])
  },
  mounted() {
    // Bus.$on('setSelCard', res => {
    //   this.selCard = res
    // })
    // Bus.$on('setSelCoupon', res => {
    //   this.selCoupon = res
    // })
  },
  methods: {
    close() {
      this.$emit('close')
    },
    controlDetail1(index) {
      const i = this.indexArr1.indexOf(index)
      if (i >= 0) {
        this.indexArr1.splice(i, 1)
      } else {
        this.indexArr1.push(index)
      }
    },
    selectCard(card) {
      if (this.selCard.id === card.id) this.$store.dispatch('SetSelCard', '')
      else this.$store.dispatch('SetSelCard', card)
      // Bus.$emit('cardDiscount', this.selCard)
    },
    selectCoupon(card) {
      if (this.selCoupon.activityId === card.activityId) this.$store.dispatch('SetSelCoupon', '')
      else this.$store.dispatch('SetSelCoupon', card)
    }
  }
}

</script>
<style lang="scss" scoped>
.vipInfo {
  width: 64%;
  height: 100%;
  padding: 35px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  &-header {
    text-align: center;
    font-size: 18px;
    font-weight: bolder;
    position: relative;
    height: 35px;
    line-height: 35px;
    img {
      position: absolute;
      right: 0;
    }
  }
  &-user {
    width: 440px;
    height: 125px;
    border: 10px solid rgba(0, 0, 0, 0.1);
    padding: 20px 0 20px 48px;
    &-name {
      font-size: 20px;
      line-height: 20px;
      font-weight: bolder;
    }
    &-bottom {
      display: flex;
      align-items: center;
      margin-top: 5px;
      &-left {
        &-tab {
          width: 66px;
          height: 17px;
          border: 1px solid rgba(199, 177, 135, 1);
          border-radius: 9px;
          font-size: 12px;
          line-height: 17px;
          text-align: center;
          color: #C7B187;
        }
        &-phone {
          font-size: 16px;
          line-height: 16px;
          color: #333333;
          margin-top: 10px;
        }
      }
      &-line {
        width: 1px;
        height: 40px;
        background: rgba(199, 177, 135, 1);
        margin-left: 30px;
      }
      &-right {
        margin-left: 20px;
        width: 100%;
        &-capital {
          color: #666666;
          font-size: 16px;
          line-height: 16px;
          & span:nth-child(2) {
            color: #E00000;
          }
        }
        &-integral {
          color: #666666;
          font-size: 16px;
          line-height: 16px;
          margin-top: 10px;
          & span:nth-child(2) {
            color: #E00000;
          }
        }
      }
    }
  }
}

.card-header {
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

.card-cardBox {
  margin-top: 20px;
  &-item1 {
    display: inline-block;
    vertical-align: top;
    margin-right: 30px;
    &-cardContent {
      position: relative;
      padding: 20px 23px;
      width: 272px;
      height: 146px;
      background-size: 100% 100%!important;
      @media screen and(max-width: 1440px) {
        width: 230px;
        height: 130px;
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
      &-circle {
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
  &-item2 {
    display: inline-block;
    vertical-align: top;
    margin-right: 30px;
    &-cardContent {
      position: relative;
      padding: 20px 23px;
      width: 272px;
      height: 146px;
      background-size: 100% 100%!important;
      @media screen and(max-width: 1440px) {
        width: 230px;
        height: 130px;
      }
      & div:nth-child(1) {
        color: #fff;
        font-size: 20px;
        line-height: 20px;
      }
      &-circle {
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

.trade {
  margin-top: 50px;
  &-itemBox {
    display: inline-block;
    align-items: center;
    background: #fff;
    border-radius: 12px;
    padding: 22px 18px 22px 25px;
    margin-right: 24px;
    margin-bottom: 24px;
    position: relative;
    img {
      position: absolute;
      right: 2px;
      top: 2px;
    }
    &-left {
      display: inline-block;
      vertical-align: super;
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
          font-weight: bolder;
        }
      }
      &-shopName {
        color: #E00000;
        font-size: 14px;
        line-height: 14px;
      }
    }
    &-right {
      display: inline-block;
      margin-left: 30px;
      & div:nth-child(1) {
        font-size: 14px;
        line-height: 14px;
        color: #c7b287;
      }
      & div:nth-child(2) {
        font-size: 14px;
        line-height: 14px;
        color: #666666;
        margin-top: 10px;
      }
      & div:nth-child(3) {
        font-size: 12px;
        line-height: 12px;
        color: #666666;
        margin-top: 10px;
      }
    }
  }
}

</style>
