import { DatabaseManager } from "./database/databaseManager";
import { ApiManager } from "./database/apiManager";
import { queries } from "./database/queries";

// Define an interface for initialization options
interface InitOptions {
  id: string;
  version: string;
  rootURI: string;
}

export class Weaver {
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
    Zotero.log(msg, "warning", "Weaver: weaver.ts");
  }

  private error(msg: string, e: Error): void {
    Zotero.logError(e);
  }

  async install(): Promise<void> {
    await this.dbManager.initializeDatabase();
  }

  async init(options: InitOptions): Promise<void> {
    this.log("Loading Weaver: starting...");
    if (this.initialized) {
      throw new Error("Weaver is already running");
    }
    this.id = options.id;
    this.version = options.version;
    this.rootURI = options.rootURI;

    // from here, it must be initiated by a user action
    try {
      const libraryID = 1;
      this.log("point 1");
      const ZoteroIdDoi = await this.grabAllDOIs(libraryID);
      this.log("point 2");

      const dois = ZoteroIdDoi.map((row) => row.doi);
      const data = await this.fetchAndParseCitations(dois);
      // cited = await fetchCitedBy(fetchCitedBy);
      data["idDoiPair"] = ZoteroIdDoi;
      this.log("point 3");

      await this.populateItemsTable(data);
    } catch (error) {
      this.error("Failed to grab all DOIs", error);
    }

    this.initialized = true;
  }

  private async populateItemsTable(data: object): Promise<void> {
    // upsert into items table
    const referencesDOIs = this.getUniqueElements(data["referencedWorks"]);
    const relatedDOIs = this.getUniqueElements(data["realatedWorks"]);

    // combine the sets
    const allDOIs = new Set([...referencesDOIs, ...relatedDOIs]);

    for (const doi of allDOIs) {
      await this.dbManager.upsert(
        "ITEMS",
        `zotero_item_id, openalex_id, doi`,
        `${null}, ${null}, ${doi}`,
        `doi = ${doi}`
      );
    }
    for (const idDoiPair of data["idDoiPair"]) {
      await this.dbManager.upsert(
        "ITEMS",
        `zotero_item_id, openalex_id, doi`,
        `${idDoiPair.itemID}, ${null}, ${idDoiPair.doi}`,
        `doi = ${idDoiPair.doi}`
      );
    }
  }

  private getUniqueElements(record: Record<string, string[]>): Set<string> {
    // Extract keys
    const keys = Object.keys(record);

    // Flatten values
    const values = Object.values(record).flat();

    // Combine keys and values
    const combined = keys.concat(values);

    // Create a Set to automatically remove duplicates
    return new Set(combined);
  }

  private async grabAllDOIs(libraryID: number = 1): Promise<any[]> {
    this.log("Grabbing all DOI's from Zotero...");
    const query = queries.getDOIs(libraryID);
    try {
      const idDOI = await Zotero.DB.queryAsync(query);
      this.log(
        `DOI's grabbed: ${idDOI.length}\nexamples: ${idDOI.slice(0, 5)}`
      );
      return idDOI;
    } catch (e) {
      this.error(`Failed to grab DOIs: `, e);
      throw e;
    }
  }

  private async fetchAndParseCitations(dois: string[]): Promise<object> {
    this.log("Fetching and parsing citations...");
    const referencedWorks: Record<string, string[]> = {};
    const relatedWorks: Record<string, string[]> = {};
    const citedByURL: Record<string, string> = {};

    try {
      // test mode
      const testDOIs = dois.slice(0, 5);
      const fetchedData = await this.apiManager.fetchPublications(testDOIs, 25);
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
    return {
      referencedWorks: referencedWorks,
      relatedWorks: relatedWorks,
      citedByURL: citedByURL,
    };
  }

  private async fetchCitedBy(citedByURL: string[]): Promise<void> {
    const citedBy: Record<string, string[]> = {};
    try {
      for (const [id, url] of Object.entries(citedByURL)) {
        const response = await this.apiManager.fetchCitedBy(id, url);
        citedBy[id] = response.results.map((result: { id: string }) =>
          this.getLastSlashComponent(result.id)
        );
      }
      this.log(`Cited by: ${JSON.stringify(citedBy)}`);
    } catch (e) {
      this.error("Failed to fetch cited by", e);
    }
  }

  private getLastSlashComponent(url: string): string {
    return url.substring(url.lastIndexOf("/") + 1);
  }

  public addToWindow(window: Window) {
    const doc = window.document;

    // Use Fluent for localization
    window.MozXULElement.insertFTLIfNeeded(
      this.rootURI + "locale/en-US/weaver.ftl"
    );
    this.log(this.rootURI + "locale/en-US/weaver.ftl");

    // Add menu option
    if (window.MozXULElement && "createXULElement" in window.document) {
      const menuitem = doc.createXULElement("menuitem");
      menuitem.id = "weaver-test-id";
      menuitem.setAttribute("type", "checkbox");
      menuitem.setAttribute("data-l10n-id", "weaver-test");
      menuitem.addEventListener("command", () => {
        const inputElement = menuitem as HTMLInputElement;
        this.menuToggleTest(window, inputElement.checked);
      });
      const menuViewPopup = doc.getElementById("menu_viewPopup");
      if (menuViewPopup) {
        menuViewPopup.appendChild(menuitem);
      }
      // this.storeAddedElement(menuitem);
    }
  }

  private menuToggleTest(a, b) {
    Zotero.log("Menu has been checked!");
  }

  public addToAllWindows(): void {
    const windows: Window[] = Zotero.getMainWindows();
    for (const win of windows) {
      if (!win.ZoteroPane) continue;
      this.addToWindow(win);
    }
  }
}

export const weaver = new Weaver();
