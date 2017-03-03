from multiprocessing import Pool, Process, Value, Manager
from time import sleep, time
from random import random

manager = Manager()
mv = manager.Value('i', 0)

v = Value('i', 0)

def task(idx, mv, v):
    mv.value = mv.value + idx
    v.value = v.value + idx
    # print idx, mv.value

def run():
    n = 200

    p = Pool(n)
    for i in range(n):
        p.apply_async(task, (i, mv, v))
    p.close()
    p.join()

    print 'done', mv.value, v.value

if __name__ == "__main__":
    run()
