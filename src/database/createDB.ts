import { AuthorItemLink } from "./entity/authorItem";
import { Graph } from "./entity/graphs";
import { Item } from "./entity/Items";
import { Author } from "./entity/authors";
import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [Item, Author, AuthorItemLink, Graph],
  migrations: [],
  subscribers: [],
});

AppDataSource.initialize()
  .then(() => {
    console.log("Connected to the database!");

    // Add additional setup or testing code here
  })
  .catch((error) =>
    console.log("Error during Data Source initialization:", error)
  );
