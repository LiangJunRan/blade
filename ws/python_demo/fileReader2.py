# coding=utf-8
__author__ = 'l63913'


import codecs
from Tkinter import *
from PIL import ImageTk, Image
import qrcode


class Application(Frame):
    def __init__(self, master=None):
        self.f = codecs.open('D:/test.txt', 'r', 'utf-8')

        Frame.__init__(self, master)
        self.pack()

        # 窗体设置
        self.master.geometry('600x600')
        self.master.title('QRTrans')

        self.filePath = Entry(self)
        self.filePath.pack()
        self.fileButton = Button(self, text='FILE')
        self.fileButton.pack()

        self.nextButton = Button(self, text='NEXT', command=self.next)
        self.nextButton.pack()

        self.start_io()

        text = self.f.read(64)
        self.img = ImageTk.PhotoImage(qrcode.make(text))

        self.imgLabel = Label(self, text="abc", image=self.img)
        self.imgLabel.pack(side='bottom')

    def start_io(self):
        self.f = codecs.open('D:/test.txt', 'r', 'utf-8')

    def next(self):
        text = self.f.read(64)
        self.img = ImageTk.PhotoImage(qrcode.make(text))
        # print self.img.__dict__
        # self.img._PhotoImage__size = (550, 550)
        print self.imgLabel.__dict__
        self.imgLabel['image'] = self.img

    def end_io(self):
        self.f.close()


app = Application()
app.mainloop()
app.end_io()

