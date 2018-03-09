# coding=utf-8
import cookielib
import urllib
import urllib2
import gzip
import StringIO
import time


def cookie_save_to_file():
    filename = 'cookie.txt'
    cookie = cookielib.MozillaCookieJar(filename)
    cookie_support_handler = urllib2.HTTPCookieProcessor(cookie)
    opener = urllib2.build_opener(cookie_support_handler, urllib2.HTTPHandler)
    urllib2.install_opener(opener)

    # 登陆start

    url_login = 'http://passport.kaolawu.com/doLogin'
    headers = {
        "accept": "application/json",
        "accept-encoding": "gzip, deflate",
        "accept-language": "en-US,en;q=0.8",
        "user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) " +
                      "Chrome/56.0.2924.87 Safari/537.36",
    }
    post_data = {"username": "guxin_next@163.com", "password": "654321", "gotoURL": "http://www.kaolawu.com"}

    post_data_str = urllib.urlencode(post_data)
    req = urllib2.Request(url_login, data=post_data_str, headers=headers)
    response = opener.open(req)

    print 'loginResp: ' + response.read()

    cookie.save(ignore_discard=True, ignore_expires=True)
    # 登陆end

    # 生成cookie后使用cookie再次访问的方法
    def go(url, data=None):
        headers_dict = {
            "Host": "www.kaolawu.com",
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "DNT": "1",
            "Referer": "http://www.kaolawu.com/ls_new/main?stuCode=VBJ104331",
            # "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8"
        }

        data_param = None
        if data:
            data_param = urllib.urlencode(data)

        rqst = urllib2.Request(url, headers=headers_dict, post_data=data_param)
        rsps = opener.open(rqst)
        return rsps

    def go_multipart_form_data(url, data_dict=None):
        boundary = '----------%s' % hex(int(time.time() * 1000))

        data = []
        data.append('--%s' % boundary)

        for key, value in data_dict.items():
            # 上传文件
            # if type(value) == file:
            #     fname = value.name.split('/')[-1]
            #     data.append('Content-Disposition: form-data; name="%s"; filename="%s"' % (key, fname))
            #     data.append('Content-Type: %s\r\n' % 'audio/mp3')
            #     data.append(value.read())
            #     value.close()

            # 附加信息
            # else:
            data.append('Content-Disposition: form-data; name="%s"\r\n' % key)
            data.append(value)
            data.append('--%s' % boundary)

        f = open('E:/ws/blade/ws/html/files/Speaking_Q2_Heading.mp3', 'rb')
        fname = f.name.split('/')[-1]
        data.append('Content-Disposition: form-data; name="%s"; filename="%s"' % ('file', fname))
        data.append('Content-Type: %s\r\n' % 'audio/mp3')
        data.append(f.read())
        f.close()

        http_body = '\r\n'.join(data)

        rqst = urllib2.Request(url, data=http_body)
        rqst.add_header('Content-Type', 'multipart/form-data; boundary=%s' % boundary)
        rqst.add_header('User-Agent', "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36")
        rqst.add_header('Referer', 'http://www.kaolawu.com/ls_new/main?stuCode=VBJ104331')

        rsps = opener.open(rqst, timeout=60)
        return rsps

    # fr = open(r'/var/qr/b.png', 'rb')
    # data.append('Content-Disposition: form-data; name="%s"; filename="b.png"' % 'profile')
    # data.append('Content-Type: %s\r\n' % 'image/png')
    # data.append(fr.read())
    # fr.close()
    # data.append('--%s--\r\n' % boundary)

    print '>>>' + go_multipart_form_data('http://upload.kaolawu.com/exam/saveVoiceFile', {
        # 'u': '666d06ab544e4bf5bfb2fe27364ecca2',
        # 'key': 'e3b21cbd-5689-496c-8db2-ce14bb3c0497',
        # 'timuId': '544',
        # 'userId': '2',
        # 'audio1.mp3': audio
    })



# 解决gzip乱码问题
def trans_response(resp):
    if resp.info().get('Content-Encoding') == 'gzip':
        buf = StringIO(resp.read())
        f = gzip.GzipFile(fileobj=buf)
        data = f.read()
        return data
    else:
        return resp.read()

if __name__ == '__main__':
    print 'start'
    cookie_save_to_file()
    print 'end'
