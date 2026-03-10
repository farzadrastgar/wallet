import "reflect-metadata";
import { DataSource } from "typeorm";
import log from "./logger";
import { User } from "../models/User";
import { Wallet } from "../models/Wallet";
// import other entities like Wallet, Transaction if needed

const { POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } = process.env;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: POSTGRES_HOST || "localhost",
  port: POSTGRES_PORT ? parseInt(POSTGRES_PORT) : 5432,
  username: POSTGRES_USER || "user",
  password: POSTGRES_PASSWORD || "password",
  database: POSTGRES_DB || "wallet_db",
  entities: [User, Wallet], // add all your entities here
  synchronize: true, // auto-create tables, good for dev/prototype
  logging: false,
});

async function connectDB() {
  try {
    await AppDataSource.initialize();
    log.success("Connected to PostgreSQL database");
  } catch (err) {
    log.error("Database connection failed:" + err);
    process.exit(1);
  }
}

export default connectDB;