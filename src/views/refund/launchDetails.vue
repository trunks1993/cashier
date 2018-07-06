<template>
  <div class="orderDetails" v-if="orderDetails">
         <div class="orderDetailsIn">
              <div class="refundTypetab">
                  <!-- <div :class="{active:refundType==2}" @click="refundType=2">退款退货</div>
                  <div :class="{active:refundType==1}" @click="refundType=1">仅退款</div> -->
                  <mu-raised-button label="退款退货" v-if="orderDetails.orderStatus!=2" class="tabs-btn"  @click="changeRefundType(2)"  :class="{active:refundType==2}"/>
                  <mu-raised-button label="仅退款" class="tabs-btn"  @click="changeRefundType(1)"  :class="{active:refundType==1,full:orderDetails.orderStatus==2}"/>
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
                         <div v-for="item in newOrderItem"  v-if="!item.refundStatus" :key="item.productId">
                           <div class="orderPorductlist" >
                                <div class="listCheckBox"  @click="checkPro(item.skuId)"><i :class="{'iconfont icon-dui':item.checked}"></i></div>
                                <div class="img"><img :src="item.showImage"/></div>
                                <div class="proName">{{item.productName}}</div>
                                <div class="spec">
                                  <span v-if="item.color">"{{item.color}}"</span>
                                  <span v-if="item.size">"{{item.size}}"</span>
                                  <span v-if="item.version">"{{item.version}}"</span>
                                </div>
                                <div class="price">{{item.salePrice | rmb}}<em v-if="item.productSaleMethod==1">/{{item.measureUnit}}</em></div>
                                <div class="count">x{{item.quantity}}</div>
                           </div>
                           <div class="changeBox" v-if="item.checked">
                               <div class="table-two" v-if="refundType == 2">
                                    <div class="title">退货数量</div>
                                    <div class="cnt">
                                         <div class="changeNum">
                                              <i class="iconfont icon-jian"  :class="{disabled:item.productSaleMethod == 1||item.num==1}" @click="changeNum(item.skuId,-1)"></i>
                                              <input type="text" :value="item.num" v-number @change="chanageInputNum($event,item.skuId)"  :disabled="item.productSaleMethod == 1">
                                              <i class="iconfont icon-tianjia1" :class="{disabled:item.productSaleMethod == 1||item.num==item.maxNum}"  @click="changeNum(item.skuId,1)"></i>
                                         </div>
                                         <p>最多可退{{item.maxNum}}件,<span v-if="item.productSaleMethod == 1">不</span>可编辑</p>
                                    </div>
                               </div>
                               <div class="table-two">
                                    <div class="title">退款金额</div>
                                    <div class="cnt">
                                        <div class="iconInput">
                                             <i>￥</i>
                                             <input type="text" :value="item.refundAmout"  v-money @change="chanageInputMoney($event,item.skuId)" >
                                        </div>
                                        <p>最多能退<em>￥{{item.realTotalPrice}}</em> <span v-if="item.enabledRefundIntegral">积分{{item.enabledRefundIntegral | rmb}}</span>,可编辑</p>
                                    </div>
                               </div>
                             </div>
                         </div>
                   </div>
              </div>
              <div class="orderDetailsItem refundFoot">
                   <div class="m28">
                     <div class="table-two h74">
                          <div class="title">合计退款</div>
                          <div class="cnt bigRed">{{getAllAmout.split("-")[1] | rmb}}</div>
                     </div>
                     <div class="table-two h74">
                          <div class="title">退款理由</div>
                          <div class="cnt">
                               <select v-model="refundReasonId" id="">
                                   <option value="-1">请选择退款理由,必选</option>
                                   <option v-for="item in refundReason" :value="item.afterSalesText">{{item.afterSalesText}}</option>
                               </select>
                          </div>
                     </div>
                     <div class="table-two">
                          <div class="title">备注</div>
                          <div class="cnt">
                               <textarea name="name" placeholder="选填" v-model="refundText" maxlength="50" class="refund-remarks"></textarea>
                          </div>
                     </div>
                  </div>
              </div>
              <div class="orderDetailsBtn">
                  <mu-raised-button v-if="orderDetails.orderStatus==6||orderDetails.orderStatus==2||orderDetails.orderStatus==4"  @click="open" :class="{disabled:getAllAmout.split('-')[2]==0}"  label="提交" class="button yellow"/>
                  <mu-raised-button label="取消" @click="$router.go(-1)"  class="button"/>
              </div>
         </div>
          <mu-dialog dialogClass="m-dialog" :open="dialog" :title="'退款至'+refundWay" @close="close">
            <div class="refundTipsOk">
                 <span>退货总数</span><span>{{refundType==1?'0':getAllAmout.split("-")[0]}}</span>
            </div>
            <div class="refundTipsOk">
                 <span>退款金额</span><span>{{getAllAmout.split("-")[1] | rmb}}</span>
            </div>
            <mu-flat-button slot="actions" @click="close" label="取消"/>
            <mu-flat-button slot="actions" primary @click="submitRefund" label="确定"/>
         </mu-dialog>

         <div class="loading" v-show="loading">
             <div class="spinner">
              <div class="double-bounce1"></div>
              <div class="double-bounce2"></div>
            </div>
         </div>
  </div>
