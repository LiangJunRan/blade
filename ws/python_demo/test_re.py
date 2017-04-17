import re

test_str = """ydown="if(event.keyCode==13)return false;"  action="http://www.adidas.com.cn/checkout/cart/add/" method="post" id="product_addtocart_form">\r\n\t<!--start product size-->\r\n\t<input type="hidden" name="token" value="48d75bbc621e0cd34a4f75934f01aa46" />\r\n\t<input type="hidden" name="isajax" value="yes" />\r\n        <input type="hidden" name="release2" value="yes" />\r\n\t<input type="hidden" name="product" value="333133" />\r\n\t<div class="pdpSizeBox cf">\r\n<!--\t\t<p class="pdpSizeTxt"><a href="#sizechart" style=\'color: #0286cd;\'>\xe5\xb0\xba\xe7\xa0\x81\xe8\xa1\xa8</a></p>-->\r\n                 <a href="javascript:;" title="\xe5\xb0\xba\xe7\xa0\x81\xe8\xa1\xa8" class="pdpSizeTxt">\xe5\xb0\xba\xe7\xa0\x81\xe8\xa1\xa8</a>\r\n\t\t"""

pattern = r'.*\<input\stype\=\"hidden\"\sname\=\"token\"\svalue\=\"(.*)\"\s\/\>.*'

print re.findall(pattern, test_str)[0]