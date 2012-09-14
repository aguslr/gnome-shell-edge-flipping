// -*- mode: js2; indent-tabs-mode: nil; js2-basic-offset: 4 -*-

const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;

const Gettext = imports.gettext.domain('gnome-shell-edge-flipping');
const _ = Gettext.gettext;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

function init() {
    Convenience.initTranslations();
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

        /* continue, vertical & horizontal flipping */
        let boolean_items = {
            "continue": "Continue Flipping",
            "enable-vertical": "Vertical Flipping",
            "enable-horizontal": "Horizontal Flipping",
        };
        for (item in boolean_items) {
            this.attach(new Gtk.Label({ label: boolean_items[item] }), 0, row, 1, 1);
            let widget = new Gtk.Switch({ active: this._settings.get_boolean(item) });
            this._settings.bind(item, widget, 'active', Gio.SettingsBindFlags.DEFAULT);
            this.attach(widget, 1, row, 1, 1);
            row++;
        }
        /* delay timeout */
        this.attach(new Gtk.Label({ label: "Delay Timeout (ms)" }), 0, row, 1, 1);
        let adjustment = new Gtk.Adjustment ({
            value: this._settings.get_int("delay-timeout"),
            lower: 0,
            upper: 2001,
            step_increment: 10,
            page_increment: 100 });
        let widget = new Gtk.SpinButton({ adjustment: adjustment });
        this._settings.bind("delay-timeout", widget, "value", Gio.SettingsBindFlags.DEFAULT);
        this.attach(widget, 1, row, 1, 1);
        row++;

        /* size */
        this.attach(new Gtk.Label({ label: "Reactive Area Size (Pixels)" }), 0, row, 1, 1);
        let adjustment = new Gtk.Adjustment ({
            value: this._settings.get_int("size"),
            lower: 1,
            upper: 100,
            step_increment: 1,
            page_increment: 10 });
        let widget = new Gtk.SpinButton({ adjustment: adjustment });
        this._settings.bind("size", widget, "value", Gio.SettingsBindFlags.DEFAULT);
        this.attach(widget, 1, row, 1, 1);
        row++;

        /* offset */
        this.attach(new Gtk.Label({ label: "Offset From Screen Edge (%)" }), 0, row, 1, 1);
        let adjustment = new Gtk.Adjustment ({
            value: this._settings.get_int("offset"),
            lower: 0,
            upper: 50,
            step_increment: 1,
            page_increment: 10 });
        let widget = new Gtk.SpinButton({ adjustment: adjustment });
        this._settings.bind("offset", widget, "value", Gio.SettingsBindFlags.DEFAULT);
        this.attach(widget, 1, row, 1, 1);
        row++;

        /* opacity */
        this.attach(new Gtk.Label({ label: "Reactive Area Opacity (0-255)" }), 0, row, 1, 1);
        let adjustment = new Gtk.Adjustment ({
            value: this._settings.get_int("opacity"),
            lower: 0,
            upper: 255,
            step_increment: 1,
            page_increment: 10 });
        let widget = new Gtk.SpinButton({ adjustment: adjustment });
        this._settings.bind("opacity", widget, "value", Gio.SettingsBindFlags.DEFAULT);
        this.attach(widget, 1, row, 1, 1);
        row++;
    },
});

function buildPrefsWidget() {
    let widget = new EdgeFlippingPrefsWidget();
    widget.show_all();

    return widget;
}
