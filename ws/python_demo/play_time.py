import time
from datetime import datetime

if __name__ == '__main__':
	# timestamp 	时间戳，类型为float
	# struct_time	结构化的时间，提示输入tuple时，用的实际就是这个类型的
	# str_time		时间字符串，经过格式化语句格式化成的string
	# format_str	格式化时间所用的语句
	"""
	float --> struct tuple:   time.localtime( float )

	struct time tuple --> str: time.strftime(format, struct time tuple)

	str --> struct time tuple: time.strptime(str, format)

	struct time tuple --> float : time.mktime(struct time tuple)

	struct time tuple --> datetime: datetime(*time_tuple[0:6])
	"""

	time_str = '2016-11-22 11:22:33'
	time_format_str = '%Y-%m-%d %H:%M:%S'

	ts = time.time()	# 创建timestamp的方式1
	tstr = time.strftime(time_format_str, time.localtime(ts))	# 使用localtime方法将float转换成为tuple
	print(ts, time.localtime(ts), tstr)

	ts2 = time.mktime(time.strptime(time_str, time_format_str))		# 创建timestamp的方式2
	tstr2 = time.strftime(time_format_str, time.localtime(ts2))
	print(ts2, tstr2, tstr2 == time_str)

	# datetime ==========================================================================================
	"""
	float --> datetime: datetime.datetime.fromtimestamp( float )

	datetime --> str: datetime.strftime(format, datetime)

	str --> datetime: datetime.strptime(str, format)

	datetime --> struct time tuple: datetime.timetuple()
	"""

	dt = datetime.now()
	print(dt, type(dt))
	dt2 = datetime.today()
	print(dt2, type(dt2))
