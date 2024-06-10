export const entities = {
  authors: `
    CREATE TABLE IF NOT EXISTS referencenetwork.author (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ORCID TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    `,
  graphs: `
    CREATE TABLE IF NOT EXISTS referencenetwork.graph (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source TEXT,
        type TEXT,
        target TEXT,
        data_source TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    `,
  items: `
    CREATE TABLE IF NOT EXISTS referencenetwork.item (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        itemID TEXT,
        title TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    `,
  itemAuthors: `
    CREATE TABLE IF NOT EXISTS referencenetwork.item_author (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        itemID TEXT,
        authorID TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    `,
  itemData: `
    CREATE TABLE IF NOT EXISTS referencenetwork.item_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        itemID TEXT,
        fieldID TEXT,
        valueID TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    `,
  itemDataValues: `
    CREATE TABLE IF NOT EXISTS referencenetwork.item_data_values (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        value TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    `,
  itemFields: `
    CREATE TABLE IF NOT EXISTS referencenetwork.item_fields (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fieldName TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    `,
  itemTypes: `
    CREATE TABLE IF NOT EXISTS referencenetwork.item_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        typeName TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    `,
  libraries: `
    CREATE TABLE IF NOT EXISTS referencenetwork.library (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        libraryID TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    `,
  tags: `
    CREATE TABLE IF NOT EXISTS referencenetwork.tag (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tagID TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    `,
};
