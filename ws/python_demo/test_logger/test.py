import logging.config
from multiprocessing import Process
from time import sleep


def log(idx):

	logging.config.fileConfig("logging.config")
	logger = logging.getLogger("main")

	while True:
		try:
			logger.info(idx)
		except KeyboardInterrupt:
			break


if __name__ == '__main__':
	ps = []
	for i in range(2):
		p = Process(target=log, args=(i,))
		p.deamon = True
		p.start()
		ps.append(p)
	for p in ps:
		p.join()

