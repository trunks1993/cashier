import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export const asyncRouterMap = [{
    path: '/weigh',
    redirect: '/weigh/index',
    component: resolve => require(['@/views/layout'], resolve),
    children: [{
      path: '/weigh/index',
      component: resolve => require(['@/views/weigh/weigh'], resolve),
      name: '称重台',
      meta: {
        id: 13012,
        menuName: '称重台',
        imgUrl: require('@/assets/images/menuIcons/chenzhongtai.png')
      }
    }]
  },
  {
    path: '/vipManager',
    redirect: '/vipManager/index',
    component: resolve => require(['@/views/layout'], resolve),
    children: [{
      path: '/vipManager/index',
      component: resolve => require(['@/views/vipManager'], resolve),
      name: '会员管理',
      meta: {
        id: 13005,
        menuName: '开卡',
        imgUrl: require('@/assets/images/menuIcons/kaika.png')
      }
    }]
  },
  {
    path: '/faceManager',
    component: resolve => require(['@/views/layout'], resolve),
    children: [{
      path: '/faceManager/index',
      name: '人脸开卡',
      meta: {
        id: 13014,
        menuName: '人脸开卡',
        imgUrl: require('@/assets/images/menuIcons/renliankaika.png')
      }
    }]
  },
  {
    path: '/chargeMoney',
    redirect: '/chargeMoney/index',
    component: resolve => require(['@/views/layout'], resolve),
    children: [{
      path: '/chargeMoney/index',
      component: resolve => require(['@/views/chargeMoney'], resolve),
      name: '储值',
      meta: {
        id: 13003,
        menuName: '储值',
        imgUrl: require('@/assets/images/menuIcons/chuzhi.png')
      }
    }]
  },
  {
    path: '/turnover',
    redirect: '/turnover/index',
    component: resolve => require(['@/views/layout'], resolve),
    children: [{
      path: '/turnover/index',
      component: resolve => require(['@/views/turnover'], resolve),
      name: '储值流水',
      meta: {
        id: 13004,
        menuName: '储值流水',
        imgUrl: require('@/assets/images/menuIcons/chuzhiliushui.png')
      }
    }]
  },
  {
    path: '/orderitems',
    redirect: '/orderitems/index',
    component: resolve => require(['@/views/layout'], resolve),
    children: [{
      path: '/orderitems/index',
      component: resolve => require(['@/views/order/orderitem'], resolve),
      name: '订单管理',
      meta: {
        id: 13006,
        menuName: '订单管理',
        imgUrl: require('@/assets/images/menuIcons/dingdanguanli.png')
      }
    }]
  },
  {
    path: '/refundItems',
    redirect: '/refundItems/index',
    component: resolve => require(['@/views/layout'], resolve),
    children: [{
      path: '/refundItems/index',
      component: resolve => require(['@/views/refund/refundItem'], resolve),
      name: '售后管理',
      meta: {
        id: 13007,
        menuName: '售后管理',
        imgUrl: require('@/assets/images/menuIcons/shouhouguanli.png')
      }
    }]
  },
  {
    path: '/transcation',
    redirect: '/transcation/index',
    component: resolve => require(['@/views/layout'], resolve),
    children: [{
      path: '/transcation/index',
      component: resolve => require(['@/views/transaction'], resolve),
      name: '交易流水',
      meta: {
        id: 13008,
        menuName: '交易流水',
        imgUrl: require('@/assets/images/menuIcons/jiaoyiliushui.png')
      }
    }]
  },
  {
    path: '/purchasingPerformance',
    redirect: '/purchasingPerformance/index',
    component: resolve => require(['@/views/layout'], resolve),
    children: [{
      path: '/purchasingPerformance/index',
      component: resolve => require(['@/views/transaction/PurchasingPerformance'], resolve),
      name: '导购业绩',
      meta: {
        id: 13009,
        menuName: '导购业绩',
        imgUrl: require('@/assets/images/menuIcons/daogouyeji.png')
      }
    }]
  },
  {
    path: '/signOut',
    redirect: '/signOut/index',
    component: resolve => require(['@/views/layout'], resolve),
    children: [{
      path: '/signOut/index',
      component: resolve => require(['@/views/shift/signOut'], resolve),
      name: '交接班',
      meta: {
        id: 13010,
        menuName: '交接班',
        imgUrl: require('@/assets/images/menuIcons/jiaoban.png')
      }
    }, 
    {
      path: '/shiftList/index',
      component: resolve => require(['@/views/shift/shiftList'], resolve),
      name: '交班记录',
      meta: {
        menuName: '交班记录',
        imgUrl: require('@/assets/images/menuIcons/jiaobanjilu.png')
      }
    }]
  },
  {
    path: '/transcation',
    redirect: '/transcation/index',
    component: resolve => require(['@/views/layout'], resolve),
    children: [{
      path: '/transcation/index',
      name: '设置',
      meta: {
        id: 13011,
        menuName: '设置',
        imgUrl: require('@/assets/images/menuIcons/shezhi.png')
      }
    }]
  }
]

