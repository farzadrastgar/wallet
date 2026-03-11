import "reflect-metadata";
import { DataSource } from "typeorm";
import log from "./logger";
import { User } from "../models/User";
import { Wallet } from "../models/Wallet";
import { Transaction } from "../models/Transaction";

// Use a single DATABASE_URL environment variable
// Example: postgres://user:password@host:5432/wallet_db
const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  log.error("DATABASE_URL environment variable is not set");
  process.exit(1);
}

export const AppDataSource = new DataSource({
  type: "postgres",
  url: DATABASE_URL,
  entities: [User, Wallet, Transaction],
  synchronize: true, // auto-create tables, good for dev/prototype
  logging: false,
});

async function connectDB() {
  try {
    await AppDataSource.initialize();
    log.success("Connected to PostgreSQL database via URL");
  } catch (err) {
    log.error("Database connection failed:" + err);
    process.exit(1);
  }
}

export default connectDB;