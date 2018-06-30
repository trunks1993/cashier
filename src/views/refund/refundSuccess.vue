<template>
  <div class="refundSuccess">
    <div class="refundSuccessBox">
      <i class="iconfont icon-shoukuanchenggong"></i>
      <span class="refundText">退款成功</span>
      <mu-raised-button label="查看售后单" class="button lineYellow" @click="goRefundItem" />
    </div>
    <div class="refundSuccessBox" v-if="res.success">
      <i class="iconfont icon-shoukuanchenggong"></i>
      <span class="refundText">退款成功</span>
      <mu-raised-button label="查看售后单" class="button yellow" @click="goRefundItem" />
      <mu-raised-button label="打印小票" class="button lineYellow" @click="printer" />
    </div>
    <div class="refundSuccessBox" v-else>
      <i class="iconfont icon-guanbix"></i>
      <span class="refundText">退款失败，{{res.msg}}</span>
      <mu-raised-button label="重新申请" class="button yellow" @click="$router.go(-1)" />
      <mu-raised-button label="稍后再试" class="button lineYellow" @click="goOrderItem" />
    </div>
    <pcPrinter ref="printer"></pcPrinter>
  </div>
</template>
<script>
import '@/assets/css/assembly.css'
import '@/assets/css/orderItems.css'
import pcPrinter from "@/views/pcPrinter"
import { getRefundOrderDetail } from '@/api'
export default {
  components: { pcPrinter },
  name: 'refundSuccess',
  data() {
    return {
      res: this.$route.query.res,
      // res:{success:false}
    }
  },
  created: function() {
    console.log(this.$route.query.res)
    if (this.res.success == undefined) {
      this.$router.push({
        path: '/orderitems',
      })
    }
    // this.$emit("changeTitle","发起售后");
    this.$emit("isBack", false);
    if (autoPrint) {
      this.printer();
    }
  },
  methods: {
    printer() {
      var self = this;
      console.log("进入print");
      console.log(self.res)
      console.log(self.res.Data)
      var i = 0;
      print();

      function print() {
        getRefundOrderDetail(self.res.Data[i]).then(function(response) {
          console.log(i, self.res.Data.length)
          i++
          self.$refs.printer.refundList(response.data);
          if (i < self.res.Data.length) {
            setTimeout(function() {
              print();
            }, 1000)
          }
          // self.orderDetails = res.data;
        })
      }
    },
    goRefundItem: function() {
      this.$router.push({
        path: '/refundItems',
      });
    },
    goOrderItem: function() {
      this.$router.push({
        path: '/orderitems',
      });
    },
  }
}

</script>
