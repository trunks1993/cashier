<template>
  <div class="orderDetails" v-if="orderDetails">
         <div class="orderDetailsIn">

              <div class="orderDetailsType success" v-if="orderDetails.orderStatus==6&&refundNum==0">
                    <i class="iconfont icon-dui"></i>
                    <span>交易成功</span>
              </div>
              <div class="orderDetailsType closeOrder" v-if="orderDetails.orderStatus==5">
                    <i class="iconfont icon-dui"></i>
                    <span>交易关闭<br ><em>订单已全额退款，交易自动关闭</em></span>
              </div>
              <div class="orderDetailsType infOrder" v-if="orderDetails.orderStatus==6&&refundNum!=0">
                    <i class="iconfont icon-dui"></i>
                    <span>交易成功<br ><em>有{{refundNum}}笔退款，金额 {{refundMoney | rmb}}</em></span>
              </div>
              <div class="orderDetailsItem">
                   <div class="m28">
                         <div class="orderDetails-top">
                               <div class="ot-left">订单号:{{orderDetails.orderId}}</div>
                               <div class="ot-right">
                                 <span v-if="orderDetails.initiatorType==3||orderDetails.initiatorType==1">收银员</span>
                                 <span v-if="orderDetails.initiatorType==2">导购</span>
                                 :{{orderDetails.initiatorName}}</div>
                         </div>
                         <div class="orderPorductlist" v-for="item in orderDetails.newOrderItem" :key="item.orderId">
                              <div class="img"><img :src="item.showImage"/></div>
                              <div class="proName">{{item.productName}}</div>
                              <div class="spec">
                                <span v-if="item.color">"{{item.color}}"</span>
                                <span v-if="item.size">"{{item.size}}"</span>
                                <span v-if="item.version">"{{item.version}}"</span>
                              </div>
                              <div class="price">{{item.salePrice | rmb}}<em v-if="item.productSaleMethod==1">/{{item.measureUnit}}</em></div>
                              <div class="count">
                                x{{item.quantity}}
                                <em class="tips">{{item.refundStatus}}</em>
                              </div>
                         </div>
                         <div class="orderDetails-footer">
                              <p>合计:{{orderDetails.productTotalAmount | rmb}}</p>
                              <p v-if="orderDetails.discountAmount>0">优惠金额:{{orderDetails.discountAmount |frmb}}</p>
                              <p v-if="orderDetails.integralDiscount>0">积分抵扣: {{orderDetails.integralDiscount | rmb}}</p>
                              <p v-if="orderDetails.cashierDiscountsAmount>0">{{orderDetails.discountsType === 1 ? '整单折扣' : '整单减价'}}: {{orderDetails.discountsType === 1 ? orderDetails.cashierDiscountsValue * 10 + `折(-￥${orderDetails.cashierDiscountsAmount})` : '-' + orderDetails.cashierDiscountsAmount + '元'}}</p>
                              <p>实付金额: <em>{{orderDetails.orderStatus==1?0:orderDetails.totalAmount | rmb}}</em></p>
                              <p v-if="orderDetails.orderStatus!=1">(其中:
                                <span v-if="orderDetails.prepaymentsAmount>0">预存款{{orderDetails.prepaymentsAmount | rmb}}</span>
                                <span v-if="orderDetails.paymentTypeName!='预存款支付'">{{orderDetails.paymentTypeName}}{{(orderDetails.totalAmount-orderDetails.prepaymentsAmount).toFixed(2) | rmb}}</span>)
                              </p>
                         </div>
                   </div>
              </div>
              <div class="orderDetailsItem">
                   <div class="m28">
                         <div class="orderDetails-top">
                               <div class="ot-left">订单信息</div>
                               <div class="ot-right">会员:{{orderDetails.nick?orderDetails.nick:orderDetails.userName}}
                                             <span v-if="orderDetails.cellPhone">({{orderDetails.cellPhone}})</span>
                               </div>
                         </div>
                         <div class="orderMsg">
                               <div class="msgCol"><span>订单单号:</span>{{orderDetails.orderId}}</div>
                               <div class="msgCol"><span>支付流水号:</span>{{orderDetails.gatewayOrderId || "无"}}</div>
                               <div class="msgCol"><span>支付方式:</span>{{orderDetails.paymentTypeName || "无"}}</div>
                               <div class="msgCol" v-if="orderDetails.createTime"><span>创建时间:</span>{{orderDetails.createTime | formatDate }}</div>
                               <div class="msgCol" v-if="orderDetails.payDate"><span>支付时间:</span>{{orderDetails.payDate  | formatDate}}</div>
                               <div class="msgCol" v-if="orderDetails.finishDate"><span>完成时间:</span>{{orderDetails.finishDate  | formatDate}}</div>
                         </div>
                  </div>
              </div>
              <div class="orderDetailsBtn">
                  <mu-raised-button v-if="IsRefund&&(orderDetails.orderStatus==6||orderDetails.orderStatus==2||orderDetails.orderStatus==4)&&!refundLength(orderDetails.newOrderItem)" @click="refundDetails" label="发起售后" class="button"/>
                  <mu-raised-button label="打印小票" @click="print" class="button"/>
              </div>
              <pcPrinter ref="printer"></pcPrinter>
         </div>
  </div>
