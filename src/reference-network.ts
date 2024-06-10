import { queries } from "./database/queries";
import { DatabaseManager } from "./database/databaseManager";
import { ApiManager } from "./database/apiManager";

export const ReferenceNetwork = {
  id: null,
  version: null,
  rootURI: null,
  initialized: false,
  addedElementIDs: [],
  dbManager: new DatabaseManager(Zotero.DataDirectory.dir),

  log: (msg: string): void => {
    Zotero.log(`Reference Network (reference-network.ts): ${msg}`);
  },

  error: (msg: string, e: Error): void => {
    Zotero.logError(e);
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

    await this.dbManager.initializeDatabase();

    if (
      (await Zotero.DB.valueQueryAsync(
        "SELECT COUNT(*) FROM referencenetwork.graph"
      )) === 0
    ) {
      this.log("Adding rows to Graph table...");
      for (let i = 0; i < 10; i++) {
        await this.dbManager.addGraphRow(
          `source-${i}`,
          `type-${i}`,
          `target-${i}`,
          `data_source-${i}`
        );
      }
      this.log("Rows added to Graph table");

      this.log("Grabbing all DOI's from Zotero...");
      const dois = await Zotero.DB.columnQueryAsync(queries.getDOIs);
      this.log(
        "DOI's grabbed: " + dois.length + "\nexamples: " + dois.slice(0, 5)
      );

      const data = {};

      const apiManager = new ApiManager("raymond.w.jang@gmail.com");

      for (const doi of dois) {
        // there is a better way to do it, by submitting all requests at once
        try {
          data[doi] = await apiManager.fetchData(doi);
        } catch (e) {
          this.error(`Error fetching data for DOI ${doi}`, e);
        }
      }
    }

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
