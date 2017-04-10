(function(){
	 function autoSlide(){}
	 
	 autoSlide.prototype.init = function(initParam){
		 //都在这里初始化
		 this.dsq = null;
		 //判断是手机还是电脑打开，选择初始化
		 if(!this.isPhone()){
			 this.phoneSlide(initParam);//initParam是形参
		 }else{
			 this.computerSlide(initParam);
		 }
	 }
	 
	 autoSlide.prototype.computerSlide = function(param){//电脑端初始化
		var _this = this;//区分作用域
		var divEle = document.createElement("div");//创建一个图片列表box
		divEle.className = "slide-box";
		var divFocus = document.createElement("div");//创建一个图片焦点box
		divFocus.className = "slide-focus";
		for(var i = 0;i < param.slideLi.length;i++){
			var slideItem = document.createElement("div");//创建图片项目
			var focusItem = document.createElement("span");
			focusItem.setAttribute("data-index",i);
			if(i == 0){
				slideItem.className = "active"
				focusItem.className = "on";
			}
			//注意不要使用mousemove，会导致重复调用
			focusItem.onmouseover = function(){
				if(this.className.indexOf("on") < 0){
					console.log("Hello");
					//获取当前是第几个
					//alert(this.getAttribute("data-index"));
					divFocus.getElementsByClassName("on")[0].className = "";//清除之前的标记
					this.className = "on";//设置当前的状态
					divEle.getElementsByClassName("active")[0].className = "";//清除
					divEle.children[this.getAttribute("data-index")].className = "active";//设置当前的标记
				}
			}
			
			
			//querySelectorAll获取出来的是一个数组，所以要选择第几个
			slideItem.style.backgroundImage = "url('"+ param.slideLi[i].querySelectorAll("img")[0].getAttribute("src") +"')";//这里也需要像css一样，写url();
			divEle.appendChild(slideItem);//存储到图片列表box
			divFocus.appendChild(focusItem);//存储span元素到图片焦点box
		}
		
		
		document.getElementById("slidePic").remove();
		var focus = document.getElementById("focus");
		
		focus.onmousemove = function(){
			clearTimeout(_this.dsq);
		}
		focus.onmouseout = function(){
			_this.computerAuto();
		}
		focus.appendChild(divEle);
		focus.appendChild(divFocus);
		this.computerAuto();
	 }
	 
	 autoSlide.prototype.computerAuto = function(){//自动播放
		 /*
			1、获取当前是第几个
			2、获取总共有多少个
			3、匹配如果当前是最后一个，那么下一个就是第一个
			4、调用定时器自动执行（setInterval有Bug，长期调用，可能会导致越来越快）
		 */
		 var _this = this;
		 this.dsq = setTimeout(function(){
			 var slideBox = document.getElementsByClassName("slide-box")[0].children;
			 var slideFocus = document.getElementsByClassName("slide-focus")[0].children;
			 var currFocus = Number(document.getElementsByClassName("slide-focus")[0].getElementsByClassName("on")[0].getAttribute("data-index"));
			 slideBox[currFocus].className = "";
			 slideFocus[currFocus].className = "";
			 if((slideBox.length-1) <= currFocus){
				 slideBox[0].className = "active";
				 slideFocus[0].className = "on";
				 
			 }else{
				 slideBox[currFocus+1].className = "active";
				 slideFocus[currFocus+1].className = "on";			 
			 }
			 _this.computerAuto();
		 },3000);
	 }
	 
	 autoSlide.prototype.phoneSlide = function(param){//手机端初始化
		var element = param.slideWrap.children[0];//获取到UL
		/*
			slides:li对象
			slidePos:Li的位置
			slideFocus:焦点对象
		*/
		var slides,slidePos,slideFocus;
		var index = 0;//下标，滚动到第几屏
		var speed = 300;//执行动画时间
		var currWidth = document.documentElement.clientWidth;//当前宽度
		var interval;//定时器
		var start = {};//保存移动距离
		var delta = {};//移动距离，touchstart到touchmove的距离
		var isScrolling;
		
		var browser = {//保证兼容性
			addEventListener: !! window.addEventListener,
			touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
			transitions: (function(temp) {
				/*
				区分浏览器前缀：webkit表示安卓和苹果都可以，o:欧朋、Moz：Firefox、ms：IE，现在的浏览器一般不加前缀也可以，但是手机端不一定
				*/
				var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
				for ( var i in props ) {
					if (temp.style[ props[i] ] !== undefined) {
						return true;
					}
				}
				return false;
			})(document.createElement('swipe'))
		};
		
		function init(){
			slides = element.children;//获取Li项目
			if(slides.length < 3){//如果个数小于3个
				element.appendChild(slides[0].cloneNode(true));
				element.appendChild(slides[1].cloneNode(true));
				var ulFocus = element.parentElement.nextElementSibling;
				ulFocus.innerHTML += ulFocus.innerHTML;//增加焦点
			}
			slideFocus = document.createElement("div");//创建焦点图层
			slideFocus.className = "slide-focus";
			var focusHtml = "";
			for(var i = 0;i < slides.length;i++){
				focusHtml += "<span></span>";
			}
			slideFocus.innerHTML = focusHtml;//增加焦点图层的span
			param.slideWrap.appendChild(slideFocus);//向页面增加焦点元素
			slideFocus.children[0].className = "on";//设置第一个为默认焦点
			element.style.width = slides.length * currWidth+"px";//设置ul宽度
			slidePos = new Array(slides.length);//初始化“Li的位置”的空间
			var pos = slides.length;
			while(pos--){//设置li滑动图层的初始值
				slides[pos].style.width = currWidth + "px";//设置滑动图层宽度
				slides[pos].setAttribute("data-index",pos);//标记图层下标
				slides[pos].style.left = pos * -currWidth + "px";
				console.log("位置："+index > pos ? -currWidth:(index < pos ? currWidth :0));
				move(pos,index > pos ? -currWidth:(index < pos ? currWidth :0),0);
			}
			/* 
			由于index如果是0，那么index-1就不行，所以创建方法处理他
			*/
			move(circle(index-1),-currWidth,0);//上一个
			move(circle(index+1),currWidth,0);//下一个
			if(param.auto){//判断是否自动播放
				autoPlay();
				
			}
		}
		/*
			自动播放：都是往下一张
		*/
		function autoPlay(){
			/*
			  setInterval可能会存在调用多了之后，会变快
			*/
			interval = setTimeout(function(){
				var currLength = slides.length;
				while(currLength--){
					move(currLength,currWidth,0);
				}
				slideFocus.children[index].className = "";
				move(index,-currWidth,speed);
				move(circle(index+1),0,speed);//下一张
				index =　circle(index+1);
				slideFocus.children[index].className = "on";
				autoPlay();
			},param.auto);
			return;
			
		}
		/*
			index:第几个
			dist:走动的位置
			speed:走动的时间
		*/
		function move(index,dist,speed){//移动滑动图层
			translate(index,dist,speed);
			slidePos[index] = dist;//改变元素的位置
			
		}
		
		function translate(index,dist,speed){//移动距离
			var slide = slides[index];//选择传入的第几个
			slide.style.webkitTransitionDuration = speed +'ms';
			slide.style.webkitTransform = 'translate('+dist+"px,0) translateZ(0)";
			
		}
		
		function circle(index){//返回一个正确的下标
			return (slides.length + (index % slides.length)) % slides.length;
		}
		
		var events = {
			handleEvent:function(event){//自动查找handleEvent
				switch(event.type){
					case 'touchstart':this.start(event);break;
					case 'touchmove':this.move(event);break;
					case 'touchend':this.end(event);break;
					case 'resize':init.call();break;
				}
				
			},
			start:function(event){
				clearTimeout(interval);//停止自动播放
				var touches = event.touches[0];//获取坐标
				start = {
					x : touches.pageX,
					y : touches.pageY,
					time : + new Date
				}
				delta = {};//清空数值
				isScrolling = undefined;//清空状态
				element.addEventListener('touchmove',this,false);//移动事件
				element.addEventListener('touchend',this,false);//松开事件
				
			},
			move:function(event){//移动
				var touches = event.touches[0];
				delta = {//获取移动之后的坐标差
					x:touches.pageX - start.x,
					y:touches.pageY - start.y
				}
				if(typeof isScrolling == "undefined"){
					isScrolling = !!(isScrolling || Math.abs(delta.x) < Math.abs(delta.y));
					
				}
				var direaction = delta.x < 0;//判断方向，布尔类型
				
				if(!isScrolling){
					event.preventDefault();
					//判断方向
					if(direaction){//往左
						
						translate(index,delta.x+slidePos[index],0);//移动当前图层
						translate(circle(index+1),delta.x+slidePos[circle(index+1)],0);//移动下一张图层
					}else{//往右
						translate(index,delta.x+slidePos[index],0);//移动当前图层
						translate(circle(index-1),delta.x+slidePos[circle(index-1)],0);//移动下一张图层
					}
				}
			},
			end:function(){
				var duration = +new Date - start.time;
				//判断当前时间和滑动距离或滑动距离大于当前宽度的一半
				var isValidSlide = Number(duration) < 250 && Math.abs(delta.x) > 20 || Math.abs(delta.x) > currWidth/2;
				
				var direaction = delta.x < 0;//判断方向
				if(!isScrolling){
					if(isValidSlide){//判断是否可行
						//注意，这里就必须可以滚动图片
						slideFocus.children[index].className = "";//清除焦点
						if(direaction){
							move(circle(index-1),-currWidth,0);
							move(circle(index+2),currWidth,0);//走完之后的下一张
							
							move(index,slidePos[index]-currWidth,speed);//当前图层
							move(circle(index+1),slidePos[circle(index+1)]-currWidth,speed);
							index = circle(index+1);//赋值滚动之后的下标
						}else{
							move(circle(index+1),currWidth,0);
							move(circle(index-2),-currWidth,0);//走完之后的上一张
							
							move(index,slidePos[index]+currWidth,speed);//当前图层
							move(circle(index-1),slidePos[circle(index-1)]+currWidth,speed);
							index = circle(index-1);//赋值滚动之后的下标
							
						}
						
						slideFocus.children[index].className = "on";//增加焦点
					}else{//慢拖动释放
						move(circle(index-1),-currWidth,speed);
						move(index,0,speed);
						move(circle(index+1),currWidth,speed);
						
					}
					
				}
				if(param.auto){//判断是否自动播放
					autoPlay();
					
				}
				element.removeEventListener("touchmove",events,false);
				element.removeEventListener("touchend",events,false);
				return;
				
			}
			
		}
		
		
		init();
		
		if(browser.addEventListener){//判断兼容
			element.addEventListener("touchstart",events,false);
			//window.addEventListener("resize",events,false);
			
		}
		
		
		
		
		
		
		
		
		
		
		
		
		 
	 }
	 
	 autoSlide.prototype.isPhone = function(){
		var userAgentInfo = navigator.userAgent;
		var agents = ["Android", "iPhone",
	                "SymbianOS", "Windows Phone",
	                "iPad", "iPod"];//系统名字
		var flag = true;//是否包含状态
		for(var i = 0;i < agents.length;i++){
			if(userAgentInfo.indexOf(agents[i]) > 0){
				flag = false;//判断是否包含，修改flag状态
				break;//结束for循环判断				
			}	
		}
		
		return flag;


		
	 }
	 
	 var autoSlides = new autoSlide;
	 
	 window["autoSlide"] = autoSlides;
	
})();//后面这对括号，叫自执行函数

/*
1、方便调用
2、方便修改
3、方便维护

*/