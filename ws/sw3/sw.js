// 缓存版本号
var CACHE_NAME = 'cache_demo';
// 缓存文件列表
var urlsToCache = [
  "/controlled",
  "/controlled/page_1.html",
  "/controlled/icon1.png",
  "/controlled/iconT.png",
  "/controlled/version.json"
];
var host = 'http://localhost:9494';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('SW_INSTALL...');
        return cache.addAll(urlsToCache);
      })
      .then(function() {
        console.log('SW_INSTALL_Ready');
        return Promise.resolve();
      })
  );
});


// 监听激活
this.addEventListener("activate", function(event) {
  console.log("SW_ACTIVATE");

  event.waitUntil(
    caches.keys()
      .then(kl => {
        if (kl.indexOf(CACHE_NAME) == -1) {
          console.log(`未找到“${CACHE_NAME}”，重新缓存`);
          return caches.open(CACHE_NAME)
            .then(function(cache) {
              console.log('SW_RE_INSTALL...');
              return cache.addAll(urlsToCache);
            })
            .then(function() {
              console.log('SW_RE_INSTALL_Ready');
              return Promise.resolve();
            })
        }
      })
  );
});


self.addEventListener('fetch', function(evt) {
  console.log('sw> 接收到请求:', evt.request.url);
  var path = evt.request.url.replace(host, '');
  console.log('path:', path/*, 'isIn:', entryUrlList.indexOf(path) !== -1*/);

  // if (entryUrlList.indexOf(path) !== -1) {
  //   console.log('请求入口页，检查version');
  // }

  evt.respondWith(
    caches.match(evt.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          console.log('sw>> [CACHE-HIT] 找到缓存，返回响应', evt.request.url);
          return response;
        }

        console.log('sw>> [FATCH] 未找到缓存，从服务器取得', evt.request.url);
        return fetch(evt.request);
      }
    )
  );
});

// self.addEventListener('message', function(evt) {
//   console.log('SW_RECV-MSG>>>', evt.data);
//   var msg = JSON.parse(evt.data);

//   switch (msg.type) {
//     case 'stopSend_versionCheck':
//       clearInterval(loopTask);
//       console.log('msg -> SUCCESS !!!!!');
//       break;
//     default:
//       console.log('[WARN] msg.type: "' + msg.type + '", nothing to match');
//       break;
//   }
// });

