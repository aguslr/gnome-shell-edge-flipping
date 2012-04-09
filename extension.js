/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */
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
const Extension = imports.ui.extensionSystem.extensions['edge-flipping@aguslr.github.com'];

// Declare some parameters
const DELAY_TIMEOUT = 300   // milliseconds
const ENABLE_HORIZ = false  // boolean
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
        this._topedge = new Clutter.Rectangle ({
            name: "top-edge",
            x: monitor.x + offsetx, y: monitor.y,
            width: monitor.width - 2*offsetx, height: SIZE,
            opacity: OPACITY,
            reactive: true });
        // Connect enter-event
        this._topedge.connect ('enter-event', Lang.bind (this, this._switchWorkspace));
        // Connect leave-event
        this._topedge.connect ('leave-event', Lang.bind (this, this._removeTimeout));
        // Add edge
        Main.layoutManager.addChrome (this._topedge, { visibleInFullscreen:true });

        // Define bottom edge
        this._bottomedge = new Clutter.Rectangle ({
            name: "bottom-edge",
            x: monitor.x + offsetx, y: monitor.height - SIZE,
            width: monitor.width - 2*offsetx, height: SIZE,
            opacity: OPACITY,
            reactive: true });
        // Connect enter-event
        this._bottomedge.connect ('enter-event', Lang.bind (this, this._switchWorkspace));
        // Connect leave-event
        this._bottomedge.connect ('leave-event', Lang.bind (this, this._removeTimeout));
        // Add edge
        Main.layoutManager.addChrome (this._bottomedge, { visibleInFullscreen:true });

        // Check whether horizontal edges are enabled
        if (ENABLE_HORIZ) {
            // Define right edge
            this._rightedge = new Clutter.Rectangle ({
                name: "right-edge",
                x: monitor.width - SIZE, y: monitor.y + offsety,
                width: SIZE, height: monitor.height - 2*offsety,
                opacity: OPACITY,
                reactive: true });
            // Connect enter-event
            this._rightedge.connect ('enter-event', Lang.bind (this, this._switchWorkspace));
            // Connect leave-event
            this._rightedge.connect ('leave-event', Lang.bind (this, this._removeTimeout));
            // Add edge
            Main.layoutManager.addChrome (this._rightedge, { visibleInFullscreen:true });

            // Define left edge
            this._leftedge = new Clutter.Rectangle ({
                name: "left-edge",
                x: monitor.x, y: monitor.y + offsety,
                width: SIZE, height: monitor.height - 2*offsety,
                opacity: OPACITY,
                reactive: true });
            // Connect enter-event
            this._leftedge.connect ('enter-event', Lang.bind (this, this._switchWorkspace));
            // Connect leave-event
            this._leftedge.connect ('leave-event', Lang.bind (this, this._removeTimeout));
            // Add edge
            Main.layoutManager.addChrome (this._leftedge, { visibleInFullscreen:true });
        };
    },

    _switchWorkspace: function (actor, event) {
        this._initialDelayTimeoutId = MainLoop.timeout_add (DELAY_TIMEOUT, function() {
            switch (actor.name) {
                case "top-edge":
                    Main.wm.actionMoveWorkspaceUp();
                    break;
                case "right-edge":
                    Main.wm.actionMoveWorkspaceRight();
                    break;
                case "bottom-edge":
                    Main.wm.actionMoveWorkspaceDown();
                    break;
                case "left-edge":
                    Main.wm.actionMoveWorkspaceLeft();
                    break;
            };
            this._initialDelayTimeoutId = 0;
        });
    },

    _removeTimeout: function (actor, event) {
        MainLoop.source_remove(this._initialDelayTimeoutId);
    },

    destroy: function() {
        MainLoop.source_remove(this._initialDelayTimeoutId);
        Main.layoutManager.removeChrome (this._topedge);
        Main.layoutManager.removeChrome (this._rightedge);
        Main.layoutManager.removeChrome (this._bottomedge);
        Main.layoutManager.removeChrome (this._leftedge);
        this._topedge.destroy();
        this._rightedge.destroy();
        this._bottomedge.destroy();
        this._leftedge.destroy();
    }
}

function init() {
    if (Main.wm._workspaceSwitcherPopup == null)
        Main.wm._workspaceSwitcherPopup = new WorkspaceSwitcherPopup.WorkspaceSwitcherPopup();
}

// Enable extension
function enable() {
    let switcher = new EdgeFlipping();
}

// Disable extension
function disable() {
    switcher.destroy();
}

/* vim: set shiftwidth=4 tabstop=4 expandtab : */
