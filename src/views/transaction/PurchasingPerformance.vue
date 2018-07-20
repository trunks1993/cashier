<template>
  <div class="transctionWrapper">
    <div class="filterBox" style="top: 54px;">
      <div class="filterItem">
        <h2>时间</h2>
        <div class="item">
          <span v-for="item in filterTime" :class="{isActive: dateSelect === item.Key}" @click="selectDate(item)">{{item.Key}}</span>
          <span :class="{isActive: dateSelect === '自定义'}" @click="selectMyDate">自定义</span>
          <el-date-picker v-model="date" v-if="isCustomDate" size="mini" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" style="width: 100%; margin-top: 10px;" @change="handleCustomDateChange" value-format="yyyy-MM-dd HH:mm:ss" unlink-panels>
          </el-date-picker>
        </div>
      </div>
      <div class="filterItem">
        <h2>排序</h2>
        <div class="item">
          <span @click="changeSort(false)" :class="{isActive: !filterForm.IsDesc}">升序</span>
          <span @click="changeSort(true)" :class="{isActive: filterForm.IsDesc}">降序</span>
        </div>
      </div>
    </div>
    <div class="dataBox">
      <div class="dataBox-tableWrapper">
        <table cellpadding="0" cellspacing="0">
          <thead>
            <tr>
              <th align="center">排名</th>
              <th align="center">导购</th>
              <th align="center">业绩</th>
              <th align="center">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in salesAchievementList" :key="item.SalesId">
              <td align="center">{{index + 1}}</td>
              <td align="center">{{item.SalesName}}</td>
              <td align="center">{{item.Achievements}}</td>
              <td align="center">
                <el-button @click="toTranscationIndex(item.SalesId)" type="text">查看</el-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
// import '@/assets/css/assembly.css'
import '@/assets/css/orderItems.css'
import { getDateSearchCondition, getSalesAchievements } from '@/api'
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
      filterTime: [],
      salesAchievementList: [],
      filterForm: {
        Begin: '',
        End: '',
        IsDesc: true
      },
      date: '',
      dateSelect: '',
      isCustomDate: false
    }
  },
  watch: {
    filterForm: {
      handler(val, oldVal) {
        this.getSalesAchievements()
      },
      deep: true
    }
  },
  created() {
    this.$emit("changeTitle", "导购业绩")
    this.$emit("isBack", false)
    this.getFilterTime()
  },
  methods: {
    getFilterTime() {
      getDateSearchCondition().then(res => {
        const data = res.data
        if (data.success) {
          this.filterTime = data.data
          if (this.filterTime && this.filterTime.length > 0) {
            for (const item of this.filterTime) {
              if (item.Key === '昨天') {
                this.dateSelect = item.Key
                this.filterForm.Begin = item.Begin
                this.filterForm.End = item.End
                this.getSalesAchievements()
                return
              }
            }
          }
        }
      })
    },
    getSalesAchievements() {
      getSalesAchievements(this.filterForm).then(res => {
        const data = res.data
        if (data.success) {
          this.salesAchievementList = data.data.Models
        }
      })
    },
    selectDate(item) {
      this.isCustomDate = false
      this.date = ''
      this.filterForm.Begin = item.Begin
      this.filterForm.End = item.End
      this.dateSelect = item.Key
    },
    selectMyDate() {
      this.dateSelect = '自定义'
      this.isCustomDate = true
    },
    handleCustomDateChange(date) {
      date[1] = date[1].replace('00:00:00', '23:59:59')
      this.filterForm.Begin = date[0]
      this.filterForm.End = date[1]
      this.getSalesAchievements()
    },
    changeSort(flag) {
      this.filterForm.IsDesc = flag
      // this.getSalesAchievements()
    },
    toTranscationIndex(id) {
      console.log(id)
      this.$router.push({
        path: '/transcation',
        // params: { 'SalesId': id }
        query: {
          SalesId: id,
          time: {
            dateSelect: this.dateSelect,
            Begin: this.filterForm.Begin,
            End: this.filterForm.End
          }
        }
      })
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

.dataBox {
  width: calc(100% - 336px);
  background: #f4f6f9;
  position: absolute;
  top: 54px;
  right: 0;
  bottom: 0;
  padding: 16px;
  &-tableWrapper {
    height: 100%;
    width: 100%;
    background: #fff;
    overflow-y: scroll;
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
}

</style>
