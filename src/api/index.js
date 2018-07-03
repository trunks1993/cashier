import request from '@/utils/request'

// app
export function mockLogin(username, password) {
  return request({
    url: '/SellerAdmin/Login/LoginForCashier',
    method: 'post',
    params: {
      username: username,
      password: password
    }
  })
}
export function getSellerManager() {
  return request({
    url: '/SellerAdmin/Cashier/GetSellerManager',
    method: 'get'
  })
}
export function saveCashierShifSetting(data) {
  return request({
    url: '/SellerAdmin/CashierShift/SaveCashierShifSetting',
    method: 'post',
    data: data,
    headers: { 'X-Requested-With': 'XMLHttpRequest' }
  })
}
export function beat(guid) {
  return request({
    url: '/SellerAdmin/Cashier/Beat?token=' + guid,
    method: 'get'
  })
}

// chargMoney
export function getShopStoredValueAndPay() {
  return request({
    url: '/SellerAdmin/Cashier/GetShopStoredValueAndPay',
    method: 'get'
  })
}

export function chargeScanPay(data) {
  return request({
    url: '/SellerAdmin/Cashier/ChargeScanPay',
    method: 'post',
    params: data
  })
}

export function chargeSubmit(data) {
  return request({
    url: '/SellerAdmin/Cashier/ChargeSubmit',
    method: 'post',
    params: data
  })
}
export function getChargeGift(money, userId) {
  return request({
    url: `/sellerAdmin/Cashier/GetChargeGift?money=${money}&userId=${userId}`,
    method: 'get',
    headers: { 'X-Requested-With': 'XMLHttpRequest' }
  })
}
// index
export function getShopProductsByAutoId(sku) {
  return request({
    url: '/SellerAdmin/Cashier/GetShopProductsByAutoId?autoIds=' + sku,
    method: 'get'
  })
}

export function searchProduct(checkType, pageNo, pageSize) {
  return request({
    url: '/SellerAdmin/Cashier/SearchProduct?categoryId=' + checkType + '&pageNo=' + pageNo + '&pageSize=' + pageSize,
    method: 'get'
  })
}

export function getStoreCategoryContainProduct() {
  return request({
    url: '/SellerAdmin/Cashier/GetStoreCategoryContainProduct',
    method: 'get'
  })
}
export function getSKUByBarcode(productCode) {
  return request({
    url: '/SellerAdmin/Cashier/GetSKUByBarcode?barcode=' + productCode,
    method: 'get'
  })
}
export function orderSubmitByCart(data) {
  return request({
    url: '/SellerAdmin/Cashier/OrderSubmitByCart',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    data: data
  })
}
export function getShopProductsSKUsByAutoId(autoIds) {
  return request({
    url: '/SellerAdmin/Cashier/GetShopProductsSKUsByAutoId?autoIds=' + autoIds,
    method: 'get'
  })
}

// order
export function getShopSales() {
  return request({
    url: '/SellerAdmin/Cashier/GetShopSales',
    method: 'get'
  })
}
export function submitOrderAndPay(data) {
  console.log(JSON.stringify(data))
  return request({
    url: '/SellerAdmin/Cashier/SubmitOrderAndPay',
    method: 'post',
    data: data
  })
}

// orderDetails
export function getShopOrderDetail(orderId) {
  console.log('api', orderId)
  return request({
    url: '/SellerAdmin/CashierOrder/GetShopOrderDetail?orderId=' + orderId,
    method: 'get'
  })
}
export function getRefundInfo(orderId) {
  console.log('api', orderId)
  return request({
    url: '/SellerAdmin/CashierOrder/GetRefundInfo?orderId=' + orderId,
    method: 'get'
  })
}

// orderItem
export function getShopOrder(pageNo, pageSize, cardNo, updata) {
  return request({
    url: '/SellerAdmin/CashierOrder/GetShopOrder?pageNo=' + pageNo + '&pageSize=' + pageSize + '&cardNo=' + cardNo + updata,
    method: 'get'
  })
}

