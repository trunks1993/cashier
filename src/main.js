// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import '@/assets/css/style.css'
// import '@/assets/css/style.scss'
import '@/assets/font/iconfont.css'
import 'muse-ui/dist/muse-ui.css'
import MuseUI from 'muse-ui'
import tracking from 'tracking'
import echarts from 'echarts'
import 'tracking/build/data/face.js'
import Toast from '@/public/toast.js'
import '@/public/global.js'
import '@/public/printer.js'
import '@/public/usbprint.js'
import VueQriously from 'vue-qriously'
import ElementUI from 'element-ui'
import MsgBox from '@/components/MsgBox'

import 'element-ui/lib/theme-chalk/index.css'
import './styles/element-variables.scss' //自定义颜色
import '@/styles/index.scss'
import '@/permission' // 权限
import _ from 'lodash'

Vue.use(MuseUI)
Vue.use(Toast)
Vue.use(VueQriously)
Vue.use(tracking)
Vue.use(ElementUI)
Vue.use(MsgBox)

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.prototype.$_ = _

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
