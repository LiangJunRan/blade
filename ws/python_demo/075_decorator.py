# coding=utf-8
__author__ = 'l63913'


# This is a decorator
# def log(func):
#     def wrapper(*args, **kw):
#         print 'call %s():' % func.__name__
#         return func(*args, **kw)
#     return wrapper

# def log(text):
#     def decorator(func):
#         def wrapper(*args, **kw):
#             print '%s %s():' % (text, func.__name__)
#             return func(*args, **kw)
#         return wrapper
#     return decorator

# 为了解决now.__name__输出'wrapper'的问题，完整的装饰器应该如下
import functools

def log(func):
    @functools.wraps(func)
    def wrapper(*args, **kw):
        print 'call %s():' % func.__name__
        return func(*args, **kw)
    return wrapper

# 或

def log(text):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kw):
            print '%s %s' % (text, func.__name__)
            return wrapper
        return decorator

# 把@log放在now()的定义处，相当于执行了now = log(now)
# @log
@log('execute')
def now():
    print '2016-03-14'

f = now
f()

# __name__是函数的名字
# print now.__name__
# print f.__name__
