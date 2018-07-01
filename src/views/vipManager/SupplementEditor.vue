<template>
  <div class="supplement-container">
    <div class="supplement-container-header">
      <img src="../../assets/images/vipManager/goback.png" @click="goBack">
      <span>补充会员信息</span>
    </div>
    <div class="mainBox">
      <div class="mainBox-left">
        <div class="mainBox-left-header">
          <div class="mainBox-left-header-shape"></div>
          <span>基本信息</span>
        </div>
        <div class="mainBox-left-item">
          <span>头像</span>
          <img src="">
        </div>
        <div class="mainBox-left-item">
          <span>手机号</span>
          <span>18108231234</span>
        </div>
        <div class="mainBox-left-item">
          <span>姓名</span>
          <el-input v-model="supplementData.realName" clearable size="mini" style="width: 130px"></el-input>
        </div>
        <div class="mainBox-left-item">
          <span>微信名</span>
          <span>逆风如解意</span>
        </div>
        <div class="mainBox-left-item">
          <span>性别</span>
          <div>
            <el-radio v-model="supplementData.sex" :label="1">男</el-radio>
            <el-radio v-model="supplementData.sex" :label="2">女</el-radio>
          </div>
        </div>
        <div class="mainBox-left-item">
          <span>生日日期</span>
          <el-date-picker size="mini" style="width: 130px;" v-model="supplementData.birthDay" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
      </div>
      <div class="mainBox-right">
        <div class="mainBox-right-header">
          <div class="mainBox-right-header-title">
            <div class="mainBox-right-header-title-shape"></div>
            <span>会员卡</span>  
          </div>
          <div class="mainBox-right-header-add">
            <span>+</span>
            <span>添加</span>
          </div>
        </div>
        <div class="mainBox-right-detail">
          （默认已选择等级卡，可选择无门槛卡）
        </div>
      </div>
    </div>
    <div class="bottomLine">
    </div>
    <div class="sbmBtn">
      <div class="sbmBtn-btn">确认</div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['supplementData'],
  data() {
    return {

    }
  },
  methods: {
    goBack() {
      this.$emit('goBack', 3)
    }
  }
}

</script>
<style lang="scss" scoped>
.supplement-container {
  height: 100%;
  padding: 30px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  &-header {
    position: relative;
    width: 100%;
    height: 35px;
    text-align: center;
    img {
      position: absolute;
      left: 0;
    }
    span {
      line-height: 35px;
      font-size: 18px;
      font-weight: bolder;
      color: #333333;
    }
  }
}

.mainBox {
  display: flex;
  justify-content: space-between;
  margin-top: 100px;
  padding: 0 100px;
  &-left {
    width: 270px;
    // height: 500px;
    // background: red;
    &-header {
      display: flex;
      align-items: center;
      span {
        margin-left: 6px;
        color: #333333;
        font-weight: bolder;
        font-size: 14px;
      }
      &-shape {
        width:6px;
        height:13px;
        background: rgba(199,177,135,1);
        border-radius:3px;
      }
    }
    &-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 39px;
      padding-left: 10px;
    }
  }
  &-right {
    width: 284px;
    // height: 500px;
    // background: black;
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      &-title {
        display: flex;
        align-items: center;
        span {
          margin-left: 6px;
          color: #333333;
          font-weight: bolder;
          font-size: 14px;
        }
        &-shape {
          width:6px;
          height:13px;
          background: rgba(199,177,135,1);
          border-radius:3px;
        }  
      }
      &-add {
        span {
          color: #c7b187;
          font-size: 14px;
        }
      }
    }
    &-detail {
      color: #999999;
      font-size: 12px;
      line-height: 12px;
      margin-top: 8px;
    }
  }
}

.bottomLine {
  margin-top: 25px;
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  width: 95%;
  margin: auto;
  margin-top: 25px;
}

.sbmBtn {
	margin: auto;
	margin-top: 27px;
	text-align: right;
	width: 95%;
  &-btn {
  	display: inline-block;
    width: 135px;
    height: 48px;
    background: rgba(199, 178, 135, 1);
    border-radius: 4px;
    color: #fff;
    line-height: 48px;
    text-align: center;
    font-size:16px;
  }
}

</style>
