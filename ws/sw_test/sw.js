var CACHE_NAME = 'test';

var urlsToCache = [
	"/icon1.png",
	"/iconT.png"
];





// INSTALL
self.addEventListener('install', function(event) {
	console.log('The service worker is being installed.');

	event.waitUntil(preCache());
});

function preCache() {
	return caches.open(CACHE_NAME).then(function (cache) {
		console.log('SW_INSTALL...');
		return cache.addAll(urlsToCache);
	});
}





// FETCH
self.addEventListener('fetch', function(evt) {
	console.log('The service worker is serving the asset.');

	console.log(evt);
 
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
				return matchedResponse;		// 从cache中取出
			} else {
				return fetch(request);		// 从fetch中取出（TODO: 新资源？是否会被浏览器缓存？NO-CACHE？）
			}
			
		});
	});
}





// 测试更新sw
console.log('Yooo');