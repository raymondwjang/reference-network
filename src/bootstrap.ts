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

function logError(msg: string, error): void {
  Zotero.log(`${msg} ${error}: ${error.stack}`, "error");
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

  Services.scriptloader.loadSubScript(`${rootURI}weaver.js`, { Zotero });

  // const weaver = Zotero.Weaver;

  log(`Startup: ${typeof Zotero}`);
  try {
    // await Zotero.PreferencePanes.register({
    //   // Generates a pane in Preference
    //   pluginID: "weaver@example.com",
    //   src: `${rootURI}prefs.xhtml`,
    //   scripts: [`${rootURI}prefs.js`],
    // });
    // log("Registered preference pane");

    await Zotero.Weaver.init({ id, version, rootURI });
    log("Initialized Weaver");
  } catch (error) {
    log("Error during startup: " + error.stack);
  }

  try {
    log(typeof Zotero.Weaver);
    Zotero.Weaver.addToAllWindows();
  } catch (error) {
    logError("Error during a UI Test!", error);
  }
}

export function shutdown() {
  log("Weaver: Shutdown");

  Zotero.Weaver = undefined;
}

export function uninstall() {
  log("Weaver: Uninstalled");
}
