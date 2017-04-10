(function(){
	 function verify(){}
	 
	 verify.prototype.checkPhone = function(inputVal,mes){
		 if(/^1[34578]\d{9}$/.test(inputVal)){
			 return true;
		 }else{
			 this.tips(mes);
			 return false;
		 }
	 }
	 
	 verify.prototype.checkPwd = function(inputVal,mes){
		 if(inputVal.length < 6 || inputVal.length > 20){
			 this.tips(mes);
			 return false;
		 }else{
			 return true;
			 
		 }
	 }
	 
	 verify.prototype.checkEmail = function(inputVal,mes){
		 //think@dongnaoedu.com,$就是结束
		 if(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(inputVal)){
			return true;
		 }else{
			this.tips(mes);
			return false; 
		 }
	 }
	 /*
	 需要延迟，所以需要定时器
	 传入信息，把传入信息放到div,显示div
	 */
	 var tips_time = null;//用于接收定时器
	verify.prototype.tips = function(mes){
		clearTimeout(tips_time);
		tips_time = null;
		if(document.getElementsByClassName("show-tips").length > 0){
			document.getElementsByClassName("show-tips")[0].remove();
		}
		var tipsDiv = document.createElement("div");
		tipsDiv.className = "show-tips";
		tipsDiv.innerHTML = "<span>"+mes+"</span><div></div>";
		document.body.appendChild(tipsDiv);
		tips_time = setTimeout(function(){
			tipsDiv.remove();
			
		},1000);
		return false;
	}
	
	 
	 var verifyForm = new verify;
	 
	 window["verifyForm"] = verifyForm;
	
})();//后面这对括号，叫自执行函数

/*
1、方便调用
2、方便修改
3、方便维护

*/