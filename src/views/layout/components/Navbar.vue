<template>
  <div class="navbarContainer">
    <div class="navbarContainer-nameAndTools" @click="showSide" v-if="!this.$route.meta.isBack">
      <i class="iconfont icon-hanbaocaidan"></i>
      <span style="margin-left: 10px;">{{userInfo.userName}}</span>
    </div>
    <div class="navbarContainer-nameAndTools" @click="goBack" v-if="this.$route.meta.isBack">
      <i class="iconfont icon-fanhui"></i>
      <span style="margin-left: 10px;">{{userInfo.userName}}</span>
    </div>
    <div class="navbarContainer-title" @dblclick="fullwindow">{{title}}</div>
    <div class="navbarContainer-close" @click="exitSystemChange">退出</div>
    <mu-dialog dialogClass="m-dialog" :open="exitDailog" title="" @close="closeExitDailog" style="position: absolute;">
      <div class="confirmBegin" style="text-align:center;">您还未交班，是否继续退出？</div>
      <mu-flat-button slot="actions" @click="exitSystem" label="继续退出" />
      <mu-flat-button slot="actions" primary @click="goSingOut" label="去交班" />
    </mu-dialog>
  </div>
</template>
<script>
import { sendTosecondaryDisplay } from '@/public/sendToSecondaryDisplay.js';
import { mapGetters } from 'vuex'
import Bus from '@/utils/bus'

export default {
  data() {
    return {
      exitDailog: false,
      isFullScreen: false
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'iscashier'
    ]),
    title() {
      return this.$route.name
    }
  },
  methods: {
    showSide() {
      Bus.$emit('showSide', true)
    },
    goBack() {
      this.$router.back()
    },
    exitSystemChange() {
      console.log(this.userInfo);
      var ishaveCashier = false;
      for (var i = 0; i < this.userInfo.rights.length; i++) {
        if (this.userInfo.rights[i].name == "交接班") {
          ishaveCashier = true;
        }
      }
      if (this.iscashier && ishaveCashier && this.userInfo.openCashierShift) {
        this.exitDailog = true;
      } else {
        this.exitSystem();
      }
    },
    exitSystem() {
			sendTosecondaryDisplay([], null, null, 0, this);
      window.location.href = "/sellerAdmin/Cashier/LogOut"
    },
    fullwindow() {
      if (this.isFullScreen) {
        this.isFullScreen = false;
        document.webkitExitFullscreen()
      } else {
        this.isFullScreen = true;
        document.documentElement.webkitRequestFullScreen();
      }
    },
    closeExitDailog() {
      this.exitDailog = false
    },
    goSingOut() {
      this.$router.push({
        path: "/signOut",
        query: {
          id: "me"
        }
      })
      this.closeExitDailog()
    },
  }
}

</script>
<style lang="scss" scoped>
.navbarContainer {
  height: 51px;
  background: #333333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 25px;
  position: relative;
  z-index: 1000;
  &-nameAndTools {
    i,
    span {
      font-size: 14px;
      color: rgba(199, 177, 135, 1);
    }
  }
  &-title {
    font-size: 14px;
    color: rgba(199, 177, 135, 1);
  }
  &-close {
    font-size: 14px;
    color: rgba(199, 177, 135, 1);
  }
}

</style>
