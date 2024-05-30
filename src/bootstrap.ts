import { ReferenceNetwork } from "./reference-network";

Zotero.log("Reference Network: Loading bootstrap");

const BOOTSTRAP_REASONS = {
  1: "APP_STARTUP",
  2: "APP_SHUTDOWN",
  3: "ADDON_ENABLE",
  4: "ADDON_DISABLE",
  5: "ADDON_INSTALL",
  6: "ADDON_UNINSTALL",
  7: "ADDON_UPGRADE",
  8: "ADDON_DOWNGRADE",
} as const;
type ReasonId = keyof typeof BOOTSTRAP_REASONS;
export type Reason = (typeof BOOTSTRAP_REASONS)[ReasonId];

function log(msg) {
  Zotero.log(`Reference Network (bootstrap.ts): ${msg}`);
}

export function install() {
  log("Installed");
}

export async function startup({
  id,
  version,
  resourceURI,
  rootURI = resourceURI.spec,
}) {
  log("Startup");
  log(`ID: ${id}`);
  log(`Version: ${version}`);
  log(`Resource URI: ${resourceURI}`);
  log(`Root URI: ${rootURI}`);

  await Zotero.PreferencePanes.register({
    pluginID: "reference-network@example.com",
    src: `${rootURI}preferences.xhtml`,
    scripts: [`${rootURI}prefs.js`],
  }).then(() => log("Registered preference pane"));

  // Add DOM elements to the main Zotero pane
  // const win = Zotero.getMainWindow();
  // if (win && win.ZoteroPane) {
  //   const zp = win.ZoteroPane;
  //   const doc = win.document;
  // }

  // Services.scriptloader.loadSubScript(`${rootURI}reference-network.js`);
  // log("Loaded reference-network.js");

  // await ReferenceNetwork.init({ id, version, rootURI }).then(() =>
  //   log("Initialized Reference Network")
  // );
}

export function shutdown() {
  log("Reference Network: Shutdown");

  Zotero.ReferenceNetwork = undefined;
}

export function uninstall() {
  log("Reference Network: Uninstalled");
}
