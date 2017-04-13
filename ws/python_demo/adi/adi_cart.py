# coding:utf-8
from StringIO import StringIO
import gzip
import cookielib
import urllib2
import json

url = "https://www.adidas.com.cn/specific/Ajaxshoppingcart/arvatoAjaxCart/"
cookie = cookielib.CookieJar()
handler = urllib2.HTTPCookieProcessor(cookie)
opener = urllib2.build_opener(handler)
urllib2.install_opener(opener)


sets = {
    'chrome_default': {
        "accept": "application/json",
        "accept-encoding": "gzip, deflate",
        "accept-language": "en-US,en;q=0.8",
        "user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
    },
    'set': {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, sdch, br',
        'Accept-Language': 'zh-CN,zh;q=0.8',
        'Connection': 'keep-alive',
        'Cookie': 'AMCVS_7ADA401053CCF9130A490D4C%40AdobeOrg=1; Hm_lvt_690ef42ff30759b60f6c189b11f82369=1487124597; Hm_lpvt_690ef42ff30759b60f6c189b11f82369=1487124608; Hm_lvt_c29ad6ea0a27499743676357b8867377=1487124597; Hm_lpvt_c29ad6ea0a27499743676357b8867377=1487124608; _ga=GA1.3.1840654100.1487082266; s_sq=%5B%5BB%5D%5D; frontend=rs7gv1u1f2uk6s9nbtfkgp67a7; s_pers=%20s_vnum%3D1488297600943%2526vn%253D3%7C1488297600943%3B%20c4%3DSHOPPING%2520CART%257CCART%7C1487126728037%3B%20s_invisit%3Dtrue%7C1487126728039%3B; s_cc=true; akavpau_jhkrth=1487255035~id=d583e52b29d7ef4762eea99a5d69f0f7; ak_bmsc=A5B0A11437AE16BCFDBDFAB619B2903873E7093C05130000CFB4A558983F9C62~plJmMcHqVpVSETTb1btGX0b9iVANdByR+8geqI8WB2bXrsdiZULKW+LwD2w3vYHopsBRIHYC1Yk84XFxNFb5ivsz/w1uWcByzQq760UcyG3/grdtriCdIVumi8tlxMQ8Hulu53gk4hgbriZOng/SQW7d5LoxN0RbKyaDPX2lKgt/kDpEdK52svtqEfFyrC9lkOhmcYyxbZWIu625J3lZYGKOa2BztpDinkxG0kXzeInu8=; utag_main=v_id:015a3d029ef90003c3e44d2910e10507100190690086e$_sn:4$_ss:1$_st:1487256536993$ses_id:1487254736993%3Bexp-session$_pn:1%3Bexp-session; AMCV_7ADA401053CCF9130A490D4C%40AdobeOrg=-227196251%7CMCIDTS%7C17214%7CMCMID%7C46375031874650361443390622865987804551%7CMCAAMLH-1487687066%7C11%7CMCAAMB-1487859537%7CcIBAx_aQzFEHcPoEv0GwcQ%7CMCOPTOUT-1487261937s%7CNONE%7CMCAID%7CNONE',
        'DNT': '1',
        'Host': 'www.adidas.com.cn',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
    },
    'set2': {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, sdch",
        "Accept-Language": "zh-CN,zh;q=0.8",
        "Connection": "keep-alive",
        "Cookie": "AMCVS_7ADA401053CCF9130A490D4C%40AdobeOrg=1; Hm_lvt_690ef42ff30759b60f6c189b11f82369=1487124597; Hm_lpvt_690ef42ff30759b60f6c189b11f82369=1487124608; Hm_lvt_c29ad6ea0a27499743676357b8867377=1487124597; Hm_lpvt_c29ad6ea0a27499743676357b8867377=1487124608; AMCV_7ADA401053CCF9130A490D4C%40AdobeOrg=-227196251%7CMCIDTS%7C17214%7CMCMID%7C46375031874650361443390622865987804551%7CMCAAMLH-1487687066%7C11%7CMCAAMB-1487859537%7CcIBAx_aQzFEHcPoEv0GwcQ%7CMCOPTOUT-1487261937s%7CNONE%7CMCAID%7CNONE; akavpau_jhkrth=1487256555~id=7e3e8fdd69afcff744f569e15a7b98a9; s_cc=true; _ga=GA1.3.1840654100.1487082266; frontend=rs7gv1u1f2uk6s9nbtfkgp67a7; utag_main=v_id:015a3d029ef90003c3e44d2910e10507100190690086e$_sn:4$_ss:0$_st:1487258096994$ses_id:1487254736993%3Bexp-session$_pn:8%3Bexp-session; frontend=rs7gv1u1f2uk6s9nbtfkgp67a7; ak_bmsc=A5B0A11437AE16BCFDBDFAB619B2903873E7093C05130000CFB4A558983F9C62~plTdWEJUWv6t9QH+vUiAL2yQZHa79TlRjnVzBonvK93cAqkORAJDnqDVSkvO3vgtOk7CbnpHz4oulhyErYcsoDnHpMTsgg7zpDcB8tOzkc0w1CcIERJtV0WVyYRQ9jW6GNjm8aasWMB67ftCf8kvRTlKm64BxnxhPe62813svlQydbPpFXYdsokbkesNgNk2YDYuAyjJlv6GONH6agZfEuyyvNYEUit0KPFEWVZdAGR/NiWNeY1/907RjOV5t7+fI7; s_pers=%20s_vnum%3D1488297600943%2526vn%253D4%7C1488297600943%3B%20c4%3DPRODUCT%257C%25E8%25B7%2591%25E6%25AD%25A5%2520%25E7%2594%25B7%25E5%25A5%25B3%2520PUREBOOST%2520%25E8%25B7%2591%25E6%25AD%25A5%25E9%259E%258B%25201%25E5%258F%25B7%25E9%25BB%2591%25E8%2589%25B2%2520BA8899%7C1487258847805%3B%20s_invisit%3Dtrue%7C1487258847806%3B; s_sq=ag-adi-cn-prod%3D%2526pid%253DPRODUCT%25257C%2525E8%2525B7%252591%2525E6%2525AD%2525A5%252520%2525E7%252594%2525B7%2525E5%2525A5%2525B3%252520PUREBOOST%252520%2525E8%2525B7%252591%2525E6%2525AD%2525A5%2525E9%25259E%25258B%2525201%2525E5%25258F%2525B7%2525E9%2525BB%252591%2525E8%252589%2525B2%252520BA8899%2526pidt%253D1%2526oid%253Dhttp%25253A%25252F%25252Fwww.adidas.com.cn%25252Fcheckout%25252Fcart%25252F%2526ot%253DA",
        "DNT": "1",
        "Host": "www.adidas.com.cn",
        "Referer": "http://www.adidas.com.cn/ba8899",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
    },
    "set3": {
        "header": {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate, sdch",
            "Accept-Language": "zh-CN,zh;q=0.8",
            "Connection": "keep-alive",
            "Cookie": "AMCVS_7ADA401053CCF9130A490D4C%40AdobeOrg=1; Hm_lvt_690ef42ff30759b60f6c189b11f82369=1487124597; Hm_lpvt_690ef42ff30759b60f6c189b11f82369=1487124608; Hm_lvt_c29ad6ea0a27499743676357b8867377=1487124597; Hm_lpvt_c29ad6ea0a27499743676357b8867377=1487124608; AMCV_7ADA401053CCF9130A490D4C%40AdobeOrg=-227196251%7CMCIDTS%7C17214%7CMCMID%7C46375031874650361443390622865987804551%7CMCAAMLH-1487687066%7C11%7CMCAAMB-1487859537%7CcIBAx_aQzFEHcPoEv0GwcQ%7CMCOPTOUT-1487261937s%7CNONE%7CMCAID%7CNONE; akavpau_jhkrth=1487256555~id=7e3e8fdd69afcff744f569e15a7b98a9; s_cc=true; _ga=GA1.3.1840654100.1487082266; frontend=rs7gv1u1f2uk6s9nbtfkgp67a7; utag_main=v_id:015a3d029ef90003c3e44d2910e10507100190690086e$_sn:4$_ss:0$_st:1487258096994$ses_id:1487254736993%3Bexp-session$_pn:8%3Bexp-session; frontend=rs7gv1u1f2uk6s9nbtfkgp67a7; ak_bmsc=A5B0A11437AE16BCFDBDFAB619B2903873E7093C05130000CFB4A558983F9C62~plTdWEJUWv6t9QH+vUiAL2yQZHa79TlRjnVzBonvK93cAqkORAJDnqDVSkvO3vgtOk7CbnpHz4oulhyErYcsoDnHpMTsgg7zpDcB8tOzkc0w1CcIERJtV0WVyYRQ9jW6GNjm8aasWMB67ftCf8kvRTlKm64BxnxhPe62813svlQydbPpFXYdsokbkesNgNk2YDYuAyjJlv6GONH6agZfEuyyvNYEUit0KPFEWVZdAGR/NiWNeY1/907RjOV5t7+fI7; s_pers=%20s_vnum%3D1488297600943%2526vn%253D4%7C1488297600943%3B%20c4%3DPRODUCT%257C%25E8%25B7%2591%25E6%25AD%25A5%2520%25E7%2594%25B7%25E5%25A5%25B3%2520PUREBOOST%2520%25E8%25B7%2591%25E6%25AD%25A5%25E9%259E%258B%25201%25E5%258F%25B7%25E9%25BB%2591%25E8%2589%25B2%2520BA8899%7C1487258847805%3B%20s_invisit%3Dtrue%7C1487258847806%3B; s_sq=ag-adi-cn-prod%3D%2526pid%253DPRODUCT%25257C%2525E8%2525B7%252591%2525E6%2525AD%2525A5%252520%2525E7%252594%2525B7%2525E5%2525A5%2525B3%252520PUREBOOST%252520%2525E8%2525B7%252591%2525E6%2525AD%2525A5%2525E9%25259E%25258B%2525201%2525E5%25258F%2525B7%2525E9%2525BB%252591%2525E8%252589%2525B2%252520BA8899%2526pidt%253D1%2526oid%253Dhttp%25253A%25252F%25252Fwww.adidas.com.cn%25252Fcheckout%25252Fcart%25252F%2526ot%253DA",
            "DNT": "1",
            "Host": "www.adidas.com.cn",
            "Referer": "http://www.adidas.com.cn/ba8899",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
        },
        "data": {
            "token": "84e95246f5a9c8c573870e62443092a0",
            "isajax": "yes",
            "release2": "yes",
            "product": "333132",
            "super_attribute[185]": "43",
            "qty": "9"
        },
        "url": "http://www.adidas.com.cn/checkout/cart/add/"
    }
}


