import socket
import SocketServer
import BaseHTTPServer
from SimpleHTTPServer import SimpleHTTPRequestHandler


class FileServer(SocketServer.ForkingTCPServer):
	allow_reuse_address = 1

	def server_bind(self):
		SocketServer.ForkingTCPServer.server_bind(self)
		host, port = self.socket.getsockname()[:2]
		self.server_name = socket.getfqdn(host)
		self.server_port = port


def test(HandlerClass=SimpleHTTPRequestHandler,
		ServerClass=FileServer):
	BaseHTTPServer.test(HandlerClass, ServerClass)


if __name__ == '__main__':
	test()