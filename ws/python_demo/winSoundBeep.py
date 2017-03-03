from winsound import Beep
from time import sleep
import math


def fn(f0, n):
	return f0 * math.pow(2, float(n) / 12)

def gen_f(n, floor):
	return fn(440 * math.pow(2, floor), n)

def f_list_gen(floor_start=0, floor_end=2):
	f_list = []
	stage_12 = [-9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2]
	stage_7 = [-9, -7, -5, -4, -2, 0, 2]
	for floor in range(floor_start, floor_end):
		for n in stage_7:
			f = gen_f(n, floor)
			f_list.append(int(f))
	f_list.append(int(gen_f(-9, floor_end)))
	return f_list

def music_gen(s_list):
	f_list = []
	stage_12 = [-9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2]
	stage_7 = [-9, -7, -5, -4, -2, 0, 2]

	t_list, t_list, t_list = (map(list, zip(*s_list)))
	# print('>>>', t_list)

	for s in s_list:

		# print('    >>> ', stage_7[s[0]], s[1])
		f = gen_f(stage_7[s[0]], s[1])
		f_list.append(int(f))
	return f_list, t_list

def music_play(f_list, t_list):
	for i in range(len(f_list)):
		print(f_list[i])
		Beep(f_list[i], t_list[i])
		sleep(float(t_list[i]) / 1000)

def beep_list(f_list):
	for f in f_list:
		Beep(f, 300)
		sleep(0.3)

if __name__ == '__main__':
	# f_list = f_list_gen(0, 1)
	# f_list = music_gen(s_list)
	# print(f_list)
	# beep_list(f_list)

	s_list = [
		[2, 1, 200],
		[2, 1, 200],
		[2, 1, 500],

		[2, 1, 100],
		[2, 1, 100],
		[2, 1, 500],

		[2, 1, 200],
		[4, 1, 200],
		[0, 1, 200],
		[1, 1, 200],
		[2, 1, 400],

		[3, 1, 200],
		[3, 1, 300],
		[3, 1, 800],
		[3, 1, 200],
		[3, 1, 200],
		[2, 1, 300],
		[2, 1, 500],

		[4, 1, 300],
		[4, 1, 300],
		[3, 1, 300],
		[1, 1, 300],
		[0, 1, 300],
	]
	f_list, t_list = music_gen(s_list)
	music_play(f_list, t_list)