const constantRouterMap = [{
    path: '/',
    redirect: '/home/index',
    component: resolve => require(['@/views/layout'], resolve),
    children: [{
      path: '/home/index',
      component: resolve => require(['@/views/home'], resolve),
      name: '收银台',
      meta: {
        menuName: '收银',
        imgUrl: require('@/assets/images/menuIcons/shouyin.png')
      }
    }]
  },
  {
    path: '/success',
    component: resolve => require(['@/views/layout'], resolve),
    redirect: '/success/index',
    children: [{
      component: resolve => require(['@/views/success'], resolve),
      path: '/success/index',
      name: '支付成功'
    }]
  },
  {
    path: '/order',
    component: resolve => require(['@/views/layout'], resolve),
    redirect: '/order/index',
    children: [{
      path: '/order/index',
      name: '确认订单',
      component: resolve => require(['@/views/order'], resolve),
      meta: {
        isBack: true
      }
    }]
  },
  {
    path: '/successCharge',
    component: resolve => require(['@/views/layout'], resolve),
    redirect: '/successCharge/index',
    children: [{
      path: '/successCharge/index',
      name: '收款成功',
      component: resolve => require(['@/views/successCharge'], resolve)
    }]
  },
  {
    path: '/orderDetails',
    component: resolve => require(['@/views/layout'], resolve),
    redirect: '/orderDetails/index',
    children: [{
      path: '/orderDetails/index',
      component: resolve => require(['@/views/order/orderDetails'], resolve),
      name: '订单详情',
      meta: {
        isBack: true
      }
    }]
  },
  {
    path: '/launchDetails',
    component: resolve => require(['@/views/layout'], resolve),
    children: [{
      path: '/launchDetails/:id',
      component: resolve => require(['@/views/refund/launchDetails'], resolve),
      name: '发起售后',
      meta: {
        isBack: true
      }
    }]
  },
  {
    path: '/refundSuccess',
    component: resolve => require(['@/views/layout'], resolve),
    redirect: '/refundSuccess/index',
    children: [{
      path: '/refundSuccess/index',
      component: resolve => require(['@/views/refund/refundSuccess'], resolve),
      name: '售后成功'
    }]
  },
  {
    path: '/refundDetails',
    component: resolve => require(['@/views/layout'], resolve),
    children: [{
      path: '/refundDetails/:id',
      component: resolve => require(['@/views/refund/refundDetails'], resolve),
      name: '售后详情',
      meta: {
        isBack: true
      }
    }]
  },
  {
    path: '/setCacherShiftBegin',
    component: resolve => require(['@/views/layout'], resolve),
    children: [{
      path: '/setCacherShiftBegin',
      component: resolve => require(['@/views/shift/setCacherShiftBegin'], resolve),
      name: '设置期初'
    }]
  }
]

export default new Router({
  routes: constantRouterMap
})
