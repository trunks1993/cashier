<template>
  <div class="supplement-container">
    <div class="supplement-container-header">
      <img src="../../assets/images/vipManager/goback.png" @click="goBack">
      <span>补充会员信息</span>
    </div>
    <div class="mainBox">
      <div class="mainBox-left"></div>
      <div class="mainBox-right"></div>
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
  &-left {
    width: 200px;
    height: 500px;
    background: red;
  }
  &-right {
    width: 200px;
    height: 500px;
    background: black;
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
