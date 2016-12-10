# -*- coding: utf-8 -*-

'''
def my_abs(x):
    if not isinstance(x, (int, float)):
        raise TypeError('bad operand type')
    if x >= 0:
        return x
    else:
        return -x

my_abs('A')
'''

'''
baseDict = 'abcdefghijklmnopqrstuvwxyz'
baseDict += baseDict.upper()
for m in range(10):
    baseDict += str(m)
'''

baseDict = 'asdfasdf'

print u'【基本库】' + baseDict

def guess_pwd(now_dict=None):
    if now_dict is None:
        now_dict = ['']
    new_dict = [baseKey + nowKey for baseKey in baseDict for nowKey in now_dict]
    for guess in new_dict:
        #print u'猜' + guess
        if len(guess) > 9:
            print u'当前词典长度为%s' % len(new_dict)
            return u'【破解失败】尝试长度超过设定位数，放弃'
        if guess == pwd:
            return u'【破解成功】密码为：' + guess

    # 新全组合中未找到pwd，传递新词典到下一层
    return guess_pwd(new_dict)

pwd = 'asdfasdf'

print guess_pwd()
