#coding:utf-8
import Queue
import threading
import time
import random

class Nas:
	def __init__(self, schema, idx):
		self.idx = idx
		print '[{:0>2}]NAS init...'.format(idx)
		time.sleep(3 + random.random())
		print '[{:0>2}]NAS init done.'.format(idx)

	def exe(self):
		print '[{:0>2}]NAS exe...'.format(idx)
		time.sleep(3 + random.random())
		print '[{:0>2}]NAS exe done.'.format(idx)

	def close(self):
		return True

def na_queue(idx):
	while True:
		if not q.full():
			na =  Nas('local', idx)
			q.put(na)
			q.task_done()	# 通知已完成
			print '[{:0>2}] push in q_na qsize={}'.format(idx, q.qsize())
		else:
			time.sleep(1 + random.random())

def na_server(limit):
	for i in range(limit):
		na_server = threading.Thread(target=na_queue, args=(i, ))
		na_server.setDaemon(True)
		na_server.start()

if __name__ == '__main__':
	q = Queue.Queue(3)
	na_server(1)
	na = q.get()
	na.exe()
	print 'main done.'