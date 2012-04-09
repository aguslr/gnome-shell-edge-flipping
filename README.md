[Gnome-shell Edge-Flipping](http://aguslr.github.com/gnome-shell-edge-flipping/)

[Gnome-shell extension](https://live.gnome.org/GnomeShell/Extensions) that provides reactive screen edges to switch between different workspaces, similar to what is provided by [Brightside](http://catmur.co.uk/brightside/), by some plugin in Compiz or natively in other Desktop Environments like Xfce.

By default lateral edges are disabled (since they are mapped to Up/Down anyway) and there is a timeout of 300 milliseconds to avoid accidentally switching workspaces, for instance, when the user wants to scroll maximized windows, etc.

Also, there is an offset to prevent the whole extension of the edge from being reactive, again to avoid unintented workspace switching. By default it is set to 5% of the length of the edge from both ends, that is, only the middle 90% of the edge is used.

To change these parameters, and also the opacity and size of the "reactive zone", open the extension.js file in your text editor of choice and change the following lines to your needs:

```javascript
// Declare some parameters
const DELAY_TIMEOUT = 300   // milliseconds
const ENABLE_HORIZ = false  // boolean
const OFFSET = 5            // percentage
const SIZE = 1              // pixels
const OPACITY = 0           // 0-255
```

Regards.
