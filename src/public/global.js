global.carts=[];
global.subdata=null;
global.userId=0;
global.memberData=null;
global.payTypeList=[];
global.successData={};
global.goOrderData={};
global.indexData={member:null,checkedProid:""};
global.cardId=0;
global.shopId=0;
global.managerId=0;
global.chargeData=null;
global.SHOP_NAME="";
global.CASH_ER="";
global.isCashBegin=false;
global.autoPrint = false;
global.wWeighDisPlays = null;

Number.prototype.toFixed=function (d) {
    var s=this+"";
    if(!d)d=0;
    if(s.indexOf(".")==-1)s+=".";
    s+=new Array(d+1).join("0");
    if(new RegExp("^(-|\\+)?(\\d+(\\.\\d{0,"+(d+1)+"})?)\\d*$").test(s)){
        var s="0"+RegExp.$2,pm=RegExp.$1,a=RegExp.$3.length,b=true;
        if(a==d+2){
            a=s.match(/\d/g);
            if(parseInt(a[a.length-1])>4){
                for(var i=a.length-2;i>=0;i--){
                    a[i]=parseInt(a[i])+1;
                    if(a[i]==10){
                        a[i]=0;
                        b=i!=1;
                    }else break;
                }
            }
            s=a.join("").replace(new RegExp("(\\d+)(\\d{"+d+"})\\d$"),"$1.$2");

        }if(b)s=s.substr(1);
        return (pm+s).replace(/\.$/,"");
    }return this+"";
};

//表示全局唯一标识符 (GUID)。
function Guid(g) {
	var arr = new Array(); //存放32位数值的数组
	if (typeof (g) == "string") { //如果构造函数的参数为字符串
		InitByString(arr, g);
	}
	else {
		InitByOther(arr);
	}

	//返回一个值，该值指示 Guid 的两个实例是否表示同一个值。
	this.Equals = function (o) {
		if (o && o.IsGuid) {
			return this.ToString() == o.ToString();
		}
		else {
			return false;
		}
	}

	//Guid对象的标记
	this.IsGuid = function () { }
	//返回 Guid 类的此实例值的 String 表示形式。
	this.ToString = function (format) {
		if (typeof (format) == "string") {
			if (format == "N" || format == "D" || format == "B" || format == "P") {
				return ToStringWithFormat(arr, format);
			}
			else {
				return ToStringWithFormat(arr, "D");
			}
		}
		else {
			return ToStringWithFormat(arr, "D");
		}
	}
	//由字符串加载
	function InitByString(arr, g) {
		g = g.replace(/\{|\(|\)|\}|-/g, "");
		g = g.toLowerCase();
		if (g.length != 32 || g.search(/[^0-9,a-f]/i) != -1) {
			InitByOther(arr);
		}
		else {
			for (var i = 0; i < g.length; i++) {
				arr.push(g[i]);
			}
		}
	}
	//由其他类型加载
	function InitByOther(arr) {
		var i = 32;
		while (i--) {
			arr.push("0");
		}
	}
	/*
    根据所提供的格式说明符，返回此 Guid 实例值的 String 表示形式。
    N  32 位： xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    D  由连字符分隔的 32 位数字 xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    B  括在大括号中、由连字符分隔的 32 位数字：{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}
    P  括在圆括号中、由连字符分隔的 32 位数字：(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
    */
	function ToStringWithFormat(arr, format) {
		switch (format) {
			case "N":
				return arr.toString().replace(/,/g, "");
			case "D":
				var str = arr.slice(0, 8) + "-" + arr.slice(8, 12) + "-" + arr.slice(12, 16) + "-" + arr.slice(16, 20) + "-" + arr.slice(20, 32);
				str = str.replace(/,/g, "");
				return str;
			case "B":
				var str = ToStringWithFormat(arr, "D");
				str = "{" + str + "}";
				return str;
			case "P":
				var str = ToStringWithFormat(arr, "D");
				str = "(" + str + ")";
				return str;
			default:
				return new Guid();
		}
	}
}
//Guid 类的默认实例，其值保证均为零。
Guid.Empty = new Guid();
//初始化 Guid 类的一个新实例。
Guid.NewGuid = function () {
	var g = "";
	var i = 32;
	while (i--) {
		g += Math.floor(Math.random() * 16.0).toString(16);
	}
	return new Guid(g);
}
if(localStorage.getItem("CasherGuid")){
   global.guid=localStorage.getItem("CasherGuid");
}else{
   global.guid=Guid.NewGuid().ToString();
   localStorage.setItem("CasherGuid",guid);
}
