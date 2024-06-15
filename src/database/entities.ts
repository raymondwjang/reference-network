export const DATABASE_NAMES = {
  WEAVER: "weaver",
};

export const TABLE_NAMES = {
  GRAPHS: `graphs`,
  ITEMS: `items`,
};

export const DDL_QUERIES = {
  [TABLE_NAMES.GRAPHS]: `
    CREATE TABLE IF NOT EXISTS ${DATABASE_NAMES.WEAVER}.${TABLE_NAMES.GRAPHS} (
      id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      source TEXT,
      target TEXT,
      type TEXT check(type = "related_to" or type = "cites"),
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
