import { DataSource } from "typeorm";

export = new DataSource({
  type: "postgres",
  username: "postgres",
  port: 5432,
  host: "localhost",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ["dist/**/*.entity.js"],
  migrations: ["dist/migrations/*.js"],
})