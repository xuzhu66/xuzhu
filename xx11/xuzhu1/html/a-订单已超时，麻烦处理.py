#! /usr/bin/env python

#! -*- coding: utf-8 -*-
import socket

server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind(("192.168.0.127", 5003))
server_socket.listen(128)

while True:
    client_socket, client_addr = server_socket.accept()
    data = client_socket.recv(1024).decode("utf8")
    print("接收到了{}".format(data))

    client_socket.send("HTTP/1.1 200 OK\n".encode("utf-8"))
    client_socket.send("Content-Type: text/html; charset=utf-8\n".encode("utf-8"))
    client_socket.send("\n".encode("utf-8"))

    client_socket.send("直飞".encode('utf-8'))
