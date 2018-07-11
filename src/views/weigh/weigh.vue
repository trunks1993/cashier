<template>
  <div class="cartPage weigh">
    <div>
      <mu-dialog class="mydailog" :open="skudialog" title="商品信息">
        <i class="iconfont icon-guanbi closeSku" @click="skudialog=false"></i>
        <div class="skuchange" v-if="checkedProduct">
          <div v-if="checkedProduct.skus.length==1">
            <label>已选商品</label>
            <div class="skuWeigh-info" v-if="checkedProduct">
              <img :src="checkedProduct.imageUrl" :onerror="errorImg">
              <div>
                <span class="title">{{checkedProduct.name}}</span>
                <span class="weigh" v-if="checkedProduct.skus[0].baseSKU.specification1">
                                    {{checkedProduct.skus[0].baseSKU.specification1}};
                                </span>
                <span class="weigh" v-if="checkedProduct.skus[0].baseSKU.specification2">
                                    {{checkedProduct.skus[0].baseSKU.specification2}};
                                </span>
                <span class="weigh" v-if="checkedProduct.skus[0].baseSKU.specification3">
                                    {{checkedProduct.skus[0].baseSKU.specification3}};
                                </span>
                <span class="price">{{checkedProduct.salePrice | rmb}}</span>
              </div>
            </div>
          </div>
          <div v-if="checkedProduct.skus.length>1">
            <div class="skurow" :class="{'showSkuListCheck':color.length>0}" v-show="color.length>0">
              <label>{{spec.spec1}}</label>
              <mu-raised-button v-for="(item, index) in color" :key="index" :label="item.value" @click="skuchange($event,item.skuId,'color')" :class="classObject(item.skuId,'color')" />
            </div>
            <div class="skurow" :class="{'showSkuListCheck':size.length>0}" v-show="size.length>0">
              <label>{{spec.spec2}}</label>
              <mu-raised-button v-for="(item, index) in size" :key="index" :label="item.value" @click="skuchange($event,item.skuId,'size')" :class="classObject(item.skuId,'size')" />
            </div>
            <div class="skurow" :class="{'showSkuListCheck':version.length>0}" v-show="version.length>0">
              <label>{{spec.spec3}}</label>
              <mu-raised-button v-for="(item, index) in version" :key="index" :label="item.value" @click="skuchange($event,item.skuId,'version')" :class="classObject(item.skuId,'version')" />
            </div>
          </div>
          <div class="skurow">
            <label>数量<span v-if="checkedProSkuStock>-1">库存:{{checkedProSkuStock}}</span></label>
            <div class="change" v-if="checkedProduct.productSaleMethod==0">
              <i class="iconfont icon-shanjian" @click="changeSkudiaNum(-1)"></i>
              <span>{{skuSelect.num}}</span>
              <i class="iconfont icon-tianjia" @click="changeSkudiaNum(1)"></i>
            </div>
            <div class="skurow-kg" v-if="checkedProduct.productSaleMethod==1">
              <!--<input type="text" v-focus  ref="weighValue" @input="weighInput">-->
              <input type="text" disabled="disabled" v-if="isS2" v-model="weighNum">
              <input type="text" v-focus v-else ref="weighValue" @input="weighInput">
              <span v-if="checkedProduct.measureUnit">{{checkedProduct.measureUnit}}</span>
            </div>
          </div>
          <div>
            <mu-raised-button class="skuSubmit" label="加入列表" @click="addskuPro" />
            <mu-raised-button class="skuSubmit qupiBtn" v-if="isS2&&checkedProduct.productSaleMethod==1" @click="plus_goZero" :label="isQupi?'清零':'去皮'" />
          </div>
        </div>
      </mu-dialog>
    </div>
    <div>
      <mu-dialog class="mydailog" :open="codedialog" title="商品信息">
        <i class="iconfont icon-guanbi closeSku" @click="codedialog=false"></i>
        <div class="skuchange" v-if="codeProd">
          <div>
            <label>已选商品</label>
            <div class="skuWeigh-info">
              <img :src="codeProd.showPic" :onerror="errorImg">
              <div>
                <span class="title">{{codeProd.productName}}</span>
                <p>
                  <em wx:if="codeProd.specification1">{{codeProd.specification1}}</em>
                  <em wx:if="codeProd.specification2">{{codeProd.specification2}}</em>
                  <em wx:if="codeProd.specification3">{{codeProd.specification3}}</em>
                </p>
                <span class="price">{{codeProd.salePrice | rmb}}</span>
              </div>
            </div>
          </div>
          <div class="skurow">
            <label>数量<span>库存:{{(codeProd.storeStock-codeProd.safeStock)}}</span></label>
            <div class="skurow-kg">
              <input type="text" disabled="disabled" v-if="isS2" v-model="weighNum">
              <input type="text" v-focus v-else ref="weighValue" @input="weighInput">
							<span v-if="codeProd.measureUnit">{{codeProd.measureUnit}}</span>
            </div>
          </div>
          <div>
            <mu-raised-button class="skuSubmit" label="加入列表" @click="addskuCodePro" />
            <mu-raised-button class="skuSubmit qupiBtn" v-if="isS2&&checkedProduct.productSaleMethod==1" @click="plus_goZero" :label="isQupi?'清零':'去皮'" />
          </div>
        </div>
      </mu-dialog>
    </div>
    <div class="left">
      <div class="left_cont placeholder">
        <div class="memberInfo">
          <mu-auto-complete class="memberInput" id="" v-model="productCode" @keydown.enter="GetOncePor()" style="width:100%;" fullWidth hintText="请输入或扫描商品条形码" />
        </div>
      </div>
      <div class="cartList">
        <ul>
          <li v-for="(item,i) in weighCart" v-if="item.isStock" @mouseover="cartHover(item.skuid)" @mouseout="cartHover(-1)" :class="{'active':item.skuid==checkedProid,'cartHover':item.skuid==cartHoverId}">
            <i class="deleteCartone iconfont icon-guanbi" @click="delCart(item.skuid)"></i>
            <div class="li_left">
              <img :src="item.img" :onerror="errorImg">
            </div>
            <div class="li_middle">
              <h2>{{item.proName}}</h2>
              <h3 class="vertical2">
                                      <span v-if="item.color">{{item.color}};</span>
                                      <span v-if="item.size">{{item.size}};</span>
                                      <span v-if="item.vesion">{{item.vesion}};</span>
                                    </h3>
              <h1 v-if="item.joinFixedPrice&&item.num<=item.limitBuy">{{item.marketPrice | rmb}} <em v-if="item.measureUnit!=''">/{{item.measureUnit}}</em></h1>
              <h1 v-else>{{item.saleprice | rmb}}  <em v-if="item.measureUnit!=''">/{{item.measureUnit}}</em> <span v-if="item.joinFixedPrice">限购{{item.limitBuy}}件,超出全部恢复原价</span></h1>
            </div>
            <div class="li_right input">
              <input type="text" v-model="item.num" @input="weighListInput(item.skuid)">
            </div>
            <div class="li_right text">
              {{ item.num*item.saleprice | rmb }}
            </div>
          </li>
          <li class="nostockCart" v-for="item in weighCart" v-if="!item.isStock" @mouseover="cartHover(item.skuid)" @mouseout="cartHover(-1)" :class="{'active':item.skuid==checkedProid,'cartHover':item.skuid==cartHoverId}">
            <i class="deleteCartone iconfont icon-guanbi"></i>
            <div class="li_left">
              <img :src="item.img" :onerror="errorImg">
            </div>
            <div class="li_middle">
              <h2>{{item.proName}}</h2>
              <h3>
                                       <span v-if="item.color">{{item.color}},</span>
                                       <span v-if="item.size">{{item.size}},</span>
                                       <span v-if="item.vesion">{{item.vesion}},</span>
                                    </h3>
              <h1>&nbsp</h1>
            </div>
          </li>
        </ul>
        <div class="clearAll" v-show="weighCart.length>0">
          <mu-raised-button label="清空列表" @click="weighCart=[]" fullWidth/>
        </div>
      </div>
      <div id="testccc" style="background:#fff;width:340px;color:#494e52;padding-top:5px;display:none;">
        <header style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;padding-top:5px;">
          <font size="5">{{printerData.proName}}</font>
        </header>
        <p style="line-height:14px;font-size:14px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;height:12px;">
          <font size="4">打印时间:</font><span style="margin-left:5px;"><font size="4">{{printerData.time}}</font></span></p>
        <p style="line-height:14px;font-size:14px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;height:12px;">
          <font size="4">规格:</font><span style="margin-left:5px;"><font size="4">{{printerData.sku}}</font></span></p>
        <div style="overflow:hidden;">
          <div style="display: inline-block;line-height:14px;height:13px;height:12px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width: 190px;">
            <font size="4">单价:</font><span style="margin-left:5px;"><font size="4">￥{{printerData.price}}</font></span></div>
          <div style="float:right;line-height:14px;height:12px;margin-right:15px;">
            <font size="4">重量:</font><span class="way" style="margin-left:5px;font-size:14px;"><font size="4">{{printerData.weigh}}</font></span></div>
        </div>
        <p style="line-height:14px;font-size:14px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;height:12px;">
          <font size="4">总价:</font><span style="margin-left:5px;"><font size="4">￥{{printerData.total}}</font></span></p>
        <svg class="barcode"></svg>
      </div>
      <mu-raised-button class="shoukun" @click="toOrder" label="打印价签" fullWidth/>
    </div>
    <div class="right">
      <div class="right_cont">
        <div class="pro_menu" id="pro_menu">
          <ul :style="{'-webkit-transform':'translateX('+menu.menuOffsetL+'px)'}">
            <li v-for="item in typeList" :id="item.id" @click="changeType(item.id)" :class="checkType==item.id?'active':''">
              <mu-raised-button :label="item.name" fullWidth />
            </li>
          </ul>
          <i class="iconfont icon-jiantou more" v-show="(menu.menuOffsetL*-1<menu.offset||(menu.menuOffsetL==0&&menu.offset==0))&&menu.w>=menu.prow&&menu.init" @mousedown="moreMenu(1,'right')" @mouseup="moreMenu(2,'right')"></i>
          <i class="iconfont icon-jiantou more left" v-show="menu.menuOffsetL<0&&menu.init" @mousedown="moreMenu(1,'left')" @mouseup="moreMenu(2,'left')"></i>
        </div>
        <div class="proList" id="proList">
          <div class="gridlist-demo-container">
            <ul>
              <li v-for="item in productList" v-model="productList" @click="open(item.id,item.storeStock<=item.safeStock*item.skus.length)" class="imgList" :class="{nostock:item.storeStock<=item.safeStock*item.skus.length,fixedprice:item.joinFixedPrice}">
                <div>
                  <img :src="item.imageUrl" :style="{height:setImgHeight()}" onresize :onerror="errorImg" alt="">
                  <div>
                    <h3>{{item.name}}</h3>
                    <span>{{item.joinFixedPrice?item.marketPrice:item.salePrice | rmb}}
                                              <i v-if="item.measureUnit&&item.measureUnit!=''">{{'/'+item.measureUnit}}</i>
                                        </span>
                    <em v-if="item.joinFixedPrice&&item.limitBuy>0">限{{item.limitBuy}}件</em>
                  </div>
                </div>
              </li>
            </ul>
            <div class="proloading">
              <div class="spinner" v-show="isMore">
                <div class="double-bounce1"></div>
                <div class="double-bounce2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <mu-dialog dialogClass="m-dialog" :open="printing" title="">
      <div class="confirmBegin" style="text-align:center;padding:20px 0 40px 0;">正在打印，请稍后...</div>
    </mu-dialog>
  </div>
