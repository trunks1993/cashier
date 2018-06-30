<template>
  <div class="app-wrapper">
    <Navbar></Navbar>
    <app-main></app-main>
    <SideBar></SideBar>
  </div>
</template>
<script>
import { Navbar, AppMain, SideBar } from '@/views/layout/components'
export default {
  components: {
    Navbar,
    AppMain,
    SideBar
  }
}

</script>
