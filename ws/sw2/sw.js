// 缓存版本号
var CACHE_NAME = 'sw2';
// 缓存文件列表
var urlsToCache = [
  "/demo_update.html",
  "/media/icon1.png"
];

// 监听安装
self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('sw> 打开缓存');
        return cache.addAll(urlsToCache);
      })
  );
});

// 监听激活，删掉当前版本以外的缓存
this.addEventListener('activate', function(event) {
  console.log('sw> 激活');
  // 声明缓存白名单，该名单外的缓存目录不会被生成
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    // 传给 waitUntil() 的 promise 会阻塞其他的事件，直到它完成
    // 确保清理操作会在第一次 fetch 事件之前完成
    caches.keys().then(function(keyList) {
      console.log('keyList:', keyList);
      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log('sw> 接收到请求:', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          console.log('sw>> [CACHE-HIT] 找到缓存，返回响应', event.request.url);
          return response;
        }

        console.log('sw>> [FATCH] 未找到缓存，从服务器取得', event.request.url);
        return fetch(event.request);
      }
    )
  );
});