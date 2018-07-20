<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
import { mockLogin } from '@/api'
export default {
  name: 'app',
  beforeCreate() {
    mockLogin('trunks', '123456').then(res => {
      const data = res.data
      document.cookie = 'Himall-SellerManager = ' + data.userId
    })
  }
}

</script>
