<template>
  <div class="main-container">
    <div class="main-container-carWrapper">
      <div class="main-container-carWrapper-carBox">
        <div class="main-container-carWrapper-carBox-header" :style="backgroundObj">
          <template v-if="member">
            <div class="main-container-carWrapper-carBox-header-showVip">
              <div class="main-container-carWrapper-carBox-header-showVip-left" @click="showVipComponet">
                <span>{{member.nick&&member.nick!=""?member.nick:member.userName}}</span><span>{{member.cellPhone || ''}}</span>
              </div>
              <i class="iconfont icon-shanchu" @click="clearMember"></i>
            </div>
          </template>
          <template v-else>
            <div class="main-container-carWrapper-carBox-header-faceVip" @click="toFace">
              <img src="../../assets/images/facevip.png">
              <span>人脸识别会员</span>
            </div>
            <div class="main-container-carWrapper-carBox-header-wall"></div>
            <div class="main-container-carWrapper-carBox-header-scanVip">
              <img src="../../assets/images/scanvip.png">
              <!-- <span>输入/扫码会员</span> -->
              <input type="text" placeholder="输入/扫码会员" v-model="memberCode" @keydown.enter="GetMemberByCode()">
            </div>
          </template>
        </div>
        <div class="main-container-carWrapper-carBox-center">
          <div class="main-container-carWrapper-carBox-center-productWrapper">
            <!-- 有库存 -->
            <div class="main-container-carWrapper-carBox-center-productWrapper-productItem" v-for="(item, i) in cart" v-if="item.isStock">
              <img height="100%" width="64px" :src="item.img">
              <div class="main-container-carWrapper-carBox-center-productWrapper-productItem-sizeBox">
                <span>{{item.proName}}</span>
                <span>{{item.color || ''}} {{item.size || ''}} {{item.vesion || ''}}</span>
                <span>
                  ￥{{item.joinFixedPrice && item.num <= item.limitBuy ? item.marketPrice : item.saleprice}}
                  {{item.measureUnit&&item.measureUnit!='' ? '/'+item.measureUnit : ''}}
                  {{item.joinFixedPrice ? ' 限购' + item.limitBuy + '件,超出全部恢复原价' : ''}}
                </span>
              </div>
              <div class="main-container-carWrapper-carBox-center-productWrapper-productItem-toolBox">
                <div class="main-container-carWrapper-carBox-center-productWrapper-productItem-toolBox-iconControl" v-if="!item.productSaleMethod">
                  <i class="iconfont icon-jian" @click="upDataCartNum(item.skuid,-1)"></i>
                  <input type="text" v-model="item.num" class="input2" @input="weighListInput(item.skuid,1)">
                  <i class="iconfont icon-tianjia1" @click="upDataCartNum(item.skuid,1)"></i>
                </div>
                <input v-if="item.productSaleMethod" class="inputControl" type="text" v-model="item.num" @input="weighListInput(item.skuid,2)">
                <i class="iconfont icon-lajitong" style="color: rgba(193, 193, 193, 1);margin-left: 15px" @click="delCart(item.skuid)"></i>
              </div>
            </div>
            <!-- 无库存 -->
            <div class="main-container-carWrapper-carBox-center-productWrapper-productItem" v-for="(item, i) in cart" v-if="!item.isStock">
              <div class="model">
                <img src="../../assets/images/nosell.png" style="position: absolute;right: 0;">
              </div>
              <img height="100%" width="64px" :src="item.img">
              <div class="main-container-carWrapper-carBox-center-productWrapper-productItem-sizeBox">
                <span>{{item.proName}}</span>
                <span>{{item.color || ''}} {{item.size || ''}} {{item.vesion || ''}}</span>
                <span>
                  ￥{{item.joinFixedPrice && item.num <= item.limitBuy ? item.marketPrice : item.saleprice}}
                  {{item.measureUnit&&item.measureUnit!='' ? '/'+item.measureUnit : ''}}
                  {{item.joinFixedPrice ? ' 限购' + item.limitBuy + '件,超出全部恢复原价' : ''}}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="main-container-carWrapper-carBox-clearBox">
          <div @click="clearCart">
            <i class="iconfont icon-lajitong" style="color: rgba(193, 193, 193, 1);"></i>
            <span style="color: rgba(193, 193, 193, 1);font-size:14px;margin-left: 6px;">清空列表</span>
          </div>
          <div>
            <span>合计:</span>
            <span style="font-size:16px;color: rgba(190, 37, 37, 1)">{{totalAll().total | rmb}}</span>
          </div>
        </div>
        <div class="main-container-carWrapper-carBox-discountBox" :style="hasDiscount ? '' : 'padding: 0 50px'">
          <div class="main-container-carWrapper-carBox-discountBox-item">
            <div>会员卡</div>
            <div class="main-container-carWrapper-carBox-discountBox-item-btnSel" :class="{disabledd: !member}">
              <div @click="selVipCard" :style="selCard ? '' : 'border-right: none;'">{{selCard.discount || '请选择'}}{{selCard ? '折' : ''}}</div>
              <i class="iconfont icon-guanbi" @click="clearDiscount(1)" v-if="selCard"></i>
            </div>
          </div>
          <div class="main-container-carWrapper-carBox-discountBox-item">
            <div>优惠券</div>
            <div class="main-container-carWrapper-carBox-discountBox-item-btnSel" :class="{disabledd: !member}">
              <div @click="selmoney" :style="selCoupon?'' : 'border-right: none;'">{{selCoupon ? '-￥' : ''}}{{selCoupon.price || '请选择'}}</div>
              <i class="iconfont icon-guanbi" @click="clearDiscount(2)" v-if="selCoupon"></i>
            </div>
          </div>
          <div class="main-container-carWrapper-carBox-discountBox-item" v-if="hasDiscount">
            <div>整单优惠</div>
            <div class="main-container-carWrapper-carBox-discountBox-item-btnSel">
              <div @click="selVipDiscount" :style="selDiscount ? '' : 'border-right: none;'">{{formatSelDt(selDiscount)}}</div>
              <i class="iconfont icon-guanbi" @click="clearDiscount(3)" v-if="selDiscount"></i>
            </div>
          </div>
        </div>
        <div class="main-container-carWrapper-carBox-footer">
          <div class="main-container-carWrapper-carBox-footer-btnGet" @click="getsingle" :style="buttonDisable[1] ? 'pointer-events: none;border: 1px solid rgba(199,177,135,0.1)' : 'border: 1px solid #c7b187'">
            <span :style="buttonDisable[1] ? 'color: rgba(178,178,178,1);' : ''">取单</span>
            <span style="font-weight: bolder;" :style="buttonDisable[1] ? 'color: rgba(178,178,178,1);' : ''">{{singleNumber}}</span>
          </div>
          <div class="main-container-carWrapper-carBox-footer-btnPush" @click="cancelled" :style="buttonDisable[0] ? 'pointer-events: none;background: rgba(182,182,182,1)' : ''">
            <span>挂单</span>
            <span>(最多可挂10单)</span>
          </div>
          <div class="main-container-carWrapper-carBox-footer-btnCash" @click="toOrder">
            收款
          </div>
        </div>
      </div>
    </div>
    <div class="main-container-productWrapper" v-show="!isShowShopDiscounts && !showVipInfo && !showAddVip">
      <div class="main-container-productWrapper-qrInput">
        <img src="../../assets/images/scanvip.png">
        <input type="text" placeholder="请输入或扫描商品条形码" @keydown.enter="GetOncePor" v-model="productCode">
      </div>
      <div style="margin-top: 33px;width: 100%;height: 64px;"></div>
      <div class="main-container-productWrapper-tabWrapper">
        <div class="main-container-productWrapper-tabWrapper-tabBox" :class="{showMore: !isShowMore}">
          <div v-for="(item, index) in typeList" @click="changeType(item.id, index)" class="main-container-productWrapper-tabWrapper-tabBox-item" :class="{active: checkType === item.id}">
            {{item.name}}
            <div class="bottomLine"></div>
          </div>
        </div>
        <div class="main-container-productWrapper-tabWrapper-boxControl" @click="showMore">
          {{isShowMore?"收起":"全部"}}
        </div>
      </div>
      <div class="main-container-productWrapper-productBox" ref="productBox">
        <div class="main-container-productWrapper-productBox-item" v-for="item in productList" @click="open(item.id,item.isSellOut)">
          <div class="model" v-if="item.isSellOut">
            <img src="../../assets/images/nosell.png" style="position: absolute;right: 0;">
          </div>
          <img :src="item.imageUrl" width="100%" height="100%">
          <div class="limit">
            <span v-if="item.joinFixedPrice">一口价</span><span v-if="item.joinFixedPrice&&item.limitBuy>0">{{' 限' + item.limitBuy + '件'}}</span>
          </div>
          <div class="main-container-productWrapper-productBox-item-content">
            <span>{{item.name}}</span>
            <span>{{item.joinFixedPrice?item.marketPrice:item.salePrice | rmb}}{{item.measureUnit&&item.measureUnit!='' ? '/'+item.measureUnit : ''}}</span>
            <span>可售库存: {{item.storeStock}}</span>
            <!-- <div style="position: absolute;right: 4px;bottom: 8px;font-size: 12px;">
              可售库存: {{item.storeStock}}
            </div> -->
          </div>
        </div>
      </div>
      <div class="main-container-productWrapper-paginationBox">
        <el-pagination background :total="total" layout="prev, pager, next" :page-size="pageSize" @current-change="handleCurrentChange"></el-pagination>
      </div>
    </div>
    <div class="sideBar-container-preferentialBox" v-if="isShowShopDiscounts && hasDiscount">
      <div class="sideBar-container-preferentialBox-closeBox">
        <div class="sideBar-container-preferentialBox-closeBox-close" @click="isShowShopDiscounts = false">
          <img src="../../assets/images/menuIcons/x.png">
        </div>
      </div>
      <div class="sideBar-container-preferentialBox-mainWrapper">
        <div class="sideBar-container-preferentialBox-mainWrapper-itemBox">
          <div class="sideBar-container-preferentialBox-mainWrapper-itemBox-header">
            <div></div>
            <span>整单折扣</span>
          </div>
          <div class="sideBar-container-preferentialBox-mainWrapper-itemBox-content">
            <div class="sideBar-container-preferentialBox-mainWrapper-itemBox-content-item" style="background: #B10000;" v-for="item in discountsList" v-if="item.Type === 1" @click="clickDiscount(item)">
              <span>{{item.Value | formatNumber(true)}}</span>
              <span>.{{item.Value | formatNumber(false)}}</span>
              <span>折</span>
            </div>
            <div class="sideBar-container-preferentialBox-mainWrapper-itemBox-content-item" @click="addDiscount(true)">
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
            <div class="sideBar-container-preferentialBox-mainWrapper-itemBox-content-item2" style="background: #AB915F" v-for="item in discountsList" v-if="item.Type === 2" @click="clickDiscount(item)">
              <span>-{{item.Value}}</span>
              <span>元</span>
            </div>
            <div class="sideBar-container-preferentialBox-mainWrapper-itemBox-content-item2" @click="addDiscount(false)">
              +
            </div>
          </div>
        </div>
      </div>
    </div>
    <VipInfo :showType="showType" @close="showVipInfo = false" v-if="showVipInfo"></VipInfo>
    <AddVip :phone="phone" :cardName="cardName" @success="addSuccess" @cancel="addCancel" v-if="showAddVip"></AddVip>
    <div class="sideBar-container-addBox" v-if="addStatus">
      <div class="sideBar-container-addBox-wrapper">
        <img src="../../assets/images/guanbi.png" style="position: absolute;right: 0;top: -50px;" @click="addStatus = false,inputVal = ''">
        <div class="lineToClose"></div>
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
    <div>
      <mu-dialog class="mydailog" :open="skudialog" title="商品信息">
        <i class="iconfont icon-guanbi closeSku" @click="skudialog=false"></i>
        <div class="skuchange" v-if="checkedProduct">
          <div v-if="checkedProduct.skus.length==1">
            <label>已选商品</label>
            <div class="skuWeigh-info" v-if="checkedProduct">
              <img :src="checkedProduct.imageUrl" :onerror="errorImg">
              <div>
                <span class="title">{{checkedProduct.productName}}</span>
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
              <mu-raised-button v-for="(item,index) in color" :key="index" :label="item.value" @click="skuchange($event,item.skuId,'color')" :class="classObject(item.skuId,'color')" />
            </div>
            <div class="skurow" :class="{'showSkuListCheck':size.length>0}" v-show="size.length>0">
              <label>{{spec.spec2}}</label>
              <mu-raised-button v-for="(item,index) in size" :key="index" :label="item.value" @click="skuchange($event,item.skuId,'size')" :class="classObject(item.skuId,'size')" />
            </div>
            <div class="skurow" :class="{'showSkuListCheck':version.length>0}" v-show="version.length>0">
              <label>{{spec.spec3}}</label>
              <mu-raised-button v-for="(item,index) in version" :key="index" :label="item.value" @click="skuchange($event,item.skuId,'version')" :class="classObject(item.skuId,'version')" />
            </div>
          </div>
          <div class="skurow">
            <label>数量 <span v-if="checkedProSkuStock>-1">库存:{{checkedProSkuStock}}</span></label>
            <div class="change" v-if="checkedProduct.productSaleMethod==0">
              <i class="iconfont icon-shanjian" @click="changeSkudiaNum(-1)"></i>
              <span>{{skuSelect.num}}</span>
              <i class="iconfont icon-tianjia" @click="changeSkudiaNum(1)"></i>
            </div>
            <div class="skurow-kg" v-if="checkedProduct.productSaleMethod==1">
              <input type="text" disabled="disabled" v-if="isS2" v-model="weighNum">
              <input type="text" v-focus v-else ref="weighValue" @input="weighInput">
              <span v-if="checkedProduct.measureUnit">{{checkedProduct.measureUnit}}</span>
            </div>
          </div>
          <div>
            <mu-raised-button class="skuSubmit" label="加入列表" @click="addskuPro" />
            <!--<mu-raised-button class="skuSubmit qupiBtn" v-if="isS2&&checkedProduct.productSaleMethod==1" @click="plus_goZero" :label="isQupi?'清零':'去皮'" />-->
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
                <!-- <span class="weigh">{{checkedProduct.name}}</span> -->
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
            <!--<mu-raised-button class="skuSubmit qupiBtn" v-if="isS2&&codeProd.productSaleMethod==1" @click="plus_goZero" :label="isQupi?'清零':'去皮'" />-->
          </div>
        </div>
      </mu-dialog>
    </div>
    <qrface @getMenber="getMenber" @noMenber="noMenber" :is-face="isFace" :url="memberUrl" :member="member" @showqrCode="showqrCode" @closeFace="closeFace" @toFace="toFace" ref="GetMember" @clearMember="clearMember" />
    <div class="loading" v-show="loading">
      <div class="spinner">
        <div class="double-bounce1"></div>
        <div class="double-bounce2"></div>
      </div>
    </div>
    <div class="singleList right" style="width: 64%;" v-if="singleStatus">
      <div class="right_cont">
        <div class="header">
          <button type="button" @click="singleStatus=false" class="close"><i class="iconfont icon-guanbi"></i></button>
          <div>挂单列表<span>&nbsp;({{singleList.length}}</span>单)</div>
          <p style="font-size:12px;color:#ccc;position:absolute;text-align: center;bottom:0;width:100%;bottom:-23px;">挂起的订单超过24小时自动删除</p>
          <button type="button" @click="clearSingle" class="clear"><i class="iconfont icon-qingchuhuancun"></i>清空</button>
        </div>
      </div>
      <div class="section">
        <div v-if="singleList.length<=0" class="enptySingle">
          <img src="../../assets/images/enpty-single.png" />
          <p>您还没有挂起订单哦</p>
        </div>
        <ul>
          <li class="list" v-for="(item,index) in singleList" :key="index">
            <ul class="listDetaile">
              <li>
                <div class="top"><span>挂单时间</span>:&nbsp;<span>{{item.time}}</span></div>
              </li>
              <li class="Detailelist" v-for="(itemlist,index) in item.list" :key="index">
                <div>
                  <div class="imgInfo">
                    <img :src="itemlist.img" />
                  </div>
                  <div class="leftinfo">
                    <span>{{itemlist.proName}}</span>
                  </div>
                  <div class="centerinfo" style="font-size: 16px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                    <span v-if="itemlist.color">{{itemlist.color}}</span>
                    <span v-if="itemlist.size">{{',' + itemlist.size}}</span>
                    <span v-if="itemlist.vesion">{{',' + itemlist.vesion}}</span>
                  </div>
                  <div class="rightinfo">
                    <span class="Number">x</span><span>{{itemlist.num}}</span><span>{{itemlist.measureUnit}}</span>
                  </div>
                </div>
              </li>
              <li class="footer">
                <i class="iconfont icon-yonghu menber"></i>
                <span>会员:</span>
                <span>{{item.member.nick ? item.member.nick:item.member.userName}}</span>
                <span v-if="!item.member.nick || !item.member.userName">游客</span>
                <div class="buttonBox">
                  <button class="delate" type="button" @click="getDetailSingle(index)">取单</button>
                  <button class="getsingle" type="button" @click="delateSingle(index)">删除</button>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import qrface from '@/views/qrface'
