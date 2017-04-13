// note.txt
// ga('send', 'event', 'cart', 'add','product', 1399);


// $.each({a: 'aaaaaa'}, function(k) {
	// console.log('>>>', this, typeof(this), '|',this.__proto__.constructor.name);
// })


// show cookies
function getCookies() {
	var cookies = document.cookie.split(";")
	var dict_cookies = {};
	for(var i = 0; i < cookies.length; i ++) {
		var _k, _v;
		_k = cookies[i].split('=')[0].trim();
		_v = cookies[i].split('=')[1];
		if (dict_cookies[_k] === undefined) {
			dict_cookies[_k] = [_v];
		} else {
			dict_cookies[_k].push(_v);
		}
	}
	$.each(dict_cookies, function(k){
		if (this.length == 1) {
			dict_cookies[k] = this[0];
		}
	})
	// console.log('>>>', dict_cookies);
	return dict_cookies;
}

function compareArray(arr1, arr2) {
	if (typeof(arr1) != 'object' || typeof(arr2) != 'object') {
		console.error('arr1, arr2 may not be ARRAY');
		return false;
	}
	if (arr1.length != arr2.length) {
		console.info('arr1.length != arr2.length', arr1.length, arr2.length);
		return false;
	}
	for (var i = 0; i < arr1.length; i++) {
		if (arr1[i] != arr2[i]) {
			console.info('arr1[' + i + '] != arr2[' + i + ']', arr1[i], arr2[i]);
			return false;
		}
	}
	return true;
}

function getObjectDiff(old_obj, new_obj) {
	var diff = new Object;
	$.each(old_obj, function(k) {
		var v = this;
		var v_type = v.__proto__.constructor.name.toLowerCase();
		if (v_type == 'string') {
			// console.log('STRING COMPARE isSame =', (new_obj[k] === String(v)));
			if (new_obj[k] !== String(v)) {
				diff[k] = [String(v), new_obj[k]];
			}
		} else if (v_type == 'object') {
			// console.log('object COMPARE ...');
			var _diff = getObjectDiff(v, new_obj[k]);
			// console.log('_diff', _diff.length, _diff);
			if (_diff.length != 0) {
				diff[k] = [v, new_obj[k]];
			}
		} else if (v_type == 'array') {
			// console.log('ARRAY COMPARE isSame =', (compareArray(v, new_obj[k])));
			// console.log(v, v.length, new_obj[k], new_obj[k].length);
			if (!compareArray(v, new_obj[k])) {
				diff[k] = [Array(v), new_obj[k]];
			}
		} else {
			// console.log('TYPE:', v_type);
		}
		delete new_obj[k];
	});
	// console.log('DIFF 1', diff.length, diff);
	$.each(new_obj, function(k) {
		var v = this;
		diff[k] = [undefined, v];
	});
	// console.log('DIFF 2', diff.length, diff);
	return diff;
}

var old_cks = getCookies();
var afHandler;

function stop_watch() {
	cancelAnimationFrame(afHandler);
}

function start_watch() {
	var cks = getCookies();
	// console.log('------------------');
	// console.log(old_cks, cks);
	// console.log('------------------');
	var diff = getObjectDiff(old_cks, cks);
	old_cks = getCookies();
	$.each(diff, function(k) {
		// console.log('KEY:', k);
		// console.log('   ', '' + this[0], '->', '' + this[1]);
	});
	// console.log('==================');
	console.log('DIFF >>>', JSON.stringify(diff));
	afHandler = requestAnimationFrame(start_watch);
}
start_watch();
