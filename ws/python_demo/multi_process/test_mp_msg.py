from multiprocessing import Pool, Queue
import os
import random
import time

def long_time_task(name, q):
    print('[STR]   Run task %s (%s)...' % (name, os.getpid()))
    start = time.time()
    # YOUR WORK =======================================================
    q.put('{} -> {}'.format(name, os.getpid()))
    # YOUR WORK -------------------------------------------------------
    end = time.time()
    print('[END]   Task %s runs %0.2f seconds.' % (name, (end - start)))

if __name__ == '__main__':
    print('Parent process %s.' % os.getpid())
    q = Queue()
    n = os.cpu_count()
    p = Pool(n)
    for i in range(n):
        p.apply_async(long_time_task, args=(i, q))
    print('Waiting for all subprocesses done...')
    p.close()
    p.join()
    print('All subprocesses done.')
    try:
        print(q.get())
    except Exception:
        raise
