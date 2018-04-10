// 缓存版本号
var CACHE_NAME = 'sw3';
// 缓存文件列表
var urlsToCache = [
  "/controlled/"
];
var host = 'http://localhost:9494';
var entryUrlList = [
  "/entry.html"
];
var versionUrl = '/controlled/version.json';


self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('打开缓存');
        return cache.addAll(urlsToCache);
      })
  );
});


var checkVersionDetail = data => {

}


self.addEventListener('fetch', function(evt) {
  console.log('sw> 接收到请求:', evt.request.url);
  var path = evt.request.url.replace(host, '');
  console.log('path:', path, 'isIn:', entryUrlList.indexOf(path) !== -1);

  if (entryUrlList.indexOf(path) !== -1) {
    console.log('请求入口页，检查version');

    // evt.waitUntil(
      /* 
        先取到json，然后利用#A.return进入#C
        顺序是:
        ...
        -> fetch
          -> fetch完毕
        -> #A
          -> r.json
            -> r.json完毕
          -> #B
            -> #B完毕
          -> #A完毕
        -> #C
          -> ...
        ...
      */
      fetch(versionUrl, {cache: 'no-cache'})
        .then(r => {                            // #A
          // 检查ETag
          console.log('headers:', r.headers);
          let etag = r.headers.get('ETag');
          console.log('etag:', etag);
          return (new Promise((resolve, reject) => {
            r.json()
              .then(dt => {                     // #B
                resolve([dt, etag]);
              })
          }));
        })
        .then((data) => {                       // #C
          console.log('data:', data);
          console.log(' |-- jsonData:', data[0]);
          console.log(' |-- etag:', data[1]);

          // 将数据发送给client
          return self.clients.matchAll().then(function(clients) {
            clients.forEach(function(client) {
              var message = {
                type: 'versionCheck',
                url: path,
                data: {
                  content: data[0],
                  etag: data[1]
                }
              };

              client.postMessage(JSON.stringify(message));
            })// END of forEach
          });// END of return
        });
        // END of fetch
    // );// END of evt.waitUntil
  }

  // event.respondWith(
  //   caches.match(event.request)
  //     .then(function(response) {
  //       // Cache hit - return response
  //       if (response) {
  //         console.log('sw>> [CACHE-HIT] 找到缓存，返回响应', event.request.url);
  //         return response;
  //       }

  //       console.log('sw>> [FATCH] 未找到缓存，从服务器取得', event.request.url);
  //       return fetch(event.request);
  //     }
  //   )
  // );
});