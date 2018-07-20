<template>
     <div>

          <div class="shiftList">
                   <table cellpadding="0" cellspacing="0">
                               <thead>
                                    <tr>
                                        <th align="center">收银员</th>
                                        <th align="centercenter">收款总额（元）</th>
                                        <th align="center">退单总额（元）</th>
                                        <th align="center">期初现金（元）</th>
                                        <th align="center">期末现金（元）</th>
                                        <th align="center">上班时间</th>
                                        <th align="center">下班时间</th>
                                        <th align="center">操作</th>
                                    </tr>
                               </thead>
                               <tbody>
                                     <tr v-for="item in workList" :key="item.Id">
                                         <td align="center">{{item.Name}}</td>
                                         <td align="center">{{item.AllIn}}</td>
                                         <td align="center">{{item.AllOut}}</td>
                                         <td align="center">{{item.CashBegin}}</td>
                                         <td align="center">{{item.CashEnd}}</td>
                                         <td align="center">{{item.Begin}}</td>
                                         <td align="center"><span v-if="item.End!=''">{{item.End}}</span><span class="working" v-else>上班中……</span></td>
                                         <td align="center"><a @click="goDetails(item.Id)">查看</a></td>
                                     </tr>
                               </tbody>
                   </table>
          </div>
          <div class="shiftFoot">
               <mu-pagination class="changePage" :total="total" :pageSize="pageSize" :current="pageNo" @pageChange="paging"></mu-pagination>
          </div>
     </div>
</template>
<script>  
// import '@/assets/css/assembly.css';
import '@/assets/css/shift.css';
import { queryCashierShiftList } from '@/api'
export default {
  data(){
        return{
            workList:null,
            total:1,
            pageSize:5,
            pageNo:1,
         }
  },
  created:function(){
      this.$emit("changeTitle","交班记录");
      this.$emit("isBack",false);
      this.queryCashierShiftList();
  },
  mounted(){
  },
  methods:{
      paging:function(newIndex){
          this.pageNo = newIndex;
          this.queryCashierShiftList();
      },
      goDetails:function(id){
          this.$router.push({
              path: "/signOut",
              query: {
                id: id
              }
          })
      },
      queryCashierShiftList:function(){
        var self = this
        queryCashierShiftList({pageSize:this.pageSize, pageNo:this.pageNo}).then(function(response){
             self.workList = response.data.data.Models;
             self.total = response.data.data.Total;
        })
      }
  }
}
</script>