</template>
<script>
import pcPrinter from "@/views/pcPrinter"
import '@/assets/css/orderItems.css'
import { getShopOrderDetail, getRefundInfo } from '@/api'

export default {
  components:{pcPrinter},
  data(){
        return{
              orderDetails:null,
              refundNum:0,
              refundMoney:0,
              isCashBegin:this.$store.getters.iscashier,
              userInfo:this.$store.getters.userInfo,
							isOpenCashierShift:this.$store.getters.userInfo.openCashierShift
        }
  },
  created:function(){
		
    this.$emit("isBack",true);
    this.getShopOrderDetail(this.$route.query.id);
    this.getRefundInfo(this.$route.query.id);
  },
	computed: {
			IsRefund() {
				var isHasJjb = false;
				for(var i=0;i<this.userInfo.rights.length;i++){
						if(this.userInfo.rights[i].name=="交接班"){
								isHasJjb = true;
								break;
						}
				}
				var ist = false;
				if(isHasJjb){
						if(!this.isOpenCashierShift){
								ist = true;
						} else{
							if(this.isCashBegin){
									ist = true;
							}
						}
				}else{
						ist = true;
				}
				
				return ist;
			}
	},
  mounted () {
  },
  methods:{
			refundLength: function (obj) {
					var x = 0;
					for (var i = 0; i < obj.length; i++) {
							if (obj[i].refundStatus) {
									x++;
							}
					}
					return x == obj.length;
			},
      refundDetails:function(){
           this.$router.push({
              path: '/launchDetails/'+this.$route.query.id,
           });
      },
      print:function(){
           this.$refs.printer.orderList(this.orderDetails);
      },
      updateCashBegin:function(val){
          this.isCashBegin = val;
      },
      getShopOrderDetail:function(orderId){
           var self = this;
           getShopOrderDetail(orderId).then(function(res){
                self.orderDetails = res.data;
           })
      },
      getRefundInfo:function(orderId){
          getRefundInfo(orderId).then(res => {
            console.log('res',res)
               this.refundNum = res.data.length;
               for(var i=0;i<res.data.length;i++){
                  this.refundMoney+=res.data[i].amount;
               }
          })
      },
  },
  filters: {
    rmb: function (value) {
      return "￥"+(parseFloat(value).toFixed(2))
    },
    frmb: function (value) {
      return "-￥"+(parseFloat(value).toFixed(2))
    },
    formatDate: function(value){
      var t= value.slice(6, 19)
      var dt = new Date(parseInt(t));
      var year = dt.getFullYear();
      var month = (dt.getMonth() + 1)>9?(dt.getMonth() + 1):"0"+(dt.getMonth() + 1);
      var date = dt.getDate()>9?dt.getDate():"0"+dt.getDate();
      var hour = dt.getHours()>9?dt.getHours():"0"+dt.getHours();
      var minute = dt.getMinutes()>9?dt.getMinutes():"0"+dt.getMinutes();
      var second = dt.getSeconds()>9?dt.getSeconds():"0"+dt.getSeconds();
      return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    }
  }
}

</script>
