convert-image:
	convert icon/icon.png -background none -resize 16x16   icon/icon_16x16.png
	convert icon/icon.png -background none -resize 48x48   icon/icon_48x48.png
	convert icon/icon.png -background none -resize 128x128 icon/icon_128x128.png

package:
	zip package.zip icon/* main.js manifest.json
