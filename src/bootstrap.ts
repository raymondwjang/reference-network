// import { DataSource } from "typeorm";
// check is typeorm is importable
// import { Graph } from "./database/entity/graphs";
import { OS as $OS } from "./environment/osfile";
import { ReferenceNetwork } from "./reference-network";

// async function initializeTypeORM() {
//   const AppDataSource = new DataSource({
//     type: "sqlite",
//     database: $OS.Path.join(
//       Zotero.DataDirectory.dir,
//       "reference-network.sqlite"
//     ),
//     entities: [Graph],
//     synchronize: true,
//   });

//   try {
//     await AppDataSource.initialize();
//     Zotero.log("TypeORM DataSource initialized successfully.");
//     return AppDataSource;
//   } catch (error) {
//     Zotero.log(`Error initializing TypeORM DataSource: ${error.message}`);
//     throw error; // Re-throw if you want Zotero to handle it or handle it here
//   }
// }

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
  // try {
  //   // Initialize TypeORM DataSource
  //   const dataSource = await initializeTypeORM();

  //   // Proceed with Zotero's startup process
  //   // Place other startup tasks here
  //   Zotero.log("Zotero started successfully.");
  // } catch (error) {
  //   // Handle any errors that occur during initialization
  //   Zotero.log(`Error during startup: ${error.message}`);
  // }
  // log(typeof Graph); --> This throws an error
  // log(typeof DataSource); --> This throws an error, as well
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
  const win = Zotero.getMainWindow();
  if (win && win.ZoteroPane) {
    const zp = win.ZoteroPane;
    const doc = win.document;
  }

  Services.scriptloader.loadSubScript(`${rootURI}reference-network.js`);
  log("Loaded reference-network.js");

  // This line is the problem
  await ReferenceNetwork.init({ id, version, rootURI }).then(() =>
    log("Initialized Reference Network")
  );
}

export function shutdown() {
  log("Reference Network: Shutdown");

  Zotero.ReferenceNetwork = undefined;
}

export function uninstall() {
  log("Reference Network: Uninstalled");
}
