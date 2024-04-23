# Notes for the Zotero Plugin

## Plugin format

Bootstrapped Zotero plugins in Zotero 7 require two components:

- A WebExtension-style manifest.json file, as described above
- A bootstrap.js file containing functions to handle various events:
  - Plugin lifecycle hooks
  - Window hooks

## Hooks

Plugin lifecycle hooks are modeled after the legacy Mozilla bootstrapped-extension framework:

Plugin lifecycle hooks are passed two parameters:

- An object with these properties:
  - id, the plugin id
  - version, the plugin version
  - rootURI, a string URL pointing to the plugin's files. For XPIs, this will be a jar:file:/// URL. This value will always end in a slash, so you can append a relative path to get a URL for a file bundled with your plugin (e.g., rootURI + 'style.css').
- A number representing the reason for the event, which can be checked against the following constants: APP_STARTUP, APP_SHUTDOWN, ADDON_ENABLE, ADDON_DISABLE, ADDON_INSTALL, ADDON_UNINSTALL, ADDON_UPGRADE, ADDON_DOWNGRADE

Window hooks are passed one parameter:

- An object with a window property containing the target window

### `startup()`

Any initialization unrelated to specific windows should be triggered by startup

### `onMainWindowLoad()`

(Zotero 7 only)

On some platforms, the main window can be opened and closed multiple times during a Zotero session, so any window-related activities, such as modifying the main UI, adding menus, or binding shortcuts must be performed by onMainWindowLoad so that new main windows contain your changes.

### `onMainWindowUnload()`

(Zotero 7 only)

You must then remove all references to a window or objects within it, cancel any timers, etc., when onMainWindowUnload is called, or else you'll risk creating a memory leak every time the window is closed.

### `shutdown()`

removal should be triggered by shutdown.

DOM elements added to a window will be automatically destroyed when the window is closed, so you only need to remove those in shutdown(), which you can do by cycling through all windows:

```js
function shutdown() {
  var windows = Zotero.getMainWindows();
  for (let win of windows) {
    win.document.getElementById('make-it-red-stylesheet')?.remove();
  }
}
```

### `install()`

### `uninstall()`

## Features

### Panes

Zotero now includes a built-in function to register a preference pane. In your plugin's startup function:

```js
Zotero.PreferencePanes.register({
  pluginID: 'make-it-red@zotero.org',
  src: 'prefs.xhtml',
  scripts: ['prefs.js'],
  stylesheets: ['prefs.css'],
});
```

See also: https://github.com/zotero/zotero/blob/main/chrome/content/zotero/xpcom/preferencePanes.js

## References
- https://www.zotero.org/support/dev/zotero_7_for_developers - the elusive description of what in the heck zotero plugins actually are
- [preferencesPanes.js](https://github.com/zotero/zotero/blob/main/chrome/content/zotero/xpcom/preferencePanes.js) - settings for preferences panes
