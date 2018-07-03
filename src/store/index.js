import Vue from 'vue'
import Vuex from 'vuex'
import menu from './modules/menu'
import cashier from './modules/cashier'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    menu,
    cashier
  },
  getters
})

export default store