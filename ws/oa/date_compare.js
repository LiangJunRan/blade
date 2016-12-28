Date.prototype.format = function(format) {
	var o = {
		"M+": this.getMonth() + 1, //month
		"d+": this.getDate(), //day
		"h+": this.getHours(), //hour
		"m+": this.getMinutes(), //minute
		"s+": this.getSeconds(), //second
		"q+": Math.floor((this.getMonth() + 3) / 3), //quarter
		"S": this.getMilliseconds() //millisecond
	}

	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}

	for (var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
}

function getMaxDate(dateList) {
	var d = new Date(Math.max.apply(null, dateList));
	return d.format('yyyy-MM-dd');
}

function getMinDate(dateList) {
	var d = new Date(Math.min.apply(null, dateList));
	return d.format('yyyy-MM-dd');
}

// test
/*var dateList = [new Date('1900-01-01'), new Date('2008-09-20'), new Date('2007-12-12')];
console.log('最大值', getMaxDate(dateList));
console.log('最小值', getMinDate(dateList));*/
