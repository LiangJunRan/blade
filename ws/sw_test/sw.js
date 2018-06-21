var CACHE_NAME = 'test';

var urlsToCache = [
	"/controlled/sub-2.html",
	"/controlled/icon1.png"
];





// INSTALL
self.addEventListener('install', function(event) {
	console.log('The service worker is being installed.');

	/*event.waitUntil(preCache().then(function() {
		console.log('[ServiceWorker] Skip waiting on install');
		return self.skipWaiting();
	}));*/

	event.waitUntil(preCache());
});

function preCache() {
	return caches.open(CACHE_NAME).then(function (cache) {
		console.log('SW_INSTALL...preCached');
		return cache.addAll(urlsToCache);
	});
}




// FETCH
self.addEventListener('fetch', function(evt) {
	console.log('The service worker is serving the asset.');

	
	
	if (evt.request.url.match('cmd_update_cache') !== null) {
		console.log('[CMD]更新缓存');

		// TODO: 更新cache
		//	function update(request) {
		//	return caches.open(CACHE).then(function (cache) {
		//		return fetch(request).then(function (response) {
		//			return cache.put(request, response);
		//		});
		//	});
		// }

		// version 0: 报错版
		/*caches.open(CACHE_NAME)
			.then(function (cache) {
				return fetch(getNoTempURL('/controlled/icon1.png')).then(function (response) {
					console.log('更新图片缓存');
					// [DOC]https://developer.mozilla.org/zh-CN/docs/Web/API/Cache/put
					return cache.put('/controlled/icon1.png', response);
				});
			})
			.then(function() {
				console.log('刷新页面');
				// 返回page页
				evt.respondWith(fetch('page.html'));
			});*/

		// version 1: waitUntil版本
		evt.waitUntil(caches.open(CACHE_NAME)
			.then(function (cache) {
				return fetch(getNoTempURL('/controlled/icon1.png')).then(function (response) {
					console.log('更新图片缓存');
					// [DOC]https://developer.mozilla.org/zh-CN/docs/Web/API/Cache/put
					return cache.put('/controlled/icon1.png', response.clone(), function() {
						return response;
					});
				});
			})
		)
		console.log('刷新页面');
		evt.respondWith(fetch('page.html'));

		// version 2: 强行替换版本 iconT -> icon1，成功，证明替换可行，猜测fetch也是从缓存里取得？
		/*caches.delete(CACHE_NAME)
		.then(function() {
			return preCache();
		})
		.then(function() {*/
			/*caches.open(CACHE_NAME)
				.then(function (cache) {
					var req = new Request('http://127.0.0.1:9495/controlled/icon1.png')
					// fetch('http://127.0.0.1:9495/controlled/icon1.png').then()
					cache.add(req);
					// var fetchUrl = getNoTempURL('/controlled/icon1.png');
					// console.log('fetch url:', fetchUrl)
					// return fetch(fetchUrl, {cache: "no-cache"}).then(function (response) {
						console.log('更新图片缓存');
					// 	// [DOC]https://developer.mozilla.org/zh-CN/docs/Web/API/Cache/put
					// 	// [踩坑]cache.put的第一个参数必须和请求参数完全一致，否则做不到更新
					// 	cache.put('http://127.0.0.1:9495/controlled/icon1.png', response);
						Promise.resolve();
					// });
				});*/
		/*})*/
		/*evt.waitUntil(preCache().then(function() {
			console.log('[ServiceWorker] Skip waiting on UPDATE');
			return Promise.resolve();
		}));
		
		console.log('刷新页面');
		evt.respondWith(fetch('page.html'));*/
	} else {
		evt.respondWith(fromCacheFirstOrFetch(evt.request));
	}
});


// 只从缓存中取得的方法，没找到就报错
function fromCache(request) {
	return caches.open(CACHE_NAME).then(function (cache) {
		return cache.match(request).then(function (matching) {
			return matching || Promise.reject('no-match');
		});
	});
}

// 优先使用Cache，没找到Fetch该资源
function fromCacheFirstOrFetch(request) {
	return caches.open(CACHE_NAME).then(function (cache) {
		return cache.match(/*getNoTempURL(*/request/*)*/).then(function (matchedResponse) {
			if (request.url.match('controlled/icon1.png') !== null) {
				console.log('!!!controlled/icon1.png!!!');
				// debugger;
			}
			if (matchedResponse) {
				console.log('  -> from cache', request.url);
				return matchedResponse;		// 从cache中取出
			} else {
				console.log('  -> from fetch', getNoTempURL(request.url));
				// 不加no-cache会load from memory cache
				// 加了no-cache会报错：Uncaught (in promise) TypeError: Failed to execute 'fetch' on 'ServiceWorkerGlobalScope': Cannot construct a Request with a Request whose mode is 'navigate' and a non-empty RequestInit.
				// return fetch(request);		// 从fetch中取出（TODO: 新资源？是否会被浏览器缓存？NO-CACHE？）
				return fetch(getNoTempURL(request.url));		// 通过时间戳强制加载最新资源
			}
			
		});
	});
}


function getNoTempURL(url) {
	// url的参数前缀处理
	if (url.match('\\?') !== null) {
		if (url.indexOf('?') != url.length - 1) {
			url += '&_=';
		} else {
			url += '_=';
		}
	} else {
		url += '?_=';
	}
	// 加随机值
	url += (new Date()).valueOf() + '_' + Math.random();

	return url;
}





// 测试更新sw
console.log('Yooo');