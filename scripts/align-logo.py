"""Generate the brand's geometric outlined wordmark. Requires fonttools for path bounds only."""
from pathlib import Path
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.svgLib.path import parse_path
import json
# Original geometric letter outlines. All caps share the same height and stroke weight.
glyphs={
'N':'M0 140V0H26L74 91V0H100V140H74L26 49V140Z',
'A':'M0 140L35 0H65L100 140H73L67 112H33L27 140ZM39 87H61L50 35Z',
'T':'M0 0H100V26H63V140H37V26H0Z',
'I':'M0 0H26V140H0Z',
'O':'M32 0H68Q100 0 100 32V108Q100 140 68 140H32Q0 140 0 108V32Q0 0 32 0ZM34 26Q26 26 26 36V104Q26 114 34 114H66Q74 114 74 104V36Q74 26 66 26Z',
'L':'M0 0H26V114H94V140H0Z',
'R':'M0 140V0H64Q100 0 100 35V49Q100 74 79 82L104 140H75L51 87H26V140ZM26 26V62H61Q74 62 74 49V39Q74 26 61 26Z',
'E':'M0 0H98V26H26V56H86V82H26V114H98V140H0Z',
'S':'M34 0H68Q100 0 100 33V40H74V35Q74 26 64 26H36Q26 26 26 36V42Q26 49 37 53L73 66Q100 76 100 100V108Q100 140 67 140H33Q0 140 0 108V99H26V105Q26 114 36 114H64Q74 114 74 104V100Q74 92 63 88L27 75Q0 65 0 42V33Q0 0 34 0Z'
}
height=124; sy=height/140; sx=1.20; shear=-.20*sy
transform=(sx,0,shear,sy,0,0)
rows=[];parts=[]
for word,top in [('NATIONAL',48),('RENTALS',194)]:
 bounds=[]
 for char in word:
  pen=BoundsPen(None);parse_path(glyphs[char],TransformPen(pen,transform));bounds.append(pen.bounds)
 widths=[b[2]-b[0] for b in bounds];gap=(1080-sum(widths))/(len(word)-1)
 assert gap>=12, gap
 x=60;paths=[]
 for char,b in zip(word,bounds):
  pen=SVGPathPen(None,ntos=lambda n:f'{n:.4f}'.rstrip('0').rstrip('.'))
  parse_path(glyphs[char],TransformPen(pen,(sx,0,shear,sy,x-b[0],top)))
  paths.append('<path d="'+pen.getCommands()+'"/>');x+=b[2]-b[0]+gap
 parts.append('<g id="'+word.lower()+'">'+''.join(paths)+'</g>')
 rows.append({'word':word,'left':60,'right':round(x-gap,5),'top':top,'bottom':top+height,'capHeight':height,'tracking':round(gap,5)})
svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 350" role="img" aria-labelledby="title"><title id="title">National Rentals</title><g fill="#E30613" fill-rule="evenodd"><path id="speed-line" d="M60 14H1140L1120 27H60Z"/>'+''.join(parts)+'</g></svg>\n'
Path('public/brand/national-rentals-logo.svg').write_text(svg)
Path('docs/logo-geometry.json').write_text(json.dumps({'rows':rows,'speedLine':{'left':60,'right':1140},'description':'Original outlined geometry; shared cap height, visible line bounds and stroke scale. No font substitution.'},indent=2)+'\n')
print(json.dumps(rows))
