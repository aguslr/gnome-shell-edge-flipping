/*
 * edge-fipping
 * Copyright (C) 2012 Agus Lopez <aremuinan@gmail.com>
 *
 * edge-flipping is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the
 * Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * edge-flipping is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const Clutter = imports.gi.Clutter;
const Lang = imports.lang;
const Main = imports.ui.main
const MainLoop = imports.mainloop;
const WorkspaceSwitcherPopup = imports.ui.workspaceSwitcherPopup;

// Other javascript files in the edge_flipping@aguslr.github.com directory
// are accesible via Extension.<file name>
const Extension = imports.ui.extensionSystem.extensions['edge_flipping@aguslr.github.com'];

// Declare some parameters
const DELAY_TIMEOUT = 300   // miliseconds
const OFFSET = 5            // percentage
const SIZE = 1              // pixels
const OPACITY = 0           // 0-255
var monitor = Main.layoutManager.primaryMonitor;
var offsetx = monitor.width * OFFSET/100;
var offsety = monitor.height * OFFSET/100;

function EdgeFlipping() {
    this._init();
}

// Class structure
EdgeFlipping.prototype = {
    _init: function() {

        // Define top edge
        this.topedge = new Clutter.Rectangle ({
            name: "top-edge",
            x: monitor.x + offsetx, y: monitor.y,
            width: monitor.width - 2*offsetx, height: SIZE,
            opacity: OPACITY,
            reactive: true });
        // Connect enter-event
        this.topedge.connect ('enter-event', Lang.bind (this, this._goUp));
        // Connect leave-event
        this.topedge.connect ('leave-event', Lang.bind (this, this._removeTimeout));
        // Add edge
        Main.layoutManager.addChrome (this.topedge, { visibleInFullscreen:true });

        // Define right edge
        this.rightedge = new Clutter.Rectangle ({
            name: "right-edge",
            x: monitor.width - SIZE, y: monitor.y + offsety,
            width: SIZE, height: monitor.height - 2*offsety,
            opacity: OPACITY,
            reactive: true });
        // Connect enter-event
        this.rightedge.connect ('enter-event', Lang.bind (this, this._goRight));
        // Connect leave-event
        this.rightedge.connect ('leave-event', Lang.bind (this, this._removeTimeout));
        // Add edge
        Main.layoutManager.addChrome (this.rightedge, { visibleInFullscreen:true });

        // Define bottom edge
        this.bottomedge = new Clutter.Rectangle ({
            name: "bottom-edge",
            x: monitor.x + offsetx, y: monitor.height - SIZE,
            width: monitor.width - 2*offsetx, height: SIZE,
            opacity: OPACITY,
            reactive: true });
        // Connect enter-event
        this.bottomedge.connect ('enter-event', Lang.bind (this, this._goDown));
        // Connect leave-event
        this.bottomedge.connect ('leave-event', Lang.bind (this, this._removeTimeout));
        // Add edge
        Main.layoutManager.addChrome (this.bottomedge, { visibleInFullscreen:true });

        // Define left edge
        this.leftedge = new Clutter.Rectangle ({
            name: "left-edge",
            x: monitor.x, y: monitor.y + offsety,
            width: SIZE, height: monitor.height - 2*offsety,
            opacity: OPACITY,
            reactive: true });
        // Connect enter-event
        this.leftedge.connect ('enter-event', Lang.bind (this, this._goLeft));
        // Connect leave-event
        this.leftedge.connect ('leave-event', Lang.bind (this, this._removeTimeout));
        // Add edge
        Main.layoutManager.addChrome (this.leftedge, { visibleInFullscreen:true });
    },

    _goUp: function (actor, event) {
        this._initialDelayTimeoutId = MainLoop.timeout_add (DELAY_TIMEOUT, function() {
            Main.wm.actionMoveWorkspaceUp();
            this._initialDelayTimeoutId = 0;
        });
    },

    _goRight: function (actor, event) {
        this._initialDelayTimeoutId = MainLoop.timeout_add (DELAY_TIMEOUT, function() {
            Main.wm.actionMoveWorkspaceRight();
            this._initialDelayTimeoutId = 0;
        });
    },

    _goDown: function (actor, event) {
        this._initialDelayTimeoutId = MainLoop.timeout_add (DELAY_TIMEOUT, function() {
            Main.wm.actionMoveWorkspaceDown();
            this._initialDelayTimeoutId = 0;
        });
    },

    _goLeft: function (actor, event) {
        this._initialDelayTimeoutId = MainLoop.timeout_add (DELAY_TIMEOUT, function() {
            Main.wm.actionMoveWorkspaceLeft();
            this._initialDelayTimeoutId = 0;
        });
    },

    _removeTimeout: function (actor, event) {
        MainLoop.source_remove(this._initialDelayTimeoutId);
    },

    destroy: function() {
        Main.layoutManager.removeChrome (this.topedge);
        Main.layoutManager.removeChrome (this.rightedge);
        Main.layoutManager.removeChrome (this.bottomedge);
        Main.layoutManager.removeChrome (this.leftedge);
        this.topedge.destroy();
        this.rightedge.destroy();
        this.bottomedge.destroy();
        this.leftedge.destroy();
    }
}

function init() {
    if (Main.wm._workspaceSwitcherPopup == null)
        Main.wm._workspaceSwitcherPopup = new WorkspaceSwitcherPopup.WorkspaceSwitcherPopup();
}

// Enable extension
function enable() {
    switcher = new EdgeFlipping();
}

// Disable extension
function disable() {
    switcher.destroy();
}
