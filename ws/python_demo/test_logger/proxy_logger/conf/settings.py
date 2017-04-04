# coding:utf-8
__author__ = 'l63913'

# NA的限制
na_limit = {
    'sender': 1,        # Sender数量（并发量）
    'watcher': 1        # Watcher数量（并发量）
}
# NA配置
na = {
    'local': {
        'hostname': 'na',
        'port': 8023,
        'username': 'nas\n',
        'password': 'opsware\n'
    },
    'remote': {

    }
}

# SA的限制
sa_limit = 10      # Worker数量（并发量）

# SA配置
sa = {
    'local': {
        'hostname': 'sa',
        'username': 'dr-admin',
        'password': 'cmbcdradmin',
        'timeout': 300,
        'port': 2222
    },
    'remote': {
        'hostname': 'sa',
        'username': 'dr-admin',
        'password': 'cmbcdradmin',
        'timeout': 300,
        'port': 2222
    }
}

# DB配置
db = {
    'local': {
        'host': '197.1.25.175',
        'user': 'test_user',
        'passwd': 'admin@123',
        'db': 'test',
        'port': 3306
    },
    'remote': {
        'host': '197.1.25.175',
        'user': 'test_user',
        'passwd': 'admin@123',
        'db': 'test',
        'port': 3306
    }
}

# LOG服务端配置
log_server = {
    'port': 20001,
    'authkey': 'secret'.encode('utf-8')
}
