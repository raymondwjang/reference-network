CREATE TABLE IF NOT EXISTS author_item_link (
    creatorID INTEGER,
    itemID INTEGER,
    PRIMARY KEY (creatorID, itemID),
    FOREIGN KEY (creatorID) REFERENCES authors (creatorID),
    FOREIGN KEY (itemID) REFERENCES items (itemID)
);