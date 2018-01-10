var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope, MathService, myService) {
	$scope.name = "aaa";

	console.log('myCtrl MathService', MathService);
	console.log('myCtrl MathService.value', MathService.value);
	console.log('myCtrl myService.value', myService.value);
});


// 注册对象(对象名，对象详情)
app.factory('MathService', function(){
	console.log('in MathService');
	var result = {};
	result.value = 'MathService.value=' + (new Date).valueOf();

	result.multiply = function(a, b) {
		return a * b;
	}

	return result;
});


app.factory('MathService2', function(){
	var result = {};

	result.multiply2 = function(a, b) {
		return a * b;
	}

	return result;
});


app.service('myService', function() {
	console.log('in myService', this);
	this.value = 'myService.value=' + (new Date).valueOf();
});


// 按名字取到注入的对象
app.directive('helloWorld', function(MathService2, MathService, myService) {
	console.log('helloWorld MathService', MathService);
	console.log('helloWorld MathService2', MathService2);
	console.log('helloWorld MathService.value', MathService.value);
	console.log('helloWorld myService.value', myService.value);

	MathService.value = 'aaa';
	myService.value = 'aaa';

	return {
		scope: {},	// 独立作用域
		restrict: "EA",
		// ["E", "A", "C", "M"]
		/*
			E for 元素
			A for 属性
			C for 类名
			M for 注释
		*/
		template: "<div class=\"ex\">name: <input type=\"text\" ng-model=\"name\" /><h4>HELLO-WORLD \"{{name}}\"</h4></div>"
	};
});

