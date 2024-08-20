<?php
/**
 * Image2LinearGradientCSS.php
 *
 * A proof-of-concept to convert an image to linear-gradient CSS
 * usage: php Image2LinearGradientCSS.php "input url/filepath" "output txt file"
 * example: php Image2LinearGradientCSS.php "https://raw.githubusercontent.com/Maxoplata/Image2LinearGradientCSS/main/example/example.jpg" "./example.txt"
 * example: php Image2LinearGradientCSS.php "./example.jpg" "./example.txt"
 *
 * @author Maxamilian Demian
 * @link https://www.maxodev.org
 * @link https://github.com/Maxoplata/Image2LinearGradientCSS
 */
set_time_limit(0);

if (count($argv) !== 3) {
	throw new Exception('Invalid argument count');
}

// load our command line params
$inputFile = $argv[1];
$outputFile = $argv[2];

try {
    // load input file
    $fileData = file_get_contents($inputFile);

	// validate image file
	$image = imagecreatefromstring($fileData);

	if ($image === false) {
		throw new Exception('Invalid image');
	}

	// get width/height of image
	$imageWidth = imagesx($image);
	$imageHeight = imagesy($image);

    // our output css
    $output = '';

    // keep track of the pixels we have already accounted for
    $visited = array_fill(0, $imageHeight, array_fill(0, $imageWidth, false));

    for ($y = 0; $y < $imageHeight; $y++) {
        for ($x = 0; $x < $imageWidth; $x++) {
            // skip already processed pixels
            if ($visited[$y][$x]) continue;

            // get pixel color
			$color = imagecolorat($image, $x, $y);

            // determine the width and height of the color block
            $blockWidth = 1;
            $blockHeight = 1;

            // calculate block width
            while ($x + $blockWidth < $imageWidth && imagecolorat($image, $x + $blockWidth, $y) === $color) {
                $blockWidth++;
            }

            // calculate block height
            while ($y + $blockHeight < $imageHeight && imagecolorat($image, $x, $y + $blockHeight) === $color) {
                $isSameColor = true;

                for ($i = 0; $i < $blockWidth; $i++) {
                    if (imagecolorat($image, $x + $i, $y + $blockHeight) !== $color) {
                        $isSameColor = false;

                        break;
                    }
                }

                if (!$isSameColor) break;

                $blockHeight++;
            }

            // mark the pixels in this block as visited
            for ($by = 0; $by < $blockHeight; $by++) {
                for ($bx = 0; $bx < $blockWidth; $bx++) {
                    $visited[$y + $by][$x + $bx] = true;
                }
            }

            // add the block to the output
            $hexColor = strtoupper(dechex($color));
            $output .= ($output !== '' ? ', ' : '') . "linear-gradient(#{$hexColor} 100%, white 100%) no-repeat scroll {$x}px {$y}px / {$blockWidth}px {$blockHeight}px";
        }
    }

    // write output to file
    $file = fopen($outputFile, 'w');
    fwrite($file, "background: {$output};");
    fclose($file);

    print "background CSS for '{$inputFile}' has been written to '{$outputFile}'\n";
} catch (Exception $error) {
	throw new Exception("Failed to create background CSS output: {$error->getMessage()}");
}
