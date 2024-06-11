import { queries } from "./database/queries";
import { DatabaseManager } from "./database/databaseManager";
import { ApiManager } from "./database/apiManager";

// Define an interface for initialization options
interface InitOptions {
  id: string;
  version: string;
  rootURI: string;
}

export class ReferenceNetwork {
  // I guess this is the .h of the __init__ method in Python 😭
  private id: string | null = null;
  private version: string | null = null;
  private rootURI: string | null = null;
  private initialized: boolean = false;
  private dbManager: DatabaseManager;
  private apiManager: ApiManager;

  constructor() {
    // I guess this is the .c of the __init__ method in Python 😭
    this.dbManager = new DatabaseManager(Zotero.DataDirectory.dir);
    this.apiManager = new ApiManager(
      "https://api.openalex.org/",
      "raymond.w.jang@gmail.com"
    );
  }

  private log(msg: string): void {
    Zotero.log(`Reference Network (reference-network.ts): ${msg}`);
  }

  private error(msg: string, e: Error): void {
    Zotero.logError(e);
  }

  async init(options: InitOptions): Promise<void> {
    this.log("Loading ReferenceNetwork: starting...");
    if (this.initialized) {
      throw new Error("ReferenceNetwork is already running");
    }
    this.id = options.id;
    this.version = options.version;
    this.rootURI = options.rootURI;

    await this.dbManager.initializeDatabase();

    this.log("Grabbing all DOI's from Zotero...");
    const dois = await Zotero.DB.columnQueryAsync(queries.getDOIs);
    this.log(
      "DOI's grabbed: " + dois.length + "\nexamples: " + dois.slice(0, 5)
    );

    try {
      const data = await this.apiManager.fetchDOIs(dois, 25);
      this.log(`Data length is: ${Object.keys(data[0]).length}`);
      this.log(`Data: ${JSON.stringify(data[0].meta)}`);
    } catch (e) {
      this.error("Failed to fetch DOIs", e);
    }

    this.initialized = true;
  }
}

function main() {
  const { host } = new URL("https://foo.com/path");
  this.log(`Host is ${host}`);
  this.log(
    `Main called with ID: ${this.id}, Version: ${this.version}, Root URI: ${this.rootURI}`
  );
}
