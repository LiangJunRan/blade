function func<T>(arg: T): T {
	return arg;
}

let output: any;
output = func('1');
output = func(1);

console.log(output);
