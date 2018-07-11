import { getSellerManager, saveCashierShifSetting, beat } from '@/api'
import { asyncRouterMap } from '@/router'
// const _import = require('@/router/_import_' + process.env.NODE_ENV)

function getRouterMap(routerTemplate) {
  let arr3 = asyncRouterMap.filter((item1) => {
    return routerTemplate.findIndex((item2) => {
      return item2.id === item1.children[0].meta.id
    }) >= 0
  })
  return arr3
}

function isLogin() {
		beat(guid).then(function(response) {
			if (!response.data.success) {
				setTimeout(function() {
					alert("您已在其他收银台登录，请先退出");
					window.location.href = "/sellerAdmin/Cashier/LogOut";
				}, 300)
			} else {
				if (response.data.managerId != managerId) {
					window.location.reload();
				}
				setTimeout(function() {
					isLogin();
				}, 30000);
			}
		}).catch(function(error) {
			setTimeout(function() {
				isLogin();
			}, 30000);
		});
}

const menu = {
  state: {
    routes: [],
    userInfo: '',
    iscashier: false,
    pcNumber: navigator.userAgent.indexOf("S2")
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.routes = routes
    },
    SET_USER: (state, res) => {
      state.userInfo = res
    },
    SET_ISCASHIER: (state, res) => {
      state.iscashier = res
    },
    SET_SETING: (state, valObj) => {
      state.userInfo.openCashierShift = valObj.OpenCashierShift
      state.userInfo.openPrintTicket = valObj.OpenPrintTicket
      state.userInfo.openDiscounts = valObj.CashierDiscounts
    }
  },
  actions: {
    GenerateRoutes({ commit }) {
      return new Promise((resolve, reject) => {
        getSellerManager().then(res => {
					
          const data = res.data
          if (data.success) {
            const newAsyncRouterMap = getRouterMap(data.rights)
            commit('SET_ROUTES', newAsyncRouterMap)
            commit('SET_USER', data)
            commit('SET_ISCASHIER', data.isCashBegin)
            isLogin()
            resolve(newAsyncRouterMap)

            //暂时的全局变量
            autoPrint = res.data.openPrintTicket
            shopId = res.data.shopId
            managerId = res.data.managerId
            SHOP_NAME = res.data.shopName
            CASH_ER = res.data.userName
            rundId = res.data.managerId
          }else{
						alert("您已在其他收银台登录，请先退出");
					  window.location.href = "/sellerAdmin/Cashier/LogOut";
						return;
					}
        }).catch(error => {
          reject(error)
        })
      })
    },
    SetCashierShift({ commit }, valObj) {
      saveCashierShifSetting(valObj).then(res => {
        if (res.data.success) {
          commit('SET_SETING', valObj)
        }
      })
    },
    setIsCashier({ commit }){
        commit('SET_ISCASHIER', true)
    }
  }
}

export default menu
