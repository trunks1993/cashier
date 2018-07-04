import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/views/home'
import Layout from '@/views/layout'
import order from '@/views/order'
import success from '@/views/success'
import chargeMoney from '@/views/chargeMoney'
import successCharge from '@/views/successCharge'
import turnover from '@/views/turnover'
import orderitems from '@/views/order/orderitem'
import refundItems from '@/views/refund/refundItem'
import orderDetails from '@/views/order/orderDetails'
import launchDetails from '@/views/refund/launchDetails'
import refundDetails from '@/views/refund/refundDetails'
import refundSuccess from '@/views/refund/refundSuccess'
import setCacherShiftBegin from '@/views/shift/setCacherShiftBegin'
import signOut from '@/views/shift/signOut'
import shiftList from '@/views/shift/shiftList'
import weigh from '@/views/weigh/weigh'
import trans from '@/views/transaction'
import PurchasingPerformance from '@/views/transaction/PurchasingPerformance'
import VipManager from '@/views/vipManager'
Vue.use(Router)

export const asyncRouterMap = [
  {
    path: '/transcation',
    redirect: '/transcation/index',
    component: Layout,
    children: [{
      path: '/transcation/index',
      component: trans,
      name: '交易流水',
      meta: {
        id: 13008,
        menuName: '交易流水',
        imgUrl: require('@/assets/images/menuIcons/jiaoyiliushui.png')
      }
    }]
  },
  {
    path: '/transcation',
    redirect: '/transcation/index',
    component: Layout,
    children: [{
      path: '/transcation/index',
      component: trans,
      name: '设置',
      meta: {
        id: 13011,
        menuName: '设置',
        imgUrl: require('@/assets/images/menuIcons/shezhi.png')
      }
    }]
  },
  {
    path: '/chargeMoney',
    redirect: '/chargeMoney/index',
    component: Layout,
    children: [{
      path: '/chargeMoney/index',
      component: chargeMoney,
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
    component: Layout,
    children: [{
      path: '/turnover/index',
      component: turnover,
      name: '储值流水',
      meta: {
        id: 13004,
        menuName: '储值流水',
        imgUrl: require('@/assets/images/menuIcons/chuzhiliushui.png')
      }
    }]
  },
  {
    path: '/vipManager',
    redirect: '/vipManager/index',
    component: Layout,
    children: [{
      path: '/vipManager/index',
      component: VipManager,
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
    // redirect: '/vipManager/index',
    component: Layout,
    children: [{
      path: '/faceManager/index',
      // component: VipManager,
      name: '人脸开卡',
      meta: {
        id: 13014,
        menuName: '人脸开卡',
        imgUrl: require('@/assets/images/menuIcons/renliankaika.png')
      }
    }]
  },
  {
    path: '/orderitems',
    redirect: '/orderitems/index',
    component: Layout,
    children: [{
      path: '/orderitems/index',
      component: orderitems,
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
    component: Layout,
    children: [{
      path: '/refundItems/index',
      component: refundItems,
      name: '售后管理',
      meta: {
        id: 13007,
        menuName: '售后管理',
        imgUrl: require('@/assets/images/menuIcons/shouhouguanli.png')
      }
    }]
  },
  {
    path: '/signOut',
    redirect: '/signOut/index',
    component: Layout,
    children: [{
      path: '/signOut/index',
      component: signOut,
      name: '交接班',
      meta: {
        id: 13010,
        menuName: '交接班',
        imgUrl: require('@/assets/images/menuIcons/jiaoban.png')
      }
    },{
      path: '/shiftList/index',
      component: shiftList,
      name: '交班记录',
      meta: {
        menuName: '交班记录',
        imgUrl: require('@/assets/images/menuIcons/jiaobanjilu.png')
      }
    }]
  },
  {
    path: '/purchasingPerformance',
    redirect: '/purchasingPerformance/index',
    component: Layout,
    children: [{
      path: '/purchasingPerformance/index',
      component: PurchasingPerformance,
      name: '导购业绩',
      meta: {
        id: 13009,
        menuName: '导购业绩',
        imgUrl: require('@/assets/images/menuIcons/daogouyeji.png')
      }
    }]
  },
  {
    path: '/weigh',
    redirect: '/weigh/index',
    component: Layout,
    children: [{
      path: '/weigh/index',
      component: weigh,
      name: '称重台',
      meta: {
        id: 13012,
        menuName: '称重台',
        imgUrl: require('@/assets/images/menuIcons/chenzhongtai.png')
      }
    }]
  }
]

const constantRouterMap = [{
    path: '/',
    redirect: '/home/index',
    component: Layout,
    children: [{
      path: '/home/index',
      component: Index,
      name: '收银台',
      meta: {
        menuName: '收银',
        imgUrl: require('@/assets/images/menuIcons/shouyin.png')
      }
    }]
  },
  {
    path: '/success',
    component: Layout,
    redirect: '/success/index',
    children: [{
      path: '/success/index',
      name: '支付成功',
      component: success
    }]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/index',
    children: [{
      path: '/order/index',
      name: '确认订单',
      component: order,
      meta: {
        isBack: true
      }
    }]
  },
  {
    path: '/successCharge',
    component: Layout,
    redirect: '/successCharge/index',
    children: [{
      path: '/successCharge/index',
      name: '收款成功',
      component: successCharge
    }]
  },
  {
    path: '/orderDetails',
    component: Layout,
    redirect: '/orderDetails/index',
    children: [{
      path: '/orderDetails/index',
      component: orderDetails,
      name: '订单详情',
      meta: {
        isBack: true
      }
    }]
  },
  {
    path: '/launchDetails',
    component: Layout,
    children: [{
      path: '/launchDetails/:id',
      component: launchDetails,
      name: '发起售后',
      meta: {
        isBack: true
      }
    }]
  },
  {
    path: '/refundSuccess',
    component: Layout,
    redirect: '/refundSuccess/index',
    children: [{
      path: '/refundSuccess/index',
      component: refundSuccess,
      name: '售后成功'
    }]
  },
  {
    path: '/refundDetails',
    component: Layout,
    children: [{
      path: '/refundDetails/:id',
      component: refundDetails,
      name: '售后详情',
      meta: {
        isBack: true
      }
    }]
  },
  {
    path: '/setCacherShiftBegin',
    component: Layout,
    children: [{
      path: '/setCacherShiftBegin',
      component: setCacherShiftBegin,
      name: '设置期初'
    }]
  }
  // {
  //   path: '/successCharge',
  //   component: Layout,
  //   children: [{
  //     path: '/signOut/:id',
  //     component: signOut
  //   }]
  // },
  // {
  //   path: '/successCharge',
  //   component: Layout,
  //   children: [{
  //     path: '/shiftDetails/:id',
  //     component: signOut
  //   }]
  // }
]

export default new Router({
  routes: constantRouterMap
});