// pcPrinter
export function getReceiptInfo(uid, oid) {
  return request({
    url: '/SellerAdmin/Cashier/GetReceiptInfo?userId=' + uid + "&orderId=" + oid,
    method: 'get'
  })
}

// qrFace
export function getMembersByScanCode(code) {
  return request({
    url: '/SellerAdmin/Cashier/GetMembersByScanCode?cardNo=' + code,
    method: 'get'
  })
}
export function getMemberByMemberCard(code) {
  return request({
    url: '/SellerAdmin/Cashier/GetMemberByMemberCard?cardNo=' + code,
    method: 'get'
  })
}
export function getMemberByImageForRecharge(data) {
  return request({
    url: '/SellerAdmin/Cashier/GetMemberByImageForRecharge',
    method: 'post',
    params: data,
    headers: { 'X-Requested-With': 'XMLHttpRequest' }
  })
}
export function getMemberByImage(data) {
  return request({
    url: '/SellerAdmin/Cashier/getMemberByImage',
    method: 'post',
    params: data,
    headers: { 'X-Requested-With': 'XMLHttpRequest' }
  })
}

// launchDetails
export function postRefundApply(data) {
  return request({
    url: '/SellerAdmin/CashierOrder/PostRefundApply',
    method: 'post',
    data: data,
    headers: { 'X-Requested-With': 'XMLHttpRequest' }
  })
}

export function getRefundReasons() {
  return request({
    url: '/SellerAdmin/CashierOrder/GetRefundReasons',
    method: 'get'
  })
}

// refundDetails
export function getRefundOrderDetail(id) {
  return request({
    url: '/SellerAdmin/CashierOrder/GetRefundOrderDetail?refundId=' + id,
    method: 'get'
  })
}

// refundItem
export function getRefundOrderList(pageNo, pageSize, cardNo, timeType) {
  return request({
    url: '/SellerAdmin/CashierOrder/GetRefundOrderList?pageNo=' + pageNo + '&pageSize=' + pageSize + '&cardNo=' + cardNo + '&timeType=' + timeType,
    method: 'get'
  })
}

// setCacherShiftBegin
export function setCacherShiftBegin(data) {
  return request({
    url: '/SellerAdmin/CashierShift/setCacherShiftBegin',
    method: 'post',
    params: data,
    headers: { 'X-Requested-With': 'XMLHttpRequest' }
  })
}

// shiftList
export function queryCashierShiftList(data) {
  return request({
    url: '/SellerAdmin/CashierShift/QueryCashierShiftList',
    method: 'post',
    params: data,
    headers: { 'X-Requested-With': 'XMLHttpRequest' }
  })
}

// signOut
export function setCacherShiftEnd() {
  return request({
    url: '/SellerAdmin/CashierShift/SetCacherShiftEnd',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' }
  })
}

export function getWatchManStatistics(str) {
  return request({
    url: '/SellerAdmin/CashierShift/GetWatchManStatistics' + str,
    method: 'get'
  })
}

// transaction
export function getDateSearchCondition() {
  return request({
    url: '/SellerAdmin/CashierSearchCondition/GetDateSearchCondition',
    method: 'get'
  })
}
export function getTransShopSales() {
  return request({
    url: '/SellerAdmin/CashierSearchCondition/GetShopSales',
    method: 'get'
  })
}
export function getOrderWay() {
  return request({
    url: '/SellerAdmin/CashierSearchCondition/GetOrderWay',
    method: 'get'
  })
}
export function getCashier() {
  return request({
    url: '/SellerAdmin/CashierSearchCondition/GetCashier',
    method: 'get'
  })
}
export function getCashierType() {
  return request({
    url: '/SellerAdmin/CashierSearchCondition/GetCashierType',
    method: 'get'
  })
}
export function getStatistics(filterForm) {
  return request({
    url: '/SellerAdmin/CashierShift/GetStatistics',
    method: 'post',
    params: filterForm
  })
}
export function getList(tableQueryParams) {
  return request({
    url: '/SellerAdmin/CashierShift/GetList',
    method: 'post',
    params: tableQueryParams
  })
}
export function getSalesAchievements(filterForm) {
  return request({
    url: '/SellerAdmin/CashierShift/GetList',
    method: 'post',
    params: filterForm
  })
}

