#coding:utf8
#author: TooNTonG 2012-11-07

import logging
import logging.handlers as handlers
from multiprocessing import Process

APP_NAME = 'APP-'
LOG_SVR_HOST = '127.0.0.1'
LOG_SVR_PORT = 20001

# 此logger name必需与服务端中有相应的logger处理handler
# 如果服务端logging.getLogger()返回空，会使用root处理
LOGGER_NAME = 'main'

def getSocketLogger(name, level, host, port, memoryCapacity):
    target = handlers.SocketHandler(host, port)
    if memoryCapacity > 0:

        hdlr = handlers.MemoryHandler(memoryCapacity,
                                    logging.ERROR, # 此参数是指遇到此级别时，马上flush
                                    target)
    else:
        hdlr = target

    hdlr.setLevel(level)
    logger = logging.getLogger(name)
    logger.addHandler(hdlr)
    logger.setLevel(level)
    return logger

def send_log(idx):
    logger = getSocketLogger(LOGGER_NAME,
                             logging.DEBUG, # 如果使用NOTSET，相当warning
                             host = LOG_SVR_HOST,
                             port = LOG_SVR_PORT,
                             memoryCapacity = 1024)
    while True:
        logger.info('run %s main' % APP_NAME + str(idx))
        logger.debug('thisis the debug log by %s' % APP_NAME + str(idx))
        logger.warning('thisis the warning log by %s' % APP_NAME + str(idx))
        logger.error('thisis the error log by %s' % APP_NAME + str(idx))
        logger.critical('thisis the critical log by %s' % APP_NAME + str(idx))

def main():
    ps = []
    for i in range(2):
        p = Process(target=send_log, args=(i,))
        p.daemon = True
        p.start()
        ps.append(p)
    for p in ps:
        p.join()
    print 'end main'

if '__main__' == __name__:
    main()