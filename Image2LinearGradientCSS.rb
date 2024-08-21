#!/usr/bin/ruby
# Image2LinearGradientCSS.rb
#
# A proof-of-concept to convert an image to linear-gradient CSS
# usage: ruby Image2LinearGradientCSS.rb "input url/filepath" "output txt file"
# example: ruby Image2LinearGradientCSS.rb "https://raw.githubusercontent.com/Maxoplata/Image2LinearGradientCSS/main/example/example.jpg" "./example.txt"
# example: ruby Image2LinearGradientCSS.rb "./example.jpg" "./example.txt"
#
# @author Maxamilian Demian
# @link https://www.maxodev.org
# @link https://github.com/Maxoplata/Image2LinearGradientCSS
require 'open-uri'
require 'rmagick'

def rgbToHex(rgb)
    r = (rgb.red / 257).to_i
    g = (rgb.green / 257).to_i
    b = (rgb.blue / 257).to_i

    sprintf("%02X%02X%02X", r, g, b)
end

if ARGV.count != 2
	raise 'Invalid argument count'
end

# load our command line params
inputFile = ARGV[0]
outputFile = ARGV[1]

begin
    image = nil

    # load input file
    if File.file?(inputFile)
        image = Magick::Image.read(inputFile).first
    else
        # Magick::Image.read can handle URLs, but fails on HTTPS
        # so we manually handle URLs
        urlData = URI.open(inputFile).read

        image = Magick::ImageList.new

        image.from_blob(urlData)
    end

	# get width/height of image
	imageWidth = image.columns
	imageHeight = image.rows

    # our output css
    output = ''

    # keep track of the pixels we have already accounted for
    visited = Array.new(imageHeight) { Array.new(imageWidth, false) }

	for y in 0..(imageHeight - 1) do
        for x in 0..(imageWidth - 1) do
            # skip already processed pixels
            next if visited[y][x]

            # get pixel color
			color = rgbToHex(image.pixel_color(x, y))

            # determine the width and height of the color block
            blockWidth = 1
            blockHeight = 1

            # calculate block width
            while x + blockWidth < imageWidth && rgbToHex(image.pixel_color(x + blockWidth, y)) == color do
                blockWidth += 1
            end

            # calculate block height
            while y + blockHeight < imageHeight && rgbToHex(image.pixel_color(x, y + blockHeight)) == color do
                isSameColor = true

                for i in 0..(blockWidth - 1) do
                    if rgbToHex(image.pixel_color(x + i, y + blockHeight)) != color
                        isSameColor = false

                        break
                    end
                end

                break if !isSameColor

                blockHeight += 1
            end

            # mark the pixels in this block as visited
            for by in 0..(blockHeight - 1) do
                for bx in 0..(blockWidth - 1) do
                    visited[y + by][x + bx] = true
                end
            end

            # add the block to the output
            output += (output != '' ? ', ' : '') + "linear-gradient(##{color} 100%, white 100%) no-repeat scroll #{x}px #{y}px / #{blockWidth}px #{blockHeight}px"
        end
    end

    # write output to file
    File.write(outputFile, "background: #{output};")

    puts "background CSS for '#{inputFile}' has been written to '#{outputFile}'"
rescue => error
    puts "Failed to create background CSS output: #{error.message}"
end
