<template>
     <div class="signOut">
          <div class="workData">
               <div class="income" ref="income">
                    <div id="incomeRect" class="rectImg"></div>
                    <div class="dataTable" v-if="workData">
                         <div class="dataRow row1">
                              <div class="col1">微信</div>
                              <div class="col2"><span v-if="workData.Proceeds.Wechat>0">+</span>{{workData.Proceeds.Wechat | rmb}}</div>
                              <div class="col3">预存款</div>
                              <div class="col4"><span v-if="workData.Proceeds.Deposit>0">+</span>{{workData.Proceeds.Deposit | rmb}}</div>
                         </div>
                         <div class="dataRow row2">
                              <div class="col1">支付宝</div>
                              <div class="col2"><span v-if="workData.Proceeds.Alipay>0">+</span>{{workData.Proceeds.Alipay | rmb}}</div>
                              <div class="col3">现金</div>
                              <div class="col4"><span v-if="workData.Proceeds.Cash>0">+</span>{{workData.Proceeds.Cash | rmb}}</div>
                         </div>
                    </div>
               </div>
               <div class="refund">
                    <div id="refundRect" class="rectImg"></div>
                    <div class="dataTable" v-if="workData">
                         <div class="dataRow row1">
                              <div class="col1">微信</div>
                              <div class="col2"><span v-if="workData.Refund.Wechat>0">-</span>{{workData.Refund.Wechat | rmb}}</div>
                              <div class="col3">预存款</div>
                              <div class="col4"><span v-if="workData.Refund.Deposit>0">-</span>{{workData.Refund.Deposit | rmb}}</div>
                         </div>
                         <div class="dataRow row2">
                              <div class="col1">支付宝</div>
                              <div class="col2"><span v-if="workData.Refund.Alipay>0">-</span>{{workData.Refund.Alipay | rmb}}</div>
                              <div class="col3">现金</div>
                              <div class="col4"><span v-if="workData.Refund.Cash>0">-</span>{{workData.Refund.Cash | rmb}}</div>
                         </div>
                    </div>
               </div>
               <div class="total" v-if="workData">
                    <div class="totalStart">
                         <p>期初现金<span>（元）</span></p>
                         <h2>{{workData.Start | rmb}}</h2>
                    </div>
                    <div class="totalEnd">
                         <p>期末现金<span>（元）</span></p>
                         <h2>{{workData.End | rmb}}</h2>
                    </div>
               </div>
          </div>
          <div class="signOutBottom" v-if="workData">
               <div class="mans flexCenter" v-if="id!='me'"><h3>{{workData.CashierName}}</h3>收银员</div>
               <div class="workTime flexCenter" v-if="id!='me'"><h3>{{workData.BeginTime | formatDate}}<em>至</em> {{workData.EndTime | formatDate}}</h3>当班时间</div>
               <mu-raised-button v-if="id!='me'" label="查看交易流水" @click="goTransaction()" class="button yellow"/>
               <mu-raised-button v-if="id=='me'" label="确认并退出" @click="dialog=true" class="button yellow"/>
               <mu-raised-button label="打印小票" @click="print" class="button lineYellow"/>
               <mu-raised-button v-if="id=='me'" label="查看流水" @click="goTransaction()" class="button lineYellow"/>
          </div>
          <mu-dialog dialogClass="m-dialog" :open="dialog" title="" @close="close">
              <div class="confirmBegin" style="text-align:center;">您确定要交班吗</div>
              <mu-flat-button slot="actions" @click="dialog=false" label="取消"/>
              <mu-flat-button slot="actions" primary @click="signOut" label="确定"/>
           </mu-dialog>
           <pcPrinter ref="printer"></pcPrinter>
     </div>
