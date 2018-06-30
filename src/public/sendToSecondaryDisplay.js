import {SaveCashierViceScreen} from '@/api';
var self = this;
function sendTosecondaryDisplay(cart,member,payment,status,w){

// 			var ua = navigator.userAgent;
// 			if(ua.indexOf("S2")==-1) return;
  	  var data = {
  	  	  status:status,
  	  	  cart:cart,
  	  	  member:member,
  	  	  payment:payment,
  	  	  shopId:shopId,
					shopName:w.$store.getters.userInfo.shopName,
  	  }
			
			SaveCashierViceScreen({data:JSON.stringify(data),deviceId:1}).then(function(response) {
					
			});
			function plusReady(){
				  var uuid = plus.storage.getItem("uuid");
					// alert("uuid:"+uuid);
					SaveCashierViceScreen({data:JSON.stringify(data),deviceId:uuid}).then(function(response) {
							  // alert(JSON.stringify(response));
					});
			}
			if(window.plus){
				 plusReady();
			}else{
				 document.addEventListener("plusready",plusReady,false);
			}
			
}

export{
	sendTosecondaryDisplay
}

