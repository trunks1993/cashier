import axios from 'axios'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 1500000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  // if (store.getters.token) {
  //   config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  // }
  // config.headers = { 'X-Requested-With': 'XMLHttpRequest' }
  return config
}, error => {
  // Do something with request error
  // console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
// service.interceptors.response.use(
//   response => {
//     /**
//      * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
//      * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
//      */
//     const res = response.data;
//     if (res.code === 0 || res.code === 1) {
//       return response
//     } else if (res.code === 50008 || res.code === 50014) { // 50008:非法的token; 50014:Token 过期了;
//       MessageBox.alert('您长时间没有操作，请重新登录', '确认退出', {
//         confirmButtonText: '确定',
//         callback: action => {
//           store.dispatch('FedLogOut').then(() => {
//             location.reload() // 为了重新实例化vue-router对象 避免bug
//           })
//         }
//       })

//     } else if (res.code === 50012) { // 50012:其他客户端登录了;
//       MessageBox.confirm('你的帐号已在另一台机器登录，请重新登录', '确认退出', {
//         confirmButtonText: '重新登录',
//         cancelButtonText: '取消',
//         type: 'warning'
//       }).then(() => {
//         store.dispatch('FedLogOut').then(() => {
//           location.reload() // 为了重新实例化vue-router对象 避免bug
//         })
//       })
//     } else return Promise.reject('error');
//   },
//   error => {
//     console.log('err' + error) // for debug
//     Message.error(error.message)
//     return Promise.reject(error)
//   }
// )

export default service