# GNOME Shell Edge-Flipping

## About

[GNOME Shell Edge-Flipping](http://aguslr.github.com/gnome-shell-edge-flipping/) is a [GNOME Shell extension](https://live.gnome.org/GnomeShell/Extensions) that provides reactive screen edges to switch between different workspaces, similar to what is provided by [Brightside](http://catmur.co.uk/brightside/), by some plugin in Compiz or natively in other Desktop Environments like Xfce. Here you can see a [video demo](https://www.youtube.com/watch?v=6BSyOEjRyTc).

## Installation

### GNOME Shell Extensions repository

You can find this extension at the [GNOME Shell Extensions website](https://extensions.gnome.org/extension/275/edge-flipping/). Using the website is the preferred method since all extensions are reviewed prior to their release and you'll find lots of other cool extensions.

### Get latest version using Git

To get the extension directly from my repository, you can use Git to clone it:

```sh
git clone git://github.com/aguslr/gnome-shell-edge-flipping.git ~/.local/share/gnome-shell/extensions/edge-flipping@aguslr.github.com
```

### Get latest version without Git

If you don't have Git, you can just download the extension in a tarball and extract it in the appropiate directory:

```sh
mkdir ~/.local/share/gnome-shell/extensions && cd $_ && wget https://github.com/aguslr/gnome-shell-edge-flipping/tarball/master -O - | tar -xzv --strip-components 1
```

## Configuration

To customize the behaviour of the extension, you can open the file `extension.js` on a text editor and edit the following lines as explained below:

```javascript
// Declare some parameters
const CONTINUE = false      // boolean
const ENABLE_HORIZ = false  // boolean
const DELAY_TIMEOUT = 300   // milliseconds
const OFFSET = 5            // percentage
const SIZE = 1              // pixels
const OPACITY = 0           // 0-255
```

### Continuous flipping

By default, once an edge is activated, it will only switch to the adjacent workspace. To switch to the one after that, the edge needs to be reactivated. To change this you can set the following line to `true`:

```javascript
const CONTINUE = true       // boolean
```

### Lateral edges

Also, by default both left and right edges are disabled since workspaces are laid out vertically in GNOME shell and it might be confusing. To enable them, just change the following line to `true`:

```javascript
const ENABLE_HORIZ = true   // boolean
```

Have in mind that, at the moment, the actions to switch to left/right are mapped to up/down, therefore the left and right edges will behave exactly like the top and bottom edges.

### Delay

There is a delay between activating the edge and switching to the next workspace. This is set to avoid accidentally changing workspace when we were just trying to drag the scroll bar on a maximized window. By default it is set to 300 milliseconds but it can be changed by editing this line:

```javascript
const DELAY_TIMEOUT = 300   // milliseconds
```

If continuous flipping is enabled, this parameter also controls the delay between each workspace change. If it's too fast, increase the amount.

### Offset

There is an offset to prevent the whole extension of the edge from being reactive, again to avoid unintented workspace switching and overlapping other actions (i.e. activating overview or activating the message tray).

By default it is set to 5% of the length of the edge from both ends, that is, only the middle 90% of the edge is used. This can be changed in the following line:

```javascript
const OFFSET = 5            // percentage
```

### Size and opacity of reactive edges

You can change the size of the edge which is 1 pixel. Also, you can change the opacity so you can a visual reference. These two lines would have to be edited accordingly:

```javascript
const SIZE = 1              // pixels
const OPACITY = 0           // 0-255
```
Regards.
