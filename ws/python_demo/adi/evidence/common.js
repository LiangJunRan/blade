(function($) {
    $.common = function(el, options) {
        var $common = $(el),
		touch = ("ontouchstart" in window) || window.DocumentTouch && document instanceof DocumentTouch,
        eventType = (touch) ? "touchstart" : "click";
        $common.methods = {
            init: function() {
             $common.page=null;
             $common.addcarting=false;
             $common.commonMiniShoppingcar=null;
             $common.commonSearch=null;
             $common.productStruct=null;
             //加载页面上所有的data-htmlfile
             $common.loadHtml.setup(function(){$common.methods.run();});
            },
            run:function(){
              try{$common.commonMiniShoppingcar=new $.commonMiniShoppingcar();$common.commonMiniShoppingcar.init();}catch(e){};//迷你购物车
              try{$common.commonSearch=new $.commonSearch();$common.commonSearch.init();}catch(e){};//搜索
              try{$common.page=new $.page();$common.page.init();}catch(e){};//异步执行每个view页面的入口
              try{$common.productStruct=new $.productStruct().run();}catch(e){};//产品功能
              try{$common.pageImagesAsyn=new $.pageImagesAsyn($("body"),{mode:"single"});}catch(e){};//初始化异步加载图片
              try{$(".copySelect").copySelect({isDefault:true,optionClick:function(dom,index){}});}catch(e){} //select模拟
			  try{$(".commonInput").placeholder({defaultColor:"#c8cbcc",color:"#000"});}catch(e){}//placeholder
			  try{$(".copySelectSize").copySelect({title:"尺寸:",defaultText:"选择尺寸",isDefault:true,optionClick:function(dom,index){}});}catch(e){} //select模拟
              try{$(".radioBionic").radio({label:true,bionic:true,currentCallback:function(obj){if($common.page)try{$common.page.radio({el:obj.$element,status:obj.checked});}catch(e){}},callback:function(obj,checked,allchecked){if($common.page)try{$common.page.radioChange(obj,checked,allchecked);}catch(e){}}});}catch(e){};//radio执行入口
              try{$(".filterWrapper").inputSlider({slider:"#slider",mininput:"#mininput",maxinput:"#maxinput",complete:function(min,max){$common.dev.setSlider(min,max);}});}catch(e){};
              try{$(".time").countDown({mode:'day',showClass:true,show:false,callback:function(data,obj){$common.countDown(data,obj,"progress")},endCallBack:function(data,obj){$common.countDown(data,obj,"complete");}});}catch(e){}//初始化倒计时-小时
              try{$(".proStar.openStar").proStar({});}catch(e){};//评论功能
			  try{$common.helpTitHover.titleHover()}catch(e){};//helpbox
			  $common.searchHead.event();//初始化头部search事件
              $common.headerAddFooter.event();//初始化头部尾部hover事件
              $common.account.menuLight();//初始化account菜单高亮
//              $common.headerAddFooter.loadUser();//初始化用户弹层
			  try{$common.kvInfoVert.event();}catch(e){};//kvInfo
			  //滚动字幕
			  try{$common.dev.scrollTextCall();}catch(e){};
              $common.resize();
              this.event();//公共事件
            },
            event:function(){
                //个人账户菜单
				$(".leftNavGroup .lngTitle").click(function(){$common.account.toggleSlide(this);});//左侧导航详情内容展开缩起
                //加入购物车
               $(".addCart").click(function(){$common.addCart.click($(this));return false;});
			   //国家选择
			   //$(".guide").click(function(){$common.showCountry($(this));return false;});
               //缩放
               $(window).bind("resize",function(){});
			   //页面加载完成
			   try{htmlCompletedCall()}catch(e){};
            }
        };
        $common.resize=function(){
            if($(".cbImgOlay").length>0){
                $(".cbImgOlay").css({"width":$(window).width(),"left":-($(window).width()-950)/2});
                $(".cbImgOlay .cbImgList").css("margin-left",($(window).width()-950)/2);
            }
        }
		/*************************************底部国家选择**********************/
		 $common.showCountry =function(el){
			 $(".country").show();
		 };
        /*************************************添加购物车**********************/
        $common.addCart ={
            click:function(el){
                if($common.addcarting)return false;
                $common.addcarting=true;
                //先显示loading
                el.removeClass('btnAddBag').addClass("btnLoading");
                //通知页面是哪个元素被点击
                 try{$common.page.addCartClick(el);}catch(e){};
                //请求接口
                $common.dev.getAddCart(el,function(data){el.removeClass('btnLoading').addClass("btnAddBag");$common.addCart.showPop(data,el);try{$common.page.addCart(data,el);}catch(e){};});
            },
            //显示弹层
            showPop:function(data,el){
               $common.addcarting=false;
			   var _obj=data.obj;
			   //console.log(data.obj);
               if(data.result=="success"){
                    var popurl=$common.dev.getPopUrl("addCart");
                    new $.popup.show({url:popurl,
                        complete:function(data){
							var _data=$(data);
							_data.find(".popName").html(_obj.name);
							_data.find(".popPrice").html(_obj.price);
							_data.find(".popColor").html(_obj.colors);
							_data.find(".popSize2").html(_obj.size);
							_data.find(".popQty").html(_obj.qty);
							_data.find(".popItemScount").html(_obj.itemscount);
							_data.find(".popTotal").html(_obj.total);
							_data.find(".popDiscount").html(_obj.discount);
							_data.find(".popTotalpaid").html(_obj.totalpaid);
							_data.find(".popProImg").attr('src',_obj.img);
							_data.find(".btnViewCart").attr('href',_obj.cart_link);
							_data.find(".btnCheckout").attr('href',_obj.checkout_link);
                            $("body").append(_data);
                            $(".minicart").addClass('hover');
                            try{$common.page.addCartComplete(data,el);}catch(e){};
                            $common.dev.setPopComplete("addCart",function(){});
                         },
                        error:function(){}
                    });
                }
            }
        };
		/*******************account************************/
		$common.account={
		    //初始高亮
		    menuLight:function(){
		        var key=this.getWrapper();
		        if(!key)return false;
		        $(".leftAside a").each(function(index) {
				  if(key==$(this).attr("data-account-cur"))$(this).addClass('cur');
				});
		    },
		    getWrapper:function(){
		        var key="";
		        $(".wrapper").each(function(){
		            if($(this).attr("data-account-cur")){
		                key=$(this).attr("data-account-cur");
		            }
		        });
		        return key;
		    },
		    //左边菜单收缩
			toggleSlide:function(el){
				if($(el).hasClass("collapsed")){
					$(el).removeClass("collapsed");
					$(el).parent().children(".lngContent").slideDown(400);
				}else{
					$(el).addClass("collapsed");
					$(el).parent().children(".lngContent").slideUp(400);
				}
			}
		};
		/*注册事件*/   
		$common.registered={
			quitPage:function(content){
				var $conrtent=content||"body";
				$($conrtent).find("a").bind("click",function(){
				    if($(this).hasClass("continue")){$(".popup.closePage").hide();return;}
				    $(".popup.closePage .continue").attr("href",$(this).attr("href"));
				    $(".popup.closePage").show();
				    return false;
				});
			}	
		};
		/*******************help box hover***************************/
		$common.helpTitHover={
			titleHover:function(){
				$(".categoryHover,.helpImgBox").hover(function(){
					$(this).find(".seeMoreLink").animate({"height":"72px","margin-top":"-72px"}).find("a").animate({"height":"23px"}).parent().siblings(".helpImgTit").animate({"height":"72px"});
				},function(){
					$(this).find(".seeMoreLink").animate({"height":"46px","margin-top":"-46px"}).find("a").animate({"height":"0"}).parent().siblings(".helpImgTit").animate({"height":"46px"});
				}).stop();
			}
		};
		/*******************header and footer************************/
		$common.headerAddFooter={
		    event:function(){
		       //account
		       $(".headAccount").hover(function(){$(this).addClass("hover");$common.headerAddFooter.account($(this));},function(){$(this).removeClass("hover");$(this).find(".headeNavCont").hide();});
		       //footer
		       $(".footWWNav").hover(function(){$common.headerAddFooter.footWWHover($(this),"over");},function(){$common.headerAddFooter.footWWHover($(this),"out");});
		      //header
		      $(".headeNavOut").hover(function(){$common.headerAddFooter.navHover($(this),"over");},function(){$common.headerAddFooter.navHover($(this),"out");});
		    },
		    loadUser:function(){
		        $common.dev.getPopUrlUser(function (popurl){
                     new $.popup.show({url:popurl,
                        complete:function(data){
                            $(".headerBox .headAccount").append(data);
                            try{$(".headAccount .radioBionic").radio({label:true,bionic:true,currentCallback:function(obj){},callback:function(obj,checked,allchecked){}});}catch(e){};
                            $common.dev.setPopComplete("headAccount",function(){});
                         }
                    });
                });
		    },
		    account:function(el){
		        if(el.find(".headeNavCont").size()>0){
		            el.find(".headeNavCont").show();
		        }
		    },
			navHover:function(el,stauts){
			    if(stauts=="over"){
			        if(el.find(".headeNavCont").size()>0)el.addClass("hover").find(".headeNavCont").show();
			    }else{
			        if(el.find(".headeNavCont").size()>0)el.removeClass("hover").find(".headeNavCont").hide();
			    }
			},
			footWWHover:function(el,stauts){
			    if(stauts=="over"){
			        el.find(".footWWPop").show();
			    }else{
			        el.find(".footWWPop").hide();
			    }
			}
		};
		/****************************header search***************************************/
		$common.searchHead={
		    event:function(){
		        $(".searchinput_redesign input").click(function(){$common.searchHead.areaShow($(this));});
				$(".searchinput_redesign input").blur(function(){$common.searchHead.areaHide2($(this));});
		        $(".searchinput_redesign .close").click(function(){$common.searchHead.areaHide($(this));});
		    },
			scrollTextStartFun:function(_str){
				var _scrollWrapperWidth=$(".newTopDesign .selfservice_bgNav .scrollText").width();
				$(".newTopDesign .selfservice_bgNav .scrollText p").html(_str);
				$(".newTopDesign .selfservice_bgNav .scrollText p").css({"left":_scrollWrapperWidth+"px"});
				var _scrollTextContentWidth=$(".newTopDesign .selfservice_bgNav .scrollText p").width();
				var _runTotal=_scrollWrapperWidth+_scrollTextContentWidth;
				var _speed=Math.ceil(_runTotal/80)*1000;
				$(".newTopDesign .selfservice_bgNav .scrollText p").animate({"left":-_scrollTextContentWidth+"px"},_speed,"linear",function(){
					$common.searchHead.scrollTextStartFun();
				});
			},
		    areaShow:function(el){
				if(!$(".searchinput_redesignWrapper").hasClass("open")){
					//el.addClass("hover").parent().siblings().show();
				   $(".column.unilty.fr").css({"width":247});
				   $(".searchinput_redesign").animate({"width":237},200);
				   $(".searchinput_redesign .close").show();
				   $(".searchinput_redesignWrapper").addClass("open");
				};
		    },
		    areaHide:function(el){
				if($(".searchinput_redesignWrapper").hasClass("open")){
					$(".searchinput_redesignWrapper input").val("");
					//el.parents(".headSeachArea").hide().siblings().find(".headSearchBtn").removeClass("hover");
					$(".column.unilty.fr").css({"width":200});
					$(".searchinput_redesign").animate({"width":140},200);
					$(".searchinput_redesign .close").hide();
					$(".searchinput_redesignWrapper").removeClass("open");
					$(".headSeachList").hide();
				}
		    },
			areaHide2:function(el){
				if($(".searchinput_redesignWrapper").hasClass("open")){
					$(".searchinput_redesignWrapper input").val("");
					//el.parents(".headSeachArea").hide().siblings().find(".headSearchBtn").removeClass("hover");
					$(".column.unilty.fr").css({"width":200});
					$(".searchinput_redesign").animate({"width":140},200);
					$(".searchinput_redesign .close").hide();
					$(".searchinput_redesignWrapper").removeClass("open");
					//$(".headSeachList").hide();
				}
		    }
		};  
		/****************************kv 信息居中***************************************/
		$common.kvInfoVert={
			event:function(){
				$(".kvInfo").each(function() {
				     var height=$(this).parents(".hpKv").length>0?750-250:380;
					$(this).css({"top":(height-$(this).height())/2});
                });
		    }
		};
		/****************************倒计时*******************************************/
		$common.countDown=function(data,obj,status){
		    try{$common.page.countDown(data,obj,status);}catch(e){};
		    $common.dev.setCountDown(data,obj,status);
		};
		/****************************获取url信息***************************************/
		$common.getUrlParam=function(name){
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
            if (r!=null) return unescape(r[2]); return null; //返回参数值
        };
		/**************************************loading**************************/
	    $common.loading={
	        show:function(dom,mask,test){
	            new $.loading().show({dom:dom,mask:mask});
	            if(test){setTimeout(function(){$common.loading.hide();},1000);}
	        },
	        hide:function(){new $.loading().hide();}
	    };      
        /**************************************开发**************************/
        $common.dev={
			scrollTextCall:function(){
				try{return scrollTextCall();}catch(e){
					var _str="STARTscrollscrollscrollscrollscrollscrollscrollscrollscrollscrollscrollscrollscrollscrollscrollscrollscrollscrollscrollscrollscrollscrollscrollscrollEND";
					$common.searchHead.scrollTextStartFun(_str);
				};
			},
            //根据key值返回对应弹层的url地址（string类型），key和返回值对应数据可参考catch里面信息
            getPopUrl:function(key){
                try{return getPopUrl(key);}catch(e){
                    //mini购物车
                    if(key=="miniShoppingcar")return "component/popup_minishoppingcar.html";
                    //mini购物车
                    if(key=="addCart")return "release_two/component/popup_addcart_succes.html";
					//邮件弹层
					if(key=="popEmai")return "component/popup_email.html";
					//注册成功弹层
					if(key=="registerSuccess")return "component/popup_register_success.html";
                 };
            },
            //弹层请求完成， 告诉开发添加数据等
            setPopComplete:function(key,callback){
                try{setPopComplete(key,callback);}catch(e){callback(key);}
            },
            //根据key值返回对应ajax请求的url地址（object类型，包含有url，type，及后端需要的字段），key和返回值对应数据可参考catch里面信息
            getAjaxUrl:function(key){
                try{return getAjaxUrl(key);}catch(e){
                    if(key=="search")return {url:"js/data/search.txt",type:"GET",data:{}};
                    if(key =='miniShoppingcar')return {url:"js/data/minicar.txt",type:"GET",data:{}};
                 };
            },
            //slider 产品列表页面价格选择
            setSlider:function(minNum,maxNum){try{setSlider(minNum,maxNum);}catch(e){console.log(minNum,maxNum);}},
             //加入购物车功能完成后需要回掉一下，告诉前端
            getAddCart:function(el,callback){
                try{setAddCart(el,callback);}catch(e){
					var _obj={
							itemscount:"2",
							total:"￥200",
							discount:"-50",
							totalpaid:"￥150",
							cart_link:"http://localhost/adidas/checkout/cart/",
							checkout_link:"http://localhost/adidas/yancheckout/process/",
						    code:1,
						    link:"#",
						    img: "images/product/product_01.jpg",
						    colors: "1 colors",
					        size:"42",
    						qty:"2",
						    name: "adidas 阿迪达斯 篮球 男子 场下篮球鞋 JPN55",
						    price: "¥ 1,399",
							originalPrice: "¥ 1,599"
						}
					setTimeout(function(){callback({result:"success",obj:_obj});},1000);
				};
            },
            //请求header用户弹层， 因为开发需要ajax去获取登录状态，故返回的url是异步操作的。
            getPopUrlUser:function(callback){
                try{getPopUrlUser(callback);}catch(e){
                    callback(Math.floor(Math.random()*1000)%2==0?"component/popup_user_notlogin.html":"component/popup_user_login.html");
                };
            },
            //倒计时接口
            setCountDown:function(data,obj,status){
                try{return setCountDown(data,obj,status);}catch(e){};
            }
        };
        /*************************************加载外部html**********************/
        $common.loadHtml={
            setup:function(callback){
                this.callback=callback||null;
                this.total=$("[data-htmlfile]").size();
                if(this.total==0){if(callback)callback();return;}
                this.count=0;
                this.run();
            },
            run:function(){
                $("[data-htmlfile]").each(function(index, element) {
                    $common.loadHtml.load($(this),$(this).attr("data-htmlfile"),function(){
                           $common.loadHtml.count++;
                           if($common.loadHtml.count==$common.loadHtml.total){if($common.loadHtml.callback)$common.loadHtml.callback();};
                     });
                });
            },
            load:function(el,url,callback){
                $.ajax({url:url+"?r="+Math.random()*10000,data:null,type:"GET",dataType:"html",success:function(data){el.replaceWith(data);if(callback)callback();},error:function(){if(callback)callback();}});
            }
        };
        return $common;
    };
})(jQuery);
var $common=null;
jQuery(function(){$common=new jQuery.common();$common.methods.init();});
