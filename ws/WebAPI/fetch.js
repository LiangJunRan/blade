// 基本（有缓存）
fetch('a.json')
	.then(r => {
		return r.json();
	})
	.then(myJson => {
		var ed = (new Date()).valueOf();
		console.log(myJson);
	});


// 高级玩儿法，使用配置项，不带缓存
var postData = (url, data) => {
	return fetch(url, {
		body: JSON.stringify(data),
		cache: 'no-cache',			// [*default, no-cache, reload, force-cache, only-if-cached]
		credentials: 'same-origin',	// [include, same-origin, *omit]
		// 指定请求的header
		header: {
			'user-agent': 'Mozilla/4.0 MDN Example',
			'content-type': 'application/json'
		},
		method: 'POST',				// [*GET, POST, PUT, DELETE, etc.]
		mode: 'cors',				// [no-cors, cors, *same-origin]
		redirect: 'follow',			// [*manual, follow, error]
		referrer: 'no-referrer',	// [*client, no-referrer]
	})
	.then(response => response.json());
}
postData('a.json', {'heihei': '哈哈'})
	.then(data => console.log(data))
	.catch(error => console.error(error));


var getData = (url) => {
	return fetch(url, {
		cache: 'no-cache'
	})
	.then(response => response.json());
}
getData('a.json')
	.then(data => console.log(data));