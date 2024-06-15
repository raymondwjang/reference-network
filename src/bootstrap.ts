import { Weaver } from "./weaver.js";

function log(msg: string): void {
  Zotero.log(msg, "warning", "Weaver: bootstrap.ts");
}

function logError(msg: string, error): void {
  Zotero.log(`${msg} ${error}: ${error.stack}`, "error");
}

export async function install(): Promise<void> {
  const weaver = new Weaver();
  Zotero.Weaver = weaver;

  try {
    await weaver.install();
    log("Installed Weaver");
  } catch (error) {
    logError("Error during installation", error);
  }
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
  Zotero.Weaver = weaver;

  log(`Startup: ${typeof Zotero}`);
  try {
    await Zotero.PreferencePanes.register({
      // Generates a pane in Preference
      pluginID: "weaver@example.com",
      src: `${rootURI}prefs/prefs.xhtml`,
      scripts: [`${rootURI}prefs/prefs.js`],
      // defaultXUL: false,
    });
    log("Registered preference pane");
  } catch (error) {
    logError("Error registering preference pane", error);
  }

  try {
    await weaver.install();
    log("Installed Weaver");
  } catch (error) {
    logError("Error during installation", error);
  }

  try {
    await weaver.init({ id, version, rootURI });
    log("Initialized Weaver");
  } catch (error) {
    log("Error during startup: " + error.stack);
  }

  try {
    weaver.addToAllWindows();
    log("UI test complete!");
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
