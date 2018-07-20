<template>
     <div class="cacherShiftBegin">
          <h1>设置期初现金</h1>
          <input type="text" placeholder="请输入当前现金金额" ref="startValue" @input="startInput">
          <mu-raised-button label="确认" class="button yellow" :class="{disabled:money==''}"  @click="openDialog"/>
          <mu-dialog dialogClass="m-dialog" :open="dialog" title="确认期初现金" @close="close">
              <div class="confirmBegin">您设置的期初现金为：<em>{{money}}</em><span>元</span></div>
              <mu-flat-button slot="actions" @click="dialog=false" label="取消"/>
              <mu-flat-button slot="actions" primary @click="setCacherShiftBegin" label="确定"/>
           </mu-dialog>
     </div>
</template>
<script>
// import '@/assets/css/assembly.css';
import '@/assets/css/shift.css';
import { setCacherShiftBegin } from '@/api'
export default {
  data(){
        return{
             money:"",
             dialog:false
        }
  },
  methods:{
       setCacherShiftBegin(){
         if(this.money=="") return;
         var self = this
         setCacherShiftBegin({ cashBegin: this.money }).then(function(response){
              if(response.data.success){
                window.location.href="#/";
                self.$store.dispatch('setIsCashier');
              }else{
                  self.$toast(response.data.msg);
              }
         })
       },
       startInput:function(el){
           var n = this.$refs.startValue.value;
           if(this.$refs.startValue.value!=""){
               this.$refs.startValue.value=this.numberOnly(n);
               this.money=this.$refs.startValue.value;
           }else{
               this.money="";
           }
       },
       numberOnly:function(vv){
           if(vv == ""){
               return 0;
           }
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
       },
       openDialog(){
          if(this.money) this.dialog=true;
       },
       close(){
          this.dialog = false;
       }
  }
}
</script>
