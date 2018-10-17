
// 各种浏览器兼容
var hidden, state, visibilityChange; 
if (typeof document.hidden !== "undefined") {
	hidden = "hidden";
	visibilityChange = "visibilitychange";
	state = "visibilityState";
} else if (typeof document.mozHidden !== "undefined") {
	hidden = "mozHidden";
	visibilityChange = "mozvisibilitychange";
	state = "mozVisibilityState";
} else if (typeof document.msHidden !== "undefined") {
	hidden = "msHidden";
	visibilityChange = "msvisibilitychange";
	state = "msVisibilityState";
} else if (typeof document.webkitHidden !== "undefined") {
	hidden = "webkitHidden";
	visibilityChange = "webkitvisibilitychange";
	state = "webkitVisibilityState";
}
 
// 添加监听器，在title里显示状态变化
document.addEventListener(visibilityChange, function() {
	document.title = document[state];
}, false);
 
// 初始化
document.title = document[state];






//失去焦点后调用的函数
function c() {
	window.close();
}

//为窗口注册失去焦点事件
// window.onblur = c;


//当关闭窗口时提示是否提交考试
window.onbeforeunload = function() {
	return "当前数据还没有保存，关闭、刷新或切换窗口会自动完成考试，是否继续?";
}

//窗口关闭后给出提示
window.onunload = function() {
	alert("已成功提交考试！");
}

//屏蔽鼠标右键
document.oncontextmenu = function () {
	event.returnValue = false;
}

//屏蔽F1帮助
window.onhelp = function () {
	return false;
}

//屏蔽其他功能键
document.onkeydown = function () {
	var k = window.event.keyCode;
	if (k == 116) {	//屏蔽 F5 刷新键
		window.event.keyCode = 0;
		window.event.returnValue = false;
	}

	// 屏蔽Ctrl + R
	if (window.event.ctrlKey && k == 82) {
		window.event.returnValue= false;
	}
	// 屏蔽Ctrl + N	
	if (window.event.ctrlKey && k == 78) {
		 window.event.returnValue = false;
	}
	// 屏蔽Ctrl + W
	if (window.event.ctrlKey && k == 87) {
		window.event.returnValue = false;
	}
	// 屏蔽 Shift + F10
	if (event.shiftKey && k == 121) {
		window.event.returnValue = false;
	}
	// 屏蔽在<a>标签上按住Shift + 鼠标左键，在新标签页打开
	if (window.event.srcElement.tagName == "A" && window.event.shiftKey) {
		window.event.returnValue = false;
	}
	// 屏蔽Alt + F4
	if (window.event.altKey && k == 115) {
		// TODO
		// window.showModelessDialog("about:blank", "", "dialogWidth:1px;dialogheight:1px");
		alert('Alt + F4');
		return false;
	}
	// 屏蔽Alt + 方向键
	if (window.event.altKey && (
		// 方向键←
		k == 37 ||
		// 方向键→
		k == 39
	)) {
		alert("不准你使用ALT+方向键前进或后退网页！");
		event.returnValue=false;
	}

	// 尝试监听Ctrl + Alt
	if (window.event.ctrlKey && window.event.altKey) {
		alert('Ctrl + Alt !!!');
	}

	// 尝试监听Alt + Tab
	if (/*window.event.altKey &&*/ window.event.keyCode == 9) {
		alert('Alt + Tab !!!');
	}
}
