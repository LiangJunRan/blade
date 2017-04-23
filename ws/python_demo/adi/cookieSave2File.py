# coding=utf-8
import cookielib
import urllib2
import json
import gzip
import StringIO
from adi_try import get_product_token

def cookie_save_to_file():
    url = 'http://www.adidas.com.cn/ba8929'
    headers = {
        "accept": "application/json",
        "accept-encoding": "gzip, deflate",
        "accept-language": "en-US,en;q=0.8",
        "user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
    }

    filename = 'cookie.txt'
    cookie = cookielib.MozillaCookieJar(filename)
    req = urllib2.Request(url, headers=headers)
    handler = urllib2.HTTPCookieProcessor(cookie)
    opener = urllib2.build_opener(handler)

    response = opener.open(req)

    cookie.save(ignore_discard=True, ignore_expires=True)

def get_cookie_from_file():
    url = 'http://www.adidas.com.cn/checkout/cart/add/'
    headers = {
        "accept": "application/json",
        "accept-encoding": "gzip, deflate",
        "accept-language": "en-US,en;q=0.8",
        "user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
        "Content-Length": "111",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
    }
    data = {
        "token": get_product_token('333133'),
        "isajax": "yes",
        "release2": "yes",
        "product": "333133",
        "super_attribute[185]": "53",
        "qty": "1",
    }

    cookie = cookielib.MozillaCookieJar('cookie.txt')
    cookie.load(ignore_discard=True, ignore_expires=True)
    print 2.1
    req = urllib2.Request(url, headers=headers)
    print 2.2
    handler = urllib2.HTTPCookieProcessor(cookie)
    opener = urllib2.build_opener(handler)
    print 2.3
    response = opener.open(req, json.dumps(data))
    print 2.4
    cookie.save(ignore_discard=True, ignore_expires=True)

def show_cart():
    url = "https://www.adidas.com.cn/specific/Ajaxshoppingcart/arvatoAjaxCart/"
    headers = {
        "accept": "application/json",
        "accept-encoding": "gzip, deflate",
        "accept-language": "en-US,en;q=0.8",
        "user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
    }
    filename = 'cookie.txt'
    cookie = cookielib.MozillaCookieJar(filename)
    cookie.load(ignore_discard=True, ignore_expires=True)
    req = urllib2.Request(url, headers=headers)
    handler = urllib2.HTTPCookieProcessor(cookie)
    opener = urllib2.build_opener(handler)

    response = opener.open(req)

    # 解决gzip乱码问题
    if response.info().get('Content-Encoding') == 'gzip':
        buf = StringIO(response.read())
        f = gzip.GzipFile(fileobj=buf)
        data = f.read()
        print data
    else:
        print response.read()

if __name__ == '__main__':
    print 1
    cookie_save_to_file()
    print 2
    get_cookie_from_file()
    print 3
    show_cart()
    print 4
