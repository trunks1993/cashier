<template>
  <div class="transctionWrapper">
    <div class="filterBox" style="top: 54px;" v-loading="filterLoading">
      <div class="filterItem">
        <h2>时间</h2>
        <div class="item">
          <span v-for="item in filterTime" :class="{isActive: dateSelect === item.Key}" @click="selectDate(item)">{{item.Key}}</span>
          <span :class="{isActive: dateSelect === '自定义'}" @click="selectMyDate">自定义</span>
          <el-date-picker v-model="date" v-if="isCustomDate" size="mini" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%; margin-top: 10px;" @change="handleCustomDateChange" value-format="yyyy-MM-dd HH:mm:ss" unlink-panels>
          </el-date-picker>
        </div>
      </div>
      <div class="filterItem" v-if="filterOrderWay && filterOrderWay.length > 0">
        <h2>下单方式</h2>
        <div class="item">
          <span v-for="item in filterOrderWay" :class="{isActive: filterForm.OrderWay === item.Key}" @click="filterForm.OrderWay = item.Key, tableQueryParams.OrderWay = item.Key">{{item.Value}}</span>
        </div>
      </div>
      <div class="filterItem" v-if="filterCashierType && filterCashierType.length > 0">
        <h2>类型</h2>
        <div class="item">
          <span v-for="item in filterCashierType" :class="{isActive: filterForm.CashierType === item.Key}" @click="filterForm.CashierType = item.Key, tableQueryParams.CashierType = item.Key">{{item.Value}}</span>
        </div>
      </div>
      <div class="filterItem" v-if="filterShopSales && filterShopSales.length > 0">
        <h2 style="position: relative;">导购<span style="font-size: 14px;color: #d7d7d7;display: inline;background: none;margin-left: 10px;">(多选)</span>
          <i v-if="filterShopSales && filterShopSales.length > 3" style="position: absolute;right: 0;cursor: pointer;color: #cccccc;transform: rotate(90deg);" class="iconfont icon-jiantou" @click="showHide"></i>
        </h2>
        <transition name="fade">
          <div class="item" v-show="!isHide">
            <span :class="{isActive: filterForm.SalesId.length === 0}" @click="filterForm.SalesId = [], tableQueryParams.SalesId = []">全部</span>
            <span v-for="item in filterShopSales" :class="{isActive: filterForm.SalesId.indexOf(item.id) >= 0}" @click="selectShopSale(item.id)">{{item.realName}}</span>
          </div>
        </transition>
      </div>
      <div class="filterItem" v-if="filterCashier && filterCashier.length > 0">
        <h2 style="position: relative;">收银员<span style="font-size: 14px;color: #d7d7d7;display: inline;background: none;margin-left: 10px;">(多选)</span>
        <i v-if="filterCashier && filterCashier.length > 3" style="position: absolute;right: 0;cursor: pointer;color: #cccccc;transform: rotate(90deg);" class="iconfont icon-jiantou" @click="showCashierHide"></i>
        </h2>
        <transition name="fade">
        <div class="item" v-show="!isCashierHide">
          <span :class="{isActive: filterForm.Cashier.length === 0}" @click="filterForm.Cashier = [], tableQueryParams.Cashier = []">全部</span>
          <span v-for="item in filterCashier" :class="{isActive: filterForm.Cashier.indexOf(item.id) >= 0}" @click="selectCashier(item.id)">{{item.realName}}</span>
        </div>
      </transition>
      </div>
    </div>
    <div class="dataBox">
      <div class="dataBox-topWrapper">
        <div class="dataBox-topWrapper-echartsBox">
          <div class="dataBox-topWrapper-echartsBox-titleContent">
            总计: <span style="font-size: 25px; color: #cd2031;margin-left: 10px;">{{echartsTotal}}</span>
            <span style="font-size: 18px; color: #cd2031;">元</span>
          </div>
          <div class="dataBox-topWrapper-echartsBox-echartsContent">
            <div id="echarts" :style="{width: '72%', height: '100%'}"></div>
          </div>
          <div class="dataBox-topWrapper-echartsBox-footerContent">
            <div style="width: 72%;display: flex;justify-content: space-around;padding: 0 35px;">
              <div class="dataBox-topWrapper-echartsBox-footerContent-item">
                <span style="width: 11px; height: 11px; display: inline-block; background: #a7e6cd; border-radius: 50%;"></span>
                <span style="margin-left: 8px;">微信</span>
              </div>
              <div class="dataBox-topWrapper-echartsBox-footerContent-item">
                <span style="width: 11px; height: 11px; display: inline-block; background: #aecaff; border-radius: 50%;"></span>
                <span style="margin-left: 8px;">支付宝</span>
              </div>
              <div class="dataBox-topWrapper-echartsBox-footerContent-item">
                <span style="width: 11px; height: 11px; display: inline-block; background: #fbe38c; border-radius: 50%;"></span>
                <span style="margin-left: 8px;">预存款</span>
              </div>
              <div class="dataBox-topWrapper-echartsBox-footerContent-item">
                <span style="width: 11px; height: 11px; display: inline-block; background: #f9b8ba; border-radius: 50%;"></span>
                <span style="margin-left: 8px;">现金</span>
              </div>
            </div>
          </div>
        </div>
        <div class="dataBox-topWrapper-centerBox">
          <div class="dataBox-topWrapper-centerBox-topWrapper">
            <div>实收<span style="font-size: 13px;">(元)</span></div>
            <div style="color: #000;display: flex;align-items: center;">+<span style="font-size: 29px;">{{proceeds.Total}}</span></div>
          </div>
          <div class="dataBox-topWrapper-centerBox-line"></div>
          <div class="dataBox-topWrapper-centerBox-footerWrapper">
            <div class="dataBox-topWrapper-centerBox-footerWrapper-item">
              <div style="display: flex;align-items: center;">
                <i class="iconfont icon-weixin"></i>
                <span style="margin-left: 10px;">微信</span>
              </div>
              <div>
                +{{proceeds.Wechat}}
              </div>
            </div>
            <div class="dataBox-topWrapper-centerBox-footerWrapper-item">
              <div style="display: flex;align-items: center;">
                <i class="iconfont icon-zhifubao"></i>
                <span style="margin-left: 10px;">支付宝</span>
              </div>
              <div>
                +{{proceeds.Alipay}}
              </div>
            </div>
            <div class="dataBox-topWrapper-centerBox-footerWrapper-item">
              <div style="display: flex;align-items: center;">
                <i class="iconfont icon-xianjin"></i>
                <span style="margin-left: 10px;">预存款</span>
              </div>
              <div>
                +{{proceeds.Deposit}}
              </div>
            </div>
            <div class="dataBox-topWrapper-centerBox-footerWrapper-item">
              <div style="display: flex;align-items: center;">
                <i class="iconfont icon-xianjin"></i>
                <span style="margin-left: 10px;">现金</span>
              </div>
              <div>
                +{{proceeds.Cash}}
              </div>
            </div>
          </div>
        </div>
        <div class="dataBox-topWrapper-rightBox">
          <div class="dataBox-topWrapper-rightBox-topWrapper">
            <div>退款<span style="font-size: 13px;">(元)</span></div>
            <div style="color: #000;display: flex;align-items: center;">-<span style="font-size: 29px;">{{refund.Total}}</span></div>
          </div>
          <div class="dataBox-topWrapper-rightBox-line"></div>
          <div class="dataBox-topWrapper-rightBox-footerWrapper">
            <div class="dataBox-topWrapper-rightBox-footerWrapper-item">
              <div style="display: flex;align-items: center;">
                <i class="iconfont icon-weixin"></i>
                <span style="margin-left: 10px;">微信</span>
              </div>
              <div>
                -{{refund.Wechat}}
              </div>
            </div>
            <div class="dataBox-topWrapper-rightBox-footerWrapper-item">
              <div style="display: flex;align-items: center;">
                <i class="iconfont icon-zhifubao"></i>
                <span style="margin-left: 10px;">支付宝</span>
              </div>
              <div>
                -{{refund.Alipay}}
              </div>
            </div>
            <div class="dataBox-topWrapper-rightBox-footerWrapper-item">
              <div style="display: flex;align-items: center;">
                <i class="iconfont icon-xianjin"></i>
                <span style="margin-left: 10px;">预存款</span>
              </div>
              <div>
                -{{refund.Deposit}}
              </div>
            </div>
            <div class="dataBox-topWrapper-rightBox-footerWrapper-item">
              <div style="display: flex;align-items: center;">
                <i class="iconfont icon-xianjin"></i>
                <span style="margin-left: 10px;">现金</span>
              </div>
              <div>
                -{{refund.Cash}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dataBox-downWrapper">
        <div class="dataBox-downWrapper-tableBox">
          <table cellpadding="0" cellspacing="0">
            <thead>
              <tr>
                <th align="center">支付方式</th>
                <th align="center">时间</th>
                <th align="center">金额</th>
                <th align="center">收银员</th>
                <th align="center">导购</th>
                <th align="center">单号</th>
                <th align="center">下单方式</th>
              </tr>
            </thead>
            <tbody v-if="tableList && tableList.length > 0">
              <tr v-for="item in tableList" :key="item.Id">
                <td align="center">{{item.PayTypeStr}}</td>
                <td align="center">{{item.CreateTime | formatDate}}</td>
                <td align="center">{{item.Amount}}</td>
                <td align="center">{{item.Operator}}</td>
                <td align="center">{{item.SalesName}}</td>
                <td align="center">{{item.OrderIdsStr}}</td>
                <td align="center">{{item.OperatorRoleName}}</td>
              </tr>
            </tbody>
          </table>
          <div v-if="tableList.length === 0" style="text-align: center;padding: 50px;font-size: 18px;">
            暂无流水
          </div>
        </div>
        <div class="dataBox-downWrapper-paginationBox">
          <el-pagination background :total="total" layout="prev, pager, next" @current-change="handleCurrentChange"></el-pagination>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
import '@/assets/css/assembly.css'
import '@/assets/css/orderItems.css'
import { getDateSearchCondition, getTransShopSales, getOrderWay, getCashier, getCashierType, getStatistics, getList } from '@/api'
const compare = function(obj1, obj2) {
  const val1 = obj1.Value
  const val2 = obj2.Value
  if (val1 < val2) {
    return -1
  } else if (val1 > val2) {
    return 1
  } else {
    return 0
  }
}

export default {
  data() {
    return {
      filterLoading: false,
      filterTime: [],
      filterShopSales: [],
      filterOrderWay: [],
      filterCashier: [],
      filterCashierType: [],
      filterForm: {
        Begin: '',
        End: '',
        SalesId: [],
        Cashier: [],
        OrderWay: -1,
        CashierType: 0
      },
      tableQueryParams: {
        PageNo: 1,
        PageSize: 10,
        Begin: '',
        End: '',
        SalesId: [],
        Cashier: [],
        OrderWay: '',
        CashierType: ''
      },
      date: '',
      dateSelect: '',
      echartsTotal: 0,
      proceeds: {},
      refund: {},
      tableList: [],
      total: 0,
      isCustomDate: false,
      isOtherTime: false,
      index: 0,
      isPageInit: false,
      isHide: false,
      isCashierHide: false
    }
  },
  watch: {
    filterForm: {
      handler(val, oldVal) {
        if (this.isPageInit) {
          this.getStatistics()
          this.tableQueryParams.PageNo = 1
          this.getTableList()
        }
      },
      deep: true
    }
  },
  created() {
    const SalesId = this.$route.query.SalesId
    const timeObj = this.$route.query.time
    const cashierId = this.$route.query.cashierId
    if (SalesId) {
      this.filterForm.SalesId.push(SalesId)
      this.tableQueryParams.SalesId.push(SalesId)
      this.filterForm.Begin = this.tableQueryParams.Begin = timeObj.Begin
      this.filterForm.End = this.tableQueryParams.End = timeObj.End
      this.dateSelect = timeObj.dateSelect
      this.date = [timeObj.Begin, timeObj.End]
      if (timeObj.dateSelect === '自定义') this.isCustomDate = true
      this.isOtherTime = true
    }
    if (cashierId) {
      this.filterForm.Cashier.push(cashierId)
      this.tableQueryParams.Cashier.push(cashierId)
      this.filterForm.Begin = this.tableQueryParams.Begin = this.$route.query.startTime;
      this.filterForm.End = this.tableQueryParams.End = this.$route.query.endTime;
      this.dateSelect = "自定义";
      this.date = [this.$route.query.startTime, this.$route.query.endTime]
      this.isCustomDate = true
    }
    this.$emit("changeTitle", "交易流水")
    this.$emit("isBack", false)
  },
  mounted() {
    this.getFilterTime()
    this.getFilterShopSales()
    this.getFilterOrderWay()
    this.getFilterCashierType()
    this.getFilterCashier()
  },
  methods: {
    showHide() {
      this.isHide = !this.isHide
    },
    showCashierHide() {
      this.isCashierHide = !this.isCashierHide
    },
    initParams() {
      this.index++;
      if (this.index === 5) {
        console.log('chushihua')
        this.getTableList()
        this.getStatistics()
        this.isPageInit = true
      }
    },
    getFilterTime() {
      this.filterLoading = true
      getDateSearchCondition().then(res => {
        const data = res.data
        if (data.success) {
          this.filterTime = data.data
          if (this.filterTime && this.filterTime.length > 0 && !this.isOtherTime) {
            for (const item of this.filterTime) {
              if (item.Key === '昨天' && this.dateSelect !== '自定义') {
                this.dateSelect = item.Key
                this.filterForm.Begin = this.tableQueryParams.Begin = item.Begin
                this.filterForm.End = this.tableQueryParams.End = item.End
              }
            }
          }
        }
        this.initParams()
      })
    },
    getFilterShopSales() {
      getTransShopSales().then(res => {
        const data = res.data
        if (data.success) {
          this.filterShopSales = data.data
          this.initParams()
        }
      })
    },
    getFilterOrderWay() {
      getOrderWay().then(res => {
        const data = res.data
        if (data.success) {
          data.data.sort(compare)
          this.filterOrderWay = data.data
          if (this.filterOrderWay.length === 1) {
            [this.filterForm.OrderWay, this.tableQueryParams.OrderWay] = [this.filterOrderWay[0].Key, this.filterOrderWay[0].Key]
          }
          this.initParams()
        }
      })
    },
    getFilterCashier() {
      getCashier().then(res => {
        const data = res.data
        if (data.success) {
          this.filterCashier = data.data
          this.initParams()
        }
        this.filterLoading = false
      })
    },
    getFilterCashierType() {
      getCashierType().then(res => {
        const data = res.data
        data.data.sort(compare)
        if (data.success) {
          this.filterCashierType = data.data
          this.initParams()
        }
      })
    },
    getStatistics() {
      getStatistics(this.filterForm).then(res => {
        const data = res.data
        if (data.success) {
          const echartOptionData = data.data.PieChart
          this.proceeds = data.data.Proceeds
          this.refund = data.data.Refund
          this.echartsTotal = echartOptionData.Total
          const echartObj = this.$echarts.init(document.getElementById('echarts'))
          echartObj.setOption(this.getEchartOption(echartOptionData))
        }
      })
    },
    getTableList() {
      getList(this.tableQueryParams).then(res => {
        const data = res.data
        if (data.success) {
          this.tableList = data.data.Models
          this.total = data.data.Total
        }
      })
    },
    handleCurrentChange(val) {
      this.tableQueryParams.PageNo = val
      this.getTableList()
    },
    selectShopSale(id) {
      const index = this.filterForm.SalesId.indexOf(id)
      if (index >= 0) this.filterForm.SalesId.splice(index, 1)
      else this.filterForm.SalesId.push(id)
      this.tableQueryParams.SalesId = this.filterForm.SalesId
    },
    selectCashier(id) {
      const index = this.filterForm.Cashier.indexOf(id)
      if (index >= 0) this.filterForm.Cashier.splice(index, 1)
      else this.filterForm.Cashier.push(id)
      this.tableQueryParams.Cashier = this.filterForm.Cashier
    },
    selectDate(item) {
      this.isCustomDate = false
      this.date = ''
      this.filterForm.Begin = item.Begin
      this.filterForm.End = item.End
      this.tableQueryParams.Begin = item.Begin
      this.tableQueryParams.End = item.End
      this.dateSelect = item.Key
    },
    selectMyDate() {
      this.dateSelect = '自定义'
      this.isCustomDate = true
    },
    handleCustomDateChange(date) {
      date[1] = date[1].replace('00:00:00', '23:59:59')
      this.filterForm.Begin = this.tableQueryParams.Begin = date[0]
      this.filterForm.End = this.tableQueryParams.End = date[1]
      this.getStatistics()
      this.tableQueryParams.PageNo = 1
      this.getTableList()
    },
    getEchartOption(echartOptionData) {
      return {
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          // data : ['微信', '支付宝', '预存款', '现金'],
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            lineStyle: {
              color: 'RGBA(204, 204, 204, 1)'
            }
          }
        }],
        yAxis: [{
          type: 'value',
          show: false
        }],
        series: [{
          name: '直接访问',
          type: 'bar',
          barWidth: '60%',
          data: [echartOptionData.Wechat, echartOptionData.Alipay, echartOptionData.Deposit, echartOptionData.Cash],
          // data: [300, 200, 500, 89],
          label: {
            normal: {
              show: true,
              position: 'top',
              color: '#000'
            }
          },
          itemStyle: {
            normal: {
              // 定制显示（按顺序）
              color: function(params) {
                var colorList = ['#a7e6cd', '#aecaff', '#fbe38c', '#f9b8ba']
                return colorList[params.dataIndex]
              }
            }
          }
        }]
      }
    }
  },
  filters: {
    formatDate(value) {
      var t = value.slice(6, 19)
      var dt = new Date(parseInt(t));
      var year = dt.getFullYear();
      var month = (dt.getMonth() + 1) > 9 ? (dt.getMonth() + 1) : "0" + (dt.getMonth() + 1);
      var date = dt.getDate() > 9 ? dt.getDate() : "0" + dt.getDate();
      var hour = dt.getHours() > 9 ? dt.getHours() : "0" + dt.getHours();
      var minute = dt.getMinutes() > 9 ? dt.getMinutes() : "0" + dt.getMinutes();
      var second = dt.getSeconds() > 9 ? dt.getSeconds() : "0" + dt.getSeconds();
      return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    }
  }
}

