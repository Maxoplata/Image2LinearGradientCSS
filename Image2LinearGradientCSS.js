/**
 * Image2LinearGradientCSS.js
 *
 * A proof-of-concept to convert an image to linear-gradient CSS
 * usage: node Image2LinearGradientCSS.js "input url/filepath" "output txt file"
 * example: node Image2LinearGradientCSS.js "https://raw.githubusercontent.com/Maxoplata/Image2LinearGradientCSS/main/example/example.jpg" "./example.txt"
 * example: node Image2LinearGradientCSS.js "./example.jpg" "./example.txt"
 *
 * @author Maxamilian Demian
 * @link https://www.maxodev.org
 * @link https://github.com/Maxoplata/Image2LinearGradientCSS
 */

const fs = require('node:fs/promises');
const Jimp = require('jimp');

(async () => {
	if (process.argv.length != 4) {
		throw new Error('Invalid argument count');
	}

    // load our command line params
	const inputFile = process.argv[2];
	const outputFile = process.argv[3];

	try {
		// load input file
		const image = await Jimp.read(inputFile);

        // our output css
        let output = '';

        // keep track of the pixels we have already accounted for
        let visited = Array.from({ length: image.bitmap.height }, () => Array(image.bitmap.width).fill(false));

        for (let y = 0; y < image.bitmap.height; y++) {
            for (let x = 0; x < image.bitmap.width; x++) {
                // skip already processed pixels
                if (visited[y][x]) continue;

                // get pixel color
                let color = image.getPixelColor(x, y);

                // determine the width and height of the color block
                let blockWidth = 1;
                let blockHeight = 1;

                // calculate block width
                while (x + blockWidth < image.bitmap.width && image.getPixelColor(x + blockWidth, y) === color) {
                    blockWidth++;
                }

                // calculate block height
                while (y + blockHeight < image.bitmap.height && image.getPixelColor(x, y + blockHeight) === color) {
                    let isSameColor = true;

                    for (let i = 0; i < blockWidth; i++) {
                        if (image.getPixelColor(x + i, y + blockHeight) !== color) {
                            isSameColor = false;

                            break;
                        }
                    }

                    if (!isSameColor) break;

                    blockHeight++;
                }

                // mark the pixels in this block as visited
                for (let by = 0; by < blockHeight; by++) {
                    for (let bx = 0; bx < blockWidth; bx++) {
                        visited[y + by][x + bx] = true;
                    }
                }

                // add the block to the output
                output += (output !== '' ? ', ' : '') + `linear-gradient(#${color.toString(16).substring(0, 6).toUpperCase()} 100%, white 100%) no-repeat scroll ${x}px ${y}px / ${blockWidth}px ${blockHeight}px`;
			}
		}

		// write output to file
		await fs.writeFile(outputFile, `background: ${output};`);

		console.log(`background CSS for '${inputFile}'' has been written to '${outputFile}'`);
	} catch (error) {
		throw new Error(`Failed to create background CSS output: ${error}`);
	}
})();
