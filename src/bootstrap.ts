import { Weaver } from "./weaver";

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

function log(msg: string): void {
  Zotero.log(msg, "warning", "Weaver: bootstrap.ts");
}

export function install(): void {
  log("Installed");
}

export async function startup({
  id,
  version,
  resourceURI,
  rootURI = resourceURI.spec,
}) {
  await Promise.all([
    Zotero.initializationPromise,
    Zotero.unlockPromise,
    Zotero.uiReadyPromise,
  ]);

  log(`ID: ${id}`);
  log(`Version: ${version}`);
  log(`Resource URI: ${resourceURI}`);
  log(`Root URI: ${rootURI}`);

  const weaver = new Weaver();

  try {
    // await Zotero.PreferencePanes.register({
    //   // Generates a pane in Preference
    //   pluginID: "weaver@example.com",
    //   src: `${rootURI}prefs.xhtml`,
    //   scripts: [`${rootURI}prefs.js`],
    // });
    // log("Registered preference pane");

    await weaver.init({ id, version, rootURI });
    log("Initialized Weaver");
  } catch (error) {
    log("Error during startup: " + error.message);
  }

  weaver.addToAllWindows();
}

export function shutdown() {
  log("Weaver: Shutdown");

  Zotero.weaver = undefined;
}

export function uninstall() {
  log("Weaver: Uninstalled");
}
