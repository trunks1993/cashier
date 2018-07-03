const getters = {
  routes: state => state.menu.routes,
  userInfo: state => state.menu.userInfo,
  iscashier: state => state.menu.iscashier,
  vipInfo: state => state.cashier.vipInfo,
  selCard: state => state.cashier.selCard,
  selCoupon: state => state.cashier.selCoupon,
  selDiscount: state => state.cashier.selDiscount
}
export default getters