import { Shim } from "./environment/os";
import { is7 } from "./environment/client";
// import { AppDataSource } from "./database/createDB";
import { DataSource } from "typeorm";
import { Graph } from "./database/entity/graphs";

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

    // Attach New Database: This is the problem
    // ok, so I can't even load it.
    this.log(`Creating database...`);
    const AppDataSource = new DataSource({
      type: "sqlite",
      database: "database.sqlite",
      synchronize: true,
      logging: false,
      entities: [],
      migrations: [],
      subscribers: [],
    });
    // this.log(`Database created`);

    // AppDataSource.initialize()
    //   .then(() => {
    //     console.log("Connected to the database!");

    //     // Add additional setup or testing code here
    //   })
    //   .catch((error) =>
    //     console.log("Error during Data Source initialization:", error)
    //   );
    this.log("Database attached");

    this.initialized = true;
  },

  async main() {
    // `window` is the global object in overlay scope
    const { host } = new URL("https://foo.com/path");
    this.log(`Host is ${host}`);

    this.log(
      `reference-network.ts: main() called with ${this.id}, ${this.version}, ${this.rootURI}`
    );
  },
};
