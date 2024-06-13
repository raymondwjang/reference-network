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

  async init(options: InitOptions): Promise<void> {
    this.log("Loading Weaver: starting...");
    if (this.initialized) {
      throw new Error("Weaver is already running");
    }
    this.id = options.id;
    this.version = options.version;
    this.rootURI = options.rootURI;

    // from here, it must be initiated by a user action

    // await this.dbManager.initializeDatabase();

    // this.log("Grabbing all DOI's from Zotero...");
    // const dois = await Zotero.DB.columnQueryAsync(queries.getDOIs);
    // this.log(
    //   "DOI's grabbed: " + dois.length + "\nexamples: " + dois.slice(0, 5)
    // );

    // const referencedWorks: Record<string, string[]> = {};
    // const relatedWorks: Record<string, string[]> = {};
    // const citedByURL: Record<string, string> = {};

    // try {
    //   // test mode
    //   const testDOIs = dois.slice(0, 5);
    //   const fetchedData = await this.apiManager.fetchReferences(testDOIs, 25);
    //   for (const batch of fetchedData) {
    //     batch.results.forEach((result: any) => {
    //       const id = this.getLastSlashComponent(result.id);
    //       referencedWorks[id] = result.referenced_works.map((url: string) =>
    //         this.getLastSlashComponent(url)
    //       );
    //       relatedWorks[id] = result.related_works.map((url: string) =>
    //         this.getLastSlashComponent(url)
    //       );
    //       citedByURL[id] = result.cited_by_api_url;
    //     });
    //   }
    //   this.log(`References: ${JSON.stringify(referencedWorks)}`);
    // } catch (e) {
    //   this.error("Failed to fetch DOIs", e);
    // }

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

  static addToWindow(window: Window) {
    const doc = window.document;

    // // Add a stylesheet to the main Zotero pane
    // let link1 = doc.createElement('link');
    // link1.id = 'make-it-red-stylesheet';
    // link1.type = 'text/css';
    // link1.rel = 'stylesheet';
    // link1.href = this.rootURI + 'style.css';
    // doc.documentElement.appendChild(link1);
    // this.storeAddedElement(link1);

    // Use Fluent for localization
    window.MozXULElement.insertFTLIfNeeded(
      rootURI + "/locale/en-US/weaver.ftl"
    );

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

  static menuToggleTest(a, b) {
    Zotero.log("Menu has been checked!");
  }

  addToAllWindows(): void {
    const windows: Window[] = Zotero.getMainWindows();
    for (const win of windows) {
      if (!win.ZoteroPane) continue;
      Weaver.addToWindow(win);
    }
  }
}