</template>
<script>
import JsBarcode from "jsbarcode";
import { weightSearchProduct, weighGetStoreCategoryContainProduct, getSKUByBarcode, insertWeighingTag, getShopProductsSKUsByAutoId } from '@/api'
export default {
  name: 'index',
  data() {
    return {
      printing: false,
      loading: false,
      skudialog: false,
      codedialog: false,
      codeProd: null,
      activeTab: "tab1",
      proCode: "", //商品码
      memberCode: "", //会员信息码
      checkType: "0", //选中分类id
      checkedProid: indexData.checkedProid, //选中商品id
      member: indexData.member, //会员信息
      size: [],
      color: [],
      version: [],
      weighNum: '',
      spec: { spec1: "", spec2: "", spec3: "" },
      skuWeigh: false,
      skuSelect: { //存放当前选中的商品信息
        color: "0",
        size: "0",
        version: "0",
        num: 1,
        proid: ''
      },
      printerData: {
        proName: "",
        time: "",
        sku: "",
        price: "",
        weigh: "",
        total: ""
      },
      productCode: "", //商品扫码code
      checkedStock: {}, //选中商品的库存情况
      weighCart: [],
      productList: [],
      productObject: {},
      typeList: [],
      typeLoad: false,
      cardId: 0,
      activityId: 0,
      cartHoverId: -1,
      menu: {
        menuOffsetL: 0,
        moreSetTime: null,
        w: 0,
        offset: 0,
        prow: 0,
        init: false
      },
      isMore: false,
      isLoadingPro: true,
      pageSize: 30,
      pageNo: 1,
      checkedProduct: null,
      memberUrl: "index",
      isFace: false,
      inputfocus: false,
      isS2: false,
      isWeiStable: true,
      getWeiTime: null,
      isQupi: false,
      errorImg: 'this.src="' + require('../../assets/images/imgerror.png') + '"',
    }
  },
  created: function() {
    this.$emit("isBack", false);
    this.GetProType();
    document.body.addEventListener("keyup", this.bodyKeyUp, false);
    var ua = navigator.userAgent;
    if (ua.indexOf("S2") != -1) {
      this.isS2 = true;
    } else {
      this.isS2 = false;
    }
  },

  destroyed: function() {
    if (this.getWeiTime) clearInterval(this.getWeiTime);
    document.body.removeEventListener("keyup", this.bodyKeyUp, false);
  },
  mounted: function() {
    var self = this;
    setTimeout(function() {
      document.getElementById('pro_menu').querySelectorAll('li').forEach(function(e) {
        self.menu.w += e.offsetWidth;
      });
      self.menu.prow = document.getElementById('pro_menu').offsetWidth;
      document.getElementById('pro_menu').querySelector('ul').style.width = (self.menu.w + 1) + "px";
      self.menu.init = true;
    }, 2000)
  },
  beforeMount: function() {
    var self = this;
    var a = setInterval(function() {
      if (!isCashBegin) return;
      if (document.getElementById('ffocus')) {
        document.getElementById('ffocus').querySelector('input').focus();
        clearInterval(a);
      }
      self.proScroll();
    }, 1000);
  },
  computed: {
    checkedProSkuStock() {
      var sku = this.skuSelect.proid + "_" + this.skuSelect.color + "_" + this.skuSelect.size + "_" + this.skuSelect.version;
      if (this.checkedStock[sku]) {
        if(this.checkedStock[sku].realStock.toString().indexOf(".")!=-1){
        	return this.checkedStock[sku].realStock.toFixed(3);
        }else{
        	return this.checkedStock[sku].realStock;
        }
      } else {
        return -1;
      }
    }
  },
  watch: {
    skudialog: function(val) {
      if (val) {
        var self = this;
        for (var i = 0; i < this.checkedProduct.skus.length; i++) {
          if (this.checkedProduct.skus[i].realStock > 0) {
            setTimeout(function() {
              self.skuSelect.color = self.checkedProduct.skus[i].baseSKU.specification1Id;
              self.skuSelect.size = self.checkedProduct.skus[i].baseSKU.specification2Id;
              self.skuSelect.version = self.checkedProduct.skus[i].baseSKU.specification3Id;
            }, 200)
            break;
          }
        }
        this.inputfocus = true;

        /**S2称重处理**/
        if (this.isS2) {
          self.getWeiTime = setInterval(function() {
            try {
              var val = plus.android.getAttribute(wWeighDisPlays, "mStableWeight");
              var mStatus = plus.android.getAttribute(wWeighDisPlays, "mStatus");
              if (self.checkedProduct.measureUnit == "g") {
                self.weighNum = val;
              } else {
                self.weighNum = (val / 1000).toFixed(3);
              }
            } catch (e) {
              alert("error");
            }
          }, 700);
        }
        /**S2称重处理**/
      } else {
        if (this.getWeiTime) clearInterval(this.getWeiTime);
        this.inputfocus = false;
      }
    },
		codedialog:function(v){
				if (v) {
					var self = this;
					/**S2称重处理**/
					if (this.isS2) {
						self.getWeiTime = setInterval(function() {
							try {
								var val = plus.android.getAttribute(wWeighDisPlays, "mStableWeight");
								var mStatus = plus.android.getAttribute(wWeighDisPlays, "mStatus");
								if (self.codedialog.measureUnit == "g") {
									self.weighNum = val;
								} else {
									self.weighNum = (val / 1000).toFixed(3);
								} 
							} catch (e) {
								alert(JSON.stringify(e));
							}
						}, 700);
					}
					/**S2称重处理**/
				} else {
					if (this.getWeiTime) clearInterval(this.getWeiTime);
					if (this.isS2) plus.android.invoke(wWeighDisPlays, "SetClose");
				}
		}
  },
  methods: {
    testPrint() {
      var self = this;
      try {
        var LODOP; //声明为全局变量
        LODOP = usbPrint.getLodop();
        LODOP.PRINT_INIT("");
        LODOP.SET_PRINT_MODE("PRINT_PAGE_PERCENT", "Auto-Width");
        LODOP.SET_PRINT_PAGESIZE(3, '52mm', '40mm', "CreateCustomPage");
        LODOP.ADD_PRINT_HTM(0, 0, "100%", "100%", document.getElementById("testccc").innerHTML);
        LODOP.PRINT();
      } catch (e) {
        self.$toast("请检查打印机是否正确连接");
      }
    },
    plus_goZero() {
			 var qupi;
			 var i = 0;
			 var self = this;
			 funQupi();
			 function funQupi(){
					i++;
					plus.android.invoke(wWeighDisPlays, "SetTare");
					qupi = plus.android.getAttribute(wWeighDisPlays, "isQupi");
					if (qupi != self.isQupi) {
						self.isQupi = qupi;
						return;
					}
					if(i>=10) return;
					setTimeout(function(){
							funQupi();
					},50)
			 }		
    },
    bodyKeyUp(e) {
      var self = this;
      if (e.keyCode == 27) {
        self.skudialog = false;
      }
      if (self.skudialog) {
        if (e.keyCode == 37 || e.keyCode == 39) {
          var add = e.keyCode == 37 ? -1 : 1;
          self.changeSkudiaNum(add);
        }
        if (e.keyCode == 13) {
          self.addskuPro();
        }
      }
      if (self.codedialog) {
        if (e.keyCode == 13) {
          self.codedialog();
          self.addskuCodePro();
        }
      }

      if (self.weighCart.length == 0) { return; };
      if (self.skudialog) { return };
      if (e.keyCode == 38 || e.keyCode == 40) {
        var add = e.keyCode == 38 ? -1 : 1;
        for (var i = 0; i < self.weighCart.length; i++) {
          if (self.weighCart[i].skuid == self.checkedProid) {
            if (i == 0 && add == -1) return;
            if (i == (self.weighCart.length - 1) && add == 1) return;
            self.checkedProid = self.weighCart[i + add].skuid;
            break;
          }
        }
      }
      if (e.keyCode == 46) {
        if (!self.skudialog) {
          self.delCart()
        }
      }
    },
    moreMenu: function(t, f) {
      var self = this;
      clearInterval(self.menu.moreSetTime);
      self.menu.offset = self.menu.w - self.menu.prow;
      if (t == 1) {
        self.menu.moreSetTime = setInterval(function() {
          if (f == "right") {
            if (self.menu.menuOffsetL * -1 >= self.menu.offset) {
              self.menu.menuOffsetL = self.menu.offset * -1;
              clearInterval(self.menu.moreSetTime);
            } else {
              self.menu.menuOffsetL -= 10;
            }
          } else {
            if (self.menu.menuOffsetL > 0) {
              self.menu.menuOffset = 0
              clearInterval(self.menu.moreSetTime);
            } else {
              self.menu.menuOffsetL += 10;
            }
          }
        }, 30);
      } else {
        clearInterval(self.menu.moreSetTime);
      }
    },
    delCart: function(id) {
      if (!id) { id = this.checkedProid; }
      for (var i = 0; i < this.weighCart.length; i++) {
        console.log(this.weighCart[i].skuid);
        if (this.weighCart[i].skuid == id) {
          this.weighCart.splice(i, 1);
          if (this.weighCart.length > 0) this.checkedProid = this.weighCart[0].skuid;
          break;
        }
      }
    },
    totalAll: function() {
      var total = 0,
        num = 0;
      for (var i = 0; i < this.weighCart.length; i++) {
        var price = this.weighCart[i].joinFixedPrice && this.weighCart[i].num <= this.weighCart[i].limitBuy ? this.weighCart[i].marketPrice : this.weighCart[i].saleprice;
        total += parseFloat(price) * parseFloat(this.weighCart[i].num);
        num += parseFloat(this.weighCart[i].num);
      }
      return {
        total: total,
        num: num
      }
    },
    GetProductList: function(type) { //获取商品
      var self = this;
      this.isMore = true;
      if (!this.isLoadingPro) return;
      this.isLoadingPro = false;
      weightSearchProduct(self.checkType, self.pageNo, self.pageSize).then(function(response) {
        self.isMore = false;
        self.isLoadingPro = true;
        var dt = response.data.models;
        self.pageNo++;
        for (var i = 0; i < dt.length; i++) {
          self.productObject[dt[i].id.toString()] = dt[i];
        }
        self.productList.push.apply(self.productList, dt);
      });
    },
    GetProType: function() { //获取商品分类
      var self = this;
      weighGetStoreCategoryContainProduct().then(function(response) {
        for (var i = 0; i < response.data.length; i++) {
          self.typeList.push({ id: response.data[i].id, name: response.data[i].name });
        }
        self.checkType = response.data[0].id;
        self.GetProductList();
      });
    },
    GetOncePor: function() {
      var self = this;
      if (this.productCode != "") {
        setTimeout(function() {
          getSKUByBarcode(self.productCode).then(function(response) {
            if ("success" in response.data && !response.data.success) {
              self.$toast(response.data.msg)
              return;
            }
            var dt = response.data;
            if (dt.productSaleMethod == 1) {
              self.codeProd = dt;
              self.codedialog = true;
            } else {
              self.codeAddCart(dt, 1);
            }
          });
          self.productCode = "";
        }, 250);
      }
    },
    addskuCodePro: function() {
      if (this.weighNum == "") {
        this.$toast('请填写数量');
        return;
      }
      this.codeAddCart(this.codeProd, parseFloat(this.weighNum));
    },
    codeAddCart: function(dt, addnum) {
      this.weighNum = "";
      var num = 0,
        j = 0;
      for (var i = 0; i < this.weighCart.length; i++) {
        if (this.weighCart[i].skuid == dt.autoId) {
          num = this.weighCart[i].num;
          j = i;
        }
      }
      if ((dt.storeStock - num - addnum) >= dt.safeStock) {
        if (num == 0) {
          this.weighCart.push({
            proName: dt.productName,
            color: dt.specification1 ? dt.specification1 : '',
            size: dt.specification2 ? dt.specification2 : '',
            specification3: dt.vesion ? dt.specification3 : '',
            img: dt.showPic,
            saleprice: dt.salePrice,
            newprice: '',
            num: addnum,
            skuid: dt.autoId,
            proId: dt.productId,
            shopskuid: dt.shopSkuId,
            joinFixedPrice: dt.joinFixedPrice,
            isStock: true,
            safeStock: dt.safeStock,
            storeStock: dt.storeStock,
            limitBuy: dt.limitBuy,
            productSaleMethod: dt.productSaleMethod,
            measureUnit: !dt.measureUnit ? "" : dt.measureUnit,
            marketPrice: dt.marketPrice
          });
        } else {

          this.weighCart[j].num = parseFloat(this.weighCart[j].num) + parseFloat(addnum);
          if (this.weighCart[j].num.toString().split(".").length == 2) {
            this.weighCart[j].num = this.weighCart[j].num.toFixed(3);
          }
        }
        this.codedialog = false;
        this.checkedProid = dt.autoId;
        this.$toast('成功加入!');
      } else {
        this.$toast('库存不足');
      }
    },
    changeType: function(id) { //切换分类
      this.checkType = id;
      this.productObject = {};
      this.productList = [];
      this.pageNo = 1;
      this.GetProductList();
    },
    handleTabChange(val) {
      this.activeTab = val
    },
    skuchange: function(ev, id, type) {
      if (ev.target.offsetParent.className.indexOf("disabled") != -1) return;
      switch (type) {
        case 'color':
          var skuid = this.skuSelect.proid + "_" + id + "_" + this.skuSelect.size + "_" + this.skuSelect.version;
          break;
        case 'size':
          var skuid = this.skuSelect.proid + "_" + this.skuSelect.color + "_" + id + "_" + this.skuSelect.version;
          break;
        case 'version':
          var skuid = this.skuSelect.proid + "_" + this.skuSelect.color + "_" + this.skuSelect.size + "_" + id;
          break;
      }
      if (this.checkedStock[skuid] && this.checkedStock[skuid].realStock <= 0) {
        return;
      }
      if (this.skuSelect[type] == id) {
        this.skuSelect[type] = 0;
      } else {
        this.skuSelect[type] = id
      }
    },
    open: function(key, isOpen) {
      if (isOpen) return;
      if (key) {
        this.checkedStock = {};
        this.skuSelect = { color: "0", size: "0", version: "0", discolor: "0", dissize: "0", disversion: "0", num: 1, proid: key };
        var data = this.productObject[key];
        this.checkedProduct = this.productObject[key];
        for (var i = 0; i < data.skus.length; i++) {
          this.checkedStock[data.skus[i].baseSKU.id] = data.skus[i];
          this.checkedStock[data.skus[i].baseSKU.id].realStock = data.skus[i].stock - data.skus[i].baseSKU.safeStock;
        }
        if (data.skus.length > 1) {
          this.color = this.productObject[key].color;
          this.spec.spec1 = this.productObject[key].color.length == 0 ? "" : this.productObject[key].color[0].name;
          this.size = this.productObject[key].size;
          this.spec.spec2 = this.productObject[key].size.length == 0 ? "" : this.productObject[key].size[0].name;
          this.version = this.productObject[key].version;
          this.spec.spec3 = this.productObject[key].version.length == 0 ? "" : this.productObject[key].version[0].name;
          this.skuSelect.proid = key;
          this.skudialog = true;
        } else {
          if (data.productSaleMethod == 1) {
            this.skudialog = true;
          } else {
            this.addCart(0);
          }
        }
      } else {
        this.skudialog = true;
      }
    },
    addskuPro: function() {
      if (this.checkedProduct.skus.length > 1) {
        if (this.color.length > 0 && this.skuSelect.color == '0') {
          this.$toast('请选' + this.color[0].name);
          return;
        }
        if (this.size.length > 0 && this.skuSelect.size == '0') {
          this.$toast('请选' + this.size[0].name);
          return;
        }
        if (this.version.length > 0 && this.skuSelect.version == '0') {
          this.$toast('请选' + this.version[0].name);
          return;
        }
      }
      if (this.checkedProduct.productSaleMethod == 1 && this.weighNum == "") {
        this.$toast('请填写数量');
        return;
      }
      if (this.checkedProduct.skus.length == 1) {
        var skuid = this.skuSelect.proid + "_" + this.checkedProduct.skus[0].baseSKU.specification1Id + "_" + this.checkedProduct.skus[0].baseSKU.specification2Id + "_" + this.checkedProduct.skus[0].baseSKU.specification3Id;
      } else {
        var skuid = this.skuSelect.proid + "_" + this.skuSelect.color + "_" + this.skuSelect.size + "_" + this.skuSelect.version;
      }
      var data = this.productObject[this.skuSelect.proid];
      if (this.checkedProduct.productSaleMethod == 1) {
        this.skuSelect.num = this.weighNum;
      }
      for (var i = 0; i < data.skus.length; i++) {
        if (skuid == data.skus[i].baseSKU.id) {
          this.addCart(i, parseFloat(this.skuSelect.num));
          return;
        }
      }
      this.skudialog = false;
    },
    addCart: function(idx, addnum, proId, isAddCart) {
      if (addnum == 0) return;
      proId = proId || this.skuSelect.proid;
      var data = this.productObject[proId];
      addnum = addnum || 1;
      var num = 0,
        j = 0,
        joinFixedPriceNum = 0;
      var joinFixedPrice = isAddCart ? this.weighCart[idx].joinFixedPrice : data.joinFixedPrice;
      var num = isAddCart ? this.weighCart[idx].num : 0;
      var j = isAddCart ? idx : 0;
      for (var i = 0; i < this.weighCart.length; i++) {
        if (!isAddCart && this.weighCart[i].skuid == data.skus[idx].skuId) {
          num = this.weighCart[i].num;
          j = i;
        }
        if (joinFixedPrice && this.weighCart[i].proId == proId) {
          joinFixedPriceNum += this.weighCart[i].num;
        }
      }
      var stock = num == 0 ? data.skus[idx].stock : this.weighCart[j].storeStock;
      var safeStock = num == 0 ? data.safeStock : this.weighCart[j].safeStock;
      var limitBuy = num == 0 ? data.limitBuy : this.weighCart[j].limitBuy;
      var proName = num == 0 ? this.productObject[proId].name : this.weighCart[j].proName;
      var skuid = num == 0 ? data.skus[idx].skuId : this.weighCart[j].skuid;
      if ((stock - num - addnum) >= safeStock) {
        if (num == 0) {
          this.weighCart.push({
            proName: data.name,
            color: data.skus[idx].baseSKU.specification1,
            size: data.skus[idx].baseSKU.specification2,
            vesion: data.skus[idx].baseSKU.specification3,
            img: data.imageUrl,
            saleprice: data.skus[idx].salePrice,
            newprice: '',
            num: addnum,
            skuid: data.skus[idx].skuId,
            proId: this.skuSelect.proid,
            shopskuid: data.skus[idx].id,
            joinFixedPrice: data.joinFixedPrice,
            isStock: true,
            safeStock: data.safeStock,
            storeStock: stock,
            limitBuy: data.limitBuy,
            productSaleMethod: data.productSaleMethod,
            measureUnit: !data.measureUnit ? "" : data.measureUnit,
            marketPrice: data.marketPrice
          });
        } else {
          var a = this.weighCart[j].num,
            b = addnum;
          this.weighCart[j].num = parseFloat(this.weighCart[j].num) + parseFloat(addnum);
          if (this.weighCart[j].num.toString().split(".").length == 2) {
            this.weighCart[j].num = this.weighCart[j].num.toFixed(3);
          }
        }
        this.skudialog = false;
        this.checkedProid = skuid;
        this.weighNum = "";
        console.log(this.weighCart)
      } else {
        this.$toast('库存不足,最大可购买数:' + ((stock - safeStock - num).toFixed(2)));
      }
    },
    changeSkudiaNum: function(add) {
      if (this.color.length != 0 && this.skuSelect.color == 0) return;
      if (this.size.length != 0 && this.skuSelect.size == 0) return;
      if (this.version.length != 0 && this.skuSelect.version == 0) return;
      if (add > 0) {
        var skuid = this.skuSelect.proid + "_" + this.skuSelect.color + "_" + this.skuSelect.size + "_" + this.skuSelect.version,
          checkedNum = 0,
          data = this.checkedStock[skuid];
        for (var i = 0; i < this.weighCart.length; i++) {
          if (this.weighCart[i].skuid == data.skuId) {
            checkedNum = this.weighCart[i].num;
          }
        }
        if (data.stock - data.baseSKU.safeStock - checkedNum - this.skuSelect.num <= 0) {
          this.$toast('库存不足');
          return;
        }
      }
      this.skuSelect.num += add;
      this.skuSelect.num = this.skuSelect.num == 0 ? 1 : this.skuSelect.num;
    },
    close: function() {
      this.skudialog = false;
    },
    classObject: function(id, type) {
      switch (type) {
        case 'color':
          var skuid = this.skuSelect.proid + "_" + id + "_" + this.skuSelect.size + "_" + this.skuSelect.version;
          break;
        case 'size':
          var skuid = this.skuSelect.proid + "_" + this.skuSelect.color + "_" + id + "_" + this.skuSelect.version;
          break;
        case 'version':
          var skuid = this.skuSelect.proid + "_" + this.skuSelect.color + "_" + this.skuSelect.size + "_" + id;
          break;
      }
      var isDis = false;
      if (this.checkedStock[skuid] && this.checkedStock[skuid].realStock <= 0) {
        isDis = true;
      }
      var x = 0;
      skuid.split("_").forEach(function(i) {
        if (i != 0) {
          x++;
        }
      });
      if ((x - 1 == document.querySelectorAll(".showSkuListCheck").length) && this.checkedStock[skuid] == undefined) {
        isDis = true;
      }
      return {
        active: this.skuSelect[type] == id && !isDis,
        disabled: isDis
      }
    },
    toOrder: function() {
      if (this.loading) {
        return;
      }
      if (this.weighCart.length == 0) {
        this.$toast("请先添加商品");
        return;
      }
      var self = this;
      var i = 0;
      this.printing = true;
      getCodePrinte();

      function getCodePrinte() {
        if (self.weighCart[i].num == "") return;
        var dt = self.weighCart[i];
        insertWeighingTag({
          shopSkuId: dt.shopskuid,
          sellingPrice: dt.saleprice,
          quantity: dt.num,
          totalPrice: (dt.num * self.weighCart[i].saleprice).toFixed(2)
        }).then(function(response) {
          var sku = "";
          if (dt.color) sku += dt.color + ";";
          if (dt.size) sku += dt.size + ";";
          if (dt.vesion) sku += dt.vesion + ";";
          self.printerData = {
            proName: dt.proName,
            time: response.data.printTime,
            sku: sku,
            price: dt.saleprice + "/" + dt.measureUnit,
            weigh: dt.num + dt.measureUnit,
            total: (parseFloat(dt.saleprice) * parseFloat(dt.num)).toFixed(2)
          };
          console.log(self.printerData)
          JsBarcode(".barcode", response.data.code, {
            format: "code128",
            lineColor: "#000",
            width: 2,
            height: 52,
            displayValue: true,
            fontSize: 22
          });
          i++;
          setTimeout(function() {
            self.testPrint();
            if (i < self.weighCart.length) {
              setTimeout(function() {
                getCodePrinte()
              }, 100)
            } else {
              self.weighCart = [];
              self.printing = false;
            }
          }, 200)
        });
      }
    },
    setImgHeight: function() {
      var w = document.body.querySelectorAll(".proList ul")[0].offsetWidth;
      return (w * 0.18) + "px";
    },
    cartHover: function(id) {
      this.cartHoverId = id;
    },
    getSkuStock: function() {
      var autoId = [];
      for (var i = 0; i < carts.length; i++) {
        autoId.push(carts[i].skuid);
      }
      var self = this;
      getShopProductsSKUsByAutoId(autoId.join(",")).then(function(response) {
        for (var i = 0; i < response.data.data.length; i++) {
          for (var j = 0; j < self.weighCart.length; j++) {
            var mystock = response.data.data[i].stock - response.data.data[i].baseSKU.safeStock;
            if (mystock <= 0 && response.data.data[i].skuId == self.weighCart[j].skuid) {
              self.weighCart[j].isStock = false;
            }
            if (mystock > 0 && mystock < self.weighCart[j].num && response.data.data[i].skuId == self.weighCart[j].skuid) {
              self.weighCart[j].num = mystock;
            }
          }
        }
      });
    },
    proScroll: function() {
      var self = this;
      if (document.getElementById("proList")) {
        document.getElementById("proList").addEventListener('scroll', function() {
          var scrollTop = document.getElementById("proList").scrollTop;
          var proListHeight = document.getElementById("proList").scrollHeight;
          var windowH = window.innerHeight;
          if (scrollTop == proListHeight - windowH) {
            if (self.productList.length % self.pageSize == 0) {
              self.GetProductList();
            }
          }
        }, false);
      }
    },
    numberOnly: function(vv, l) {
      if (!vv) return;
      var l = l || 2;
      if (vv != '' && vv.substr(0, 1) == '.') {
        vv = "";
      }
      vv = vv.replace(/^0*(0\.|[1-9])/, '$1'); //解决 粘贴不生效
      vv = vv.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
      vv = vv.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
      vv = vv.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      if (l == 2) {
        vv = vv.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
      } else {
        vv = vv.replace(/^(\-)*(\d+)\.(\d\d\d).*$/, '$1$2.$3'); //只能输入两个小数
      }
      if (vv.indexOf(".") < 0 && vv != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        if (vv.substr(0, 1) == '0' && vv.length == 2) {
          vv = vv.substr(1, vv.length);
        }
      }
      return vv;
    },
    weighInput: function(el) {
      var n = this.$refs.weighValue.value;
      if (this.$refs.weighValue.value != "") {
        this.$refs.weighValue.value = this.numberOnly(n, 3);
        this.weighNum = this.$refs.weighValue.value;
      } else {
        this.weighNum = "";
      }
    },
    weighListInput: function(sku) {
      for (var i = 0; i < this.weighCart.length; i++) {
        if (this.weighCart[i].skuid == sku) {
          var a = parseFloat(this.numberOnly(this.weighCart[i].num, 3));
          if (a > (this.weighCart[i].storeStock - this.weighCart[i].safeStock)) {
            this.$toast("库存不足,最大可购买数:" + (this.weighCart[i].storeStock - this.weighCart[i].safeStock));
            this.weighCart[i].num = this.weighCart[i].storeStock - this.weighCart[i].safeStock
          } else {
            this.weighCart[i].num = this.numberOnly(this.weighCart[i].num, 3);
          }
        }
      }
    }
  },
  directives: {
    focus: {
      inserted: function(el) {
        setTimeout(function() {
          el.focus()
        }, 100);
      }
    },
    numberOnly: {
      bind: function(el) {
        el.handler = function() {
          var vv = el.value;
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
          el.value = vv;
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
      if (parseFloat(value).toFixed(2)) {
        return "￥" + (parseFloat(value).toFixed(2));
      } else {
        return "￥0";
      }
    },
    frmb: function(value) {
      return "-￥" + (parseFloat(value).toFixed(2))
    },
  }
}

</script>
<style lang="scss" scoped>
  .left {
    height: calc(100% - 51px);
  }
</style>