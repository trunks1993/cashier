/**
 * 复位打印机
 */
global.RESET = "\x1b\x40";

/**
 * 左对齐
 */
global.ALIGN_LEFT = "\x1b\x61\x00";

/**
 * 中间对齐
 */
global.ALIGN_CENTER = "\x1b\x61\x01";

/**
 * 右对齐
 */
global.ALIGN_RIGHT = "\x1b\x61\x02";

/**
 * 选择加粗模式
 */
global.BOLD = [0x1b, 0x45, 0x01];

/**
 * 取消加粗模式
 */
global.BOLD_CANCEL = [0x1b, 0x45, 0x00];
/**
 * 普通高度
 */
global.FONT_NORMAL = "\x1d\x21\x00";

/**
 * 宽高加倍
 */
global.DOUBLE_HEIGHT_WIDTH = "\x1d\x21\x11";

/**
 * 宽加倍
 */
global.DOUBLE_WIDTH = [0x1d, 0x21, 0x10];

/**
 * 高加倍
 */
global.DOUBLE_HEIGHT = "\x1d\x21\x01";

/**
 * 字体不放大
 */
global.NORMAL = [0x1d, 0x21, 0x00];

/**
 * 设置默认行间距
 */
global.LINE_SPACING_DEFAULT = [0x1b, 0x32];

/**
 * 打印纸一行最大的字节
 */
global.LINE_BYTE_SIZE = 48;

/**
 * 打印三列时，中间一列的中心线距离打印纸左侧的距离
 */
global.LEFT_LENGTH = 16;

/**
 * 打印三列时，中间一列的中心线距离打印纸右侧的距离
 */
global.RIGHT_LENGTH = 16;

/**
 * 打印三列时，第一列汉字最多显示几个文字
 */
global.LEFT_TEXT_MAX_LENGTH = 5;

global.selectCommand=function(command) {
	return command;
}

