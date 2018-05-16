from random import random
from time import time
import math


def count_cost_time(func, n):
	begin_time = time()
	result = func(n)
	cost_time = time() - begin_time
	return cost_time, result


def generate_array(array_length):
	arr = []
	for i in range(0, array_length):
		arr.append(random())
	return arr


def func_1(arr):
	d_min = math.inf
	for i in range(0, len(arr)):
		for j in range(0, len(arr)):
			temp = math.fabs(arr[i] - arr[j])
			if i != j and temp < d_min:
				d_min = temp
	return d_min


def func_2(arr):
	d_min = math.inf
	for i in range(0, len(arr) - 1):
		for j in range(i + 1, len(arr)):
			temp = math.fabs(arr[i] - arr[j])
			if temp < d_min:
				d_min = temp
	return d_min


def test(n):
	arr = generate_array(n)

	(cost_time_1, result_1) = count_cost_time(func_1, arr)
	(cost_time_2, result_2) = count_cost_time(func_2, arr)

	print('Array length is "' + str(n) + '", run ...')
	print('    -------------------------------')
	# print('    result_1:', result_1)
	# print('    result_2:', result_2)
	print('    cost_time_1: %.3f s' % cost_time_1)
	print('    cost_time_2: %.3f s' % cost_time_2)
	print('    -------------------------------')

	if cost_time_1 < cost_time_2:
		print('    Function 1 is better')
	elif cost_time_1 > cost_time_2:
		print('    Function 2 is better')
	else:
		print('    Function 1, 2 is same good')
	print('    -------------------------------\n\n')


test(1000)

test(3000)

test(5000)

test(10000)