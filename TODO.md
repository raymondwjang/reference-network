# DB Schema

- graph
  - id INTEGER PRIMARY KEY AUTOINCREMENT
  - source TEXT
  - type TEXT
  - target TEXT
  - data_source TEXT

- items
  - itemID INTEGER PRIMARY KEY
  - updated_datetime DATETIME

- authors
  - creatorID INTEGER PRIMARY KEY
  - ORCID TEXT
  - name TEXT

- author_item_link
  - creatorID INTEGER
  - itemID INTEGER
  - FOREIGN KEY(creatorID) REFERENCES authors(creatorID)
  - FOREIGN KEY(itemID) REFERENCES items(itemID)
  - PRIMARY KEY (creatorID, itemID)

# TODOs

- shell of the extension
  - lifecycle methods/hooks: https://github.com/zotero/make-it-red/blob/main/src-2.0/bootstrap.js
- dependencies
  - vendor - LocalCitationNetwork - https://github.com/LocalCitationNetwork/LocalCitationNetwork.github.io/tree/master
  - vue.js (and friends)
- adapt cita
  - menus
- launch graph from single item
  - do initial query for single item to populate references
  - async iter the references
  - update graph as retrieved
