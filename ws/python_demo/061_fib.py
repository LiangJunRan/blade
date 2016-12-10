def fib(times):
    n, a, b = 0, 0, 1
    while n < times:
        yield b
        a, b = b, a + b
        n += 1

fib(9)

for bb in fib(9):
    print bb
