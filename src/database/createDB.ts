import "reflect-metadata";
import { DataSource } from "typeorm";
import { Item } from "./entity/Items";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [Item],
  migrations: [],
  subscribers: [],
});
