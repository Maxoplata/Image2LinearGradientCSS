#!/usr/bin/env python
"""
Image2LinearGradientCSS.py

A proof-of-concept to convert an image to linear-gradient CSS
usage: python Image2LinearGradientCSS.py "input url/filepath" "output txt file"
example: python Image2LinearGradientCSS.py "https://raw.githubusercontent.com/Maxoplata/Image2LinearGradientCSS/main/example/example.jpg" "./example.txt"
example: python Image2LinearGradientCSS.py "./example.jpg" "./example.txt"

https://www.maxodev.org
https://github.com/Maxoplata/Image2LinearGradientCSS
"""

import io
import os
import sys
import urllib.request
from PIL import Image

__author__ = "Maxamilian Demian"
__email__ = "max@maxdemian.com"

def rgbToHex(rgb):
	return '{:02x}{:02x}{:02x}'.format(rgb[0], rgb[1], rgb[2])

if len(sys.argv) != 3:
	raise Exception('Invalid argument count')

# load our command line params
inputFile = sys.argv[1]
outputFile = sys.argv[2]

# validate input file
urlData = None

if not os.path.exists(inputFile):
	try:
		urlData = urllib.request.urlopen(inputFile).read()
	except:
		raise Exception('File does not exist')

try:
	# validate image file
	image = Image.open(inputFile) if urlData == None else Image.open(io.BytesIO(urlData))

	# get width/height of image
	imageWidth = image.size[0]
	imageHeight = image.size[1]

	# load image pixel data
	image = image.convert('RGB')
	pixels = image.load()

	# our output css
	output = ''

	# keep track of the pixels we have already accounted for
	visited = [[False for _ in range(imageWidth)] for _ in range(imageHeight)]

	for y in range(0, imageHeight):
		for x in range(0, imageWidth):
			# skip already processed pixels
			if visited[y][x]:
				continue

			# get pixel color
			color = rgbToHex(pixels[x, y])

			# determine the width and height of the color block
			blockWidth = 1
			blockHeight = 1

			# calculate block width
			while x + blockWidth < imageWidth and rgbToHex(pixels[x + blockWidth, y]) == color:
				blockWidth+= 1

			# calculate block height
			while y + blockHeight < imageHeight and rgbToHex(pixels[x, y + blockHeight]) == color:
				isSameColor = True

				for i in range(0, blockWidth):
					if rgbToHex(pixels[x + i, y + blockHeight]) != color:
						isSameColor = False
						break

				if not isSameColor:
					break

				blockHeight += 1


			# mark the pixels in this block as visited
			for by in range(0, blockHeight):
				for bx in range(0, blockWidth):
					visited[y + by][x + bx] = True

			# add the block to the output
			output += (', ' if output != '' else '') + 'linear-gradient(#{} 100%, white 100%) no-repeat scroll {}px {}px / {}px {}px'.format(color.upper(), x, y, blockWidth, blockHeight)

	# write output to file
	f = open(outputFile, 'w')
	f.write('background: {};'.format(output))
	f.close()

	print("background CSS for '{}' has been written to '{}'".format(inputFile, outputFile));
except Exception as error:
	raise Exception('Failed to create background CSS output: {}'.format(error))
