Zotero.log("Reference Network: Loading bootstrap");

// var stylesheetID = "reference-network-stylesheet";
// var ftlID = "reference-network-ftl";
// var menuitemID = "make-it-green-instead";
// var addedElementIDs = [stylesheetID, ftlID, menuitemID];

function log(msg) {
  Zotero.log(`Reference Network: ${msg}`);
}

export function install() {
  log("Reference Network: Installed");
}

// function setDefaultPrefs(rootURI) {
// var branch = Services.prefs.getDefaultBranch("");
// var obj = {
//   pref(pref, value) {
//     switch (typeof value) {
//       case 'boolean':
//         branch.setBoolPref(pref, value)
//         break
//       case 'string':
//         branch.setStringPref(pref, value)
//         break
//       case 'number':
//         branch.setIntPref(pref, value)
//         break
//       default:
//         Zotero.logError(`Invalid type '${typeof(value)}' for pref '${pref}'`)
//     }
//   },
// }
// Services.scriptloader.loadSubScript(`${rootURI}prefs.js`, obj);
// }

export async function startup({
  id,
  version,
  resourceURI,
  rootURI = resourceURI.spec,
}) {
  log(`Reference Network: Startup`);
  log(`ID: ${id}`);
  log(`Version: ${version}`);
  log(`Resource URI: ${resourceURI}`);
  log(`Root URI: ${rootURI}`);

  Zotero.PreferencePanes.register({
    pluginID: "reference-network@example.com",
    src: rootURI + "preferences.xhtml",
    scripts: [rootURI + "prefs.js"],
  });

  log(`Registered preference pane`);
  // Add DOM elements to the main Zotero pane
  // var win = Zotero.getMainWindow();
  // if (win && win.ZoteroPane) {
  //   const zp = win.ZoteroPane;
  //   const doc = win.document;
  // createElementNS() necessary in Zotero 6; createElement() defaults to HTML in Zotero 7
  // const HTML_NS = "http://www.w3.org/1999/xhtml";
  // const XUL_NS =
  //   "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
  // const link1 = doc.createElementNS(HTML_NS, "link");
  // link1.id = stylesheetID;
  // link1.type = "text/css";
  // link1.rel = "stylesheet";
  // link1.href = `${rootURI}style.css`;
  // doc.documentElement.appendChild(link1);

  // const menuitem = doc.createElementNS(XUL_NS, "menuitem");
  // menuitem.id = menuitemID;
  // menuitem.setAttribute("type", "checkbox");
  // menuitem.setAttribute("data-l10n-id", "make-it-green-instead");
  // menuitem.addEventListener("command", () => {
  //   Zotero.ReferenceNetwork.toggleGreen(
  //     menuitem.getAttribute("checked") === "true"
  //   );
  // });
  // doc.getElementById("menu_viewPopup").appendChild(menuitem);

  // Use strings from reference-network.ftl (Fluent) in Zotero 7
  // const link2 = doc.createElementNS(HTML_NS, "link");
  // link2.id = ftlID;
  // link2.rel = "localization";
  // link2.href = "reference-network.ftl";
  //   doc.documentElement.appendChild(link2);
  // }

  Services.scriptloader.loadSubScript(`${rootURI}reference-network.js`);
  log(`Loaded reference-network.js`);

  ReferenceNetwork.init({ id, version, rootURI });
  log(`Initialized Reference Network`);

  // Zotero.ReferenceNetwork.foo();
}

export function onMainWindowLoad({ window }) {
  ReferenceNetwork.addToWindow(window);
}

export function onMainWindowUnload({ window }) {
  ReferenceNetwork.removeFromWindow(window);
}

export function shutdown() {
  log(`Reference Network: Shutdown`);

  // Remove stylesheet
  var zp = Zotero.getActiveZoteroPane();
  if (zp) {
    // for (const id of addedElementIDs) {
    //   // ?. (null coalescing operator) not available in Zotero 6
    //   const elem = zp.document.getElementById(id);
    //   if (elem) elem.remove();
    // }
  }

  Zotero.ReferenceNetwork = undefined;
}

export function uninstall() {
  log("Reference Network: Uninstalled");
}
