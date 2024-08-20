# Image2LinearGradientCSS
A proof-of-concept to convert an image to linear-gradier CSS.

## Is this practical?
No. a 72px x 72px image is ~400KB of CSS.

## Could this be optimized?
Yes. Consecutive horizontal or vertical pixels of the same color could be a single linear gradient instead of two. But I don't really want to spend the time doing that because...

## Would this be practical if it were optimized?
Still, no.
