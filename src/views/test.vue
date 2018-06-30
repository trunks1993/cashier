<template>
    <div>

    	  <br />
    	  <br />
    	  <br />
    	  <br />
    	  <br />    	  <br />
          <input type="text" ref="v" @input="change"  :value="val">
          {{val}}
    </div>
</template>

<style>
	 input{
	 	 border:1px solid #ccc;
	 }
</style>
<script>

export default {
  name: 'test',
  data () {
    return {
        val:100.02
    }
  },
  created:function(){
      
  },
  methods:{
    continueCashier:function(){
    },
    change:function(){
    	 console.log(this.$refs.v.value);
    	 console.log(this.numberOnly(this.$refs.v.value))
    	 this.$refs.v.value=this.numberOnly(this.$refs.v.value);
    	 this.val=this.$refs.v.value;
    },
    numberOnly:function(vv){
    	 if(vv !=''&& vv.substr(0,1) == '.'){  
            vv="";  
        }  
        vv = vv.replace(/^0*(0\.|[1-9])/, '$1');//解决 粘贴不生效  
        vv = vv.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符  
        vv = vv.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的       
        vv = vv.replace(".","$#$").replace(/\./g,"").replace("$#$",".");      
        vv = vv.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');//只能输入两个小数       
        if(vv.indexOf(".")< 0 && vv !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额  
            if(vv.substr(0,1) == '0' && vv.length == 2){  
                vv= vv.substr(1,vv.length);      
            }  
        }  
        return vv;
    }
  },
  directives: {
    numberOnly: {
            bind: function(el) {
                el.handler = function() {
                var regStrs = [  
                      ['^0(\\d+)$', '$1'], //禁止录入整数部分两位以上，但首位为0  
                      ['[^\\d\\.]+$', ''], //禁止录入任何非数字和点  
                      ['\\.(\\d?)\\.+', '.$1'], //禁止录入两个以上的点  
                      ['^(\\d+\\.\\d{2}).+', '$1'] //禁止录入小数点后两位以上  
                  ];  
                  for(var i=0; i<regStrs.length; i++){  
                      var reg = new RegExp(regStrs[i][0]);  
                      el.value = el.value.replace(reg, regStrs[i][1]);  
                  }  
                }
                el.addEventListener('input', el.handler)
            },
            unbind: function(el) {
                el.removeEventListener('input', el.handler)
            }
    }
  },
  filters: {  
 
  }   
}   
    	
</script>  