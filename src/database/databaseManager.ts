import Dexie from "dexie";
import { DATABASE_NAMES, TABLE_NAMES, DDL_QUERIES } from "./entities";
import { Shim } from "../environment/os";

export class DatabaseManager {
  private dir: string;
  private dbPath: string;

  constructor(private rootDir: string) {
    this.dir = Shim.Path.join(Zotero.DataDirectory.dir, "reference-network");
    this.dbPath = Shim.Path.join(this.dir, "reference-network.sqlite");
  }

  private log(msg: string): void {
    Zotero.log(msg, "warning", "Reference Network: databaseManager.ts");
  }

  async initializeDatabase(): Promise<void> {
    // Ensure directory exists
    Shim.File.makeDir(this.dir, { ignoreExisting: true });
    this.log(`Directory created at ${this.dir}`);

    // Attach database
    await Zotero.DB.queryAsync(
      `ATTACH DATABASE ? AS ${DATABASE_NAMES.REFERENCE_NETWORK}`,
      [this.dbPath]
    );
    this.log(`Database attached from ${this.dbPath}`);

    // Create a new instance of Dexie
    const db = new Dexie("MyDatabase");

    // Define a schema for the database
    db.version(1).stores({
      friends: "++id, name, age", // `friends` is the name of the table
    });

    // Check for existing tables and create if necessary
  }

  private checkDDLExists(databaseName: string, tableName: string) {
    // make sure databaseName and tablename are in databasenames and tablenames
    if (!Object.values(DATABASE_NAMES).includes(databaseName)) {
      throw new Error(`Invalid schema name: ${databaseName}`);
    }
    if (!Object.values(TABLE_NAMES).includes(tableName)) {
      throw new Error(`Invalid table name: ${tableName}`);
    }
  }

  private async checkTableExists(
    databaseName: string,
    tableName: string
  ): Promise<boolean> {
    this.checkDDLExists(databaseName, tableName);
    return await Zotero.DB.valueQueryAsync(
      `SELECT COUNT(*) FROM ${databaseName}.sqlite_master WHERE type='table' AND name='${tableName}'`
    );
  }

  private async dropTable(
    databaseName: string,
    tableName: string
  ): Promise<void> {
    this.checkDDLExists(databaseName, tableName);
    this.log(`Dropping ${tableName} table...`);
    await Zotero.DB.queryAsync(`DROP TABLE ${databaseName}.${tableName};`);
  }

  private async createTable(
    databaseName: string,
    tableName: string
  ): Promise<void> {
    this.checkDDLExists(databaseName, tableName);
    this.log(`Creating ${tableName} table...`);
    await Zotero.DB.queryAsync(DDL_QUERIES[tableName]);
    this.log(`${tableName} created`);
  }

  private async recreateTable(
    databaseName: string,
    tableName: string
  ): Promise<void> {
    this.checkDDLExists(databaseName, tableName);
    if (await this.checkTableExists(databaseName, tableName)) {
      await this.dropTable(databaseName, tableName);
    }
    await this.createTable(databaseName, tableName);
  }

  async addGraphRow(
    source: string,
    type: string,
    target: string,
    dataSource: string
  ): Promise<void> {
    await Zotero.DB.queryAsync(
      `
            INSERT INTO referencenetwork.graphs (source, type, target, data_source)
            VALUES (?, ?, ?, ?);
        `,
      [source, type, target, dataSource]
    );
  }

  async updateGraphRow(
    id: number,
    source: string,
    type: string,
    target: string,
    dataSource: string
  ): Promise<void> {
    await Zotero.DB.queryAsync(
      `
            UPDATE referencenetwork.graphs
            SET source = ?, type = ?, target = ?, data_source = ?
            WHERE id = ?;
        `,
      [source, type, target, dataSource, id]
    );
  }

  async deleteGraphRow(id: number): Promise<void> {
    await Zotero.DB.queryAsync(
      "DELETE FROM referencenetwork.graphs WHERE id = ?",
      [id]
    );
  }

  async deleteGraphRows(): Promise<void> {
    await Zotero.DB.queryAsync("DELETE FROM referencenetwork.graphs");
  }
}
