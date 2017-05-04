from multiprocessing import Pool

def task(idx):
	while True:
		for i in range(99999):
			idx += i

if __name__ == '__main__':
	pl = Pool()

	for i in range(4):
		pl.apply_async(task, args=(i,))
	pl.close()
	pl.join()