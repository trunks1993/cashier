<template>
  <div class="orderItem">
      <div class="header">
           <i class="iconfont icon-fanhui back" @click="$router.push('/')"></i>
           <div><mu-text-field hintText="搜索订单编号/会员信息" v-model="cardNo" class="seach-Input" fullWidth /></div>
      </div>
      <div class="filterBox">
           <div class="filterItem">
                <h2>下单时间</h2>
                <div class="item">
                     <span v-for="item in filterTime" :key="item.id" :class="{active:filterItem.timeType == item.id}" @click="filterItem.timeType = item.id">{{item.name}}</span>
                </div>
           </div>
           <pcPrinter ref="printer"></pcPrinter>
      </div>
      <div class="orderListBox">
            <div class="orderList" id="orderList">
                 <ul v-if="dataItems.length>0">
                     <li v-for="(item,index) in dataItems" :key="index">
                         <div class="listIn">
                              <div class="head" @click="goDetails(item.id)">
                                  <span>{{item.orderIdStr}}</span>
                                  <span class="status light">{{item.refundModes=="退货退款"?"退货退款":"仅退款"}}</span>
                              </div>
                              <div class="orderPorductlist"  @click="goDetails(item.id)">
                                   <div class="img"><img :src="item.orderItemData.showImage"/></div>
                                   <div class="proName">{{item.orderItemData.productName}}</div>
                                   <div class="spec">
                                       <span v-if="item.orderItemData.color">"{{item.orderItemData.color}}"</span>
                                       <span v-if="item.orderItemData.size">"{{item.orderItemData.size}}"</span>
                                       <span v-if="item.orderItemData.version">"{{item.orderItemData.version}}"</span>
                                   </div>
                                   <div class="price">{{item.orderItemData.salePrice | rmb}}<em v-if="item.orderItemData.productSaleMethod==1">/{{item.orderItemData.measureUnit}}</em></div>
                                   <div class="count">x{{item.orderItemData.returnQuantity}}</div>
                              </div>
                              <div class="foot">
                                    <span>共{{item.returnQuantity}}件商品 合计：￥{{item.amount}}</span>
                                    <mu-raised-button label="打印售后小票" @click="print(item.id)" class="button"/>
                              </div>
                         </div>
                     </li>
                 </ul>
                 <div v-else class="noData">
                     <img src="../../assets/images/enpty-single.png"/>
                     <p>没有找到订单</p>
                 </div>
            </div>
            <div class="footer"  v-show="dataItems.length>0">
                <mu-pagination :total="total" class="changePage" :pageSize="pageSize" :current="pageNo" @pageChange="paging"></mu-pagination>
            </div>
      </div>
      <div class="loading smloading" v-show="loading">
        <div class="spinner">
         <div class="double-bounce1"></div>
         <div class="double-bounce2"></div>
       </div>
     </div>
  </div>
</template>
<script>
import pcPrinter from "@/views/pcPrinter"
import '@/assets/css/orderItems.css'
import { getRefundOrderList } from '@/api'

export default {
  components:{pcPrinter},
  data(){
        return{
            pageSize:10,
            pageNo:1,
            total:1,
            trigger:null,
            openFilter:false,
            dataItems:[],
            filterTime:[{name:"全部",id:0},{name:"今天",id:1},{name:"昨天", id:2},{name:"近7天", id:3}],
            cardNo:"",
            filterItem:{
              timeType:0,
            },
            loading:false
        }
  },
  created:function(){
        this.$emit("changeTitle","售后列表");
        this.$emit("isBack",false);
        this.getShopOrder();
        var self = this;
        document.body.addEventListener("keyup",this.bodyKeyUp,false);
  },
  destroyed:function(){
        document.body.removeEventListener("keyup",this.bodyKeyUp,false);
  },
  mounted () {
        this.trigger = this.$refs.filterLoc;
  },
  watch:{
        filterItem:{
          handler:function(val) {
              this.getShopOrder();
              this.pageNo = 1;
          },
          deep: true
        },
  },
  methods:{
        bodyKeyUp(e){
                var self = this;
                if(e.keyCode==13&&this.cardNo!=""){
                    setTimeout(function(){
                         self.pageNo = 1;
                          self.getShopOrder();
                    },250)
                }
        },
        print(id){
            var data = null;
            for(var i=0;i<this.dataItems.length;i++){
                if(this.dataItems[i].id == id){
                    data = this.dataItems[i];
                }
            }
            this.$refs.printer.refundList(data);
        },
        getShopOrder:function(){
            var self = this;
            var timeType = this.filterItem.timeType==0?"":this.filterItem.timeType;
            self.loading =true;
              getRefundOrderList(self.pageNo, self.pageSize, self.cardNo, timeType).then(function (response) {
              self.loading =false;
              // self.cardNo = "";
              self.dataItems = response.data.models;
              self.total = response.data.total;
              document.getElementById("orderList").scrollTop = 0;
            });
        },
        paging:function(newIndex){
            this.pageNo = newIndex;
            this.getShopOrder();
        },
        openFilterbox:function(){
             this.openFilter=true;
        },
        closeFilterbox:function(){
             this.openFilter=false;
        },
        goDetails:function(id){
             console.log(id.toString());
             this.$router.push({
                path: '/refundDetails/'+id
             });
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
