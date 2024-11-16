import "reflect-metadata";
import { DataSource } from "typeorm";

import { User } from "../entities/User.entity";
import { Transactions } from "../entities/Transactions";
import { Category } from "../entities/Category";
import { Accounts } from "../entities/Accounts";
import { RefreshToken } from "../entities/RefreshToken";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST ?? "localhost",
  port: parseInt(process.env.DB_PORT!) ?? 3000,
  username: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME ?? "test",
  synchronize: process.env.NODE_ENV == "development",
  logging: true,
  entities: [User, Transactions, Category, Accounts, RefreshToken],
  subscribers: [],
  migrations: [],
});
