// import { Components } from "../lib";
import * as fs from "fs";

declare global {
  var Components: any;
}

let Zotero = Components.classes["@zotero.org/Zotero;1"].getService(
  Components.interfaces.nsISupports
).wrappedJSObject;

let schemaFiles = [
  "graph.sql",
  "items.sql",
  "authors.sql",
  "author_item_link.sql",
];
let schemaPath = __dirname + "/schema/";
let schemaQuery = "";
for (let file of schemaFiles) {
  schemaQuery += fs.readFileSync(schemaPath + file, "utf8");
}

console.log(schemaQuery);

async function createDatabase() {
  let db = new Zotero.DBConnection("reference-network");

  // Check if the database connection is opened successfully
  if (db) {
    Zotero.debug("Database connected successfully.");
  } else {
    Zotero.debug("Failed to connect to the database.");
    return;
  }

  try {
    await db.queryAsync(schemaQuery);
    Zotero.debug("Database schema created successfully.");
  } catch (error) {
    Zotero.debug("Error creating database schema: " + error);
  }

  // Check the database schema
  let schema = await db.queryAsync(
    "SELECT name FROM sqlite_master WHERE type='table';"
  );
  console.log(schema);

  db.close();
}

createDatabase().catch((err) => Zotero.debug(err));
