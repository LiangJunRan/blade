import logging
from multiprocessing import Pool, Process


# 第一步，创建一个logger
logger = logging.getLogger()
logger.setLevel(logging.INFO)    # Log等级总开关

# 第二步，创建一个handler，用于写入日志文件
logfile = 'logger.txt'
fh = logging.FileHandler(logfile, mode='a')
fh.setLevel(logging.DEBUG)   # 输出到file的log等级的开关

# 第三步，再创建一个handler，用于输出到控制台
ch = logging.StreamHandler()
ch.setLevel(logging.WARNING)   # 输出到console的log等级的开关

# 第四步，定义handler的输出格式
formatter = logging.Formatter("%(process)-7s | %(asctime)s - %(filename)s:%(lineno)-5d - %(levelname)-10s: %(message)s")
fh.setFormatter(formatter)
ch.setFormatter(formatter)

# 第五步，将logger添加到handler里面
logger.addHandler(fh)
logger.addHandler(ch)

def log(idx):
	logger.debug(str(idx))
	logger.info(str(idx))
	logger.warning(str(idx))
	logger.error(str(idx))
	logger.critical(str(idx))

if __name__ == '__main__':
	# for i in range(100):
	# 	log(i)


	for i in range(100):
		p = Process(target=log, args=(i,))
		p.deamon = True
		p.start()
	for i in range(100):
		p.join()


	# p = Pool(100)
	# for i in range(100):
	# 	p.apply_async(log, (i,))
	# p.close()
	# p.join()

