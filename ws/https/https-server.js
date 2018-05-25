var https = require('https');   //创建服务器 https  
var fs = require('fs');        //文件系统的模块  
  
const hostname = '127.0.0.1';  
const port = 443;  
  
var options = {  
    key : fs.readFileSync('credentials/rsa_private.key'),	//读出 sytly 文件？  
    cert : fs.readFileSync('credentials/cert.crt'),			//同步读出 SSL 证书  
}  
  
const server = https.createServer(options ,(req, res) => {  //监听到请求后，回调 function   req 请求相关的信息（如：从哪来过来的，类型是get还是post等信息）  
    // res 告诉服务器给这个请求响应的内容  
  res.statusCode = 200;  
  res.setHeader('Content-Type', 'text/plain');  // 返回的请求头  200 成功  文本内容Content-Type   是 text/plain  
  res.end('Hello World\n');  //返回的内容，改变内容的重启服务 ctrl+c关掉， 再重启 node server.js  
});  
  
//listen 监听 来自 127.0.0.1 3000 的请求  
  
server.listen(port, hostname, () => {  
  console.log(`Server running at https://${hostname}:${port}/`);  
}); 