</template>
<script>
import '@/assets/css/orderItems.css'
import '@/assets/css/assembly.css'
import { postRefundApply, getRefundReasons, getShopOrderDetail } from '@/api'
export default {
  data(){
        return{
              orderDetails:null,
              refundType:2,
              refundReasonId: "-1",
              refundReason:[],
              newOrderItem:{},
              allAmout:0,
              refundText:'',
              loading:false,
              dialog:false,
              refundWay:"",
              refunds:null,
        }
  },
  created:function(){
    this.$emit("changeTitle","发起售后");
    this.$emit("isBack",true);
    this.getShopOrderDetail(this.$route.params.id);
    this.getRefundReasons();
  },
  computed:{
     getAllAmout:{
         get:function(){
             var all = 0,num = 0,len = 0;
             for(var i = 0;i<this.newOrderItem.length;i++){
                  if(this.newOrderItem[i].checked){
                     all=all*1+this.newOrderItem[i].refundAmout*1;
                     num=num*1+this.newOrderItem[i].num*1;
                     len++;
                     console.log(all,typeof all)
                  }
             }
             console.log("all1:",all,typeof all);
             all = all.toFixed(2)
             console.log("all2:",all);
             return num+"-"+all+"-"+len;
         },
         set:function(val){
             this.allAmout = val;
         }
     }
  },
  mounted () {
  },
  methods:{
      close:function(){
          this.dialog = false;
      },
      open:function(){
          this.dialog = true;
      },
      chanageInputNum:function(el,id){
        var i = this.returnCheckPro(id);
        var val =el.target.value==""?1:parseInt(el.target.value);
        if(val == 0){
             val = 1;
        }
        if(val > this.newOrderItem[i].maxNum){
           val =  this.newOrderItem[i].maxNum;
        }
        this.newOrderItem[i].num = val;
        el.target.value = val;
        if(this.newOrderItem[i].num == this.newOrderItem[i].maxNum){
           this.newOrderItem[i].refundAmout = this.newOrderItem[i].realTotalPrice;
        }else{
           this.newOrderItem[i].refundAmout = (val*this.newOrderItem[i].realPrice).toFixed(2);
        }
      },
      chanageInputMoney:function(el,id){
        var i = this.returnCheckPro(id);
        var val =el.target.value==""?0:el.target.value;
        if(this.newOrderItem[i].num == this.newOrderItem[i].maxNum){
           var max = this.newOrderItem[i].realTotalPrice;
        }else{
           var max = (this.newOrderItem[i].num*this.newOrderItem[i].realPrice).toFixed(2);
        }
        if(val > max){
           val = max;
        }
        val = ((val*100)/100).toFixed(2);
        el.target.value = val;
        this.newOrderItem[i].refundAmout = val;
      },
      open:function(){
          var refunds = [];
          var x = 0;
          for(var i=0;i<this.newOrderItem.length;i++){
              if(this.newOrderItem[i].checked){
                   refunds.push({
                       OrderId:this.orderDetails.orderId,
                       OrderItemId:this.newOrderItem[i].orderItemId,
                       RefundType:this.refundType,
                       RefundAmount:this.newOrderItem[i].refundAmout,
                       Reason:this.refundReasonId,
                       RefundText:this.refundText,
                       ReturnQuantity:this.refundType==1?0:this.newOrderItem[i].num
                   });
                   if(this.newOrderItem[i].refundAmout==0){
                       x++;
                   }
              }
          }
          if(refunds.length==0){
              return;
          }
          if(this.refundReasonId==-1){
              this.$toast('请选择退款理由');
              return;
          }
          // if(x > 0){
          //     this.$toast('退款金额不能为0');
          //     return;
          // }
          this.dialog = true;
          this.refunds = refunds;
      },
      submitRefund:function(){

            var self = this;
            this.loading = true;
            postRefundApply({ refunds: self.refunds }).then(function(response){
                self.loading = false;
                self.$router.push({
                   path: '/refundSuccess',
                   query:{
                      res: response.data
                   }
                });
            });
      },
      changeRefundType:function(type){
           if(type == 1){
               for(var i = 0;i<this.newOrderItem.length;i++){
                    this.newOrderItem[i].num = this.newOrderItem[i].maxNum;
                    this.newOrderItem[i].refundAmout = this.newOrderItem[i].realTotalPrice;
               }
           }
           console.log(this.newOrderItem);
           this.refundType = type;
      },
      getShopOrderDetail:function(orderId){
           var self = this;
           getShopOrderDetail(orderId).then(function(res){
                if(res.data.orderStatus==2){
                    self.refundType = 1;
                }
                for(var i = 0; i< res.data.newOrderItem.length; i++){
                     if(res.data.orderStatus==2){
                        res.data.newOrderItem[i]['checked'] = true;
                     }else{
                        res.data.newOrderItem[i]['checked'] = false;
                     }
                     res.data.newOrderItem[i]['maxNum'] = res.data.newOrderItem[i].num;
                     res.data.newOrderItem[i]['realPrice'] = (res.data.newOrderItem[i].realTotalPrice/res.data.newOrderItem[i].num).toFixed(2);
                     res.data.newOrderItem[i]['refundAmout'] =res.data.newOrderItem[i].realTotalPrice;
                     if(res.data.paymentTypeName=="预存款支付"){
                           self.refundWay = "预存款";
                     }else{
                           if(res.data.prepaymentsAmount>0){
                              self.refundWay = "预存款";
                           }else{
                              self.refundWay = res.data.paymentTypeName;
                           }
                     }
                }
                self.orderDetails = res.data;
                self.newOrderItem = res.data.newOrderItem;
           });
      },
      getRefundReasons:function(){
           var self = this;
           getRefundReasons().then(function(res){
                 self.refundReason = res.data;
           });
      },
      checkPro:function(id){
            if(this.orderDetails.orderStatus==2) return;
            var i = this.returnCheckPro(id);
            if("checked" in this.newOrderItem[i]){
                  this.newOrderItem[i].checked = !this.newOrderItem[i].checked;
            }else{
                  this.newOrderItem[i]['checked'] = true;
            }
      },
      changeNum:function(skuid,add){
            var i = this.returnCheckPro(skuid);
            if(this.newOrderItem[i].num + add>0&&this.newOrderItem[i].num + add<=this.newOrderItem[i].maxNum){
               this.newOrderItem[i].num = this.newOrderItem[i].num + add;
               if(this.newOrderItem[i].num == this.newOrderItem[i].maxNum){
                   this.newOrderItem[i].refundAmout = this.newOrderItem[i].realTotalPrice;
               }else{
                   this.newOrderItem[i].refundAmout = (this.newOrderItem[i].realPrice*this.newOrderItem[i].num).toFixed(2);
               }
            }
      },
      returnCheckPro:function(skuid){
          var k = 0;
          for(var i = 0;i<this.newOrderItem.length;i++){
                 if(this.newOrderItem[i].skuId == skuid){
                      k = i;
                 }
          }
          return k;
      }
  },
  directives:{
    number:{
      bind: function (el) {
          var self = this;
          el.addEventListener('input', function(a){
                   el.value = el.value.replace(/\D+/, '')
          });
      }
    },
    money:{
      bind: function (el) {
          var self = this;
          el.addEventListener('input', function(a){
                   var vv = el.value;
                   if(vv !=''&& vv.substr(0,1) == '.'){
                       vv="";
                   }
                   vv = vv.replace(/^0*(0\.|[1-9])/, '$1');//解决 粘贴不生效
                   vv = vv.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符
                   vv = vv.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
                   vv = vv.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
                   vv = vv.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数
                   if(vv.indexOf(".")< 0 && vv !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
                       if(vv.substr(0,1) == '0' && vv.length == 2){
                           vv= vv.substr(1,vv.length);
                       }
                   }
                   el.value = vv;
          });
      }
    }
  },
  filters: {
    rmb: function (value) {
      return "￥"+(((value*100)/100).toFixed(2))
    },
    frmb: function (value) {
      return "-￥"+(parseFloat(value).toFixed(2))
    },
    formatDate: function(value){
      var t= value.slice(6, 19)
      var dt = new Date(parseInt(t));
      var year = dt.getFullYear();
      var month = dt.getMonth() + 1;
      var date = dt.getDate();
      var hour = dt.getHours();
      var minute = dt.getMinutes();
      var second = dt.getSeconds();
      return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    }
  }
}
</script>
