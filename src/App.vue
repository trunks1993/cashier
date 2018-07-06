<template>
  <div id="app">
    <div class="chromeTips" v-show="isChrome">为了您能完整且良好的使用收银,建议您使用谷歌浏览器</div>
    <!-- <header class="appHeader">
      <a href="javascript:history.back()" v-if="enableBack" class="iconfont icon-fanhui menu-back"></a>
      <a class="iconfont icon-hanbaocaidan menu-nav" v-else :class="{active:isLeftmenu}" @click="isLeftmenu=!isLeftmenu"></a>
      <em @dblclick="fullwindow">{{title}}</em>
      <div class="heder-right">
        <span class="header-name">
				<i class="iconfont icon-yonghu"></i>
				{{userName}}
      </span>
        <span @click="exitSystemChange">
      	<i class="iconfont icon-tuichu"></i>退出
      </span>
      </div>
    </header> -->
    <div class="global-left-menu" :class="{active:isLeftmenu}">
      <div class="mask" @click="isLeftmenu=!isLeftmenu;isHidddenMenu=false;"></div>
      <!--左侧菜单-->
      <div class="left-menu-box">
        <div class="in" v-show="!isHidddenMenu">
          <div class="mans-info">
            <i class="iconfont icon-zuocelanrenwu"></i>
            <h1>{{userName}}</h1>
            <p>{{shopName}}</p>
          </div>
          <div class="nav-info">
            <div>
              <a href="#/" @click="isLeftmenu=false">
										<i class="iconfont icon-shouyin" style="color:#df7d6c;" ></i>
										<br />
										<span>收银</span>
									</a>
            </div>
            <div v-for="item in menuList" :key="item.id">
              <a v-if="item.name!='开卡'&&item.name!='设置'&&item.name!='交班'&&item.name!='交班记录'" :href="item.href" @click="isLeftmenu=false">
										<i class="iconfont"  :style="{color:item.color}" :class="item.icon"></i>
										<br />
										<span>{{item.name}}</span>
									</a>
              <a v-if="item.name=='交班'" v-show="isShift" :href="isCashBegin?item.href:'javascript:void(0)'" @click="isLeftmenu=false">
										<i class="iconfont" :style="{color:isCashBegin?item.color:'#ccc'}" :class="item.icon"></i>
										<br />
										<span>{{item.name}}</span>
									</a>
              <!-- <a v-if="item.name=='交班'&&isCashBegin" v-show="isShift" class="disabled"  @click="isLeftmenu=false">
										<i class="iconfont" :style="{color:item.color}" :class="item.icon"></i>
										<br />
										<span>{{item.name+""+isCashBegin}}2</span>
									</a> -->
              <a v-if="item.name=='交班记录'" v-show="isShift" :href="item.href" @click="isLeftmenu=false">
										<i class="iconfont" :style="{color:item.color}" :class="item.icon"></i>
										<br />
										<span>{{item.name}}</span>
									</a>
              <a v-if="item.name=='开卡'" @click="showFace">
										<i class="iconfont" :style="{color:item.color}" :class="item.icon"></i>
										<br />
										<span>{{item.name}}</span>
									</a>
              <a v-if="item.name=='设置'" @click="isHidddenMenu = true">
										<i class="iconfont" :style="{color:item.color}" :class="item.icon"></i>
										<br />
										<span>{{item.name}}</span>
									</a>
            </div>
          </div>
        </div>
        <div v-show="isHidddenMenu" class="shiftSetting">
          <ul>
            <li class="back">
              <i class="iconfont icon-fanhui" @click="isHidddenMenu=false"></i>
            </li>
            <li>
              <i class="iconfont icon-jiaoban"></i>
              <span>交接班</span>
              <div>
                <mu-switch class="yswitch" v-model="isShift"></mu-switch>
              </div>
            </li>
            <li>
              <i class="iconfont icon-printer"></i>
              <span>自动打印小票</span>
              <div>
                <mu-switch class="yswitch" v-model="isAutoShift"></mu-switch>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!--左侧菜单END-->
    </div>
    <div class="showCodeImg" v-show="showCode" @click="showCode=false">
      <div class="codeBox">
        <div class="imgCodeBox">
          <qriously class="imgCode" id="aa" :value="initQCode" :size="215" />
        </div>
        <div style="display:none;">
          <qriously class="imgCode" id="downaloadImg" :value="initQCode" :size="1000" />
        </div>
        <p>请让消费者使用微信扫描该二维码，完成头像上传后即自动完成开卡</p>
        <button @click="downloadQrcode">下载该二维码</button>
      </div>
    </div>
    <mu-dialog dialogClass="m-dialog" :open="exitDailog" title="" @close="closeExitDailog">
      <div class="confirmBegin" style="text-align:center;">您还未交班，是否继续退出？</div>
      <mu-flat-button slot="actions" @click="exitSystem" label="继续退出" />
      <mu-flat-button slot="actions" primary @click="goSingOut" label="去交班" />
    </mu-dialog>
    <router-view @showqrCode="change" ref="routerView" @changeTitle="changeTitle" @isBack="isBack" @setCashBegin="setCashBegin" />
  </div>