//搜索蓝牙打印机函数
global.SearchBluetooth = function() {
	/*dom变量定义*/
	 // <div class="printerType"id="printerType">蓝牙打印机初始化开始</div>
	var tips;
	/*plus变量定义*/
	var main, BluetoothAdapter, BAdapter, IntentFilter, BluetoothDevice, receiver,innerPrintId=""; //有些我也不知道是啥意思-_-!;

	/*其他定义*/
	var isSearchDevices = false, //是否处于搜索状态
		savedBleId = localStorage.getItem("bleId"), //缓存的设备ID
		IntervalObj, //定时器对象
		debug = true; //调试模式

	return {
		//初始化方法
		Init: function() {
			if(!document.getElementById('tips')){
				tips=document.createElement("div");
				tips.className="printerType";
				tips.id="tips"
				tips.innerHTML="蓝牙打印机初始化中...";
		        document.body.appendChild(tips);
			}else{
				document.getElementById('tips').style.display="show";
			} 
			main = plus.android.runtimeMainActivity(),
				BluetoothAdapter = plus.android.importClass("android.bluetooth.BluetoothAdapter"),
				IntentFilter = plus.android.importClass('android.content.IntentFilter'),
				BluetoothDevice = plus.android.importClass("android.bluetooth.BluetoothDevice"),
				BAdapter = new BluetoothAdapter.getDefaultAdapter();

			this.CheckBluetoothState();
		},

		//检测蓝牙状态
		CheckBluetoothState: function() {
			var self = this;
			if(!BAdapter.isEnabled()) {
				plus.nativeUI.confirm("蓝牙处于关闭状态，是否打开？", function(e) {
					if(e.index == 0) {
						BAdapter.enable();
					}
				});
				debug && console.log("蓝牙处于关闭状态，正在打开...");
			} else {
				self.SearchDevices();
				debug && console.log("蓝牙处于开启状态，准备搜索蓝牙设备...");
			}
		},

		//搜索设备
		SearchDevices: function() {
			var self = this;
			isSearchDevices = true;
			debug && console.log("开始搜索蓝牙设备...");

			var filter = new IntentFilter(),
				bdevice = new BluetoothDevice();
			BAdapter.startDiscovery(); //开启搜索

			receiver = plus.android.implements('io.dcloud.android.content.BroadcastReceiver', {
				onReceive: onReceiveFn
			});
			filter.addAction(bdevice.ACTION_FOUND);
			filter.addAction(BAdapter.ACTION_DISCOVERY_STARTED);
			filter.addAction(BAdapter.ACTION_DISCOVERY_FINISHED);
			filter.addAction(BAdapter.ACTION_STATE_CHANGED);
			main.registerReceiver(receiver, filter); //注册监听事件

			//监听回调函数  
			function onReceiveFn(context, intent) {
				plus.android.importClass(intent); //通过intent实例引入intent类，方便以后的‘.’操作
                
				//开始搜索改变状态
				intent.getAction() === "android.bluetooth.device.action.FOUND" && (isSearchDevices = true);

                //判断是否搜索结束
				if(innerPrintId != "") {
					main.unregisterReceiver(receiver); //取消监听
                    localStorage.setItem("bleId",innerPrintId);
					isSearchDevices = false;
					document.getElementById('tips').style.display="none";
					return false;
				} 
				//判断是否搜索结束
				if(intent.getAction() === 'android.bluetooth.adapter.action.DISCOVERY_FINISHED') {
					main.unregisterReceiver(receiver); //取消监听
					isSearchDevices = false;
					if(innerPrintId!=""){ 
                         localStorage.setItem("bleId",innerPrintId);
					     document.getElementById('tips').style.display="none";
					}else{
						SearchBluetooth.Init();  
					}
					return false;
				}

				var BleDevice = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE),
					bleName = BleDevice.getName(), //设备名称
					bleId = BleDevice.getAddress(); //设备mac地址

				if(!bleName || !bleId) {
					return false;
				}

				//判断是否配对
				if(BleDevice.getBondState() === bdevice.BOND_BONDED) {
					debug && console.log("已配对蓝牙设备：" + bleName + '    ' + bleId+'   '+bleName=="InnerPrinter");
                    if(bleName=="InnerPrinter"){
                    	 innerPrintId=bleId;
                    }
				}

			}

		}
	}
}();
//连接打印机和打印
(function(window) {
    function getBytesLength(str) {　
		var byteLen = 0,
			len = str.length;　　
		if(str) {　　　　
			for(var i = 0; i < len; i++) {　　　　　　
				if(str.charCodeAt(i) > 255) {　　　　　　　　
					byteLen += 2;　　　　　　
				}　　　　　　
				else {　　　　　　　　
					byteLen++;　　　　　　
				}　　　　
			}　　　　
			return byteLen;　　
		}　　
		else {　　　　
			return 0;　　
		}
	}

	window.ConnectPrinter = function(bleId) {
		var plusMain = plus.android.runtimeMainActivity(),
			BluetoothAdapter = plus.android.importClass("android.bluetooth.BluetoothAdapter"),
			UUID = plus.android.importClass("java.util.UUID"),
			uuid = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB"),
			BAdapter = BluetoothAdapter.getDefaultAdapter(),
			device = BAdapter.getRemoteDevice(bleId);

		plus.android.importClass(device);

		var bluetoothSocket = device.createInsecureRfcommSocketToServiceRecord(uuid);
		plus.android.importClass(bluetoothSocket);
		if(!bluetoothSocket.isConnected()) {
			bluetoothSocket.connect();
		}

		this.gotoPrint = function(byteStr) {
			var outputStream = bluetoothSocket.getOutputStream();
			plus.android.importClass(outputStream);
			var str="";
			str+=DOUBLE_HEIGHT_WIDTH;
            str+=ALIGN_CENTER;
            str+=SHOP_NAME+'\n\n';
            str+=RESET;
            byteStr=str+byteStr;
			var bytes = plus.android.invoke(byteStr, 'getBytes', 'gbk');
			outputStream.write(bytes);
			outputStream.flush();
			device = null;
		};

		this.cTwoRow=function(leftText, rightText) {
			var sb = leftText;
			var leftTextLength = getBytesLength(leftText);
			var rightTextLength = getBytesLength(rightText);

			// 计算两侧文字中间的空格
			var marginBetweenMiddleAndRight = LINE_BYTE_SIZE - leftTextLength - rightTextLength;

			for(var i = 0; i < marginBetweenMiddleAndRight; i++) {
				sb += " ";
			}
			sb += rightText;
			return "\n"+sb;
		}
		this.printLine=function(FormatText) {
			var printext = "";
			for(var x = 0; x < LINE_BYTE_SIZE; x++) {
				printext += FormatText;
			}
			return "\n"+ ALIGN_LEFT + printext;
		}
	};
})(window);