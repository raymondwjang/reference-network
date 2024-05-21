import { Shim } from "./os";
import { is7 } from "./client";

const $OS = is7 ? Shim : OS;

// import { orchestrator } from "./orchestrator";
// import type { Reason } from "./bootstrap";

export const ReferenceNetwork = {
  id: null,
  version: null,
  rootURI: null,
  initialized: false,
  addedElementIDs: [],

  log: (msg: string): void => {
    Zotero.log(`Reference Network: ${msg}`);
  },

  init({
    id,
    version,
    rootURI,
  }: {
    id: string;
    version: string;
    rootURI: string;
  }): void {
    Zotero.log("Loading Reference Network: starting...");
    if (this.initialized) {
      throw new Error("ReferenceNetwork is already running");
    }
    this.id = id;
    this.version = version;
    this.rootURI = rootURI;

    // Build Directory
    this.dir = $OS.Path.join(Zotero.DataDirectory.dir, "reference-network");
    $OS.File.makeDir(this.dir, { ignoreExisting: true });

    // orchestrator.add("start", {
    //   description: "zotero",
    //   startup: async (reason: Reason) => {
    //     // https://groups.google.com/d/msg/zotero-dev/QYNGxqTSpaQ/uvGObVNlCgAJ
    //     // this is what really takes long
    //     await Zotero.initializationPromise;

    //     this.dir = $OS.Path.join(Zotero.DataDirectory.dir, "reference-network");
    //     await $OS.File.makeDir(this.dir, { ignoreExisting: true });
    //     // await Preference.startup(this.dir);
    //     // Events.startup();
    //   },
    // });

    this.initialized = true;
  },

  async main() {
    // `window` is the global object in overlay scope
    const { host } = new URL("https://foo.com/path");
    this.log(`Host is ${host}`);

    this.log(
      `Intensity is ${Zotero.Prefs.get(
        "extensions.make-it-red.intensity",
        true
      )}`
    );
  },
};
