import MyMsgBox from './MsgBox'
import Vue from 'Vue'

const MsgConstructor = Vue.extend(MyMsgBox) // 直接将Vue组件作为Vue.extend的参数
let nId = 1
const msgBox = (type, content, callBack) => {
  let id = 'msgBox-' + nId++

  const MsgBoxInstance = new MsgConstructor({
    data: {
      content: content,
      type: type,
      callBack: callBack
    }
  }) // 实例化一个带有content内容的Notice

  MsgBoxInstance.id = id
  MsgBoxInstance.vm = MsgBoxInstance.$mount() // 挂载但是并未插入dom，是一个完整的Vue实例
  MsgBoxInstance.vm.visible = true
  MsgBoxInstance.dom = MsgBoxInstance.vm.$el
  document.body.appendChild(MsgBoxInstance.dom) // 将dom插入body
  MsgBoxInstance.dom.style.zIndex = nId + 1001 // 后插入的Notice组件z-index加一，保证能盖在之前的上面
  return MsgBoxInstance.vm
}
export default {
  install: Vue => {
    Vue.prototype.$msgBox = msgBox
  }
}
