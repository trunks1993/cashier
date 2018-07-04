<template>
    <div>
         <div class="left success" >
            <div class="left_cont">
                <pcPrinter ref="printer"></pcPrinter>
                <div class="success_info" id="success_info">
          				   <ul>
                         <li>
                             <p>{{successData.orderCreateTime}}</p>
                             <p>订单号：{{orderModel.orderId}}</p>
                         </li>
                         <li>
                             <div v-for="item in productList">
                                 <p>{{item.productName}} <span v-for="itemin in item.specifications" style="font-size:12px;">{{itemin}};</span></p>
                                 <h3 v-if="item.salePrice>0">{{item.salePrice | rmb}}<span v-if="item.measureUnit&&item.measureUnit!=''">/{{item.measureUnit}}</span> <em>x{{item.buyNum}}</em></h3>
                             </div>
                         </li>
                          <li class="sm">
                               <mu-list>
                                    <mu-list-item class="list sm" title="商品合计" :afterText="successData.totalAll.moneyTotal | rmb"></mu-list-item>
                                    <mu-list-item class="list sm" v-if="successData.totalAll.activities>0" title="活动优惠" :afterText="successData.totalAll.activities | frmb"></mu-list-item>
                                    <mu-list-item class="list sm" v-if="successData.totalAll.coupon>0" title="优惠券" :afterText="successData.totalAll.coupon | frmb"></mu-list-item>
                                    <mu-list-item class="list sm" v-if="successData.isIntegral&&successData.integral>0" title="积分" :afterText="successData.integral | frmb"></mu-list-item>
                                    <!-- <mu-list-item class="list sm" v-if="successData.removeSmallChange>0" title="抹零" :afterText="successData.removeSmallChange | frmb"></mu-list-item> -->
                                    <mu-list-item v-if="this.$store.getters.userInfo.openDiscounts" class="list sm" :title="!discountObj? '整单优惠' : discountObj.Type === 1 ? '整单折扣' : '整单减价'" :afterText="!discountObj? '无' : discountObj.Type === 1 ? discountObj.Value * 100 / 10 + `折(-￥${fullOrderActivit})` : '-'+ discountObj.Value +'元'"></mu-list-item>
                                    <mu-list-item class="list sm" title="总金额" :afterText="allPay | rmb"></mu-list-item>
                              </mu-list>
                          </li>
                          <li class="sm">
                               <mu-list v-for="(item, index) in payTypeList" :key="index">
                                    <mu-list-item class="list sm" title="支付" :afterText="item.money | rmb"></mu-list-item>
                                    <mu-list-item class="list sm" title="支付方式" :afterText="item.type"></mu-list-item>
                              </mu-list>
                         </li>
                     </ul>
                 </div>

            </div>
         </div>
         <div class="right success">
             <div class="right_cont">
                   <div class="successYes">
                        <h1>
                          <span>收款成功</span>
                          {{allPay | rmb}}
                        </h1>
                        <mu-raised-button class="print" label="打印小票" @click="print" fullWidth/>
                        <mu-raised-button label="继续收银" @click="continueCashier" fullWidth/>
                   </div>
             </div>
         </div>
    </div>
</template>


<script>
import { sendTosecondaryDisplay } from '@/public/sendToSecondaryDisplay.js';
import pcPrinter from "@/views/pcPrinter"
import { getShopOrderDetail } from '@/api'
export default {
  name: 'success',
  components:{pcPrinter},
  data () {
    return {
        productList:[],
        gift:[],
        orderModel:subdata.orderModel,
        payTypeList:payTypeList,
        successData:{},
        CreatedOKLodop7766:null,
        printer:"",
        isprinting:false,
        shopName:SHOP_NAME,
        discountObj: this.$route.query.discount,
        fullOrderActivit: this.$route.query.fullOrderActivit
    }
  },
  created:function(){
        carts=null;
        // subdata=null;
        userId=0;
        // payTypeList=[];
        // successData={};
        carts=[];
        memberData=null;
        cardId=0;

        indexData={member:null,checkedProid:""};
        // this.$emit("changeTitle","支付成功");
        this.$emit("isBack",false);
        if(!subdata){
           this.$router.push('/');
        }

        var self=this;
        var userAgent = navigator.userAgent;
        if(userAgent.indexOf("t1host")!=-1&&userAgent.indexOf("Html5Plus")!=-1){
           self.printer="app";
        }else{
           self.printer="web";
           usbPrint.init();
        }
       this.productList=subdata.orderModel.orderProductItems.items;
       this.successData=successData;

	     sendTosecondaryDisplay([],null,null,3,this);
       for(var j=0;j<subdata.activities.length;j++){
                if(subdata.activities[j].activeType=="FullDelivery"&&subdata.activities[j].gifts.length>0){
                        for(var n=0;n<subdata.activities[j].gifts.length;n++){
                            var pro ={};
                            pro.productName="（赠品）"+subdata.activities[j].gifts[n].giftName;
                            pro.specifications = [];
                            pro.salePrice = -1;
                            pro.buyNum = 1;
                            this.productList.push(pro)
                        }
                }
         }
         if(autoPrint){
            this.print();
         }
  },
  computed:{
       allPay(val){
             var t = 0;
             for(var i=0;i<payTypeList.length;i++){
                 t = this.addMath(t,payTypeList[i].money);
             }
             return t;
       }
  },
  methods:{
    continueCashier:function(){
       carts=null;
       subdata=null;
       userId=0;
       payTypeList=[];
       successData={};
       carts=[];
       memberData=null;
       cardId=0;
       indexData={member:null,checkedProid:""};
       this.$router.push('/');
    },
    print:function(){
        var self=this;
        if(this.isprinting) return;
        self.isprinting=true;
        setTimeout(function(){
             self.isprinting=false;
        },1000);
        getShopOrderDetail(this.orderModel.orderId).then(function(res){
          self.$refs.printer.orderList(res.data);
        })
    },
    rmb:function(value){
       return "￥"+(parseFloat(value).toFixed(2))
    },
    frmb:function(value){
      return "-￥"+(parseFloat(value).toFixed(2))
    },
    addMath: function(n1, n2) {
      return Math.round((n1 + n2) * 100) / 100
    }
  },
  filters: {
    rmb: function (value) {
      return "￥"+(parseFloat(value).toFixed(2))
    },
    frmb: function (value) {
      return "-￥"+(parseFloat(value).toFixed(2))
    }
  }
}

</script>
