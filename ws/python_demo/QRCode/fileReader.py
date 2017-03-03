# coding=utf-8
__author__ = 'l63913'

import codecs

# 读取文件内容输出到控制台
'''
try:
    f = codecs.open('D:/test.txt', 'r', 'utf-8')
    f2 = codecs.open('D:/test2.txt', 'w', 'utf-8')
    f2.write(f.read())
finally:
    if f2:
        f2.close()
    if f:
        f.close()
'''

# with codecs.open('D:/test.txt', 'r', 'utf-8') as f:
#     with codecs.open('D:/test2.txt', 'w', 'utf-8') as f2:
#         f2.write(f.read())


# 输出到窗体
# 窗体加载图片
from Tkinter import *
import tkMessageBox
from PIL import ImageTk
from time import sleep
import qrcode


class Application(Frame):
    def __init__(self, master=None):
        Frame.__init__(self, master)
        self.pack()
        self.setWindow()

    def setImg(self, image):
        self.img = ImageTk.PhotoImage(image)

    def startIO(self):
        self.f = codecs.open('D:/test.txt', 'r', 'utf-8')

    def changepic(lab):
        global g_img
        g_img = PhotoImage(file="bbb.gif")
        lab['image'] = g_img

    def next(self):
        text = self.f.read(128)
        self.img = ImageTk.PhotoImage(qrcode.make(text))
        self.imgLabel['image'] = self.img

        #
        # print self.imgLabel.configure()['image']
        # self.imgLabel.update()

    # def next(self):
    #     text = self.f.read(128)
    #     print 'o ' + text
    #     img = qrcode.make('bbb')
    #
    #     simg = ImageTk.PhotoImage(img)
    #
    #     print self.imgLabel.configure()['image']
    #
    #     self.imgLabel.config(image=simg)
    #
    #     print self.imgLabel.configure()['image']
    #     self.imgLabel.update()


    def endIO(self):
        self.f.close()

    def setWindow(self):
        self.master.geometry('600x600')
        self.master.title('QRTrans')
        # self.img = ImageTk.PhotoImage(file='D:/a.jpg')
        # print self.img

        self.nextButton = Button(self, text='NEXT', command=self.next)
        self.nextButton.pack(side='left')

        # img = qrcode.make('测了个试')
        # with codecs.open('D:/test.txt', 'r', 'utf-8') as f:
        #     img = qrcode.make(f.read(128))
        #     self.img = ImageTk.PhotoImage(img)
        #     sleep(3)
        #     img = qrcode.make(f.read(256))
        #     self.img = ImageTk.PhotoImage(img)



        self.startIO()

        text = self.f.read(128)
        self.img = ImageTk.PhotoImage(qrcode.make(text))

        self.imgLabel = Label(self, text="abc", image=self.img)
        self.imgLabel.pack(side='top')


    # def createWidgets(self):
    #     self.helloLabel = Label(self, text='Hello, world!')
    #     self.helloLabel.pack()
    #     self.nameInput = Entry(self)
    #     self.nameInput.pack()
    #     self.quitButton = Button(self, text='Quit', command=self.quit)
    #     self.quitButton.pack(side='right')
    #     self.alertButton = Button(self, text='Hello', command=self.hello)
    #     self.alertButton.pack()
    #     print self.config()['height']

    # def hello(self):
    #     name = self.nameInput.get() or 'world'
    #     tkMessageBox.showinfo('Message', 'Hello, %s' % name)


app = Application()
app.mainloop()
app.endIO()


# qrcode生成图片加载到窗体


