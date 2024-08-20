# Image2LinearGradientCSS
A proof-of-concept to convert an image to linear-gradient CSS.

## Is this practical?
No. a 72px x 72px image is ~400KB of CSS.

## Could this be optimized?
Yes. Consecutive horizontal or vertical pixels of the same color could be a single linear gradient instead of multiple. But I don't really want to spend the time doing that because...

## Would this be practical if it were optimized?
Still, no.

## Example?
<a href="example/example.html">Here is an example of what gets output</a>. The example is based on <a href="example/example.jpg">this 72px x 72px image</a>.
