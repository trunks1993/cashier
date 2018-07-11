<template>
    <div class="orderItem">
        <div class="header">
            <i class="iconfont icon-fanhui back" @click="$router.push('/')"></i>
            <div>
                <mu-text-field hintText="搜索订单编号/会员信息" v-model="cardNo" class="seach-Input" fullWidth />
            </div>
        </div>
        <div class="filterBox">
            <div class="filterItem">
                <h2>下单时间</h2>
                <div class="item">
                    <span v-for="item in filterTime" :key="item.id" :class="{active:filterItem.timeType == item.id}" @click="filterItem.timeType = item.id">{{item.name}}</span>
                </div>
            </div>
            <div class="filterItem">
                <h2>订单状态</h2>
                <div class="item">
                    <span v-for="item in filterOrderStatus" :key="item.id" :class="{active:filterItem.orderStatus == item.id}" @click="filterItem.orderStatus = item.id">{{item.name}}</span>
                </div>
            </div>
            <div class="filterItem">
                <h2>售后状态</h2>
                <div class="item">
                    <span v-for="item in filterrefundStatus" :key="item.id" :class="{active:filterItem.HasAfterSale == item.id}" @click="filterItem.HasAfterSale = item.id">{{item.name}}</span>
                </div>
            </div>
            <pcPrinter ref="printer"></pcPrinter>
        </div>
        <div class="orderListBox">
            <div class="orderList" id="orderList">
                <ul v-if="dataItems.length>0">
                    <li v-for="(item,idx) in dataItems" :key="idx">
                        <div class="listIn">
                            <div class="head" @click="goDetails(item.orderId)">
                                <span>{{item.orderId}}</span>
                                <span class="status" :class="{light:item.orderStatus==6}">{{orderStatus[item.orderStatus-1]}}</span>
                            </div>
                            <div class="orderPorductlist" v-for="(itemChild,index) in item.newOrderItem" @click="goDetails(item.orderId)" :key="index">
                                <div class="img">
                                    <img :src="itemChild.showImage" />
                                </div>
                                <div class="proName">{{itemChild.productName}}</div>
                                <div class="spec">
                                    <span v-if="itemChild.color">"{{itemChild.color}}"</span>
                                    <span v-if="itemChild.size">"{{itemChild.size}}"</span>
                                    <span v-if="itemChild.version">"{{itemChild.version}}"</span>
                                </div>
                                <div class="price">{{itemChild.salePrice | rmb}}
                                    <em v-if="itemChild.productSaleMethod==1">/{{itemChild.measureUnit}}</em>
                                </div>
                                <div class="count">x{{itemChild.quantity}}
                                    <em class="tips" v-if="itemChild.refundStatus">{{itemChild.refundStatus}}</em>
                                </div>
                            </div>
                            <div class="foot">
                                <span>共{{item.totalQuantity}}件商品 合计：{{item.totalAmount | rmb}}</span>
                                <mu-raised-button v-if="item.orderStatus!=1" label="打印小票" @click="print(item.orderId)" class="button" />
                                <mu-raised-button v-if="IsRefund&&(item.orderStatus==6||item.orderStatus==2||item.orderStatus==4)&&!refundLength(item.newOrderItem)" @click="goRefund(item.orderId,item.isOutOfSale)"
                                    label="发起售后" class="button" />
                            </div>
                        </div>
                    </li>
                </ul>
                <div v-else class="noData">
                    <img src="../../assets/images/enpty-single.png" />
                    <p>没有找到订单</p>
                </div>
            </div>
            <div class="footer" v-show="dataItems.length>0">
                <mu-pagination class="changePage" :total="total" :pageSize="pageSize" :current="pageNo" @pageChange="paging"></mu-pagination>
            </div>
        </div>
        <div class="loading smloading" v-show="loading">
            <div class="spinner">
                <div class="double-bounce1"></div>
                <div class="double-bounce2"></div>
            </div>
        </div>
    </div>
