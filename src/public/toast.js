var toast = {};
toast.install = function (Vue,options) {
	 var opt = {
	 	   type:'bottom',
	 	   time:2000
	 }
	 for(var o in options){
	 	   opt[o] = options[o];
	 }

     Vue.prototype.$toast = function(tips,type){
          var old=document.body.querySelectorAll('.vue-toast');
          if(old.length>0){
	          old.forEach(function(obj){
	                   document.body.removeChild(obj);
	          });
	       }

     	  if(type) {
                 opt.type = type;
      	  }
     	  var toastTpl = Vue.extend({
                  template:'<div class="vue-toast toast-">'+tips+'</div>'
     	  });
     	  var tpl=new toastTpl().$mount().$el;
     	  document.body.appendChild(tpl);

     	  setTimeout(function(){
     	  	  tpl.style.webkitTransform='translateY(50px)';
     	  	  tpl.style.opacity='1';
     	  });
     	  setTimeout(function(){
     	  	    if(tpl) tpl.style.opacity='0';
     	  	    setTimeout(function(){
								  try{
                   if(tpl){document.body.removeChild(tpl)};
								 }catch(e){} 
                },300);
     	  },opt.time);
     };

 	 ['bottom','center','top'].forEach(function(type){
           Vue.prototype.$toast[type]=function(tips){
                  return Vue.prototype.$toast(tips,type);
           }
 	 });
}
module.exports = toast;
