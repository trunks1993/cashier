const getters = {
  routes: state => state.menu.routes,
  userInfo: state => state.menu.userInfo,
  iscashier: state => state.menu.iscashier,
  vipInfo: state => state.cashier.vipInfo,
  selCard: state => state.cashier.selCard,
  selCoupon: state => state.cashier.selCoupon,
  selDiscount: state => state.cashier.selDiscount,
  pcNumber: state => state.menu.pcNumber,
  tempDataList: state => state.mpTemp.tempDataList
}
export default getters