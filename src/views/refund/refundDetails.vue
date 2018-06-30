<template>
  <div class="orderDetails" v-if="orderDetails">
         <div class="orderDetailsIn">
              <div class="orderDetailsType success">
                    <i class="iconfont icon-dui"></i>
                    <span>{{orderDetails.refundStatus}}<br />
                      <em>售后发起人：{{orderDetails.initiatorName}}</em>
                      <em>退款时间：{{orderDetails.sellerAuditDate | formatDate}}</em><br />
                      <em>售后方式：{{orderDetails.refundModes=="退货退款"?"退货退款":"仅退款"}}</em>
                    </span>
              </div>
              <div class="orderDetailsItem">
                   <div class="m28">
                         <div class="orderDetails-top">
                               <div class="ot-left">订单号:{{orderDetails.orderIdStr}}</div>
                               <div class="ot-right">收银员:{{orderDetails.cashierName}}</div>
                         </div>
                         <div class="orderPorductlist">
                              <div class="img"><img :src="orderDetails.orderItemData.showImage"/></div>
                              <div class="proName">{{orderDetails.orderItemData.productName}}</div>
                              <div class="spec">
                                <span v-if="orderDetails.orderItemData.color">"{{orderDetails.orderItemData.color}}"</span>
                                <span v-if="orderDetails.orderItemData.size">"{{orderDetails.orderItemData.size}}"</span>
                                <span v-if="orderDetails.orderItemData.version">"{{orderDetails.orderItemData.version}}"</span>
                              </div>
                              <div class="price">{{orderDetails.orderItemData.salePrice | rmb}}<em v-if="orderDetails.orderItemData.productSaleMethod==1">/{{orderDetails.orderItemData.measureUnit}}</em></div>
                              <div class="count">x{{orderDetails.orderItemData.returnQuantity}}</div>
                         </div>
                         <div class="orderDetails-footer">
                              <!-- <p>实付金额: {{orderDetails.enabledRefundAmount | rmb}}</p> -->
                              <p v-if="orderDetails.refundIntegralAmount>0">实退积分:{{orderDetails.refundIntegralAmount | rmb}}</p>
                              <p>实退金额: <em class="red">{{orderDetails.refundPrice | rmb}}</em></p>
                         </div>
                   </div>
              </div>
              <div class="orderDetailsItem">
                   <div class="m28">
                         <div class="orderDetails-top">
                               <div class="ot-left">其他信息</div>
                               <div class="ot-right">会员:{{orderDetails.userName=="tourist"?"游客":orderDetails.userName}}
                                    <span v-if="orderDetails.cellPhone">({{orderDetails.cellPhone}})</span>
                               </div>
                         </div>
                         <div class="orderMsg">
                               <div class="msgCol full"><span>退款理由:</span>{{orderDetails.reason}}</div>
                               <div class="msgCol full"><span>备注:</span>{{orderDetails.text?orderDetails.text:'无'}}</div>
                         </div>
                  </div>
              </div>
         </div>
  </div>
</template>
<script>
import '@/assets/css/orderItems.css'
import { getRefundOrderDetail } from '@/api'

export default {
  data(){
        return{
              orderDetails:null,
        }
  },
  created:function(){
    this.$emit("changeTitle","售后详情");
    this.$emit("isBack",true);
    this.getShopOrderDetail(this.$route.params.id);
  },
  mounted () {
  },
  methods:{
      refundDetails:function(){
           this.$router.push({
              path: '/refundDetails/'+this.$route.params.id,
           })
      },
      getShopOrderDetail:function(id){
           var self = this
           getRefundOrderDetail(id).then(function(res){
             console.log(res.data);
                self.orderDetails = res.data;
           })
      }
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
