<template>
    <div>
        <!-- PC订单小票样式 -->
        <div class="print_div" v-if="printData" id="print_order" style="width:100%;display:none;">
           <table border="0" width="100%;">
                  <tr>
                      <td style="padding:3px 0;" colspan="2" align="center"><font  size="4">{{shopName}}</font></td>
                  </tr>
                  <tr>
                      <td style="padding:3px 0;" colspan="2" align="center"><font  size="4"> </font></td>
                  </tr>
                  <tr>
                      <td style="padding:3px 0;" colspan="2" align="left"><font  size="2">{{printData.createTime | formatDate}}</font></td>
                  </tr>
                  <tr>
                      <td style="padding:3px 0;" colspan="2" align="left"><font  size="2">订单号：{{printData.orderId}}</font></td>
                  </tr>
                  <tr>
                    <td colspan="2" style="border-top:1px solid #000;"></td>
                  </tr>
            </table>
            <table v-for="item in printData.newOrderItem" width="100%" border="0">
                    <tr>
                         <td colspan="2">
                          <font  size="2">
                              <p>{{item.productName}}
                                 <span v-if="item.color||item.size||item.version">(</span>
                                 <span v-if="item.color">{{item.color}};</span>
                                 <span v-if="item.size">{{item.size}};</span>
                                 <span v-if="item.version">{{item.version}};</span>
                                 <span v-if="item.color||item.size||item.version">)</span>
                              </p>
                          </font>
                        </td>
                    </tr>
                    <tr>
                         <td><font  size="2">单价:{{item.salePrice | rmb}}<span v-if="item.measureUnit&&item.measureUnit!=''">/{{item.measureUnit}}</span></font></td>
                         <td align="right"><font  size="2">x{{item.quantity}}</font></td>
                    </tr>
                    <tr>
                        <td style="padding:3px 0;" colspan="2" align="left"><font  size="2">总价:{{(item.salePrice*item.quantity) | rmb}}</font></td>
                    </tr>
                    <tr>
                    <td colspan="2" style="border-top:1px dashed #000;"></td>
                    </tr>
             </table>
             <table width="100%" border="0">
                  <tr>
                      <td><font  size="2">商品合计</font></td>
                      <td align="right">
                        <font  size="2">{{printData.productTotalAmount | rmb}}</font>
                     </td>
                  </tr>
                  <tr v-if="printData.discountAmount>0">
                     <td><font  size="2">活动优惠</font></td>
                     <td align="right"><font  size="2">{{printData.discountAmount | frmb}}</font></td>
                  </tr>
                  <!-- <tr v-if="successData.totalAll.coupon>0">
                     <td><font  size="2">优惠券</font></td>
                     <td align="right"><font  size="2">{{successData.totalAll.coupon | frmb}}</font></td>
                  </tr> -->
                  <tr v-if="printData.integralDiscount>0">
                     <td><font  size="2">积分</font></td>
                     <td align="right"><font  size="2">{{printData.integralDiscount | frmb}}</font></td>
                  </tr>
                  <!-- <tr v-if="successData.removeSmallChange>0">
                     <td><font  size="2">抹零</font></td>
                     <td align="right"><font  size="2">{{successData.removeSmallChange | frmb}}</font></td>
                  </tr> -->
                  <tr>
                       <td><font  size="2">实付金额</font></td>
                       <td align="right"><font  size="2">{{printData.totalAmount | rmb}}</font></td>
                  </tr>
                  <tr>
                       <td colspan="2" style="border-top:1px solid #000;"></td>
                  </tr>
             </table>
             <table width="100%" border="0">
                      <tr v-if="printData.prepaymentsAmount>0">
                          <td><font  size="2">预存款支付</font></td>
                          <td align="right"><font  size="2">{{printData.prepaymentsAmount | rmb}}</font></td>
                      </tr>
                      <tr v-if="printData.paymentTypeName!='预存款支付'">
                          <td><font  size="2">{{printData.paymentTypeName}}</font></td>
                          <td align="right"><font  size="2">{{(printData.totalAmount-printData.prepaymentsAmount).toFixed(2) | rmb}}</font></td>
                      </tr>
             </table>
             <table width="100%" border="0">
                       <tr>
                         <td colspan="2" style="border-top:1px solid #000;"></td>
                       </tr>
                       <tr v-if="memberInfo.uid!=0">
                          <td><font  size="2">预存款余额</font></td>
                          <td align="right"><font  size="2">{{memberInfo.balance | rmb}}</font></td>
                       </tr>
                       <tr v-if="memberInfo.orderIntegral>0">
                          <td><font  size="2">当前获得积分</font></td>
                          <td align="right"><font  size="2">{{memberInfo.orderIntegral}}</font></td>
                       </tr>
                       <tr v-if="memberInfo.uid!=0">
                          <td><font  size="2">剩余积分</font></td>
                          <td align="right"><font  size="2">{{memberInfo.integral}}</font></td>
                       </tr>
             </table>
        </div>
        <!-- PC订单小票样式 END -->

        <!--PC打印售后订单-->
        <div class="print_div" v-if="refundData" id="print_refund" style="width:100%;display:none;">
           <table border="0" width="100%;">
                  <tr>
                      <td style="padding:3px 0;" colspan="2" align="center"><font  size="4">{{shopName}}</font></td>
                  </tr>
                  <tr>
                      <td style="padding:3px 0;" colspan="2" align="center"><font  size="4"> </font></td>
                  </tr>
                  <tr>
                      <td style="padding:3px 0;" colspan="2" align="left"><font  size="2">退款:{{refundData.refundStatus}}</font></td>
                  </tr>
                  <tr>
                      <td style="padding:3px 0;" colspan="2" align="left"><font  size="2">{{refundData.sellerAuditDate | formatDate}}</font></td>
                  </tr>
                  <tr>
                      <td style="padding:3px 0;" colspan="2" align="left"><font  size="2">订单号：{{refundData.orderIdStr}}</font></td>
                  </tr>
                  <tr>
                    <td colspan="2" style="border-top:1px solid #000;"></td>
                  </tr>
            </table>
            <table width="100%" border="0">
                    <tr>
                         <td colspan="2">
                          <font  size="2">
                              <p>{{refundData.orderItemData.productName}}
                                 <span v-if="refundData.orderItemData.color||refundData.orderItemData.size||refundData.orderItemData.version">(</span>
                                 <span v-if="refundData.orderItemData.color">{{refundData.orderItemData.color}};</span>
                                 <span v-if="refundData.orderItemData.size">{{refundData.orderItemData.size}};</span>
                                 <span v-if="refundData.orderItemData.version">{{refundData.orderItemData.version}};</span>
                                 <span v-if="refundData.orderItemData.color||refundData.orderItemData.size||refundData.orderItemData.version">)</span>
                              </p>
                          </font>
                        </td>
                    </tr>
                    <tr>
                         <td><font  size="2">单价:{{refundData.orderItemData.salePrice | rmb}}<span v-if="refundData.orderItemData.measureUnit&&refundData.orderItemData.measureUnit!=''">/{{refundData.orderItemData.measureUnit}}</span></font></td>
                         <td align="right"><font  size="2">x{{refundData.orderItemData.quantity}}</font></td>
                    </tr>
                    <tr>
                        <td style="padding:3px 0;" colspan="2" align="left"><font  size="2">总价:{{refundData.realTotalPrice | rmb}}</font></td>
                    </tr>
                    <tr>
                    <td colspan="2" style="border-top:1px solid #000;"></td>
                    </tr>
             </table>
             <table width="100%" border="0">
                  <tr>
                      <td><font  size="2">退款金额：</font></td>
                      <td align="right">
                        <font  size="2">{{refundData.refundPrice | rmb}}</font>
                     </td>
                  </tr>
                  <tr v-if="refundData.refundIntegral>0">
                     <td><font  size="2">退回积分</font></td>
                     <td align="right"><font  size="2">{{refundData.refundIntegral}}</font></td>
                  </tr>
                  <tr v-if="memberInfo.integral>0">
                     <td><font  size="2">累计积分</font></td>
                     <td align="right"><font  size="2">{{memberInfo.integral}}</font></td>
                  </tr>
                  <tr>
                       <td><font  size="2">退款方式：</font></td>
                       <td align="right"><font  size="2">{{refundData.refundModes=="货品退款"?"仅退款":refundData.refundModes}}</font></td>
                  </tr>
             </table>
        </div>

        <!--打印交班详情-->
        <div class="print_div" v-if="workData" id="print_signOut" style="width:100%;display:none;">
           <table border="0" width="100%;">
                  <tr>
                      <td style="padding:3px 0;" colspan="2" align="center"><font  size="4">{{shopName}}</font></td>
                  </tr>
                  <tr>
                      <td style="padding:3px 0;" colspan="2" align="center"><font  size="4"> </font></td>
                  </tr>
                  <tr>
                      <td style="padding:3px 0;" colspan="2" align="left"><font  size="2">打印时间:{{workData.date | formatDate}}</font></td>
                  </tr>
                  <tr>
                      <td style="padding:3px 0;" colspan="2" align="left"><font  size="2">当班收银员:{{casher}}</font></td>
                  </tr>
                  <tr>
                      <td style="padding:3px 0;" colspan="2" align="left"><font  size="2">收银时间：</font></td>
                  </tr>
                  <tr>
                      <td style="padding:3px 0;" colspan="2" align="left"><font  size="2">从:{{workData.BeginTime | formatDate}}</font></td>
                  </tr>
                  <tr>
                      <td style="padding:3px 0;" colspan="2" align="left"><font  size="2">至:{{workData.EndTime | formatDate}}</font></td>
                  </tr>
                  <tr>
                    <td colspan="2" style="border-top:1px solid #000;"></td>
                  </tr>
            </table>
            <table width="100%" border="0">
                 <tr>
                     <td><font  size="2">微信收款：</font></td>
                     <td align="right">
                       <font  size="2">{{workData.Proceeds.Wechat | rmb}}</font>
                    </td>
                 </tr>
                 <tr>
                     <td><font  size="2">支付宝收款：</font></td>
                     <td align="right">
                       <font  size="2">{{workData.Proceeds.Alipay | rmb}}</font>
                    </td>
                 </tr>
                 <tr>
                     <td><font  size="2">预存款收款：</font></td>
                     <td align="right">
                       <font  size="2">{{workData.Proceeds.Deposit | rmb}}</font>
                    </td>
                 </tr>
                 <tr>
                     <td><font  size="2">现金收款：</font></td>
                     <td align="right">
                       <font  size="2">{{workData.Proceeds.Cash | rmb}}</font>
                    </td>
                 </tr>
                 <tr>
                     <td><font  size="2">收款总金额</font></td>
                     <td align="right">
                       <font  size="2">{{workData.Proceeds.Total | rmb}}</font>
                    </td>
                 </tr>
                 <tr>
                   <td colspan="2" style="border-top:1px solid #000;"></td>
                 </tr>
             </table>
             <table width="100%" border="0">
                  <tr>
                      <td><font  size="2">微信退款：</font></td>
                      <td align="right">
                        <font  size="2">{{workData.Refund.Wechat | frmb}}</font>
                     </td>
                  </tr>
                  <tr>
                      <td><font  size="2">支付宝退款：</font></td>
                      <td align="right">
                        <font  size="2">{{workData.Refund.Alipay | frmb}}</font>
                     </td>
                  </tr>
                  <tr>
                      <td><font  size="2">预存款退款：</font></td>
                      <td align="right">
                        <font  size="2">{{workData.Refund.Deposit | frmb}}</font>
                     </td>
                  </tr>
                  <tr>
                      <td><font  size="2">现金退款：</font></td>
                      <td align="right">
                        <font  size="2">{{workData.Refund.Cash | frmb}}</font>
                     </td>
                  </tr>
                  <tr>
                      <td><font  size="2">退款总金额</font></td>
                      <td align="right">
                        <font  size="2">{{workData.Refund.Total | frmb}}</font>
                     </td>
                  </tr>
              </table>
              <table width="100%" border="0">
                    <tr>
                      <td colspan="2" style="border-top:1px solid #000;"></td>
                    </tr>
                   <tr>
                       <td><font  size="2">期初现金：</font></td>
                       <td align="right">
                         <font  size="2">{{workData.Start | rmb}}</font>
                      </td>
                   </tr>
                   <tr>
                       <td><font  size="2">期末现金：</font></td>
                       <td align="right">
                         <font  size="2">{{workData.End | rmb}}</font>
                      </td>
                   </tr>
                   <tr>
                     <td colspan="2" style="padding-top:20px;">
                          ------------综合日报------------
                     </td>
                   </tr>
               </table>
        </div>

    </div>
