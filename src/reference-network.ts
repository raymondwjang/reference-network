import { Shim } from "./environment/os";
import { is7 } from "./environment/client";

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
    Zotero.log(`Reference Network (reference-network.ts): ${msg}`);
  },

  async init({
    id,
    version,
    rootURI,
  }: {
    id: string;
    version: string;
    rootURI: string;
  }): Promise<void> {
    this.log("Loading ReferenceNetwork: starting...");
    if (this.initialized) {
      throw new Error("ReferenceNetwork is already running");
    }
    this.id = id;
    this.version = version;
    this.rootURI = rootURI;

    // Build Directory
    this.dir = $OS.Path.join(Zotero.DataDirectory.dir, "reference-network");
    $OS.File.makeDir(this.dir, { ignoreExisting: true });
    this.log(`Directory created at ${this.dir}`);

    // Attach New Database
    await Zotero.DB.queryAsync("ATTACH DATABASE ? AS referencenetwork", [
      $OS.Path.join(Zotero.DataDirectory.dir, "reference-network.sqlite"),
    ]);

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
