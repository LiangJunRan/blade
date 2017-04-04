#coding=utf-8
'''
Created on 2017年2月6日

@author: sheng-hua.hu@hp.com

'''
import logging.config

logging.config.fileConfig("../conf/logging.config")
logger = logging.getLogger("main")

#level DEBUG < INFO < WARNING < ERROR < CRITICAL
logger.info("DEBUG test")
logger.debug("INFO test")
logger.warning("WARNING test")
logger.error("ERROR test")
logger.critical("CRITICAL test")

def aaa():
    print("aaaa")
