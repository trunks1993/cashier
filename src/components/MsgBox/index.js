import MyMsgBox from './MsgBox'
const MsgBox = {
  install: function(Vue) {
    Vue.component('MsgBox', MyMsgBox)
  }
}
export default MsgBox
