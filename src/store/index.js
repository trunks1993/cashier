import Vue from 'vue'
import Vuex from 'vuex'
import menu from './modules/menu'
import cashier from './modules/cashier'
import mpTemp from './modules/mpTemp'

import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    menu,
    cashier,
    mpTemp
  },
  getters
})

export default store