// turnover
export function getChargeDailySummary(lookself, timeType) {
  return request({
    url: '/SellerAdmin/Cashier/GetChargeDailySummary?currentUser=' + lookself + '&timeSpan=' + timeType,
    method: 'get'
  })
}
export function getChargeDaily(lookself, checkedItem) {
  return request({
    url: '/SellerAdmin/Cashier/GetChargeDaily?currentUser=' + lookself + '&day=' + checkedItem,
    method: 'get'
  })
}
// weight
export function weightSearchProduct(checkType, pageNo, pageSize) {
  return request({
    url: '/SellerAdmin/Cashier/SearchProduct?isWeighingCharge=true&categoryId=' + checkType + '&pageNo=' + pageNo + '&pageSize=' + pageSize,
    method: 'get'
  })
}
export function weighGetStoreCategoryContainProduct() {
  return request({
    url: '/SellerAdmin/Cashier/GetStoreCategoryContainProduct?isWeighingCharge=true',
    method: 'get'
  })
}
export function insertWeighingTag(data) {
  return request({
    url: '/SellerAdmin/Cashier/InsertWeighingTag',
    method: 'post',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    params: data
  })
}

// layout
export function getShopDiscounts() {
  return request({
    url: '/SellerAdmin/CashierDiscounts/GetShopDiscounts',
    method: 'post'
  })
}

export function deleteDiscounts(Id) {
  return request({
    url: '/SellerAdmin/CashierDiscounts/Delete?id=' + Id,
    method: 'post'
  })
}

export function submitDiscount(data) {
  return request({
    url: '/SellerAdmin/CashierDiscounts/Add',
    method: 'post',
    params: data
  })
}

export function SaveCashierViceScreen(data) {
  return request({
    url: '/SellerAdmin/Cashier/SaveCashierViceScreen',
    method: 'post',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
    data: data
  })
}
// vipManager
export function queryMember(data) {
  return request({
    url: '/SellerAdmin/Cashier/QueryMember',
    method: 'post',
    data: data,
    headers: { 'X-Requested-With': 'XMLHttpRequest' }
  })
}

export function getMemberDetail(id) {
  return request({
    url: '/SellerAdmin/Cashier/GetMemberDetail?userId=' + id,
    method: 'get'
  })
}

export function editMember(data) {
  return request({
    url: '/SellerAdmin/Cashier/EditMember',
    method: 'post',
    data: data
  })
}

export function getMemberCardList(id) {
  return request({
    url: '/SellerAdmin/CashierMemberCard/GetMemberCardList?userId=' + id,
    method: 'get'
  })
}

export function getCouponList(id) {
  return request({
    url: '/SellerAdmin/CashierMemberCard/GetCouponList?userId=' + id,
    method: 'get'
  })
}

export function checkMemberPhone(phone) {
  return request({
    url: '/SellerAdmin/CashierMemberCard/CheckMemberPhone?phone=' + phone,
    method: 'post'
  })
}

export function qrCode(phone) {
  return request({
    url: '/SellerAdmin/CashierMemberCard/QrCode?phone=' + phone,
    method: 'post'
  })
}

export function polling(phone) {
  return request({
    url: '/SellerAdmin/CashierMemberCard/Polling?phone=' + phone,
    method: 'post'
  })
}

export function getUserInfo(phone) {
  return request({
    url: '/SellerAdmin/CashierMemberCard/GetUserInfo?phone=' + phone,
    method: 'post'
  })
}
export function getCardList() {
  return request({
    url: '/SellerAdmin/CashierMemberCard/GetCardList',
    method: 'get'
  })
}

export function cashierRegister(data) {
  return request({
    url: '/SellerAdmin/CashierMemberCard/CashierRegister',
    method: 'post',
    data: data,
    headers: { 'X-Requested-With': 'XMLHttpRequest' }
  })
}

export function cancelRegister(phone) {
  return request({
    url: '/SellerAdmin/CashierMemberCard/Cancel?phone=' + phone,
    method: 'get'
  })
}
