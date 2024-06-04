import { Shim } from "./environment/os";
import { is7 } from "./environment/client";
// import { AppDataSource } from "./database/createDB";
import { join } from "path";
import ZoteroToolkit from "zotero-plugin-toolkit";
/* Alternatively, import class you need to minify the plugin size
 * ```ts
 * import { BasicTool } from "zotero-plugin-toolkit/dist/basic";
 * import { UITool } from "zotero-plugin-toolkit/dist/tools/ui";
 */
const ztoolkit = new ZoteroToolkit();
ztoolkit.log("This is Zotero:", ztoolkit.getGlobal("Zotero"));

const $OS = is7 ? Shim : OS;

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
    await Zotero.DB.queryAsync("ATTACH DATABASE ? AS referencenetwork", [
      $OS.Path.join(Zotero.DataDirectory.dir, "reference-network.sqlite"),
    ]);
    const tables: Record<string, boolean> = {};
    for (const table of await Zotero.DB.columnQueryAsync(
      `SELECT LOWER(REPLACE(name, '-', ''))
    FROM referencenetwork.sqlite_master
    WHERE type = 'table';`
    )) {
      tables[table] = true;
    }

    if (tables.graph) {
      this.log("Graph table exists");
      await Zotero.DB.queryAsync("DROP TABLE referencenetwork.graph");
      this.log("Graph table dropped");
      delete tables.graph;
    }

    // Generate a Graph Table and add a few rows
    if (!tables.graph) {
      this.log("Creating Graph table...");
      await Zotero.DB.queryAsync(`
      CREATE TABLE referencenetwork.graph (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source TEXT,
        type TEXT,
        target TEXT,
        data_source TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
      this.log("Graph table created");
    }
    // if graphs table is empty, add some rows
    if (
      (await Zotero.DB.valueQueryAsync(
        "SELECT COUNT(*) FROM referencenetwork.graph"
      )) === 0
    ) {
      this.log("Adding rows to Graph table...");
      await Zotero.DB.queryAsync(`
      INSERT INTO referencenetwork.graph (source, type, target, data_source)
      VALUES ('source1', 'type1', 'target1', 'data_source1');
    `);
      await Zotero.DB.queryAsync(`
      INSERT INTO referencenetwork.graph (source, type, target, data_source)
      VALUES ('source2', 'type2', 'target2', 'data_source2');
    `);
      await Zotero.DB.queryAsync(`
      INSERT INTO referencenetwork.graph (source, type, target, data_source)
      VALUES ('source3', 'type3', 'target3', 'data_source3');
    `);
      this.log("Rows added to Graph table");
    }

    // for (const ddl of sqlStatements) {
    // await connection.query(ddl);
    // }

    // this.db = new Zotero.DBConnection("referencenetwork");
    // AppDataSource.initialize()
    //   .then(() => {
    //     console.log("Connected to the database!");

    //     // Add additional setup or testing code here
    //   })
    //   .catch((error) =>
    //     console.log("Error during Data Source initialization:", error)
    //   );
    // this.log("Database attached");

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
