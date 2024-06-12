import { DatabaseManager } from "./database/databaseManager";
import { ApiManager } from "./database/apiManager";
import { queries } from "./database/queries";

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
    Zotero.log(msg, "warning", "Reference Network: reference-network.ts");
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

    const referencedWorks: Record<string, string[]> = {};
    const relatedWorks: Record<string, string[]> = {};
    const citedByURL: Record<string, string> = {};

    try {
      // test mode
      const testDOIs = dois.slice(0, 5);
      const fetchedData = await this.apiManager.fetchReferences(testDOIs, 25);
      for (const batch of fetchedData) {
        batch.results.forEach((result: any) => {
          const id = this.getLastSlashComponent(result.id);
          referencedWorks[id] = result.referenced_works.map((url: string) =>
            this.getLastSlashComponent(url)
          );
          relatedWorks[id] = result.related_works.map((url: string) =>
            this.getLastSlashComponent(url)
          );
          citedByURL[id] = result.cited_by_api_url;
        });
      }
      this.log(`References: ${JSON.stringify(referencedWorks)}`);
    } catch (e) {
      this.error("Failed to fetch DOIs", e);
    }

    // This should only run when the user calls the "fetchCitedBy" method.
    // Otherwise, it will make too many requests to OpenAlex.
    // const citedBy: Record<string, string[]> = {};
    // try {
    //   for (const [id, url] of Object.entries(citedByURL)) {
    //     const response = await this.apiManager.fetchCitedBy(id, url);
    //     citedBy[id] = response.results.map((result: { id: string }) =>
    //       this.getLastSlashComponent(result.id)
    //     );
    //   }
    //   this.log(`Cited by: ${JSON.stringify(citedBy)}`);
    // } catch (e) {
    //   this.error("Failed to fetch cited by", e);
    // }

    this.initialized = true;
  }

  private getLastSlashComponent(url: string): string {
    return url.substring(url.lastIndexOf("/") + 1);
  }
}

function main() {
  const { host } = new URL("https://foo.com/path");
  Zotero.log(`Host is ${host}`);
  Zotero.log(
    `Main called with ID: ${this.id}, Version: ${this.version}, Root URI: ${this.rootURI}`
  );
}
