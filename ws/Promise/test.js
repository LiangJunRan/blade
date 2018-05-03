console.log('...', 0);
function test(resolve, reject) {
	setTimeout(function() {
		resolve('aaa');
	}, 2000);
}
var s = 1;
var tt = setInterval(function() {
	console.log('...', s);
	s++;
}, 1000, 0);
setTimeout(function() {
	clearInterval(tt);
}, 7000);

console.log('a1');

var p1 = new Promise(test);

console.log('a2');

setTimeout(function() {

	console.log('b1');

	var p2 = p1.then(function(result) {
		console.log('r:', result);
	});

	console.log('b2');

}, 5000);

console.log('c1');

var p1 = new Promise(test);

console.log('c2');

var p2 = p1.then(function(result) {
	console.log('r:', result);
});

console.log('c2');


// 多参数
(new Promise(function(resolve, reject) {
	setTimeout(function() {
		resolve(["a", "b"]); 
	}, 2000);
})).then(function(a, b) {
	console.log(a, b);
});