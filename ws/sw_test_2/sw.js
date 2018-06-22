var CACHE_NAME = 'test';



// 思路：
// 预缓存提前加载
// 其他遇到了再加载



// 预缓存地址
var urlsToPreCache = [
	// "/controlled/sub-2.html",
	"/controlled/assets/icon1.png"
];




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
	return caches.open(CACHE_NAME).then(function (cache) {
		return fetch(url).then(function(response) {
			return cache.put(url, response.clone()).then(function() {
				cachedUrls[url] = version;
				return Promise.resolve();
			})
		})
	});
}

function preCacheAll() {
	urlsToPreCache.map(function(url) {
		console.log('    >>>', url);
		saveCache(url, nowVersion).then(function() {
			console.log('    SVD', url);
			showCachedVersion()
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
				break;
			default:
				console.log('未处理信息！', result[1], result[2]);
				break;
		}
	} else {
		console.log('[MSG] SAID:', evt.data);
	}
});




// FETCH
self.addEventListener('fetch', function(evt) {
	console.log('SW:fetch');

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
			console.log('request.url>>>', request.url);
			console.log('no-host-path>>', getHalfAbsolutePath(request.url));
			var haPath = getHalfAbsolutePath(request.url);
			// 有缓存且为最新
			if (matchedResponse && cachedUrls[haPath] === lastVersion) {
				console.log('  -> from cache', request.url);
				return matchedResponse;		// 从cache中取出
			}
			// 有缓存，但是版本过期（请求最新的替换缓存）
			else if (matchedResponse && cachedUrls[haPath] !== lastVersion) {

			}
			// 没缓存，直接获取
			else {
				// console.log('  -> from fetch', getNoTempURL(request.url));
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