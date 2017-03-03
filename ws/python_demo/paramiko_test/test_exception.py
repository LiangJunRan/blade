import paramiko

if __name__ == '__main__':
	# print(paramiko)

	ssh_client = paramiko.SSHClient()
	ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

	ssh_connection_info = dict(
		hostname='192.168.152.100',
		port=22,
		username='l63913',
		password='lap.map-75')
	print('connecting...', ssh_connection_info['hostname'])
	ssh_client.connect(**ssh_connection_info)
	print('connect success')

	stdin, stdout, stderr = ssh_client.exec_command('whoami')

	result = stdout.read()
	print(result)
	err = stderr.read()
	print(err)
	ssh_client.close()