import { SQL_CREATE_TABLES } from "./entities";
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
    await Zotero.DB.queryAsync("ATTACH DATABASE ? AS reference_network", [
      this.dbPath,
    ]);
    this.log(`Database attached from ${this.dbPath}`);

    // Check for existing tables and create if necessary
  }

  private async checkTableExists(
    schemaName: string,
    tableName: string
  ): Promise<boolean> {
    return await Zotero.DB.valueQueryAsync(
      `SELECT COUNT(*) FROM ${schemaName}.sqlite_master WHERE type='table' AND name='${tableName}'`
    );
  }

  private async dropTable(
    schemaName: string,
    tableName: string
  ): Promise<void> {
    this.log(`Dropping ${tableName} table...`);
    await Zotero.DB.queryAsync(`DROP TABLE ${schemaName}.${tableName};`);
  }

  private async createTable(
    schemaName: string,
    tableName: string
  ): Promise<void> {
    this.log(`Creating ${tableName} table...`);
    await Zotero.DB.queryAsync(entities[tableName]);
    this.log(`${tableName} created`);
  }

  private async forceCreateTable(
    schemaName: string,
    tableName: string
  ): Promise<void> {
    if (await this.checkTableExists(schemaName, tableName)) {
      await this.dropTable(schemaName, tableName);
    }
    await this.createTable(schemaName, tableName);
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

  async getGraphRows(): Promise<any[]> {
    return await Zotero.DB.queryAsync("SELECT * FROM referencenetwork.graphs");
  }

  async getGraphRow(id: number): Promise<any> {
    return await Zotero.DB.queryAsync(
      "SELECT * FROM referencenetwork.graphs WHERE id = ?",
      [id]
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
