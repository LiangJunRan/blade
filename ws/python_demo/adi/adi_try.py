# coding:utf-8
from StringIO import StringIO
import gzip
import cookielib
import urllib2
import urllib
import json
import time

# url = "https://www.adidas.com.cn/specific/Ajaxshoppingcart/arvatoAjaxCart/"
url = "https://www.adidas.com.cn"

url_goods = "http://www.adidas.com.cn/ba8929"

cookie = cookielib.CookieJar()
handler = urllib2.HTTPCookieProcessor(cookie)
opener = urllib2.build_opener(handler)
urllib2.install_opener(opener)


header_sets = {
    'chrome_default': {
        "accept": "application/json",
        "accept-encoding": "gzip, deflate",
        "accept-language": "en-US,en;q=0.8",
        "user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
    },
    'my_set': {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "accept-encoding": "gzip, deflate, sdch, br",
        "accept-language": "zh-CN,zh;q=0.8",
        "user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
    }
}

header_set = header_sets['chrome_default']

def print_req(req):
    print '=== {:=<120}'.format('REQUEST HEADER ')
    for h in req.headers:
        print '    {:<20}: {}'.format(h, req.headers[h])
    print '\n'

def print_data(data):
    print '=== {:=<120}'.format('POST DATA ')
    for k in data:
        print '    {:<20}: {}'.format(k, data[k])
    print '\n'

def print_resp(resp, show_page=False):
    print '=== {:=<120}'.format('RESPONSE HEADER ')
    infos = resp.info()
    for inf in infos:
        nm, val = inf, infos[inf]
        print '    {:<20}: {}'.format(nm, val)
    print '\n'

    resp_str = ''
    if show_page:
        # 生成文件名
        time_format_str = '%Y-%m-%d %H_%M_%S'
        ts = time.time()    # 创建timestamp的方式1
        tstr = time.strftime(time_format_str, time.localtime(ts))   # 使用localtime方法将float转换成为tuple
        f_name = 'resp_' + tstr + '.html'

        # 解决gzip乱码问题
        if resp.info().get('Content-Encoding') == 'gzip':
            buf = StringIO(resp.read())
            f = gzip.GzipFile(fileobj=buf)
            resp_str = f.read()
        else:
            resp_str = resp.read()
        print 'Response has been saved as %r.' % ('D:/test/' + f_name)


        f = open('D:/test/' + f_name, "wb")
        f.write(resp_str)
        f.flush()
        f.close()

def print_cookie(cookie):
    print '=== {:=<120}'.format('COOKIE ')
    for ck in cookie:
        print '    {:<20}: {}'.format(ck.name, ck.value)
    print '\n'

def get_adi_cookie():
    url = url_goods
    req = urllib2.Request(url)
    for k in header_set:
        req.add_header(k, header_set[k])
    resp = opener.open(req)

def get_adi_cookie2():
    req = urllib2.Request(url)
    # 添加Header
    header = header_set
    for k in header:
        req.add_header(k, header[k])

    print_req(req)

    # 请求数据
    resp = opener.open(req)

    # print_resp(resp)
    # print_cookie(cookie)

    # 解决gzip乱码问题
    # if resp.info().get('Content-Encoding') == 'gzip':
    #     buf = StringIO(resp.read())
    #     f = gzip.GzipFile(fileobj=buf)
    #     data = f.read()
    #     print data
    # else:
    #     print resp.read()


