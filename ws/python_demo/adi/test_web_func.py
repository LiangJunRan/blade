# encoding=utf-8
import cookielib
import urllib2
import json
from StringIO import StringIO
import gzip

# 使用指定的参数生成cookie,并用这个cookie访问网站

header_set = {
    "accept": "application/json",
    "accept-encoding": "gzip, deflate",
    "accept-language": "en-US,en;q=0.8",
    "user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
}

values = {
    "token": "6d34739820ef8e0b084b77c1bfdf7c65",
    "isajax": "yes",
    "release2": "yes",
    "product": "333133",
    "super_attribute[185]": "53",
    "qty": "1",
}




cookiejar = cookielib.CookieJar()
urlOpener = urllib2.build_opener(urllib2.HTTPCookieProcessor(cookiejar))

url = "http://www.adidas.com.cn"
request = urllib2.Request(url)
for k in header_set:
    request.add_header(k, header_set[k])
response = urlOpener.open(request)
print response.info()
page = response.read()



url = "http://www.adidas.com.cn/checkout/cart/add/"
data = json.dumps(values)
request = urllib2.Request(url, data)
for k in header_set:
    request.add_header(k, header_set[k])
response = urlOpener.open(request)

# 解决gzip乱码问题
print response.info().get('Content-Encoding') == 'gzip'
if response.info().get('Content-Encoding') == 'gzip':
    buf = StringIO(response.read())
    f = gzip.GzipFile(fileobj=buf)
    page = f.read()
    print page
else:
    print response.read()



url = "https://www.adidas.com.cn/specific/Ajaxshoppingcart/arvatoAjaxCart/"

request = urllib2.Request(url)
for k in header_set:
    request.add_header(k, header_set[k])
response = urlOpener.open(request)

# 解决gzip乱码问题
print response.info().get('Content-Encoding') == 'gzip'
if response.info().get('Content-Encoding') == 'gzip':
    buf = StringIO(response.read())
    f = gzip.GzipFile(fileobj=buf)
    page = f.read()
    print page
else:
    print response.read()