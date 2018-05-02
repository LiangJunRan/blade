// 缓存版本号
var CACHE_NAME = "demo-cache";
var CACHE_VERSION = "38";
var CACHE_VERSION_SHOW = "|" + CACHE_VERSION + "|";
var CACHE = CACHE_NAME + "-v" + CACHE_VERSION;

// 缓存文件列表
var urlsToCache = [
	"/demo_update.html",
	"/media/icon1.png"/*,
	"/media/rainymood.m4a",
	"/media/docker.mp4"*/
];

Date.prototype.Format = function (fmt) { // author: meizz
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
}
function gdt() {
	return (new Date()).Format("[dd HH:mm:ss]"); 
}


// 监听安装
self.addEventListener("install", function(event) {
	console.log('INSTALL', CACHE_VERSION_SHOW, gdt());
	// Perform install steps
	event.waitUntil(function () {
		return caches.open(CACHE).then(function (cache) {
			return cache.addAll(urlsToCache);
		});
	});
});




// 监听激活，删掉当前版本以外的缓存
this.addEventListener("activate", function(event) {
	console.log("sw_demo> 激活", CACHE_VERSION_SHOW, gdt());

	// TODO: 激活的时候，检查现在有没有最新的
	caches.keys().then(function(nameList) {
		var nameStr = nameList.join(',');
		console.log('版本检查0> keyList: [', nameStr, ']', CACHE_VERSION_SHOW, gdt());

		// 1st step: find last-version
		var lastVerNum = 0;
		for (var i = 0; i < nameList.length; i ++) {
			var versionName = nameList[i];
			if (versionName.indexOf("demo-cache-v") == 0) {
				var verNum = parseInt(versionName.replace("demo-cache-v", ''));
				if (verNum > lastVerNum) {
					lastVerNum = verNum;
				}
			}
		}
		var lastVersionName = (lastVerNum != 0) ? ("demo-cache-v" + lastVerNum) : undefined;
		console.log('版本检查1> 最后版本:', lastVersionName, CACHE_VERSION_SHOW, gdt());

		// 2nd step: kill versions except last-version
		var refresh = false;
		if (lastVersionName) {
			for (var i = 0; i < nameList.length; i ++) {
				var versionName = nameList[i];
				if (versionName != lastVersionName) {
					caches.delete(versionName);
					console.log('    版本检查2> 干掉:', versionName, CACHE_VERSION_SHOW, gdt());
					refresh = true;
				}
			}
		}

		// 3rd step: refresh
		if (refresh) {
			console.log('TODO: RELOAD');
		}
	});


	// 声明缓存白名单，该名单外的缓存目录不会被生成
	var cacheWhitelist = [CACHE];
	event.waitUntil(
		// 传给 waitUntil() 的 promise 会阻塞其他的事件，直到它完成
		// 确保清理操作会在第一次 fetch 事件之前完成
		caches.keys().then(function(keyList) {
			console.log("白名单检查0> keyList: [", keyList, ']', CACHE_VERSION_SHOW, gdt());
			return Promise.all(keyList.map(function(key) {
				console.log('    白名单检查1>', '"' + key + '"', CACHE_VERSION_SHOW, gdt());
				if (cacheWhitelist.indexOf(key) === -1) {
					console.log('        白名单检查2a> DELETE', '"' + key + '"', 'not in', '[' + cacheWhitelist.join(', ') + ']', CACHE_VERSION_SHOW, gdt());
					return caches.delete(key);
				} else {
					console.log('        白名单检查2b> PASSED', '"' + key + '"', 'in', '[' + cacheWhitelist.join(', ') + ']', CACHE_VERSION_SHOW, gdt());
					return Promise.resolve();
				}
			}));
		})
	);
});

// fetchCB = function(event) {
// 	console.log("sw_demo> 接收到请求:", event.request.url, CACHE_VERSION_SHOW, gdt());
// 	event.respondWith(
// 		caches.match(event.request)
// 			.then(function(response) {
// 				// Cache hit - return response
// 				if (response) {
// 					console.log("    --> [CACHE-HIT] 找到缓存，返回响应", event.request.url, CACHE_VERSION_SHOW, gdt());
// 					return response;
// 				}

// 				console.log("    --> [FATCH] 未找到缓存，从服务器取得", event.request.url, CACHE_VERSION_SHOW, gdt());
// 				return fetch(event.request);

// 				// IMPORTANT: Clone the response. A response is a stream
// 				// and because we want the browser to consume the response
// 				// as well as the cache consuming the response, we need
// 				// to clone it so we have 2 stream.
// 				/*var responseToCache = response.clone();

// 				caches
// 					.open(CACHE_NAME)
// 					.then(function(cache) {
// 						cache.put(event.request, responseToCache);
// 					});

// 				return response;*/
// 			}
// 		)
// 	);
// }

function fromCache(request) {
	return caches.open(CACHE).then(function (cache) {
		return cache.match(request);
	});
}

self.addEventListener("fetch", function(evt) {
	// caches.match(evt.request.url).then(function(cache) {
	// 	if (cache !== undefined) {
	// 		console.log('CACHE-HIT      >>>', evt.request.url);
	// 		evt.respondWith(fromCache(evt.request));	// 先以缓存去返回请求
	// 	} else {
	// 		console.log('CACHE-NOT-FOUND>>>', evt.request.url);
	// 		evt.respondWith(fetch(evt.request));
	// 	}
	// })

	evt.waitUntil(
		// 去请求最新的资源
		update(evt.request)

		// 提醒客户端刷新
		.then(refresh)
	);
});

// 更新缓存资源
function update(request) {
	return caches.open(CACHE).then(function(cache) {
		return fetch(request).then(function(response) {
			console.log('UPDATE>>>', request.url);
			if (request.url.includes('png')) {
				console.log('【BINGO】');
			}
			// 将通过网络重新请求到的返回结果，放入缓存备用（更新缓存），然后再正常响应请求，提供返回
			return cache.put(request, response.clone()).then(function() {
				return response;
			});
		});
	});
}

function refresh(response) {
	return self.clients.matchAll().then(function(clients) {
		clients.forEach(function(client) {
			var message = {
				type: 'refresh',
				url: response.url,
				// 缓存资源的etag，如果有
				eTag: response.headers.get('ETag')
			}

			client.postMessage(JSON.stringify(message));
		})
	})
}


/*
caches:		CacheStorage API
fetch:		Fetch API
then:		Promise
clients:	Message API
ETag:		Entity tag
*/