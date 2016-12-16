import datetime as dt
import random as rd

st = dt.datetime(2016, 1, 1)
ed = dt.datetime(2016, 12, 31)
delta_days = (ed - st).days

list_of_everyday = [
	st + x for x in [
		dt.timedelta(days=d) for d in range(1, delta_days + 1)
	]
]

list_str_date = [x.strftime('%Y-%m-%d') for x in list_of_everyday]

print len(list_str_date)

list_of_data = [round(rd.random() * 0.3 + 1.3, 3) for dd in range(delta_days)]

print len(list_of_data)

list_of_pue = [list(pue) for pue in zip(list_str_date, list_of_data)]

print list_of_pue
