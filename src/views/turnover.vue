<template>
  <div class="main-container">
    <div class="condition">
      <button :class="{active:timeType==1}" @click="timeType=1;">本周</button>
      <button :class="{active:timeType==2}" @click="timeType=2;">本月</button>
      <button :class="{active:timeType==3}" @click="timeType=3;">近三月</button>
      <mu-checkbox label="仅查看自己" class="demo-checkbox" v-model="lookself" />
    </div>
    <div class="left" style="border-color:#e4e9f0;">
      <div class="left_cont" v-if="bigList">
        <div class="turnover_left_top">
          <div class="condition_time">
            <i class="iconfont icon-riqiqujian"></i>{{startTime}}-{{endTime}}
          </div>
          <div class="condition_total">
            <i class="iconfont icon-heji"></i><em>合计：{{bigList.sumAmount | rmb}}</em>
          </div>
        </div>
        <div class="type_total">
          <div>
            <i class="iconfont icon-weixin"></i>
            <em>{{bigList.weChatSumAmount | rmb}}</em>
          </div>
          <div>
            <i class="iconfont icon-zhifubao"></i>
            <em>{{bigList.alipaySumAmount | rmb}}</em>
          </div>
        </div>
        <div class="turnover"></div>
        <div class="noturnover" v-if="!bigList">
          <img src="../assets/images/notList.png" alt="">
        </div>
        <mu-list class="turnover_list">
          <mu-list-item class="list nojt line-solid sm" v-for="(item, index) in bigList.chargeDateStatistics" :title="item.createDate.split(' ')[0]" :afterText="'合计 ￥'+item.sumChargeAmount" :class="{active:checkedItem==item.createDate}" @click="checkedItem=item.createDate" :key="index">
            <i class="mu-item-right iconfont icon-jiantou"></i>
          </mu-list-item>
        </mu-list>
      </div>
    </div>
    <div class="right">
      <div class="right_cont">
        <div class="turnover_table_haeder">
          <div>
            <div>
              <span style="width:10%;"></span>
              <span style="width:20%;">时间</span>
              <span style="width:15%;">实付金额</span>
              <span style="width:15%;">储值金额</span>
              <span style="width:20%;">店员</span>
              <span style="width:20%;">单号</span>
            </div>
          </div>
        </div>
        <div class="turnover_table_box">
          <div class="turnover_table" v-if="checkedDetail&&checkedItem" :style="{minHeight:bodyH}">
            <table cellpadding="0" cellspacing="0">
              <tr v-for="item in checkedDetail">
                <td width="10%"><i class="iconfont" :class="{'icon-weixin':item.chargeWay=='微信刷卡支付','icon-zhifubao':item.chargeWay!='微信刷卡支付'}"></i></td>
                <td width="20%">{{item.chargeTime}}</td>
                <td width="15%">￥{{item.chargeAmount}}</td>
                <td width="15%">￥{{item.totalAmount}}</td>
                <td width="20%">{{item.managerName}}</td>
                <td width="20%">{{item.id}}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getChargeDailySummary, getChargeDaily } from '@/api'
export default {
  name: 'turnover',
  data() {
    return {
      startTime: '',
      endTime: '',
      lookself: false,
      timeType: 0,
      bigList: null,
      checkedItem: '',
      checkedDetail: null,
      bodyH: 'px',
    }
  },
  created: function() {
    this.timeType = 1;
    if (document.getElementById("back-menu")) document.getElementById("back-menu").style.display = "block";
    if (document.getElementById("menu-nav")) document.getElementById("menu-nav").style.display = "none";
    var h = document.documentElement.clientHeight;
    var self = this;
    this.bodyH = (h - 214) + 'px';
    window.addEventListener("resize", function() {
      var h = document.documentElement.clientHeight;
      self.bodyH = (h - 214) + 'px';
    });
  },
  methods: {
    GetChargeDailySummary: function() {
      var self = this;
      getChargeDailySummary(this.lookself, this.timeType).then(function(response) {
        if (!response.data.success) {
          self.$toast(response.data.msg);
        } else {
          self.bigList = response.data.data;
          console.log(self.bigList);
          if (self.bigList.chargeDateStatistics.length > 0) {
            self.checkedItem = self.bigList.chargeDateStatistics[0].createDate;
            self.GetChargeDaily();
          } else {
            self.checkedItem = "";
          }

        }
      })
    },
    GetChargeDaily: function() {
      var self = this;
      getChargeDaily(this.lookself, this.checkedItem).then(function(response) {
        console.log(response.data);
        if (!response.data.success) {
          self.$toast(response.data.msg);
        } else {
          self.checkedDetail = response.data.data
        }
      });
    },
    inputTime: function(type) {
      console.log(type);
      var t = new Date(),
        year = t.getFullYear(),
        month = t.getMonth() + 1,
        day = t.getDate(),
        week = t.getDay() == 0 ? 7 : t.getDay();
      var startYear = "",
        startMon = "",
        startDay = "";
      switch (type) {
        case 1:
          t.setDate(day - (week - 1));
          break;
        case 2:
          t.setDate(1);
          break;
        case 3:
          t.setMonth(month - 4);
          break;
        default:
          break;
      }
      startYear = t.getFullYear(),
        startMon = t.getMonth() + 1,
        startDay = t.getDate();
      return {
        stime: startYear + "." + startMon + "." + startDay,
        etime: year + "." + month + "." + day
      }
    }
  },
  　watch: {　　
    timeType: function(curVal, oldVal) {　　　　
      var d = this.inputTime(curVal);
      this.startTime = d.stime;
      this.endTime = d.etime;
      this.GetChargeDailySummary();　　
    },
    lookself: function() {
      this.GetChargeDailySummary();
    },
    checkedItem: function(curVal) {
      if (curVal != "")
        this.GetChargeDaily();
    }　
  },
  filters: {
    rmb: function(value) {
      return "￥" + (parseFloat(value).toFixed(2))
    },
    frmb: function(value) {
      return "-￥" + (parseFloat(value).toFixed(2))
    }
  }
}

</script>
<style lang="scss" scoped>
.left {
  height: calc(100% - 72px);
}

.active {
  background: rgba(0, 0, 0, 0.2);
}

.left_cont {
  height: 100%;
}

.turnover_list {
  height: calc(100% - 308px);
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
}

</style>
