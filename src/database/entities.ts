export const DATABASE_NAMES = {
  WEAVER: "weaver",
};

export const TABLE_NAMES = {
  GRAPHS: `graphs`,
  ITEMS: `items`,
  REFERENCED_WORKS: `referenced_works`,
  RELATED_WORKS: `related_works`,
  CITED_BY: `cited_by`,
};

export const DDL_QUERIES = {
  [TABLE_NAMES.GRAPHS]: `
    CREATE TABLE IF NOT EXISTS ${DATABASE_NAMES.WEAVER}.${TABLE_NAMES.GRAPHS} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source TEXT,
      type TEXT,
      target TEXT,
      data_source TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `,
  [TABLE_NAMES.ITEMS]: `
    CREATE TABLE IF NOT EXISTS ${DATABASE_NAMES.WEAVER}.${TABLE_NAMES.ITEMS} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      zotero_item_id TEXT,
      openalex_id TEXT,
      doi TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `,
  [TABLE_NAMES.REFERENCED_WORKS]: `
    CREATE TABLE IF NOT EXISTS ${DATABASE_NAMES.WEAVER}.${TABLE_NAMES.REFERENCED_WORKS} (
      id TEXT PRIMARY KEY,
      item_id TEXT,
      cites TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `,
  [TABLE_NAMES.RELATED_WORKS]: `
    CREATE TABLE IF NOT EXISTS ${DATABASE_NAMES.WEAVER}.${TABLE_NAMES.RELATED_WORKS} (
      id TEXT PRIMARY KEY,
      item_id TEXT,
      is_related_to TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `,
  [TABLE_NAMES.CITED_BY]: `
    CREATE TABLE IF NOT EXISTS ${DATABASE_NAMES.WEAVER}.${TABLE_NAMES.CITED_BY} (
      id TEXT PRIMARY KEY,
      item_id TEXT,
      cited_by TEXT,
      citer_in_library BOOLEAN,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `,
};
