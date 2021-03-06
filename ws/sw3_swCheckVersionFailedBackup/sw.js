// 缓存版本号
var CACHE_NAME = 'sw3';
// 缓存文件列表
var urlsToCache = [
  "/controlled"
];
var host = 'http://localhost:9494';
var entryUrlList = [
  "/entry.html"
];
var versionUrl = '/controlled/version.json';

// 循环定时任务
var loopTask = undefined;


Date.prototype.Format = function (fmt) { // author: meizz
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
}
function gdt() {
  return (new Date()).Format("[dd HH:mm:ss]"); 
}


self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('SW_INSTALL...');
        return cache.addAll(urlsToCache);
      })
      .then(function() {
        console.log('SW_INSTALL_R', gdt());
        return Promise.resolve();
      })
  );
});


// 监听激活
this.addEventListener("activate", function(event) {
  console.log("SW_ACTIVATE", gdt());
});


self.addEventListener('fetch', function(evt) {
  console.log('sw> 接收到请求:', evt.request.url);
  var path = evt.request.url.replace(host, '');
  console.log('path:', path, 'isIn:', entryUrlList.indexOf(path) !== -1);

  if (entryUrlList.indexOf(path) !== -1) {
    console.log('请求入口页，检查version');

    evt.waitUntil(
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
              console.log('before msg, clients.length =', clients.length);

              var timesLimit = 5;
              var nowTime = 0;
              loopTask = setInterval(function() {
                client.postMessage(JSON.stringify(message));
                console.log('msg...', client, nowTime + '/' + timesLimit);
                if (nowTime > timesLimit) {
                  clearInterval(loopTask);
                  loopTask = undefined;
                  console.log('msg -> FAILED!!!');
                } else {
                  nowTime += 1;
                }
              }, 1000);
              console.log('SW_SEND-MSG>>>', JSON.stringify(message));
            })// END of forEach
          });// END of return
        })// END of fetch
    );// END of evt.waitUntil
  }

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

self.addEventListener('message', function(evt) {
  console.log('SW_RECV-MSG>>>', evt.data);
  var msg = JSON.parse(evt.data);

  switch (msg.type) {
    case 'stopSend_versionCheck':
      clearInterval(loopTask);
      console.log('msg -> SUCCESS !!!!!');
      break;
    default:
      console.log('[WARN] msg.type: "' + msg.type + '", nothing to match');
      break;
  }
});

