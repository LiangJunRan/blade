// 缓存版本号
var CACHE_NAME = "demo-cache";
var CACHE_VERSION = "25";
var CACHE_TAG = CACHE_NAME + "-v" + CACHE_VERSION;

// 缓存文件列表
var urlsToCache = [
	// "/demo.html",
	"/media/rainymood.m4a",
	"/media/docker.mp4"
];

// 监听安装
self.addEventListener("install", function(event) {
	console.log('sw_demo> INSTALL');
	// Perform install steps
	event.waitUntil(
		caches
		.open(CACHE_TAG)
		.then(function(newCache) {
			console.log("sw_demo> 开始缓存");
			return urlsToCache.map(function(url) {
				console.log(' -->', url);
				return caches.match(url).then(function(cachedResponse) {
					// caches中没有match到缓存 或 在即将缓存列表中
					if (!cachedResponse || urlsToCache.indexOf(url) !== -1) {
						console.log('    --> NETWORK GET:', url);
						return fetch(url).then(function(response) {
							// if (url === '/404/') {
							// 	response = new Response(response.body, {
							// 		status: 404,
							// 		statusText: 'Not Found',
							// 		headers: response.headers
							// 	});
							// }


							console.log('        --> then', url, response);

							newCache.put(url, response);
						});
					} else {
						console.log('     --> CACHED GET:', url);
						return newCache.put(destUrl, cachedResponse);
					}
				});
			});
			// return prms;
		})
		.then(function(cache) {
			console.log("sw_demo> 缓存完毕！！");
		})
	);
});

// 监听激活，删掉当前版本以外的缓存
this.addEventListener("activate", function(event) {
	console.log("sw_demo> 激活");
	// 声明缓存白名单，该名单外的缓存目录不会被生成
	var cacheWhitelist = [CACHE_TAG];
	event.waitUntil(
		// 传给 waitUntil() 的 promise 会阻塞其他的事件，直到它完成
		// 确保清理操作会在第一次 fetch 事件之前完成
		caches.keys().then(function(keyList) {
			console.log("keyList:", keyList);
			return Promise.all(keyList.map(function(key) {
				console.log('    --> Checking ...', '"' + key + '"');
				if (cacheWhitelist.indexOf(key) === -1) {
					console.log('        --> DELETE', '"' + key + '"', 'not in', '[' + cacheWhitelist.join(', ') + ']');
					return caches.delete(key);
				} else {
					console.log('        --> PASSED', '"' + key + '"', 'in', '[' + cacheWhitelist.join(', ') + ']');
					return Promise.resolve();
				}
			}));
		})
	);
});

fetchCB = function(event) {
	console.log("sw_demo> 接收到请求:", event.request.url);
	event.respondWith(
		caches.match(event.request)
			.then(function(response) {
				// Cache hit - return response
				if (response) {
					console.log("    --> [CACHE-HIT] 找到缓存，返回响应", event.request.url);
					return response;
				}

				console.log("    --> [FATCH] 未找到缓存，从服务器取得", event.request.url);
				return fetch(event.request);

				// IMPORTANT: Clone the response. A response is a stream
				// and because we want the browser to consume the response
				// as well as the cache consuming the response, we need
				// to clone it so we have 2 stream.
				/*var responseToCache = response.clone();

				caches
					.open(CACHE_NAME)
					.then(function(cache) {
						cache.put(event.request, responseToCache);
					});

				return response;*/
			}
		)
	);
}

self.addEventListener("fetch", fetchCB);