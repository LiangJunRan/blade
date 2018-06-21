var CACHE_NAME = 'test';



// 思路：
// 预缓存提前加载
// 其他遇到了再加载



// 预缓存地址
var urlsToPreCache = [
	/*"/controlled/sub-2.html",
	"/controlled/icon1.png"*/
];



// 用来记录已经缓存的url和对应版本
var cachedUrls = {};
var nowVersion = -1;





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
		return cache.addAll(urlsToPreCache);
	});
}




// MSG
self.addEventListener('message', function(evt) {
	var result = evt.data.match(/^\[([^\[\]]*)\](.*)/);
	if (result !== null && 
			typeof(result[1]) == "string" && typeof(result[2]) == "string" &&
			result[1].length > 0 && result[2].length > 0) {
		switch(result[1]) {
			case "NOW_VERSION":
				nowVersion = parseInt(result[2]);
				console.log('已处理信息 当前版本:', nowVersion);
				break;
			case "UPDATE_VERSION":
				updateVersion = parseInt(result[2]);
				console.log('已处理信息 升级版本:', updateVersion);
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
/*self.addEventListener('fetch', function(evt) {
	console.log('SW:fetch');

	evt.respondWith(fromCacheFirstOrFetch(evt.request));
});

// 优先使用Cache，没找到Fetch该资源
function fromCacheFirstOrFetch(request) {
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
