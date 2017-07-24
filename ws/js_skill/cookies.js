function getCookie(name) {
	var arr,reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if(arr = document.cookie.match(reg))
		return unescape(arr[2]);
	else
		return null;
}

function getAllCookies() {
	var all = {};
	var _cookies = document.cookie.split('; ');
	for(var i = 0; i < _cookies.length; i ++) {
		var _cookie = _cookies[i];
		var _markIndex = _cookie.indexOf('=');
		var _key = _cookie.substring(0, _markIndex);
		var _value = _cookie.substring(_markIndex + 1);
		if(all[_key]) {
			all[_key].push(_value);
		} else {
			all[_key] = [_value];
		}
	}
	return all;
}

function clearAll() {
	var all = getAllCookies();
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);

	for (var _key in all) {
		var _values = all[_key];
		for (var idx = 0; idx < _values.length; idx ++) {
			document.cookie = _key + "=" + _values[idx] + ";path=/;expires=" + exp.toGMTString();
		}
	}
}\



function clearCookie(domain, path){
	domain = domain || document.domain;
	path = path || '/'; 
	var keys=document.cookie.match(/[^ =;]+(?=\=)/g); 
	if (keys) { 
		for (var i = keys.length; i--;) {
			document.cookie=keys[i]+'=0; expires=' + new Date( 0).toUTCString() + '; domain=' + domain + '; path=' + path + ';';
		}
	}
}