def cart_add():
    url = 'http://www.adidas.com.cn/checkout/cart/add/'
    req = urllib2.Request(url)

    header = {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "zh-CN,zh;q=0.8",
        "Connection": "keep-alive",
        "Content-Length": "111",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        # "Cookie": """AMCVS_7ADA401053CCF9130A490D4C%40AdobeOrg=1; frontend=12hbeb3fuu79c5l7ab4742hdb4; bm_mi=12ADFB6208940BCE2193218635F25E3A~8rFavYX+xiyYOfIr/2+s0V8ZdKsuDY9HLf738Y/JuS84OYUZoIRmdAwgpboZ1d2z3bWHVuvwNEPNJR2ytl6qrwOhFGJz3h+8v6EmA/m1seZSYvapUkCjlOjZsdWqLK+aoyl71rVqRpcF4YNAJAhasZaWm76+VfXCcUDCfaZjeS8aePZSt97q0+EUeso4GhZZbAR3pubMQFZK0WguJMsAQMwsFiFAHwAweBrIpXs1a740OdULRq2RS7sySwLgcCUJujwpQg4I55K2qZP77nziuw==; _ga=GA1.3.2078715433.1492409146; _gat=1; frontend=12hbeb3fuu79c5l7ab4742hdb4; ak_bmsc=C0BD4FE9DAC738708E0F1EBFF91FB945D2C07405167E0000D07DF458F5E6D27A~plDooHUTz2rGE/PAff/s76hFJ3DE2Cm0aMxD5FuqQJDAlv5ZGiPbZLiKJ3esH6HcY1e2AmtVZc8FfTJOa+2apFSvRtJwYOR9TUm03QMf/TQIZ+LDZRz12XFHmnrryPAEdZwxpErUl+35S6LHRSowvS6YZZ4xAIxUrNN3GhYviz8FsvBEILa6GMf2uZY/DVy4kKl8NB638tB2raVexeOYt2qMlnLxCld8SCao4NLV3oyavjCAV2NUnUquxXYbuGpRLe; s_cc=true; AMCV_7ADA401053CCF9130A490D4C%40AdobeOrg=-227196251%7CMCIDTS%7C17274%7CMCMID%7C17910393991056621116170894073392298807%7CMCAAMLH-1493013948%7C11%7CMCAAMB-1493025909%7CNRX38WO0n5BH8Th-nqAG_A%7CMCOPTOUT-1492428309s%7CNONE%7CMCAID%7CNONE; utag_main=v_id:015b7a8460ef0018b64da5aac39105072001f06a009dc$_sn:4$_ss:0$_st:1492422915007$ses_id:1492421109276%3Bexp-session$_pn:1%3Bexp-session; s_pers=%20s_vnum%3D1493568000355%2526vn%253D4%7C1493568000355%3B%20c4%3DPRODUCT%257C%25E8%25AE%25AD%25E7%25BB%2583%2520%25E7%2594%25B7%25E5%25AD%2590%2520CRAZYPOWER%2520TR%2520M%2520%25E8%25AE%25AD%25E7%25BB%2583%25E9%259E%258B%25201%25E5%258F%25B7%25E9%25BB%2591%25E8%2589%25B2%2520BA8929%7C1492422916809%3B%20s_invisit%3Dtrue%7C1492422916809%3B; s_sq=ag-adi-cn-prod%3D%2526pid%253DPRODUCT%25257C%2525E8%2525AE%2525AD%2525E7%2525BB%252583%252520%2525E7%252594%2525B7%2525E5%2525AD%252590%252520CRAZYPOWER%252520TR%252520M%252520%2525E8%2525AE%2525AD%2525E7%2525BB%252583%2525E9%25259E%25258B%2525201%2525E5%25258F%2525B7%2525E9%2525BB%252591%2525E8%252589%2525B2%252520BA8929%2526pidt%253D1%2526oid%253Dfunctiononclick%252528event%252529%25257Bga%252528%252527send%252527%25252C%252527event%252527%25252C%252527cart%252527%25252C%252527add%252527%25252C%252527product%252527%25252C999%252529%25253B%25257D%2526oidt%253D2%2526ot%253DA""",
        "DNT": "1",
        "Host": "www.adidas.com.cn",
        "Origin": "http://www.adidas.com.cn",
        "Referer": url_goods,
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
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

    for k in header:
        req.add_header(k, header[k])

    ck_str = "; ".join([ck.name + '=' + ck.value for ck in cookie])

    print ck_str
    print '=== {:=<120}'.format('')
    print """AMCVS_7ADA401053CCF9130A490D4C%40AdobeOrg=1; frontend=12hbeb3fuu79c5l7ab4742hdb4; bm_mi=12ADFB6208940BCE2193218635F25E3A~8rFavYX+xiyYOfIr/2+s0V8ZdKsuDY9HLf738Y/JuS84OYUZoIRmdAwgpboZ1d2z3bWHVuvwNEPNJR2ytl6qrwOhFGJz3h+8v6EmA/m1seZSYvapUkCjlOjZsdWqLK+aoyl71rVqRpcF4YNAJAhasZaWm76+VfXCcUDCfaZjeS8aePZSt97q0+EUeso4GhZZbAR3pubMQFZK0WguJMsAQMwsFiFAHwAweBrIpXs1a740OdULRq2RS7sySwLgcCUJujwpQg4I55K2qZP77nziuw==; _ga=GA1.3.2078715433.1492409146; _gat=1; frontend=12hbeb3fuu79c5l7ab4742hdb4; ak_bmsc=C0BD4FE9DAC738708E0F1EBFF91FB945D2C07405167E0000D07DF458F5E6D27A~plDooHUTz2rGE/PAff/s76hFJ3DE2Cm0aMxD5FuqQJDAlv5ZGiPbZLiKJ3esH6HcY1e2AmtVZc8FfTJOa+2apFSvRtJwYOR9TUm03QMf/TQIZ+LDZRz12XFHmnrryPAEdZwxpErUl+35S6LHRSowvS6YZZ4xAIxUrNN3GhYviz8FsvBEILa6GMf2uZY/DVy4kKl8NB638tB2raVexeOYt2qMlnLxCld8SCao4NLV3oyavjCAV2NUnUquxXYbuGpRLe; s_cc=true; AMCV_7ADA401053CCF9130A490D4C%40AdobeOrg=-227196251%7CMCIDTS%7C17274%7CMCMID%7C17910393991056621116170894073392298807%7CMCAAMLH-1493013948%7C11%7CMCAAMB-1493025909%7CNRX38WO0n5BH8Th-nqAG_A%7CMCOPTOUT-1492428309s%7CNONE%7CMCAID%7CNONE; utag_main=v_id:015b7a8460ef0018b64da5aac39105072001f06a009dc$_sn:4$_ss:0$_st:1492422915007$ses_id:1492421109276%3Bexp-session$_pn:1%3Bexp-session; s_pers=%20s_vnum%3D1493568000355%2526vn%253D4%7C1493568000355%3B%20c4%3DPRODUCT%257C%25E8%25AE%25AD%25E7%25BB%2583%2520%25E7%2594%25B7%25E5%25AD%2590%2520CRAZYPOWER%2520TR%2520M%2520%25E8%25AE%25AD%25E7%25BB%2583%25E9%259E%258B%25201%25E5%258F%25B7%25E9%25BB%2591%25E8%2589%25B2%2520BA8929%7C1492422916809%3B%20s_invisit%3Dtrue%7C1492422916809%3B; s_sq=ag-adi-cn-prod%3D%2526pid%253DPRODUCT%25257C%2525E8%2525AE%2525AD%2525E7%2525BB%252583%252520%2525E7%252594%2525B7%2525E5%2525AD%252590%252520CRAZYPOWER%252520TR%252520M%252520%2525E8%2525AE%2525AD%2525E7%2525BB%252583%2525E9%25259E%25258B%2525201%2525E5%25258F%2525B7%2525E9%2525BB%252591%2525E8%252589%2525B2%252520BA8929%2526pidt%253D1%2526oid%253Dfunctiononclick%252528event%252529%25257Bga%252528%252527send%252527%25252C%252527event%252527%25252C%252527cart%252527%25252C%252527add%252527%25252C%252527product%252527%25252C999%252529%25253B%25257D%2526oidt%253D2%2526ot%253DA"""

    print '=== {:=<120}'.format('')
    req.add_header('Cookie', ck_str)
    print req.headers['Cookie']

    # print_req(req)
    # print_data(data)

    print "Cart add before request"
    resp = opener.open(req, json.dumps(data))

    print "Cart after before request"
    print_resp(resp)

    # 解决gzip乱码问题
    # if resp.info().get('Content-Encoding') == 'gzip':
    #     buf = StringIO(resp.read())
    #     f = gzip.GzipFile(fileobj=buf)
    #     data = f.read()
    #     print data
    # else:
    #     print resp.read()


def cart_add2():
    url = 'http://www.adidas.com.cn/checkout/cart/add/'
    req = urllib2.Request(url)

    header = header_set
    for k in header:
        req.add_header(k, header[k])
    for ck in cookie:
        req.add_header(ck.name, ck.value)

    data = {
        "token": get_product_token('333133'),
        "isajax": "yes",
        "release2": "yes",
        "product": "333133",
        "super_attribute[185]": "53",
        "qty": "1",
    }

    resp = opener.open(req, json.dumps(data))

    print_resp(resp)
    print_cookie(cookie)



def cart_show():
    url = 'https://www.adidas.com.cn/specific/Ajaxshoppingcart/arvatoAjaxCart/'
    req = urllib2.Request(url)

    for k in header_set:
        req.add_header(k, header_set[k])
    resp = opener.open(req)

    # 解决gzip乱码问题
    if resp.info().get('Content-Encoding') == 'gzip':
        buf = StringIO(resp.read())
        f = gzip.GzipFile(fileobj=buf)
        data = f.read()
        print data
    else:
        print resp.read()


def cart_show2():
    url = "https://www.adidas.com.cn/specific/Ajaxshoppingcart/arvatoAjaxCart/"
    req = urllib2.Request(url)

    header = header_set
    for k in header:
        req.add_header(k, header[k])
    for ck in cookie:
        req.add_header(ck.name, ck.value)
    print_req(req)

    resp = opener.open(req)


    # 解决gzip乱码问题
    if resp.info().get('Content-Encoding') == 'gzip':
        buf = StringIO(resp.read())
        f = gzip.GzipFile(fileobj=buf)
        data = f.read()
        print data
    else:
        print resp.read()

def get_product_token(product_id):
    url = "http://www.adidas.com.cn/specific/product/ajaxview/?id=" + product_id
    req = urllib2.Request(url)

    header = header_set
    for k in header:
        req.add_header(k, header[k])
    resp = opener.open(req)

    # 解决gzip乱码问题
    page_content = ""
    if resp.info().get('Content-Encoding') == 'gzip':
        buf = StringIO(resp.read())
        f = gzip.GzipFile(fileobj=buf)
        page_content = f.read()
    else:
        page_content = resp.read()

    import re
    pattern = r'.*\<input\stype\=\"hidden\"\sname\=\"token\"\svalue\=\"(.*)\"\s\/\>.*'
    results = re.findall(pattern, page_content)
    token = ''
    if results:
        token = results[0]
    print '\nTOKEN=', token, '\n'
    return token


if __name__ == '__main__':
    print ">>> 1"
    get_adi_cookie()
    print_cookie(cookie)

    print ">>> 3"
    cart_show()
    print_cookie(cookie)

    print ">>> 2"
    cart_add()
    print_cookie(cookie)

    print ">>> 3"
    cart_show()
    print_cookie(cookie)
    exit()




    print ">>> 2"
    cart_add()
    print_cookie(cookie)
    print ">>> 3"
    cart_show()
    print_cookie(cookie)

