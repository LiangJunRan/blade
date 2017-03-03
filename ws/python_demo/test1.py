from multiprocessing import Pool
import os, time, random


def p_task(name):
    s = random.random() * 4
    print('task run %s, sleep %.2f s', name, s)
    # time.sleep(s)
    print('task end')

def run():
    p = Pool(10)
    for i in range(10):
        print('i=%d', i)
        p.apply_async(p_task, args=(1, ))
    p.close()
    p.join()
    print('All subprocesses done.')


if __name__ == '__main__':
    # import itertools;
    # a = ['1', '2', '3'];
    # b = 3;
    # print([''.join(x) for x in itertools.product(*[a] * b)])
    run()
