__author__ = 'l63913'
import qrcode
# qr = qrcode.QRCode(
#     version=1,
#     error_correction=qrcode.constants.ERROR_CORRECT_L,
#     box_size=10,
#     border=4,
# )
# qr.add_data('Some data')
# qr.make(fit=True)
#
# img = qr.make_image()
img = qrcode.make('test')
f = open('D:/text_qrcode.png', "wb")
f.write(img)
f.flush()
f.close()
