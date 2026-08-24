import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5433,
  username: "postgres",
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_DATABASE!,
  synchronize: true,
  logging: true,
  logger: "advanced-console",
  entities: ["src/entities/*.ts"],
});