</template>
<script>
import pcPrinter from "@/views/pcPrinter"
import '@/assets/css/assembly.css';
import '@/assets/css/shift.css';
import { setCacherShiftEnd, getWatchManStatistics } from '@/api'
export default {
    components:{pcPrinter},
  data(){
        return{
            dialog:false,
            workData:null,
            id:this.$route.query.id
        }
  },
  created:function(){
      // this.$emit("changeTitle","交班详情");
      this.$emit("isBack",false)
  },
  watch:{
      "$route":function(to,from){
          this.id = this.$route.query.id;
          this.getWatchManStatistics();
      }
  },
  mounted(){
      this.getWatchManStatistics();
  },
  methods:{
      signOut:function(){
        var self = this;
        setCacherShiftEnd().then(function(response){
           if(response.data.success){
               if(autoPrint){
                  self.print();
               }
               setTimeout(function(){
                  window.location.href = "/sellerAdmin/Cashier/LogOut";
               },200)
           }else{

               this.$toast(response.data.msg);
           }
        });
      },
      close(){
            this.dailog=false;
      },
      print(){
          this.$refs.printer.signOutPrint(this.workData);
      },
      createChart:function(data,total,id,title){
            var myChart = this.$echarts.init(document.getElementById(id));
            var option = {
                           title: {
                             text: title,
                             subtext: '单位:元',
                             left: 'center',
                             textStyle:{
                               fontSize:24,
                               color:"#515151"
                             },
                             subtextStyle:{
                               fontSize:16,
                               color:"#737373"
                             }
                           },
                           tooltip: {
                               show:true,
                               trigger: 'item',
                               formatter: function(params, ticket, callback){
                                  if(title == "收款总额"){
                                      var num = "+"+total.toFixed(2);
                                  }else{
                                      var num = "-"+total.toFixed(2);
                                  }
                                  var str = '<div style="text-align: center" id="toolTipBox"><p style="font-size:20px;margin:0px">'+num+'</p></div>'
                                  return str
                               },
                               position: function (point, params, dom, rect, size) {
                                    var marginW = Math.ceil(size.contentSize[0]/2);
                                    var marginH = Math.ceil(size.contentSize[1]/2);
                                    dom.style.marginLeft='-' + marginW + 'px';
                                    dom.style.marginTop='-' + marginH + 'px';
                             			 return ['50%', '50%'];
                         			},
                               alwaysShowContent:true,
                               backgroundColor:"#fff",
                               textStyle:{
                               	color:'#333'
                               }
                           },
                           animation:false,
                           legend: {
                             type: 'scroll',
                             bottom: "10%",
                             data:['微信','支付宝','预存款','现金'],
                           },
                           calculable : true,
                           series : [
                               {
                                   name:'',
                                   type:'pie',
                                   radius : ['47%', '58%'],
                                   label: {
                                       normal: {
                                           show: false,
                                           position: 'default'
                                       },
                                       emphasis: {
                                           show: false
                                       }
                                   },
                                   data:data
                               }
                           ],
                           color: ['#91e0c0','#9bbcff','#fadb6f','#f7a6a9']
            };
            myChart.setOption(option);
            myChart.dispatchAction({
               type: 'showTip',
               seriesIndex: 0,
               dataIndex: 0
             });
      },
      goTransaction:function(){
          var endTime = this.formatDate(this.workData.EndTime);
          var startTime = this.formatDate(this.workData.BeginTime);
          this.$router.push({
              path: '/transcation',
              query: {
                cashierId: this.workData.CashierId,
                endTime: endTime,
                startTime: startTime
              }
          })
      },
      getWatchManStatistics:function(){
          var self = this;
          var data = this.id=="me"?"":"?id="+this.id;
          getWatchManStatistics(data).then(function(res){
              self.workData = res.data.data;
              var Proceeds = [{value:self.workData.Proceeds.Wechat, name:'微信'},
                  {value:self.workData.Proceeds.Alipay, name:'支付宝'},
                  {value:self.workData.Proceeds.Deposit, name:'预存款'},
                  {value:self.workData.Proceeds.Cash, name:'现金'}];
              var Refund = [{value:self.workData.Refund.Wechat, name:'微信'},
                  {value:self.workData.Refund.Alipay, name:'支付宝'},
                  {value:self.workData.Refund.Deposit, name:'预存款'},
                  {value:self.workData.Refund.Cash, name:'现金'}];
              self.createChart(Proceeds,self.workData.Proceeds.Total,"incomeRect","收款总额");
              self.createChart(Refund,self.workData.Refund.Total,"refundRect","退款总额");
          });
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
      return parseFloat(value).toFixed(2)
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
<style scoped>
       .flexCenter{
           display: flex;
           justify-content: center;
           align-items: center;
           flex-direction: column;
       }
       .signOutBottom .mans,.workTime{
           float: left;
           font-size: 14px;
           color: #BDBDBD;
           margin-left: 30px;
           border-right: 1px solid #E5E5E5;
           height: 55px;
           padding-right: 30px;
           margin-top: 36px;
       }
       .workTime{
           border:none;
           padding-left: 0;
           padding-right: 30px;
           align-items:flex-start;
       }
       .workTime h3 em{
          color: #747474;
       }
</style>
<style lang="scss">
  .rectImg {
    & div:nth-child(2) {
      z-index: 100!important;
    }
   }
</style>