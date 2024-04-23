# DB Schema

- graph
  - source
  - type
  - target
  - data_source
  - id
- items
  - itemID
  - updated_datetime
- authors
  - creatorID
  - ORCID
  - name
- author-item link table

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
