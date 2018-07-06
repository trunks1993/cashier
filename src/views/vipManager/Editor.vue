<template>
  <div class="editor-container">
    <div class="editor-container-header">
      <div class="editor-container-header-leftBox">
        <img v-if="vipDetail.photo" :src="vipDetail.photo">
        <img v-else src="../../assets/images/vipManager/noImg.png">
        <div class="editor-container-header-leftBox-baseInfo">
          <div>{{vipDetail.showName}}</div>
          <div>{{vipDetail.gradeName}}</div>
          <div>{{vipDetail.cellPhone}}</div>
        </div>
      </div>
      <div class="editor-container-header-line">
      </div>
      <div class="editor-container-header-rightBox">
        <div class="editor-container-header-rightBox-item">
          <div>{{vipDetail.availableIntegrals}}</div>
          <div>可用积分</div>
        </div>
        <div class="editor-container-header-rightBox-item">
          <div>{{vipDetail.balance}}</div>
          <div>余额</div>
        </div>
      </div>
    </div>
    <div class="editor-container-mainBox">
      <div class="editor-container-mainBox-leftWrapper">
        <div class="editor-container-mainBox-leftWrapper-inputBtn" @click="getCardList(true)">
          <div class="editor-container-mainBox-leftWrapper-inputBtn-title">
            <img src="../../assets/images/vipManager/vipcard.png">
            <span>会员卡</span>
          </div>
          <div class="editor-container-mainBox-leftWrapper-inputBtn-arrowbox"><span>{{vipDetail.cardNum}}张</span><img src="../../assets/images/vipManager/arrow.png"></div>
        </div>
        <div class="editor-container-mainBox-leftWrapper-inputBtn" style="margin-top: 25px;" @click="getCardList(false)">
          <div class="editor-container-mainBox-leftWrapper-inputBtn-title">
            <img src="../../assets/images/vipManager/vipcard.png">
            <span>优惠券</span>
          </div>
          <div class="editor-container-mainBox-leftWrapper-inputBtn-arrowbox"><span>{{vipDetail.couponNum}}张</span><img src="../../assets/images/vipManager/arrow.png"></div>
        </div>
        <div class="editor-container-mainBox-leftWrapper-item">
          <div><img src="../../assets/images/vipManager/count.png"><span class="editor-container-mainBox-leftWrapper-item-title">近3个月消费次数</span></div>
          <span class="editor-container-mainBox-leftWrapper-item-dataSpan">{{vipDetail.tradeCount}}</span>
        </div>
        <div class="editor-container-mainBox-leftWrapper-item">
          <div><img src="../../assets/images/vipManager/yuan.png"><span class="editor-container-mainBox-leftWrapper-item-title">近3个月净消费金额</span></div>
          <span class="editor-container-mainBox-leftWrapper-item-dataSpan">￥{{vipDetail.tradeAmount}}</span>
        </div>
        <div class="editor-container-mainBox-leftWrapper-item">
          <div><img src="../../assets/images/vipManager/play.png"><span class="editor-container-mainBox-leftWrapper-item-title">休眠时间</span></div>
          <span class="editor-container-mainBox-leftWrapper-item-dataSpan">{{vipDetail.sleepDays}}</span>
        </div>
        <div class="editor-container-mainBox-leftWrapper-item">
          <div><img src="../../assets/images/vipManager/ren.png"><span class="editor-container-mainBox-leftWrapper-item-title">注册时间</span></div>
          <span class="editor-container-mainBox-leftWrapper-item-dataSpan">{{vipDetail.createDateStr}}</span>
        </div>
      </div>
      <div class="editor-container-mainBox-rightWrapper">
        <div class="editor-container-mainBox-rightWrapper-header">
          <div class="editor-container-mainBox-rightWrapper-header-titleBox">
            <div></div>
            <span>会员资料</span>
          </div>
          <div class="editor-container-mainBox-rightWrapper-header-submitBox" @click="editorControl">{{isEditor ? '提交' : '编辑'}}</div>
        </div>
        <div class="editor-container-mainBox-rightWrapper-item">
          <span>手机号</span>
          <span>{{vipDetail.cellPhone}}</span>
        </div>
        <div class="editor-container-mainBox-rightWrapper-item">
          <span>姓名</span>
          <span v-if="!isEditor">{{vipDetail.realName}}</span>
          <el-input v-else v-model="vipDetail.realName" clearable size="mini" style="width: 130px"></el-input>
        </div>
        <div class="editor-container-mainBox-rightWrapper-item">
          <span>昵称</span>
          <span>{{vipDetail.nick}}</span>
        </div>
        <div class="editor-container-mainBox-rightWrapper-item">
          <span>性别</span>
          <span v-if="!isEditor">{{vipDetail.sex === 1 ? '男' : '女'}}</span>
          <div v-else>
            <el-radio v-model="vipDetail.sex" :label="1">男</el-radio>
            <el-radio v-model="vipDetail.sex" :label="2">女</el-radio>
          </div>
        </div>
        <div class="editor-container-mainBox-rightWrapper-item">
          <span>生日日期</span>
          <span v-if="!isEditor">{{vipDetail.birthDay}}</span>
          <el-date-picker v-else size="mini" style="width: 130px;" v-model="vipDetail.birthDay" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { editMember } from '@/api'
