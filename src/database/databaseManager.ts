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

    // Check for existing tables and create if necessary
    for (const tableName of Object.values(TABLE_NAMES)) {
      await this.createTable(DATABASE_NAMES.REFERENCE_NETWORK, tableName);
    }
  }

  private checkDDLExists(databaseName: string, tableName: string) {
    // make sure databaseName and tablename are in databasenames and tablenames
    if (!Object.values(DATABASE_NAMES).includes(databaseName)) {
      throw new Error(
        `database name must be one of ${Object.values(
          DATABASE_NAMES
        )}: ${databaseName}`
      );
    }
    if (!Object.values(TABLE_NAMES).includes(tableName)) {
      throw new Error(
        `table name must be one of ${Object.values(TABLE_NAMES)}: ${tableName}`
      );
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
    if (await this.checkTableExists(databaseName, tableName)) {
      this.log(`${tableName} table already exists`);
      return;
    }

    this.log(`Creating ${tableName} table...`);
    await Zotero.DB.queryAsync(DDL_QUERIES[tableName]);
    this.log(`${tableName} created`);
  }

  private async purgeTable(
    databaseName: string,
    tableName: string
  ): Promise<void> {
    this.checkDDLExists(databaseName, tableName);
    if (!(await this.checkTableExists(databaseName, tableName))) {
      throw new Error(`${tableName} table does not exist`);
    }
    await this.dropTable(databaseName, tableName);
    await this.createTable(databaseName, tableName);
  }
}