</template>
<script>

    import pcPrinter from "@/views/pcPrinter"
    import '@/assets/css/assembly.css'
    import '@/assets/css/orderItems.css'
    import { getShopOrder } from '@/api'
    
    export default {
        components:{pcPrinter},
        data() {
            return {
                pageSize: 10,
                pageNo: 1,
                total: 1,
                trigger: null,
                openFilter: false,
                dataItems: [],
                orderStatus: ['待付款', '待发货', '待自提', '待收货', '已关闭', '已完成'],
                filterTime: [{ name: "全部", id: 0 }, { name: "今天", id: 1 }, { name: "昨天", id: 2 }, { name: "近7天", id: 3 }],
                filterOrderStatus: [{ name: "全部", id: 0 }, { name: "已完成", id: 6 }, { name: "已关闭", id: 5 }, { name: "待发货", id: 2 }, { name: "待收货", id: 4 }, { name: "待付款", id: 1 }],
                filterrefundStatus: [{ name: "全部", id: 0 }, { name: "未售后", id: 1 }, { name: "已售后", id: 2 }],
                cardNo: "",
                filterItem: {
                    timeType: 0,
                    orderStatus: 0,
                    HasAfterSale: 0,
                },
                loading: false,
                isCashBegin:this.$store.getters.iscashier,
				isOpenCashierShift:this.$store.getters.userInfo.openCashierShift
            }
        },
        created: function () {
            this.$emit("isBack", false);
            this.getShopOrder();
            var self = this;
            document.body.addEventListener("keyup",this.bodyKeyUp,false);
        },
        destroyed:function(){
              document.body.removeEventListener("keyup",this.bodyKeyUp,false);
        },
        mounted() {
              this.trigger = this.$refs.filterLoc;
        },
				computed: {
					IsRefund() {
						var ist = false;
						if(!this.isOpenCashierShift){
							  ist = true;
						} else{
							 if(this.isCashBegin){
								   ist = true;
							 }
						}
						return ist;
					}
				},
        watch: {
            filterItem: {
                handler: function (val) {
                    this.getShopOrder();
                    this.pageNo = 1;
                },
                deep: true
            },
        },
        methods: {
            print(id){
                var data = null;
                for(var i=0;i<this.dataItems.length;i++){
                    if(this.dataItems[i].orderId == id){
                        data = this.dataItems[i];
                    }
                }
                this.$refs.printer.orderList(data);
            },
            bodyKeyUp(e){
                    var self = this;
                    if(e.keyCode==13&&this.cardNo!=""){
                        setTimeout(function(){
                             self.pageNo = 1;
                             self.getShopOrder();
                        },250)
                    }
            },
            updateCashBegin:function(val){
                this.isCashBegin = val;
            },
            refundLength: function (obj) {
                var x = 0;
                for (var i = 0; i < obj.length; i++) {
                    if (obj[i].refundStatus) {
                        x++;
                    }
                }
                return x == obj.length;
            },
            getShopOrder: function () {
                var self = this;
                var updata = "";
                var timeType = this.filterItem.timeType == 0 ? "" : this.filterItem.timeType;
                var orderStatus = this.filterItem.orderStatus == 0 ? "" : this.filterItem.orderStatus;
                updata = "&timeType=" + timeType + "&orderStatus=" + orderStatus;
                if (this.filterItem.HasAfterSale != 0) {
                    var HasAfterSale = this.filterItem.HasAfterSale == 1 ? false : true;
                    updata += "&hasAfterSale=" + HasAfterSale;
                }
                self.loading = true;
                
                getShopOrder(self.pageNo, self.pageSize, self.cardNo, updata).then(function (response) {
                    self.loading = false;
                    self.dataItems = response.data.models;
                    self.total = response.data.total;
                    // self.cardNo = "";
                    document.getElementById("orderList").scrollTop = 0;
                });
            },
            paging: function (newIndex) {
                this.pageNo = newIndex;
                this.getShopOrder();
            },
            openFilterbox: function () {
                this.openFilter = true;
            },
            closeFilterbox: function () {
                this.openFilter = false;
            },
            goDetails: function (id) {
                this.$router.push({
                    path: '/orderDetails',
                    query: {
                        id: id
                    }
                });
            },
            goRefund: function (id, isOutTime) {
                if (isOutTime) {
                    this.$toast("已过售后维权期");
                    return;
                }
                this.$router.push({
                    path: '/launchDetails/' + id
                });
            },
        },
        filters: {
            rmb: function (value) {
                return "￥" + (parseFloat(value).toFixed(2))
            },
            frmb: function (value) {
                return "-￥" + (parseFloat(value).toFixed(2))
            }
        }
    }
</script>
