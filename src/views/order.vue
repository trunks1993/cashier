<template>
  <div class="main-container">
    <div class="orderInfo">
      <div class="orderInfo-header" @click="getGuide">
        <div class="orderInfo-header-left">
          <img src="../assets/images/daogou.png">
          <span>导购</span>
        </div>
        <span>{{focusGuide.name || '暂不关联'}} <i class="iconfont icon-jiantou" style="color: #999;font-size: 12px;"></i></span>
      </div>
      <div class="orderInfo-orderDetail" @click="showDetail">
        <div>
          <div class="orderInfo-orderDetail-title">订单详情</div>
          <div style="margin-top: 12px;">
            <span class="orderInfo-orderDetail-count">合计</span>
            <span class="orderInfo-orderDetail-cash">{{totalAll.moneyTotal | rmb}}</span>
          </div>
        </div>
        <div>
          <i class="iconfont icon-jiantou" style="color: #999;font-size: 12px;"></i>
        </div>
      </div>
      <div class="orderInfo-center">
        <div>
          <div>
            {{orderIntefral}}积分<span>抵扣{{integral | rmb}}</span>
          </div>
          <mu-switch v-model="isIntegral" class="yswitch" />
        </div>
        <div class="orderInfo-center-item" v-show="totalAll.coupon!=0">
          <div>优惠券</div>
          <span>{{totalAll.coupon | frmb}}</span>
        </div>
        <div class="orderInfo-center-item" v-show="totalAll.activities!=0">
          <div>活动优惠</div>
          <span>{{totalAll.activities | frmb}}</span>
        </div>
        <div class="orderInfo-center-item" v-if="selCard">
          <div>会员卡</div>
          <span style="font-weight: bolder;">{{selCard.discount}}折</span>
        </div>
        <div class="orderInfo-center-item" v-if="this.$store.getters.userInfo.openDiscounts">
          <div>{{!discountObj? '整单优惠' : discountObj.Type === 1 ? '整单折扣' : '整单减价'}}</div>
          <span style="font-weight: bolder;" v-if="discountObj">{{discountObj.Type === 1 ? (discountObj.Value * 10).toFixed(1) + `折(-￥${fullOrderActivit})` : '-'+ discountObj.Value +'元'}}</span>
          <span v-else>无</span>
        </div>
        <div class="orderInfo-center-line"></div>
        <div class="orderInfo-center-totalbox">
          <div>总金额</div>
          <span style="font-weight: bolder;">{{startMoney | rmb}}</span>
        </div>
      </div>
      <div class="orderInfo-peopleInfo">
        <div class="orderInfo-peopleInfo-title">会员信息</div>
        <div class="orderInfo-peopleInfo-item">
          <div>姓名</div>
          <div>{{orderModel.memberName || ''}}</div>
        </div>
        <div class="orderInfo-peopleInfo-item">
          <div>手机号码</div>
          <div>{{orderModel.memberCellPhone || '未绑定'}}</div>
        </div>
        <div class="orderInfo-peopleInfo-item">
          <div>预存款余额</div>
          <div>{{orderModel.capital | rmb}}</div>
        </div>
        <div class="orderInfo-peopleInfo-item">
          <div>剩余积分</div>
          <div>{{orderModel.orderIntegralExchange.userIntegral || '0'}}</div>
        </div>
      </div>
    </div>
    <div class="right order">
      <div class="right_cont">
        <div class="pay" v-show="!isShowGuide&&!isShowDetail">
          <div class="tab">
            <ul id="payCheckList" :class="payClass">
              <li :class="{active:payType=='xj'}" v-if="orderModel.offlinePayEnable">
                <mu-raised-button class="iconfont xj" label="现金" @click="payType='xj'" />
              </li>
              <li :class="{active:payType=='wx'}" v-if="orderModel.supportWechatScan">
                <mu-raised-button class="iconfont wx" label="微信" @click="payType='wx'" />
              </li>
              <li :class="{active:payType=='zfb'}" v-if="orderModel.supportAlipayScan">
                <mu-raised-button class="iconfont zfb" label="支付宝" @click="payType='zfb'" />
              </li>
            </ul>
          </div>
          <div class="pay_cont">
            <div class="pay_row">
              <div class="r-left">
                <i class="iconfont icon-yingshou"></i>
                <span>应收</span>
              </div>
              <div class="r-middle">
                <p>{{this.startMoney | rmb}}</p>
              </div>
            </div>
            <div class="pay_row" v-if="orderModel.openOfflineDepositPay&&maxCapital>0">
              <div class="r-left">
                <i class="iconfont icon-yucunkuan"></i> 预存款
              </div>
              <div class="r-middle">
                <div class="inputBox">
                  <label for="yck">￥</label>
                  <input type="text" id="yck" ref="capitalVal" @input="capitalInput" :value="capital">
                  <em>最大金额{{maxCapital}}</em>
                </div>
              </div>
            </div>
            <div class="pay_row" v-if="payType=='xj'">
              <div class="r-left">
                <i class="iconfont icon-xianjinshuru"></i> 现金
              </div>
              <div class="r-middle">
                <div class="inputBox">
                  <label for="xj">￥</label>
                  <input type="text" id="xj" style="width:180px;" ref="cashVal" @input="cashInput" :value="cash">
                  <em style="width:225px;float:right;margin-right:20px;">{{realCash}}</em>
                </div>
              </div>
            </div>
            <div class="pay_row" v-if="payType!='xj'">
              <div class="r-left">
                <i class="iconfont icon-shishou"></i> 实收
              </div>
              <div class="r-middle">
                <p>
                  {{netReceipts | rmb}}
                  <span class="removeSmallChange" v-show='removeSmallChange>0'>(抹零:{{removeSmallChange}})</span>
                </p>
              </div>
            </div>
            <div class="pay_row" v-if="payType=='xj'">
              <div class="r-left">
                <i class="iconfont icon-shishou"></i> 找零
              </div>
              <div class="r-middle">
                <p>
                  <!-- {{math(cash,math(startMoney,capital)) | rmb}} -->
                  {{giveChange | rmb}}
                  <!-- <span class="removeSmallChange" v-show='removeSmallChange>0'>(抹零:{{removeSmallChange}})</span> -->
                </p>
              </div>
            </div>
            <div>
              <mu-raised-button label="确认收款" :class="{disabled:payType=='xj'&&giveChange<0}" class="submitOrder" @click="toSub(payType=='xj'&&giveChange<0)" fullWidth/>
            </div>
          </div>
        </div>
        <div class="pay_header" v-show="isShowGuide||isShowDetail"> <i class="iconfont icon-guanbi" @click="isShowGuide=isShowDetail=false"></i> {{headerTitle}}</div>
        <div class="pay_guide" v-show="isShowGuide">
          <ul>
            <li v-for='item in guideList' :class="{active:focusGuide.id==item.id}">
              <mu-raised-button @click="changeGuide(item.id,item.realName)" :label="item.realName" />
            </li>
          </ul>
        </div>
        <div class="pro_detail" v-show="isShowDetail">
          <div class="detail_in">
            <div class="activities" v-if="activitiesNofisrt.length>0">
              <ul>
                <li v-for="(item,i) in activitiesNofisrt" :class="{border:((i+1)/3<=1)&&activitiesNofisrt.length>3}">
                  <div v-if="item.activeType=='Rebate'">
                    <h2>{{item.memberCards[0].cardName}}</h2>
                    <p>
                      <span v-if="item.memberCards[0].doesDiscount">{{item.memberCards[0].discount}}折</span>
                      <span v-if="item.memberCards[0].doesPointTimes">{{item.memberCards[0].pointTimes}}倍积分</span>
                    </p>
                  </div>
                  <div v-else>
                    <h2>{{item.activityName}}</h2>
                    <p v-if="item.activeType=='gift'">{{item.discountAmount}}</p>
                    <p v-else>-￥{{item.discountAmount}}</p>
                  </div>
                </li>
                <li v-for="n in activitiesNofisrt.length%3==0?0:3-activitiesNofisrt.length%3"></li>
              </ul>
            </div>
            <div class="pro_list">
              <h2>商品详情 <em>{{totalAll.moneyTotal | rmb}}</em> </h2>
              <ul>
                <li v-for="item in productList">
                  <img :src="item.imagePath" :onerror="errorImg">
                  <div>
                    <h3>{{item.productName}}</h3>
                    <p><span v-for="itemin in item.specifications">{{itemin}};</span></p>
                    <h4>{{item.salePrice | rmb}}<span v-if="item.measureUnit&&item.measureUnit!=''">/{{item.measureUnit}}</span> <i>x{{item.buyNum}}</i></h4>
                  </div>
                </li>
              </ul>
              <div class="gift" v-for="item in gift">
                {{item.giftName}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="loading" v-show="loading">
      <div class="spinner">
        <div class="double-bounce1"></div>
        <div class="double-bounce2"></div>
      </div>
    </div>
    <div class="payScanMask" @click="qrfocus" v-show="scan">
      <div class="scan">
        <i class="iconfont icon-guanbi" @click="scan = false" style="position: absolute;top: 6px;right: 10px;"></i>
        <span>{{payType=="zfb"?"支付宝":"微信"}}扫一扫</span>
        <div :class="{dong:isDong}"></div>
        <input type="text" id="payInput" @focus="addDong(true)" @blur="addDong(false)" v-model="payCode" @keyup.enter="subOrder">
        <p>请用扫码枪扫描顾客付款二维码</p>
      </div>
    </div>
  </div>
</template>
<script>
import { sendTosecondaryDisplay } from '@/public/sendToSecondaryDisplay.js';
import { orderSubmitByCart, getShopSales, submitOrderAndPay } from '@/api'
import { mapGetters } from 'vuex'

export default {
  name: 'order',
  data() {
    return {
      discountObj: '',
      isIntegral: false,
      isShowGuide: false,
      isShowDetail: false,
      headerTitle: '详情',
      guideList: '',
      guideList: [],
      payClass: '',
      test: [1, 2, 3, 4, 5, 6],
      focusGuide: { name: '', id: 0 },
      productList: [],
      totalAll: { numtotal: 0, moneyTotal: 0, activities: 0, coupon: 0 },
      integral: 0,
      orderIntefral: 0,
      startMoney: 0, //除开预存款的总金额
      activities: null, //优惠活动
      activitiesNofisrt: [],
      removeSmallChange: 0, //抹零
      capital: 0, //预存款
      cash: 0, //现金
      orderModel: subdata.orderModel,
      maxCapital: 0,
      payType: "",
      gift: [],
      loading: false,
      scan: false,
      scanInput: false,
      payCode: "",
      isDong: false,
      giveChange: 0, //找零
      netReceipts: 0, //实收
      maxRealCash: 0,
      isFirst: true,
      fullOrderActivit: 0,
      errorImg: 'this.src="' + require('../assets/images/imgerror.png') + '"'
    }
  },
  created() {
    this.discountObj = this.$route.query.item
    this.$emit("changeTitle", "确认订单");
    this.$emit("isBack", true);
    this.render();
    this.getPayLength();
    var self = this;
    // document.body.addEventListener("keyup", this.bodyKeyUp, false);
  },
  computed: {
    ...mapGetters([
      'selCard'
    ]),
    realCash() {
      var returnStr = "";
      if (subdata.orderModel.removeSmallChange == 2) {
        this.maxRealCash = this.math(this.startMoney, this.capital).toFixed(1);
        returnStr = "四舍五入后应收现金" + this.math(this.startMoney, this.capital).toFixed(1);
      } else
      if (subdata.orderModel.removeSmallChange == 1) {
        var rm = this.startMoney - this.capital;
        var RemoveSmall = this.math(rm, (Math.floor(rm * 10) / 10)).toFixed(2);
        RemoveSmall = RemoveSmall >= 0.1 ? 0 : RemoveSmall;
        this.maxRealCash = this.math(this.math(this.startMoney, this.capital), RemoveSmall).toFixed(1);
        returnStr = "抹零后应收现金" + this.maxRealCash;
      } else {
        this.maxRealCash = this.math(this.startMoney, this.capital).toFixed(2);
        returnStr = "应收现金" + this.maxRealCash;
      }
      this.cash = this.maxRealCash;
      return returnStr;
    },
    toSecondSrceen() {
      const { cash, capital, isIntegral, payType } = this
      var endMoney = this.payType == "xj" ? (this.capital * 100 + this.cash * 100) / 100 : this.startMoney;
      return {
        integral: this.integral,
        startMoney: this.startMoney.toFixed(2),
        activities: ((this.totalAll.moneyTotal) * 1 - (this.startMoney) * 1 - (this.integral) * 1).toFixed(2),
        giveChange: this.payType == "xj" ? this.giveChange : 0,
        endMoney: endMoney.toFixed(2)
      }
    }
  },
  methods: {
    bodyKeyUp(e) {
      if (e.keyCode == 32) {
        this.subOrder();
      }
      if (e.keyCode == 27) {
        this.scan = false;
        document.getElementById('payInput').blur();
      }
    },
    updataPage: function() {
      var self = this;
      self.loading = true
      orderSubmitByCart(goOrderData).then(function(response) {
        if (response.data.success) {
          subdata = response.data;
          self.render()
          self.loading = false;
        } else {
          self.$toast(response.data.msg)
          self.loading = false;
        }
      })
    },
    render: function() {
      this.activitiesNofisrt = [];
      this.gift = [];
      this.productList = subdata.orderModel.orderProductItems.items;
      this.activities = subdata.activities;
      if (this.payType == "") {
        if (subdata.orderModel.offlinePayEnable) {
          this.payType = 'xj';
        } else {
          if (subdata.orderModel.supportWechatScan) {
            this.payType = 'wx';
          } else {
            this.payType = 'zfb';
          }
        }
      }
      var numtotal = 0,
        moneyTotal = this.orderModel.orderProductItems.productsTotalAmount;
      for (var i = 0; i < this.productList.length; i++) {
        numtotal = parseFloat((this.productList[i].buyNum + numtotal).toFixed(2));
      }
      var activities = 0,
        coupon = 0,
        startMoney = 0,
        integral = 0;
      for (var j = 0; j < this.activities.length; j++) {
        if (this.activities[j].activeType != "FixedPrice") {
          if (this.activities[j].activeType != "FullDelivery" || (this.activities[j].activeType == "FullDelivery" && this.activities[j].discountAmount > 0)) {
            if (this.activities[j].discountAmount > 0) {
              this.activitiesNofisrt.push(this.activities[j]);
            }
          }
        }
        if (this.activities[j].activeType != "Rebate" && this.activities[j].activeType != "PlatformCoupon" && this.activities[j].activeType != "ShopCoupon") {
          activities += this.activities[j].discountAmount;
        }
        if (this.activities[j].activeType == "Rebate") {
           this.activitiesNofisrt.push(this.activities[j]);
        }
        if (this.activities[j].activeType == "PlatformCoupon" || this.activities[j].activeType == "ShopCoupon") {
           if(this.activities[j].selected){
					     coupon = this.activities[j].discountAmount;
					 } 
        }
        if (this.activities[j].activeType == "FullDelivery" && this.activities[j].gifts.length > 0) {
          for (var n = 0; n < this.activities[j].gifts.length; n++) {
            if (this.activities[j].gifts[n].stock > 0) {
              this.gift.push(this.activities[j].gifts[n]);
              this.gift[this.gift.length - 1].activityId = this.activities[j].activityId;
              this.gift[this.gift.length - 1].shopId = this.activities[j].shopId;
              this.activitiesNofisrt.push({ activeType: "gift", activityName: "满" + this.activities[j].quota + "元送赠品", discountAmount: "赠品价值￥" + this.activities[j].gifts[n].price });
            }
          }
          numtotal += this.gift.length;
        }
      }

      this.totalAll.coupon = coupon; //优惠券金额
      this.totalAll.activities = activities; // 优惠金额
      this.totalAll.numtotal = numtotal; //商品总数
      this.totalAll.moneyTotal = moneyTotal.toFixed(2); //商品总金额
      startMoney = moneyTotal - coupon - activities;
      startMoney = parseFloat(startMoney.toFixed(2));
      if (startMoney < 0) { startMoney = 0 }
      var prevMoney = startMoney;

      //整单优惠 
      if (this.discountObj) {
        startMoney = this.discountObj.Type === 1 ? (startMoney * this.discountObj.Value) : (startMoney - this.discountObj.Value)
      }
      if (startMoney < 0) { startMoney = 0 }
      this.fullOrderActivit = (prevMoney - startMoney).toFixed(2);

      //积分
      this.setIntegral(subdata.orderModel.integralChangeRule, subdata.orderModel.orderIntegralExchange, startMoney); // 可用积分
      if (this.isIntegral) {
        this.startMoney = this.math(startMoney, this.integral);
      } else {
        this.startMoney = startMoney;
      }


      if (subdata.orderModel.openOfflineDepositPay) {
        if (subdata.orderModel.capital > 0) {
          if (subdata.orderModel.capital > this.startMoney) {
            this.capital = this.startMoney;
          } else {
            this.capital = subdata.orderModel.capital;
          }
        }
        if(this.capital) this.capital = this.capital.toFixed(2);
        this.maxCapital = this.capital;
      }
      this.priceCalculation();

    },
    getGuide: function() {
      this.isShowGuide = !this.isShowGuide;
      this.isShowDetail = false;
      var self = this;
      if (this.isShowGuide) {
        this.headerTitle = '导购'
        getShopSales().then(function(response) {
          self.guideList = response.data.rows;
        })
      }
    },
    changeGuide: function(id, name) {
      if (this.focusGuide.id == id) {
        this.focusGuide.id = 0;
        this.focusGuide.name = '';
      } else {
        this.focusGuide.id = id;
        this.focusGuide.name = name;
      }
      this.isShowGuide = false;
    },
    showDetail: function() {
      this.isShowDetail = !this.isShowDetail;
      this.isShowGuide = false;
      this.headerTitle = '详情';
    },
    getPayLength: function() {
      var l = 0;
      if (this.orderModel.offlinePayEnable) l++;
      if (this.orderModel.supportAlipayScan) l++;
      if (this.orderModel.supportWechatScan) l++;
      if (l == 1) this.payClass = "ty1";
      if (l == 2) this.payClass = "ty2";
      if (l == 3) this.payClass = "ty3";
    },
    setIntegral: function(integralChangeRule, orderIntegralExchange, realMoney) {
      var intRule = integralChangeRule.integralPerMoney;
      if (intRule > 0) {
        var canuseint = orderIntegralExchange.userIntegral; //会员可用积分数
        //最多可使用积分抵用金额
        var tmpNum = (realMoney * integralChangeRule.deductionLimit) / 100;
        //订单最多可使用积分
        var orderIntefral = parseInt(tmpNum * intRule);
        if (canuseint < orderIntefral) {
          orderIntefral = canuseint;
        }
        this.orderIntefral = orderIntefral;
        tmpNum = orderIntefral / intRule;
        this.integral = tmpNum;
        if (this.integral > 0 && this.isIntegral)
          this.activitiesNofisrt.push({ activityName: orderIntefral + "积分抵扣", discountAmount: this.integral });
      } else {
        this.integral = 0;
      }
    },
    realMoney: function() {
      return "￥" + (this.startMoney - this.capital).toFixed(2).toString();
    },
    qrfocus: function() {
      setTimeout(function() {
        document.getElementById('payInput').focus();
      }, 100)
    },
    toSub: function(isTo) {
      if (isTo) {
        return;
      }
      if (this.payType == "xj" || this.netReceipts == 0) {
        this.subOrder();
      } else {
        this.scan = true;
        setTimeout(function() {
          document.getElementById('payInput').focus();
        }, 100)
      }
    },
    addDong: function(isd) {
      if (isd) {
        this.isDong = true;
      } else {
        this.isDong = false;
      }
    },
    subOrder: function() {
      payTypeList = [];
      this.scan = false;
      if (this.loading) {
        return;
      }
      var upData = {
        orderInfo: null,
      }
      if (this.capital > 0) {
        payTypeList.push({ 'type': '预存款', 'money': this.capital });
      }
      if (this.payType == "xj" || this.netReceipts == 0) {
        upData["offlinePayModel"] = {
          OrderIds: subdata.orderModel.orderId,
          OfflinePayType: 0,
          Remark: "收银"
        }

        if (this.cash > 0) {
          payTypeList.push({ 'type': '现金', 'money': this.math(this.cash, this.giveChange) });
        }
      } else {
        payTypeList.push({ 'type': this.payType == "wx" ? "微信" : "支付宝", 'money': this.netReceipts });
        upData["scanPay"] = {
          BarOrQRCode: this.payCode,
          OrderIds: subdata.orderModel.orderId,
          PluginId: this.payType == "zfb" ? 'Himall.Plugin.Payment.Alipay_Scan' : 'Himall.Plugin.Payment.WeiXinPay_Scan'
        }
      }
      if (this.payType == "xj") {
        var webTotalAmount = this.maxRealCash;
      } else {
        var webTotalAmount = this.math(this.startMoney, this.capital);
      }
      // console.log(webTotalAmount.toFixed(2));
      var orderInfo = {
        OrderId: subdata.orderModel.orderId,
        UseCapital: this.capital,
        integral: 0,
        userId: userId,
        ServiceSalesId: this.focusGuide.id,
        webTotalAmount: webTotalAmount,
        orderProducts: [],
        SelectedActivity: [],
        DiscountsType: this.discountObj.Type,
        Value: this.discountObj.Value
      }
      if (this.isIntegral) {
        orderInfo.integral = this.orderIntefral;
      }
      for (var i = 0; i < this.productList.length; i++) {
        orderInfo.orderProducts.push({
          ShopId: this.productList[i].shopID,
          ProudctId: this.productList[i].productID,
          BuyNum: this.productList[i].buyNum,
          SkuId: this.productList[i].skuID,
          Identity: this.productList[i].identity,
          DeliveryType: 1,
          ShopSkuId: this.productList[i].shopSkuID,
          ActivityMarker: ""
        });
      }
      for (var m = 0; m < this.activities.length; m++) {
        if (this.activities[m].activityId) {
          if (this.activities[m].activeType == "Rebate") {
            orderInfo.SelectedActivity.push(this.activities[m].memberCards[0].activityId);
          } else {
            orderInfo.SelectedActivity.push(this.activities[m].activityId);
          }
        }
      }
      for (var j = 0; j < this.gift.length; j++) {
        orderInfo.orderProducts.push({
          ShopId: this.gift[j].shopId,
          ProudctId: this.gift[j].productId,
          BuyNum: 1,
          SkuId: this.gift[j].skuId,
          Identity: guid,
          DeliveryType: 1,
          ShopSkuId: 1,
          ActivityMarker: "[gift-" + this.gift[j].activityId + "-" + this.gift[j].id + "]"
        });
      }

      upData.orderInfo = orderInfo;
      var self = this;
      if (!this.scan) {
        this.loading = true;
      }
      submitOrderAndPay(upData).then(function(response) {
        if (response.data.success) {
          successData = { integral: self.integral, isIntegral: self.isIntegral, startMoney: webTotalAmount, totalAll: self.totalAll, orderCreateTime: response.data.orderCreateTime };
          self.$router.push({ path: '/success', query: { discount: self.discountObj, fullOrderActivit: self.fullOrderActivit } });
        } else {
          self.$toast(response.data.msg);
          setTimeout(function() {
            if (response.data.status == 2) {
              self.gift = [];
              self.activitiesNofisrt = [];
              self.updataPage();
            }
            if (response.data.status == 1) {
              self.$router.push('/');
            }
          }, 400)
        }
        self.payCode = "";
        self.loading = false;
      }).catch(function() {
        self.loading = false;
        self.$toast('提交异常');
        self.payCode = "";
      });
    },
    numberOnly: function(vv) {
      if (vv != '' && vv.substr(0, 1) == '.') {
        vv = "";
      }
      vv = vv.replace(/^0*(0\.|[1-9])/, '$1'); //解决 粘贴不生效
      vv = vv.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
      vv = vv.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
      vv = vv.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      vv = vv.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
      if (vv.indexOf(".") < 0 && vv != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        if (vv.substr(0, 1) == '0' && vv.length == 2) {
          vv = vv.substr(1, vv.length);
        }
      }
      return vv;
    },
    capitalInput: function() {
      this.$refs.capitalVal.value = this.numberOnly(this.$refs.capitalVal.value);
      if (parseFloat(this.$refs.capitalVal.value) > parseFloat(this.maxCapital)) {
        this.$refs.capitalVal.value = this.maxCapital
      }
      this.capital = this.$refs.capitalVal.value;
      this.priceCalculation();
    },
    cashInput: function(el) {
      this.$refs.cashVal.value = this.numberOnly(this.$refs.cashVal.value);
      this.cash = this.$refs.cashVal.value;
      // this.capital=this.math(this.startMoney,this.cash);
      // if(this.capital<0)  this.capital=0;
      this.giveChange = this.math(this.cash, this.maxRealCash);
    },
    priceCalculation: function() {
      var self = this;
      setTimeout(function() {
        self.giveChange = self.math(self.cash, self.maxRealCash);
        self.netReceipts = self.math(self.math(self.startMoney, self.capital), self.removeSmallChange);
      }, 100)

    },
    math: function(n1, n2) {
      return Math.round((n1 - n2) * 100) / 100
    }
  },
  watch: {
    isIntegral: function(val) {
      this.render();
    },
    toSecondSrceen: {
      handler: function(val) {
        sendTosecondaryDisplay(carts, memberData, val, 2, this);
      },
      deep: true
    }
  },
  directives: {
    focus: {
      inserted: function(el, val) {
        if (val.value) {
          el.focus();
        } else {
          el.blur();
        }
      }
    },
    numberOnly: {
      bind: function(el) {
        el.handler = function() {
          el.value = el.value.replace(/\D+/, '')
        }
        el.addEventListener('input', el.handler)
      },
      unbind: function(el) {
        el.removeEventListener('input', el.handler)
      }
    }
  },
  filters: {
    rmb: function(value) {
      return "￥" + (parseFloat(value).toFixed(2))
    },
    frmb: function(value) {
      return "-￥" + (parseFloat(value).toFixed(2))
    },
    postiveNumber: function(value) {
      return value + 1;
    }
  }
}

</script>
<style lang="scss" scoped>
.main-container {
  display: flex;
}

.orderInfo {
  width: 29.2%;
  height: 100%;
  background: rgba(242, 242, 242, 1);
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  &-header {
    background: #f4f0e7;
    height: 76px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 27px;
    &-left {
      display: flex;
      align-items: center;
      span {
        font-size: 16px;
        color: rgba(102, 102, 102, 1);
        margin-left: 9px;
      }
    }
  }
  &-orderDetail {
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 26px 27px;
    margin-top: 10px;
    &-title {
      font-size: 16px;
      color: rgba(102, 102, 102, 1);
      font-weight: bolder;
    }
    &-num {
      font-size: 14px;
      color: #999999;
    }
    &-cash {
      font-size: 14px;
      color: #E00000;
    }
    &-count {
      color: #999;
    }
  }
  &-center {
    padding: 30px 27px 0 27px;
    background: #fff;
    margin-top: 9px;
    div {
      display: flex;
      justify-content: space-between;
    }
    &-item {
      margin-top: 26px;
      span {
        font-size: 14px;
        color: rgba(199, 178, 135, 1);
      }
    }
    &-line {
      margin-top: 26px;
      height: 1px;
      background: rgba(0, 0, 0, 0.1);
    }
    &-totalbox {
      height: 56px;
      align-items: center;
      div {
        font-size: 16px;
        font-weight: bold;
        color: rgba(102, 102, 102, 1);
      }
      span {
        font-size: 16px;
        color: #E00000;
      }
    }
  }
  &-peopleInfo {
    padding: 25px;
    margin-top: 22px;
    background: #fff;
    height: calc(100% - 411px);
    &-title {
      font-size: 14px;
      color: rgba(51, 51, 51, 1);
      font-weight: bold;
    }
    &-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 24px;
    }
  }
}

</style>
