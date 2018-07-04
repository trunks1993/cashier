<template>
  <div class="msgBox-container">
    <div class="msgBox-container-mainBox">
      <img :src="type === 'warning' ? warning : success">
      <div class="msgBox-container-mainBox-msg">{{content || '警告'}}</div>
      <div class="msgBox-container-mainBox-btn" @click="iknown">我知道了</div>
    </div>
  </div>
</template>
<script>
import warning from './images/warning.png'
import success from './images/success.png'
export default {
  props: ['type', 'content'],
  data() {
    return {
      warning,
      success
    }
  },
  methods: {
    iknown() {
      this.$emit('iknown')
    }
  }
}

</script>
<style lang="scss" scoped>
.msgBox-container {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  &-mainBox {
    width: 363px;
    height: 187px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border-radius: 4px;
    &-msg {
      margin-top: 18px;
      line-height: 16px;
    }
    &-btn {
      margin-top: 58px;
      color: #C7B187;
      border-bottom: 1px solid #C7B187;
    }
  }
}

</style>
