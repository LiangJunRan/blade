// url to be loaded
var url = '//www.baidu.com';

// windowName
var target = 'littleMing';

// [Optional] 以逗号分隔，key=value形式组成的配置参数list，不能含有空格
var features = {
	left: 			window.screen.availLeft,
	top: 			window.screen.availTop,
	outerWidth: 	window.screen.availWidth,
	outerHeight: 	window.screen.availHeight,

	menubar: 		'no',
	toolbar: 		'no',
	location: 		'no',
	status: 		'no',
	resizable: 		'no'
};
var arrFeatures = [];
for (let key in features) {
	arrFeatures.push(key + '=' + features[key]);
}
var strFeatures = arrFeatures.join(',');

console.log('window.open("' + url + '", "' + target + '", "' + strFeatures + '")');
window.open(url, target, strFeatures);