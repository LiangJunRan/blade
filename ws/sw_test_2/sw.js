var CACHE_NAME = 'test';



// 思路：
// 预缓存提前加载
// 其他遇到了再加载



// 预缓存地址v2
/*var halfUrlsToPreCache = [
	// "/controlled/sub-2.html",
	"/controlled/assets/icon1.png"
];
var origin = self.location.origin;
var urlsToPreCache = [];
halfUrlsToPreCache.map(function(halfUrl) {
	urlsToPreCache.push(origin + halfUrl);
});*/

// 预缓存地址v1
var urlsToPreCache = [
	// "/controlled/sub-2.html",
	"/controlled/page1.html",
	"/controlled/assets/icon1.png"
];
var origin = self.location.origin;
/*var urlsToPreCache = [];
halfUrlsToPreCache.map(function(halfUrl) {
	urlsToPreCache.push(origin + halfUrl);
});*/
console.log('urlsToPreCache>>>', urlsToPreCache);


// 用来记录已经缓存的url和对应版本
var cachedUrls = {};
var nowVersion = -1;
var lastVersion = -1;


function showCachedVersion() {
	console.log('cachedUrls >>>', JSON.stringify(cachedUrls));
}

// 保存文件url及对应版本
function saveCache(url, version) {
	// if (cachedUrls[url] !== undefined) {
		
	// }
	// 打开缓存
	return caches.open(CACHE_NAME).then(function (cache) {
		// 加载url资源（检查这里是否有缓存？？）
		return fetch(url).then(function(response) {
			// 按照url为关键字，将资源放入缓存中
			return cache.put(url, response.clone()).then(function() {
				// 更新已存url的对应版本
				cachedUrls[url] = version;
				return Promise.resolve();
			})
		})
	});
}

function preCacheAll() {
	console.log('预缓存所有资源', urlsToPreCache);
	urlsToPreCache.map(function(url) {
		console.log('    REQ', origin + url);
		saveCache(origin + url, nowVersion).then(function() {
			console.log('    SVD', origin + url);
			showCachedVersion();
		});
	});
	// showCachedVersion();
}


// INSTALL
self.addEventListener('install', function(event) {
	console.log('The service worker is being installed.');

	// 在这里不去preCache，在下方得到版本号的时候再去加载

	// event.waitUntil(preCache().then(function() {
	// 	console.log('[ServiceWorker] Skip waiting on install');
	// 	return self.skipWaiting();
	// }));

	// event.waitUntil(preCache());
});

/*function preCache() {
	return caches.open(CACHE_NAME).then(function (cache) {
		console.log('SW_INSTALL...preCached');
		return cache.addAll(urlsToPreCache);
	});
}*/




// MSG
self.addEventListener('message', function(evt) {
	var result = evt.data.match(/^\[([^\[\]]*)\](.*)/);
	if (result !== null && 
			typeof(result[1]) == "string" && typeof(result[2]) == "string" &&
			result[1].length > 0 && result[2].length > 0) {
		switch(result[1]) {
			case "NOW_VERSION":
				nowVersion = parseInt(result[2]);
				lastVersion = nowVersion;
				console.log('已处理信息 当前版本:', nowVersion);
				preCacheAll();
				break;
			case "UPDATE_VERSION":
				lastVersion = parseInt(result[2]);
				console.log('已处理信息 升级版本:', lastVersion);
				// preCacheAll();

				var url = origin + '/controlled/assets/icon1.png';
				evt.waitUntil(
					caches.open(CACHE_NAME).then(function (cache) {
						return fetch(url).then(function (response) {
							return cache.put(url, response).then(function () {
								console.log('升级版本', lastVersion, url);
								// 更新已存url的对应版本
								cachedUrls[url] = lastVersion;
								return Promise.resolve();
							});
						});
					})
				);
				break;
			default:
				console.log('未处理信息！', result[1], result[2]);
				break;
		}
	} else {
		console.log('[UN-FMT-MSG] SAID:', evt.data);
	}
});




// FETCH 对比组
/*
self.addEventListener('fetch', function(evt) {
  console.log('The service worker is serving the asset.');

  evt.respondWith(fromCache(evt.request));

  evt.waitUntil(
    update(evt.request)
    .then(refresh)
  );
});
function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request);
  });
}
*/


// FETCH
self.addEventListener('fetch', function(evt) {
	console.log('SW:fetch', evt.request.url);

	evt.respondWith(fromCacheFirst_CompareVersion(evt.request));
});

// 优先使用Cache，没找到Fetch该资源
/*function fromCacheFirstOrFetch(request) {
	return caches.open(CACHE_NAME).then(function (cache) {
		return cache.match(request).then(function (matchedResponse) {
			if (matchedResponse) {
				console.log('  -> from cache', request.url);
				return matchedResponse;		// 从cache中取出
			} else {
				// console.log('  -> from fetch', getNoTempURL(request.url));
				// 不加no-cache会load from memory cache
				// 加了no-cache会报错：Uncaught (in promise) TypeError: Failed to execute 'fetch' on 'ServiceWorkerGlobalScope': Cannot construct a Request with a Request whose mode is 'navigate' and a non-empty RequestInit.
				return fetch(request);		// 从fetch中取出（TODO: 新资源？是否会被浏览器缓存？NO-CACHE？）
				// return fetch(getNoTempURL(request.url));		// 通过时间戳强制加载最新资源
			}
			
		});
	});
}*/


// 优先使用Cache，使用前对比版本
function fromCacheFirst_CompareVersion(request) {
	return caches.open(CACHE_NAME).then(function (cache) {
		return cache.match(request).then(function (matchedResponse) {
			var url = request.url;
			console.log('url         >>>', url, '\nmatch       >>>', matchedResponse !== undefined, '\nlastVersion >>>', lastVersion);
			if (matchedResponse === undefined) {

			}
			// 有缓存且为最新
			if (matchedResponse && cachedUrls[url] === lastVersion) {
				console.log('  -> from cache', url);
				return matchedResponse;		// 从cache中取出
			}

			// 有缓存，但是版本过期（请求最新的替换缓存）
			else if (matchedResponse && cachedUrls[url] !== lastVersion) {
				console.log('  -> fetch & update', url);
				// TODO: 更新缓存资源
				return saveCache(url, lastVersion).then(function() {
					return caches.open(CACHE_NAME).then(function (cache) {
						return cache.match(request).then(function (matchedResponse) {
							var url = request.url;

							if (matchedResponse && cachedUrls[url] === lastVersion) {
								console.log('  -> Lv2 from cache', url);
								return matchedResponse;		// 从cache中取出
							}
							else {
								return Promise.reject(new Error("更新缓存后，还是不能找到即match又最新的资源"));
							}
						})
					})
				})
				
			}

			// 没缓存，直接获取
			else {
				console.log('  -> fetch only', url);
				// 不加no-cache会load from memory cache
				// 加了no-cache会报错：Uncaught (in promise) TypeError: Failed to execute 'fetch' on 'ServiceWorkerGlobalScope': Cannot construct a Request with a Request whose mode is 'navigate' and a non-empty RequestInit.
				return fetch(request);		// 从fetch中取出（TODO: 新资源？是否会被浏览器缓存？NO-CACHE？）
				// return fetch(getNoTempURL(request.url));		// 通过时间戳强制加载最新资源
			}
			
		});
	});
}

function getHalfAbsolutePath(absoluteUrl) {
	return absoluteUrl.replace(self.origin, '');
}