export const DATABASE_NAMES = {
  WEAVER: "weaver",
} as const;

export const TABLE_NAMES = {
  GRAPHS: `graphs`,
  ITEMS: `items`,
} as const;

export type DatabaseNameKey = keyof typeof DATABASE_NAMES;
export type TableNameKey = keyof typeof TABLE_NAMES;

export const DDL_QUERIES = {
  [TABLE_NAMES.GRAPHS]: `
    CREATE TABLE IF NOT EXISTS ${DATABASE_NAMES.WEAVER}.${TABLE_NAMES.GRAPHS} (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      source TEXT NOT NULL,
      target TEXT NOT NULL,
      type TEXT check(type = "related_to" or type = "cites") NOT NULL,
      data_source TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `,
  [TABLE_NAMES.ITEMS]: `
    CREATE TABLE IF NOT EXISTS ${DATABASE_NAMES.WEAVER}.${TABLE_NAMES.ITEMS} (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      zotero_item_id TEXT,
      openalex_id TEXT,
      doi TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `,
};

export const ISUD = {
  INSERT: (tableName: TableNameKey, columns: string, values: string) =>
    `INSERT INTO ${DATABASE_NAMES.WEAVER}.${TABLE_NAMES[tableName]} (${columns}) VALUES (${values});`,
  SELECT: (tableName: TableNameKey, columns: string, condition?: string) => {
    if (condition) {
      `SELECT ${columns} FROM ${DATABASE_NAMES.WEAVER}.${TABLE_NAMES[tableName]} WHERE ${condition};`;
    } else {
      `SELECT ${columns} FROM ${DATABASE_NAMES.WEAVER}.${TABLE_NAMES[tableName]}`;
    }
  },
  UPDATE: (
    tableName: TableNameKey,
    columnValuePairs: string,
    condition?: string
  ) =>
    `UPDATE ${DATABASE_NAMES.WEAVER}.${TABLE_NAMES[tableName]} SET ${columnValuePairs} WHERE ${condition};`,
  DELETE: (tableName: TableNameKey, condition: string) =>
    `DELETE FROM ${DATABASE_NAMES.WEAVER}.${TABLE_NAMES[tableName]} WHERE ${condition};`,
};
