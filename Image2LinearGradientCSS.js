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

	const inputFile = process.argv[2];
	const outputFile = process.argv[3];

	try {
		let output = '';

		// load input file
		const image = await Jimp.read(inputFile);

		for (let x = 0; x < image.bitmap.width; x++) {
			for (let y = 0; y < image.bitmap.height; y++) {
				let color = image.getPixelColor(x, y).toString(16).substring(0, 6).toUpperCase();

				output += (output != '' ? ', ' : '') + `linear-gradient(#${color} 100%, white 100%) no-repeat scroll ${x}px ${y}px / 1px 1px`;
			}
		}

		// write output to file
		await fs.writeFile(outputFile, `background-image: ${output};`);

		console.log(`background-image CSS for '${inputFile}'' has been written to '${outputFile}'`);
	} catch (error) {
		throw new Error(`Failed to create background-image CSS output: ${error}`);
	}
})();
