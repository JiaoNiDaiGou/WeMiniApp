#
# This script is to build up an icon.wxss from given iconfont library.
#
# Usage:
#   1. Goto http://www.iconfont.cn/. Select your project, and generate a @font-face code with Unicode.
#      For example,
#
#      @font-face {
#        font-family: 'iconfont';  /* project id 835255 */
#        src: url('//at.alicdn.com/t/font_835255_nvklb4zf61d.eot');
#        src: url('//at.alicdn.com/t/font_835255_nvklb4zf61d.eot?#iefix') format('embedded-opentype'),
#        url('//at.alicdn.com/t/font_835255_nvklb4zf61d.woff') format('woff'),
#        url('//at.alicdn.com/t/font_835255_nvklb4zf61d.ttf') format('truetype'),
#        url('//at.alicdn.com/t/font_835255_nvklb4zf61d.svg#iconfont') format('svg');
#      }
#
#   2. Copy the above code snippet to any file, e.g. /tmp/my_iconfont
#
#   3. Run
#        python create_icon_wxss.py FROM=<icon file. e.g. /tmp/my_iconfont>
#      It will generate a icon.wxss file in the same directory here.
#
#   4. Copy it to your WeMiniApp, and use it in any of your wxss (e.g. app.wxss):
#      @import 'icon.wxss'
#
#      To use font in wxml:
#      <icon class="iconfont icon-settings" />
#

import requests
import sys
import xml.etree.ElementTree as ET

print('Create icon.wxss ...')

from_file_path = ''
to_file_path = ''
for arg in sys.argv:
    if arg.startswith('FROM='):
        from_file_path = arg[len('FROM='):]
    if arg.startswith('TO='):
        to_file_path = arg[len('TO='):]

if from_file_path == '':
    raise Exception('FROM is required.')
if to_file_path == '':
    raise Exception('TO is required.')

print('Read ' + from_file_path + ' ...')

from_file = open(from_file_path, 'r')
from_file_contents = from_file.readlines()
from_file.close()
svg_path = ''
for line in from_file_contents:
    if 'svg#iconfont' in line:
        start = "url('"
        end = "') format('svg')"
        svg_path = 'http:' + line[line.find(start)+len(start):line.rfind(end)]
        continue

if svg_path == '':
    raise Exception('SVG path not found!')

svg_content = requests.get(svg_path).text
tree = ET.fromstring(svg_content).find('./defs/font[@id="iconfont"]')
icons = []
for glyph in tree.findall('glyph'):
    icon_unicode = '\\' + (glyph.attrib['unicode'].encode('unicode-escape'))[2:]
    icon_name = glyph.attrib['glyph-name']
    icons.append([icon_name , icon_unicode])

print('Generate wxss to ' + to_file_path + ' ...')
to_file = open(to_file_path, 'w')
to_file.writelines(from_file_contents)
to_file.write('\n')
to_file.writelines('\n\
.iconfont {\n\
  font-family: "iconfont";\n\
  font-size: .16rem;\n\
  font-style: normal;\n\
  color: #9e9595;\n\
}\n\
')

for icon in icons:
    icon_name = icon[0]
    icon_unicode = icon[1]
    to_file.writelines('\n\
.icon-' + icon_name + ':before {\n\
  content: "' + icon_unicode + '";\n\
  font-size: 48rpx;\n\
  color: blue;\n\
}\n\
')

print('Generate icon.wxss finished. See ' + to_file_path)