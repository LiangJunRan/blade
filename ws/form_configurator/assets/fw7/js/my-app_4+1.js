var device = Framework7.prototype.device;

// Initialize your app
var myApp = new Framework7();

// Export selectors engine
var $$ = Dom7;
var $ = $$;

//change skin
if (device.android) {
	console.log('This is android');
	$$('.ios-css').remove();
} else {
	console.log('This is NOT android');
	$$('.android-css').remove();
}

// Add view
var mainView = myApp.addView('.view-main', {
	// Because we use fixed-through navbar we can enable dynamic navbar
	dynamicNavbar: true,
	domCache: true,	  //enable inline pages
	// swipePanel: 'left',
	animatePages: false
});

// 给安卓机械后退按键使用的方法
function androidBackBtn() {
	mainView.history.pop()
	var backUrl = mainView.history.pop();
	if (backUrl) {
		backUrl = backUrl.substring(1);
		mainView.router.load({pageName: backUrl});
	} else {
		window.location = '/exit-web-view';
	}
}

// 扩展array类型原生方法，添加obj如果是array，就让其元素合并，否则直接加入
Array.prototype.add = function(obj) {
	var arrList = this;
	if ($.isArray(obj)) {
		$.each(obj, function(_idx) {
			arrList.push(obj[_idx]);
		});
	} else {
		arrList.push(obj);
	}
}

function GetQueryString(name) {
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return r[2]; return null;
}

// 退出webView的方法
$$('.exit-web-view').on('click', function(){
	window.location = '/exit-web-view';
});

// 微信分享方法
$$('.share-btn').on('click', function(){
	var data = {
		link: location.pathname + location.search + '&isShared=1',
		teacherName: $$('.teacherName').html(),
		lessonNo: $$('.lessonNo').html(),
		lessonTitle: $$('.lessonTitle').html()
	};
	var urlParam = $$.param(data);
	var url = "/share-url?" + urlParam;
	
	window.location = url;
});
