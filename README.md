Gnome-shell extension that provides reactive screen edges to switch between different workspaces, similar to what is provided by [Brightside](http://catmur.co.uk/brightside/), by some plugin in Compiz or natively in other Desktop Environments like Xfce.

By default there is a timeout of 300 miliseconds to avoid accidentally switching workspaces, for instance, when the user wants to scroll maximized windows, etc.

Also, there is an offset to prevent the whole extension of the edge from being reactive, again to avoid unintented workspace switching. By default it is set to 5% of the length of the edge from both ends, that is, only the middle 90% of the edge is used.

To change these two parameters, and also the opacity and size of the "reactive zone", open the extension.js file in your text editor of choice and change the following lines to your needs:

1. DELAY_TIMEOUT = 300
2. OFFSET = 5
3. SIZE = 1
4. OPACITY = 0

Regards.
