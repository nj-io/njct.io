import sys
from PIL import Image
ims=[Image.open(f) for f in sys.argv[2:]]
w=sum(i.width for i in ims)+20*(len(ims)-1); h=max(i.height for i in ims)
o=Image.new('RGB',(w,h),'white'); x=0
for i in ims: o.paste(i,(x,0)); x+=i.width+20
o.resize((w//2,h//2)).save(sys.argv[1])
