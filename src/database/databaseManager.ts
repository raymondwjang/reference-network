import {
  DATABASE_NAMES,
  TABLE_NAMES,
  DDL_QUERIES,
  CRUD,
  DatabaseNameKey,
  TableNameKey,
} from "./entities";
import { Shim } from "../environment/os";

export class DatabaseManager {
  private dir: string;
  private dbPath: string;

  constructor(private rootDir: string) {
    this.dir = Shim.Path.join(Zotero.DataDirectory.dir, "weaver");
    this.dbPath = Shim.Path.join(this.dir, "weaver.sqlite");
  }

  private log(msg: string): void {
    Zotero.log(msg, "warning", "Weaver: databaseManager.ts");
  }

  async initializeDatabase(): Promise<void> {
    // Ensure directory exists
    Shim.File.makeDir(this.dir, { ignoreExisting: true });
    this.log(`Directory created at ${this.dir}`);

    // Attach database
    await Zotero.DB.queryAsync(
      `ATTACH DATABASE ? AS ${DATABASE_NAMES.WEAVER}`,
      [this.dbPath]
    );
    this.log(`Database attached from ${this.dbPath}`);

    // Check for existing tables and create if necessary
    for (const tableName of Object.values(TABLE_NAMES)) {
      await this.createTable(DATABASE_NAMES.WEAVER, tableName);
    }
  }

  private async checkTableExists(
    databaseName: string,
    tableName: string
  ): Promise<boolean> {
    return await Zotero.DB.valueQueryAsync(
      `SELECT COUNT(*) FROM ${databaseName}.sqlite_master WHERE type='table' AND name='${tableName}'`
    );
  }

  private async dropTable(
    databaseName: string,
    tableName: string
  ): Promise<void> {
    this.log(`Dropping ${tableName} table...`);
    await Zotero.DB.queryAsync(`DROP TABLE ${databaseName}.${tableName};`);
  }

  private async createTable(
    databaseName: string,
    tableName: string
  ): Promise<void> {
    if (await this.checkTableExists(databaseName, tableName)) {
      this.log(`${tableName} table already exists`);
      return;
    }

    this.log(`Creating ${tableName} table...`);
    await Zotero.DB.queryAsync(DDL_QUERIES[tableName]);
    this.log(`${tableName} created`);
  }

  async insert(
    tableName: TableNameKey,
    columns: string,
    values: string
  ): Promise<void> {
    await Zotero.DB.queryAsync(CRUD.INSERT(tableName, columns, values));
  }

  async select(
    tableName: TableNameKey,
    columns: string,
    condition: string
  ): Promise<any[]> {
    return await Zotero.DB.queryAsync(
      CRUD.SELECT(tableName, columns, condition)
    );
  }

  async update(
    tableName: TableNameKey,
    columnValuePairs: string,
    condition?: string
  ): Promise<void> {
    await Zotero.DB.queryAsync(
      CRUD.UPDATE(tableName, columnValuePairs, condition)
    );
  }

  async delete(tableName: TableNameKey, condition: string): Promise<void> {
    await Zotero.DB.queryAsync(CRUD.DELETE(tableName, condition));
  }

  async upsert(
    tableName: TableNameKey,
    columns: string,
    values: string,
    condition: string
  ): Promise<void> {
    const rows = await this.select(tableName, columns, condition);
    if (rows.length === 0) {
      await this.insert(tableName, columns, values);
    } else {
      const columnValuePairs = columns
        .split(", ")
        .map((column, i) => `${column} = ${values.split(", ")[i]}`)
        .join(", ");
      await this.update(tableName, columnValuePairs, condition);
    }
  }
}
