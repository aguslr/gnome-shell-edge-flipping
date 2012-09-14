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
const Mainloop = imports.mainloop;
const WorkspaceSwitcherPopup = imports.ui.workspaceSwitcherPopup;

// Declare some parameters
const CONTINUE = false;      // boolean
const ENABLE_VERT= true;     // boolean
const ENABLE_HORIZ = false;  // boolean
const DELAY_TIMEOUT = 300;   // milliseconds
const OFFSET = 5;            // percentage
const SIZE = 1;              // pixels
const OPACITY = 0;           // 0-255

function EdgeFlipping() {
    this._init();
}

// Object structure
EdgeFlipping.prototype = {
    _init: function() {

        // Calculate some variables
        this._monitor = Main.layoutManager.primaryMonitor;
        this._offsetx = this._monitor.width * OFFSET/100;
        this._offsety = this._monitor.height * OFFSET/100;

        // Check whether vertical edges are enabled
        this._edges = [];
        if (ENABLE_VERT) {
            // Define top edge
            this._edges.push (new Clutter.Rectangle ({
                name: "top-edge",
                x: this._monitor.x + this._offsetx, y: this._monitor.y,
                width: this._monitor.width - 2 * this._offsetx, height: SIZE,
                opacity: OPACITY,
                reactive: true })
            );
            // Define bottom edge
            this._edges.push (new Clutter.Rectangle ({
                name: "bottom-edge",
                x: this._monitor.x + this._offsetx, y: this._monitor.height - SIZE,
                width: this._monitor.width - 2 * this._offsetx, height: SIZE,
                opacity: OPACITY,
                reactive: true })
            );
        }
        if (ENABLE_HORIZ) {
            // Define right edge
            this._edges.push (new Clutter.Rectangle ({
                name: "right-edge",
                x: this._monitor.width - SIZE, y: this._monitor.y + this._offsety,
                width: SIZE, height: this._monitor.height - 2 * this._offsety,
                opacity: OPACITY,
                reactive: true })
            );
            // Define left edge
            this._edges.push (new Clutter.Rectangle ({
                name: "left-edge",
                x: this._monitor.x, y: this._monitor.y + this._offsety,
                width: SIZE, height: this._monitor.height - 2 * this._offsety,
                opacity: OPACITY,
                reactive: true })
            );
        }
        let self = this;
        this._edges.forEach(function(edge) {
            // Connect enter-event
            edge.connect ('enter-event', Lang.bind (self, self._switchWorkspace));
            // Connect leave-event
            edge.connect ('leave-event', Lang.bind (self, self._removeTimeout));
            // Add edge
            Main.layoutManager.addChrome (edge, { visibleInFullscreen:true });
        });
        // When display setup changes, recreate edges
        global.screen.connect('monitors-changed', Lang.bind(this, this._resetEdges));
    },

    _switchWorkspace: function (actor, event) {
        this._initialDelayTimeoutId = Mainloop.timeout_add (DELAY_TIMEOUT, function() {
            switch (actor.name) {
                case "top-edge":
                    Main.wm.actionMoveWorkspaceUp();
                    break;
                case "bottom-edge":
                    Main.wm.actionMoveWorkspaceDown();
                    break;
                case "right-edge":
                    Main.wm.actionMoveWorkspaceRight();
                    break;
                case "left-edge":
                    Main.wm.actionMoveWorkspaceLeft();
                    break;
            };
            // Check if we are in the last workspace on either end
            // and continuous switching is enabled
            let currentWorkspace = global.screen.get_active_workspace_index();
            let lastWorkspace = global.screen.n_workspaces - 1;
            if ( actor.name == "top-edge" || actor.name == "left-edge" ) {
                if ( CONTINUE && currentWorkspace != 0 )
                    // If not, return true for the process to repeat
                    return true;
            } else if ( actor.name == "bottom-edge" || actor.name == "right-edge" ) {
                if ( CONTINUE && currentWorkspace != lastWorkspace )
                    // If not, return true for the process to repeat
                    return true;
            }
            // If not, return false so timeout is automatically removed
            this._initialDelayTimeoutId = 0;
            return false;
        });
    },

    _removeTimeout: function (actor, event) {
        // If timeout exists, remove it
        if (this._initialDelayTimeoutId != 0)
            Mainloop.source_remove(this._initialDelayTimeoutId);
            this._initialDelayTimeoutId = 0;
    },

    _resetEdges: function (actor, event) {
        // Remove edges
        this.destroy();
        // Recreate edges
        this._init();
    },

    destroy: function() {
        // Remove timeout
        this._removeTimeout();
        // Remove and destroy all edges that were enabled
        this._edges.forEach(function(edge) {
            Main.layoutManager.removeChrome (edge);
            edge.destroy();
        });
    }
}

function init() {
    if (Main.wm._workspaceSwitcherPopup == null)
        Main.wm._workspaceSwitcherPopup = new WorkspaceSwitcherPopup.WorkspaceSwitcherPopup();
}

// Enable extension
var switcher;
function enable() {
    switcher = new EdgeFlipping();
}

// Disable extension
function disable() {
    switcher.destroy();
}

/* vim: set shiftwidth=4 tabstop=4 expandtab : */
