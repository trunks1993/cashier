import router from './router'
import store from './store'

router.beforeEach((to, from, next) => {
  if (store.getters.routes.length === 0) {
  	store.dispatch('GenerateRoutes').then(res => {
  		router.addRoutes(res)
  		next({ ...to })
  		usbPrint.init()
  	})
  } else {
  	next()
  }
})
