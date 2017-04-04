__author__ = 'l63913'

from multiprocessing.managers import BaseManager
import logging.config


host = '127.0.0.1'
port = 9030
authkey = 'secret'.encode('utf-8')


class RemoteManager(BaseManager):
    pass


def start_server():
    logging.config.fileConfig("../conf/logging.config")
    logger = logging.getLogger("main")
    RemoteManager.register('get_logger', callable=lambda: logger)
    mgr = RemoteManager(address=('0.0.0.0', port), authkey=authkey)

    server = mgr.get_server()
    print('Server is ready')
    try:
        server.serve_forever()
    except Exception as e:
        print(e)
        exit(-1)


class RemoteManager(BaseManager):
    pass


def start_client(idx, lock):
    RemoteManager.register('get_logger')
    mgr = RemoteManager(address=(host, port), authkey=authkey)
    mgr.connect()

    for _i in range(20):
        lock.acquire()
        try:
            mgr.get_logger().error('>>> %d <<< %d' % (idx, _i))
        finally:
            lock.release()


if __name__ == '__main__':
    # logger = logging.getLogger("main")
    # logger2 = logging.getLogger("main")
    # logger.error('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    # logger2.error('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')
    # exit()

    from multiprocessing import Process
    from time import sleep
    from multiprocessing import Lock
    l = Lock()

    p = Process(target=start_server)
    p.daemon = True
    p.start()

    ps = []
    for i in range(500):
        p = Process(target=start_client, args=(i, l))
        p.daemon = True
        ps.append(p)
    [p.start() for p in ps]
    [p.join() for p in ps]

    sleep(30)
