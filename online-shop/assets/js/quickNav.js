(function(){
	 function navOperate(){}
	 
	 navOperate.prototype.init = function(param){
		this.qnItem = param.navItem;//快捷导航的子项
		this.titleObj = param.titleItem;//标题项目
		this.navStatus = param.navStatus;
		this.navObj = param.navObj;
		this.initEvent(param);
	 }
	 
	 navOperate.prototype.initEvent = function(param){
		var _this = this;
		for(var i = 0;i < this.qnItem.length;i++){
			this.qnItem[i].onclick = function(){
				var goScroll = _this.titleObj[this.getAttribute("data-index")].offsetTop;
				window.scrollTo(0,goScroll);
			}
		}
		/*
		onscroll调用次数比较频繁，所以要注意性能
		*/
		window.onscroll = function(){
			_this.chooseNav();
		}
		_this.chooseNav();
	 }
	 
	navOperate.prototype.chooseNav = function(){
		var currScrollTop = document.body.scrollTop || document.documentElement.scrollTop;//获取当前滚动高度
		if(this.titleObj[0].offsetTop > currScrollTop){
			this.navObj.className = "quick-nav"
		}else{ 
			this.navObj.className += " show-quick-nav";
		}
		for(var i = 0;i < this.titleObj.length;i++){
			if(currScrollTop <= this.titleObj[i].offsetTop){//对比高度
				var currChoose = this.navObj.getElementsByClassName("active");
				if(currChoose.length > 0){
					currChoose[0].className = "qn-item";//可以改为获取class，然后替换掉active，去掉空格用trim()
					
				}
				this.qnItem[i].className = "qn-item active";
				this.navStatus.style.top = 50*i+"px";
				break;
			}
		}
		
		//返回顶部
		document.getElementById("goTop").onclick = function(){
		/*如果想通过原生JS来实现过度跳转到相应位置，那么可以使用定时器
		获取当前滚动高度，然后对高度逐一递减
		如果要判断是上去还是下去，直接对当前到顶部的高度和点击的高度对比即可
		*/
			window.scrollTo(0,0);
		}
	}
	 var navOperate = new navOperate;
	 
	 window["navOperate"] = navOperate;
	
})();//后面这对括号，叫自执行函数

/*
1、方便调用
2、方便修改
3、方便维护

*/