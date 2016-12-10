__author__ = 'l63913'

def is_odd(n):
    return n % 2 == 1

odd = filter(is_odd, range(1, 101))

print odd

def is_prime_number(n):
    if n <= 1:
        return False

    i = 2
    while i * i <= n:
        if n % i == 0:
            return False
        i += 1
    return True

print filter(is_prime_number, range(1, 101))