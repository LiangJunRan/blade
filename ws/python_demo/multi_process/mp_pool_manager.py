import multiprocessing as mp

def task(idx, q):
	q.put(idx)

if __name__ == '__main__':
	n = 100
	q = mp.Manager().Queue()
	p = mp.Pool(n)
	for i in range(n):
		p.async_apply()