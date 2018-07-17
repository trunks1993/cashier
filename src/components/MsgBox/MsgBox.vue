<template>
  <transition name='fade'>
    <div class="msgBox-container">
      <div class="msgBox-container-mainBox">
        <img :src="type === 'warning' ? warning : success">
        <div class="msgBox-container-mainBox-msg">{{content || '警告'}}</div>
        <div class="msgBox-container-mainBox-btn" @click="iknown">我知道了</div>
      </div>
    </div>
  </transition>
</template>
<script>
import warning from './images/warning.png'
import success from './images/success.png'
export default {
  data() {
    return {
      warning,
      success,
      content: '',
      type: '',
      duration: 3000,
      visible: false,
      callBack: ''
    }
  },
  mounted() {
    // this.setTimer() // 挂载的时候就开始计时，3000ms后消失
  },
  methods: {
    // setTimer() {
    //   setTimeout(() => {
    //     // this.close() // 3000ms之后调用关闭方法
    //   }, this.duration)
    // },
    iknown() {
      this.close()
      this.callBack()
    },
    close() {
      this.visible = false
      // setTimeout(() => {
      //   this.$destroy(true)
      //   this.$el.parentNode.removeChild(this.$el) // 从DOM里将这个组件移除
      // }, 500)
      this.$destroy(true)
      this.$el.parentNode.removeChild(this.$el) // 从DOM里将这个组件移除
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
