import base64

bs = 'C0BD4FE9DAC738708E0F1EBFF91FB945D2C07405167E0000D07DF458F5E6D27A~plDooHUTz2rGE/PAff/s76hFJ3DE2Cm0aMxD5FuqQJDAlv5ZGiPbZLiKJ3esH6HcY1e2AmtVZc8FfTJOa+2apFSvRtJwYOR9TUm03QMf/TQIZ+LDZRz12XFHmnrryPAEdZwxpErUl+35S6LHRSowvS6YZZ4xAIxUrNN3GhYviz8FsvBEILa6GMf2uZY/DVy4kKl8NB638tB2raVexeOYt2qMlnLxCld8SCao4NLV3oyavjCAV2NUnUquxXYbuGpRLe='

def decode_base64(data):
    missing_padding = 4 - len(data) % 4
    if missing_padding:
        data += b'=' * missing_padding
    return base64.decodestring(data)

print len(decode_base64(bs))


# print base64.b64decode(bs)


def decode_base64_to_file(data, filename='text.mp3'):
	f = open(filename, 'wb')
	f.write(decode_base64(data))
	f.flush()
	f.close()


if __name__ == '__main__':
	ff = open('base64.dat', 'rb')
	decode_base64_to_file(ff.read())

