/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */
/*
 * edge-fipping
 * Copyright (C) 2012 Agus Lopez <contact@aguslr.com>,
 * Christian Schramm <christian.h.m.schramm@gmail.com>
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
const Meta = imports.gi.Meta

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

// Object structure
const EdgeFlipping = new Lang.Class({

    Name: 'EdgeFlipping',

    _init: function() {

        this._settings = Convenience.getSettings();

        // Calculate some variables
        this._monitor = Main.layoutManager.primaryMonitor;
        let offsetx = this._monitor.width * this._settings.get_int("offset")/100;
        let offsety = this._monitor.height * this._settings.get_int("offset")/100;
        let size = this._settings.get_int("size");

        // create all four edges and set reactivity to whether they are enabled
        // or not
        this._edges = {};
        this._edges["top"] = new Clutter.Rectangle ({
            name: "top-edge",
            x: this._monitor.x + offsetx,
            y: this._monitor.y,
            width: this._monitor.width - 2 * offsetx,
            height: size,
            reactive: this._settings.get_boolean("enable-vertical")
        });
        this._edges["bottom"] = new Clutter.Rectangle ({
            name: "bottom-edge",
            x: this._monitor.x + offsetx,
            y: this._monitor.height - size,
            width: this._monitor.width - 2 * offsetx,
            height: size,
            reactive: this._settings.get_boolean("enable-vertical")
        });
        this._edges["right"] = new Clutter.Rectangle ({
            name: "right-edge",
            x: this._monitor.width - size,
            y: this._monitor.y + offsety,
            width: size,
            height: this._monitor.height - 2 * offsety,
            reactive: this._settings.get_boolean("enable-horizontal")
        });
        this._edges["left"] = new Clutter.Rectangle ({
            name: "left-edge",
            x: this._monitor.x,
            y: this._monitor.y + offsety,
            width: size,
            height: this._monitor.height - 2 * offsety,
            reactive: this._settings.get_boolean("enable-horizontal")
        });

        for (edge in this._edges) {
            this._edges[edge].connect ('enter-event', Lang.bind (this, this._switchWorkspace));
            this._edges[edge].connect ('leave-event', Lang.bind (this, this._removeTimeout));
            this._edges[edge].opacity = this._settings.get_int("opacity");
            Main.layoutManager.addChrome (this._edges[edge], { trackFullscreen: true });
        };

        // When display setup changes, recreate edges
        global.screen.connect('monitors-changed', Lang.bind(this, this._resetEdges));

        // Monitor changes on edge offset
        this._settings.connect('changed::offset', Lang.bind(this, function(){
            let offsetx = this._monitor.width * this._settings.get_int("offset")/100;
            let offsety = this._monitor.height * this._settings.get_int("offset")/100;

            this._edges["top"].x = this._edges["bottom"].x = this._monitor.x + offsetx;
            this._edges["top"].width = this._edges["bottom"].width = this._monitor.width - 2 * offsetx;

            this._edges["right"].y = this._edges["left"].y = this._monitor.y + offsety;
            this._edges["right"].height = this._edges["left"].height = this._monitor.height - 2 * offsety;
        }));

        // Monitor changes on edge size
        this._settings.connect('changed::size', Lang.bind(this, function(){
            let size = this._settings.get_int("size");
            this._edges["top"].height = size;
            this._edges["bottom"].height = size;
            this._edges["right"].width = size;
            this._edges["left"].width = size;

            this._edges["bottom"].y = this._monitor.height - size;
            this._edges["right"].x = this._monitor.width - size;
        }));

        // Monitor changes on edge opacity
        this._settings.connect('changed::opacity', Lang.bind(this, function(){
            for (edge in this._edges) {
                this._edges[edge].set_opacity(this._settings.get_int("opacity"));
            }
        }));

        // When enabling or disabling vertical flipping, set reactivity of correspinding edge
        this._settings.connect('changed::enable-vertical', Lang.bind(this, function(){
            this._edges["bottom"].set_reactive(this._settings.get_boolean("enable-vertical"));
            this._edges["top"].set_reactive(this._settings.get_boolean("enable-vertical"));
        }));

        // Likewise with horizontal flipping
        this._settings.connect('changed::enable-horizontal', Lang.bind(this, function(){
            this._edges["left"].set_reactive(this._settings.get_boolean("enable-horizontal"));
            this._edges["right"].set_reactive(this._settings.get_boolean("enable-horizontal"));
        }));
    },

    _switchWorkspace: function (actor, event) {
        this._initialDelayTimeoutId = Mainloop.timeout_add (this._settings.get_int("delay-timeout"), Lang.bind(this, function() {
            switch (actor.name) {
                case "top-edge":
                    Main.wm.actionMoveWorkspace(Meta.MotionDirection.UP);
                    break;
                case "bottom-edge":
                    Main.wm.actionMoveWorkspace(Meta.MotionDirection.DOWN);
                    break;
                case "right-edge":
                    Main.wm.actionMoveWorkspace(Meta.MotionDirection.RIGHT);
                    break;
                case "left-edge":
                    Main.wm.actionMoveWorkspace(Meta.MotionDirection.LEFT);
                    break;
            };
            // Check if we are in the last workspace on either end
            // and continuous switching is enabled
            let currentWorkspace = global.screen.get_active_workspace_index();
            let lastWorkspace = global.screen.n_workspaces - 1;
            if ( actor.name == "top-edge" || actor.name == "left-edge" ) {
                if ( this._settings.get_boolean("continue") && currentWorkspace != 0 )
                    // If not, return true for the process to repeat
                    return true;
            } else if ( actor.name == "bottom-edge" || actor.name == "right-edge" ) {
                if ( this._settings.get_boolean("continue") && currentWorkspace != lastWorkspace )
                    // If not, return true for the process to repeat
                    return true;
            }
            // If not, return false so timeout is automatically removed
            this._initialDelayTimeoutId = 0;
            return false;
        }));
    },

    _removeTimeout: function (actor, event) {
        // If timeout exists, remove it
        if (this._initialDelayTimeoutId != 0) {
            Mainloop.source_remove(this._initialDelayTimeoutId);
            this._initialDelayTimeoutId = 0;
        }
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
        for (edge in this._edges) {
            Main.layoutManager.removeChrome (this._edges[edge]);
            this._edges[edge].destroy();
        }
    }
})

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
