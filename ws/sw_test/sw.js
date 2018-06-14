var CACHE_NAME = 'test';

var urlsToCache = [
	"/controlled/sub-2.html",
	"/controlled/icon1.png"
];





// INSTALL
self.addEventListener('install', function(event) {
	console.log('The service worker is being installed.');

	event.waitUntil(preCache().then(function() {
		console.log('[ServiceWorker] Skip waiting on install');
    	return self.skipWaiting();
	}));
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
 
	evt.respondWith(fromCacheFirstOrFetch(evt.request));
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
		return cache.match(request).then(function (matchedResponse) {
			if (matchedResponse) {
				console.log('  -> from cache', request.url);
				return matchedResponse;		// 从cache中取出
			} else {
				console.log('  -> from fetch', request.url);
				// 不加no-cache会load from memory cache
				// 加了no-cache会报错：Uncaught (in promise) TypeError: Failed to execute 'fetch' on 'ServiceWorkerGlobalScope': Cannot construct a Request with a Request whose mode is 'navigate' and a non-empty RequestInit.
				return fetch(request);		// 从fetch中取出（TODO: 新资源？是否会被浏览器缓存？NO-CACHE？）
			}
			
		});
	});
}





// 测试更新sw
console.log('Yooo');