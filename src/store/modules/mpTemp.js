const mpTemp = {
  state: {
    tempDataList: []
  },
  mutations: {
    SET_TEMPDATA: (state, data) => {
      state.tempDataList = data;
    }
  },
  actions: {
    SetTempData({ commit }, data) {
      commit('SET_TEMPDATA', data)
    }
  }
}

export default mpTemp
