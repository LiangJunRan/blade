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
function customizedHistoryBack() {
	mainView.history.pop()
	var backUrl = mainView.history.pop();
	if (backUrl) {
		backUrl = backUrl.substring(1);
		mainView.router.load({pageName: backUrl, animatePages: true});
	} else {
		window.location = '/exit-web-view';
	}
}


// 给加号添加popover
$('.addon').on('click', function(e) {
	var clickedLink = this;
	var popoverHTML = 
			'<div class="popover addon-popover">' +
				'<div class="popover-inner">' +
					'<div class="icons-container">' +
						'<a class="addon-text" href="javascript:void(0);"><i class="f7-icons size-smallest">compose</i></a>' +
						'<a href="javascript:void(0);"><i class="f7-icons size-smallest">camera</i></a>' +
						'<a href="javascript:void(0);"><i class="f7-icons size-smallest">mic</i></a>' +
						'<a href="javascript:void(0);"><i class="f7-icons size-smallest">time</i></a>' +
					'</div>' +
				'</div>' +
			'</div>';
	myApp.popover(popoverHTML, clickedLink);
});
$('body').on('click', '.addon-text', function(e) {
	console.log('clicked');
	var popupHTML =
			'<div class="navbar">' +
				'<div class="navbar-inner" data-page="dynamic-page">' +
					'<div class="left">' +
						'<a href="#" class="link icon-only exit-web-view">' +
							'取消' +
						'</a>' +
					'</div>' +
					'<div class="center sliding lessonTitle">作业布置</div>' +
					'<div class="right">' +
						'<a href="#" class="link icon-only open-panel">' +
							'完成' +
						'</a>' +
					'</div>' +
				'</div>' +
			'</div>' +
			'<div class="page" data-page="dynamic-page">' +
				'<div class="page-content">' +
					'<p>Here comes new page</p>' +
				'</div>' +
			'</div>';
	mainView.router.load({
		content: popupHTML,
		animatePages: true
	});

	myApp.closeModal();

	initPageBindEvent();
});	


$(document).on('page:afteranimation', function(e) {
	console.log('page:afteranimation');
	var page = e.detail.page;
	console.log('page:', page);
	if (page.name == 'testForm' && page.fromPage.name == 'dynamic-page') {
		$('[data-page=dynamic-page]').remove();
	}
})


// 自制播放器-播放/暂停事件绑定
$('.audio-player i.ppBtn').on('click', function(e) {
	var $audio = $(e.target).closest('.audio-player').find('audio');
	var $this = $(e.target);
	if ($this.html() == 'play_round') {
		$audio[0].play();
		$this.html('pause_round');
	} else {
		$audio[0].pause();
		$this.html('play_round');
	}
});
// 自制播放器-播放进度条-开始拖拽
$('.audio-player .progress-bar, .audio-player .decorate, .audio-player .time').on('touchstart', function(e) {
	var $processBar = $(e.target).closest('.audio-player').find('.progress-bar');
	var $playedPart = $processBar.find('.played-part');
	var $audio = $(e.target).closest('.audio-player').find('audio');
	var $time = $(e.target).closest('.audio-player').find('.time');
	var leftX = $processBar.offset().left + $processBar.parent().offset().left + 16;
	var barWidth = $processBar.width();
	var per = 0;
	// 去掉更新进度条的事件绑定
	$audio.off('timeupdate');
	$(document).on('touchmove', function(e) {
		per = (((e.touches[0].clientX - leftX) / barWidth) * 100).toFixed(2);
		if (per < 0) {
			per = 0;
		} else if (per > 100) {
			per = 100;
		}
		// 更新已播放的进度条长度
		$playedPart.css('width', per + '%');
		// 更新剩余时间
		var leftSeconds = parseInt($audio[0].duration * (1 - per / 100));
		$time.html(__formatTime(leftSeconds));
	});
});
// 自制播放器-播放进度条-释放
$('.audio-player .progress-bar, .audio-player .decorate, .audio-player .time').on('touchend', function(e) {
	console.log('touch-end');
	$(document).off('touchmove');
	var $processBar = $(e.target).closest('.audio-player').find('.progress-bar');
	var $playedPart = $processBar.find('.played-part');
	var $ppBtn = $(e.target).closest('.audio-player').find('.ppBtn');
	var endPer = ($playedPart.width() / $processBar.width() * 100).toFixed(2);
	// console.log('end at', endPer + '%');
	// 跳转到指定位置播放
	var $audio = $(e.target).closest('.audio-player').find('audio');
	$audio[0].currentTime = $audio[0].duration * 0.01 * endPer;
	// 绑定更新事件
	$audio.on('timeupdate', __audioTimeUpdateCallback);
	// TODO: 解决click和touchend多重触发问题
	$audio[0].play();
	$ppBtn.html('pause_round');
});
// 自制播放器-更新进度条和剩余时间
$('.audio-player audio').on('timeupdate', __audioTimeUpdateCallback);
// 更新时间的回调
function __audioTimeUpdateCallback(e) {
	var $this = $(e.target);
	var scales = $this[0].currentTime / $this[0].duration;
	var leftSeconds = parseInt($this[0].duration - $this[0].currentTime);
	var persentNum = (scales * 100).toFixed(2);
	var $bar = $this.parent().find('.played-part');
	var $time = $this.parent().find('.time');
	
	// 更新已播放的进度条长度
	$bar.css('width',  persentNum + '%');
	// 更新剩余时间
	$time.html(__formatTime(leftSeconds));
}
// 秒数转“分:秒”
function __formatTime(second) {
	return [/*parseInt(second / 60 / 60), */parseInt(second / 60 % 60), parseInt(second % 60)].join(":")
		.replace(/\b(\d)\b/g, "0$1");
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

function initPageBindEvent() {
	// 退出webView的方法
	$$('.exit-web-view').on('click', customizedHistoryBack);

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
}

initPageBindEvent();