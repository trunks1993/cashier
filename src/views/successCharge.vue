<template>
  <div>
    <div class="left success">
      <div class="left_cont">
        <div class="print_div" id="print_div" style="width:100%;display:none;">
          <table border="0" width="100%;">
            <tr>
              <td style="padding:3px 0;" colspan="2" align="center">
                <font face="隶书" size="4">{{shopName}}</font>
              </td>
            </tr>
            <tr>
              <td style="padding:3px 0;" colspan="2" align="center">
                <font face="隶书" size="4"> </font>
              </td>
            </tr>
            <tr>
              <td style="padding:3px 0;" colspan="2" align="left">
                <font face="隶书" size="2">{{chargeData.dateTime}}</font>
              </td>
            </tr>
            <tr>
              <td style="padding:3px 0;" colspan="2" align="left">
                <font face="隶书" size="2">储值流水：{{chargeData.orderId}}</font>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="border-top:1px solid #000;"></td>
            </tr>
          </table>
          <table width="100%">
            <tr>
              <td>
                <font face="隶书" size="2">会员账号</font>
              </td>
              <td align="right">
                <font face="隶书" size="2">{{chargeData.member.member.userName}}</font>
              </td>
            </tr>
            <tr>
              <td>
                <font face="隶书" size="2">手机号</font>
              </td>
              <td align="right">
                <font face="隶书" size="2">{{chargeData.member.member.cellPhone}}</font>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="border-top:1px solid #000;"></td>
            </tr>
            <tr>
              <td>
                <font face="隶书" size="2">储值金额</font>
              </td>
              <td align="right">
                <font face="隶书" size="2">{{mathPlus(parseFloat(chargeData.ChargeAmount),parseFloat(chargeData.AdditionAmount)) | rmb}}</font>
              </td>
            </tr>
            <tr>
              <td>
                <font face="隶书" size="2"></font>
              </td>
              <td align="right">
                <font face="隶书" size="2">{{'充'+chargeData.ChargeAmount+'送'+chargeData.AdditionAmount}}</font>
              </td>
            </tr>
            <tr>
              <td>
                <font face="隶书" size="2">储值后余额</font>
              </td>
              <td align="right">
                <font face="隶书" size="2">￥{{chargeData.Balance}}</font>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="border-top:1px solid #000;"></td>
            </tr>
            <tr>
              <td>
                <font face="隶书" size="2">实付金额</font>
              </td>
              <td align="right">
                <font face="隶书" size="2">{{chargeData.ChargeAmount | rmb}}</font>
              </td>
            </tr>
            <tr>
              <td>
                <font face="隶书" size="2">支付方式</font>
              </td>
              <td align="right">
                <font face="隶书" size="2">{{chargeData.payType=='wx'?'微信':'支付宝'}}</font>
              </td>
            </tr>
          </table>
        </div>
        <div class="success_info" id="success_info">
          <ul>
            <li>
              <p>{{chargeData.dateTime}}</p>
              <p>储值流水：{{chargeData.orderId}}</p>
            </li>
            <li class="sm">
              <mu-list>
                <mu-list-item class="list sm" title="会员账号" :afterText="chargeData.member.member.userName"></mu-list-item>
                <mu-list-item class="list sm" title="手机号" :afterText="chargeData.member.member.cellPhone"></mu-list-item>
              </mu-list>
            </li>
            <li class="sm">
              <mu-list>
                <mu-list-item class="list sm" title="储值金额" :afterText="mathPlus(parseFloat(chargeData.ChargeAmount),parseFloat(chargeData.AdditionAmount)) | rmb"></mu-list-item>
                <mu-list-item class="list sm" title="" :afterText="'充'+chargeData.ChargeAmount+'送'+chargeData.AdditionAmount"></mu-list-item>
                <mu-list-item class="list sm" title="储值后余额" :afterText="chargeData.Balance"></mu-list-item>
              </mu-list>
            </li>
            <li class="sm">
              <mu-list>
                <mu-list-item class="list sm" title="实付金额" :afterText="chargeData.ChargeAmount | rmb"></mu-list-item>
                <mu-list-item class="list sm" title="支付方式" :afterText="chargeData.payType=='wx'?'微信':'支付宝'"></mu-list-item>
              </mu-list>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="right success">
      <div class="right_cont">
        <div class="successYes">
          <h1>
                          <span>收款成功</span>
                          {{chargeData.ChargeAmount | rmb}}
                        </h1>
          <mu-raised-button class="print" label="打印小票" @click="print" fullWidth/>
          <mu-raised-button label="继续储值" @click="continueCashier" fullWidth/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'successCharge',
  data() {
    return {
      chargeData: null,
      shopName: SHOP_NAME,
      isprinting: false,
      printer: "",
    }
  },
  created: function() {
    this.$emit("changeTitle", "支付成功");
    this.$emit("isBack", false);
    this.chargeData = chargeData;
    console.log(chargeData)
    var userAgent = navigator.userAgent;
    if (userAgent.indexOf("t1host") != -1 && userAgent.indexOf("Html5Plus") != -1) {
      this.printer = "app";
    } else {
      this.printer = "web";
      usbPrint.init();
    }
  },
  methods: {
    continueCashier: function() {
      chargeData = null;
      this.$router.push('/chargeMoney');
    },
    mathPlus: function(n1, n2) {
      return Math.round((n1 + n2) * 100) / 100
    },
    math: function(n1, n2) {
      return Math.round((n1 - n2) * 100) / 100
    },
    print: function() {
      var self = this;
      if (this.isprinting) return;
      self.isprinting = true;
      setTimeout(function() {
        self.isprinting = false;
      }, 1000);
      if (this.printer == "web") {
        var LODOP; //声明为全局变量
        LODOP = usbPrint.getLodop();
        LODOP.PRINT_INIT("");
        LODOP.SET_PRINT_MODE("PRINT_PAGE_PERCENT", "Auto-Width");
        LODOP.SET_PRINT_PAGESIZE(3, 530, 1200, "长沙海商网络技术有限公司")
        LODOP.ADD_PRINT_HTM(0, 0, "110%", "100%", document.getElementById('print_div').innerHTML);
        LODOP.PRINT();
      } else {
        var savedBleId = localStorage.getItem("bleId");
        var bleObj = new ConnectPrinter(savedBleId);
        var PrintText = "";
        PrintText += this.chargeData.dateTime;
        PrintText += "\n储值流水：" + this.chargeData.orderId;
        PrintText += bleObj.printLine('*');
        PrintText += bleObj.cTwoRow('会员账号', this.chargeData.member.member.userName);
        PrintText += bleObj.cTwoRow('手机号', this.chargeData.member.member.cellPhone);
        PrintText += bleObj.printLine('*');
        PrintText += bleObj.cTwoRow('储值金额', '￥' + this.mathPlus(parseFloat(this.chargeData.ChargeAmount), parseFloat(this.chargeData.AdditionAmount)));
        PrintText += bleObj.cTwoRow('', '充' + this.chargeData.ChargeAmount + '送' + this.chargeData.AdditionAmount);
        PrintText += bleObj.cTwoRow('储值后余额', this.chargeData.Balance.toString());
        PrintText += bleObj.printLine('*');
        PrintText += bleObj.cTwoRow('实付金额', '￥' + this.chargeData.ChargeAmount);
        var ptype = this.chargeData.payType == 'wx' ? '微信' : '支付宝';
        PrintText += bleObj.cTwoRow('支付方式', ptype);
        PrintText += "\n\n\n";
        bleObj.gotoPrint(PrintText);
      }
    }
  },
  filters: {
    rmb: function(value) {
      return "￥" + (parseFloat(value).toFixed(2))
    },
    frmb: function(value) {
      return "-￥" + (parseFloat(value).toFixed(2))
    }
  }
}

</script>