req = urllib2.Request(sets['set3']['url'])

header = sets['set3']['header']
for k in header:
    req.add_header(k, header[k])

print '=== {:=<120}'.format('REQUEST HEADER ')
for h in req.headers:
    print '    {:<20}: {}'.format(h, req.headers[h])
print '\n'

resp = urllib2.urlopen(req, json.dumps(sets['set3']['data']))

print '=== {:=<120}'.format('RESPONSE HEADER ')
infos = resp.info()
for inf in infos:
    nm, val = inf, infos[inf]
    print '    {:<20}: {}'.format(nm, val)
print '\n'

print '=== {:=<120}'.format('COOKIE ')
for ck in cookie:
    print '    {:<20}: {}'.format(ck.name, ck.value)
print '\n'

# 解决gzip乱码问题
if resp.info().get('Content-Encoding') == 'gzip':
    buf = StringIO(resp.read())
    f = gzip.GzipFile(fileobj=buf)
    data = f.read()
    print data
else:
    print resp.read()



# def http_get(url):
#     req = urllib2.Request(url)
#     print '=== {:=<120}'.format('REQUEST HEADER ')
#     for h in req.headers:
#         print '    {:<20}: {}'.format(h, req.headers[h])
#     print '\n'

#     resp = urllib2.urlopen(req)

#     print '=== {:=<120}'.format('RESPONSE HEADER ')
#     infos = resp.info()
#     for inf in infos:
#         nm, val = inf, infos[inf]
#         print '    {:<20}: {}'.format(nm, val)
#     print '\n'

#     print '=== {:=<120}'.format('COOKIE ')
#     for ck in cookie:
#         print '    {:<20}: {}'.format(ck.name, ck.value)
#     print '\n'

# http_get('http://www.adidas.com.cn/checkout/cart/')

# http_get('https://www.adidas.com.cn/specific/Ajaxshoppingcart/arvatoAjaxCart/')


# def cart_list():
#     url = "https://www.adidas.com.cn/specific/Ajaxshoppingcart/arvatoAjaxCart/"