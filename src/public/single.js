
var keyShopId;
var maxTime = 24; //小时

import Toast from '@/public/toast.js'

function getStore(shopId){
	if(shopId){
		keyShopId = shopId;
	}
	var storeList = localStorage.getItem("datalist"+keyShopId) || null,
	    newList = {datelist:[]};
	if(storeList){
		storeList = JSON.parse(storeList);
		for(var i = 0; i<storeList.datelist.length; i++){
				var startTime = new Date(storeList.datelist[i].time)*1;
			var nowTime = new Date()*1;
			if(nowTime-startTime<maxTime*60*60*1000){
					newList.datelist.push(storeList.datelist[i]);
			}
		} 
		var x = storeList.datelist.length-newList.datelist.length;
		localStorage.setItem("datalist"+shopId,JSON.stringify(newList));
	}
	return newList;
}

function setStore(data,time,member,shopId){
	keyShopId = shopId;
	var setObj ={}; 
	setObj.datelist =[];
	var detaileList={};
	detaileList.member =member
	detaileList.list =data;
	if(time){
		var obj,
		Year = time.getFullYear(),
		Mouth = time.getMonth()+1,
		Data = time.getDate(),
		hh = time.getHours(),
		ff = time.getMinutes(),
		ss = time.getSeconds();
		obj = 	Year+"-"+Mouth+"-"+Data+" "+hh+':'+ff+":"+ss;
        detaileList.time = obj
	}
	setObj.datelist.push(detaileList);
    if(getStore().datelist){
    	setObj.datelist = setObj.datelist.concat(getStore().datelist)
    }
	localStorage.setItem("datalist"+keyShopId,JSON.stringify(setObj));
}

function removeStore(index){
	var setObj ={};
	setObj.datelist =[];
	setObj.datelist = getStore().datelist
    for(var i=0;i<=setObj.datelist.length;i++){
    	setObj.datelist.splice(index,1);
    	break;
    }
    localStorage.setItem("datalist"+keyShopId,JSON.stringify(setObj));
}

function clearStore(){
	var setObj ={};
	setObj.datelist =[];
    localStorage.setItem("datalist"+keyShopId,JSON.stringify(setObj));
}
export{
	setStore,
	getStore,
	removeStore,
	clearStore
}