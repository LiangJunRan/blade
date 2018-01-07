

function sayHello(person: string) {
	return 'Hello, ' + person;
}

let user = 'Bee';
let isDone: boolean = false;
let a: boolean = false;

console.log(sayHello(user), isDone, a);



let myName =  'lvyang';
let myAge = 26;
let sentence: string = `Hello, my name is ${myName}.
I'll be ${myAge + 1} years old next mouth.`;

console.log(sentence);


let kong: void = undefined;



interface Person {
	// 只读属性
	readonly id: number;
	// 必填属性
	name: string;
	// 可选属性
	age?: number;
	// 任意属性
	[propName: string]: any;
}

let tom: Person = {
	id: 1,
	name: 'Tom',
	age: 25/*,signaturesignaturesignature
	gender: 'male'*/
};
let xiaoming: Person = {
	id: 1,
	name: '小明'
};
let robot: Person = {
	id: 1,
	name: '罗伯特',
	type: 'manMade',
	type2: 'newType'
};
// robot.id = 2;

console.log(robot);



interface Point {
	readonly x: number;
	readonly y: number;
}
let p: Point = {
	x: 1,
	y: 2
};
// p.x = 1;


let na: number[] = [1, 2, 3, 4, 5];

let fibonacci: Array<number> = [1, 2, 3, 4, 5];

interface stringArray {
	[index: number]: string;
}
let sa: stringArray = ['a', 'b'];

// 类数组(Array-like Object)
function sum() {
	let args: IArguments = arguments;
}

let mySum = function(x: number = 1, y: number = 2): number {
	return x + y;
}
let mysum: (x: number, y: number) => number = function(x: number, y: number): number {
	return x + y;
}
// TypeScript的类型定义中，=>用来表示函数的定义，左边是输入类型，要用括号括起来，右边是输出类型
// ES6中，=>叫做箭头函数，应用广泛



interface SearchFunc {
	(source: string, subString: string): boolean;
}
let mySearch: SearchFunc;
mySearch = function(source: string, subString: string): boolean {
	return source.search(subString) !== 1;
}



function push(array: any[], ...items: any[]) {
	items.forEach(function(item) {
		array.push(item);
	});
}


// 函数定义有包含关系，需要将精确定义先写在前边
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
	if (typeof x === 'number') {
		return Number(x.toString().split('').reverse().join(''));
	} else {
		return x.split('').reverse().join('');
	}
}

let r1: number = reverse(123);
let r2: string = reverse('abc');

console.log(`${r1}: ${typeof r1}`);
console.log(`${r2}: ${typeof r2}`);



// 类型断言，可以指定一个值的类型

// <类型>值
//	or
// 值 as 类型

// tsx语法中必须用后一种

// let nb: number = ('123' as number);		// 错误：断言是在获取前访问值的方法用的，不是转换

function getLength(something: string | number): number {
	if ((<string>something).length) {
		return (<string>something).length;
	} else {
		return something.toString().length;
	}
}

console.log(`getLength: ${getLength('')}`);
console.log(`getLength: ${getLength('123')}`);
console.log(`getLength: ${getLength(123)}`);


// 报error TS2304: Cannot find name 'Iterable'.错误，修改tsconfig中的编译选项
//		target: es6 亲测好用
// var $node = $('<div></div>');


// target: es6 是编译成什么规范的代码，有区别，举个例子
/*
	let str = `a: ${a}
	b: ${b};`

	在不配置编译成es6的时候，编译生成的代码如下:
	var str = "a: " + a + "\nb: " + b + ";";

	在配置成es6语法时，生成代码如下：
	let str = `a: ${a}
	b: ${b};`
*/





let tta: number = 1;
var ttb: string = 'test';
console.log(`tta: ${tta}, ttb: ${ttb}`);

