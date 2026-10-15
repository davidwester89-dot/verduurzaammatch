# Eigen illustraties (SVG) -> PNG (Chrome) -> WebP (Pillow). Ook og:image (1200x630) en favicons.
import subprocess, os, tempfile
from PIL import Image
T='#0e6b63';D='#0a4f49';L='#3c9a5f';M='#dcefe6';S='#f2b632';W='#ffffff';BG='#f2f7f4'
house=f'<path d="M380 330 600 160l220 170v230H380z" fill="{W}" stroke="{D}" stroke-width="8"/><rect x="560" y="440" width="80" height="120" fill="{M}" stroke="{D}" stroke-width="6"/><rect x="430" y="370" width="80" height="70" fill="#bfe3f0" stroke="{D}" stroke-width="6"/><rect x="690" y="370" width="80" height="70" fill="#bfe3f0" stroke="{D}" stroke-width="6"/>'
ground=f'<rect x="0" y="560" width="1200" height="70" fill="{L}"/>'
sun=f'<circle cx="1020" cy="120" r="60" fill="{S}"/>'
roofins=f'<path d="M360 330 600 140l240 190" fill="none" stroke="{S}" stroke-width="26" stroke-linejoin="round"/>'
art={
'home':sun+ground+house+roofins+f'<g transform="translate(860 470)"><rect width="120" height="90" rx="6" fill="{W}" stroke="{D}" stroke-width="6"/><circle cx="60" cy="45" r="28" fill="none" stroke="{T}" stroke-width="8"/></g><g transform="translate(360 330) rotate(-38.37)"><rect x="40" y="-55" width="70" height="40" fill="{D}"/><rect x="115" y="-55" width="70" height="40" fill="{D}"/><rect x="190" y="-55" width="70" height="40" fill="{D}"/></g>',
'spouwmuurisolatie-kosten':ground+f'<rect x="380" y="120" width="140" height="440" fill="#c86b4a"/><rect x="520" y="120" width="120" height="440" fill="{S}"/><rect x="640" y="120" width="140" height="440" fill="#d9d2c5"/>'+''.join(f'<line x1="380" y1="{y}" x2="520" y2="{y}" stroke="#fff" stroke-width="4"/>' for y in range(150,560,40))+''.join(f'<circle cx="{560+(i%3)*25}" cy="{150+i*22}" r="9" fill="#fff8e4"/>' for i in range(18))+f'<path d="M180 300h200" stroke="{T}" stroke-width="18"/><path d="M360 280l30 20-30 20z" fill="{T}"/>',
'dakisolatie-kosten':sun+ground+house+f'<path d="M340 330 600 125l260 205" fill="none" stroke="{S}" stroke-width="44" stroke-linejoin="round"/><path d="M330 320 600 105l270 215" fill="none" stroke="#c86b4a" stroke-width="14" stroke-linejoin="round"/>',
'vloerisolatie-kosten':f'<rect x="200" y="140" width="800" height="240" fill="{W}" stroke="{D}" stroke-width="8"/><rect x="200" y="380" width="800" height="30" fill="#8a6a4a"/><rect x="200" y="410" width="800" height="50" fill="{S}"/><rect x="200" y="460" width="800" height="120" fill="#b9a68f"/>'+''.join(f'<rect x="{x}" y="380" width="22" height="80" fill="#6f533a"/>' for x in range(240,1000,120))+f'<path d="M300 300c40-40 80 40 120 0" stroke="{T}" stroke-width="10" fill="none"/>',
'hybride-warmtepomp-kosten':ground+house+f'<g transform="translate(850 420)"><rect width="200" height="140" rx="8" fill="{W}" stroke="{D}" stroke-width="8"/><circle cx="80" cy="70" r="46" fill="none" stroke="{T}" stroke-width="10"/><path d="M80 30v80M40 70h80" stroke="{T}" stroke-width="8"/><rect x="145" y="25" width="35" height="90" fill="{M}"/></g><path d="M640 480C700 520 780 520 850 490" stroke="{S}" stroke-width="12" fill="none" stroke-dasharray="18 12"/>',
'zonnepanelen-na-2027':sun+ground+house+'<g transform="translate(380 330) rotate(-37.69)">'+''.join(f'<rect x="{x}" y="-46" width="52" height="40" fill="{D}" stroke="#7fb8d6" stroke-width="3"/>' for x in (20,77,134,191))+'</g>'+f'<text x="120" y="250" font-family="Georgia,serif" font-size="80" font-weight="700" fill="{T}">2027</text>',
'thuisbatterij-terugverdienen':f'<rect x="460" y="120" width="280" height="440" rx="20" fill="{W}" stroke="{D}" stroke-width="10"/><rect x="560" y="95" width="80" height="30" rx="6" fill="{D}"/><rect x="490" y="400" width="220" height="130" rx="8" fill="{L}"/><rect x="490" y="300" width="220" height="90" rx="8" fill="{M}"/><path d="M610 170l-50 90h45l-20 80 70-110h-48l25-60z" fill="{S}"/>'+ground,
'subsidie-isde':ground+house+f'<circle cx="900" cy="230" r="110" fill="{S}"/><text x="900" y="275" text-anchor="middle" font-family="Georgia,serif" font-size="140" font-weight="700" fill="{D}">€</text><circle cx="300" cy="230" r="70" fill="{L}"/><path d="M265 232l25 25 45-50" stroke="#fff" stroke-width="14" fill="none" stroke-linecap="round"/>',
}
art['match']=art['home']
os.makedirs('src/assets/img',exist_ok=True);os.makedirs('src/assets/og',exist_ok=True);os.makedirs('src/assets/icons',exist_ok=True)
tmp=tempfile.mkdtemp()
def shot(svg,out,w,h):
    f=os.path.join(tmp,'p.html');open(f,'w').write(f'<html><body style="margin:0"><svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="{BG}"/>{svg}</svg></body></html>')
    subprocess.run(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars','--force-device-scale-factor=1',f'--window-size={w},{h}',f'--screenshot={out}','file://'+f],capture_output=True)
for k,svg in art.items():
    png=f'src/assets/og/{k}.png'; shot(svg,png,1200,630)
    if k!='match':
        im=Image.open(png).convert('RGB')
        for w in (1200,600): im.resize((w,int(w*630/1200)),Image.LANCZOS).save(f'src/assets/img/{k}-{w}.webp','WEBP',quality=82)
logo='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="4" fill="#3c9a5f"/><path d="M8 20 20 9l12 11v12H8z" fill="#fff"/><path d="M15 30c0-7 4-11 11-12-1 7-4 11-11 12z" fill="#0e6b63"/></svg>'
open('src/assets/icons/favicon.svg','w').write(logo)
f=os.path.join(tmp,'i.html');open(f,'w').write(f'<html><body style="margin:0">{logo.replace("<svg ","<svg width=180 height=180 ")}</body></html>')
subprocess.run(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars','--window-size=180,180','--screenshot=src/assets/icons/apple-touch-icon.png','file://'+f],capture_output=True)
Image.open('src/assets/icons/apple-touch-icon.png').resize((32,32),Image.LANCZOS).save('src/assets/icons/favicon-32.png')
print('ok')