import VipInfo from './VipInfo'
import AddVip from './AddVip'
import { mapGetters } from 'vuex'

import Bus from '@/utils/bus'
import { setStore, getStore, removeStore, clearStore } from '@/public/single.js';
import { sendTosecondaryDisplay } from '@/public/sendToSecondaryDisplay.js';
import { getSellerManager, getShopProductsByAutoId, searchProduct, getStoreCategoryContainProduct, getSKUByBarcode, orderSubmitByCart, getShopProductsSKUsByAutoId, getShopDiscounts, getMemberByMemberCard, getMemberById } from '@/api'

var cartUpDateTime = "";
var cartUpsubmitTime = "";
var cartUpSetInterval = true;

function compare(pro) {
  return function(obj1, obj2) {
    var val1 = obj1[pro];
    var val2 = obj2[pro];
    if (val1 > val2) { //正序
      return 1;
    } else if (val1 < val2) {
      return -1;
    } else {
      return 0;
    }
  }
}
export default {
  name: 'index',
  components: { qrface, VipInfo, AddVip },
  data() {
    return {
      // new
      backgroundObj: {
        backgroundImage: `url(${require('@/assets/images/headImg1.png')})`
      },
      total: 0,
      isShowMore: false,
      isShowShopDiscounts: false,
      discountsList: [],
      addStatus: false,
      inputVal: '',
      selBtnValue: '请选择',
      selDiscountItem: '',
      showVipInfo: false,
      showType: 0,
      // vipInfo: this.$store.getters.vipInfo,
      cardDiscount: '',
      moneyDiscount: '',
      phone: '',
      cardName: '',
      showAddVip: false,
      inputType: false,
      // old
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
      productCode: "", //商品扫码code
      checkedStock: {}, //选中商品的库存情况
      cart: [],
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
      pageSize: 28,
      pageNo: 1,
      checkedProduct: null,
      memberUrl: "index",
      isFace: false,
      errorImg: 'this.src="' + require('@/assets/images/imgerror.png') + '"',
      buttonDisable: [true, false],
      singleStatus: false,
      singleNumber: 0,
      singleList: [],
      singleOver: '',
      shopId: '',
      isS2: false,
      isWeiStable: true,
      getWeiTime: null,
      isQupi: false,
    }
  },
  computed: {
    ...mapGetters([
      'selCard',
      'selCoupon',
      'selDiscount',
      'pcNumber'
    ]),
    hasDiscount() {
      if (!this.$store.getters.userInfo.openDiscounts) this.isShowShopDiscounts = false
      return this.$store.getters.userInfo.openDiscounts
    },
    checkedProSkuStock() {
      var sku = this.skuSelect.proid + "_" + this.skuSelect.color + "_" + this.skuSelect.size + "_" + this.skuSelect.version;
      if (this.checkedStock[sku]) {
        if (this.checkedStock[sku].realStock.toString().indexOf(".") != -1) {
          return this.checkedStock[sku].realStock.toFixed(3);
        } else {
          return this.checkedStock[sku].realStock;
        }
      } else {
        return -1;
      }
    }
  },
  created: function() {
    this.getUserId();
    this.member = memberData;
    this.cancellNumber();
    this.cardId = cardId;
    this.cart = carts;

    sendTosecondaryDisplay(this.cart, this.member, {
      total: this.totalAll().total
    }, 1, this);

    if (carts.length != 0) {
      this.getSkuStock();
    }
    this.GetProType();
    var self = this;
    // document.body.addEventListener("keyup", this.bodyKeyUp, false);

    /**初始化双屏设置**/
    var userAgent = navigator.userAgent;
    if (userAgent.indexOf("S2") != -1) {
      this.isS2 = true;
    } else {
      this.isS2 = false;
    }

    function plusReady() {
      if (!self.isS2 || wWeighDisPlays) return;
      var WeighDisPlays = plus.android.importClass("com.WeighDisPlays");
      var main = plus.android.runtimeMainActivity();
      wWeighDisPlays = new WeighDisPlays(main);
			
			
			plus.android.invoke(wWeighDisPlays, "SetOpen");
      self.isS2 = true;
      // self.isWeiStable = false;
    }
    if (window.plus) {
      plusReady();
    } else {
      document.addEventListener("plusready", plusReady, false);
    }
    /**初始化双屏设置End**/

    usbPrint.init()
    if (userAgent.indexOf("t1host") != -1 && userAgent.indexOf("Html5Plus") != -1) {
      document.addEventListener("plusready", function() {
        var savedBleId = localStorage.getItem("bleId")
        if (!savedBleId) {
          SearchBluetooth.Init()
        }
      })
    }
  },
  destroyed: function() {
    // document.body.removeEventListener("keyup", this.bodyKeyUp, false);
    cartUpSetInterval = false;
  },
  methods: {
    formatSelDt(selDiscount) {
      if (!selDiscount) return '请选择'
      else return selDiscount.Type === 1 ? (selDiscount.Value * 10).toFixed(1) + "折" : '-' + selDiscount.Value + '元'
    },
    addSuccess(phone) {
      this.showAddVip = false
      getMemberByMemberCard(phone).then(res => {
        const data = res.data
        if (data.success) {
          this.$store.dispatch('SetVipInfo', data.data)
          this.getMenber(data)
          this.showVipComponet()
        }
      })
    },
    noMenber(phone, cardName) {
      this.isShowShopDiscounts = false
      this.showVipInfo = false
      this.showAddVip = true
      this.phone = phone
      this.cardName = cardName
    },
    clearDiscount(type) {
      if (type === 1) {
        this.$store.dispatch('SetSelCard', '')
      } else if (type === 2) {
        this.$store.dispatch('SetSelCoupon', '')
      } else {
        this.$store.dispatch('SetSelDiscount', '')
      }
    },
    clickDiscount(item) {
      this.$store.dispatch('SetSelDiscount', item)
      this.isShowShopDiscounts = false
      // this.selDiscountItem = item
      // this.selBtnValue = item.Type === 1 ? item.Value * 100 / 10 + "折" : '-' + item.Value + '元'
    },
    selVipCard() {
      if (!this.member) return
      this.isShowShopDiscounts = false
      this.showAddVip = false
      this.showVipInfo = true
      this.showType = 1
    },
    selmoney() {
      if (!this.member) return
      this.isShowShopDiscounts = false
      this.showAddVip = false
      this.showVipInfo = true
      this.showType = 2
    },
    showVipComponet() {
      this.isShowShopDiscounts = false
      this.showAddVip = false
      this.showVipInfo = true
      this.showType = 0
      this.initDiscount()
    },
    initDiscount() {
      const vipInfo = this.$store.getters.vipInfo
      if (vipInfo.memCard.length > 0) {
        vipInfo.memCard.sort(compare('discount'))
        this.$store.dispatch('SetSelCard', vipInfo.memCard[0])
      }
      if (vipInfo.coupons.length > 0) {
        vipInfo.coupons.sort(compare('price'))
        this.$store.dispatch('SetSelCoupon', vipInfo.coupons[vipInfo.coupons.length - 1])
      }
    },
    selVipDiscount() {
      this.showAddVip = false
      this.showVipInfo = false
      this.isShowShopDiscounts = true
      getShopDiscounts().then(res => {
        const data = res.data
        if (data.success) {
          this.discountsList = data.data
        }
      })
    },
    clearMember() {
      this.showAddVip = false
      this.showVipInfo = false
      this.$store.dispatch('SetSelCard', '')
      this.$store.dispatch('SetSelCoupon', '')
      this.$store.dispatch('SetSelDiscount', '')
      this.member = null;
      memberData = null;
    },
    addCancel() {
      this.showAddVip = false
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

      if (e.keyCode == 188) {
        document.getElementById('ffocus').querySelector('input').focus();
        self.memberCode = "";
        self.productCode = "";
      }

      if (e.keyCode == 190) {
        document.getElementById('memberCodeInput').querySelector('input').focus();
        self.memberCode = "";
        self.productCode = "";
      }

      if (self.cart.length == 0) { return; };
      if (self.skudialog) { return };
      if (e.keyCode == 37 || e.keyCode == 39) {
        var add = e.keyCode == 37 ? -1 : 1;
        self.upDataCartNum(self.checkedProid, add);
      }
      // if(e.keyCode==32){
      //      self.toOrder();
      // }
      if (e.keyCode == 38 || e.keyCode == 40) {
        var add = e.keyCode == 38 ? -1 : 1;
        for (var i = 0; i < self.cart.length; i++) {
          if (self.cart[i].skuid == self.checkedProid) {
            if (i == 0 && add == -1) return;
            if (i == (self.cart.length - 1) && add == 1) return;
            self.checkedProid = self.cart[i + add].skuid;
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
    //挂单
    cancelled() {
      var member = {}
      this.$store.dispatch('SetSelCoupon', '')
      this.$store.dispatch('SetSelCard', '')
      this.$store.dispatch('SetSelDiscount', '')
      if (this.member) {
        member = this.member;
      } else {
        member = "游客";
      }
      setStore(this.cart, new Date(), member, this.shopId);
      this.member = null;
      this.cart = [];
      carts = [];
      this.cancellNumber();
    },
    //挂单取单
    getsingle() {
      this.singleStatus = true;
      this.singleList = getStore().datelist;
      this.cancellNumber();
    },
    //挂单数量
    cancellNumber() {
      if (getStore(this.shopId).datelist) {
        this.singleNumber = getStore(this.shopId).datelist.length;
        //         if (this.singleNumber > 0) {
        //           this.buttonDisable[1] = false
        //         }
      }
    },
    //删除某个挂单
    delateSingle(index) {
      for (var i = 0; i <= this.singleList.length; i++) {
        this.singleList.splice(index, 1);
        break;
      }
      removeStore(index);
      this.cancellNumber();
      if (this.singleNumber <= 0) {
        this.buttonDisable[1] = true;
      }
    },
    showMore() {
      this.isShowMore = !this.isShowMore
    },
    //  取单取单
    getDetailSingle(index) {
      var that = this;
      var sku = [];
      var oldList = getStore().datelist[index].list;
      var menber = getStore().datelist[index].member;
      if (menber == "游客") {
        that.member = null;
      } else {
        that.member = menber;
        getMemberById(menber.id).then(res => {
          const data = res.data
          if (data.success) {
            this.$store.dispatch('SetVipInfo', data.data)
            this.showVipComponet()
          }
        })
      }
      for (var i = 0; i <= oldList.length - 1; i++) {
        sku.push(oldList[i].skuid)
      }
      sku = sku.join(",")

      this.delateSingle(index);
      this.singleStatus = false;
      getShopProductsByAutoId(sku).then(function(res) {
        // console.log(res)
        if (res.data.success) {
          for (var i = 0; i <= oldList.length - 1; i++) {
            for (var j = 0; j <= oldList.length - 1; j++) {
              if (oldList[i].skuid == res.data.data[j].shopSku.skuId) {
                oldList[i].joinFixedPrice = res.data.data[j].joinFixedPrice;
                oldList[i].limitBuy = res.data.data[j].limitBuy;
                oldList[i].marketPrice = res.data.data[j].shopSku.maxPrice;
                oldList[i].storeStock = res.data.data[j].shopSku.stock;
                // console.log(oldList[i].proName + "---storeStock:" + oldList[i].storeStock)
                if (oldList[i].storeStock - oldList[i].safeStock > 0) {
                  oldList[i].isStock = true;
                } else {
                  oldList[i].isStock = false;
                }
              }
            }
          }
          //  console.log(that.member);
          that.cart = oldList;
          // console.log(that.cart)
        }
      })
    },
    //清空挂单
    clearSingle() {
      clearStore();
      this.singleNumber = 0;
      this.singleList = [];
      this.buttonDisable[1] = true;
    },
    //获取用户
    getUserId() {
      var that = this;
      getSellerManager().then(function(res) {
        if (res.data.success) {
          that.shopId = res.data.shopId;
          that.cancellNumber();
          for (var i = 0; i < res.data.rights.length; i++) {
            if (res.data.rights[i].id == 13010) {
              if (!res.data.isCashBegin && res.data.openCashierShift) {
                that.$router.push({
                  path: '/setCacherShiftBegin',
                });
              }
            }
          }
        }
      }).catch(error => {

      })
    },
    toFace() {
      this.isFace = true;
    },
    clearCart() {
      this.cart = []
      carts = []
    },
    closeFace: function() {
      this.isFace = false;
    },
    showqrCode: function() {
      this.$emit("showqrCode");
    },
    getMenber(res) {
      this.initDiscount()
      this.member = res.data.cashierUserMember
      // this.vipInfo = res.data
      if ('cardId' in res) {
        this.cardId = res.cardId;
      }
      if ('activityId' in res) {
        this.activityId = res.activityId;
      }
      this.isFace = false;
      memberData = res.data.cashierUserMember;
    },
    GetMemberByCode: function() {
      this.showAddVip = false
      this.$refs.GetMember.GetMember(this.memberCode);
      this.memberCode = "";
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
      for (var i = 0; i < this.cart.length; i++) {
        console.log(this.cart[i].skuid);
        if (this.cart[i].skuid == id) {
          this.cart.splice(i, 1);
          if (this.cart.length > 0) this.checkedProid = this.cart[0].skuid;
          break;
        }
      }
    },
    totalAll: function() {
      var total = 0,
        num = 0;
      for (var i = 0; i < this.cart.length; i++) {
        var price = this.cart[i].joinFixedPrice && this.cart[i].num <= this.cart[i].limitBuy ? this.cart[i].marketPrice : this.cart[i].saleprice;
        total +=  (1*price)*(this.cart[i].num*1);
        num += parseFloat(this.cart[i].num);
      }
      return {
        total: ((total * 100) / 100).toFixed(2),
        num: num
      }
    },
    GetProductList: function(type) { //获取商品
      var self = this;
      self.$refs.productBox.scrollTop = 0 // 每次请求重置div滚动位置
      this.isMore = true;
      if (!this.isLoadingPro) return;
      this.isLoadingPro = false;
      searchProduct(self.checkType, self.pageNo, self.pageSize).then(function(response) {
        self.isMore = false;
        self.isLoadingPro = true;
        var dt = response.data.models;
        self.total = response.data.total
        for (var i = 0; i < dt.length; i++) {
          self.productObject[dt[i].id.toString()] = dt[i];
        }
        self.productList = dt
      });
    },
    GetProduct: function(el) { //获取商品
      this.proCode = "";
    },
    GetProType: function() { //获取商品分类
      var self = this;
      getStoreCategoryContainProduct().then(function(response) {
        for (var i = 0; i < response.data.length; i++) {
          self.typeList.push({ id: response.data[i].id, name: response.data[i].name });
        }
        if(response.data.length > 0) self.checkType = response.data[0].id;
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
            if (response.data.isPriceTag) {
              if (response.data.sellingPrice != response.data.salePrice) {
                self.$toast("商家已改价格，请重新打印价签！");
                return;
              }
              if (response.data.storeStock - response.data.quantity - response.data.safeStock <= 0) {
                self.$toast("库存不足，请重新打印价签！");
                return;
              }
              self.codeAddCart(dt, response.data.quantity);
              return;
            }
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
      for (var i = 0; i < this.cart.length; i++) {
        if (this.cart[i].skuid == dt.autoId) {
          num = this.cart[i].num;
          j = i;
        }
      }
      if ((dt.storeStock - num - addnum) >= dt.safeStock) {
        if (num == 0) {
          this.cart.push({
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

          this.cart[j].num = parseFloat(this.cart[j].num) + parseFloat(addnum);
          if (this.cart[j].num.toString().split(".").length == 2) {
            this.cart[j].num = this.cart[j].num.toFixed(3);
          }
        }
        this.codedialog = false;
        this.checkedProid = dt.autoId;
        this.$toast('成功加入!');
      } else {
        this.$toast('库存不足');
      }
    },
    changeType: function(id, index) { //切换分类
      this.checkType = id;
      this.productObject = {};
      this.productList = [];
      this.pageNo = 1;
      this.GetProductList();
      this.isShowMore = false
      if (index > 8) {
        [this.typeList[8], this.typeList[index]] = [this.typeList[index], this.typeList[8]]
      }
    },
    upDataCartNum: function(id, add) {
      this.checkedProid = id;
      for (var i = 0; i < this.cart.length; i++) {
        if (this.cart[i].skuid == id) {
          if (!this.cart[i].productSaleMethod) {
            if (!this.cart[i].isStock) {
              break;
            }
            if (add == 1) {
              this.addCart(i, 1, this.cart[i].proId, true);
            } else {
              this.cart[i].num = parseInt(this.cart[i].num)
              this.cart[i].num += add;
              if (this.cart[i].num < 1) this.cart[i].num = 1;
            }
          }
        }
      }
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
      proId = proId || this.skuSelect.proid;
      var data = this.productObject[proId];
      addnum = addnum || 1;
      var num = 0,
        j = 0,
        joinFixedPriceNum = 0;
      var joinFixedPrice = isAddCart ? this.cart[idx].joinFixedPrice : data.joinFixedPrice;
      var num = isAddCart ? this.cart[idx].num : 0;
      var j = isAddCart ? idx : 0;
      for (var i = 0; i < this.cart.length; i++) {
        if (!isAddCart && this.cart[i].skuid == data.skus[idx].skuId) {
          num = this.cart[i].num;
          j = i;
        }
        if (joinFixedPrice && this.cart[i].proId == proId) {
          joinFixedPriceNum += this.cart[i].num;
        }
      }
      var stock = num == 0 ? data.skus[idx].stock : this.cart[j].storeStock;
      var safeStock = num == 0 ? data.safeStock : this.cart[j].safeStock;
      var limitBuy = num == 0 ? data.limitBuy : this.cart[j].limitBuy;
      var proName = num == 0 ? this.productObject[proId].name : this.cart[j].proName;
      var skuid = num == 0 ? data.skus[idx].skuId : this.cart[j].skuid;
      if ((stock - num - addnum) >= safeStock) {
        //    if(joinFixedPriceNum+addnum>limitBuy&&joinFixedPrice){
        //         this.$toast("‘"+proName+"’只允许购买"+limitBuy+"件");
        //         return;
        //    }
        if (num == 0) {
          this.cart.push({
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
          var a = this.cart[j].num,
            b = addnum;
          this.cart[j].num = parseFloat(this.cart[j].num) + parseFloat(addnum);
          if (this.cart[j].num.toString().split(".").length == 2) {
            this.cart[j].num = this.cart[j].num.toFixed(3);
          }
        }
        this.skudialog = false;
        this.checkedProid = skuid;
        this.weighNum = "";
      } else {
        this.$toast('库存不足,最大可购买数:' + ((stock - safeStock - num).toFixed(2)));
      }

    },
    changeSkudiaNum: function(add) {
      console.log('add', add)
      if (this.color.length != 0 && this.skuSelect.color == 0) return;
      if (this.size.length != 0 && this.skuSelect.size == 0) return;
      if (this.version.length != 0 && this.skuSelect.version == 0) return;
      if (add > 0) {
        var skuid = this.skuSelect.proid + "_" + this.skuSelect.color + "_" + this.skuSelect.size + "_" + this.skuSelect.version,
          checkedNum = 0,
          data = this.checkedStock[skuid];
        for (var i = 0; i < this.cart.length; i++) {
          if (this.cart[i].skuid == data.skuId) {
            checkedNum = this.cart[i].num;
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

      // this.getSkuStock();
      // return;
      if (this.loading) {
        return;
      }
      if (this.cart.length == 0) {
        this.$toast("请先添加商品");
        return;
      }
      userId = this.member ? this.member.id : 0;
      var self = this;
      var productSKU = [];
      var joinFixedPrice = true;
      for (var i = 0; i < this.cart.length; i++) {
        if (this.cart[i].isStock) {
          productSKU.push({ ProductId: this.cart[i].proId, SKUId: this.cart[i].skuid, Count: this.cart[i].num, ShopSkuId: this.cart[i].shopskuid });
        }
        if (this.cart[i].joinFixedPrice && userId == 0) {
          joinFixedPrice = false;
          break;
        }
      }
      if (!joinFixedPrice) {
        this.$toast("购买一口价商品需关联会员！");
        return false;
      }
      this.loading = true;
      goOrderData = {
        productSKU: productSKU,
        userId: userId,
        cardId: self.selCard.cardId || 0,
        activityId: self.selCoupon.activityId || 0
      }
      orderSubmitByCart(goOrderData).then(function(response) {
        carts = self.cart
        cardId = self.cardId
        if (response.data.success) {
          subdata = response.data
          indexData = { member: self.member, checkedProid: self.checkedProid }
          self.$router.push({ path: '/order', query: { item: self.selDiscount } })
          self.loading = false
          var ts = ""
          if (response.data.fixedPriceBeyondMaxCount) {
            ts += "部分商品超过限购数量，恢复原价；"
          }
          if (response.data.BaskedRebatePrice) {
            ts += "部分商品价格已根据会员特权调整；"
          }
          if (ts != "") {
            self.$toast(ts)
          }
        } else {
          self.$toast(response.data.msg)
          self.loading = false
          if (response.data.msg == "部分商品库存不足") {
            self.getSkuStock()
          }
        }
      })
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
          for (var j = 0; j < self.cart.length; j++) {
            var mystock = response.data.data[i].stock - response.data.data[i].baseSKU.safeStock;
            if (mystock <= 0 && response.data.data[i].skuId == self.cart[j].skuid) {
              self.cart[j].isStock = false;
            }
            if (mystock > 0 && mystock < self.cart[j].num && response.data.data[i].skuId == self.cart[j].skuid) {
              self.cart[j].num = mystock;
            }
          }
        }
        console.log(self.cart);
      });
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.GetProductList()
    },
    numberOnly: function(vv, l) {
      if (vv == "") {
        return 0;
      }
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
    intNum: function(val) {
      if (val == "") {
        return 0;
      }
      if (val.length == 1) {
        var val = val.replace(/[^1-9]/g, '')
      } else {
        var val = val.replace(/\D/g, '')
      }
      if (val.indexOf(".") < 0 && val != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        if (val.substr(0, 1) == '0' && val.length == 2) {
          val = val.substr(1, val.length);
        }
      }
      return val;

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
    weighListInput: function(sku, type) {
      for (var i = 0; i < this.cart.length; i++) {
        if (this.cart[i].skuid == sku) {
          if (type == 1) {
            var a = parseFloat(this.intNum(this.cart[i].num));
          } else {
            var a = parseFloat(this.numberOnly(this.cart[i].num, 3));
          }
          if (a > (this.cart[i].storeStock - this.cart[i].safeStock)) {
            this.$toast("库存不足,最大可购买数:" + (this.cart[i].storeStock - this.cart[i].safeStock));
            this.cart[i].num = this.cart[i].storeStock - this.cart[i].safeStock
          } else {
            this.cart[i].num = this.numberOnly(this.cart[i].num, 3);
          }
        }
      }
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
    },
    inputValue(val) {
      if (val === 'clear') {
        this.inputVal = ''
      } else if (val === 'delete') {
        this.inputVal = this.inputVal.substring(0, this.inputVal.length - 1)
      } else {
        // if (!this.inputVal && (val === '00' || val === '.')) { // 不能00开头
        //   return
        // }
        // if (this.inputVal[0] === '0' && this.inputVal.length === 1 && val === '0') {
        //   return
        // }
        // if (this.inputVal.indexOf('.') >= 0 && val === '.') {
        //   return
        // }
        // if (this.inputVal.indexOf('.') >= 0 && this.inputVal.split(".")[1].length >= 2) {
        //   return
        // }
        // const temp = this.inputVal + val
        // if (this.inputType ? (temp * 1 > 9.9 || temp.length > 3) : temp * 1 > 10000) {
        //   return
        // }
        this.inputVal += val
      }
    },
    submitDiscount() {
      // if (!this.inputVal) {
      //   this.$toast('输入不能为空')
      //   return
      // }
      // if (this.inputVal[this.inputVal.length - 1] === '.' || this.inputVal * 1 === 0) {
      //   this.$toast('输入格式有误')
      //   return
      // }
      const re = this.inputType ? /^(?=0\.[1-9]|[1-9]\.\d).{3}$|^([1-9])$/ : /^[1-9][0-9]{0,3}?(\.[0-9]{1,2})?$|^10000$/
      if (re.test(this.inputVal) || (!this.inputType && this.inputVal * 1 === 10000)) {
        this.$store.dispatch('SetSelDiscount', {
          Type: this.inputType ? 1 : 2,
          Value: this.inputType ? this.inputVal / 10 : this.inputVal
        })
        this.addStatus = false
        this.isShowShopDiscounts = false
        this.inputVal = ''
      } else {
        this.$toast('输入格式有误')
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
  watch: {
    //是否能挂单
    cart: {
      handler(newValue, oldValue) {
        if (this.cart.length > 0 && this.singleNumber < 10) {
          this.buttonDisable[0] = false;
          this.singleOver = "";
        } else {
          this.buttonDisable[0] = true;
          this.singleOver = "(最多可挂10单)";
        }
        if (this.cart.length > 0) {

          this.buttonDisable[1] = true;
        } else {
          this.buttonDisable[1] = false;
        }
        if (this.singleNumber == 0) {
          this.buttonDisable[1] = true;
        }
        cartUpDateTime = new Date() * 1;
        sendTosecondaryDisplay(this.cart, this.member, {
          total: this.totalAll().total
        }, 1, this);
      },
      deep: true
    },
    member: function() {
      sendTosecondaryDisplay(this.cart, this.member, {
        total: this.totalAll().total
      }, 1, this);
    },
    skudialog: function(v) {
      if (v) {
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

        /**S2称重处理**/

        if (this.isS2) {
						 self.getWeiTime = setInterval(function() {
							try {
								var val = plus.android.getAttribute(wWeighDisPlays, "mStableWeight");
								var mStatus = plus.android.getAttribute(wWeighDisPlays, "mStatus");
								
								if (self.checkedProduct.measureUnit == "g") {
									self.weighNum = val;
								} else {
									self.weighNum = (val/1000).toFixed(3);
								}
							} catch (e) {
								alert("error");
							}
						 }, 500);
        }
        /**S2称重处理**/
      } else {
        if (this.getWeiTime) clearInterval(this.getWeiTime);
        if (this.isS2) plus.android.invoke(wWeighDisPlays, "SetClose");
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
								if (self.checkedProduct.measureUnit == "g") {
									self.weighNum = val;
								} else {
									self.weighNum = (val / 1000).toFixed(3);
								} 
							} catch (e) {
								alert(JSON.stringify(e));
							}
						}, 500);
					}
					/**S2称重处理**/
				} else {
					if (this.getWeiTime) clearInterval(this.getWeiTime);
					if (this.isS2) plus.android.invoke(wWeighDisPlays, "SetClose");
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
    formatNumber(value, isLeftNum) {
      if (isLeftNum) return value.toString().slice(2, 3)
      else return value.toString().slice(3, 4) || 0
    }
  }

}

</script>
<style lang="scss" scoped>
.active {
  color: rgba(51, 51, 51, 1);
  .bottomLine {
    width: 17px;
    height: 5px;
    background: rgba(199, 177, 135, 1);
    border-radius: 3px;
    display: block;
  }
}

.showMore {
  height: 26px;
  overflow: hidden;
  box-shadow: none!important;
}

.bottomLine {
  display: none;
}

.flex {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex2 {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.main-container {
  display: flex; // margin-top: 54px;
  &-carWrapper {
    height: 100%;
    width: 36%;
    background: rgba(241, 241, 241, 1);
    padding: 20px 0 6px 20px;
    &-carBox {
      width: 100%;
      height: 100%;
      background: #fff;
      &-clearBox {
        height: 40px;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 18px;
        div {
          @extend .flex;
        }
      }
      &-header {
        @extend .flex;
        height: 90px;
        padding: 17px 19px 14px 19px;
        &-wall {
          width: 1px;
          height: 47px;
          background: rgba(0, 0, 0, 0.1);
        }
        &-showVip {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          background: rgba(247, 247, 247, 1);
          padding: 0 23px;
          justify-content: space-between;
          &-left {
            @extend .flex;
            border: 1px solid rgba(0, 0, 0, 0.2);
            padding: 0 10px;
            & span:nth-child(1) {
              font-size: 18px;
              color: rgba(199, 178, 135, 1);
              font-weight: bold;
            }
            & span:nth-child(2) {
              font-size: 16px;
              color: rgba(102, 102, 102, 1);
              margin-left: 26px;
            }
          }
          i {
            color: rgba(0, 0, 0, 0.1);
            font-size: 22px;
          }
        }
        &-faceVip,
        &-scanVip {
          @extend .flex;
          width: calc((100% - 1px) / 2);
          height: 100%;
          background: RGBA(247, 247, 247, 1);
          font-size: 16px;
          color: rgba(102, 102, 102, 1);
          span {
            margin-left: 8px;
          }
          input {
            background: rgba(247, 247, 247, 1);
            width: 117px;
            margin-left: 8px;
          }
        }
      }
      &-center {
        height: calc(100% - 267px);
        padding: 0 8px;
        overflow-y: scroll;
        &::-webkit-scrollbar {
          display: none;
        }
        &-productWrapper {

          &-productItem {
            height: 100px;
            padding: 18px 16px 18px 6px;
            display: flex;
            position: relative;
            .model {
              position: absolute;
              top: 0;
              bottom: 0;
              right: 0;
              left: 0;
              background: rgba(255, 255, 255, 0.8);
            }
            &-sizeBox {
              margin-left: 14px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              width: calc(100% - 64px);
              & span:nth-child(1) {
                font-size: 16px;
                color: rgba(51, 51, 51, 1);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              & span:nth-child(2) {
                font-size: 14px;
                color: rgba(153, 153, 153, 1);
              }
              & span:nth-child(3) {
                font-size: 14px;
                color: rgba(190, 34, 34, 1);
              }
            }
            &-toolBox {
              position: absolute;
              width: 133px;
              height: 30px;
              bottom: 13px;
              right: 16px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              &-iconControl {
                display: flex;
                align-items: center;
                input {
                  width: 54px;
                  text-align: center;
                  border: 1px solid rgba(214, 214, 214, 1);
                  height: 24px;
                  margin: 0 3px;
                  border-radius: 3px;
                }
                .icon-jian {
                  width: 24px;
                  height: 24px;
                  border: 1px solid rgba(214, 214, 214, 1);
                  border-radius: 3px;
                  text-align: center;
                  line-height: 22px;
                }
                .icon-tianjia1 {
                  width: 24px;
                  height: 24px; // border: 1px solid rgba(214, 214, 214, 1);
                  background: rgba(199, 177, 135, 1);
                  color: #fff;
                  border-radius: 3px;
                  text-align: center;
                  line-height: 22px;
                }
              }
              .inputControl {
                width: 112px;
                height: 24px;
                border-radius: 3px;
                border: 1px solid #d6d6d6;
                text-align: center;
              }
            }
          }
        }
      }
      &-discountBox {
        height: 79px;
        background: #f9f7f3; // padding: 0 56px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        &-item {
          text-align: center;
          & div:nth-child(1) {
            color: #666666;
            font-size: 14px;
          }
          & div:nth-child(2) {
            font-size: 14px;
            color: rgba(199, 177, 135, 1);
            margin-top: 12px;
          }
          &-btnSel {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 138px;
            height: 28px;
            border: 1px solid #C7B187;
            border-radius: 14px;
            margin-top: 6px!important;
            div {
              border-right: 1px solid #C7B187;
              width: 100px;
              color: #C7B187!important;
              font-size: 14px;
              font-weight: bolder;
            }
            i {
              color: #C7B187;
              font-size: 8px;
              margin-left: 6px;
            }
          }
        } // &-item:not(:first-child) {
        //   position: relative;
        //   left: 30px;
        // }
      }
      &-footer {
        @extend .flex;
        height: 58px;
        &-btnGet {
          flex: 1.5;
          font-size: 16px;
          background: #fff;
          height: 100%;
          @extend .flex;
          & span:nth-child(2) {
            color: rgba(200, 38, 38, 1);
            margin-left: 5px;
          }
        }
        &-btnPush {
          @extend .flex2;
          flex: 1.5;
          background: rgba(199, 177, 135, 1);
          height: 100%;
          span {
            color: rgba(255, 255, 255, 1);
          }
        }
        &-btnCash {
          flex: 2;
          background: rgba(65, 65, 65, 1);
          height: 100%;
          font-size: 18px;
          color: rgba(199, 177, 135, 1);
          text-align: center;
          line-height: 58px;
          font-weight: bold;
        }
      }
    }
  }
  &-productWrapper {
    height: 100%;
    width: 64%;
    padding: 30px 30px 0 30px;
    position: relative;
    background: #f1f1f1;
    &-qrInput {
      @extend .flex;
      width: 362px;
      height: 48px;
      border-radius: 24px;
      border: 1px solid rgba(199, 177, 135, 0.9);
      margin: auto;
      input {
        margin-left: 10px;
        width: 162px;
        background: #f1f1f1;
      }
    }
    &-tabWrapper {
      // @extend .flex;
      display: flex;
      font-size: 14px;
      color: #666666;
      position: absolute;
      top: 125px;
      right: 0;
      left: 30px;
      z-index: 2;
      &-tabBox {
        width: calc(100% - 50px);
        background: #f1f1f1;
        box-shadow: 0px 25px 10px -20px rgba(0, 0, 0, 0.1);
        &-item {
          display: inline-block;
          width: calc(100% / 9);
          min-height: 26px;
          padding-bottom: 14px;
        }
      }
      &-boxControl {
        width: 50px;
        font-size: 12px;
        color: #c7b187;
        box-shadow: -12px 0px 11px -7px rgba(173, 167, 167, 0.4);
        height: 40px;
        line-height: 40px;
        position: relative;
        top: -11px;
        padding-left: 10px;
        left: -10px;
      }
    }
    &-productBox {
      max-height: calc(100% - 188px);
      overflow-y: scroll;
      display: flex;
      flex-wrap: wrap;
      &::-webkit-scrollbar {
        display: none;
      }
      &-item {
        padding: 18px;
        width: calc((64vw - 60px) / 4);
        height: calc((64vw - 60px) / 4);
        position: relative;
        .model {
          position: absolute;
          top: 18px;
          bottom: 18px;
          right: 18px;
          left: 18px;
          background: rgba(255, 255, 255, 0.8);
          z-index: 1;
        }
        &-content {
          position: absolute;
          background: rgba(255, 255, 255, 0.8);
          bottom: 18px;
          left: 18px;
          right: 18px;
          height: 56px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-left: 10px;
          & span:nth-child(1) {
            font-size: 14px;
            color: rgba(51, 51, 51, 1);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          & span:nth-child(2) {
            font-size: 14px;
            line-height: 14px;
            color: rgba(190, 34, 34, 1);
          }
        }
        .limit {
          position: absolute;
          bottom: 74px;
          padding-left: 10px;
          span {
            padding: 4px 5px;
            color: #fff;
            font-size: 12px;
            background: rgba(199, 177, 135, 1);
            border-radius: 4px;
          }
          & span:nth-child(2) {
            margin-left: 10px;
          }
        }
      }
    }
    &-paginationBox {
      position: absolute;
      bottom: 6px;
      right: 20px;
    }
  }
}

.disabledd {
  border: 1px solid rgba(0, 0, 0, 0.3)!important;
  div {
    color: rgba(0, 0, 0, 0.3)!important;
  }
  i {
    color: rgba(0, 0, 0, 0.3)!important;
  }
}

.sideBar-container-preferentialBox {
  // position: fixed;
  background: #fff; // top: 0;
  // right: 0;
  // left: 498px;
  border-left: 1px solid rgba(0, 0, 0, 0.1); // bottom: 0;
  // z-index: 1000;
  height: 100%;
  width: 64%;
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
          background: rgba(0, 0, 0, 0.1);
          display: inline-block;
          width: calc((64vw - 316px) / 6);
          height: calc(((64vw - 316px) / 6) * 0.8);
          @media screen and(max-width: 1440px) {
            width: calc((64vw - 265px) / 6);
            height: calc(((64vw - 265px) / 6) * 0.8);
          }
          & span:nth-child(1) {
            color: #fff;
            font-size: calc(((64vw - 316px) / 6) * 0.5);
            line-height: calc(((64vw - 316px) / 6) * 0.8);
            @media screen and(max-width: 1440px) {
              line-height: calc(((64vw - 265px) / 6) * 0.8);
              font-size: calc(((64vw - 265px) / 6) * 0.5);
            }
            font-weight: bold;
          }
          & span:nth-child(2) {
            color: #fff;
            font-size: calc(((64vw - 316px) / 6) * 0.25);
            line-height: calc(((64vw - 316px) / 6) * 0.8);
            @media screen and(max-width: 1440px) {
              line-height: calc(((64vw - 265px) / 6) * 0.8);
              font-size: calc(((64vw - 265px) / 6) * 0.25);
            }
            font-weight: bold;
          }
          & span:nth-child(3) {
            color: #fff;
            font-size: 16px;
            line-height: calc(((64vw - 316px) / 6) * 0.8);
            @media screen and(max-width: 1440px) {
              line-height: calc(((64vw - 265px) / 6) * 0.8);
              font-size: 12px;
            }
            font-weight: bold;
          }
        }
        &-item:nth-of-type(n+2) {
          @media screen and(max-width: 1440px) {
            margin-left: 20px;
          }
          margin-left: 40px;
        }
        &-item:last-child {
          text-align: center;
          color: #fff;
          font-size: calc(((64vw - 316px) / 6) * 0.5);
          line-height: calc(((64vw - 316px) / 6) * 0.8);
          @media screen and(max-width: 1440px) {
            font-size: calc(((64vw - 265px) / 6) * 0.5);
            line-height: calc(((64vw - 265px) / 6) * 0.8);
          }
        }
        &-item2 {
          text-align: center;
          position: relative;
          vertical-align: bottom;
          background: rgba(0, 0, 0, 0.1);
          display: inline-block;
          width: calc((64vw - 316px) / 6);
          height: calc(((64vw - 316px) / 6) * 0.8);
          @media screen and(max-width: 1440px) {
            width: calc((64vw - 265px) / 6);
            height: calc(((64vw - 265px) / 6) * 0.8);
          }
           & span:nth-child(1) {
            color: #fff;
            font-size: calc(((64vw - 316px) / 6) * 0.19);
            line-height: calc(((64vw - 316px) / 6) * 0.8);
            @media screen and(max-width: 1440px) {
              font-size: calc(((64vw - 265px) / 6) * 0.19);
              line-height: calc(((64vw - 265px) / 6) * 0.8);
            }
            font-weight: bold;
          }
          & span:nth-child(2) {
            color: #fff;
            font-size: 16px;
            line-height: calc(((64vw - 316px) / 6) * 0.8);
            @media screen and(max-width: 1440px) {
              line-height: calc(((64vw - 265px) / 6) * 0.8);
              font-size: 12px;
            }
            font-weight: bold;
          }
        }
        &-item2:nth-of-type(n+2) {
          @media screen and(max-width: 1440px) {
            margin-left: 20px;
          }
          margin-left: 40px;
        }
        &-item2:last-child {
          text-align: center;
          color: #fff;
          font-size: calc(((64vw - 316px) / 6) * 0.5);
          line-height: calc(((64vw - 316px) / 6) * 0.8);
          @media screen and(max-width: 1440px) {
            font-size: calc(((64vw - 265px) / 6) * 0.5);
            line-height: calc(((64vw - 265px) / 6) * 0.8);
          }
        }
      }
    }
  }
}

.sideBar-container-addBox {
  position: fixed;
  background: rgba(0, 0, 0, 0.4);
  top: 0;
  right: 0;
  left: 0;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  bottom: 0;
  z-index: 1010;
  .lineToClose {
    width: 1px;
    height: 13px;
    position: absolute;
    top: -14px;
    right: 17px;
    background: #fff;
  }
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
    position: relative;
    width: 485px;
    text-align: center;
    padding: 40px 0 25px 0;
    margin: auto;
    background: #fff;
    margin-top: 100px;
    &-header {
      display: flex;
      align-items: center;
      justify-content: center;
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
      margin-left: 86px;
      margin-top: 30px;
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

</style>
