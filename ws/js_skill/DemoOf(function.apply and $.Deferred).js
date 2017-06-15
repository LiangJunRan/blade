var a = $.Deferred();
var b = $.Deferred();

setTimeout(function(){
	a.resolve();
}, 5000);

setTimeout(function(){
	b.resolve();
}, 7000);

var l = [a, b];

$.when(a).done(function(){
	console.log('a DONE');
});

$.when(b).done(function(){
	console.log('b DONE');
});

function whenDone(lst){
	$.when.apply(this, lst).done(function(){
		console.log('ALL DONE');
	});
}

whenDone(l);