export default {
  props: ['vipDetail'],
  data() {
    return {
      isEditor: false
    }
  },
  methods: {
    editorControl() {
      if (this.isEditor) {
        if (!this.vipDetail.realName) {
          this.$toast('姓名不能为空')
          return
        } else {
          editMember({
            id: this.vipDetail.id,
            realName: this.vipDetail.realName,
            sex: this.vipDetail.sex,
            birthDay: this.vipDetail.birthDay
          }).then(res => {
            const data = res.data
            this.$toast(data.msg)
            if (!data.success) return
          })
        }
      }
      this.isEditor = !this.isEditor
    },
    getCardList(isGetCard) {
      this.$emit('toCardAndTrade', isGetCard)
    }
  }
}

</script>
<style lang="scss" scoped>
.editor-container {
  height: 100%;
  padding: 42px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  &-header {
    width: 100%;
    border: 10px solid rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    padding: 42px;
    &-leftBox {
      display: flex;
      align-items: center;
      img {
        width: 90px;
        height: 90px;
        border-radius: 100%;
      }
      &-baseInfo {
        margin-left: 35px;
        width: 100px;
        height: 82px;
        & div:nth-child(1) {
          color: #333333;
          font-size: 16px;
          line-height: 16px;
        }
        & div:nth-child(2) {
          color: #C7B187;
          font-size: 12px;
          border-radius: 9px;
          border: 1px solid #C7B187;
          display: inline-block;
          padding: 0 6px;
          margin-top: 10px;
        }
        & div:nth-child(3) {
          color: #333333;
          font-size: 14px;
          line-height: 14px;
          margin-top: 12px;
        }
      }
    }
    &-line {
      width: 1px;
      height: 89px;
      background: rgba(0, 0, 0, 0.1);
      margin-left: 80px;
    }
    &-rightBox {
      display: flex;
      justify-content: space-around;
      width: 100%;
      &-item {
        text-align: center;
        & div:nth-child(1) {
          color: #E00000;
          font-size: 22px;
        }
        & div:nth-child(2) {
          color: #333333;
          font-size: 14px;
          margin-top: 15px;
        }
      }
    }
  }
  &-mainBox {
    margin-top: 42px;
    display: flex;
    padding: 0 20px;
    justify-content: space-between;
    &-leftWrapper {
      width: 342px;
      &-inputBtn {
        width: 100%;
        height: 61px;
        border-radius: 4px;
        border: 1px solid #C7B187;
        padding: 0 29px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        &-title {
          span {
            margin-left: 10px;
          }
          img {
            vertical-align: middle;
          }
        }
        &-arrowbox {
          span {
            font-size: 16px;
            color: #C7B187;
          }
          img {
            margin-left: 12px;
          }
        }
      }
      &-item {
        margin-top: 30px;
        display: flex;
        justify-content: space-between;
        &-title {
          font-size: 14px;
          color: #333333;
          margin-left: 13px;
        }
        &-dataSpan {
          font-size: 14px;
          color: #333333;
        }
        img {
          vertical-align: middle;
        }
      }
    }
    &-rightWrapper {
      width: 300px;
      &-header {
        display: flex;
        justify-content: space-between;
        &-titleBox {
          display: flex;
          align-items: center;
          div {
            width: 6px;
            height: 13px;
            background: #C7B187;
            border-radius: 4px;
          }
          span {
            font-size: 14px;
            color: #333333;
            font-weight: bolder;
            margin-left: 7px;
          }
        }
        &-submitBox {
          width: 55px;
          height: 25px;
          background: rgba(224, 0, 0, 0.08);
          border-radius: 13px;
          font-size: 14px;
          font-family: MicrosoftYaHei;
          color: #E00000;
          text-align: center;
          line-height: 25px;
        }
      }
      &-item {
        padding: 0 13px;
        margin-top: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 28px;
      }
    }
  }
}

</style>
