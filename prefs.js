// -*- mode: js2; indent-tabs-mode: nil; js2-basic-offset: 4 -*-

const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

function init() {

}

const EdgeFlippingPrefsWidget = new GObject.Class({
    Name: 'EdgeFlipping.Prefs.Widget',
    GTypeName: 'EdgeFlippingPrefsWidget',
    Extends: Gtk.Grid,
    _init: function(params) {
        this.parent(params);
        this._settings = Convenience.getSettings();
        this.margin = this.row_spacing = this.column_spacing = 10;

        let row = 0;

        row = this._add_boolean("continue", "Continuous Flipping", row);
        row = this._add_boolean("enable-vertical", "Vertical Flipping", row);
        row = this._add_boolean("enable-horizontal", "Horizontal Flipping", row);

        row = this._add_numeric("delay-timeout", "Delay Timeout (ms)", 0, 2000, 10, 100, row);
        row = this._add_numeric("size", "Reactive Area Size (Pixels)", 1, 500, 1, 10, row);
        row = this._add_numeric("offset", "Offset From Screen Edge (%)", 0, 50, 1, 10, row);
        row = this._add_numeric("opacity", "Reactive Area Opacity (0-255)", 0, 255, 1, 10, row);
    },

    _add_boolean: function(key, label, row) {
        this.attach(new Gtk.Label({ label: label }), 0, row, 1, 1);
        let widget = new Gtk.Switch({ active: this._settings.get_boolean(key) });
        this._settings.bind(key, widget, 'active', Gio.SettingsBindFlags.DEFAULT);
        this.attach(widget, 1, row, 1, 1);
        return ++row;
    },

    _add_numeric: function(key, label, lower, upper, step, page, row) {
        this.attach(new Gtk.Label({ label: label }), 0, row, 1, 1);
        let adjustment = new Gtk.Adjustment ({
            value: this._settings.get_int(key),
            lower: lower,
            upper: upper,
            step_increment: step,
            page_increment: page });
        let widget = new Gtk.SpinButton({ adjustment: adjustment });
        this._settings.bind(key, widget, "value", Gio.SettingsBindFlags.DEFAULT);
        this.attach(widget, 1, row, 1, 1);
        return ++row;
    }
});

function buildPrefsWidget() {
    let widget = new EdgeFlippingPrefsWidget();
    widget.show_all();

    return widget;
}