</template>

<script>
import { getReceiptInfo } from '@/api'
export default {
      data(){
         return{
             printData:null,
             shopName:null,
             printer:"",
             refundData:null,
             workData:null,
             casher:null,
             memberInfo:{integral: 0, orderIntegral: 0, balance: 0,uid: 0},
         }
      },
      created(){
            var userAgent = navigator.userAgent;
            if(userAgent.indexOf("t1host")!=-1&&userAgent.indexOf("Html5Plus")!=-1){
               this.printer="app";
            }else{
               this.printer="web";
               usbPrint.init();
            }

      },
      methods:{
           orderList(data){
              this.shopName = SHOP_NAME;
              this.printData = data;
              var self = this;
              this.getMemberInfo(data.userId,data.orderId,function(){
                  if(self.printer=="web"){
                    setTimeout(function(){
                        self.printerGo("print_order");
                    },200);
                  }else{
                      var savedBleId = localStorage.getItem("bleId");
                      var bleObj = new ConnectPrinter(savedBleId);
                      var PrintText ="";
                      PrintText+=self.formatDate(data.createTime);
                      PrintText+="\n订单号："+ data.orderId;
                      PrintText+=bleObj.printLine('*');
                      for(var i=0;i<data.newOrderItem.length;i++){
                          PrintText+="\n"+ data.newOrderItem[i].productName;
                          if(data.newOrderItem[i].color||data.newOrderItem[i].size||data.newOrderItem[i].version) PrintText+="(";
                          if(data.newOrderItem[i].color) PrintText+=data.newOrderItem[i].color+" ";
                          if(data.newOrderItem[i].size) PrintText+=data.newOrderItem[i].size+" ";
                          if(data.newOrderItem[i].version) PrintText+=data.newOrderItem[i].version+" ";
                          if(data.newOrderItem[i].color||data.newOrderItem[i].size||data.newOrderItem[i].version) PrintText+=")";
                          var priceStr = "";
                          priceStr+="￥"+data.newOrderItem[i].salePrice;
                          if(data.newOrderItem[i].measureUnit&&data.newOrderItem[i].measureUnit!=''){
                              priceStr+="/"+data.newOrderItem[i].measureUnit;
                          }
                          PrintText+=bleObj.cTwoRow('单价:'+priceStr+"　x"+data.newOrderItem[i].quantity,"总价:"+self.rmb(data.newOrderItem[i].salePrice*data.newOrderItem[i].quantity));
                      }
                      PrintText+=bleObj.printLine('*');
                      // PrintText+=bleObj.cTwoRow('数量',this.successData.totalAll.numtotal.toString());
                      PrintText+=bleObj.cTwoRow('商品合计',self.rmb(data.productTotalAmount));
                      if(data.discountAmount>0)
                         PrintText+=bleObj.cTwoRow('活动优惠',self.frmb(data.discountAmount));
                      if(data.integralDiscount>0)
                         PrintText+=bleObj.cTwoRow('积分',self.frmb(data.integralDiscount));
                         PrintText+=bleObj.cTwoRow('实付金额',self.rmb(data.totalAmount));
                         PrintText+=bleObj.printLine('*');
                      if(data.prepaymentsAmount>0)    PrintText+=bleObj.cTwoRow('预存款支付',self.rmb(data.prepaymentsAmount));
                      if(data.paymentTypeName!='预存款支付') PrintText+=bleObj.cTwoRow(data.paymentTypeName,self.rmb((data.totalAmount-data.prepaymentsAmount).toFixed(2)));
                      PrintText+=bleObj.printLine('*');
                      if(self.memberInfo.uid!=0) PrintText+='\n预存款余额:'+self.rmb(self.memberInfo.balance);
                      if(self.memberInfo.orderIntegral>0) PrintText+='\n当前获得积分:'+self.memberInfo.orderIntegral;
                      if(self.memberInfo.uid!=0) PrintText+='\n剩余积分:'+self.memberInfo.integral;
                      PrintText+="\n\n\n";
                      bleObj.gotoPrint(PrintText);
                  }
              })
           },
           refundList(data){
               this.shopName = SHOP_NAME;
               this.refundData = data;
               var self = this;
               self.getMemberInfo(data.userId,data.orderIdStr,function(){
               if(self.printer=="web"){
                  setTimeout(function(){
                      self.printerGo("print_refund");
                  },200);
               }else{
                   var savedBleId = localStorage.getItem("bleId");
                   var bleObj = new ConnectPrinter(savedBleId);
                   var PrintText ="";
                   PrintText+=data.refundStatus;
                   PrintText+="\n"+self.formatDate(data.sellerAuditDate);
                   PrintText+="\n订单号："+ data.orderIdStr;
                   PrintText+=bleObj.printLine('*');
                   PrintText+="\n"+ data.orderItemData.productName;
                   if(data.orderItemData.color||data.orderItemData.size||data.orderItemData.version) PrintText+="(";
                   if(data.orderItemData.color) PrintText+=data.orderItemData.color+" ";
                   if(data.orderItemData.size) PrintText+=data.orderItemData.size+" ";
                   if(data.orderItemData.version) PrintText+=data.orderItemData.version+" ";
                   if(data.orderItemData.color||data.orderItemData.size||data.orderItemData.version) PrintText+=")";
                   var priceStr = "";
                   priceStr+="\n￥"+data.orderItemData.salePrice;
                   if(data.orderItemData.measureUnit&&data.orderItemData.measureUnit!=''){
                       priceStr+="/"+data.orderItemData.measureUnit;
                   }
                   priceStr+="　x"+data.orderItemData.quantity;
                     PrintText+=bleObj.cTwoRow('单价:'+priceStr,"总价:"+self.rmb(data.orderItemData.realTotalPrice));
                   PrintText+=bleObj.printLine('*');
                   // PrintText+=bleObj.cTwoRow('数量',this.successData.totalAll.numtotal.toString());
                   PrintText+='\n退款金额:'+self.rmb(data.refundPrice);
                   if(data.refundIntegral>0) {PrintText+='\n退回积分:'+data.refundIntegral;}
                   if(self.memberInfo.integral>0) {PrintText+='\n累计积分:'+self.memberInfo.integral;}
                   if(data.refundModes=="货品退款") {PrintText+='\n退款方式:仅退款';}
                   else{PrintText+='\n退款方式:退款退货';}
                   PrintText+="\n\n\n";
                   bleObj.gotoPrint(PrintText);
               }
             });
           },
           signOutPrint:function(data){
              this.shopName = SHOP_NAME;
              this.workData = data;
              this.casher = this.workData.CashierName || CASH_ER;
              var self = this;
              var date = new Date()*1;
              date = "/Date("+date+"+0800)/";
              this.workData.date = date;
              if(self.printer=="web"){
                  setTimeout(function(){
                      self.printerGo("print_signOut");
                  },200);
              }else{
                  var savedBleId = localStorage.getItem("bleId");
                  var bleObj = new ConnectPrinter(savedBleId);
                  var PrintText ="";
                  PrintText+="\n打印时间:"+this.formatDate(this.workData.date);
                  PrintText+="\n当班收银员:"+ this.casher;
                  PrintText+="\n收银时间:";
                  PrintText+="\n从:"+this.formatDate(this.workData.BeginTime);
                  PrintText+="\n至:"+this.formatDate(this.workData.EndTime);
                  PrintText+=bleObj.printLine('*');
                  PrintText+=bleObj.cTwoRow('微信收款:',this.rmb(this.workData.Proceeds.Wechat));
                  PrintText+=bleObj.cTwoRow('支付宝收款:',this.rmb(this.workData.Proceeds.Alipay));
                  PrintText+=bleObj.cTwoRow('预存款收款:',this.rmb(this.workData.Proceeds.Deposit));
                  PrintText+=bleObj.cTwoRow('现金收款:',this.rmb(this.workData.Proceeds.Cash));
                  PrintText+=bleObj.cTwoRow('收款总金额:',this.rmb(this.workData.Proceeds.Total));
                  PrintText+=bleObj.printLine('*');
                  PrintText+=bleObj.cTwoRow('微信退款:',this.frmb(this.workData.Refund.Wechat));
                  PrintText+=bleObj.cTwoRow('支付宝退款:',this.frmb(this.workData.Refund.Alipay));
                  PrintText+=bleObj.cTwoRow('预存款退款:',this.frmb(this.workData.Refund.Deposit));
                  PrintText+=bleObj.cTwoRow('现金退款:',this.frmb(this.workData.Refund.Cash));
                  PrintText+=bleObj.cTwoRow('退款总金额:',this.frmb(this.workData.Refund.Total));
                  PrintText+=bleObj.printLine('*');
                  PrintText+=bleObj.cTwoRow('期初现金:',this.rmb(this.workData.Start));
                  PrintText+=bleObj.cTwoRow('期末现金:',this.rmb(this.workData.End));
                  PrintText+="\n\n*********************综合日报*******************";
                  PrintText+="\n\n\n";
                  bleObj.gotoPrint(PrintText);
              }
           },
           printerGo:function(id){
              if(this.printer=="web"){
                  var self = this;
                  try {
                     var LODOP; //声明为全局变量
                     LODOP=usbPrint.getLodop();
                     LODOP.PRINT_INIT("");
                     LODOP.SET_PRINT_MODE("PRINT_PAGE_PERCENT", "Auto-Width");
                     LODOP.SET_PRINT_PAGESIZE(3, 530, 1200, "长沙海商网络技术有限公司")
                     LODOP.ADD_PRINT_HTM(0,0,"110%","100%", document.getElementById(id).innerHTML);
                     LODOP.PRINT();
                  }catch(e){
                     self.$toast("请检查打印机是否正确连接");
                  }
              }
           },
           getMemberInfo:function(uid,oid,callBack){
             var self = this;
             if(uid != 0){
                 getReceiptInfo(uid, oid).then(function (response) {
                    self.memberInfo = response.data;
                    self.memberInfo.uid = uid;
                    callBack()
                 })
              }else{
                   self.memberInfo = {integral: 0, orderIntegral: 0, balance: 0,uid:0};
                   callBack()
              }
           },
           rmb:function(value){
              return "￥"+(parseFloat(value).toFixed(2))
           },
           frmb:function(value){
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
      },
      filters: {
          rmb: function (value) {
              return "￥" + (parseFloat(value).toFixed(2))
          },
          frmb: function (value) {
              return "-￥" + (parseFloat(value).toFixed(2))
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
