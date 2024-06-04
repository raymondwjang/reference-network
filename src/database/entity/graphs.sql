CREATE TABLE IF NOT EXISTS graph (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source TEXT,
    type TEXT,
    target TEXT,
    data_source TEXT
);