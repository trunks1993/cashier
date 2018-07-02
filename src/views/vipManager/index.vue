<template>
  <div class="main-container">
    <div class="vipWrapper">
      <div class="vipWrapper-header">
        <div class="vipWrapper-header-title">会员列表</div>
        <div class="vipWrapper-header-addBtn" @click="addVip" :class="{isAddActive: componentStatus === 3}">
          <img src="../../assets/images/plus.png" alt="">
          <span>新增会员</span>
        </div>
      </div>
      <div class="vipWrapper-filter">
        <input type="text" placeholder="请输入手机号码、扫描会员信息" v-model="queryFilterForm.key" @keyup.enter="search">
        <img src="../../assets/images/scan.png">
      </div>
      <div class="vipWrapper-mainbox">
        <div class="vipWrapper-mainbox-item" v-for="item in vipList" :class="{active: item.id === selectVipId}" @click="selectVip(item)">
          <img :src="item.photo" alt="">
          <div class="vipWrapper-mainbox-item-content">
            <span>{{item.showName}}</span>
            <span :style="!item.cellPhone ? 'color: #C7B187;' : ''">{{item.cellPhone || '未登记手机号'}}</span>
            <span>预存款：￥{{item.balance || 0}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;可用积分：{{item.availableIntegrals || 0}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="rightWrapper">
      <Editor :vipDetail="vipDetail" @toCardAndTrade="toCardAndTrade" v-if="componentStatus === 1"></Editor>
      <CardAndTrade :cardAndTradeInfo="cardAndTradeInfo" @goBack='goBack' v-if="componentStatus === 2"></CardAndTrade>
      <AddVip @closeAdd="closeAdd" @supplementEditor="supplementEditor" v-if="componentStatus === 3"></AddVip>
      <SupplementEditor :supplementData="supplementData" @goBack='goBack' @success='addSuccess' v-if="componentStatus === 4"></SupplementEditor>
    </div>
  </div>
</template>
<script>
import { queryMember, getMemberDetail, getMemberCardList, getCouponList, getUserInfo } from '@/api'
import Editor from './Editor'
import CardAndTrade from './CardAndTrade'
import AddVip from './AddVip'
import SupplementEditor from './SupplementEditor'

export default {
  components: {
    Editor,
    CardAndTrade,
    AddVip,
    SupplementEditor
  },
  data() {
    return {
      vipList: [],
      queryFilterForm: {
        key: '',
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
      selectVipId: -1,
      vipDetail: '',
      componentStatus: 0,
      cardAndTradeInfo: '',
      supplementData: ''
    }
  },
  created() {
    this.getVipList()
  },
  computed: {
    isLast() {
      return this.vipList.length === this.total
    }
  },
  mounted() {
    this.$nextTick(() => {
      const el = document.querySelector('.vipWrapper-mainbox')
      const offsetHeight = el.offsetHeight
      el.onscroll = () => {
        if (!this.isLast) {
          const scrollTop = el.scrollTop
          const scrollHeight = el.scrollHeight
          console.log(offsetHeight + scrollTop, scrollHeight)
          if (offsetHeight + scrollTop === scrollHeight) {
            this.queryFilterForm.pageNo++
              queryMember(this.queryFilterForm).then(res => {
                if (data.success) {
                  this.vipList.push(data.data.models)
                }
              })
          }
        }
      }
    })
  },
  methods: {
    getVipList() {
      queryMember(this.queryFilterForm).then(res => {
        const data = res.data
        if (data.success) {
          this.vipList = data.data.models
          this.total = data.data.total
        }
      })
    },
    search() {
      this.getVipList()
    },
    selectVip(item) {
      if (this.selectVipId !== item.id) {
        this.selectVipId = item.id
        getMemberDetail(item.id).then(res => {
          const data = res.data
          if (data.success) {
            this.componentStatus = 1
            this.vipDetail = data.data
          }
        })
      }
    },
    toCardAndTrade(isGetCard) {
      const requestApi = isGetCard ? getMemberCardList : getCouponList
      requestApi(this.vipDetail.id).then(res => {
        const data = res.data
        if (data.success) {
          this.componentStatus = 2
          this.cardAndTradeInfo = {
            isCard: isGetCard,
            data: data.data
          }
        }
      })
    },
    goBack(componentStatus) {
      this.componentStatus = componentStatus
    },
    addVip() {
      this.componentStatus = 3
      this.selectVipId = -1
    },
    closeAdd() {
      this.componentStatus = 0
    },
    supplementEditor(phone, isWechatWay) {
      if (isWechatWay) {
        getUserInfo(phone).then(res => {
          const data = res.data
          if (data.success) {
            this.supplementData = data.data
            this.supplementData.isWechatWay = isWechatWay
            this.supplementData.phone = phone
            this.supplementData.realname = ''
            this.supplementData.birthday = ''
            this.componentStatus = 4
          }
          this.componentStatus = 4
        })
      } else {
        this.supplementData = {
          isWechatWay: isWechatWay,
          phone: phone,
          realName: '',
          birthDay: '',
          sex: 1
        }
        this.componentStatus = 4
      }
    },
    addSuccess() {
      this.componentStatus = 0
      this.getVipList()
    }
  }
}

</script>
<style lang="scss" scoped>
.main-container {
  display: flex;
}

.flex_cc {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex_sb {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.active {
  background: #F2F2F2;
}

.isAddActive {
  font-size: 14px;
  color: #333333;
  position: absolute;
  right: 0;
  padding-right: 29px;
  height: 39px;
  border-radius: 39px 0 0 39px;
  padding-left: 20px;
  background: #F2F2F2;
}

.vipWrapper {
  width: 498px;
  height: 100%;
  background: #fff;
  &-header {
    @extend .flex_sb;
    height: 61px;
    padding: 0 30px;
    position: relative;
    &-title {
      font-size: 20px;
      color: #333333;
      font-weight: bolder;
    }
    &-addBtn {
      @extend .flex_cc;
      font-size: 14px;
      color: #333333;
      span {
        margin-left: 8px;
      }
    }
  }
  &-filter {
    position: relative;
    padding: 0 26px;
    height: 48px;
    input {
      width: 100%;
      height: 100%;
      border: 1px solid #C7B187;
      border-radius: 4px;
      padding: 0 40px 0 34px;
    }
    img {
      position: absolute;
      right: 40px;
      top: 12px;
    }
  }
  &-mainbox {
    margin-top: 16px;
    height: calc(100% - 125px);
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
    }
    &-item {
      padding: 17px 26px;
      display: flex;
      img {
        height: 59px;
        width: 59px;
        border-radius: 100%;
      }
      &-content {
        margin-left: 25px;
        width: calc(100% - 84px);
        display: flex;
        flex-direction: column;
        & span:nth-child(1) {
          font-size: 16px;
          color: rgba(51, 51, 51, 1);
          line-height: 16px;
          font-weight: bolder;
        }
        & span:nth-child(2) {
          font-size: 14px;
          color: rgba(51, 51, 51, 1);
          line-height: 14px;
          margin-top: 9px;
        }
        & span:nth-child(3) {
          font-size: 12px;
          color: #999999;
          line-height: 12px;
          margin-top: 16px;
        }
      }
    }
  }
}

.rightWrapper {
  width: calc(100% - 498px);
  height: 100%;
  background: #F2F2F2;
}

</style>
