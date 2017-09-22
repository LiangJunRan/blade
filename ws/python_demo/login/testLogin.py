import requests
# import http


# cj = http.cookiejar.Cookiejar()


# r = requests.get('http://passport.kaolawu.com/doLogin?username=guxin_next@163.com&password=654321&gotoURL=http://www.kaolawu.com')

# cookies = requests.utils.dict_from_cookiejar(r.cookies)

# print cookies

# # cookies = requests.utils.cookiejar_from_dict(cookie_dict, cookiejar=None, overwrite=True)

# s = requests.Session()

# s.cookies = cookies

r = requests.get('http://www.kaolawu.com/exam/detection?classCode=VTE1131&studentCode=VBJ100052&classExamId=1987')

print r.content
