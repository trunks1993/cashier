<template>
  <div class="mp-container">
    <div class="mp-container-phoneWrapper">
      <div class="phoneBox" :style="styleObj">
        <div id="phoneScreen" ref="phoneScreen" class="phoneBox-main">
          <transition-group name="fade" id="test">
            <template v-for="(item, index) in tempDataList">
              <div v-if="item.type === 0" :key="index" style="width: 284px;height: 100px;border: 1px dashed #f2f2f2;text-align: center;line-height: 100px;">放入此区域</div>
              <Header v-if="item.type === 1" :key="index"></Header>
              <Product v-else-if="item.type === 2" :key="index"></Product>
              <Footer v-else-if="item.type === 3" :key="index"></Footer>
            </template>
          </transition-group>
        </div>
      </div>
    </div>
    <div class="mp-container-toolsWrapper">
      <div @mousedown="mousedown($event)" @mouseup="mouseup($event, 1)" style="width: 284px;height: 100px;background: blue;position: relative;"></div>
      <div @mousedown="mousedown($event)" @mouseup="mouseup($event, 2)" style="width: 284px;height: 100px;background: red;position: relative;"></div>
      <div @mousedown="mousedown($event)" @mouseup="mouseup($event, 3)" style="width: 284px;height: 100px;background: green;position: relative;"></div>
    </div>
  </div>
</template>
<script>
import Header from './components/Header'
import Product from './components/Product'
import Footer from './components/Footer'
import store from '@/store'
import { mapGetters } from 'vuex'

let currentTemplate, offLX, offLY, screenPositionObj, containFlag
const setPosition = function(event) {
  currentTemplate.style.left = event.clientX - offLX + 'px' // 设置block的X坐标 
  currentTemplate.style.top = event.clientY - offLY + 'px' // 设置block的Y坐标 
  // 组件是否被拖入手机屏幕内
  containFlag = isContainer(screenPositionObj, currentTemplate.getBoundingClientRect())
  if (containFlag) {
    const indexObj = getNewSpaceIndex(event.pageY)
    if (indexObj) {
      if (store.getters.tempDataList[indexObj.index].type !== 0) {
        if (spaceIndex() === -1) {
          store.getters.tempDataList.splice(indexObj.isTopPart ? indexObj.index + 1 : indexObj.index, 0, { type: 0 })
        } else store.getters.tempDataList.splice(spaceIndex(), 1)
      }
    } else {
      if (spaceIndex() === -1) store.getters.tempDataList.push({ type: 0 })
    }
  } else {
    if (spaceIndex() >= 0) store.getters.tempDataList.splice(spaceIndex(), 1)
  }
}

// 获取提示框的index
function spaceIndex() {
  let index = -1
  store.getters.tempDataList.forEach((item, i) => {
    if (item.type === 0) return index = i
  })
  return index
}

// 判断插件是否移入了手机屏幕
function isContainer(screenPositionObj, templatePositionObj) {
  let flag = false
  const s_rx = screenPositionObj.x + screenPositionObj.width
  const t_rx = templatePositionObj.x + templatePositionObj.width
  const s_lx = screenPositionObj.x
  const t_lx = templatePositionObj.x
  // 在左边进入
  if (t_lx < s_lx) {
    if (t_rx - s_lx >= templatePositionObj.width / 2 && (templatePositionObj.y > screenPositionObj.y - templatePositionObj.height / 2 && templatePositionObj.y < screenPositionObj.y + screenPositionObj.height - templatePositionObj.height / 2)) {
      flag = true
    }
  } else {
    if (s_rx - t_lx >= templatePositionObj.width / 2 && (templatePositionObj.y > screenPositionObj.y - templatePositionObj.height / 2 && templatePositionObj.y < screenPositionObj.y + screenPositionObj.height - templatePositionObj.height / 2)) {
      flag = true
    }
  }

  return flag
}

// 找到屏幕中所有的子元素的上边Y和下边界y通过鼠标位置找出提示框应该插入的位置
function getNewSpaceIndex(pageY) {
  let indexObj
  const arr = []
  const toolDoms = document.getElementById('test').children
  for (var i = 0; i < toolDoms.length; i++) {
    arr.push([toolDoms[i].getBoundingClientRect().y, toolDoms[i].getBoundingClientRect().y + toolDoms[i].getBoundingClientRect().height])
  }
  arr.forEach((item, i) => {
    if (pageY > item[0] && pageY < item[1]) {
      if (pageY - item[0] < item[1] - pageY) {
        indexObj = { index: i, isTopPart: true }
      } else {
        indexObj = { index: i, isTopPart: false }
      }
    }
  })
  return indexObj
}

export default {
  components: {
    Header,
    Product,
    Footer
  },
  data() {
    return {
      styleObj: {
        background: `url(${require('@/assets/images/phonebg.png')}) no-repeat`,
        width: '330px',
        height: '670px',
        position: 'absolute',
        top: 'calc(50% - 335px)',
        left: 'calc(50% - 165px)'
      },
      oldPosition: ''
    }
  },
  computed: {
    ...mapGetters([
      'tempDataList'
    ])
  },
  methods: {
    mousedown(event) {
      const newDom = event.currentTarget.cloneNode()
      newDom.style['z-index'] = 10
      newDom.style.opacity = 0.5
      event.currentTarget.appendChild(newDom)
      // 获取手机屏幕位置信息 
      screenPositionObj = this.$refs.phoneScreen.getBoundingClientRect()
      //获取鼠标当前坐标 
      const pageX = event.clientX
      const pageY = event.clientY
      //获取block的坐标，左边界和上边界 
      const offX = parseInt(newDom.style.left) || 0
      const offY = parseInt(newDom.style.top) || 0

      this.oldPosition = { top: offY, left: offX }

      currentTemplate = newDom
      //计算出鼠标坐标相对于block坐标的间距 
      offLX = pageX - offX
      offLY = pageY - offY
      document.addEventListener("mousemove", setPosition)
    },
    mouseup(event, type) {
      if (containFlag) {
        this.tempDataList.push({
          type: type
        })
        event.currentTarget.removeChild(currentTemplate)
        containFlag = false
      } else {
        event.currentTarget.removeChild(currentTemplate)
      }
      if (spaceIndex() >= 0) this.tempDataList.splice(spaceIndex(), 1)

      document.removeEventListener("mousemove", setPosition)
    }
  }
}

</script>
<style lang="scss" scoped>
.fade-enter-active {
  transition: opacity .5s;
}

.fade-enter,
.fade-leave-to
/* .fade-leave-active below version 2.1.8 */

{
  opacity: 0;
}

.mp-container {
  height: 100%;
  display: flex;
  &-phoneWrapper {
    height: 100%;
    width: 498px;
    position: relative;
    .phoneBox-main {
      width: 284px;
      height: 457px;
      background: #fff;
      position: absolute;
      left: 19px;
      top: 128px;
      overflow: auto;
      &::-webkit-scrollbar {
        //横向 开始端 增量按钮
        display: none;
      }
    }
  }
  &-toolsWrapper {
    height: 100%;
    width: calc(100% - 498px);
  }
}

</style>
