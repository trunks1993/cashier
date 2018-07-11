const cashier = {
  state: {
    vipInfo: '',
    selCard: '',
    selCoupon: '',
    selDiscount: ''
  },
  mutations: {
    SET_VIPINFO: (state, vipInfo) => {
      state.vipInfo = vipInfo
    },
    SET_SELCARD: (state, selCard) => {
      state.selCard = selCard
    },
    SET_SELCOUPON: (state, selCoupon) => {
      state.selCoupon = selCoupon
    },
    SET_SELDISCOUNT: (state, selDiscount) => {
      state.selDiscount = selDiscount;
    }
  },
  actions: {
    SetVipInfo({ commit }, vipInfo) {
      commit('SET_VIPINFO', vipInfo)
    },
    SetSelCard({ commit }, selCard) {
      commit('SET_SELCARD', selCard)
    },
    SetSelCoupon({ commit }, selCoupon) {
      commit('SET_SELCOUPON', selCoupon)
    },
    SetSelDiscount({ commit }, selDiscount) {
      commit('SET_SELDISCOUNT', selDiscount)
    }
  }
}

export default cashier
