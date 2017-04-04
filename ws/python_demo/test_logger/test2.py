import logging.config


if __name__ == '__main__':
	logging.config.fileConfig("logging.config")
	logger = logging.getLogger("main")

	while True:
		logger.info('BBBBBBBBBBBBBBBBBBBBBBBB')

