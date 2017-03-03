from multiprocessing import Process
import time

def f(name, idx):
    print 'hello', name, idx
	# time.sleep(1)
    print 'enddd', name, idx

if __name__ == '__main__':
	for idx in range(10):
	    p = Process(target=f, args=('bob', idx))
	    p.start()
	    p.join()