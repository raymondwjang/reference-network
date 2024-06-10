import { Shim } from "../environment/os";

export class DatabaseManager {
  private dir: string;
  private dbPath: string;

  constructor(private rootDir: string) {
    this.dir = Shim.Path.join(Zotero.DataDirectory.dir, "reference-network");
    this.dbPath = Shim.Path.join(this.dir, "reference-network.sqlite");
  }

  async initializeDatabase(): Promise<void> {
    // Ensure directory exists
    Shim.File.makeDir(this.dir, { ignoreExisting: true });
    Zotero.log(`Directory created at ${this.dir}`);

    // Attach database
    await Zotero.DB.queryAsync("ATTACH DATABASE ? AS referencenetwork", [
      this.dbPath,
    ]);
    Zotero.log(`Database attached from ${this.dbPath}`);

    // Check for existing tables and create if necessary
    await this.createGraphTable();
  }

  private async createGraphTable(): Promise<void> {
    const exists = await Zotero.DB.valueQueryAsync(
      "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='graph';"
    );

    if (exists) {
      Zotero.log("Graph table exists");
      await Zotero.DB.queryAsync("DROP TABLE referencenetwork.graph");
      Zotero.log("Graph table dropped");
    }

    Zotero.log("Creating Graph table...");
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
    Zotero.log("Graph table created");
  }

  async addGraphRow(
    source: string,
    type: string,
    target: string,
    dataSource: string
  ): Promise<void> {
    await Zotero.DB.queryAsync(
      `
            INSERT INTO referencenetwork.graph (source, type, target, data_source)
            VALUES (?, ?, ?, ?);
        `,
      [source, type, target, dataSource]
    );
  }

  async getGraphRows(): Promise<any[]> {
    return await Zotero.DB.queryAsync("SELECT * FROM referencenetwork.graph");
  }

  async getGraphRow(id: number): Promise<any> {
    return await Zotero.DB.queryAsync(
      "SELECT * FROM referencenetwork.graph WHERE id = ?",
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
            UPDATE referencenetwork.graph
            SET source = ?, type = ?, target = ?, data_source = ?
            WHERE id = ?;
        `,
      [source, type, target, dataSource, id]
    );
  }

  async deleteGraphRow(id: number): Promise<void> {
    await Zotero.DB.queryAsync(
      "DELETE FROM referencenetwork.graph WHERE id = ?",
      [id]
    );
  }

  async deleteGraphRows(): Promise<void> {
    await Zotero.DB.queryAsync("DELETE FROM referencenetwork.graph");
  }
}