</script>
<style lang="scss" scoped>
.isActive {
  background: #c7b187!important;
  color: #fff!important;
}

.filterBox {
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
}

.dataBox {
  width: calc(100% - 336px);
  background: #f4f6f9;
  position: absolute;
  top: 54px;
  right: 0;
  bottom: 0;
  padding: 16px;
  &-topWrapper {
    height: calc((100% - 16px) / 2);
    width: 100%;
    display: flex;
    &-echartsBox {
      width: calc((100% - 32px) / 2);
      height: 100%;
      background: #fff;
      &-titleContent {
        height: 100px;
        width: 100%;
        display: flex;
        align-items: center;
        padding-left: 40px;
        font-size: 18px;
      }
      &-footerContent {
        height: 60px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &-echartsContent {
        display: flex;
        justify-content: center;
        height: calc(100% - 160px);
        width: 100%;
      }
    }
    &-centerBox {
      width: calc((100% - 32px) / 4);
      height: 100%;
      margin-left: 16px;
      background: #fff;
      &-topWrapper {
        padding: 40px;
        font-size: 18px;
        color: rgba(115, 115, 115, 1);
      }
      &-line {
        height: 1px;
        background: rgba(230, 230, 230, 1);
        margin: 0 40px;
      }
      &-footerWrapper {
        padding: 35px 40px 0 40px;
        @media screen and(max-width: 1440px) {
          padding: 10px 40px 0 40px;
          font-size: 12px;
        }
        &-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
          @media screen and(max-width: 1440px) {
            margin-bottom: 5px;
          }
        }
      }
    }
    &-rightBox {
      width: calc((100% - 32px) / 4);
      height: 100%;
      margin-left: 16px;
      background: #fff;
      &-topWrapper {
        padding: 40px;
        font-size: 18px;
        color: rgba(115, 115, 115, 1);
      }
      &-line {
        height: 1px;
        background: rgba(230, 230, 230, 1);
        margin: 0 40px;
      }
      &-footerWrapper {
        padding: 35px 40px 0 40px;
        @media screen and(max-width: 1440px) {
          padding: 10px 40px 0 40px;
          font-size: 12px;
        }
        &-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
          @media screen and(max-width: 1440px) {
            margin-bottom: 5px;
          }
        }
      }
    }
  }
  &-downWrapper {
    height: calc((100% - 16px) / 2);
    width: 100%;
    margin-top: 16px;
    background: #fff;
    position: relative;
    &-tableBox {
      height: calc(100% - 60px);
      overflow-y: scroll;
      &::-webkit-scrollbar {
        display: none;
      }
      table {
        width: 100%;
        th {
          height: 56px;
          border-left: 1px solid #e6e6e6;
          border-bottom: 1px solid #e6e6e6;
          font-size: 16px;
          color: #808080;
          padding: 0 10px;
        }
        td {
          padding: 0 10px;
          color: #4c4c4c;
          font-size: 14px;
          height: 70px;
          border-bottom: 1px solid #e6e6e6;
        }
      }
    }
    &-paginationBox {
      height: 60px;
      position: absolute;
      bottom: 0;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      padding-bottom: 10px;
    }
  }
}

</style>
