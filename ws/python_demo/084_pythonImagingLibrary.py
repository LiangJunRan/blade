# coding=utf-8
__author__ = 'l63913'

from PIL import Image
import os


im = Image.open('D:/a.png')
print im.format, im.size, im.mode
im.thumbnail((180, 180))
im.save('D:/thumb.jpg', 'JPEG')
print os.path