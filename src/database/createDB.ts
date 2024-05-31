// import { AuthorItemLink } from "./entity/authorItem";
import { Graph } from "./entity/graphs";
// import { Item } from "./entity/Items";
// import { Author } from "./entity/authors";
import "reflect-metadata";
import { DataSource } from "typeorm";

Zotero.log("Reference Network (createDB.ts): Creating database...");

export const AppDataSource = null;
// export const AppDataSource = new DataSource({
//   type: "sqlite",
//   database: "database.sqlite",
//   synchronize: true,
//   logging: false,
//   entities: [Graph],
//   // entities: [Item, Author, AuthorItemLink, Graph],
//   migrations: [],
//   subscribers: [],
// });
