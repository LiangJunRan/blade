function sayHello(person) {
    return 'Hello, ' + person;
}
var user = 'Bee';
var isDone = false;
var a = false;
console.log(sayHello(user), isDone, a);
var myName = 'lvyang';
var myAge = 26;
var sentence = "Hello, my name is " + myName + ".\nI'll be " + (myAge + 1) + " years old next mouth.";
console.log(sentence);
var kong = undefined;
var tom = {
    id: 1,
    name: 'Tom',
    age: 25 /*,signaturesignaturesignature
    gender: 'male'*/
};
var xiaoming = {
    id: 1,
    name: '小明'
};
var robot = {
    id: 1,
    name: '罗伯特',
    type: 'manMade',
    type2: 'newType'
};
// robot.id = 2;
console.log(robot);
var p = {
    x: 1,
    y: 2
};
// p.x = 1;
var na = [1, 2, 3, 4, 5];
var fibonacci = [1, 2, 3, 4, 5];
var sa = ['a', 'b'];
// 类数组(Array-like Object)
function sum() {
    var args = arguments;
}
var mySum = function (x, y) {
    if (x === void 0) { x = 1; }
    if (y === void 0) { y = 2; }
    return x + y;
};
var mysum = function (x, y) {
    return x + y;
};
var mySearch;
mySearch = function (source, subString) {
    return source.search(subString) !== 1;
};
function push(array) {
    var items = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        items[_i - 1] = arguments[_i];
    }
    items.forEach(function (item) {
        array.push(item);
    });
}
function reverse(x) {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    }
    else {
        return x.split('').reverse().join('');
    }
}
var r1 = reverse(123);
var r2 = reverse('abc');
console.log(r1 + ": " + typeof r1);
console.log(r2 + ": " + typeof r2);
// 类型断言，可以指定一个值的类型
// <类型>值
//	or
// 值 as 类型
// tsx语法中必须用后一种
// let nb: number = ('123' as number);		// 错误：断言是在获取前访问值的方法用的，不是转换
function getLength(something) {
    if (something.length) {
        return something.length;
    }
    else {
        return something.toString().length;
    }
}
console.log("getLength: " + getLength(''));
console.log("getLength: " + getLength('123'));
console.log("getLength: " + getLength(123));
// 报error TS2304: Cannot find name 'Iterable'.错误，修改tsconfig中的编译选项
//		target: es6 亲测好用
// var $node = $('<div></div>');
var tta = 1;
var ttb = 'test';
console.log("tta: " + tta + ", ttb: " + ttb);
//# sourceMappingURL=hello.js.map