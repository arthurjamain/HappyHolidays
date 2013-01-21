# Happy New Year from Joshfire !

This is the greeting card from Joshfire. Its point is to display greeting messages according to the hash in the URL.

It is meant to work on a broad set of devices, hence its relative simplicity and its numerous versions.

### Development and Production

Master is intended as a dev branch. The production branch would then be gh-pages. Any change commited to gh-pages *will* be uploaded to http://happynewyear.joshfire.com right away.

### Canvas Version

If the canvas element and the 2dContext are present, we draw on a canvas. We simulate a fadein/out effect for the various triangles and draw the background image behind them. Afterwards we can just punch holes in the background image thanks to canvas's capabilities.
There exists some bugs, thought. The main cause is that basically, you're only supposed to delete recrangles. To delete a specific shape (such as, say, a triangle), you need to clip the context to the shape of whatever you want to delete.
This clipping is more or less supported depending on your device. For instance, the oh-so-great galaxy tab 2 10" should miserably fail at deleting triangles. Unfortunately, this is not something that can be traced since this behaviour does not generate any error or warning of any kind.
Apart from that it's a bit resource-consuming but still far less than the second method …

### DOM Triangles Version

This one's for the oldies. Where Canvas is not present, we create a bunch of 0x0 DIV's with 20px borders which actually ends up looking like triangles, as far as in IE7. We need to actually recreate the pattern that's behind triangle by triangle. To do this, a Normal/Gaussian distribution pattern was used.
Then, other triangles are used for the first animation and then etc…
This version is devoid of any transform or 3D effects as it makes the assumption that a browser without canvas is a browser without 3D transforms ; which is indeed not that risky.