</template>
<script>
import { getSellerManager, saveCashierShifSetting, mockLogin, beat } from '@/api'
export default {
  name: 'app',
  data() {
    return {
      isShift: false,
      isAutoShift: false,
      userName: '',
      isChrome: false,
      isFullScreen: false,
      isLeftmenu: false,
      shopName: '',
      isShopStoredValue: false,
      showCode: false,
      initQCode: "",
      title: "收银台",
      enableBack: false,
      isHidddenMenu: false,
      menuList: [],
      exitDailog: false,
      isCashBegin: false,
      menuObj: {
        "线下流水": { icon: "icon-liushui", href: "#/turnover", color: "#df7d6c" },
        "收银": { icon: "icon-shouyin", href: "#/", color: "#df7d6c" },
        "储值": { icon: "icon-chuzhi2", href: "#/chargeMoney", color: "#57b3e7" },
        "储值流水": { icon: "icon-liushui", href: "#/turnover", color: "#e79f59" },
        "开卡": { icon: "icon-kaika", href: "", color: "#e98d8d" },
        "订单管理": { icon: "icon-order", href: "#/orderitems", color: "#5e99eb" },
        "售后管理": { icon: "icon-shouhou", href: "#/refundItems", color: "#7ec261" },
        "交易流水": { icon: "icon-liushui", href: "#/transcation", color: "#4ec6c2" },
        "导购业绩": { icon: "icon-daogou", href: "#/purchasingPerformance", color: "#e98d8d" },
        "交接班": { icon: "icon-jiaoban", href: "#/signOut/me", color: "#e79f59" },
        "交班记录": { icon: "icon-shift", href: "#/shiftList", color: "#92b2f3" },
        "称重台": { icon: "icon-zhuanqu", href: "#/weigh", color: "#92b2f3" },
        "设置": { icon: "icon-set", href: "#/turnover", color: "#baa57b" }
      }
    }
  },
  beforeCreate() {
    // mockLogin('gmc', '123456').then(res => {
    //   const data = res.data
    //   document.cookie = 'Himall-SellerManager = ' + data.userId
    // })
  },
  created: function() {
    var self = this;
    var userAgent = navigator.userAgent;
    usbPrint.init();
    if (userAgent.indexOf("t1host") != -1 && userAgent.indexOf("Html5Plus") != -1) {
      document.addEventListener("plusready", function() {
        var savedBleId = localStorage.getItem("bleId");
        if (!savedBleId) {
          SearchBluetooth.Init();
        }
      });
    }
    if (userAgent.indexOf("Chrome") == -1) {
      this.isChrome = true;
    }
    document.body.addEventListener("keyup", function(e) {
      if (e.keyCode == 27) {
        self.isLeftmenu = false;
      }
    });
    this.getLocalUrl();
    // this.getCashierShifSetting()
  },
  watch: {
    isShift: function(val) {
      this.saveCashierShifSetting();
    },
    isAutoShift: function(val) {
      this.saveCashierShifSetting();
    }
  },
  methods: {
    closeExitDailog: function() {
      this.exitDailog = false
    },
    goSingOut: function() {
      this.$router.push({
        path: "/signOut/me"
      })
      this.closeExitDailog()
    },
    downloadQrcode: function() {
      var canvas = document.getElementById("downaloadImg").querySelector("canvas")
      var ctx = canvas.getContext("2d")
      var imgData = canvas.toDataURL("png")
      var _fixType = function(type) {
        type = type.toLowerCase().replace(/jpg/i, 'jpeg')
        var r = type.match(/png|jpeg|bmp|gif/)[0];
        return 'image/' + r
      };

      // 加工image data，替换mime type
      imgData = imgData.replace(_fixType("png"), 'image/octet-stream');

      var saveFile = function(data, filename) {
        var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
        save_link.href = data;
        save_link.download = filename;

        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        save_link.dispatchEvent(event);
      };

      // 下载后的问题名
      var filename = 'faceqrcode' + (new Date()).getTime() + '.png';
      // download
      saveFile(imgData, filename);

    },
    change: function(msg) {
      this.showCode = true;
    },
    changeTitle: function(val) {
      this.title = val;
    },
    isBack: function(msg) {
      this.enableBack = msg
    },
    setCashBegin: function(msg) {
      isCashBegin = true;
      this.isCashBegin = true
    },
    showFace: function() {
      this.showCode = true;
      this.isLeftmenu = false
    },
    getLocalUrl: function() {
      this.initQCode = window.location.href.split('//')[0] + '//' + window.location.href.split('//')[1].split('/')[0] + "/m-weixin/memberface";
    },
    saveCashierShifSetting: function() {
      saveCashierShifSetting({ OpenCashierShift: this.isShift, OpenPrintTicket: this.isAutoShift })
    },
    fullwindow: function() {
      if (this.isFullScreen) {
        this.isFullScreen = false;
        document.webkitExitFullscreen()
      } else {
        this.isFullScreen = true;
        document.documentElement.webkitRequestFullScreen();
      }
    },
    exitSystemChange: function() {
      var ishaveCashier = false;
      for (var i = 0; i < this.menuList.length; i++) {
        if (this.menuList[i].name == "交班") {
          ishaveCashier = true;
        }
      }
      if (this.isCashBegin && ishaveCashier && this.isShift) {
        this.exitDailog = true;
      } else {
        this.exitSystem();
      }
    },
    exitSystem: function() {
      window.location.href = "/sellerAdmin/Cashier/LogOut";
    },
    downLoadQr: function() {
      var canvas = document.createElement("canvas"),
        context = canvas.getContext("2d");
      var img = canvas.toDataURL("image/png");
      window.location.href = img;
    },
  },
  mounted: function() {
    var self = this;
    var rundId = 0;
    getSellerManager().then(function(response) {
      // console.log(response)
      // if (!response.data.success) {
      //   alert("您已在其他收银台登录，请先退出");
      //   self.exitSystem();
      //   return;
      // }
      
      // autoPrint = response.data.openPrintTicket;
      // shopId = response.data.shopId;
      // managerId = response.data.managerId;
      // SHOP_NAME = response.data.shopName;
      // CASH_ER = response.data.userName;
      // rundId = response.data.managerId;

      // self.isShopStoredValue = response.data.isShopStoredValue;
      // var menuList = response.data.rights;
      // for (var i = 0; i < menuList.length; i++) {
      //   menuList[i]['icon'] = self.menuObj[menuList[i].name].icon;
      //   menuList[i]['href'] = self.menuObj[menuList[i].name].href;
      //   menuList[i]['color'] = self.menuObj[menuList[i].name].color;
      //   if (menuList[i].name == "交接班") {
      //     menuList[i].name = "交班";
      //     menuList.splice(i + 1, 0, { name: "交班记录", id: "0" });
      //   }
      // }
      // self.menuList = menuList;
      // if (self.$refs.routerView.updateCashBegin) self.$refs.routerView.updateCashBegin(response.data.isCashBegin);
      // self.isCashBegin = response.data.isCashBegin;
      // isCashBegin = response.data.isCashBegin;
      
      // isLogin();
    })

    function isLogin() {
      beat(guid).then(function(response) {
        if (!response.data.success) {
          setTimeout(function() {
            alert("您已在其他收银台登录，请先退出");
            self.exitSystem();
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
  }
}

</script>
<style scoped="scoped">
.showCodeImg {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 99999;
}

.showCodeImg .codeBox {
  width: 720px;
  background: rgba(0, 0, 0, 0.65);
  text-align: center;
  text-align: center;
  padding: 30px;
  border-radius: 10px;
  position: absolute;
  top: 50%;
  margin: auto;
  margin-top: -218px;
  left: 0;
  right: 0;
}

.showCodeImg .codeBox .imgCodeBox {
  padding: 7px;
  border-radius: 10px;
  display: inline-block;
  background: #fff;
}

.showCodeImg * {
  vertical-align: middle;
}


/*.showCodeImg .codeBox .imgCode {
	    display: inline-block;
}*/

.showCodeImg .codeBox p {
  font-size: 20px;
  color: #fff;
  margin-top: 25px;
}

.showCodeImg .codeBox button {
  width: 190px;
  height: 54px;
  border-radius: 25px;
  font-size: 20px;
  color: #fff;
  background: none;
  border: 2px solid #c7b187;
  margin-top: 18px;
}

</style>
